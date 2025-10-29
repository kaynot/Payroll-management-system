export interface Employee {
  name: any;
  image: string;
  joinDate: string | number | readonly string[] | undefined;
  id: string | number;
  title?: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
  department: string;
  position: string;
  hireDate?: string;
  employmentType: string;
  manager?: string;
  salary: 5000 | number | string;
  payFrequency?: string;
  status?: "Active" | "Inactive" | "Leave";
  photoUrl?: string;
}
