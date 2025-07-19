import { model, Schema } from "mongoose";
import { TSeller, TShopProduct } from "./shopProduct.interface";

const SellerSchema = new Schema<TSeller>({
  shop: {
    type: Schema.Types.ObjectId,
    required: [true, " shop is required"],
    ref: "Shop",
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  isStock: {
    type: Boolean,
    default: true,
  },
  fullFilmentBy: {
    type: String,
    required: [true, "fullFilmentBy is required"],
  },
  shippingTime: {
    type: Number,
    required: [true, "shippingTime is required"],
  },
  deliveryTime: {
    type: Number,
  },
  isBuyBoxWinner: {
    type: Boolean,
    default: false,
  },
});

const ShopProductSchema = new Schema<TShopProduct>(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: [true, "product id is required"],
      ref: "Product",
    },
    asin: {
      type: String,
      required: [true, "ASIN is required"],
    },
    seller: {
      type: SellerSchema,
      required: [true, "Seller is required"],
    },
  },
  { timestamps: true }
);

ShopProductSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ShopProductSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ShopProductSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const ShopProduct = model<TShopProduct>(
  "ShopProduct",
  ShopProductSchema
);
