const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1";

const testAPIs = async () => {
  console.log("🚀 Starting API Tests...");

  try {
    // 1. Register User
    console.log("\n1️⃣ Testing Registration...");
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test Patient",
      email: "patient@test.com",
      password: "password123",
      role: "patient",
    });
    console.log("✅ Registration Success:", regRes.status);
    console.log(regRes.data);

    // 2. Login User
    console.log("\n2️⃣ Testing Login...");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: "patient@test.com",
      password: "password123",
    });
    const { accessToken } = loginRes.data;
    console.log("✅ Login Success:", loginRes.status);
    console.log("Token received:", accessToken.substring(0, 20) + "...");

    // 3. Register a Doctor (as Admin - need an admin user first)
    console.log("\n3️⃣ Registering a Doctor...");
    const docRegRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Dr. Smith",
      email: "smith@test.com",
      password: "password123",
      role: "doctor",
    });
    console.log("✅ Doctor User Created:", docRegRes.status);
    const doctorUserId = docRegRes.data.data.user.id;

    // Login as Doctor to complete profile (Wait, doctor profile creation might need an extra step or it's automatic)
    // In our model, Doctor is a separate collection. Let's see if registration created it.
    // Actually, usually we have a route for "Apply as Doctor".
    
    // For now, let's just test if we can get doctors
    console.log("\n4️⃣ Getting All Doctors...");
    const docsRes = await axios.get(`${BASE_URL}/patients/doctors`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log("✅ Get Doctors Success:", docsRes.status);
    console.log("Doctors found:", docsRes.data.results);

  } catch (error) {
    console.error("❌ Test Failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

testAPIs();
