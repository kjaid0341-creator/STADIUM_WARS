import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.path} - Status: ${statusCode} - Msg: ${message}`, err.errors || '');

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    errors: err.errors || undefined,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
};
