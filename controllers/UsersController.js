import crypto from 'crypto';
import dbClient from '../utils/db';

// Handle user related requests
class UserController {
  // Saves new user to the database
  static async postNew(req, res) {
    const { email, password } = req.body;
    const uExist = await dbClient.client.db(dbClient.database).collection('users').findOne({ email });
    if (!email) {
      res.status(400).send('Missing email');
    } else if (!password) {
      res.status(400).send('Missing password');
    } else if (uExist) {
      res.status(400).send('Already  exist');
    } else {
      try {
        // Hash the password and store to database
        const sha1 = crypto.createHash('sha1');
        sha1.update(password.toString());
        const hashedPass = sha1.digest('hex');
        const newUser = {
          email,
          password: hashedPass,
        };
        const result = await dbClient.client.db(dbClient.database).collection('users').insertOne(newUser);
        res.status(201).send({ id: result.insertedId, email: newUser.email });
      } catch (error) {
        res.status(500).send(`Error creating user - ${error}`);
      }
    }
  }
}

module.exports = UserController;
