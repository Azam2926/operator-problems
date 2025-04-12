import { db } from ".";
import { problemTable } from "./schema"; // your schema file
import { faker } from "@faker-js/faker";

// Define operator ranges
const operatorRanges = {
  Ucell: [100, 105],
  Beeline: [200, 205],
  Humans: [300, 305],
  Uzmobile: [400, 405],
  Mobiuz: [500, 505],
};

const operators = Object.keys(operatorRanges);

function getRandomCommutator(operator: string): string {
  const [min, max] = operatorRanges[operator as keyof typeof operatorRanges];
  return faker.number.int({ min, max }).toString();
}

export async function seedProblems(count = 200) {
  const problems = [];

  for (let i = 0; i < count; i++) {
    const operator = faker.helpers.arrayElement(operators);
    const commutator = getRandomCommutator(operator);
    const productId = faker.string.uuid();
    const startDate = faker.date.between({
      from: "2025-04-01T00:00:00.000Z",
      to: "2025-04-10T00:00:00.000Z",
    });
    const endDate = faker.date.between({
      from: startDate,
      to: "2025-04-20T00:00:00.000Z",
    });
    const note = faker.lorem.sentence();
    const status = faker.helpers.arrayElement(["active", "inactive"]);

    problems.push({
      operator,
      commutator,
      product_id: productId,
      start_date: startDate,
      end_date: endDate,
      note,
      status,
      answer: faker.lorem.paragraph(),
    });
  }

  await db.insert(problemTable).values(problems);
  console.log(`✅ Inserted ${count} fake problem records`);
}
