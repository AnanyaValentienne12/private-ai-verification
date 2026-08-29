'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.7.0';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);
if (expectedRuntimeVersion[0] != actualRuntimeVersion[0]
     || (actualRuntimeVersion[0] == 0 && expectedRuntimeVersion[1] != actualRuntimeVersion[1])
     || expectedRuntimeVersion[1] > actualRuntimeVersion[1]
     || (expectedRuntimeVersion[1] == actualRuntimeVersion[1] && expectedRuntimeVersion[2] > actualRuntimeVersion[2]))
   throw new __compactRuntime.CompactError(`Version mismatch: compiled code expects ${expectedRuntimeVersionString}, runtime is ${__compactRuntime.versionString}`);
{ const MAX_FIELD = 102211695604070082112571065507755096754575920209623522239390234855480569854275933742834077002685857629445612735086326265689167708028928n;
  if (__compactRuntime.MAX_FIELD !== MAX_FIELD)
     throw new __compactRuntime.CompactError(`compiler thinks maximum field value is ${MAX_FIELD}; run time thinks it is ${__compactRuntime.MAX_FIELD}`)
}

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_2 = new __compactRuntime.CompactTypeBoolean();

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class Contract {
  witnesses;
  constructor(...args) {
    if (args.length !== 1)
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args.length}`);
    const witnesses = args[0];
    if (typeof(witnesses) !== 'object')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    if (typeof(witnesses.fetchPrivateAge) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named fetchPrivateAge');
    if (typeof(witnesses.fetchPrivateIncome) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named fetchPrivateIncome');
    this.witnesses = witnesses;
    this.circuits = {
      verifyEligibility: (...args_0) => {
        if (args_0.length !== 4)
          throw new __compactRuntime.CompactError(`verifyEligibility: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        const userId = args_0[1];
        const minAge = args_0[2];
        const minIncome = args_0[3];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('verifyEligibility',
                                      'argument 1 (as invoked from Typescript)',
                                      'enligibilityChecker.compact line 8, char 1',
                                      'CircuitContext',
                                      contextOrig)
        if (!(userId.buffer instanceof ArrayBuffer && userId.BYTES_PER_ELEMENT === 1 && userId.length === 32))
          __compactRuntime.type_error('verifyEligibility',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'enligibilityChecker.compact line 8, char 1',
                                      'Bytes<32>',
                                      userId)
        if (!(typeof(minAge) === 'bigint' && minAge >= 0 && minAge <= 4294967295n))
          __compactRuntime.type_error('verifyEligibility',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'enligibilityChecker.compact line 8, char 1',
                                      'Uint<0..4294967295>',
                                      minAge)
        if (!(typeof(minIncome) === 'bigint' && minIncome >= 0 && minIncome <= 4294967295n))
          __compactRuntime.type_error('verifyEligibility',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'enligibilityChecker.compact line 8, char 1',
                                      'Uint<0..4294967295>',
                                      minIncome)
        const context = { ...contextOrig };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(userId).concat(_descriptor_0.toValue(minAge).concat(_descriptor_0.toValue(minIncome))),
            alignment: _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_verifyEligibility_0(context,
                                                  partialProofData,
                                                  userId,
                                                  minAge,
                                                  minIncome);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      verifyEligibility: this.circuits.verifyEligibility
    };
  }
  initialState(...args) {
    if (args.length !== 1)
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args.length}`);
    const constructorContext = args[0];
    if (typeof(constructorContext) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state = new __compactRuntime.ContractState();
    let stateValue = __compactRuntime.StateValue.newArray();
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    state.data = stateValue;
    state.setOperation('verifyEligibility', new __compactRuntime.ContractOperation());
    const context = {
      originalState: state,
      currentPrivateState: constructorContext.initialPrivateState,
      currentZswapLocalState: constructorContext.initialZswapLocalState,
      transactionContext: new __compactRuntime.QueryContext(state.data, __compactRuntime.dummyContractAddress())
    };
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    state.data = context.transactionContext.state;
    return {
      currentContractState: state,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  #_fetchPrivateAge_0(context, partialProofData) {
    const witnessContext = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState, result] = this.witnesses.fetchPrivateAge(witnessContext);
    context.currentPrivateState = nextPrivateState;
    if (!(typeof(result) === 'bigint' && result >= 0 && result <= 4294967295n))
      __compactRuntime.type_error('fetchPrivateAge',
                                  'return value',
                                  'enligibilityChecker.compact line 5, char 1',
                                  'Uint<0..4294967295>',
                                  result)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result),
      alignment: _descriptor_0.alignment()
    });
    return result;
  }
  #_fetchPrivateIncome_0(context, partialProofData) {
    const witnessContext = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState, result] = this.witnesses.fetchPrivateIncome(witnessContext);
    context.currentPrivateState = nextPrivateState;
    if (!(typeof(result) === 'bigint' && result >= 0 && result <= 4294967295n))
      __compactRuntime.type_error('fetchPrivateIncome',
                                  'return value',
                                  'enligibilityChecker.compact line 6, char 1',
                                  'Uint<0..4294967295>',
                                  result)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result),
      alignment: _descriptor_0.alignment()
    });
    return result;
  }
  #_verifyEligibility_0(context, partialProofData, userId, minAge, minIncome) {
    const age = this.#_fetchPrivateAge_0(context, partialProofData);
    const income = this.#_fetchPrivateIncome_0(context, partialProofData);
    __compactRuntime.assert(!(age < minAge), 'Not Qualified due to Age');
    __compactRuntime.assert(!(income < minIncome), 'Not Qualified due to Income');
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(0n),
                                                alignment: _descriptor_4.alignment() } }
                                    ] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(userId),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(true),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }
                    ]);
  }
  static _query(context, partialProofData, prog) {
    var res;
    try {
      res = context.transactionContext.query(prog, __compactRuntime.CostModel.dummyCostModel());
    } catch (err) {
      throw new __compactRuntime.CompactError(err.toString());
    }
    context.transactionContext = res.context;
    var reads = res.events.filter((e) => e.tag === 'read');
    var i = 0;
    partialProofData.publicTranscript = partialProofData.publicTranscript.concat(prog.map((op) => {
      if(typeof(op) === 'object' && 'popeq' in op) {
        return { popeq: {
          ...op.popeq,
          result: reads[i++].content,
        } };
      } else {
        return op;
      }
    }));
    if(res.events.length == 1 && res.events[0].tag === 'read') {
      return res.events[0].content;
    } else {
      return res.events;
    }
  }
}
function ledger(state) {
  const context = {
    originalState: state,
    transactionContext: new __compactRuntime.QueryContext(state, __compactRuntime.dummyContractAddress())
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    qualifiedStatus: {
      isEmpty(...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`is_empty: expected 0 arguments, received ${args.length}`);
        return _descriptor_2.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_4.toValue(0n),
                                                                                   alignment: _descriptor_4.alignment() } }
                                                                       ] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                               alignment: _descriptor_3.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      size(...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args.length}`);
        return _descriptor_3.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_4.toValue(0n),
                                                                                   alignment: _descriptor_4.alignment() } }
                                                                       ] } },
                                                        'size',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      member(...args) {
        if (args.length !== 1)
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args.length}`);
        const key = args[0];
        if (!(key.buffer instanceof ArrayBuffer && key.BYTES_PER_ELEMENT === 1 && key.length === 32))
          __compactRuntime.type_error('member',
                                      'argument 1',
                                      'enligibilityChecker.compact line 3, char 1',
                                      'Bytes<32>',
                                      key)
        return _descriptor_2.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_4.toValue(0n),
                                                                                   alignment: _descriptor_4.alignment() } }
                                                                       ] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key),
                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                        'member',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      lookup(...args) {
        if (args.length !== 1)
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args.length}`);
        const key = args[0];
        if (!(key.buffer instanceof ArrayBuffer && key.BYTES_PER_ELEMENT === 1 && key.length === 32))
          __compactRuntime.type_error('lookup',
                                      'argument 1',
                                      'enligibilityChecker.compact line 3, char 1',
                                      'Bytes<32>',
                                      key)
        return _descriptor_2.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_4.toValue(0n),
                                                                                   alignment: _descriptor_4.alignment() } }
                                                                       ] } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_1.toValue(key),
                                                                                   alignment: _descriptor_1.alignment() } }
                                                                       ] } },
                                                        { popeq: { cached: false,
                                                                   result: undefined } }
                                                       ]).value);
      },
      [Symbol.iterator](...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args.length}`);
        const self = state.asArray()[0];
        return self.asMap().keys().map(  (key) => {    const value = self.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_2.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  fetchPrivateAge: (...args) => undefined,
  fetchPrivateIncome: (...args) => undefined
});
const pureCircuits = { };
const contractReferenceLocations = { tag: 'publicLedgerArray', indices: { } };
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
//# sourceMappingURL=index.cjs.map
