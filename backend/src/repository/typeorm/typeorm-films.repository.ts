import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilmEntity } from './film.entity';
import { ScheduleEntity } from './schedule.entity';
import { Film, FilmsRepository, SeatKey } from '../contracts';

export class TypeOrmFilmsRepository implements FilmsRepository {
  private filmsRepo: Repository<FilmEntity>;
  private schedRepo: Repository<ScheduleEntity>;

  constructor(@InjectDataSource() private readonly ds: DataSource) {
    this.filmsRepo = this.ds.getRepository(FilmEntity);
    this.schedRepo = this.ds.getRepository(ScheduleEntity);
  }

  private mapEntity(f: FilmEntity): Film {
    return {
      _id: f.id,
      title: f.title,
      image: f.image,
      rating: Number(f.rating ?? 0),
      about: f.about ?? undefined,
      description: f.description ?? undefined,
      schedule: (f.schedule ?? []).map((s) => ({
        _id: s.id,
        startsAt: s.startsAt,
        hall: String(s.hall),
        rows: s.rows,
        seatsPerRow: s.seatsPerRow,
        occupied: (s.taken ?? []) as SeatKey[],
      })),
    };
  }

  async findAll(): Promise<Film[]> {
    const items = await this.filmsRepo.find({
      select: ['id', 'title', 'image', 'rating'],
      order: { title: 'ASC' },
    });
    return items.map((f) => this.mapEntity({ ...f, schedule: [] as any }));
  }

  async findById(id: string): Promise<Film | null> {
    const film = await this.filmsRepo.findOne({
      where: { id },
      relations: { schedule: true },
      order: { schedule: { startsAt: 'ASC' } },
    });
    if (!film) return null;
    return this.mapEntity(film);
  }

  async addOccupiedSeats(
    filmId: string,
    scheduleId: string,
    seatKeys: SeatKey[],
  ): Promise<{ added: SeatKey[]; already: SeatKey[] } | null> {
    const sched = await this.schedRepo.findOne({
      where: { id: scheduleId },
      relations: { film: true },
    });
    if (!sched || sched.film.id !== filmId) return null;

    const existing = new Set((sched.taken ?? []) as SeatKey[]);
    const added: SeatKey[] = [];
    const already: SeatKey[] = [];

    for (const k of seatKeys) {
      if (existing.has(k)) already.push(k);
      else {
        existing.add(k);
        added.push(k);
      }
    }

    if (added.length > 0) {
      await this.schedRepo.update(
        { id: scheduleId },
        { taken: Array.from(existing) },
      );
    }

    return { added, already };
  }
}
