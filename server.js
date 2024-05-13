import express from 'express';
import router from './routes/index';

// Create server instance
const server = express();

// Enable access to request body json object
server.use(express.json());
// Load routes
server.use('/', router);

// Set listen port
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
