import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TShop } from "./shop.interface";
import { Shop } from "./shop.model";
import QueryBuilder from "../../builder/queryBuilder";
import { Vendor } from "./../vendor/vendor.model";
import { ShopHealthServices } from "../health/health.service";

const createShopIntoDB = async (payload: TShop) => {
  const isVendor = await Vendor.findById(payload?.vendor);
  if (!isVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  const alreadyIsShopped = isVendor.isShopped;

  if (alreadyIsShopped) {
    throw new AppError(httpStatus.BAD_REQUEST, "already created shop!");
  }
  const result = await Shop.create(payload);
  const shopId = result._id.toString();

  await Vendor.findByIdAndUpdate(isVendor.id, { isShopped: true });
  await ShopHealthServices.createAccountHealth(shopId);

  return result;
};

const allShopsFromDB = async (query: Record<string, unknown>) => {
  const shopQuery = new QueryBuilder(Shop.find().populate("vendor"), query)
    .search(["shopName", "shopEmail", "shopPhone"])
    .filter()
    .sort()
    .fields();

  const meta = await shopQuery.countTotal();
  const data = await shopQuery.modelQuery;

  return { meta, data };
};

const singleShopFromDB = async (id: string) => {
  const result = await Shop.findById(id);

  return result;
};

const myShopFromDB = async (email: string) => {
  const isVendor = await Vendor.findOne({ email });
  if (!isVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  const result = await Shop.findOne({
    vendor: isVendor?._id,
  }).populate("vendor");

  return result;
};

export const ShopServices = {
  createShopIntoDB,
  allShopsFromDB,
  singleShopFromDB,
  myShopFromDB,
};
