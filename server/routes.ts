import { Express } from "express";
import { db } from "./db";
import { students } from "../shared/schema";

export function registerRoutes(app: Express) {
  app.get("/api/students", async (_req, res) => {
    const allStudents = await db.select().from(students);
    res.json(allStudents);
  });
}
