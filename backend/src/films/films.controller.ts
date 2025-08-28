import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films') 
export class FilmsController {
  constructor(private readonly films: FilmsService) {}

  @Get()
  async list() {
    const items = await this.films.getList();
    return { total: items.length, items };
  }

  @Get(':id/schedule')
  async schedule(@Param('id') id: string) {
    const film = await this.films.getByIdWithSchedule(id);
    const items = film.schedule;
    return { total: items.length, items };
  }
}
