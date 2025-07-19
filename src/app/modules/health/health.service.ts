import { ShopHealth } from "./health.model";

const createAccountHealth = async (shop: string) => {
  const customerServicePerformance = {
    orderDefectRate: {
      percentage: 0,
      count: 0,
      totalOrders: 0,
      negativeFeedback: 0,
      aToZGuaranteeClaims: 0,
      chargeBackClaims: 0,
    },
  };

  const policyCompliance = {
    accountHealthRating: 0,
    status: "Healthy",
    violations: {
      suspectedIPViolations: 0,
      ipComplaints: 0,
      authenticityComplaints: 0,
    },
  };

  const shippingPerformance = {
    lateShipmentRate: 0,
    preFulfillmentCancelRate: 0,
    validTrackingRate: 0,
  };

  const accountHealth = {
    shop: shop,
    customerServicePerformance,
    policyCompliance,
    shippingPerformance,
  };

  const result = await ShopHealth.create(accountHealth);

  return result;
};

export const ShopHealthServices = {
  createAccountHealth,
};
