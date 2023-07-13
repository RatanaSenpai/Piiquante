
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Contrôleur pour gérer l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    console.log('Requête signup reçue');
    // Hache le mot de passe avec bcrypt, en utilisant un "salt" de 10 tours
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
            console.error('Erreur lors de la sauvegarde de l\'utilisateur', error);
            res.status(400).json({ error });
        });
    })
    .catch(error => {
        console.error('Erreur lors du hachage du mot de passe', error);
        res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
    // Recherche d'un utilisateur dans la base de données par email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Si les mots de passe correspondent, renvoie un objet JSON contenant l'ID utilisateur et un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};