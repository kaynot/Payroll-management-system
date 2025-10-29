import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import type { Employee } from "../../../types/Employee";

interface EditEmployeeProps {
  onClose: () => void;
  employee: Employee | null;
}

export const EditEmployee = ({ onClose, employee }: EditEmployeeProps) => {
  if (!employee) return null; // Prevent rendering without an employee

  // Normalize join date (since it's string | number | readonly string[] | undefined)
  const formattedJoinDate =
    typeof employee.joinDate === "string"
      ? employee.joinDate
      : typeof employee.joinDate === "number"
      ? new Date(employee.joinDate).toISOString().split("T")[0]
      : Array.isArray(employee.joinDate)
      ? employee.joinDate[0]
      : "";

  // Normalize status for the select field
  const normalizedStatus = employee.status
    ? employee.status.toLowerCase().replace(" ", "")
    : "active";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="lg:max-w-2xl md:max-w-lg sm:max-w-md w-full gap-8">
        {/* Header */}
        <DialogHeader className="space-y-2 flex justify-center items-center">
          <DialogTitle>Edit Employee Details</DialogTitle>
          <DialogDescription>
            Update {employee.firstName || employee.name.split(" ")[0]}'s record
            as needed.
          </DialogDescription>
        </DialogHeader>

        {/* Profile Overview */}
        <div className="flex flex-col gap-6">
          <div className="bg-muted flex items-center gap-4 p-4 rounded-2xl">
            <img
              src={employee.image || "../../assets/sarah.jpg"}
              alt={employee.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex flex-col items-start h-24 justify-around">
              <h1 className="text-2xl font-semibold">{employee.name}</h1>
              <p className="text-sm text-muted-foreground">
                {employee.id} • {employee.department}
              </p>
              <p
                className={`text-xs px-2 py-1 rounded-full text-center font-medium ${
                  employee.status === "Active"
                    ? "bg-green-200 text-green-700"
                    : employee.status === "Leave"
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {employee.status}
              </p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                autoComplete="off"
                defaultValue={employee.email}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-sm font-semibold">
                Phone
              </label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                autoComplete="off"
                defaultValue={employee.phone}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="salary" className="text-sm font-semibold">
                Salary
              </label>
              <Input
                type="number"
                name="salary"
                id="salary"
                defaultValue={employee.salary?.toString() || ""}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label
                htmlFor="join-date"
                className="text-sm font-semibold text-gray-700"
              >
                Join Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="join-date"
                  name="join-date"
                  defaultValue={formattedJoinDate}
                  className="w-full rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm appearance-none outline-primary"
                />
                {/* Custom calendar icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="department" className="text-sm font-semibold">
                Department
              </label>
              <Input
                type="text"
                name="department"
                id="department"
                defaultValue={employee.department}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="status" className="text-sm font-semibold">
                Status
              </label>
              <Select name="status" defaultValue={normalizedStatus}>
                <SelectTrigger
                  id="status"
                  className="w-full border rounded-md px-3 py-2 h-9 text-sm"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button className="bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-primary/95 transition">
            Save Changes
          </button>
          <button
            className="bg-muted text-gray-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
