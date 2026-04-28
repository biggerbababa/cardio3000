import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CardioService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all logs for the given week dates (array of YYYY-MM-DD strings)
   * Returns map: { "2026-04-28": 45, "2026-04-29": 0, ... }
   */
  async getWeekLogs(userId: string, weekDates: string[]): Promise<Record<string, number>> {
    const logs = await this.prisma.cardioLog.findMany({
      where: {
        userId,
        date: { in: weekDates },
      },
    })

    const result: Record<string, number> = {}
    weekDates.forEach(d => { result[d] = 0 })
    logs.forEach(l => { result[l.date] = l.minutes })
    return result
  }

  /**
   * Upsert cardio minutes for a specific date
   */
  async logCardio(userId: string, date: string, minutes: number) {
    return this.prisma.cardioLog.upsert({
      where: { userId_date: { userId, date } },
      update: { minutes },
      create: { userId, date, minutes },
    })
  }

  /**
   * Reset a specific day (set minutes to 0)
   */
  async resetDay(userId: string, date: string) {
    try {
      await this.prisma.cardioLog.delete({
        where: { userId_date: { userId, date } },
      })
    } catch {
      // If not found, that's fine — already 0
    }
    return { date, minutes: 0 }
  }
}
