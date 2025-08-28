import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @ManyToOne(() => FilmEntity, (f) => f.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film!: FilmEntity;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt!: Date;

  @Column({ type: 'int' })
  hall!: number;

  @Column({ type: 'int' })
  rows!: number;

  @Column({ name: 'seats_per_row', type: 'int' })
  seatsPerRow!: number;

  @Column({ type: 'int', default: 0 })
  price!: number;

  @Column({ type: 'text', array: true, default: () => `'{}'` })
  taken!: string[];
}
