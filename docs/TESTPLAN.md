# Test Plan for COBOL Student Account App

This test plan covers the current business logic and implementation of the COBOL sample app (`src/cobol/main.cob`, `src/cobol/operations.cob`, `src/cobol/data.cob`). Use these test cases to validate behavior with business stakeholders and later to implement unit/integration tests in a Node.js port.

Notes:
- Default initial balance (per source): `1000.00` (stored as `PIC 9(6)V99`).
- Monetary formatting uses two decimal places and the program displays leading zeros (e.g., `001000.00`).
- The application enforces: credit adds amount; debit subtracts amount only when sufficient funds; no overdrafts.
- Input validation is minimal in the current implementation — some negative or malformed inputs may behave unexpectedly.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---:|---:|---|
| TC-001 | View current balance (Total) | App started; initial balance = 1000.00 | 1) Start app
2) Select menu option `1` (View Balance) | Displays current balance: `Current balance: 001000.00` and returns to menu |  |  | Verify display formatting (leading zeros, two decimals) |
| TC-002 | Credit account (normal) | App started; balance = 1000.00 | 1) Start app
2) Select `2` (Credit)
3) Enter amount `50.00`
4) Observe output and return to menu
5) Optionally select `1` to view updated balance | Displays: `Amount credited. New balance: 001050.00` and internal storage updated accordingly |  |  | Verify new balance increases by credited amount; verify storage reflects change within same run |
| TC-003 | Debit account (sufficient funds) | App started; balance = 1000.00 | 1) Start app
2) Select `3` (Debit)
3) Enter amount `200.00`
4) Observe output and return to menu
5) Optionally select `1` to view updated balance | Displays: `Amount debited. New balance: 000800.00` and internal storage updated accordingly |  |  | Verify subtraction and no negative result for sufficient funds |
| TC-004 | Debit account (insufficient funds) | App started; balance = 1000.00 | 1) Start app
2) Select `3` (Debit)
3) Enter amount `1500.00`
4) Observe output | Displays: `Insufficient funds for this debit.` and balance remains unchanged (`001000.00`) |  |  | Confirm no write occurs when funds insufficient (no overdraft) |
| TC-005 | Invalid menu selection handling | App started | 1) Start app
2) Enter invalid menu choice (e.g., `9` or non-digit) | Displays: `Invalid choice, please select 1-4.` and re-displays menu |  |  | Current behavior shows an error message and returns to menu; test for non-digit behavior separately |
| TC-006 | Exit program | App started | 1) Start app
2) Select `4` (Exit) | Displays: `Exiting the program. Goodbye!` and program terminates |  |  | Confirm clean termination and no background processes remain |
| TC-007 | Monetary precision edge (small cents) | App started; balance = 1000.00 | 1) Start app
2) Select `2` (Credit)
3) Enter amount `0.01`
4) Select `1` to view balance | Displays new balance: `001000.01` |  |  | Verify two-decimal precision and correct addition of small amounts |
| TC-008 | Negative amount input handling | App started; balance = 1000.00 | 1) Start app
2) Select `2` (Credit) or `3` (Debit)
3) Enter negative amount (e.g., `-50.00`) | Business requirement: negative amounts should be rejected; Current implementation: minimal validation — behavior may be undefined (runtime error or incorrect parsing). Document actual outcome and decide whether to enforce validation in Node.js port. |  |  | If stakeholders require rejection, mark as a requirement for the Node.js implementation. |
| TC-009 | Non-numeric input for amount | App started | 1) Start app
2) Select `2` (Credit) or `3` (Debit)
3) Enter non-numeric input (e.g., `abc`) | Business requirement: non-numeric input should be rejected and prompt re-entry. Current implementation: no robust validation — may cause runtime error or unexpected behavior. Capture actual behavior. |  |  | Decide validation policy for Node.js port.
| TC-010 | Persistence across runs | App started; previous run modified balance to X | 1) Modify balance in one run (e.g., credit 100)
2) Exit app
3) Start app again | Expected (current): balance resets to initial value (`001000.00`) because `DataProgram` uses working-storage only — no persistence across runs |  |  | If persistence is required, plan file/database persistence in port.

## How to use this test plan
- For each test case, execute the Test Steps and record the Actual Result and Status (Pass/Fail). Note any deviations under Comments.
- Use this plan during stakeholder review to confirm whether current behaviors are acceptable or if new requirements are needed (for example: input validation, negative-amount policy, persistence, multi-account support).
- After stakeholder sign-off, these test cases map directly to unit and integration tests for the Node.js port.

Generated test plan for stakeholder validation and later automated test implementation.
