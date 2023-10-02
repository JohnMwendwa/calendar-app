import { Schema, model, models, Types, Model } from "mongoose";

export interface EventProps {
  _id: Types.ObjectId;
  title: string;
  start: Date | string;
  end: Date | null;
  allDay: boolean;
}

const eventSchema = new Schema<EventProps>({
  title: {
    type: String,
    required: [true, "Please add event title!"],
    trim: true,
  },
  start: {
    type: Date,
    required: [true, "Please add start date!"],
  },
  end: {
    type: Date,
    default: null,
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
