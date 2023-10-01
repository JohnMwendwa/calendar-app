import { Schema, model, models, Types, Model } from "mongoose";

export interface EventProps {
  _id: Types.ObjectId;
  title: string;
  start: Date | string;
  allDay: boolean;
}

const eventSchema = new Schema<EventProps>({
  title: {
    type: String,
    required: [true, "Please add event title!"],
    trim: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
});

const Event =
  (models.Event as Model<EventProps>) ||
  model<EventProps>("Event", eventSchema);

export default Event;
