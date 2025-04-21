/* eslint-disable @typescript-eslint/no-explicit-any */
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
  let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  const result = await Splier.find(
    {
      $or: splierSearchableFileds.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    },
    { isDeleted: false },
  );

  return result;
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
