import fs from "fs";

async function run() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@gmail.com",
        password: "Admin@123",
      }),
    });

    console.log("Login status:", loginRes.status);
    const loginText = await loginRes.text();
    console.log("Login text:", loginText);
    const loginData = JSON.parse(loginText);
    console.log("Login result:", JSON.stringify(loginData, null, 2));

    if (!loginData.success) {
      console.error("Login failed!");
      return;
    }

    const token = loginData.data.token;

    // Create a dummy small image file for upload
    const dummyImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync("dummy.png", dummyImageBuffer);

    // 2. Create Product
    console.log("Creating product...");
    const formData = new FormData();
    formData.append("name", "Test Product " + Date.now());
    formData.append("description", "Test Description");
    formData.append("category", "Test Category");
    formData.append("price", "123.45");
    formData.append("stock", "50");
    
    // Create Blob from file
    const fileBlob = new Blob([dummyImageBuffer], { type: "image/png" });
    formData.append("images", fileBlob, "dummy.png");

    const createRes = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("Create product status:", createRes.status);
    const createData = await createRes.json();
    console.log("Create product result:", JSON.stringify(createData, null, 2));

    // Clean up
    fs.unlinkSync("dummy.png");

  } catch (error) {
    console.error("Error in test script:", error);
  }
}

run();
