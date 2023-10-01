import Calendar from "./components/Calendar";

import Event from "@/database/models/Event";
import connectDB from "@/database/connection";

const fetchEvents = async () => {
  await connectDB();
  const data = await Event.find();

  // Serialize data
  const dataJSON = JSON.stringify(data);
  return JSON.parse(dataJSON);
};

export default async function Home() {
  const events = await fetchEvents();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Calendar events={events} />
    </main>
  );
}
