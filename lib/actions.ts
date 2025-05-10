"use server";

import { mockDb } from "@/lib/mock-data";
import { Problem, problemTable } from "@/db/schema";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createProblem(data: {
  operator: string;
  commutator: string;
  product_id: string;
  start_date: string;
  end_date?: string;
  note?: string;
  status: "active" | "inactive";
  answer?: string;
}) {
  console.log("Creating problem with data:", data);
  try {
    const ipv4 = await getUserIPv4();
    console.log("ipv4: ", ipv4);
    const result = await db.insert(problemTable).values({
      operator: data.operator,
      commutator: data.commutator,
      product_id: data.product_id,
      start_date: new Date(data.start_date),
      end_date: data.end_date ? new Date(data.end_date) : null,
      note: data.note || null,
      status: data.status,
      answer: data.answer || null,
    });
    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating problem:", error);
    return {
      success: false,
      error: "Failed to create problem",
    };
  }
}

export async function getProblems() {
  try {
    const problems = await db.select().from(problemTable);

    return {
      success: true,
      data: problems,
    };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return {
      success: false,
      error: "Failed to fetch problems",
      data: [] as Problem[],
    };
  }
}

export async function getOperators() {
  try {
    // select distinct operator from problems table
    const operators = await db
      .selectDistinct({ operator: problemTable.operator })
      .from(problemTable)
      .orderBy(problemTable.operator);

    return {
      success: true,
      data: operators.map((i) => i.operator),
    };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return {
      success: false,
      error: "Failed to fetch problems",
      data: [] as string[],
    };
  }
}

export async function getProblemById(id: number) {
  try {
    const problem = mockDb.getProblemById(id);

    if (!problem) {
      return {
        success: false,
        error: "Problem not found",
      };
    }

    return {
      success: true,
      data: problem,
    };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return {
      success: false,
      error: "Failed to fetch problem",
    };
  }
}

export async function getCommutators(operator: string) {
  try {
    const commutators = await db
      .selectDistinct({ commutator: problemTable.commutator })
      .from(problemTable)
      .where(eq(problemTable.operator, operator))
      .orderBy(problemTable.commutator);
    return {
      success: true,
      data: commutators.map((i) => i.commutator),
    };
  } catch (error) {
    console.error("Error fetching commutators:", error);
    return {
      success: false,
      error: "Failed to fetch commutators",
      data: [],
    };
  }
}

export async function getChartsData() {
  try {
    const operator =
      (await db
        .select({
          name: problemTable.operator,
          count: sql<number>`count
            (${problemTable.id})`.mapWith(Number),
        })
        .from(problemTable)
        .groupBy(sql`${problemTable.operator}`)) || [];

    const commutator =
      (await db
        .select({
          name: problemTable.commutator,
          count: sql<number>`count
            (${problemTable.id})`.mapWith(Number),
        })
        .from(problemTable)
        .groupBy(sql`${problemTable.commutator}`)) || [];

    return {
      operator,
      commutator,
    };
  } catch (error) {
    console.error("Error creating commutator:", error);
    return {
      success: false,
      error: "Failed to create commutator",
    };
  }
}

export async function getUserIPv4() {
  try {
    const h = await headers();
    const ipv4 = h.get("x-forwarded-for") || "Unknown IP";
    console.log("User IPv4:", ipv4);
    return ipv4;
  } catch (error) {
    console.error("Error fetching user IPv4:", error);
    return "Error fetching IP";
  }
}
