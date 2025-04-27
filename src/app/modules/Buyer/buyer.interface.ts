export type TBuyer = {
  name: string;
  phone: string;
  address: string;
  products: [];
  totalPurchase?: number;
  totalDue?: number;
  paymentHistory?: {
    amount: number;
    date: Date;
  }[];
  date?: Date;
  totalPay?: number;
  isDeleted?: boolean;
};
