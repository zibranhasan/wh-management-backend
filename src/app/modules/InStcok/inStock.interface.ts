export type TProduct = {
  productName: string;
  productQuantity: number;
  productPrice: number;
  isDeleted?: boolean;
};

export type TStockIn = {
  invoiceNumber: string;
  vehicleNumber?: string;
  supplierName: string;
  products: TProduct[];
  date?: Date;
  isDeleted?: boolean;
};
