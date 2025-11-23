# Accounting (converted from COBOL)

This small Node.js application implements the original COBOL Account Management System (View/Credit/Debit) and preserves the original business rules and menu flow.

Run:

```bash
cd src/accounting
npm install
npm start
```

Behavior mirrors the COBOL program:
- Option 1: View balance
- Option 2: Credit account (enter amount, adds to balance)
- Option 3: Debit account (enter amount; only allowed if sufficient funds)
- Option 4: Exit

Balance is persisted to `data.json` in the same folder.
