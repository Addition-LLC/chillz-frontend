const Medusa = require("@medusajs/js-sdk").default;

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  publishableKey: "pk_dummy",
  auth: {
    type: "session",
  },
});

console.log("Medusa Client Methods:");
// Inspect the 'store' property which usually contains store-front methods
if (medusa.store) {
  console.log("medusa.store keys:", Object.keys(medusa.store));
  
  // Check for return related methods
  if (medusa.store.return) {
    console.log("medusa.store.return methods:", Object.keys(medusa.store.return));
  }
  if (medusa.store.returnReason) {
    console.log("medusa.store.returnReason methods:", Object.keys(medusa.store.returnReason));
  }
  
  // Check for promotion related methods
  if (medusa.store.promotion) {
    console.log("medusa.store.promotion methods:", Object.keys(medusa.store.promotion));
  }
} else {
  console.log("medusa.store is undefined. Inspecting root object keys:", Object.keys(medusa));
}
