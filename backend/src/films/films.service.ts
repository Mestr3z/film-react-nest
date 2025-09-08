import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FILMS_REPOSITORY } from '../repository';
import { FilmsRepository } from '../repository/contracts';
import {
  FilmListItemDto,
  FilmWithScheduleDto,
  ScheduleItemDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly repo: FilmsRepository,
  ) {}

  async getList(): Promise<FilmListItemDto[]> {
    const films = await this.repo.findAll();
    return films.map<FilmListItemDto>((f) => ({
      id: String((f as any)._id ?? (f as any).id),
      title: f.title,
      image: f.image,
      rating: f.rating ?? 0,
    }));
  }


  async getByIdWithSchedule(id: string): Promise<FilmWithScheduleDto> {
    const film = await this.repo.findById(id);
    if (!film) throw new NotFoundException('film not found');

    const schedule: ScheduleItemDto[] = (film.schedule ?? []).map((s) => ({
      id: String((s as any)._id ?? (s as any).id),
      startsAt:
        typeof s.startsAt === 'string'
          ? s.startsAt
          : (s.startsAt ?? new Date()).toISOString(),
      hall: Number((s as any).hall ?? 0),
      rows: s.rows,
      seatsPerRow: s.seatsPerRow,
      occupied: s.occupied ?? [],
    }));

    return {
      id: String((film as any)._id ?? (film as any).id),
      title: film.title,
      image: film.image,
      about: film.about,
      description: film.description,
      schedule,
    };
  }
}

