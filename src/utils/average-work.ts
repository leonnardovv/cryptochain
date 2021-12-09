import { Block } from "../block";
import { BlockChain } from "../blockchain";

const blockchain = new BlockChain();

blockchain.addBlock({ data: "initial" });
console.log("first block: ", blockchain.chain[blockchain.chain.length - 1]);
/** We'll keep track of the following variables where averageTime is the
 * average time it takes to mine a block
 */
let prevTimestamp: number,
  nextTimestamp: number,
  nextBlock: Block,
  timeDiff: number,
  averageTime: number;

const times = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({ data: `block ${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);
  averageTime = times.reduce((total, num) => total + num) / times.length;

  console.log(
    `Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${averageTime}`
  );
}
