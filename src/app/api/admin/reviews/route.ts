import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifyAdmin(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  return token === process.env.ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  try {
    if (productId) {
      const reviews = await prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        include: { product: { select: { title: true } } },
      });
      return NextResponse.json(reviews);
    }

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: { select: { title: true, imageUrl: true } } },
    });

    const stats = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { id: true },
    });

    const productStats = await prisma.review.groupBy({
      by: ["productId"],
      _avg: { rating: true },
      _count: { id: true },
    });

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews: stats._count.id,
        avgRating: stats._avg.rating,
      },
      productStats: productStats.map((ps) => ({
        productId: ps.productId,
        avgRating: ps._avg.rating,
        reviewCount: ps._count.id,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Error fetching reviews" }, { status: 500 });
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
      return NextResponse.json({ error: "Review id required" }, { status: 400 });
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting review" }, { status: 500 });
  }
}
