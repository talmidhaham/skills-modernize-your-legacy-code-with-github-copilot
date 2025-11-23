#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATA_FILE = process.env.ACCOUNTING_DATA_FILE || path.join(__dirname, 'data.json');

function initData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: 1000.0 }, null, 2));
  }
}

function readBalance() {
  initData();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const obj = JSON.parse(raw);
  return Number(obj.balance);
}

function writeBalance(bal) {
  const normalized = Number(Number(bal).toFixed(2));
  fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: normalized }, null, 2));
}

function formatBalance(bal) {
  const n = Number(bal);
  const fixed = n.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const padded = intPart.padStart(6, '0');
  return `${padded}.${decPart}`;
}

function credit(amount) {
  const amt = Number(amount);
  if (Number.isNaN(amt) || amt <= 0) throw new Error('Invalid amount');
  let bal = readBalance();
  bal = Number((bal + amt).toFixed(2));
  writeBalance(bal);
  return bal;
}

function debit(amount) {
  const amt = Number(amount);
  if (Number.isNaN(amt) || amt <= 0) throw new Error('Invalid amount');
  let bal = readBalance();
  if (bal >= amt) {
    bal = Number((bal - amt).toFixed(2));
    writeBalance(bal);
    return bal;
  }
  throw new Error('Insufficient funds');
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function prompt(q) { return new Promise(resolve => rl.question(q, ans => resolve(ans))); }

async function viewBalance() {
  const bal = readBalance();
  console.log(`Current balance: ${formatBalance(bal)}`);
}

async function creditAccount() {
  const amtStr = await prompt('Enter credit amount: ');
  const amt = parseFloat(amtStr);
  if (Number.isNaN(amt) || amt <= 0) {
    console.log('Invalid amount. Please enter a positive number.');
    return;
  }
  try {
    const bal = credit(amt);
    console.log(`Amount credited. New balance: ${formatBalance(bal)}`);
  } catch (e) {
    console.log(e.message);
  }
}

async function debitAccount() {
  const amtStr = await prompt('Enter debit amount: ');
  const amt = parseFloat(amtStr);
  if (Number.isNaN(amt) || amt <= 0) {
    console.log('Invalid amount. Please enter a positive number.');
    return;
  }
  try {
    const bal = debit(amt);
    console.log(`Amount debited. New balance: ${formatBalance(bal)}`);
  } catch (e) {
    console.log(e.message === 'Insufficient funds' ? 'Insufficient funds for this debit.' : e.message);
  }
}

async function main() {
  let continueFlag = true;
  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    const choice = await prompt('Enter your choice (1-4): ');
    switch (choice.trim()) {
      case '1':
        await viewBalance();
        break;
      case '2':
        await creditAccount();
        break;
      case '3':
        await debitAccount();
        break;
      case '4':
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
  console.log('Exiting the program. Goodbye!');
  rl.close();
}

process.on('SIGINT', () => {
  console.log('\nInterrupted. Exiting.');
  rl.close();
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = {
  readBalance,
  writeBalance,
  formatBalance,
  credit,
  debit,
};
