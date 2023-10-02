import { formatDate } from "@fullcalendar/core";
import { EventProps } from "@/database/models/Event";

interface SidebarProps {
  allEvents: EventProps[] | undefined;
}

const Sidebar = ({ allEvents }: SidebarProps) => {
  return (
    <aside className="hidden sm:block col-span-3 text-white bg-gradient-to-br from-violet-600 to-violet-700 p-4 h-screen overflow-y-auto shadow-lg">
      <h2 className="font-bold text-xl text-center mb-2">
        All Events ({allEvents?.length})
      </h2>
      <ul className="px-2 space-y-1">
        {allEvents?.map((evt) => (
          <li
            key={evt._id.toString()}
            className="bg-violet-800 rounded-md py-1 px-2"
          >
            <b className="mr-1 text-sm">
              {formatDate(evt.start, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </b>
            - <span>{evt.title}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
