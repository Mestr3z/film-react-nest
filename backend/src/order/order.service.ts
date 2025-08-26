import {
  Inject,
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { FILMS_REPOSITORY } from '../repository';
import { FilmsRepository, SeatKey } from '../repository/contracts';
import {
  CreateOrderDto,
  CreateOrderResponseDto,
  OrderItemDto,
  ItemStatus,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly repo: FilmsRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    const results: Array<OrderItemDto & { status: ItemStatus }> = dto.items.map(
      (i) => ({ ...i, status: 'not_found' }),
    );

    const groups = new Map<
      string,
      { indices: number[]; items: OrderItemDto[] }
    >();
    dto.items.forEach((item, idx) => {
      const key = `${item.filmId}::${item.scheduleId}`;
      if (!groups.has(key)) groups.set(key, { indices: [], items: [] });
      groups.get(key)!.indices.push(idx);
      groups.get(key)!.items.push(item);
    });

    let hasConflict = false;
    let hasOutOfRange = false;

    for (const [, group] of groups) {
      const sample = group.items[0];

      const film = await this.repo.findById(sample.filmId);
      if (!film) {
        group.indices.forEach((i) => (results[i].status = 'not_found'));
        continue;
      }
      const sch = film.schedule.find(
        (s: any) => String(s._id) === String(sample.scheduleId),
      );
      if (!sch) {
        group.indices.forEach((i) => (results[i].status = 'not_found'));
        continue;
      }

      const maxRow = sch.rows;
      const maxSeat = sch.seatsPerRow;

      const seatKeys: SeatKey[] = [];
      const keyByIndex = new Map<number, SeatKey>();
      const seen = new Set<SeatKey>();

      group.items.forEach((it, i) => {
        const idx = group.indices[i];
        if (it.row < 1 || it.row > maxRow || it.seat < 1 || it.seat > maxSeat) {
          results[idx].status = 'out_of_range';
          hasOutOfRange = true;
          return;
        }
        const key = `${it.row}:${it.seat}` as SeatKey;
        keyByIndex.set(idx, key);
        if (!seen.has(key)) {
          seen.add(key);
          seatKeys.push(key);
        }
      });

      if (seatKeys.length === 0) continue;

      const upd = await this.repo.addOccupiedSeats(film._id, sch._id, seatKeys);
      if (!upd) {
        group.indices.forEach((i) => {
          if (results[i].status !== 'out_of_range')
            results[i].status = 'not_found';
        });
        continue;
      }

      const addedSet = new Set(upd.added);
      const alreadySet = new Set(upd.already);

      group.indices.forEach((i) => {
        if (results[i].status === 'out_of_range') return;
        const key = keyByIndex.get(i);
        if (!key) {
          results[i].status = 'not_found';
          return;
        }
        if (addedSet.has(key)) {
          results[i].status = 'booked';
          addedSet.delete(key);
          alreadySet.add(key);
        } else if (alreadySet.has(key)) {
          results[i].status = 'already_booked';
          hasConflict = true;
        } else {
          results[i].status = 'already_booked';
          hasConflict = true;
        }
      });
    }

    if (hasConflict)
      throw new ConflictException({
        ok: false,
        results,
        message: 'Some seats are already taken',
      });
    if (hasOutOfRange)
      throw new BadRequestException({
        ok: false,
        results,
        message: 'Some seats are out of range',
      });

    return { ok: true, results };
  }
}
