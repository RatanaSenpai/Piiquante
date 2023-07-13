const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Crée un schéma pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
// Applique le plugin uniqueValidator au schéma userSchema pour garantir l'unicité de l'email
userSchema.plugin(uniqueValidator);

// Applique le plugin mongoose-beautiful-unique-validation pour améliorer la remontée des erreurs de validation uniques
userSchema.plugin(beautifyUnique);

module.exports = mongoose.model('User', userSchema);