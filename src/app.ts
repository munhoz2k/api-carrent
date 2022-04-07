import cors from "cors";
import express from "express";

import "reflect-metadata";
import "./database";
import "./shared/container";

const app = express();

app.use(cors());
app.use(express.json());

export { app };
