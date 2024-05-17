import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const { v4: uuidv4 } = require('uuid');

// Handle authentication
class AuthController {
  // Handle user sign in with uuidv4 generated token
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      // Extract email and password
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const email = auth[0];
      const password = auth[1];
      if (!email && !password) {
        res.status(400).send({ error: 'Missing username or password' });
      } else {
        try {
          // Search for user in db based on email in header request
          const userDb = await dbClient.client.db(dbClient.database).collection('users').findOne({ email });
          if (userDb) {
            if (userDb.password === sha1(password)) {
              const token = uuidv4();
              const key = `auth_${token}`;
              const duration = 24 * 60 * 60; // 24 hours (in seconds)
              // Use auth_<token> to store userID to redis with 24 hours TTL for key
              await redisClient.set(key, userDb._id.toString(), duration).catch((error) => {
                console.error(`Error encountered while trying to save token: ${error}`);
                res.status(500).send({ error: 'Internal server error' });
              });
              res.status(200).send({ token });
            } else {
              res.status(401).send({ error: 'Unauthorized' });
            }
          } else {
            res.status(401).send({ error: 'Unauthorized' });
          }
        } catch (error) {
          console.error(`Error retrieving user from database: ${error}`);
          res.status(500).send({ error: 'Internal server error' });
        }
      }
    }
  }

  // Handle user sign out based on token
  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      try {
        const check = await redisClient.get(`auth_${token}`);
        if (token === check) {
          await redisClient.del(`auth_${token}`);
          res.status(204).send();
        } else {
          res.status(401).send({ error: 'Unauthorized' });
        }
      } catch (error) {
        console.error(`An error occurred: ${error}`);
        res.end();
      }
    }
  }
}

module.exports = AuthController;
