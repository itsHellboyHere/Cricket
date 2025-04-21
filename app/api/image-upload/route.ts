import { NextResponse } from "next/server";
import { v2 as cloudinary , UploadApiOptions} from 'cloudinary';
import { auth } from "@/auth";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

interface FormatData {
  width: number;
  height: number;
  aspectRatio: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const formatString = formData.get('format') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const format: FormatData | null = formatString 
      ? JSON.parse(formatString) 
      : null;
    console.log("format ", format)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadOptions: UploadApiOptions = {
  resource_type: 'image',
  quality: 'auto:good',
  fetch_format: 'auto',
  folder: "posts-uploads"
};


    // Apply transformation if format is provided
    if (format) {
      uploadOptions.transformation = [
        { 
          width: format.width, 
          height: format.height, 
          crop: 'fill',
          gravity: 'auto',
          quality: 'auto'
        }
      ];
    }

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else if (!result) {
            reject(new Error('Upload result is undefined'));
          } else {
            console.log('Upload successful:', {
              width: result.width,
              height: result.height,
              format: result.format,
              url: result.secure_url
            });
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height
            });
          }
        }
      );
      uploadStream.end(buffer);
    });

    // Verify the dimensions match the requested format
    if (format && (result.width !== format.width || result.height !== format.height)) {
      console.warn(`Uploaded image dimensions (${result.width}x${result.height}) don't match requested format (${format.width}x${format.height})`);
    }

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error("Upload image failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}