async function checkReturnReasons() {
  const baseUrl = "http://localhost:9000";
  const pubKey = "";

  try {
    console.log(`Attempting to fetch ${baseUrl}/store/return-reasons...`);
    const response = await fetch(`${baseUrl}/store/return-reasons`, {
      headers: {
        "x-publishable-api-key": pubKey,
      }
    });
    
    console.log("Status:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("Return Reasons:", JSON.stringify(data, null, 2));
    } else {
      console.log("Failed.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkReturnReasons();
