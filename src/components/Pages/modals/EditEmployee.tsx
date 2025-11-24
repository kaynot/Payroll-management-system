import * as React from "react";
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
import { useCrudFunc } from "../../hooks/crud";
import type { Employee } from "../../../types/Employee";
import Sarah from "../../../assets/sarah.jpg";
import { toast } from "sonner";

interface Department {
  dptId: number;
  name: string;
  description?: string;
}

interface EditEmployeeProps {
  onClose: () => void;
  employee: Employee | null;
}

export const EditEmployee = ({ onClose, employee }: EditEmployeeProps) => {
  const [postData, updateData, patchData, fetchData, deleteData] =
    useCrudFunc();
  if (!employee) return null;

  const [title, setTitle] = React.useState(employee.title || "");
  const [firstName, setFirstName] = React.useState(employee.firstName || "");
  const [surname, setSurname] = React.useState(employee.lastName || "");
  const [otherName, setOtherName] = React.useState(employee.otherNames || "");
  const [email, setEmail] = React.useState(employee.email || "");
  const [phoneNumber, setPhoneNumber] = React.useState(employee.phone || "");
  const [dateOfBirth, setDateOfBirth] = React.useState(
    employee.dob ? new Date(employee.dob).toISOString().split("T")[0] : ""
  );
  const [address, setAddress] = React.useState(employee.address || "");
  const [departmentId, setDepartmentId] = React.useState("");
  const [jobPosition, setJobPosition] = React.useState(
    employee.jobPosition || ""
  );
  const [hireDate, setHireDate] = React.useState(
    employee.hireDate
      ? new Date(employee.hireDate).toISOString().split("T")[0]
      : ""
  );
  const [employmentType, setEmploymentType] = React.useState(
    employee.employmentType || ""
  );
  const [salary, setSalary] = React.useState(employee.salary?.toString() || "");
  const [payFrequency, setPayFrequency] = React.useState(
    employee.payFrequency || ""
  );
  const [status, setStatus] = React.useState(
    employee.status?.toLowerCase() || "active"
  );

  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(false);

  // -------------------- Fetch Departments Once --------------------
  React.useEffect(() => {
    let isMounted = true;
    const loadDepartments = async () => {
      try {
        const res = await fetchData(
          "Department/departments?PageNumber=1&PageSize=200"
        );
        const depts: Department[] = res.data.data;
        if (!isMounted) return;

        setDepartments(depts);

        const matchedDept = depts.find((d) => d.name === employee.department);
        const currentDeptId = matchedDept ? matchedDept.dptId : depts[0]?.dptId;
        if (currentDeptId) setDepartmentId(currentDeptId.toString());
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };
    loadDepartments();
    return () => {
      isMounted = false;
    };
  }, [employee.department]);

  // Prefill all fields whenever employee or departments change
  React.useEffect(() => {
    if (!employee) return;

    setTitle(employee.title || "");
    setFirstName(employee.firstName || "");
    setSurname(employee.lastName || "");
    setOtherName(employee.otherNames || "");
    setEmail(employee.email || "");
    setPhoneNumber(employee.phone || "");
    setAddress(employee.address || "");
    setDateOfBirth(
      employee.dob ? new Date(employee.dob).toISOString().split("T")[0] : ""
    );
    setJobPosition(employee.jobPosition || "");
    setHireDate(
      employee.hireDate
        ? new Date(employee.hireDate).toISOString().split("T")[0]
        : ""
    );
    setEmploymentType(employee.employmentType || "");
    setSalary(employee.salary?.toString() || "");
    setPayFrequency(employee.payFrequency || "");
    setStatus(employee.status?.toLowerCase() || "active");

    // Department: select the matching one or fallback
    if (departments.length > 0) {
      const matchedDept = departments.find(
        (d) => d.name === employee.department
      );
      setDepartmentId(
        matchedDept
          ? matchedDept.dptId.toString()
          : departments[0].dptId.toString()
      );
    }
  }, [employee, departments]);

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      // -------------------- Validate required fields --------------------
      if (!title.trim()) return toast.error("Title is required.");
      if (!firstName.trim()) return toast.error("First Name is required.");
      if (!surname.trim()) return toast.error("Surname is required.");
      if (!otherName.trim()) return toast.error("Other Names are required.");
      if (!email.trim()) return toast.error("Email is required.");
      if (!phoneNumber.trim()) return toast.error("Phone Number is required.");
      if (!address.trim()) return toast.error("Address is required.");
      if (!departmentId) return toast.error("Department is required.");
      if (!jobPosition.trim()) return toast.error("Job Position is required.");
      if (!employmentType.trim())
        return toast.error("Employment Type is required.");
      if (!salary.trim()) return toast.error("Salary is required.");
      if (!payFrequency.trim())
        return toast.error("Pay Frequency is required.");

      const depId = parseInt(departmentId, 10);
      if (isNaN(depId)) return toast.error("Invalid Department selected.");

      // -------------------- Prepare payload --------------------
      const payload = {
        title: title.trim(),
        firstName: firstName.trim(),
        surname: surname.trim(),
        otherName: otherName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        address: address.trim(),
        departmentId: depId,
        jobPosition: jobPosition.trim(),
        hireDate: hireDate ? new Date(hireDate).toISOString() : null,
        employmentType: employmentType.trim(),
        salary: salary.trim(),
        payFrequency: payFrequency.trim(),
        status: status.charAt(0).toUpperCase() + status.slice(1),
      };

      console.log("Payload being sent:", payload);

      // -------------------- Send PUT request --------------------
      await updateData(`Employee/${employee.id}`, payload);

      toast.success("Employee updated successfully!");
      onClose(); // close dialog after success
    } catch (err: any) {
      // -------------------- Handle backend validation errors --------------------
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        toast.error(`Validation error:\n${errorMessages}`);
      } else {
        console.error("Failed to update employee:", err);
        toast.error("Failed to update employee. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-2xl md:max-w-lg sm:max-w-md w-full gap-8">
        <DialogHeader className="space-y-2 flex justify-center items-center">
          <DialogTitle>Edit Employee Details</DialogTitle>
          <DialogDescription>
            Update {employee.firstName || employee.name.split(" ")[0]}'s record
            as needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Employee Header */}
          <div className="bg-muted flex items-center gap-4 p-4 rounded-2xl">
            <img
              src={employee.image || Sarah}
              alt={[employee.firstName, employee.otherNames, employee.lastName]
                .filter(Boolean)
                .join(" ")}
              className="w-24 h-24 rounded-full object-cover"
            />

            <div className="flex flex-col items-start h-24 justify-around">
              {/* Full Name */}
              <h1 className="text-2xl font-semibold">
                {[employee.firstName, employee.otherNames, employee.lastName]
                  .filter(Boolean)
                  .join(" ")}
              </h1>

              {/* ID + Department */}
              <p className="text-sm text-muted-foreground">
                {employee.id} • {employee.department}
              </p>

              {/* Status badge */}
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

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Title"
              value={title}
              setValue={setTitle}
              options={["Mr.", "Mrs.", "Miss", "Dr.", "Eng."]}
            />
            <InputField
              label="First Name"
              value={firstName}
              onChange={setFirstName}
            />
            <InputField label="Surname" value={surname} onChange={setSurname} />
            <InputField
              label="Other Names"
              value={otherName}
              onChange={setOtherName}
            />
            <InputField
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
            />
            <InputField label="Address" value={address} onChange={setAddress} />
            <InputField
              label="Phone"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            <InputField
              label="Salary"
              value={salary}
              onChange={setSalary}
              type="number"
            />
            <InputField
              label="Date of Birth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              type="date"
            />
            <InputField
              label="Job Position"
              value={jobPosition}
              onChange={setJobPosition}
            />
            <InputField
              label="Hire Date"
              value={hireDate}
              onChange={setHireDate}
              type="date"
            />
            <SelectField
              label="Pay Frequency"
              value={payFrequency}
              setValue={setPayFrequency}
              options={["Weekly", "Biweekly", "Monthly", "Annually"]}
            />
            <SelectField
              label="Department"
              value={departmentId}
              setValue={setDepartmentId}
              options={departments.map((d) => ({
                label: d.name,
                value: d.dptId.toString(),
              }))}
            />
            <SelectField
              label="Employment Type"
              value={employmentType}
              setValue={setEmploymentType}
              options={["FullTime", "PartTime", "Intern", "Nss"]}
            />
            <SelectField
              label="Status"
              value={status}
              setValue={setStatus}
              options={["active", "inactive", "leave"]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            disabled={loading}
            onClick={handleSaveChanges}
            className="bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-primary/95 transition w-full"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="bg-muted text-gray-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition w-full"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// -------------------- Input Field --------------------
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
}: InputFieldProps) => {
  if (type === "date") {
    return (
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border bg-white px-3 py-2 h-9 text-sm text-muted-foreground shadow-sm appearance-none outline-primary"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
      />
    </div>
  );
};

// -------------------- Select Field --------------------
interface SelectFieldProps {
  label: string;
  value: string;
  setValue: (val: string) => void;
  options: string[] | { label: string; value: string }[];
}

const SelectField = ({ label, value, setValue, options }: SelectFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold">{label}</label>
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full border rounded-md px-3 py-2 h-9 text-sm">
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o: any) =>
          typeof o === "string" ? (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ) : (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  </div>
);
