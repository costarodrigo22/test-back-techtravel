import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details || undefined,
    });
  }

  // Erros não tratados
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
} 