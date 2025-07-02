import { Request, Response } from 'express';
import { RegisterUser } from '../useCases/auth/RegisterUser';
import { LoginUser } from '../useCases/auth/LoginUser';
import { RefreshToken } from '../useCases/auth/RefreshToken';
import { IAuthController } from '../interfaces/controllers/IAuthController';

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
export class AuthController implements IAuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private refreshTokenUseCase: RefreshToken
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password, gender } = req.body;

    const result = await this.registerUser.execute({
      name,
      email,
      password,
      gender,
    });
    
    res.status(201).json(result);
  }

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Realiza login do usuário
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   */
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await this.loginUser.execute({
      email,
      password,
    });
    
    res.status(200).json(result);
  }

  /**
   * @openapi
   * /auth/refresh-token:
   *   post:
   *     summary: Gera um novo token de acesso usando o refresh token
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Novo token gerado com sucesso
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    const result = await this.refreshTokenUseCase.execute({
      refreshToken,
    });
    
    res.status(200).json(result);
  }
} 