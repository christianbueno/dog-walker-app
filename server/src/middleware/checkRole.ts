import { Request, Response, NextFunction } from 'express';

// Middleware to check if the user has the required role
export const checkRole = (role: 'pet_owner' | 'dog_walker') => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists in request (set by auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has the required role
    if (req.user.role !== role) {
      return res.status(403).json({
        message: `Access denied. ${role.replace('_', ' ')} role required.`,
      });
    }

    next();
  };
};
