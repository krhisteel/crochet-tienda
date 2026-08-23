import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al conectar con la base de datos" },
      { status: 500 }
    );
  }
}
