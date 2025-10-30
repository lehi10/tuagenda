/**
 * Test script to verify user creation works
 * Run this to test database connectivity and user creation
 */

import { createUserInDatabase } from "./create-user.action";

async function testUserCreation() {
  console.log("🧪 Testing user creation...");

  const testUser = {
    id: "test-uid-" + Date.now(),
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    pictureFullPath: null,
  };

  console.log("Test user data:", testUser);

  try {
    const result = await createUserInDatabase(testUser);
    console.log("Result:", result);

    if (result.success) {
      console.log("✅ User creation test PASSED");
    } else {
      console.log("❌ User creation test FAILED:", result.error);
    }
  } catch (error) {
    console.error("❌ Test threw an error:", error);
  }
}

testUserCreation();
