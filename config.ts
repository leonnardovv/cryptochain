/* Mine rate is represented in ms */
// export const MINE_RATE = 100000;
export const MINE_RATE = 1000;

const INITIAL_DIFFICULTY = 3;

export const GENESIS_DATA = {
  timestamp: Date.now(),
  lastHash: "-----",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
};
