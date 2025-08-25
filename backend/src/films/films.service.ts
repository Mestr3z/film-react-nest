import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FILMS_REPOSITORY } from '../repository';
import { FilmsRepository } from '../repository/contracts';
import { FilmListItemDto, FilmWithScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly repo: FilmsRepository,
  ) {}

  async findAll(): Promise<FilmListItemDto[]> {
    const list = await this.repo.findAll();
    return list.map((f: any) => ({
      id: String(f._id ?? f.id),
      title: f.title,
      image: f.image,
      rating: Number(f.rating ?? 0),
    }));
  }

  async findOneWithSchedule(id: string): Promise<FilmWithScheduleDto> {
    const f: any = await this.repo.findById(id);
    if (!f) throw new NotFoundException('Film not found');

    const schedule = (f.schedule ?? []).map((s: any) => ({
      id: String(s._id ?? s.id),
      startsAt:
        (s.startsAt instanceof Date ? s.startsAt.toISOString() : s.startsAt) ??
        String(s.daytime),
      hall: Number(s.hall ?? 0),
      rows: Number(s.rows ?? 0),
      seatsPerRow: Number(s.seatsPerRow ?? s.seats ?? 0),
      occupied: (s.taken ?? s.occupied ?? []) as string[],
    }));

    return {
      id: String(f._id ?? f.id),
      title: f.title,
      image: f.image,
      about: f.about,
      description: f.description,
      schedule,
    };
  }
}
