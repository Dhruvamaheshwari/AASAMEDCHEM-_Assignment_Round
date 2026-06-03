const pgUserModel = require('./models/pgUserModel');

const initDb = async () => {
  try {
    await pgUserModel.createUsersTableIfNotExists();
    console.log('users table created or already exists');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

initDb();
