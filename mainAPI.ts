import { Contract } from './managed/eligibility/contract/index.cjs';
import { credentialWitnesses, UserPrivateData } from './witness';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';

export async function executeVerification(
  userId: Uint8Array,
  publicCriteria: { minAge: number; minIncome: number }, 
  privateApplicantData: { age: number; income: number } 
): Promise<{ verified: boolean; tx?: any; error?: string }> 
{
  const initialPrivateState: UserPrivateData = {
    age: BigInt(privateApplicantData.age), //assign the data HERE!!! replace BigInt( age and income)
    income: BigInt(privateApplicantData.income), //assign the data HERE!!! replace BigInt( age and income)
  };

  // initialize the WASM proof engine directly in the browser runtime
  const proofProvider = httpClientProofProvider(
    'http://127.0.0.1:6300',
    'http://127.0.0.1:6300' as any
  );
  

  //Configure providers to use local WASM + network endpoints
  const providers = {
    proofProvider: proofProvider,
    publicDataProvider: {
      indexer: 'https://indexer.devnet.midnight.network',
      node: 'https://rpc.devnet.midnight.network',
    },
  } as any;

  const contractInstance = await deployContract(providers, {
      contractInstance: new Contract(credentialWitnesses),
      initialPrivateState: initialPrivateState,
  } as any);

try {
    const tx = await contractInstance.callTx.verifyEligibility(
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