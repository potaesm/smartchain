const { GENESIS_DATA } = require('../config');
const { keccakHash } = require('../util');

const HASH_LENGHT = 64;
const MAX_HASH_VALUE = parseInt('f'.repeat(HASH_LENGHT), 16);
const MAX_NONCE_VALUE = 2 ** 64;

class Block {
	constructor({ blockHeaders }) {
		this.blockHeaders = blockHeaders;
	}

	static calculateBlockTargetHash({ lastBlock }) {
		const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(
			16
		);
		if (value.length > HASH_LENGHT) {
			return 'f'.repeat(HASH_LENGHT);
		}
		return '0'.repeat(HASH_LENGHT - value.length) + value;
	}

	static mineBlock({ lastBlock, beneficiary }) {
		const target = Block.calculateBlockTargetHash({ lastBlock });
		let timestamp, truncatedBlockHeaders, header, nonce, underTargetHash;
		do {
			timestamp = Date.now();
			truncatedBlockHeaders = {
				parentHash: keccakHash(lastBlock.blockHeaders),
				beneficiary,
				difficulty: lastBlock.blockHeaders.difficulty + 1,
				number: lastBlock.blockHeaders.number + 1,
				timestamp
			};
			header = keccakHash(truncatedBlockHeaders);
			nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
			underTargetHash = keccakHash(header + nonce);
		} while (underTargetHash > target);
        return this({
            blockHeaders: { ...truncatedBlockHeaders, nonce }
        });
	}

	static genesis() {
		return new this(GENESIS_DATA);
	}
}

module.exports = Block;
