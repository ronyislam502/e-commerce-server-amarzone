import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import { ShopProduct } from "../shopProduct/shopProduct.model";
import { generateOrderNo } from "./order.utilities";
import { Order } from "./order.model";
import QueryBuilder from "../../builder/queryBuilder";
import { Vendor } from "../vendor/vendor.model";
import { Shop } from "../shop/shop.model";
import { Customer } from "../customer/customer.model";
import mongoose from "mongoose";
import { TOrder } from "./order.interface";

const createOrderIntoDB = async (payload: TOrder) => {
  const { customer, shop, products } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productDetails: {
      product: mongoose.Types.ObjectId;
      quantity: number;
    }[] = [];
    let totalPrice = 0;
    let totalQuantity = 0;

    for (const item of products) {
      const isProduct = await Product.findById(item.product).session(session);
      if (!isProduct)
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");

      const isShopProduct = await ShopProduct.findOne({
        product: isProduct._id,
        "seller.shop": shop,
        "seller.isBuyBoxWinner": true,
      }).session(session);

      if (!isShopProduct) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "This product not found from any seller/shop"
        );
      }

      if (item.quantity > isShopProduct.seller.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `${isProduct.title} out of stock, available ${isShopProduct.seller.quantity}`
        );
      }

      productDetails.push({ product: isProduct._id, quantity: item.quantity });

      totalPrice += +(isShopProduct.seller.price * item.quantity).toFixed(2);
      totalQuantity += item.quantity;

      //  Stock Update
      const updatedQty = isShopProduct.seller.quantity - item.quantity;
      const isStock = updatedQty > 0;

      await ShopProduct.findByIdAndUpdate(
        isShopProduct._id,
        {
          $set: {
            "seller.quantity": updatedQty,
            isStock,
          },
        },
        { session }
      );
    }

    const tax = +(totalPrice * 0.1).toFixed(2);
    const grandAmount = totalPrice + tax;

    const orderNo = await generateOrderNo();
    const today = new Date();
    const transactionId =
      "A2Z" +
      today.getFullYear() +
      (today.getMonth() + 1) +
      today.getDate() +
      today.getHours() +
      today.getMinutes() +
      today.getSeconds();

    const order = await Order.create(
      [
        {
          customer,
          shop,
          orderNo,
          products: productDetails,
          totalQuantity,
          tax,
          totalPrice,
          grandAmount,
          status: "PENDING",
          paymentStatus: "PENDING",
          transactionId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Order creation failed: ${error?.message}`
    );
  }
};

const allOrdersFromDB = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(
    Order.find()
      .populate("customer", "name email phone address")
      .populate("shop", "shopName shopEmail shopPhone"),
    query
  )
    .search(["orderNo"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ordersQuery.countTotal();
  const data = await ordersQuery.modelQuery;

  return { meta, data };
};

const vendorAllOrdersFromDB = async (
  email: string,
  query: Record<string, unknown>
) => {
  const isVendor = await Vendor.findOne({ email });

  if (!isVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  const isVendorShopExists = isVendor.isShopped;

  if (!isVendorShopExists) {
    throw new AppError(httpStatus.NOT_FOUND, "this vendor shop not found");
  }

  const isShopped = await Shop.findOne({ vendor: isVendor._id });

  if (!isShopped) {
    throw new AppError(httpStatus.NOT_FOUND, "shop not found ");
  }

  const vendorOrdersQuery = new QueryBuilder(
    Order.find({ shop: isShopped?._id })
      .populate("customer", "name email phone address")
      .populate("shop", "shopName shopEmail shopPhone"),
    query
  )
    .search(["orderNo"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await vendorOrdersQuery.countTotal();
  const data = await vendorOrdersQuery.modelQuery;

  return { meta, data };
};

const customerAllOrdersFromDB = async (
  email: string,
  query: Record<string, unknown>
) => {
  const isCustomer = await Customer.findOne({ email });

  if (!isCustomer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  const customerOrdersQuery = new QueryBuilder(
    Order.find({ customer: isCustomer?._id }).populate(
      "shop",
      "shopName shopEmail shopPhone"
    ),
    query
  )
    .search(["orderNo"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await customerOrdersQuery.countTotal();
  const data = await customerOrdersQuery.modelQuery;

  return { meta, data };
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate("customer").populate("shop");

  return result;
};

export const OrderServices = {
  createOrderIntoDB,
  allOrdersFromDB,
  vendorAllOrdersFromDB,
  customerAllOrdersFromDB,
  getSingleOrderFromDB,
};
