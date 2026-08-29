import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  fetchPrivateAge(context: __compactRuntime.WitnessContext<Ledger, T>): [T, bigint];
  fetchPrivateIncome(context: __compactRuntime.WitnessContext<Ledger, T>): [T, bigint];
}

export type ImpureCircuits<T> = {
  verifyEligibility(context: __compactRuntime.CircuitContext<T>,
                    userId: Uint8Array,
                    minAge: bigint,
                    minIncome: bigint): __compactRuntime.CircuitResults<T, void>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  verifyEligibility(context: __compactRuntime.CircuitContext<T>,
                    userId: Uint8Array,
                    minAge: bigint,
                    minIncome: bigint): __compactRuntime.CircuitResults<T, void>;
}

export type Ledger = {
  qualifiedStatus: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: Uint8Array): boolean;
    lookup(key: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
