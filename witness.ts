import { WitnessContext } from '@midnight-ntwrk/compact-runtime';
import { Ledger } from './managed/eligibility/contract/index.cjs';

export interface UserPrivateData {
  age: bigint;
  income: bigint;
}

export const credentialWitnesses = {
  fetchPrivateAge: (context: WitnessContext<Ledger, UserPrivateData>): [UserPrivateData, bigint] => {
    return [context.privateState, context.privateState.age];
  },
  fetchPrivateIncome: (context: WitnessContext<Ledger, UserPrivateData>): [UserPrivateData, bigint] => {
    return [context.privateState, context.privateState.income];
  },
};