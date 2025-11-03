import Medusa from "@medusajs/js-sdk";

const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY,
  auth: {
    type: "session", 
  },
});

export default medusaClient;