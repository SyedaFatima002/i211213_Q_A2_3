// let AuthenticateUser = async(req , res , next) =>{

//     let token = req.headers.token;

//     try{
//     let DecodedData = await jwt.verify(token , process.env.SECRET_KEY)
//     if(DecodedData)
//     {
//         req.User = DecodedData;
//         next()
//     }else
//     {
//         res.status(404).json({"Message":"Your Are Not Authenticated"})
//     }
// }catch(err)
// {
//     res.status(404).json({"Message":"Your Are Not Authenticated" , err})

// }}

const jwt = require('jsonwebtoken');

// Assuming you have a secret for JWT
//const JWT_SECRET = 'your_jwt_secret';

const authenticateUser = (req, res, next) => {
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
    if (decoded.role !== 'user') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticateUser;


// let authenticateUser = async (req, res, next) => {
//   const token = req.headers.token;

//   try {
//     const decodedData = await jwt.verify(token, process.env.SECRET_KEY);
    
//     if (decodedData) {
//       req.user = decodedData; // Attach user data to req.user
//       next();
//     } else {
//       res.status(401).json({ message: 'You are not authenticated' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Authentication error', error: err });
//   }
// };

// module.exports ={
//     authenticateUser
// }