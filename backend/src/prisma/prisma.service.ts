import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client: ReturnType<typeof this._createClient>

  private _createClient() {
    return new PrismaClient().$extends(withAccelerate())
  }

  constructor() {
    this._client = this._createClient()
  }

  get client() {
    return this._client
  }

  // Shorthand accessors
  get user() {
    return this._client.user
  }

  get cardioLog() {
    return this._client.cardioLog
  }

  async onModuleInit() {
    // Accelerate doesn't need explicit $connect, but we warm up
    try {
      await (this._client as any).$connect?.()
    } catch {
      // Accelerate ignores this
    }
  }

  async onModuleDestroy() {
    try {
      await (this._client as any).$disconnect?.()
    } catch {
      // ignore
    }
  }
}
