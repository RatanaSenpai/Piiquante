// Importe le module HTTP natif de Node.js
const http = require('http');

const helmet = require('helmet');

// Importer app.js où se trouvent la configuration et les routes du serveur
const app = require('./app');
app.use(helmet());

// Fonction pour normaliser le numéro de port en entrée
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  
// Définir le port en utilisant la variable d'environnement PORT ou la valeur par défaut 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Gestionnaire d'erreurs pour le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};

// Crée le serveur HTTP en utilisant l'application Express
const server = http.createServer(app);
// Gestionnaire d'erreur et d'événements pour le démarrage du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
// Démarre le serveur sur le port spécifié
server.listen(port);