import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement 

// Créer une connexion à la base de données MySQL 

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

// Test de la connexion à MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
        process.exit(1); // Quitter si la connexion échoue
    }
    console.log('Connexion réussie à la base de données MySQL.');
});

export default connection; // Exporter la connexion par défaut