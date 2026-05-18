import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const weekStart = monday.toISOString().split("T")[0];
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekEnd = sunday.toISOString().split("T")[0];

    const todayAppointments = await prisma.appointments.count({
      where: { appointmentDate: today, status: "CONFIRMED" },
    });

    const weekAppointments = await prisma.appointments.findMany({
      where: {
        appointmentDate: { gte: weekStart, lte: weekEnd },
        status: "CONFIRMED",
      },
      include: { service: true },
    });

    const weekRevenue = weekAppointments.reduce((sum, a) => sum + a.service.price, 0);

    const totalClients = await prisma.clients.count();

    const appointments = await prisma.appointments.findMany({
      orderBy: { id: "desc" },
      include: { client: true, service: true },
    });

    const clients = await prisma.clients.findMany({
      include: { Appointments: { orderBy: { id: "desc" }, include: { service: true } } },
    });

    const clientsData = clients.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      totalBookings: c.Appointments.length,
      lastVisit: c.Appointments[0]?.appointmentDate || "N/A",
    }));

    return NextResponse.json({
      todayBookings: todayAppointments,
      weekBookings: weekAppointments.length,
      weekRevenue,
      totalClients,
      appointments: appointments.map((a) => ({
        id: a.id,
        date: a.appointmentDate,
        startTime: a.startTime,
        endTime: a.endTime,
        status: a.status,
        clientName: a.client.name,
        clientPhone: a.client.phone,
        serviceName: a.service.serviceName,
        duration: a.service.durationMinutes,
        price: a.service.price,
      })),
      clients: clientsData,
    });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
