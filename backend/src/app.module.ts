import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { CardioModule } from './cardio/cardio.module'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'cardio-secret-change-in-prod',
      signOptions: { expiresIn: '30d' },
    }),
    PrismaModule,
    AuthModule,
    CardioModule,
  ],
})
export class AppModule {}
