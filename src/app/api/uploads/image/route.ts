// Uploads images to Cloudinary when configured, otherwise stores them locally.
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryEnabled = Boolean(
  cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret,
);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true,
  });
}

function extensionFromType(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WEBP, and GIF are supported." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image is too large. Max size is 5MB." },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (cloudinaryEnabled) {
    const uploadResult = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        folder: "coding-gurukul-blog",
        resource_type: "image",
      },
    );

    return NextResponse.json({ url: uploadResult.secure_url }, { status: 201 });
  }

  const extension = extensionFromType(file.type);
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const absolutePath = path.join(uploadDir, fileName);
  const publicUrl = `/uploads/${fileName}`;

  await mkdir(uploadDir, { recursive: true });
  await writeFile(absolutePath, buffer);

  return NextResponse.json({ url: publicUrl }, { status: 201 });
}
