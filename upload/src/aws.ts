import "dotenv/config";
import { S3 } from "aws-sdk";
import fs from "fs";

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

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: bucket,
        Key: fileName,
    }).promise();
}
