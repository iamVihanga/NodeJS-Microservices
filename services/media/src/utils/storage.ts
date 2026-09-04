import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

function getClientInfo() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const region = "auto";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "[ERROR] - R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables must be set"
    );
  }

  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    forcePathStyle: true
  });
}

export async function uploadBuffer(
  buffer: Buffer,
  contentType = "image/jpeg"
): Promise<{ imageUrl: string; publicId: string }> {
  const bucket = process.env.R2_BUCKET;
  const publicEndpoint = process.env.R2_DEVELOPMENT_PUBLIC_URL;

  if (!bucket || !publicEndpoint) {
    throw new Error(
      "[ERROR] - R2_BUCKET and R2_DEVELOPMENT_PUBLIC_URL environment variables must be set"
    );
  }

  const customKey = `tasks-attachments/${randomUUID()}`;

  await getClientInfo().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: customKey,
      Body: buffer,
      ContentType: contentType
    })
  );

  const baseUrl = publicEndpoint.endsWith("/")
    ? publicEndpoint.slice(0, -1)
    : publicEndpoint;

  return {
    imageUrl: `${baseUrl}/${customKey}`,
    publicId: customKey
  };
}
