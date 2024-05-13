import MongoClient from 'mongodb';

// Handles client to database
class DBClient {
  constructor() {
    // Default client status
    this.client = null;
    this.isActive = false;
    // Retrieve required data from env variables, default if unavailable
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    // Create client
    this.connect();
  }

  // Connction handling function
  async connect() {
    // Create connection URI
    const uri = `mongodb://${this.host}:${this.port}`;
    // Create client and reassign active status
    try {
      this.client = await MongoClient.connect(uri, { useUnifiedTopology: true });
      this.isActive = true;
    } catch (error) {
      console.error('Error creating MongoDb client');
      throw (error);
    }
  }

  // Check for connection with mongodb
  isAlive() {
    return this.isActive;
  }

  // Returns number of documents in the users collection
  async nbUsers() {
    try {
      const num = await this.client.db(this.database).collection('users').countDocuments();
      return num;
    } catch (error) {
      console.error('Collection might be empty or nonexistent');
      return 0;
    }
  }

  // Returns number of documents in the files collection
  async nbFiles() {
    try {
      const num = await this.client.db(this.database).collection('files').countDocuments();
      return num;
    } catch (error) {
      console.error('Collection might be empty or nonexistent');
      return 0;
    }
  }
}

const dbClient = DBClient();
module.exports = dbClient;