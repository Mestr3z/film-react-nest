export type SeatKey = `${number}:${number}`;

export interface Schedule {
  _id: string;
  startsAt?: Date | string;
  hall?: string;
  rows: number;
  seatsPerRow: number;
  occupied: SeatKey[];
}

export interface Film {
  _id: string;
  title: string;
  image: string;
  rating?: number;
  about?: string;
  description?: string;
  tags?: string[];
  cover?: string;
  schedule: Schedule[];
}

export interface FilmsRepository {
  findAll(): Promise<Film[]>;
  findById(id: string): Promise<Film | null>;
  addOccupiedSeats(
    filmId: string,
    scheduleId: string,
    seatKeys: SeatKey[],
  ): Promise<{ added: SeatKey[]; already: SeatKey[] } | null>;
}
