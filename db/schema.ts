import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { SQL, sql } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

// create postgresql problems table that contains id, commutator, product_id, start_date, end_date, note and status columns
// id is the primary key and is auto-incremented
// commutator is a varchar with a length of 255
// product_id is a varchar with a length of 255
// start_date is a date
// end_date is a date
// note is a varchar with a length of 255
// status is a varchar with a length of 255

export const statusEnum = pgEnum("status", ["active", "inactive"]);
export const problemTable = pgTable("problems", {
  id: serial().primaryKey(),
  operator: varchar({ length: 255 }).notNull(),
  commutator: varchar({ length: 255 }).notNull(),
  product_id: varchar({ length: 255 }).notNull(),
  start_date: timestamp(),
  end_date: timestamp(),
  note: varchar({ length: 1024 }),
  status: statusEnum(),
  answer: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp({ mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
  version: integer()
    .default(sql`1`)
    .$onUpdateFn(
      (): SQL => sql`${problemTable.version}
      + 1`,
    ),
});
export type Problem = typeof problemTable.$inferSelect;
export const ProblemInsertSchema = createInsertSchema(problemTable);
export const ProblemUpdateSchema = createUpdateSchema(problemTable);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
