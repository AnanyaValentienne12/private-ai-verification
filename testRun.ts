import { executeVerification } from './mainAPI.js';

async function runTest() {
  console.log("Starting Midnight ZK Verification Test...\n");

  // Create a 32-byte dummy userId (Bytes<32> in Compact)
  const dummyUserId = new Uint8Array(32).fill(1);

  // Test Case 1: Passing Criteria
  console.log("--- Test Case 1: Qualified Applicant ---");
  const passingResult = await executeVerification(
    dummyUserId,
    { minAge: 21, minIncome: 30000 },//test conditions
    { age: 25, income: 50000 }//test variables
  );
  console.log("Result 1:", passingResult);

  // Test Case 2: Failing Criteria (Triggers ZK assertion failure)
  console.log("\n--- Test Case 2: Underage Applicant ---");
  const failingResult = await executeVerification(
    dummyUserId,
    { minAge: 20, minIncome: 10000 },//test conditions
    { age: 25, income: 9000 }//test variables
  );
  console.log("Result 2:", failingResult);
}

runTest().catch((err) => {
  console.error("Fatal Test Execution Error:", err);
});