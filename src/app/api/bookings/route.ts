import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// Helper to add minutes to a time string (HH:MM)
function addMinutes(timeStr: string, mins: number) {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + mins);
  const newH = String(date.getHours()).padStart(2, "0");
  const newM = String(date.getMinutes()).padStart(2, "0");
  return `${newH}:${newM}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date"); // YYYY-MM-DD
  const serviceId = searchParams.get("serviceId");

  if (!date || !serviceId) {
    return NextResponse.json({ error: "Missing date or serviceId" }, { status: 400 });
  }

  try {
    const service = await prisma.services.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const duration = service.durationMinutes;

    // Fetch existing appointments for the day
    const appointments = await prisma.appointments.findMany({
      where: { appointmentDate: date, status: "CONFIRMED" },
      include: { service: true },
    });

    // Generate slots
    const slots = [];
    let current = "08:00";
    const closingTime = "23:00";

    while (current < closingTime) {
      const endTime = addMinutes(current, duration);
      
      // Stop if the service exceeds closing time
      if (endTime > closingTime) break;

      // Check for overlap
      const isOverlapping = appointments.some((app) => {
        // App includes buffer time (10 mins) after it ends
        const appEndWithBuffer = addMinutes(app.endTime, 10);
        
        // Overlap condition:
        // current < appEndWithBuffer && endTime > app.startTime
        return current < appEndWithBuffer && endTime > app.startTime;
      });

      slots.push({
        time: current,
        booked: isOverlapping,
      });

      current = addMinutes(current, 15);
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, serviceId, date, time } = body;

    if (!name || !phone || !serviceId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await prisma.services.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const endTime = addMinutes(time, service.durationMinutes);

    // Double check overlap
    const existing = await prisma.appointments.findMany({
      where: { appointmentDate: date, status: "CONFIRMED" },
    });

    const isOverlapping = existing.some((app) => {
      const appEndWithBuffer = addMinutes(app.endTime, 10);
      return time < appEndWithBuffer && endTime > app.startTime;
    });

    if (isOverlapping) {
      return NextResponse.json({ error: "Time slot is no longer available" }, { status: 400 });
    }

    // Upsert client
    let client = await prisma.clients.findFirst({
      where: { phone },
    });

    if (!client) {
      client = await prisma.clients.create({
        data: { name, phone },
      });
    }

    // Create appointment
    const appointment = await prisma.appointments.create({
      data: {
        clientId: client.id,
        serviceId: service.id,
        appointmentDate: date,
        startTime: time,
        endTime: endTime,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
