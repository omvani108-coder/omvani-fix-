/**
 * Pure logic for the razorpay-checkout edge function.
 *
 * Exported so tests can import directly — no copy-paste.
 */

export interface PlanConfig {
  name: string;
  type: "subscription" | "order";
  razorpay_plan_id?: string;
  amount?: number;    // paise — only for one-time orders
  currency?: string;
}

/**
 * Plan configurations.
 *
 * Note: razorpay_plan_id values come from env vars at runtime.
 * For testing, we verify the static structure and amounts.
 */
export const PLAN_STRUCTURE: Record<string, Omit<PlanConfig, "razorpay_plan_id"> & { has_plan_id: boolean }> = {
  basic:        { name: "Sadhak Monthly",  type: "subscription", has_plan_id: true },
  basic_annual: { name: "Sadhak Annual",   type: "order", amount: 149900, currency: "INR", has_plan_id: false },
  pro:          { name: "Guru Monthly",    type: "subscription", has_plan_id: true },
  pro_annual:   { name: "Guru Annual",     type: "order", amount: 299900, currency: "INR", has_plan_id: false },
  family:       { name: "Family Monthly",  type: "subscription", has_plan_id: true },
};

export const VALID_PLAN_IDS = Object.keys(PLAN_STRUCTURE);

/** Kundli one-time analysis price in paise */
export const KUNDLI_AMOUNT = 7900; // ₹79

/** Sadhana report one-time price in paise */
export const SADHANA_REPORT_AMOUNT = 3000; // ₹30
