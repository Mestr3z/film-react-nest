import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'films' })
export class FilmEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  image!: string;

  @Column({ type: 'numeric', precision: 3, scale: 1, default: 0 })
  rating!: string;

  @Column({ type: 'text', nullable: true })
  about!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @OneToMany(() => ScheduleEntity, (s) => s.film, { cascade: false })
  schedule!: ScheduleEntity[];
}
