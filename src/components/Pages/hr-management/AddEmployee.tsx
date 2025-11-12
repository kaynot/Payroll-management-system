import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { Input } from "../../ui/input";
import { useState } from "react";

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

export const AddEmployee = () => {
  const [title, setTitle] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [otherName, setOtherName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState<string>("");
  const [departmentId, setDepartmentId] = useState(""); // string
  const [jobPosition, setJobPosition] = useState<string>("");
  const [hireDate, setHireDate] = useState("");
  const [employmentType, setEmploymentType] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [payFrequency, setPayFrequency] = useState<string>("");

  const EMPLOYMENT_TYPES = [
    { label: "Full-time", value: "FullTime" },
    { label: "Part-time", value: "PartTime" },
    { label: "National Service", value: "Nss" },
    { label: "Internship", value: "Intern" },
  ];

  interface Department {
    dptId: number;
    name: string;
  }

  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const [postData] = useCrudFunc();
  const [departmentData, department_loading, department_error] = useFetch(
    "Department/departments"
  );
  console.log("fetchDep", departmentData);

  React.useEffect(() => {
    if (departmentData) {
      setDepartments(
        Array.isArray(departmentData)
          ? departmentData
          : departmentData.data ?? []
      );
    }
  }, [departmentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDept = departments.find(
      (d) => d.dptId.toString() === departmentId
    );
    if (!selectedDept) {
      alert("Please select a valid department");
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
      DepartmentId: departmentId, // number
      JobPosition: jobPosition,
      HireDate: hireDate ? new Date(hireDate).toISOString() : null,
      EmploymentType: employmentType,
      Salary: salary,
      PayFrequency: payFrequency,
    };

    try {
      const res = await postData("Employee/employee", payload);
      console.log("Employee added:", res.data);
      setOpen(false);
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee. Check console for details.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition duration-300">
          <Plus size={16} color="#fff" strokeWidth={3} />
          Add Employee
        </button>
      </DialogTrigger>
      <DialogContent className="space-y-6 h-[90%] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 md:max-w-2xl lg:max-w-3xl">
        <DialogHeader className="flex space-y-2">
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the employee information to add them to the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="bg-primary text-primary-foreground text-sm flex items-center rounded-full w-6 justify-center">
                    1
                  </div>
                  <div>Personal Information</div>
                </div>
                {/* title, first name, surname, other names */}
                <div className="grid flex-col gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="text-sm font-semibold">
                      Title *
                    </label>
                    <div>
                      <Select
                        value={title}
                        onValueChange={(value) => setTitle(value)}
                      >
                        <SelectTrigger
                          id="title"
                          className="w-full border rounded-md px-3 py-2 h-9 text-sm"
                        >
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="miss">Miss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="first-name"
                      className="text-sm font-semibold"
                    >
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      id="first-name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        console.log("firstName:", e.target.value);
                      }}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="surname" className="text-sm font-semibold">
                      Surname *
                    </label>
                    <Input
                      type="text"
                      name="surname"
                      id="surname"
                      value={surname}
                      onChange={(e) => {
                        setSurname(e.target.value);
                        console.log("surname:", e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="otherName"
                      className="text-sm font-semibold"
                    >
                      Other Names
                    </label>
                    <Input
                      type="text"
                      name="otherName"
                      id="otherName"
                      value={otherName}
                      onChange={(e) => {
                        setOtherName(e.target.value);
                        console.log("otherName:", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid flex-col gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-semibold">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      console.log("email:", e.target.value);
                    }}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-semibold"
                  >
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      console.log("phoneNumber:", e.target.value);
                    }}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="dob"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dob"
                      name="dateOfBirth"
                      value={dateOfBirth}
                      onChange={(e) => {
                        setDateOfBirth(e.target.value);
                        console.log("dateOfBirth:", e.target.value);
                      }}
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
                  <label htmlFor="address" className="text-sm font-semibold">
                    Address
                  </label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      console.log("address:", e.target.value);
                    }}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="bg-blue-600 text-primary-foreground text-sm flex items-center rounded-full w-6 justify-center">
                    2
                  </div>
                  <div>Employment Details</div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid flex-col gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="department"
                      className="text-sm font-semibold"
                    >
                      Department *
                    </label>
                    <div>
                      <Select
                        value={departmentId}
                        onValueChange={(value) => {
                          setDepartmentId(value);
                          console.log("departmentId:", value);
                        }}
                      >
                        <SelectTrigger
                          id="department"
                          className="w-full border rounded-md px-3 py-2 h-9 text-sm"
                        >
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
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="position" className="text-sm font-semibold">
                      Job Position *
                    </label>
                    <Input
                      type="text"
                      name="jobPosition"
                      id="position"
                      value={jobPosition}
                      onChange={(e) => {
                        setJobPosition(e.target.value);
                        console.log("jobPosition:", e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="hireDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Hire Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="hireDate"
                        name="hireDate"
                        value={hireDate}
                        onChange={(e) => {
                          setHireDate(e.target.value);
                          console.log("hireDate:", e.target.value);
                        }}
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
                    <label htmlFor="emp-type" className="text-sm font-semibold">
                      Employment Type *
                    </label>
                    <div>
                      <Select
                        value={employmentType}
                        onValueChange={(value) => {
                          setEmploymentType(value);
                          console.log("employmentType", value);
                        }}
                      >
                        <SelectTrigger
                          id="emp-type"
                          className="w-full border rounded-md px-3 py-2 h-9 text-sm"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMPLOYMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="bg-orange-600 text-primary-foreground text-sm flex items-center rounded-full w-6 justify-center">
                    3
                  </div>
                  <div>Compensation</div>
                </div>
              </div>
              <div className="grid flex-col gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="salary" className="text-sm font-semibold">
                    Salary *
                  </label>
                  <Input
                    type="number"
                    name="salary"
                    id="salary"
                    value={salary}
                    onChange={(e) => {
                      setSalary(e.target.value);
                      console.log("salary:", e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="payFrequency"
                    className="text-sm font-semibold"
                  >
                    Pay Frequency
                  </label>
                  <div>
                    <Select
                      value={payFrequency}
                      onValueChange={(value) => {
                        setPayFrequency(value);
                        console.log("payFrequency", value);
                      }}
                    >
                      <SelectTrigger
                        id="payFrequency"
                        className="w-full border rounded-md px-3 py-2 h-9 text-sm"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="Annually">Annualy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm border border-indigo-200 bg-gradient-to-br from-accent/10 to-blue-50/50 rounded-3xl p-6 flex flex-col gap-4">
            <p className="font-medium">Summary Preview</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground">
                  Full Name:{" "}
                  <span className="text-gray-800">{`${title} ${firstName} ${otherName} ${surname}`}</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Email: <span className="text-gray-800">{email || "N/A"}</span>
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
          <div className="flex gap-4 justify-end position-bottom">
            <button
              type="submit"
              className="bg-primary font-semibold text-white py-2 w-full rounded-full hover:bg-primary/95 flex justify-center items-center transition cursor-pointer"
            >
              Add Employee
            </button>
            <button
              type="button"
              className="bg-primary-foreground border font-semibold py-2 w-full rounded-full hover:bg-primary/80 hover:text-primary-foreground transition flex justify-center items-center cursor-pointer"
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
