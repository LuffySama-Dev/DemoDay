import { Add } from './Add.js';
import { Mina, PrivateKey, AccountUpdate, Field } from 'o1js';

const useProof = false;
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });

Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new Add(zkAppAddress);
const deployTnx = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});

await deployTnx.sign([deployerKey, zkAppPrivateKey]).send();

const num0 = zkAppInstance.num.get();
console.log(`The value of the field is ${num0}`);

try {
  const ok = zkAppInstance.product(Field(4), Field(5));
  if (ok.toBoolean()) {
    console.log(`Dude proved that he knows the factors of ${num0} !!`);
  } else {
    console.log(`Dudes weak at maths !!`);
  }
} catch (e: any) {
  console.error(e.message);
}
