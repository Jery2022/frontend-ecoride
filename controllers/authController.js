import bcrypt from 'bcrypt';
import connection from '../db/db.js';
import { promisify } from 'util';
import { handleValidationErrors } from '../utils/validation.js'; 
import { SERVER_ERROR_MESSAGE } from '../utils/messages.js';



// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection); 


export const register = async (req, res) => {
    try {
        const { prenom, nom, email, password } = req.body;

        if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

        // Vérifier les erreurs de validation
        const errors = handleValidationErrors(req, res);    
        if (errors) {
            return res.status(400).json({ errors });
        }

        // Vérifier si l'utilisateur existe déjà
        const checkUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
        const existingUser = await query(checkUserSql, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insérer le nouvel utilisateur
        const insertUserSql = 'INSERT INTO utilisateur (nom, prenom, password, email) VALUES (?, ?, ?, ?)';
        const result = await query(insertUserSql, [nom, prenom, hashedPassword, email]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Erreur lors de l\'enrégistrement.' });
        }

        res.status(201).json({message: 'Utilisateur enrégistré avec succés.' });

        } catch (err) {
            console.error('Erreur lors de l\'inscription :', err); // log
            res.status(500).json({ message: SERVER_ERROR_MESSAGE });
        }
     
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis.' });

        const errors = handleValidationErrors(req, res);
        if (errors) {
            return res.status(400).json({ errors });
        }

        // Vérifier si l'utilisateur existe déjà
        const checkUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
        const existingUser = await query(checkUserSql, [email]);

        if (!existingUser || existingUser.length === 0) {
            return res.status(404).json({ message: 'Identifiants invalides.' });
        }

        const user = existingUser[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Authentification réussie
        req.session.userName = user.nom;
        req.session.userRole = user.id_role;
        req.session.userIsValid = user.isValid;
        res.status(200).json({ message: 'Utilisateur connecté avec succès.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {  
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la déconnexion." });
        }
        res.clearCookie('connect.sid'); // Nom du cookie de session par défaut
        res.status(200).json({ message: "Déconnexion réussie." });
    });
};
