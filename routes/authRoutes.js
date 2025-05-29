import { Router } from "express";
import csrf from 'csurf';
import { body } from 'express-validator';
import { register, login, logout  } from "../controllers/authController.js";
import { validateRequest } from "../utils/validation.js";
import { MIN_NAME_LENGTH, 
        NAME_LENGTH_MESSAGE, 
        INVALID_EMAIL_MESSAGE, 
    } from "../utils/messages.js";

const authRouter = Router();
const csrfProtection = csrf();

authRouter.post('/register', csrfProtection,
  [
    body("nom")
      .isLength({ min: MIN_NAME_LENGTH })
      .withMessage(NAME_LENGTH_MESSAGE)
      .trim()
      .escape(),
    body("prenom")
      .isLength({ min: MIN_NAME_LENGTH })
      .withMessage(NAME_LENGTH_MESSAGE)
      .trim()
      .escape(),
    body("email").isEmail().withMessage(INVALID_EMAIL_MESSAGE).normalizeEmail(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
    register
);

authRouter.post('/login', csrfProtection,
    [
        body("email").isEmail().withMessage(INVALID_EMAIL_MESSAGE).normalizeEmail(),
        validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
    login);

authRouter.post('/logout', logout);

/*
authRouter.get('/logout', (req, res) => {
    res.redirect('/login/login.html'); 
});
*/

export default authRouter;