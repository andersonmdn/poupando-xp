import { config } from '@/config/env';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Interface para o payload do JWT
 */
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expires at
}

/**
 * Utilitários para autenticação JWT
 */
export class AuthService {
  /**
   * Gera um token JWT para um usuário
   */
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verifica e decodifica um token JWT
   */
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      }
      throw new Error('Erro ao verificar token');
    }
  }

  /**
   * Gera hash da senha usando bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compara uma senha plain text com o hash
   */
  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Extrai token do header Authorization
   */
  static extractTokenFromHeader(authorization?: string): string | null {
    if (!authorization) return null;

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
