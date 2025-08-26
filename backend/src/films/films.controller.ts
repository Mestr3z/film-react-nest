import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmListItemDto, FilmWithScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly films: FilmsService) {}

  @Get()
  async list(): Promise<FilmListItemDto[]> {
    return this.films.findAll();
  }

  @Get(':id/schedule')
  async one(@Param('id') id: string): Promise<FilmWithScheduleDto> {
    return this.films.findOneWithSchedule(id);
  }
}
