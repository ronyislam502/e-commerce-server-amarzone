import { Types } from "mongoose";
import { PAYMENT_STATUS } from "../../interface/common";

export type TPayment = {
  user: Types.ObjectId;
  order: Types.ObjectId;
  stripePaymentIntentId: string;
  amount: number;
  transactionId: string;
  status: keyof typeof PAYMENT_STATUS;
};
