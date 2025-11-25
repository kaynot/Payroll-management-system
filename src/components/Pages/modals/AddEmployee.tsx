import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Plus } from "lucide-react";
import { useCrudFunc } from "../../hooks/crud";
import useFetch from "../../hooks/useFetch";
import { useEmployees } from "../../../context/EmployeeContext";
import { toast } from "sonner";

interface AddEmployeeProps {
  onEmployeeAdded?: () => void;
}

export const AddEmployee: React.FC<AddEmployeeProps> = ({
  onEmployeeAdded,
}) => {
  const { setEmployees } = useEmployees();

  // ------------------------------ //
  //           STATE
  // ------------------------------ //
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [otherName, setOtherName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salary, setSalary] = useState("");
  const [payFrequency, setPayFrequency] = useState("");

  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<
    { dptId: number; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const EMPLOYMENT_TYPES = [
    { label: "Full-time", value: "FullTime" },
    { label: "Part-time", value: "PartTime" },
    { label: "National Service", value: "Nss" },
    { label: "Internship", value: "Intern" },
  ];

  const [postData] = useCrudFunc();
  const [departmentData] = useFetch("Department/departments");

  // ------------------------------ //
  //     LOAD DEPARTMENTS
  // ------------------------------ //
  React.useEffect(() => {
    if (departmentData) {
      setDepartments(
        Array.isArray(departmentData)
          ? departmentData
          : departmentData.data ?? []
      );
    }
  }, [departmentData]);

  // ------------------------------ //
  //          SUBMIT
  // ------------------------------ //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedDept = departments.find(
      (d) => d.dptId.toString() === departmentId
    );

    if (!selectedDept) {
      toast.error("Please select a valid department");
      setIsLoading(false);
      return;
    }

    const payload = {
      Title: title,
      FirstName: firstName,
      Surname: surname,
      OtherName: otherName,
      Email: email,
      PhoneNumber: phoneNumber,
      DateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
      Address: address,
      DepartmentId: departmentId,
      JobPosition: jobPosition,
      HireDate: hireDate ? new Date(hireDate).toISOString() : null,
      EmploymentType: employmentType,
      Salary: salary,
      PayFrequency: payFrequency,
    };

    try {
      const res = await postData("Employee/employee", payload);
      setEmployees((prev) => [...prev, res.data]);

      toast.success("Employee added successfully!");
      setOpen(false);
      onEmployeeAdded?.();
    } catch (err: any) {
      console.error("Error adding employee:", err);

      let message = err.response?.data?.message || "Failed to add employee.";

      if (!err.response?.data?.message && dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const age =
          new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970;
        if (age < 18) message = "⚠️ Employee must be at least 18 years old.";
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------ //
  //          JSX RETURN
  // ------------------------------ //

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition">
          <Plus size={16} color="#fff" strokeWidth={3} />
          Add Employee
        </button>
      </DialogTrigger>

      <DialogContent className="space-y-6 h-[90%] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the employee information to add them to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* ---------------------------- PERSONAL INFO ---------------------------- */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-2">
              <div className="bg-primary text-white text-sm flex items-center rounded-full w-6 justify-center">
                1
              </div>
              <div>Personal Information</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Title *</label>
                <Select value={title} onValueChange={setTitle}>
                  <SelectTrigger className="w-full px-3 py-2 text-sm">
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                    <SelectItem value="Eng.">Eng.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">First Name *</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Surname *</label>
                <Input
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Other Names</label>
                <Input
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                />
              </div>
            </div>

            {/* Email, Phone, DOB, Address */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Email *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Phone *</label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Date of Birth</label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Address *</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <hr />

            {/* ---------------------------- EMPLOYMENT INFO ---------------------------- */}
            <div className="flex gap-2">
              <div className="bg-blue-600 text-white text-sm flex items-center rounded-full w-6 justify-center">
                2
              </div>
              <div>Employment Details</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Department *</label>
                <Select
                  value={departmentId}
                  onValueChange={(v) => setDepartmentId(v)}
                >
                  <SelectTrigger className="w-full px-3 py-2 text-sm">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem
                        key={dept.dptId}
                        value={dept.dptId.toString()}
                      >
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Job Position *</label>
                <Input
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Hire Date</label>
                <Input
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">
                  Employment Type *
                </label>
                <Select
                  value={employmentType}
                  onValueChange={(v) => setEmploymentType(v)}
                >
                  <SelectTrigger className="w-full px-3 py-2 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <hr />

            {/* ---------------------------- COMPENSATION ---------------------------- */}
            <div className="flex gap-2">
              <div className="bg-orange-600 text-white text-sm flex items-center rounded-full w-6 justify-center">
                3
              </div>
              <div>Compensation</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Salary *</label>
                <Input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Pay Frequency</label>
                <Select
                  value={payFrequency}
                  onValueChange={(v) => setPayFrequency(v)}
                >
                  <SelectTrigger className="w-full px-3 py-2 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ---------------------------- SUMMARY PREVIEW ---------------------------- */}
          <div className="text-sm border border-indigo-200 bg-gradient-to-br from-accent/10 to-blue-50/50 rounded-3xl p-6 flex flex-col gap-4">
            <p className="font-medium">Summary Preview</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground">
                  Full Name:{" "}
                  <span className="text-gray-800">
                    {`${title} ${firstName} ${otherName} ${surname}`.trim() ||
                      "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Email:{" "}
                  <span className="text-gray-800">{email || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Phone:{" "}
                  <span className="text-gray-800">{phoneNumber || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Department:{" "}
                  <span className="text-gray-800">
                    {departments.find(
                      (d) => d.dptId.toString() === departmentId
                    )?.name || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------- BUTTONS ---------------------------- */}
          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary font-semibold text-white py-2 w-full rounded-full hover:bg-primary/95 flex justify-center items-center transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </div>
              ) : (
                "Add Employee"
              )}
            </button>

            <button
              type="button"
              className="border py-2 w-full rounded-full hover:bg-primary/20 transition"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
