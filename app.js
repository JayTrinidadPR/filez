import express from "express";
import filesRouter from "#routes/files";
import foldersRouter from "#routes/folders";

const app = express();

app.use(express.json());

app.use("/files", filesRouter);
app.use("/folders", foldersRouter);

app.use((err, req, res, next) => {
  res.status(err.status ?? 500).send(err.message ?? "Internal Server Error");
});

export default app;
