// types/express.d.ts
import { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: Partial<User>; // Ou a interface completa do seu usuário decodificado do token
    }
  }
}