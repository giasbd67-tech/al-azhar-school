import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  rollNo: integer("roll_no").notNull(),
});
