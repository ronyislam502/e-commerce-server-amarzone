import { Types } from "mongoose";

export type TOrderDefectRate = {
  percentage: number;
  count: number;
  totalOrders: number;
  negativeFeedback: number;
  aToZGuaranteeClaims: number;
  chargeBackClaims: number;
};

export type TCustomerServicePerformance = {
  orderDefectRate: TOrderDefectRate;
};

export type TViolations = {
  suspectedIPViolations: number;
  ipComplaints: number;
  authenticityComplaints: number;
};

export type TPolicyCompliance = {
  accountHealthRating: number;
  status: string;
  violations: TViolations;
};

export type TShippingPerformance = {
  lateShipmentRate: number;
  preFulfillmentCancelRate: number;
  validTrackingRate: number;
};

export type TAccountHealth = {
  shop: Types.ObjectId;
  customerServicePerformance: TCustomerServicePerformance;
  policyCompliance: TPolicyCompliance;
  shippingPerformance: TShippingPerformance;
};
