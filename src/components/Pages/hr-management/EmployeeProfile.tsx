import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";

import Sarah from "../../../assets/sarah.jpg";

interface ViewEmployeeProps {
  onClose: () => void;
}

export const ViewEmployee = ({ onClose }: ViewEmployeeProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="lg:max-w-2xl md:max-w-lg sm:max-w-md w-full gap-8">
        <DialogHeader className="space-y-2 flex justify-center items-center">
          <DialogTitle>Employee Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the employee.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="bg-muted flex items-center gap-4 p-4 rounded-2xl">
            <img
              src={Sarah}
              alt="sarah-profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex flex-col items-start h-24 justify-around">
              <h1 className="text-3xl">Sarah Chen</h1>
              <p className="text-sm text-muted-foreground">
                EMP001 • Engineering
              </p>
              <p className="text-xs bg-green-200 text-green-700 rounded-full px-2 text-center">
                Active
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-4 rounded-2xl">
            <div className="text-sm flex flex-col gap-1 bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm bg-muted">Email</p>
              <p className="text-black break-all">sarah.chen@company.com</p>
            </div>
            <div className="text-sm flex flex-col gap-1 bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Phone</p>
              <p className="text-black">+233 (0) 234 543 222</p>
            </div>
            <div className="text-sm flex flex-col gap-1 bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Salary</p>
              <p className="text-black">5,400</p>
            </div>
            <div className="text-sm flex flex-col gap-1 bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Join Date</p>
              <p className="text-black">Jan 15, 2023</p>
            </div>
          </div>
          <div className="text-sm border border-indigo-200 bg-gradient-to-br from-accent/10 to-blue-50/50 rounded-3xl p-6 flex flex-col gap-4">
            <p className="font-medium">Payroll Summary (Current Month)</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-muted-foreground flex flex-col gap-1">
                  <p className="text-muted-foreground">Gross Pay</p>
                  <p className="text-black text-base">$95,000</p>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex flex-col gap-1">
                  <p className="text-muted-foreground">Deductions</p>
                  <p className="text-black text-base">$12,450</p>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex flex-col gap-1">
                  <p className="text-muted-foreground">Net Pay</p>
                  <p className="text-black text-base">$82,550</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm border bg-muted rounded-3xl p-6 flex flex-col gap-4">
            <p className="font-medium">Attendance Summary</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-muted-foreground flex flex-col gap-1">
                  <p className="text-muted-foreground">Days Present</p>
                  <p className="text-black text-base">22</p>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex flex-col gap-1">
                  <p className="text-muted-foreground">Days Absent</p>
                  <p className="text-black text-base">0</p>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex flex-col gap-1">
                  <p className="text-muted-foreground">Leaves Taken</p>
                  <p className="text-black text-base">2</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-primary font-semibold text-white py-2 w-full rounded-full hover:bg-primary/95 flex justify-center items-center transition cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
