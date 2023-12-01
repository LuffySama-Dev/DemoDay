import { Field, SmartContract, state, State, method } from 'o1js';

export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(10));
  }

  @method product(n1: Field, n2: Field) {
    const product = Number(n1) * Number(n2);
    const currentNum = this.num.getAndAssertEquals();
    const ok = currentNum.equals(product);
    return ok;
  }
}
