import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/analytics";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AddStatsDialog() {
  const [open, setOpen] = useState(false);
  const [revenue, setRevenue] = useState("");

  const handleSubmit = async () => {
    try {
      const revenueNum = parseFloat(revenue);
      if (isNaN(revenueNum) || revenueNum < 0) {
        toast.error("Please enter a valid revenue amount");
        return;
      }

      const statsRef = doc(db, 'analytics', 'stats');
      await updateDoc(statsRef, {
        revenue: increment(revenueNum)
      });

      logActivity(
        "Revenue Added",
        `Added $${revenueNum.toFixed(2)} in revenue`,
        "activity"
      );

      toast.success("Revenue added successfully");
      setOpen(false);
      setRevenue("");
    } catch (error) {
      console.error("Error adding revenue:", error);
      toast.error("Failed to add revenue");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Stats</DialogTitle>
          <DialogDescription>
            Enter the revenue amount to add to the dashboard stats.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="revenue" className="text-right">
              Revenue
            </label>
            <Input
              id="revenue"
              type="number"
              step="0.01"
              min="0"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="Enter amount"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Revenue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}