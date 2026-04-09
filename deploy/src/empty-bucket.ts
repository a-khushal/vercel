import "dotenv/config";
import { S3 } from "aws-sdk";

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_KEY;
const endpoint = process.env.ENDPOINT;
const bucket = process.env.BUCKET_NAME ?? "vercel";

if (!accessKeyId || !secretAccessKey || !endpoint) {
  throw new Error("Missing ACCESS_KEY_ID, SECRET_KEY, or ENDPOINT in .env");
}

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  endpoint,
});

async function emptyBucket() {
  let continuationToken: string | undefined;
  let deletedCount = 0;

  do {
    const listParams = continuationToken
      ? { Bucket: bucket, ContinuationToken: continuationToken }
      : { Bucket: bucket };

    const page = await s3
      .listObjectsV2(listParams)
      .promise();

    const objects = (page.Contents ?? [])
      .map((item) => item.Key)
      .filter((key): key is string => Boolean(key))
      .map((Key) => ({ Key }));

    if (objects.length > 0) {
      await s3
        .deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: objects,
            Quiet: true,
          },
        })
        .promise();

      deletedCount += objects.length;
      console.log(`Deleted ${objects.length} objects (total: ${deletedCount})`);
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  console.log(`Done. Bucket '${bucket}' is now empty.`);
}

emptyBucket().catch((err) => {
  console.error("Failed to empty bucket:", err);
  process.exit(1);
});
