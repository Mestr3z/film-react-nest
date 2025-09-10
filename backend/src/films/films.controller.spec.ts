import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmListItemDto, FilmWithScheduleDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;

  const list: FilmListItemDto[] = [
    { id: 'a', title: 'A', image: '/a.jpg', rating: 8.1 },
    { id: 'b', title: 'B', image: '/b.jpg', rating: 7.2 },
  ];

  const film: FilmWithScheduleDto = {
    id: 'b',
    title: 'B',
    image: '/b.jpg',
    about: 'about',
    description: 'desc',
    schedule: [
      {
        id: 'sch1',
        startsAt: new Date().toISOString(),
        hall: 1,
        rows: 5,
        seatsPerRow: 10,
        occupied: ['1:1'],
      },
      {
        id: 'sch2',
        startsAt: new Date().toISOString(),
        hall: 2,
        rows: 5,
        seatsPerRow: 10,
        occupied: [],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getList: jest.fn().mockResolvedValue(list),
            getByIdWithSchedule: jest.fn().mockResolvedValue(film),
          },
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
    service = module.get(FilmsService) as any;
  });

  it('GET /films -> list()', async () => {
    const res = await controller.list();
    expect(service.getList).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ total: list.length, items: list });
  });

  it('GET /films/:id/schedule -> schedule()', async () => {
    const res = await controller.schedule('b');
    expect(service.getByIdWithSchedule).toHaveBeenCalledWith('b');
    expect(res).toEqual({ total: film.schedule.length, items: film.schedule });
  });
});
