export type TBuyer = {
  name: string;
  phone: string;
  address: string;
  products: [];
  totalPurchase?: number;
  totalDue?: number;
  paymentHistory?: [];
  date?: Date;
  totalPay?: number;
  isDeleted?: boolean;
};
