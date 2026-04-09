import express from "express";
import cors from "cors";
import { simpleGit } from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./files";
import { uploadFile } from "./aws";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoURL = req.body.repoURL;
    const id = generate();
    await simpleGit().clone(repoURL, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })

    console.log(files)

    res.json({})
})

app.listen(3000);
