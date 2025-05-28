import { validationResult } from 'express-validator';
import { INVALID_ID_MESSAGE } from './messages.js';

// Fonction utilitaire pour valider les IDs
export const validateId = (id) => {
    const parsedId = parseInt(id, 10);
    
    if (isNaN(parsedId)) {
        throw new Error(INVALID_ID_MESSAGE);
    }
    return parsedId;
};

export const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Middleware pour gérer les erreurs de validation
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

  export function formatTime(time) {
    const match = time.match(/^(\d{1,2})h(\d{2})$/);
    if (match) {
        const hours = match[1].padStart(2, '0');
        const minutes = match[2];
        return `${hours}:${minutes}`;
    }
    return time; // Retourne la valeur originale si elle est déjà au bon format
};


  export function isAuthenticated(req, res, next) {
        if (req.session && req.session.userName) {
            return next();
        }
        return res.status(401).json({ message: "Vous devez être connecté - Authentification requise." });
}

  export function isAdmin(req, res, next) {
        if (req.session && req.session.userRole) {
            return next();
        }
        return res.status(401).json({ message: "Vous n'avez pas les droits réquis." });
}