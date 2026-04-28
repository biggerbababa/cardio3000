import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { CardioService } from './cardio.service'
import { LogCardioDto } from './dto/log-cardio.dto'
import { JwtService } from '@nestjs/jwt'

@Controller('cardio')
@UseGuards(JwtAuthGuard)
export class CardioController {
  constructor(
    private readonly cardioService: CardioService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * GET /api/cardio/week?dates=2026-04-28,2026-04-29,...
   * Returns { "2026-04-28": 45, ... }
   */
  @Get('week')
  getWeek(@Request() req, @Query('dates') datesParam: string) {
    const userId: string = req.user.sub
    const dates = (datesParam || '').split(',').filter(Boolean)
    return this.cardioService.getWeekLogs(userId, dates)
  }

  /**
   * POST /api/cardio/log
   * Body: { date: "YYYY-MM-DD", minutes: 30 }
   */
  @Post('log')
  log(@Request() req, @Body() dto: LogCardioDto) {
    const userId: string = req.user.sub
    return this.cardioService.logCardio(userId, dto.date, dto.minutes)
  }

  /**
   * DELETE /api/cardio/day/:date
   * Reset a specific day to 0
   */
  @Delete('day/:date')
  resetDay(@Request() req, @Param('date') date: string) {
    const userId: string = req.user.sub
    return this.cardioService.resetDay(userId, date)
  }
}
