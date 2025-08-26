import { FilmsRepository, Film, SeatKey } from './contracts';

const seed: Film[] = [
  {
    _id: '000000000000000000000001',
    title: 'Stub Film',
    image: '/content/afisha/bg1c.jpg',
    rating: 8.1,
    schedule: [
      {
        _id: '0000000000000000000000a1',
        startsAt: new Date().toISOString(),
        hall: 'A',
        rows: 5,
        seatsPerRow: 8,
        occupied: [],
      },
    ],
  },
];

export class InMemoryFilmsRepository implements FilmsRepository {
  private data: Map<string, Film> = new Map(seed.map((f) => [f._id, f]));

  async findAll(): Promise<Film[]> {
    return Array.from(this.data.values());
  }

  async findById(id: string): Promise<Film | null> {
    return this.data.get(id) ?? null;
  }

  async addOccupiedSeats(
    filmId: string,
    scheduleId: string,
    seatKeys: SeatKey[],
  ): Promise<{ added: SeatKey[]; already: SeatKey[] } | null> {
    const film = this.data.get(filmId);
    if (!film) return null;
    const sch = film.schedule.find((s) => s._id === scheduleId);
    if (!sch) return null;

    const before = new Set(sch.occupied);
    const added: SeatKey[] = [];
    const already: SeatKey[] = [];
    for (const key of seatKeys) {
      if (before.has(key)) {
        already.push(key);
      } else {
        sch.occupied.push(key);
        before.add(key);
        added.push(key);
      }
    }
    return { added, already };
  }
}
