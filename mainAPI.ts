import { Contract } from './managed/eligibility/contract/index.js';
import { credentialWitnesses, UserPrivateData } from './witness.js';
import { createWasmProofProvider } from '@midnight-ntwrk/proof-provider-wasm';

export async function executeVerification(
  userId: Uint8Array,
  publicCriteria: { minAge: number; minIncome: number }, //employer's conditions from Ai can be handled here
  privateApplicantData: { age: number; income: number }   //applicant data can be handled through here
): Promise<{ verified: boolean; tx?: any; error?: string }> 
{
  const initialPrivateState: UserPrivateData = {
    age: BigInt(privateApplicantData.age), //assign the data HERE!!! replace BigInt( age and income)
    income: BigInt(privateApplicantData.income), //assign the data HERE!!! replace BigInt( age and income)
  };

  // initialize the WASM proof engine directly in the browser runtime
  const wasmProofProvider = await createWasmProofProvider();

  //Configure providers to use local WASM + network endpoints
  const providers = {
    proofProvider: wasmProofProvider, // WASM engine handles ZK proofs locally
    indexer: 'https://indexer.devnet.midnight.network',
    node: 'https://rpc.devnet.midnight.network',
  };

  const contractInstance = await Contract.deployOrJoin({
    witnesses: credentialWitnesses,
    initialPrivateState: initialPrivateState,
    providers: providers,
  });

  try {
    const tx = await contractInstance.circuits.verifyEligibility(
      userId,
      BigInt(publicCriteria.minAge), // Enter Employer's criteria HERE!!!
      BigInt(publicCriteria.minIncome) // Enter Employer's criteria HERE!!!
    );

    //Returns true if proof generation & submission succeed
    return { verified: true, tx };

  } catch (error) {
    //Returns false if an assertion fails (age/income requirement not met)
    console.error("Verification failed:", error);
    return { verified: false, error: "Applicant did not meet eligibility criteria." };
  }
}