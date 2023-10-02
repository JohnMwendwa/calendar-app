import Calendar from "./components/Calendar";

import Event from "@/database/models/Event";
import connectDB from "@/database/connection";

export const revalidate = 0;

const fetchEvents = async () => {
  await connectDB();
  const data = await Event.find({}).sort({ start: -1 });

  // Serialize data
  const dataJSON = JSON.stringify(data);
  return JSON.parse(dataJSON);
};

export default async function Home() {
  const events = await fetchEvents();

  return (
    <main>
      <Calendar events={events} />
    </main>
  );
}
