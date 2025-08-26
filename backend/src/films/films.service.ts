import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FILMS_REPOSITORY } from '../repository';
import { FilmsRepository, SeatKey } from '../repository/contracts';
import { FilmListItemDto, FilmWithScheduleDto } from './dto/films.dto';

type RepoSchedule = {
  _id?: string;
  id?: string;
  startsAt?: Date | string;
  daytime?: string;
  hall?: number | string;
  rows?: number;
  seatsPerRow?: number;
  seats?: number;
  occupied?: SeatKey[];
  taken?: SeatKey[];
};

type RepoFilm = {
  _id?: string;
  id?: string;
  title: string;
  image: string;
  rating?: number;
  about?: string;
  description?: string;
  schedule?: RepoSchedule[];
};

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly repo: FilmsRepository,
  ) {}

  async findAll(): Promise<FilmListItemDto[]> {
    const list = (await this.repo.findAll()) as RepoFilm[];

    return list.map<FilmListItemDto>((f) => ({
      id: String(f._id ?? f.id),
      title: f.title,
      image: f.image,
      rating: Number(f.rating ?? 0),
    }));
  }

  async findOneWithSchedule(id: string): Promise<FilmWithScheduleDto> {
    const film = (await this.repo.findById(id)) as RepoFilm | null;
    if (!film) throw new NotFoundException('Film not found');

    const schedule = (film.schedule ?? []).map(
      (s): FilmWithScheduleDto['schedule'][number] => {
        const starts =
          s.startsAt instanceof Date
            ? s.startsAt.toISOString()
            : s.startsAt ?? s.daytime ?? '';

        const hallNum =
          typeof s.hall === 'string'
            ? Number.parseInt(s.hall, 10)
            : s.hall ?? 0;

        const rows = Number(s.rows ?? 0);
        const seatsPerRow = Number(s.seatsPerRow ?? s.seats ?? 0);
        const occupied = (s.taken ?? s.occupied ?? []) as string[];

        return {
          id: String(s._id ?? s.id ?? ''),
          startsAt: starts,
          hall: hallNum,
          rows,
          seatsPerRow,
          occupied,
        };
      },
    );

    return {
      id: String(film._id ?? film.id),
      title: film.title,
      image: film.image,
      about: film.about,
      description: film.description,
      schedule,
    };
  }
}
