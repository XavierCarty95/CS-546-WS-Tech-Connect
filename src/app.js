import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
dotenv.config();
import bcrypt from 'bcryptjs'
import methodOverride from 'method-override';

import exphbs from 'express-handlebars';
import userRoutes from './api/user/user.routes.js';
import jobRoutes from './api/job/job.routes.js';
import savedHistoryRoutes from './api/saved_history/saved_history.routes.js';
import User from "./api/user/user.model.js";
import * as  userHandlers from "./api/user/user.handlers.js"
import multer from 'multer';

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

import connectDB from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Session middleware should be here, before routes
app.use(
    session({
        name: 'TechConnect',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1800000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }
    })
);


app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('Session ID:', req.sessionID);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Rewrite unsupported methods middleware
// app.use(rewriteUnsupportedBrowserMethods);

// Routes
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
}
app.use('/user',  isAuthenticated, userRoutes);
app.use('/job', isAuthenticated, jobRoutes);
app.use('/savedhistory', isAuthenticated, savedHistoryRoutes);

// View setup
app.set('views', path.join(__dirname, 'views'));
const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number')
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
            return new Handlebars.SafeString(JSON.stringify(obj));
        },
        partialsDir: ['views/partials/']
    }
});

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Routes for login, register, and logout
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post("/register", upload.fields([{ name: 'profilePic' }, { name: 'resume' }]), userHandlers.createUser);


app.get('/login', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role == 'recruiter') {
            return res.redirect('/user'); // Redirect to the user feed
        } else {
            return res.redirect('/job'); // Redirect to the job feed
        }
    } else {
        res.render('login', { 
            title: 'Login',
            showLogout: false // Only show "Tech Connect" in the navbar
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log("It came here")
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Set session
            req.session.user = {
                firstname: user.firstname,
                lastname: user.lastname,
                id: user._id,
                role: user.role
            };

            // Save session and redirect based on role
            req.session.save((err) => {
                if (err) {
                    console.error('Session Save Error:', err);
                    return res.status(500).json({ message: "Error saving session", error: err });
                }

                if (user.role === 'recruiter') {
                    return res.redirect('/user');  // Redirect to the recruiter feed
                } else {
                    return res.redirect('/job');    // Redirect to the job feed
                }
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Error logging in", error });
    }
});

app.get('/register', (req, res) => {
    res.status(201).render('register', { title: 'Register' });
});

app.use('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).send('Failed to log out. Please try again.');
        }

        // Render the logout page after session is destroyed
        res.render('logout', { title: 'Logged Out' });
    });
})

app.use('/public', express.static(path.join(__dirname, 'public')));

export default app;