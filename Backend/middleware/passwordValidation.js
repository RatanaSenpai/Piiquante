const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator();

passwordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

const genererMessageErreur = () => {
    const exigences = [
        'Au moins 8 caractères',
        'Pas plus de 100 caractères',
        'Au moins une lettre majuscule',
        'Au moins une lettre minuscule',
        'Au moins un chiffre',
        'Pas d\'espaces',
        'Pas l\'un des éléments suivants ["Passw0rd", "Password123"]'
    ];
    return `Le mot de passe ne répond pas aux exigences. Veuillez vous assurer que votre mot de passe respecte les règles suivantes : ${exigences.join(', ')}`;
};

const passwordValidationMiddleware = (req, res, next) => {
    if (req.body.password && !passwordSchema.validate(req.body.password)) {
        console.error(genererMessageErreur());
        return res.status(400).json({
            error: genererMessageErreur()
        });
    }
    return next();
};

module.exports = passwordValidationMiddleware;
