import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const authHeader: string = req.headers.authorization || ''

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('ไม่พบ token กรุณาเข้าสู่ระบบ')
    }

    const token = authHeader.slice(7)
    try {
      const payload = this.jwt.verify(token)
      req.user = payload
      return true
    } catch {
      throw new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ')
    }
  }
}
