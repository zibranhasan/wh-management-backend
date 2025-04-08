import { StockIn } from './inStock.model';
import { TStockIn } from './inStock.interface';

const CreateInStockIntoDb = async (data: TStockIn) => {
  console.log(data, 'data');
  const result = await StockIn.create(data);
  return result;
};

const getAllInStockFromDb = async () => {
  const result = await StockIn.find({}).sort({ createdAt: -1 });

  return result;
};

const deleteProductStockInFromDb = async (
  stockInId: string,
  productId: string,
) => {
  const result = await StockIn.findOneAndUpdate(
    {
      _id: stockInId,
      'products._id': productId,
    },
    {
      $set: { 'products.$.isDeleted': true },
    },
    { new: true },
  );
  return result;
};

export const inStcokService = {
  CreateInStockIntoDb,
  deleteProductStockInFromDb,
  getAllInStockFromDb,
};
