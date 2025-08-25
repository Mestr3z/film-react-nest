import { Model, Types } from 'mongoose';
import { FilmsRepository, Film, SeatKey } from '../contracts';
import { FilmDoc } from './film.schema';

export class MongoFilmsRepository implements FilmsRepository {
  constructor(private readonly model: Model<FilmDoc>) {}

  async findAll(): Promise<Film[]> {
    const docs = await this.model
      .find({}, { title: 1, image: 1, rating: 1 })
      .lean();
    return docs.map((d) => ({
      _id: String(d._id),
      title: d.title,
      image: d.image,
      rating: d.rating,
      schedule: [],
    }));
  }

  async findById(id: string): Promise<Film | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const d = await this.model.findById(id).lean();
    if (!d) return null;

    return {
      _id: String(d._id),
      title: d.title,
      image: d.image,
      rating: d.rating,
      about: d.about,
      description: d.description,
      tags: d.tags,
      cover: d.cover,
      schedule: (d.schedule ?? []).map((s: any) => ({
        _id: String(s._id ?? s.id),
        startsAt: s.startsAt ?? s.daytime ?? undefined,
        hall: s.hall,
        rows: s.rows,
        seatsPerRow: s.seatsPerRow ?? s.seats,
        occupied: (s.occupied ?? s.taken ?? []) as SeatKey[],
      })),
    };
  }

  async addOccupiedSeats(
    filmId: string,
    scheduleId: string,
    seatKeys: SeatKey[],
  ): Promise<{ added: SeatKey[]; already: SeatKey[] } | null> {
    if (!Types.ObjectId.isValid(filmId)) return null;

    const film = await this.model.findById(filmId).lean();
    if (!film) return null;

    const idx = (film.schedule ?? []).findIndex(
      (s: any) =>
        String(s._id ?? '') === scheduleId || String(s.id ?? '') === scheduleId,
    );
    if (idx === -1) return null;

    const sch: any = film.schedule[idx];
    const beforeSet = new Set<string>(sch.taken ?? sch.occupied ?? []);

    const fieldPath = `schedule.${idx}.taken`;
    await this.model.updateOne({ _id: filmId }, {
      $addToSet: { [fieldPath]: { $each: seatKeys } },
    } as any);

    const filmAfter = await this.model.findById(filmId, { schedule: 1 }).lean();
    const after: any = filmAfter?.schedule?.[idx];
    const afterSet = new Set<string>(after?.taken ?? after?.occupied ?? []);

    const added = seatKeys.filter(
      (k) => !beforeSet.has(k) && afterSet.has(k),
    ) as SeatKey[];
    const already = seatKeys.filter((k) => beforeSet.has(k)) as SeatKey[];

    return { added, already };
  }
}
