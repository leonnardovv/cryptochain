import { GENESIS_DATA } from "../../config";
import { BlockChain } from "../blockchain";
import { Block } from "../block";

describe("Blockchain", () => {
  let chain: Block[],
    blockchain: BlockChain,
    newChain: BlockChain,
    originalChain: Block[];

  // before each test, we will reset the blockchain instance
  beforeEach(() => {
    blockchain = new BlockChain();
    newChain = new BlockChain();
    originalChain = blockchain.chain;
  });

  it(`contains a ${chain} Array instance`, () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.generateGenesisBlock());
  });

  it("adds a new block to the chain", () => {
    const newData = "foo bar";

    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when the chain doesn't start with the genesis block", () => {
      it("returns false", () => {
        //we alter the data field of the genesis block so we can test
        blockchain.chain[0] = {
          ...blockchain.chain[0],
          data: "fake-genesis",
        };

        expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain does start with the genesis block and has multiple blocks", () => {
      //invalid block when
      beforeEach(() => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Cars" });
        blockchain.addBlock({ data: "Coins" });
      });
      describe("and a lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken lastHash";

          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "some bad and evil data";

          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.c];
        });
      });

      describe("the chain doesn't contains invalid blocks", () => {
        it("returns true", () => {
          expect(BlockChain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let errorMock, logMock;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
      });
      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" });
        newChain.addBlock({ data: "Cars" });
        newChain.addBlock({ data: "Coins" });
      });
      describe("when the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "some-fake-hash";
          blockchain.replaceChain(newChain.chain);
        });
        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });
        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("when the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it("logs about chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
