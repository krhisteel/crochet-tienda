import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifyAdmin(request: NextRequest) {
  return request.headers.get("x-admin-token") === process.env.ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tasks = await prisma.productionTask.findMany({
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
    });

    const stats = {
      total: tasks.length,
      pendiente: tasks.filter((t) => t.status === "pendiente").length,
      enProgreso: tasks.filter((t) => t.status === "en_progreso").length,
      completada: tasks.filter((t) => t.status === "completada").length,
    };

    return NextResponse.json({ tasks, stats });
  } catch {
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productName, quantity, priority, status, dueDate, notes } = body;

    if (!productName) {
      return NextResponse.json({ error: "Product name required" }, { status: 400 });
    }

    const task = await prisma.productionTask.create({
      data: {
        productName,
        quantity: quantity || 1,
        priority: priority || "normal",
        status: status || "pendiente",
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const task = await prisma.productionTask.update({
      where: { id },
      data,
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.productionTask.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
