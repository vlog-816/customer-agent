import type { Domain } from "../types.js";

const orders: Record<string, any> = {
  "1001": { status: "shipped", carrier: "UPS", tracking: "1Z999AA10123456784", eta: "2026-11-04", items: ["Trail Backpack"], total: 89.0 },
  "1002": { status: "processing", items: ["Water Bottle", "Headlamp"], total: 42.5 },
  "1003": { status: "delivered", deliveredOn: "2026-10-20", items: ["Tent 2P"], total: 219.0 },
};

export const ecommerce: Domain = {
  id: "ecommerce",
  label: "Online store (TrailMart)",
  greeting: "Hi! I'm TrailMart's assistant. Ask me about orders, shipping or returns.",
  instructions: "You support customers of TrailMart, an outdoor gear online store.",
  knowledge: `- Shipping: standard 3-5 business days, free over $75.
- Returns: within 30 days of delivery, unused items, original packaging. Refund in 5-7 days.
- Orders can be cancelled only while status is "processing".
- Support hours: Mon-Fri 9am-5pm ET.`,
  samplePrompts: ["Where is my order 1001?", "Cancel order 1002", "Cancel order 1001", "Can I return my tent from order 1003?", "What's your refund policy?"],
  tools: [
    {
      name: "get_order",
      description: "Look up an order by its number.",
      input_schema: { type: "object", properties: { order_id: { type: "string" } }, required: ["order_id"] },
      run: ({ order_id }) => orders[order_id] ?? { error: "Order not found" },
    },
    {
      name: "cancel_order",
      description: "Cancel an order. Only works if status is 'processing'.",
      input_schema: { type: "object", properties: { order_id: { type: "string" } }, required: ["order_id"] },
      run: ({ order_id }) => {
        const o = orders[order_id];
        if (!o) return { error: "Order not found" };
        if (o.status !== "processing") return { error: `Cannot cancel: order is ${o.status}` };
        o.status = "cancelled";
        return { ok: true, order_id };
      },
    },
  ],
};
