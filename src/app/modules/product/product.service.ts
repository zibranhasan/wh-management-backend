/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import { Product } from './product.model';

import httpStatus from 'http-status';
const createProductIntoDb = async (payload: any) => {
  // console.log(payload);

  const isExistProcut = await Product.findOne(payload);
  if (isExistProcut) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This product allready Exists');
  }
  const result = await Product.create(payload);

  return result;
};

const getProductFromDb = async () => {
  const result = await Product.find({ isDeleted: false });

  return result;
};

export const productService = {
  createProductIntoDb,
  getProductFromDb,
};
