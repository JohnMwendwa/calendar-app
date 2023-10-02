import { NextRequest, NextResponse } from "next/server";

import Event from "@/database/models/Event";
import connectDB from "@/database/connection";

export async function POST(req: NextRequest) {
  try {
    const { title, start, allDay } = await req.json();

    if (title.trim === "" || start.trim() === "") {
      return NextResponse.json(
        {
          error: "Add title",
        },
        { status: 400 }
      );
    }

    await connectDB();
    const newEvent = new Event({
      title,
      allDay,
      start,
    });

    await newEvent.save();

    return NextResponse.json(
      {
        message: "New event added",
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: (e as Error).message,
      },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const { id, start, end, allDay } = await req.json();

    if (start.trim() === "") {
      return NextResponse.json(
        {
          error: "Add valid date",
        },
        { status: 400 }
      );
    }

    await connectDB();
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        {
          error: "Event Not found!",
        },
        { status: 404 }
      );
    }

    event.start = start;
    event.end = end;
    event.allDay = allDay;

    await event.save();

    return NextResponse.json(
      {
        message: "Event updated successfully!",
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: (e as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          error: "Please selec atleast one event",
        },
        { status: 400 }
      );
    }

    await connectDB();
    await Event.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Event removed successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: (e as Error).message,
      },
      { status: 500 }
    );
  }
}
