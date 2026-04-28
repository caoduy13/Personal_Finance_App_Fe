import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants";
import { useCreateTransaction } from "../hooks/useTransactions";

export function AddTransactionPage() {
  const navigate = useNavigate();
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createTransaction({
      type,
      amount: Number(amount),
      note,
    });
    navigate(ROUTES.TRANSACTIONS, { replace: true });
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Add Transaction</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Create transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={type}
                onChange={(event) => setType(event.target.value as "Income" | "Expense")}
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Input id="note" value={note} onChange={(event) => setNote(event.target.value)} />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
