import { AppBarChart } from "@/components/AppBarChart";
import { ProblemForm } from "./ProblemForm";
import { ProblemsTable } from "./ProblemTable";
import { getChartsData } from "@/lib/actions";

export default async function Problems() {
  const { operator, commutator } = await getChartsData();
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Operator Problems Warehouse</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Add New Problem</h2>
          <ProblemForm />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Problems List</h2>
          <ProblemsTable />
        </div>
      </div>
      <h1 className="my-8 text-xl font-semibold">Charts</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <AppBarChart data={operator || []} title={"Operators"} />
        <AppBarChart data={commutator || []} title={"Commutators"} />
      </div>
    </main>
  );
}
