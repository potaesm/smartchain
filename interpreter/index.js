const STOP = 'STOP';
const ADD = 'ADD';
const SUB = 'SUB';
const MUL = 'MUL';
const DIV = 'DIV';
const PUSH = 'PUSH';
const LT = 'LT';
const GT = 'GT';
const EQ = 'EQ';
const AND = 'AND';
const OR = 'OR';
const JUMP = 'JUMP';
const JUMPI = 'JUMPI';

const EXECUTION_COMPLETE = 'Execution complete';
const EXECUTION_LIMIT = 10000;

class Interpreter {
	constructor() {
		this.state = {
			programCounter: 0,
			stack: [],
			code: [],
			executionCount: 0
		};
	}
	__jump() {
		const destination = this.state.stack.pop();
		if (destination < 0 || destination > this.state.code.length) {
			throw new Error(`Invalid destination ${destination}`);
		}
		this.state.programCounter = destination;
		this.state.programCounter--;
	}
	runCode(code) {
		this.state.code = code;
		while (this.state.programCounter < this.state.code.length) {
			this.state.executionCount++;
			if (this.state.executionCount > EXECUTION_LIMIT) {
				throw new Error(`Execution limit of ${EXECUTION_LIMIT} exceeded`);
			}
			const opCode = this.state.code[this.state.programCounter];
			try {
				switch (opCode) {
					case STOP: {
						throw new Error(EXECUTION_COMPLETE);
					}
					case PUSH: {
						this.state.programCounter++;
						if (this.state.programCounter === this.state.code.length) {
							throw new Error(`The 'PUSH' instruction cannot be last`);
						}
						const value = this.state.code[this.state.programCounter];
						this.state.stack.push(value);
						break;
					}
					case ADD: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a + b);
						break;
					}
					case SUB: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a - b);
						break;
					}
					case MUL: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a * b);
						break;
					}
					case DIV: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a / b);
						break;
					}
					case LT: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a < b ? 1 : 0);
						break;
					}
					case GT: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a > b ? 1 : 0);
						break;
					}
					case EQ: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a == b ? 1 : 0);
						break;
					}
					case AND: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a && b);
						break;
					}
					case OR: {
						const a = this.state.stack.pop();
						const b = this.state.stack.pop();
						this.state.stack.push(a || b);
						break;
					}
					case JUMP: {
						this.__jump();
						break;
					}
					case JUMPI: {
						const condition = this.state.stack.pop();
						if (condition == 1) {
							this.__jump();
						}
						break;
					}
					default:
						break;
				}
			} catch (error) {
				if (error.message === EXECUTION_COMPLETE) {
					return this.state.stack[this.state.stack.length - 1];
				}
				throw error;
			}
			this.state.programCounter++;
		}
	}
}

const codeList = [
	[PUSH, 2, PUSH, 3, ADD, STOP],
	[PUSH, 2, PUSH, 3, SUB, STOP],
	[PUSH, 2, PUSH, 3, MUL, STOP],
	[PUSH, 2, PUSH, 3, DIV, STOP],
	[PUSH, 2, PUSH, 3, LT, STOP],
	[PUSH, 2, PUSH, 3, GT, STOP],
	[PUSH, 2, PUSH, 2, EQ, STOP],
	[PUSH, 1, PUSH, 0, AND, STOP],
	[PUSH, 1, PUSH, 0, OR, STOP],
	[PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, 'JUMP Successful', STOP],
	[PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, 'JUMPI Successful', STOP],
	[PUSH, 1, PUSH],
	[PUSH, 0, JUMP, STOP]
];

for (let i = 0; i < codeList.length; i++) {
	try {
		const code = codeList[i];
		console.log(code.toString(), '=>', new Interpreter().runCode(code));
	} catch (error) {
		console.log(error.message);
	}
}
