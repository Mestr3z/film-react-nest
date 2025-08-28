\c film

INSERT INTO schedules (id, film_id, starts_at, hall, rows, seats_per_row, price, taken) VALUES
 ('f2e429b0-685d-41f8-a8cd-1d8cb63b99ce','0e33c7f6-27a7-4aa0-8e61-65d7e5effecf','2024-06-28T10:00:53+03:00',0,5,10,350,'{}'),
 ('5beec101-acbb-4158-adc6-d855716b44a8','0e33c7f6-27a7-4aa0-8e61-65d7e5effecf','2024-06-28T14:00:53+03:00',1,5,10,350,'{}'),
 ('89ee32f3-8164-40a6-b237-f4d492450250','0e33c7f6-27a7-4aa0-8e61-65d7e5effecf','2024-06-28T16:00:53+03:00',2,5,10,350,'{}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schedules (id, film_id, starts_at, hall, rows, seats_per_row, price, taken) VALUES
 ('9647fcf2-d0fa-4e69-ad90-2b23cff15449','51b4bc85-646d-47fc-b988-3e7051a9fe9e','2024-06-28T10:00:53+03:00',0,5,10,350,'{}'),
 ('9f2db237-01d0-463e-a150-89f30bfc4250','51b4bc85-646d-47fc-b988-3e7051a9fe9e','2024-06-28T14:00:53+03:00',1,5,10,350,'{}'),
 ('3d5f5d12-b4d8-44d3-a440-1b91616fda40','51b4bc85-646d-47fc-b988-3e7051a9fe9e','2024-06-28T16:00:53+03:00',2,5,10,350,'{}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schedules (id, film_id, starts_at, hall, rows, seats_per_row, price, taken) VALUES
 ('351b437c-3430-4a35-b71d-b93b3d80274a','3bedbc5a-844b-40eb-9d77-83b104e0cf75','2024-06-28T10:00:53+03:00',0,5,10,350,'{}'),
 ('2661b7e2-7654-4d17-aa5d-9da76e4fb563','3bedbc5a-844b-40eb-9d77-83b104e0cf75','2024-06-28T14:00:53+03:00',1,5,10,350,'{}'),
 ('d155ff3f-d547-4e4d-a530-bfcdcb3efbd5','3bedbc5a-844b-40eb-9d77-83b104e0cf75','2024-06-28T16:00:53+03:00',2,5,10,350,'{}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schedules (id, film_id, starts_at, hall, rows, seats_per_row, price, taken) VALUES
 ('793009d6-030c-4dd4-8d13-9ba500724b38','5b70cb1a-61c9-47b1-b207-31f9e89087ff','2024-06-28T10:00:53+03:00',0,5,10,350,'{"3:3","1:4","1:5","1:3","1:2"}'),
 ('27a6c145-d5bf-4722-8bd9-b58c5b6b718f','5b70cb1a-61c9-47b1-b207-31f9e89087ff','2024-06-28T14:00:53+03:00',1,5,10,350,'{}'),
 ('1f57131e-eb9c-41a2-b451-89ea7f691fb7','5b70cb1a-61c9-47b1-b207-31f9e89087ff','2024-06-28T16:00:53+03:00',2,5,10,350,'{}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schedules (id, film_id, starts_at, hall, rows, seats_per_row, price, taken) VALUES
 ('d3f54ca3-8e19-4b63-afd4-6a8d03933339','0354a762-8928-427f-81d7-1656f717f39c','2024-06-28T10:00:53+03:00',0,5,10,350,'{}'),
 ('2d794723-eadc-43ea-b82b-268f0178fb43','0354a762-8928-427f-81d7-1656f717f39c','2024-06-28T14:00:53+03:00',1,5,10,350,'{}'),
 ('043eb8fb-454a-40d2-9ce9-6fe80072bf8b','0354a762-8928-427f-81d7-1656f717f39c','2024-06-28T16:00:53+03:00',2,5,10,350,'{}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schedules (id, film_id, starts_at, hall, rows, seats_per_row, price, taken) VALUES
 ('5274c89d-f39c-40f9-bea8-f22a22a50c8a','92b8a2a7-ab6b-4fa9-915b-d27945865e39','2024-06-28T10:00:53+03:00',0,5,10,350,'{}'),
 ('3f7ed030-230c-4b06-bfc7-eeaee7f3f79b','92b8a2a7-ab6b-4fa9-915b-d27945865e39','2024-06-28T14:00:53+03:00',1,5,10,350,'{}'),
 ('8e8c2627-4578-42b1-a59a-9ec4964a03e1','92b8a2a7-ab6b-4fa9-915b-d27945865e39','2024-06-28T16:00:53+03:00',2,5,10,350,'{}')
ON CONFLICT (id) DO NOTHING;
