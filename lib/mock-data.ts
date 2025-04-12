import type { Problem } from "@/db/schema";

// List of existing commutators
export const commutators = [
  { id: 1, name: "CM-001" },
  { id: 2, name: "CM-002" },
  { id: 3, name: "CM-003" },
  { id: 4, name: "CM-004" },
  { id: 5, name: "CM-005" },
];

// Initial mock data
const problems: Problem[] = [
  {
    id: 1,
    commutator: "CM-001",
    product_id: "PROD-A123",
    start_date: new Date("2023-01-15"),
    end_date: new Date("2023-02-15"),
    note: "Issue with power supply connection",
    status: "active",
    answer: "Replace the power connector and reset the system",
    created_at: new Date("2023-01-10"),
    updated_at: new Date("2023-01-10"),
    version: 1,
  },
  {
    id: 2,
    commutator: "CM-002",
    product_id: "PROD-B456",
    start_date: new Date("2023-03-05"),
    end_date: null,
    note: "Intermittent signal loss during peak hours",
    status: "active",
    answer: "Adjust frequency settings and check for interference sources",
    created_at: new Date("2023-03-01"),
    updated_at: new Date("2023-03-10"),
    version: 2,
  },
  {
    id: 3,
    commutator: "CM-003",
    product_id: "PROD-C789",
    start_date: new Date("2023-02-20"),
    end_date: new Date("2023-04-20"),
    note: "Overheating during continuous operation",
    status: "inactive",
    answer: "Install additional cooling system and monitor temperature",
    created_at: new Date("2023-02-15"),
    updated_at: new Date("2023-04-25"),
    version: 3,
  },
];

// Get the next ID for a new problem
function getNextId(): number {
  return Math.max(...problems.map((p) => p.id), 0) + 1;
}

// Get the next ID for a new commutator
function getNextCommutatorId(): number {
  return Math.max(...commutators.map((c) => c.id), 0) + 1;
}

// Mock database operations
export const mockDb = {
  getProblems: () => {
    return [...problems];
  },

  getProblemById: (id: number) => {
    return problems.find((p) => p.id === id) || null;
  },

  createProblem: (
    data: Omit<Problem, "id" | "created_at" | "updated_at" | "version">,
  ) => {
    const newProblem: Problem = {
      id: getNextId(),
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
    };

    problems.push(newProblem);
    return newProblem;
  },

  updateProblem: (id: number, data: Partial<Problem>) => {
    const index = problems.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProblem = {
      ...problems[index],
      ...data,
    };

    problems[index] = updatedProblem;
    return updatedProblem;
  },

  deleteProblem: (id: number) => {
    const index = problems.findIndex((p) => p.id === id);
    if (index === -1) return false;

    problems.splice(index, 1);
    return true;
  },

  getCommutators: () => {
    return [...commutators];
  },

  createCommutator: (name: string) => {
    const newCommutator = {
      id: getNextCommutatorId(),
      name,
    };

    commutators.push(newCommutator);
    return newCommutator;
  },
};
