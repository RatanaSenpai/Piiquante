const mongoose = require('mongoose');

//Modèle de sauce
const saucesSchema = mongoose.Schema({
    userId : { type: String, required: true },  
    name : { type: String, required: true },
    manufacturer : { type: String, required: true }, 
    description : { type: String, required: true },
    mainPepper : { type: String, required: true }, 
    imageUrl : { type: String, required: true },
    heat : { type: Number, required: true },
    likes : { defaut: 0, type: Number, required: true },
    dislikes : { defaut: 0, type: Number, required: true },
    usersLiked : { type: [], required: true },
    usersDisliked : { type: [], required: true },
});

module.exports = mongoose.model('Sauces', saucesSchema);

