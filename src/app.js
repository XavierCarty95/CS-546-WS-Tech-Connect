import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import methodOverride from 'method-override';
import fs from 'fs';
import exphbs from 'express-handlebars';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

import userRoutes from './api/user/user.routes.js';
import jobRoutes from './api/job/job.routes.js';
import savedHistoryRoutes from './api/saved_history/saved_history.routes.js';
import User from './api/user/user.model.js';
import * as userHandlers from "./api/user/user.handlers.js";
import * as validation from "./helpers/validators.js"

dotenv.config();

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

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Absolute path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Session middleware
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
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Routes
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

app.use('/user', isAuthenticated, userRoutes);
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

// Other routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post("/register", upload.fields([{ name: 'profilePic' }, { name: 'resume' }]), userHandlers.createUser);
app.post("/user/edit/:id", upload.fields([{ name: 'profilePic' }, { name: 'resume' }]), userHandlers.updateProfile);

app.get('/login', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role == 'recruiter') {
            return res.redirect('/user');
        } else {
            return res.redirect('/job');
        }
    } else {
        res.render('login', { 
            title: 'Login',
            showLogout: false
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation.validateEmail(email)
        // validation.validatePassword(password)

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.render(401).json("Error", { message: "Invalid credentials", status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.user = {
                firstname: user.firstname,
                lastname: user.lastname,
                id: user._id,
                role: user.role
            };

            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ message: "Error saving session", error: err });
                }

                if (user.role === 'recruiter') {
                    return res.redirect('/user');  // Redirect to the recruiter feed
                } else {
                    return res.redirect('/job');    // Redirect to the job feed
                }
            });
        } else {
            return res.render(401).json("error", { message: "Invalid credentials", status: 401 });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).render("error", { message: "Email or password incorrect", status: 404, isLogin: true });
    }
});

app.get('/register', (req, res) => {
    res.status(201).render('register', { title: 'Register' });
});

app.use('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out. Please try again.');
        }
        res.render('logout', { title: 'Logged Out' });
    });
});

export default app;