"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProblems } from "@/lib/actions";
import type { Problem } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ProblemsTable() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const result = await getProblems();
        if (result.success) {
          setProblems(result.data);
        } else {
          console.error("Failed to fetch problems:", result.error);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  if (loading) {
    return <div className="py-8 text-center">Loading problems...</div>;
  }

  if (problems.length === 0) {
    return (
      <div className="rounded-lg border py-8 text-center">
        <p className="text-muted-foreground">
          No problems found. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Commutator</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-medium">{problem.id}</TableCell>
                <TableCell>{problem.operator}</TableCell>
                <TableCell>{problem.commutator}</TableCell>
                <TableCell>{problem.product_id}</TableCell>
                <TableCell>{formatDate(problem.start_date)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      problem.status === "active" ? "default" : "secondary"
                    }
                  >
                    {problem.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      alert(
                        `Problem Details:\n\nID: ${problem.id}\nCommutator: ${problem.commutator}\nProduct ID: ${problem.product_id}\nNote: ${problem.note}\nAnswer: ${problem.answer}`,
                      )
                    }
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
