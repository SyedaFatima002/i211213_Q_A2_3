const jwt = require('jsonwebtoken');

// Assuming you have a secret for JWT
//const JWT_SECRET = 'your_jwt_secret';

const authenticateAdmin = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the user ID to the request for further use
    req.username = decoded.username;

    // Check if the user has the 'user' role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticateAdmin;
