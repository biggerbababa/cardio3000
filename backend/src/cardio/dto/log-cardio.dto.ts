import { IsString, IsInt, Min, Max, Matches } from 'class-validator'

export class LogCardioDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date: string

  @IsInt()
  @Min(0)
  @Max(1440)
  minutes: number
}
