import "dotenv/config";
import { createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("Missing REDIS_URL in .env");
}

const subscriber = createClient({
    url: redisUrl,
});

subscriber.on("error", (err) => {
    console.error("Redis subscriber error:", err);
});

async function main() {
    await Promise.all([subscriber.connect()]);

    while(1) {
        const res = await subscriber.brPop("vercel-build-queue", 0);
        if (!res) {
            continue;
        }
        console.log(res)
        const id = res.element;
        
        await downloadS3Folder(`output/${id}`)
        console.log("after download")
        await buildProject(id);
        copyFinalDist(id);
        // await publisher.hSet("status", id, "deployed");
    }
}

main().catch((err) => {
    console.error("Deploy worker crashed:", err);
    process.exit(1);
});
