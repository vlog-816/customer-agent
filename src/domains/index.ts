import type { Domain } from "../types.js";
import { ecommerce } from "./ecommerce.js";
import { saas } from "./saas.js";
import { booking } from "./booking.js";
import { qa } from "./qa.js";

// To add a domain: create a file exporting a Domain and list it here.
export const domains: Domain[] = [qa, ecommerce, saas, booking];
export const getDomain = (id: string) => domains.find((d) => d.id === id);
