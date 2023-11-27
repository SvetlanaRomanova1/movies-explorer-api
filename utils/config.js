const { PORT = 3000, JWT_SECRET = 'DEV_JWT', MONGODB_URI } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  MONGODB_URI,
};
