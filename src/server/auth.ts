import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db.ts';
import { User } from '../types/index.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'grammarpath_super_secure_jwt_secret_2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = undefined;
    return next();
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || !payload.id) {
    req.user = undefined;
    return next();
  }

  const user = db.findUserById(payload.id);
  req.user = user;
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authenticate(req, res, () => {
    if (!req.user) {
      res.status(401).json({ error: 'অনুগ্রহ করে প্রথমে লগইন করুন (Please log in to continue).' });
      return;
    }
    next();
  });
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authenticate(req, res, () => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (req.user.role !== 'admin') {
      res.status(403).json({ error: 'এডমিন সুবিধার প্রয়োজন (Administrator privileges required).' });
      return;
    }
    next();
  });
}
