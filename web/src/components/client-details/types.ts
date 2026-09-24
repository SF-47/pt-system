export type Client = {
  id: number;
  fullName: string;
  username: string;
  email: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

export type Payment = {
  id: number;
  clientName: string;
  amount: number;
  status: number;
  dueDate: string;
  paidAt: string | null;
};
