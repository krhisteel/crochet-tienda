import { NextRequest } from "next/server";
import { handleUpload } from "@vercel/blob/client";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const jsonResponse = await handleUpload({
    body,
    request,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    onBeforeGenerateToken: async () => {
      return {};
    },
    onUploadCompleted: async () => {},
  });

  return Response.json(jsonResponse);
}
