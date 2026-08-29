import { WitnessContext } from '@midnight-ntwrk/compact-runtime';

export type UserPrivateData = {
  age: bigint;
  income: bigint;
};

export const credentialWitnesses = {
  fetchPrivateUserData: (context: WitnessContext<UserPrivateData>) => {
    return {
      age: context.privateState.age,
      income: context.privateState.income,
    };
  },
};
