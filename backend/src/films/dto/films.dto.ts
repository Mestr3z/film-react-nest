export class FilmListItemDto {
  id!: string;
  title!: string;
  image!: string;
  rating!: number;
}

export class ScheduleItemDto {
  id!: string;
  startsAt!: string;
  hall!: number;
  rows!: number;
  seatsPerRow!: number;
  occupied!: string[];
}

export class FilmWithScheduleDto {
  id!: string;
  title!: string;
  image!: string;
  about?: string;
  description?: string;
  schedule!: ScheduleItemDto[];
}
