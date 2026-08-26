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
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: "desc" },
    });

    const stats = await prisma.material.aggregate({
      _sum: { costPerUnit: true },
      _count: { id: true },
    });

    const lowStock = materials.filter((m) => m.quantity <= m.minStock);

    return NextResponse.json({
      materials,
      stats: {
        total: stats._count.id,
        totalValue: materials.reduce((sum, m) => sum + (m.costPerUnit || 0) * m.quantity, 0),
        lowStockCount: lowStock.length,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error fetching materials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, category, quantity, unit, minStock, costPerUnit, supplier, notes } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category required" }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        name,
        category,
        quantity: quantity || 0,
        unit: unit || "unidades",
        minStock: minStock || 5,
        costPerUnit: costPerUnit || null,
        supplier: supplier || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating material" }, { status: 500 });
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

    const material = await prisma.material.update({
      where: { id },
      data,
    });

    return NextResponse.json(material);
  } catch {
    return NextResponse.json({ error: "Error updating material" }, { status: 500 });
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

    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting material" }, { status: 500 });
  }
}
