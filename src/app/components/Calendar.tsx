"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import interactionPlugin, { EventDragStopArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventSourceInput } from "@fullcalendar/core/index.js";

import { EventProps } from "@/database/models/Event";
import AddEventModal from "./AddEventModal";
import DeleteEventModal from "./DeleteEventModal";
import Sidebar from "./Sidebar";

interface CalendarProps {
  events: EventProps[];
}

const Calendar = ({ events }: CalendarProps) => {
  const [allEvents, setAllEvents] = useState<EventProps[]>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>();
  const [newEvent, setNewEvent] = useState<Omit<EventProps, "_id">>({
    title: "",
    start: "",
    allDay: false,
    end: null,
  });
  const router = useRouter();

  useEffect(() => {
    setAllEvents(events);
  }, [events]);

  // open modal on date click
  const handleDateClick = async (event: { date: Date; allDay: boolean }) => {
    setShowAddModal(true);
    setNewEvent({
      ...newEvent,
      start: event.date,
      allDay: event.allDay,
    });
  };

  // close modal
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowAddModal(false);
    setIdToDelete(undefined);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      end: null,
    });
  };

  // set the event id to delete
  const handleDelete = (data: {
    event: { extendedProps: { _id?: string } };
  }) => {
    setShowDeleteModal(true);
    setIdToDelete(data.event.extendedProps._id);
  };

  // delete an event from database
  const handleDeleteEvent = async () => {
    const res = await fetch("/api/events", {
      method: "DELETE",
      body: JSON.stringify({ id: idToDelete }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await res.json();
    router.refresh();
    setShowDeleteModal(false);
    setIdToDelete(undefined);
  };

  const handleDrop = async (data: EventDragStopArg) => {
    console.log(data.event);

    const res = await fetch("/api/events", {
      method: "PATCH",
      body: JSON.stringify({
        id: data.event.extendedProps._id,
        start: data.event.start,
        end: data.event.end,
        allDay: data.event.allDay,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await res.json();
    router.refresh();
  };

  // update new event values
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEvent((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  // add new events to database
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({ ...newEvent }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await res.json();
    router.refresh();

    setShowAddModal(false);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      end: null,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-screen">
      <Sidebar allEvents={allEvents} />
      <div className="relative col-span-12 sm:col-span-9 p-8 overflow-y-auto h-full">
        <div className="mb-4 border-b border-violet-200 p-4">
          <h1 className="font-bold text-4xl text-violet-700 text-center">
            Calendar
          </h1>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          weekends={true}
          dayMaxEvents={true}
          events={allEvents as EventSourceInput}
          dateClick={handleDateClick}
          eventClick={(data) => handleDelete(data)}
          eventDrop={(data) => handleDrop(data)}
          aspectRatio={1.8}
        />

        <div className="mt-8">
          <h3 className="font-bold text-xl text-violet-600 underline underline-offset-2">
            Instructions
          </h3>
          <ul className="list-disc">
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
      </div>

      <DeleteEventModal
        showModal={showDeleteModal}
        closeModal={handleCloseModal}
        deleteEvent={handleDeleteEvent}
      />

      <AddEventModal
        showAddModal={showAddModal}
        closeModal={handleCloseModal}
        onSubmit={handleSubmit}
        newEvent={newEvent}
        onChange={handleChange}
      />
    </div>
  );
};

export default Calendar;
