import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifyAdmin(request: NextRequest) {
  return request.headers.get("x-admin-token") === process.env.ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all";

  try {
    let dateFilter: Date | undefined;
    const now = new Date();

    if (period === "month") {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "week") {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const where = dateFilter ? { soldAt: { gte: dateFilter } } : {};

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { soldAt: "desc" },
    });

    const stats = await prisma.sale.aggregate({
      where,
      _sum: { totalPrice: true, quantity: true },
      _count: { id: true },
      _avg: { unitPrice: true },
    });

    const byCategory = await prisma.sale.groupBy({
      by: ["category"],
      where,
      _sum: { totalPrice: true, quantity: true },
      _count: { id: true },
      orderBy: { _sum: { totalPrice: "desc" } },
    });

    const byMonth = await prisma.sale.groupBy({
      by: ["soldAt"],
      where: dateFilter ? { soldAt: { gte: dateFilter } } : {},
      _sum: { totalPrice: true },
      _count: { id: true },
    });

    return NextResponse.json({
      sales,
      stats: {
        totalRevenue: stats._sum.totalPrice || 0,
        totalQuantity: stats._sum.quantity || 0,
        totalSales: stats._count.id,
        avgSale: stats._avg.unitPrice || 0,
      },
      byCategory: byCategory.map((c) => ({
        category: c.category,
        revenue: c._sum.totalPrice || 0,
        quantity: c._sum.quantity || 0,
        count: c._count.id,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Error fetching sales" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productName, category, quantity, unitPrice, channel, customerName, notes, soldAt } = body;

    if (!productName || !category || !unitPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const qty = quantity || 1;
    const sale = await prisma.sale.create({
      data: {
        productName,
        category,
        quantity: qty,
        unitPrice,
        totalPrice: unitPrice * qty,
        channel: channel || "whatsapp",
        customerName: customerName || null,
        notes: notes || null,
        soldAt: soldAt ? new Date(soldAt) : new Date(),
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating sale" }, { status: 500 });
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

    await prisma.sale.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting sale" }, { status: 500 });
  }
}
