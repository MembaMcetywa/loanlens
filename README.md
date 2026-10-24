# LoanLens

LoanLens is a responsive loan eligibility simulator. A customer supplies the
personal, financial, and loan information defined by the supplied API contract.
The application then returns an estimated eligibility result from a transparent decision policy.

## Stack

- React with TanStack Start and TanStack Router
- TanStack Query for server communication
- Zustand for global client state
- Tailwind CSS
- Shadcn as a ui components base
- Zod as a product wide validation engine
- TypeScript
- ESLint and Prettier
- npm
- dotLottie-react for lightweight animations

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To test LoanLens on a phone connected to the same local network, run:

```bash
npm run dev:mobile
```

Scan the QR code shown in the terminal.

## Application interpretation

The customer selects a loan product and supplies every value needed by the
eligibility contract. The selected product controls the permitted purposes, amount
range, term range, and interest-rate range. The eligibility request retains the
supplied schema; the server resolves the product from the selected purpose. The
rate request sends the selected product as `loanType`.

The supplied responses are seed data. They define the required schema and expected
response shape, but inconsistent derived values are recalculated by the decision
policy below.

## Request validation and cost control

Invalid input does not start the TanStack Query mutation or create an eligibility
request. This early validation avoids requests and computation that cannot produce
a useful result, which is important for a lender processing applications at scale in terms of cost savings.

The client validates during input and again on submission. The request function
validates immediately before network activity. The server repeats validation
because a client cannot be trusted. Only validated and normalized data enters the
eligibility engine.

The following cross-field rules apply:

- Employed and self-employed applicants require at least three months of
  employment.
- Employment duration is not required for unemployed or retired applicants.
- Existing debt is the monthly debt-repayment portion of total monthly expenses.
  It cannot exceed total monthly expenses and is not subtracted a second time.
- Loan purpose must belong to the selected product.
- Loan amount and term must stay within the selected product limits.
- Credit score is required and must be from 300 through 850.

Invalid input produces field errors, not a simulated lending decision.

## Decision policy

### Affordability

```text
disposable income = monthly income - monthly expenses

existing DTI = existing monthly debt / monthly income

combined DTI =
  (existing monthly debt + proposed monthly payment) / monthly income

maximum payment = min(
  disposable income,
  50% of monthly income - existing monthly debt
)

LTI = requested loan amount / annual gross income
```

Combined DTI must not exceed 50%. The proposed payment must not exceed disposable
income.

### Approval score

The approval score below is a documented engineering assumption, made in order to reach a consistent and reusable policy model.

| Factor                 | Weight |
| ---------------------- | -----: |
| Credit score           |    30% |
| Existing DTI           |    20% |
| New-loan affordability |    25% |
| Employment             |    15% |
| Loan leverage          |    10% |

Credit score points:

| Credit score | Points |
| ------------ | -----: |
| 750-850      |    100 |
| 700-749      |     90 |
| 650-699      |     75 |
| 600-649      |     55 |
| 550-599      |     40 |
| 300-549      |     20 |

Existing DTI points:

| Existing DTI  |       Points |
| ------------- | -----------: |
| 0%-20%        |          100 |
| Above 20%-30% |           85 |
| Above 30%-40% |           70 |
| Above 40%-50% |           50 |
| Above 50%     | Hard failure |

New loan affordability is the average of the payment-use points and combined-DTI
points.

| Payment / disposable income |       Points |
| --------------------------- | -----------: |
| 0%-50%                      |          100 |
| Above 50%-65%               |           90 |
| Above 65%-75%               |           80 |
| Above 75%-90%               |           60 |
| Above 90%-100%              |           40 |
| Above 100%                  | Hard failure |

| Combined DTI  |       Points |
| ------------- | -----------: |
| 0%-30%        |          100 |
| Above 30%-40% |           85 |
| Above 40%-45% |           70 |
| Above 45%-50% |           60 |
| Above 50%     | Hard failure |

Employment points:

| Employment status and duration                |       Points |
| --------------------------------------------- | -----------: |
| Employed or self-employed, at least 24 months |          100 |
| Employed or self-employed, 12-23 months       |           85 |
| Employed or self-employed, 6-11 months        |           70 |
| Employed or self-employed, 3-5 months         |           50 |
| Employed or self-employed, below 3 months     | Hard failure |
| Retired                                       |           75 |
| Unemployed                                    | Hard failure |

Loan leverage points:

| LTI             | Points |
| --------------- | -----: |
| 0%-50%          |    100 |
| Above 50%-75%   |     85 |
| Above 75%-100%  |     70 |
| Above 100%-150% |     50 |
| Above 150%      |     30 |

The final score is rounded to a whole number. A score of at least 60 is required.
Risk is low from 80 through 100, medium from 60 through 79, and high below 60.
Affordability is good from 70 through 100, fair from 50 through 69, and poor below 50.

### Interest and amortization

The credit score band positions the interest rate inside the selected product's
rate range.

| Credit score | Position in rate range |
| ------------ | ---------------------: |
| 750-850      |                     0% |
| 700-749      |                  12.5% |
| 650-699      |                    25% |
| 600-649      |                    50% |
| 550-599      |                    75% |
| 300-549      |                   100% |

```text
interest rate = minimum rate + (maximum rate - minimum rate) * position
```

Monthly payments use the standard amortization formula:

```text
payment = principal * monthlyRate * (1 + monthlyRate)^term
          / ((1 + monthlyRate)^term - 1)
```

The engine keeps full calculation precision. Displayed currency uses two decimal
places. The final schedule payment clears any remaining balance caused by cent
rounding. Total repayment and total interest come from the final schedule. The
maximum qualifying amount is rounded down to the nearest R100.

Boundary values are inclusive. Applicants must be at least 18 years old. There is
no maximum applicant age. Other inclusive boundaries include credit score 300 and
850, three months of employment, 50% combined DTI, a payment equal to disposable
income, an approval score of 60, and all product limits.

## Eligibility response semantics

The eligibility engine applies this sequence:

1. Validate and normalize the application.
2. Resolve the selected product.
3. Apply employment hard-stop rules.
4. Derive the interest rate.
5. Amortize the requested loan.
6. Calculate the affordability metrics.
7. Calculate the approval score.
8. Decide whether the requested amount qualifies.
9. Find the largest qualifying amount in R100 increments with the same rules.
10. Select the primary decision reason.
11. Construct the response.

Response fields have these meanings:

- `isEligible` describes the requested amount.
- `approvalLikelihood` and `affordabilityAnalysis` describe the requested amount.
- `maxAmount` is the largest amount that passes every rule.
- `recommendedAmount` is the requested amount when the request qualifies.
- `recommendedAmount` is the lower `maxAmount` when the request does not qualify but
  an alternative does.
- Recommended payment, total repayment, and interest values describe
  `recommendedAmount`.
- If the product minimum does not qualify, `maxAmount` and `recommendedAmount` are
  zero and no repayment figures are returned.

The engine records all failed rules. The singular `decisionReason` uses this
priority:

1. Ineligible employment status.
2. Employment duration below three months.
3. No affordable amount at the product minimum.
4. No amount at the product minimum reaches the approval threshold.
5. The requested amount exceeds the calculated maximum, but a lower amount
   qualifies.
6. The requested amount qualifies.

## Supplied mock-data findings and assumptions

The supplied example contains values that cannot come from one consistent formula.
LoanLens treats the input fields as authoritative and recalculates derived values.

- The supplied LTI is 60%. `R150,000 / (R25,000 * 12)` is 50%, so LoanLens uses
  50%.
- At 12.5% for 24 months, standard amortization produces a payment of approximately
  R7,096.10, not the supplied R7,089.50.
- The supplied payment implies a nominal annual rate of approximately 12.406%, while
  the supplied schedule entries are close to 12.5%.
- The supplied `totalRepayment` is the supplied payment multiplied by 24. It is not
  the total produced by standard amortization at 12.5%.
- At 12.5%, a R7,089.50 payment leaves approximately R178.81 unpaid after 24 months.
- The supplied R180,000 maximum would require approximately R8,515.32 per month and
  produce approximately 54.06% combined DTI. This exceeds the accepted 50% limit.
- The provisional maximum for the supplied sample is R158,500 after rounding down.
  The application will expose intermediate calculations so this policy can be
  reviewed after the engine accepts inputs.
- The supplied schema marks credit score as optional. LoanLens requires credit score
  because rate, risk, and approval calculations depend on it. An optional value
  would require an unsupported fallback policy.
