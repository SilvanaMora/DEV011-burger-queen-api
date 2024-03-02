const jwt = require('jsonwebtoken');
const config = require('../config');
const connect = require ('../connect');
const bcrypt = require('bcrypt');

module.exports = async (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    // Connect to the database
    const db = connect.connect ()// Assuming `connect` is a configured database connection function
    try {
      const { email, password } = req.body;

      // Validate email and password presence
      if (!email || !password) {
        return next(400, 'Email and password are required');
      }

      // Find the user with the provided email
      const existingUser = await db.collection('users').findOne({ email });

      // Handle invalid credentials
      if (!existingUser) {
        return next(401, 'Invalid email or password');
      }

      // Compare password using bcrypt
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        return next(401, 'Invalid email or password');
      }

      // Create JWT token
      const token = jwt.sign({ userId: existingUser._id }, secret);
      console.log(token);
      // Send response with access token
      resp.json({ token });
    } catch (error) {
      console.error(error)
      next(error);
    } /*finally {
      // Close the database connection (if applicable to your database driver)
      await db.close();
    }*/
  });

  return nextMain();
};