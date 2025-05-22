/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { console } from 'inspector';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Splier } from './spiler.model';
const createSplierIntoDb = async (payload: any) => {
  const { phone } = payload;
  const phoneNumber = await Splier.findOne({ phone });
  if (phoneNumber) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number already exists');
  }

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
  console.log(id);
  const result = await Splier.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No supplier found');
  }

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
