const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//créer un router
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');

// Récupérer toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
// Créer une nouvelle sauce
router.post('/', auth, multer, saucesCtrl.createSauces);
// Récupérer une sauce spécifique par ID
router.get('/:id', auth, saucesCtrl.getOneSauces);
// Modifier une sauce spécifique par ID
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
// Supprimer une sauce spécifique par ID
router.delete('/:id', auth, saucesCtrl.deleteSauces);
// Liker ou disliker une sauce spécifique par ID
router.post('/:id/like', auth, saucesCtrl.likeSauces)


module.exports = router;