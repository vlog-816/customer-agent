import type { Domain } from "../types.js";

const accounts: Record<string, any> = {
  "ana@example.com": { plan: "Pro", seats: 5, nextInvoice: "2026-11-15", amount: 75, status: "active" },
  "bob@example.com": { plan: "Free", seats: 1, status: "active" },
  "cy@example.com": { plan: "Pro", seats: 3, status: "past_due", lastPaymentError: "card_declined" },
};

export const saas: Domain = {
  id: "saas",
  label: "Software / SaaS (Plotly-ish app)",
  greeting: "Hello! I'm the support assistant for DataDash. How can I help with your account?",
  instructions: "You support users of DataDash, a dashboard SaaS product.",
  knowledge: `- Plans: Free (1 seat), Pro ($15/seat/month), Enterprise (contact sales).
- Password reset: Settings > Security > Reset password, or the "Forgot password" link on login.
- Billing: invoices are emailed on the 15th. Cancel any time; access continues to period end.
- Data export: Settings > Data > Export CSV.
- Refunds are not given for partial months.`,
  samplePrompts: ["What plan is ana@example.com on?", "Why was cy@example.com's payment declined?", "How do I export my data?", "I want a refund for last month", "Your app deleted my dashboard, this is unacceptable!"],
  tools: [
    {
      name: "get_account",
      description: "Look up a customer's account by email.",
      input_schema: { type: "object", properties: { email: { type: "string" } }, required: ["email"] },
      run: ({ email }) => accounts[email] ?? { error: "Account not found" },
    },
  ],
};
