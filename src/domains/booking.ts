import type { Domain } from "../types.js";

const slots: Record<string, string[]> = {
  "2026-11-03": ["09:00", "11:30", "15:00"],
  "2026-11-04": ["10:00", "14:00"],
};
const bookings: { id: string; name: string; date: string; time: string }[] = [];

export const booking: Domain = {
  id: "booking",
  label: "Service business (Bright Smile Dental)",
  greeting: "Welcome to Bright Smile Dental! I can help you book or ask about appointments.",
  instructions: "You handle appointment requests for Bright Smile Dental, a dental clinic.",
  knowledge: `- Services: checkup (30 min, $80), cleaning (45 min, $120), whitening (60 min, $250).
- Cancellations need 24h notice, otherwise a $40 fee.
- Hours: Mon-Fri 9am-5pm. Closed weekends.
- Never give medical advice; for pain or emergencies tell the customer to call (555) 010-2000.`,
  samplePrompts: ["What times are free on 2026-11-03?", "Book me for 2026-11-04 at 10:00, name Sam", "How much is a cleaning?", "My tooth really hurts, what should I do?"],
  tools: [
    {
      name: "check_availability",
      description: "List free appointment times for a date (YYYY-MM-DD).",
      input_schema: { type: "object", properties: { date: { type: "string" } }, required: ["date"] },
      run: ({ date }) => ({ date, free: slots[date] ?? [] }),
    },
    {
      name: "book_appointment",
      description: "Book a free slot for a customer.",
      input_schema: {
        type: "object",
        properties: { name: { type: "string" }, date: { type: "string" }, time: { type: "string" } },
        required: ["name", "date", "time"],
      },
      run: ({ name, date, time }) => {
        const free = slots[date];
        if (!free?.includes(time)) return { error: "Slot not available" };
        slots[date] = free.filter((t) => t !== time);
        const b = { id: "BK" + (bookings.length + 1), name, date, time };
        bookings.push(b);
        return { ok: true, booking: b };
      },
    },
  ],
};
