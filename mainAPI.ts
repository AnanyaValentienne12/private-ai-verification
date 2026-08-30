import { Contract } from './managed/eligibility/contract/index.js';
import { credentialWitnesses, UserPrivateData } from './witness.js';
import {
  createCircuitContext,
  emptyZswapLocalState,
  sampleContractAddress,
  createConstructorContext,
} from '@midnight-ntwrk/compact-runtime';

export async function executeVerification(
  userId: Uint8Array,
  publicCriteria: { minAge: number; minIncome: number },
  privateApplicantData: { age: number; income: number }
): Promise<{ verified: boolean; tx?: any; error?: string }> {
  const initialPrivateState: UserPrivateData = {
    age: BigInt(privateApplicantData.age),
    income: BigInt(privateApplicantData.income), //change input here!!
  };

  try {
    const contractInstance = new Contract(credentialWitnesses);

    // Local-only address for now — swap for a real one once deployed
    const contractAddress = sampleContractAddress();

    // Compact needs a ledger snapshot to build a QueryContext against,
    // even with no `ledger` fields — so run the constructor once.
    const { currentContractState } = await contractInstance.initialState(
      createConstructorContext(initialPrivateState, '00'.repeat(32)) // placeholder coin public key
    );

    const circuitContext = createCircuitContext(
      'verifyEligibility',
      contractAddress,
      emptyZswapLocalState('00'.repeat(32)),   // see fix #4
      currentContractState,
      initialPrivateState
    );

    const result = await contractInstance.circuits.verifyEligibility(
      circuitContext,
      userId,
      BigInt(publicCriteria.minAge), //employer's criteria here!!
      BigInt(publicCriteria.minIncome)
    );

    return { verified: true, tx: result }; //returns true/false
  } catch (error: any) {
    console.error("Verification failed:", error);
    return { verified: false, error: error.message ?? "Applicant did not meet eligibility criteria." };
  }
}