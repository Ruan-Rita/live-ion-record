import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    name: string;
    email: string;
    iat: number;
    exp: number;
  };
}
