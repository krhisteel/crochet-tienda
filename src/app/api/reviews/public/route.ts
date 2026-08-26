import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  try {
    if (productId) {
      const reviews = await prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reviews);
    }

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Error fetching reviews" }, { status: 500 });
  }
}
