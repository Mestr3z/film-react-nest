import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const ScheduleSchema = new Schema(
  {
    id: { type: String },
    startsAt: { type: Date },
    daytime: { type: Date },
    hall: { type: String },
    rows: { type: Number, required: true },
    seatsPerRow: { type: Number },
    seats: { type: Number },
    occupied: { type: [String], default: [] },
    taken: { type: [String], default: [] },
  },
  { _id: true },
);

const FilmSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number },
    about: { type: String },
    description: { type: String },
    tags: { type: [String], default: [] },
    cover: { type: String },
    schedule: { type: [ScheduleSchema], default: [] },
  },
  { collection: 'films' },
);

export type FilmDoc = InferSchemaType<typeof FilmSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type FilmModel = Model<FilmDoc>;

export function getFilmModel(): FilmModel {
  return (
    (mongoose.models.Film as FilmModel) ??
    mongoose.model<FilmDoc>('Film', FilmSchema)
  );
}
