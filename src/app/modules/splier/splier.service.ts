/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import { Splier } from './spiler.model';

const createSplierIntoDb = async (payload: any) => {
  const result = await Splier.create(payload);

  return result;
};
const getAllSplierIntoDb = async ({
  query,
}: {
  query: Record<string, unknown>;
}) => {
  const splierSearchableFileds = ['name', 'phone', 'adress'];
  const SupplierQuery = new QueryBuilder(
    Splier.find({ isDeleted: false }),

    query,
  )
    .search(splierSearchableFileds)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await SupplierQuery.countTotal();
  const result = await SupplierQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingelSplierIntoDb = async (id: string) => {
  const result = await Splier.findById(id);

  return result;
};
const deleteSingelSplier = async (id: string) => {
  const result = await Splier.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};
const UpdateSingelSplierIntoDb = async (id: string, payload: any) => {
  const result = await Splier.findByIdAndUpdate(
    id,

    payload,
    { new: true },
  );

  return result;
};

export const splierService = {
  createSplierIntoDb,
  getSingelSplierIntoDb,
  getAllSplierIntoDb,
  deleteSingelSplier,
  UpdateSingelSplierIntoDb,
};
