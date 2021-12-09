import { GENESIS_DATA, MINE_RATE } from "../config";
import { generateCryptoHash } from "./crypto-hash";
import hexToBinary from "hex-to-binary";

export class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: any;
  nonce: number;
  difficulty: number;

  constructor({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  }: {
    timestamp: number;
    lastHash: string;
    hash: string;
    data: any;
    nonce: number;
    difficulty: number;
  }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static generateGenesisBlock() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }: { lastBlock: Block; data: any }) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0; //we define it as "let" because we want the nonce to adjust while mining blocks

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = generateCryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new this({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }

  static adjustDifficulty({
    originalBlock,
    timestamp,
  }: {
    originalBlock: Block;
    timestamp: number;
  }) {
    const { difficulty } = originalBlock;

    if (difficulty < 1) {
      return 1;
    }
    /* difference between mined blocks timestamps */
    const difference = timestamp - originalBlock.timestamp;

    /* if the difference is bigger than our mine rate, we will decrease the
      difficulty, otherwise we will increase it */
    if (difference > MINE_RATE) {
      return difficulty - 1;
    }

    return difficulty + 1;
  }
}

// const block1 = new Block({
//   timestamp: Date.now(),
//   lastHash: "foo-lastHash",
//   hash: "foo-hash",
//   data: "foo-data",
//   nonce: 0,
//   difficulty: 3,
// });

// console.log("Block1: ", block1);
