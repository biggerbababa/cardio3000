import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async loginWithGoogle(googleAccessToken: string) {
    // 1. Verify token with Google and get user info
    let googleUser: {
      sub: string
      email: string
      name: string
      given_name: string
      picture: string
    }

    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleAccessToken}` },
      })
      if (!res.ok) throw new Error('Invalid Google token')
      googleUser = await res.json()
    } catch (err) {
      throw new UnauthorizedException('Google token ไม่ถูกต้องหรือหมดอายุ')
    }

    // 2. Upsert user in database
    let user: any
    try {
      user = await this.prisma.user.upsert({
        where: { googleId: googleUser.sub },
        update: {
          email: googleUser.email,
          name: googleUser.name,
          givenName: googleUser.given_name,
          imageUrl: googleUser.picture,
        },
        create: {
          googleId: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          givenName: googleUser.given_name,
          imageUrl: googleUser.picture,
        },
      })
    } catch (err) {
      console.error('DB upsert error:', err)
      throw new InternalServerErrorException('บันทึกข้อมูลผู้ใช้ไม่สำเร็จ')
    }

    // 3. Sign our own JWT
    const payload = { sub: user.id, email: user.email }
    const token = this.jwt.sign(payload)

    return {
      accessToken: token,
      user: {
        id: user.id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        givenName: user.givenName,
        imageUrl: user.imageUrl,
      },
    }
  }
}
