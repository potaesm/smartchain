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

class Interpreter {
	constructor() {
		this.state = {
			programCounter: 0,
			stack: [],
			code: []
		};
	}
	runCode(code) {
		this.state.code = code;
		while (this.state.programCounter < this.state.code.length) {
			const opCode = this.state.code[this.state.programCounter];
			try {
				switch (opCode) {
					case STOP: {
						throw new Error('Execution Complete');
					}
					case PUSH: {
						this.state.programCounter++;
						const value = this.state.code[this.state.programCounter];
						this.state.stack.push(value);
						break;
					}
					case ADD: {
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
					default:
						break;
				}
			} catch (error) {
				return this.state.stack[this.state.stack.length - 1];
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
	[PUSH, 1, PUSH, 0, OR, STOP]
];

for (let i = 0; i < codeList.length; i++) {
	const code = codeList[i];
	console.log(code.toString(), '=>', new Interpreter().runCode(code));
}
