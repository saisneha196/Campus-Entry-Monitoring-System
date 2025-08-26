import { Request, Response, NextFunction } from 'express';
import { adminAuth, adminDb } from '../services/firebaseAdmin';
import { ApiResponse } from '../types';

// Extend Request interface to include user data
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: string;
    name?: string;
  };
}

// Middleware to verify Firebase ID token
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Access token is required',
        error: 'No token provided'
      };
      return res.status(401).json(response);
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get additional user data from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userData?.role || 'host',
      name: userData?.username || decodedToken.name
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Invalid or expired token',
      error: 'Authentication failed'
    };
    return res.status(403).json(response);
  }
};

// Middleware to check user role
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required',
        error: 'No user data found'
      };
      return res.status(401).json(response);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        message: 'Insufficient permissions',
        error: `Role ${req.user.role} is not authorized for this action`
      };
      return res.status(403).json(response);
    }

    next();
  };
};

// Middleware for hosts only
export const requireHost = authorizeRole(['host', 'admin']);

// Middleware for security only
export const requireSecurity = authorizeRole(['security', 'admin']);

// Middleware for admin only
export const requireAdmin = authorizeRole(['admin']);
