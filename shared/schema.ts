import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

// 'stdants' এর বদলে 'students' ব্যবহার করুন যাতে routes.ts এর সাথে মিলে যায়
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  rollNo: integer("roll_no").notNull(),
});
