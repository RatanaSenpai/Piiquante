
require('dotenv').config();
// Importation des packages et modules nécessaires
const express = require('express');
// Importe le module middleware pour extraire les données du corps de requête HTTP
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Importe le module intégré de Node.js pour travailler avec les chemins de fichiers et de répertoires
const path = require('path');

const PasswordValidator = require('password-validator');

// Importation des routeurs pour les sauces et les utilisateurs
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Création de l'application Express
const app = express();

// Middleware pour gérer les problèmes de CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

// Utilisation des routeurs pour les sauces et les utilisateurs
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Middleware pour servir les images statiques à partir du dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware pour gérer les requêtes non prises en charge pour test
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

// Exportation de l'application pour utilisation dans d'autres fichiers
module.exports = app;
