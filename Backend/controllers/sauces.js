const Sauces = require('../models/Sauces');
const fs = require('fs');

// Fonction middleware 
exports.createSauces = (req, res, next) => {
    console.log('req.body:', req.body);
    const saucesObject = JSON.parse(req.body.sauce);
    console.log('saucesObject:', saucesObject);
    // Supprime les propriétés _id et _userId de l'objet, car ils seront générés automatiquement
    delete saucesObject._id;
    delete saucesObject._userId;
    // Crée un nouvel objet Sauces en utilisant le modèle et en ajoutant les données requises
    const sauces = new Sauces({
        ...saucesObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    console.log('sauces:', sauces);
    sauces.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
    .catch(error => { 
        console.log('error:', error);
        res.status(400).json( { error });
    });
};

exports.modifySauces = (req, res, next) => {
    // Affiche le corps de la requête
    console.log('req.body:', req.body);
    // Déclaration de la variable saucesObject sans valeur initiale
    let saucesObject;
    try {
        // Si un fichier image est présent, parse le JSON dans req.body.sauce, sinon utilise req.body directement
        const parsedSauce = req.file ? JSON.parse(req.body.sauce) : req.body;
        // Assignation de la valeur à saucesObject en utilisant parsedSauce
        saucesObject = {
            ...parsedSauce,
            // Si un fichier image est présent, génère l'URL de l'image, sinon utilise l'URL de l'image existante
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : parsedSauce.imageUrl
        };
    } catch (error) {
        console.error("Erreur lors de la création de saucesObject:", error);
        res.status(400).json({ message: "Requête incorrecte: JSON invalide" });
        return;
    }
    console.log('saucesObject:', saucesObject);
    delete saucesObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauces) => {
            console.log('sauces:', sauces);
            // Vérifie si l'utilisateur est autorisé à modifier la sauce (l'utilisateur doit être le créateur de la sauce)
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non-autorisé'});
            } else {
                if (req.file) {
                    // Si une nouvelle image est présente, supprimez l'ancienne image
                    const oldImageFilename = sauces.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${oldImageFilename}`, (error) => {
                        if (error) {
                            console.error('Erreur lors de la suppression de l\'ancienne image:', error);
                            res.status(500).json({ error });
                            return;
                        }
                    });
                }
                Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifié!'}))
                .catch(error => {
                    console.log('error:', error);
                    res.status(401).json({ error });
                });
            }
        })
        .catch((error) => {
            console.log('error:', error);
            res.status(400).json({ error });
        });
};

exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(sauces => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({message: 'Non-autorisé'});
            } else {
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauces = (req, res, next) => {
    // Récupère l'ID de l'utilisateur, la valeur du like et l'ID de la sauce à partir de la requête
    const userId = req.auth.userId;
    const like = req.body.like;
    const sauceId = req.params.id;

    Sauces.findById(sauceId)
        .then(sauce => {
            let usersLiked = sauce.usersLiked;
            let usersDisliked = sauce.usersDisliked;
            // Traite la valeur du like en fonction de son contenu
            switch (like) {
                case 1: // L'utilisateur aime la sauce
                    console.log("like = 1");
                    if (!usersLiked.includes(userId) && !usersDisliked.includes(userId)) {
                        usersLiked.push(userId);
                    }
                    break;
                case 0: // L'utilisateur annule son like ou son dislike
                console.log("like = 0");
                    if (usersLiked.includes(userId)) {
                        usersLiked = usersLiked.filter(user => user !== userId);
                    }
                    if (usersDisliked.includes(userId)) {
                        usersDisliked = usersDisliked.filter(user => user !== userId);
                    }
                    break;
                case -1: // L'utilisateur n'aime pas la sauce
                console.log("like = -1");
                    if (!usersDisliked.includes(userId) && !usersLiked.includes(userId)) {
                        usersDisliked.push(userId);
                    }
                    break;
                default:
                    return res.status(400).json({ message: 'Valeur de like invalide' });
            }
            // Met à jour la sauce dans la base de données avec les nouveaux tableaux et les nombres de likes et dislikes
            Sauces.updateOne(
                { _id: sauceId },
                {
                    usersLiked: usersLiked,
                    usersDisliked: usersDisliked,
                    likes: usersLiked.length,
                    dislikes: usersDisliked.length
                }
            )
                .then(() => res.status(200).json({ message: 'Sauce mise à jour avec succès' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};


