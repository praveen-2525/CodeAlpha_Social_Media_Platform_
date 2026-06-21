import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  try {
    // Check if token exists in Authorization header as Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      return next();
    }

    if (!token) {
      res.status(401);
      return next(new Error('Not authorized, no token provided'));
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401);
    return next(new Error('Not authorized, token failed'));
  }
};
