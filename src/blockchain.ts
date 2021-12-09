import { Block } from "./block";
import { generateCryptoHash } from "./crypto-hash";

export class BlockChain {
  chain: Block[];
  constructor() {
    this.chain = [Block.generateGenesisBlock()];
  }

  addBlock({ data }: { data: any }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }

  static isValidChain(chain: Array<Block>) {
    if (
      JSON.stringify(chain[0]) !== JSON.stringify(Block.generateGenesisBlock())
    ) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const actualLastHash = chain[i - 1].hash;

      const { timestamp, lastHash, hash, data, nonce, difficulty } = block;
      if (lastHash !== actualLastHash) {
        return false;
      }

      const validatedHash = generateCryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validatedHash) {
        return false;
      }
    }

    return true;
  }

  replaceChain(chain: Block[]) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!BlockChain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    console.log("Replacing chain with ", chain);
    this.chain = chain;
  }
}

// const blockchain = new BlockChain();

// const lastBlock = blockchain.chain[blockchain.chain.length - 1];
// const data = "My data";

// blockchain.addBlock({ data });
// blockchain.addBlock({ data });
// blockchain.addBlock({ data });
// blockchain.addBlock({ data });
// blockchain.addBlock({ data });

// console.log("New blockChain: ", blockchain);
