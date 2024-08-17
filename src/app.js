import express  from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

//import { notFound, errorHandler } from './middlewares.js';
import exphbs from 'express-handlebars'
import userRoutes from './api/user/user.routes.js';
import jobRoutes from './api/job/job.routes.js'
import savedHistoryRoutes from './api/saved_history/saved_history.routes.js';
import connectDB from './db.js';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());




app.use('/user', userRoutes);
app.use('/job',jobRoutes);
app.use('/savedhistory',savedHistoryRoutes)
//app.use(notFound);
//app.use(errorHandler);

const rewriteUnsupportedBrowserMethods = (req,res,next) => { 
    if (req.body && req.body._method) { 
        req._method = req.body._method
        delete req.body._method
    }

    next();
}

app.set('views', path.join(__dirname, 'views'));
const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === 'number')
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      },
  
      partialsDir: ['views/partials/']
    }
  });

  app.get('/', (req, res) => {
    res.redirect('/login');
});

// app.use((req, res, next) => { 
//     // const currentTime = new Date().toUTCString()
//     // const requestMethod = req.method
//     // const requestRoute = req.originalUrl
//     // // const isAuthenticated = req.session.user ? 'Authenticated User' : ' Non-Authenticted User'

//     // console.log(`[${currentTime}]: ${requestMethod} ${requestRoute} (${isAuthenticated})`)

//     if (req.path === '/') { 
//         // if(req.session.user) { 
//         //     if(req.session.user.role === 'admin') { 
//         //         return res.redirect('/admin')
//         //     } else if (req.session.user.role === 'user') { 
//         //         return res.redirect('/user')
//         //     }
//         // } else { 
//         //     return res.redirect('/login')
//         // }
//         next()
//     }

// })

app.use('/login', (req,res,next) => { 
    // if(req.session.user) { 
    //     if(req.session.user.role === 'admin') {
    //         return res.redirect('/admin')
    //     } else if (req.session.user.role === 'user') { 
    //         return res.redirect('/user')
    //     }
    // } 
    res.status(201);
    return res.render('login', { title: 'login' });
    next()
})

app.use('/register', (req,res,next) => { 
    res.status(201);
    return res.render('register', { title: 'Register' });
    // if(req.session.user) { 
    //     if(req.session.user.role === 'admin') {
    //         return res.redirect('/admin')
    //     } else if (req.session.user.role === 'user') { 
    //         return res.redirect('/user')
    //     }
    // }   
    next()
})


  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  
  app.engine('handlebars', handlebarsInstance.engine);
  app.set('view engine', 'handlebars');
  console.log(app.get('views'))

export default app;
