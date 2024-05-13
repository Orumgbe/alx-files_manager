import express from 'express';
import router from './routes/index'

// Create server instance
const server = express();

// Load routes
server.use('/', router);

// Set listen port
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
