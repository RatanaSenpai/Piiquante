const multer = require('multer');

// Objet MIME_TYPES pour déterminer les extensions des fichiers en fonction de leur type MIME
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration de "multer" pour définir la manière dont les fichiers seront stockés sur le serveur
const storage = multer.diskStorage({
    // Fonction "destination" pour déterminer le dossier où les fichiers seront enregistrés
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Fonction "filename" pour déterminer le nom des fichiers enregistrés
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');