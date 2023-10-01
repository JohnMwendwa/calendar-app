"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import { EventProps } from "@/database/models/Event";
import AddEventModal from "./AddEventModal";
import DeleteEventModal from "./DeleteEventModal";

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

  const handleDrop = (data: DropArg) => {};

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
    });
  };

  return (
    <div>
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
        events={allEvents}
        dateClick={handleDateClick}
        drop={(data) => handleDrop(data)}
        eventClick={(data) => handleDelete(data)}
      />

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
