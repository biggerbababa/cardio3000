import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS — allow frontend origins
  const allowedOrigins = (process.env.FRONTEND_URL || '*')
    .split(',')
    .map(o => o.trim())

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile, curl)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Global prefix
  app.setGlobalPrefix('api')

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 Backend running on http://localhost:${port}/api`)
}
bootstrap()
