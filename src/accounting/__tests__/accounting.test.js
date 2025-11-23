const fs = require('fs');
const path = require('path');

const TEST_DATA = path.join(__dirname, 'accounting.test.data.json');

function clearTestData() {
  if (fs.existsSync(TEST_DATA)) fs.unlinkSync(TEST_DATA);
}

let mod;

beforeEach(() => {
  process.env.ACCOUNTING_DATA_FILE = TEST_DATA;
  clearTestData();
  // clear module cache so ACCOUNTING_DATA_FILE is picked up on require
  delete require.cache[require.resolve('../index')];
  mod = require('../index');
});

afterAll(() => {
  clearTestData();
});

test('TC-001 View current balance (formatting)', () => {
  const bal = mod.readBalance();
  expect(bal).toBe(1000);
  expect(mod.formatBalance(bal)).toBe('001000.00');
});

test('TC-002 Credit account (normal)', () => {
  const newBal = mod.credit(50.0);
  expect(newBal).toBe(1050);
  expect(mod.readBalance()).toBe(1050);
  expect(mod.formatBalance(newBal)).toBe('001050.00');
});

test('TC-003 Debit account (sufficient funds)', () => {
  const newBal = mod.debit(200.0);
  expect(newBal).toBe(800);
  expect(mod.readBalance()).toBe(800);
  expect(mod.formatBalance(newBal)).toBe('000800.00');
});

test('TC-004 Debit account (insufficient funds)', () => {
  expect(() => mod.debit(1500.0)).toThrow('Insufficient funds');
  // balance should remain unchanged
  expect(mod.readBalance()).toBe(1000);
});

test('TC-007 Monetary precision edge (small cents)', () => {
  const newBal = mod.credit(0.01);
  expect(newBal).toBeCloseTo(1000.01, 2);
  expect(mod.formatBalance(newBal)).toBe('001000.01');
});

test('TC-008 Negative amount input handling', () => {
  expect(() => mod.credit(-50)).toThrow('Invalid amount');
  expect(() => mod.debit(-10)).toThrow('Invalid amount');
});

test('TC-009 Non-numeric input for amount', () => {
  expect(() => mod.credit('abc')).toThrow('Invalid amount');
  expect(() => mod.debit('xyz')).toThrow('Invalid amount');
});

test('TC-010 Persistence across runs (current Node behavior)', () => {
  // credit, then reload module and verify persisted value
  mod.credit(100);
  // reload module as a separate run
  delete require.cache[require.resolve('../index')];
  const mod2 = require('../index');
  expect(mod2.readBalance()).toBe(1100);
});

