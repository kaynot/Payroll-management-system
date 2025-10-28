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

export const AddEmployee = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        onClick={() => setOpen(true)}
        className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition duration-300"
      >
        <Plus size={16} color="#fff" strokeWidth={3} />
        Add Employee
      </DialogTrigger>
      <DialogContent className="space-y-6 h-[90%] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 md:max-w-2xl lg:max-w-3xl">
        <DialogHeader className="flex space-y-2">
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the employee information to add them to the system
          </DialogDescription>
        </DialogHeader>
        <form action="#" method="post" className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="bg-primary text-primary-foreground text-sm flex items-center rounded-full w-6 justify-center">
                    1
                  </div>
                  <div>Personal Information</div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Full Name *</label>
                  <Input type="text" required />
                </div>
              </div>
              <div className="grid flex-col grid-cols-2 sm:gap-2 md-gap-4 lg:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">
                    Email Address *
                  </label>
                  <Input type="email" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Phone Number</label>
                  <Input type="tel" />
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
                      name="dob"
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
                  <label className="text-sm font-semibold">Address</label>
                  <Input type="text" />
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
                <div className="grid flex-col grid-cols-2 sm:gap-2 md-gap-4 lg:gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">
                      Department *
                    </label>
                    <div>
                      <Select>
                        <SelectTrigger className="w-full border rounded-md px-3 py-2 h-9 text-sm">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">
                      Job Position *
                    </label>
                    <Input type="text" required />
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
                    <label className="text-sm font-semibold">
                      Employment Type *
                    </label>
                    <div>
                      <Select>
                        <SelectTrigger className="w-full border rounded-md px-3 py-2 h-9 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-tIme</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="nss">National Service</SelectItem>
                          <SelectItem value="intern">Internship</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">
                    Reporting Manager
                  </label>
                  <Input type="text" className="w-full h-9" />
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
              <div className="grid flex-col grid-cols-2 sm:gap-2 md-gap-4 lg:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Salary *</label>
                  <Input type="number" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Pay Frequency</label>
                  <div>
                    <Select>
                      <SelectTrigger className="w-full border rounded-md px-3 py-2 h-9 text-sm">
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
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">
                    Employment Status
                  </label>
                  <div>
                    <Select>
                      <SelectTrigger className="w-full border rounded-md px-3 py-2 h-9 text-sm">
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
            </div>
          </div>

          <div className="text-sm border border-indigo-200 bg-gradient-to-br from-accent/10 to-blue-50/50 rounded-3xl p-6 flex flex-col gap-4">
            <p className="font-medium">Summary Preview</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground">
                  Name: <span className="text-black">..........</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Name: <span className="text-black">..........</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Name: <span className="text-black">..........</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Name: <span className="text-black">..........</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-end position-bottom">
            <button className="bg-primary font-semibold text-white py-2 w-full rounded-full hover:bg-primary/95 flex justify-center items-center transition cursor-pointer">
              Add Employee
            </button>
            <button
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
