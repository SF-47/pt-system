// Existing sample records, shared by the roster, profile, payments, and dashboard.
export type Client = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  paymentStatus: "Paid" | "Pending";
};

export const clients: Client[] = [
  {
    id: 1,
    fullName: "Ahmad Hassan",
    email: "ahmad@example.com",
    phoneNumber: "70123456",
    paymentStatus: "Paid",
  },
  {
    id: 2,
    fullName: "Rami Ali",
    email: "rami@example.com",
    phoneNumber: "71111222",
    paymentStatus: "Pending",
  },
];

export type Payment = {
  id: number;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending";
};

export const payments: Payment[] = [
  {
    id: 1,
    clientName: "Ahmad Hassan",
    amount: 50,
    dueDate: "2026-09-30",
    status: "Paid",
  },
  {
    id: 2,
    clientName: "Rami Ali",
    amount: 50,
    dueDate: "2026-09-30",
    status: "Pending",
  },
];

