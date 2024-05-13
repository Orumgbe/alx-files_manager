import redisClient from '../utils/redis';
import dbClient from '../utils/db';

// Request handler app controller
class AppController {
  // Get status of redis server and mongodb client server
  static getStatus(req, res) {
    res.status(200);
    const resObj = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.send(resObj);
  }

  // Get stats - class method of dbClient used to query stats
  static async getStats(req, res) {
    res.status(200);
    let uNum;
    let fNum;
    try {
      uNum = await dbClient.nbUsers();
      fNum = await dbClient.nbFiles();
    } catch (err) {
      res.status(500).send({ error: err });
    }
    const resObj = {
      users: uNum,
      files: fNum,
    };
    res.send(resObj);
  }
}

module.exports = AppController;
