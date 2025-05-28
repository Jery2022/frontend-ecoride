import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import sessionRouter from './routes/sessionRoutes.js';  
import { isAuthenticated } from './utils/validation.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'; 
import csrf from 'csurf';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

const csrfProtection = csrf(); // session uniquement
//const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

const app = express();
const port = process.env.PORT || 3000; // Port par défaut pour le serveur

// Obtenir le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares  
app.use(bodyParser.json()); // Pour parser les données JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les données URL-encodées
app.use(express.static(path.join(__dirname, 'public'))); // Middleware pour servir les fichiers statiques


app.use(cors({
    name : 'sessionId',
    origin:'localhost', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],  
   
}));

app.use(cookieParser(process.env.SECRET));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
})); 

app.use(csrf()); 

// Routes
app.use('/session', sessionRouter); // Route pour les sessions
app.use('/api', isAuthenticated, csrfProtection); // Middleware pour protéger les routes API avec CSRF




// Route principale
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'layouts', 'main.html');
    console.log('Envoi du fichier :', filePath); // log 
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur sendFile :', err);
            res.status(err.status).end();
        }
    });
});

app.get('/register', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'register', 'register.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur sendFile :', err);
            res.status(err.status).end();
        }
    });
});


app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'login', 'login.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur sendFile :', err); 
            res.status(err.status).end();
        }
    });
});


// Route pour servir les fichiers partiels
app.get('/partials/:file', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'partials', req.params.file);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

// Middleware pour gérer les erreurs CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).send('Invalid CSRF token');
    }
    next(err);
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    res.status(404).send('Page not found : vérifié la présence de votre fichier !');
});

// Middleware pour gérer les erreurs générales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`); 
});
