import { model, Schema } from "mongoose";
import {
  TAccountHealth,
  TCustomerServicePerformance,
  TOrderDefectRate,
  TPolicyCompliance,
  TShippingPerformance,
  TViolations,
} from "./health.interface";

const OrderDefectRateSchema = new Schema<TOrderDefectRate>({
  percentage: { type: Number, required: true, default: 0 },
  count: { type: Number, required: true, default: 0 },
  totalOrders: { type: Number, required: true, default: 0 },
  negativeFeedback: { type: Number, required: true, default: 0 },
  aToZGuaranteeClaims: { type: Number, required: true, default: 0 },
  chargeBackClaims: { type: Number, required: true, default: 0 },
});

const CustomerServicePerformanceSchema =
  new Schema<TCustomerServicePerformance>({
    orderDefectRate: { type: OrderDefectRateSchema, required: true },
  });

const ViolationsSchema = new Schema<TViolations>({
  suspectedIPViolations: { type: Number, required: true, default: 0 },
  ipComplaints: { type: Number, required: true, default: 0 },
  authenticityComplaints: { type: Number, required: true, default: 0 },
});

const PolicyComplianceSchema = new Schema<TPolicyCompliance>({
  accountHealthRating: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
  },
  violations: {
    type: ViolationsSchema,
    required: true,
  },
});

const ShippingPerformanceSchema = new Schema<TShippingPerformance>({
  lateShipmentRate: {
    type: Number,
    required: true,
    default: 0,
  },
  preFulfillmentCancelRate: {
    type: Number,
    required: true,
    default: 0,
  },
  validTrackingRate: {
    type: Number,
    required: true,
    default: 0,
  },
});

const AccountHealthSchema = new Schema<TAccountHealth>({
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: [true, "Shop is required"],
  },
  customerServicePerformance: {
    type: CustomerServicePerformanceSchema,
    required: true,
  },
  policyCompliance: { type: PolicyComplianceSchema, required: true },
  shippingPerformance: { type: ShippingPerformanceSchema, required: true },
});

export const ShopHealth = model("ShopHealth", AccountHealthSchema);
