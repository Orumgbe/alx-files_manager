import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

// Handle user related requests
class UserController {
  // Saves new user to the database
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email && !password) {
      res.status(400).send({ error: 'Missing user email and password' });
    } else if (!email) {
      res.status(400).send({ error: 'Missing email' });
    } else if (!password) {
      res.status(400).send({ error: 'Missing password' });
    } else {
      try {
        const uExist = await dbClient.client.db(dbClient.database).collection('users').findOne({ email });
        if (uExist) {
          res.status(400).send({ error: 'Already exist' });
        } else {
          // Hash the password and store to database
          const hashedPass = sha1(password);
          const newUser = {
            email,
            password: hashedPass,
          };
          const result = await dbClient.client.db(dbClient.database).collection('users').insertOne(newUser);
          res.status(201).send({ id: result.insertedId, email: newUser.email });
        }
      } catch (error) {
        res.status(500).send(`Error creating user - ${error}`);
      }
    }
  }

  // Get user based on token
  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      try {
        // Query redis for user ID
        const uID = await redisClient.get(`auth_${token}`);
        // Query db with the user ID
        const user = await dbClient.client.db(dbClient.database).collection('users').findOne({ _id: ObjectId(uID) });
        res.status(200).send({ id: user._id, email: user.email });
      } catch (error) {
        res.status(401).send({ error: 'Unauthorized' });
      }
    }
  }
}

module.exports = UserController;
