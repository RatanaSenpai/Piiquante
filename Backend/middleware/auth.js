const jwt = require('jsonwebtoken');

// Exporte le middleware d'authentification
module.exports = (req, res, next) => {
    try {
        // Récupère le token JWT depuis l'en-tête 'Authorization' de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Vérifie et décode le token JWT en utilisant la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Extrait l'ID utilisateur du token décodé
        const userId = decodedToken.userId;
        // Vérifie si l'ID utilisateur existe dans le corps de la requête
        if (req.body.userId && req.body.userId !== userId) {
            // Si l'ID utilisateur du corps de la requête est différent de celui du token
            throw 'user ID invalide';
        } else {
            // Si les ID utilisateur correspondent, ajoute l'objet 'auth' à l'objet 'req'
            req.auth = {
            userId: userId
        };
        next();
        }
    } catch {
        res.status(401).json({
            error: new Error('requete invalide !')
        });
    }
};
