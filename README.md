# Private AI Verification

An AI-powered, privacy-preserving verification engine built with **Midnight** that transforms natural-language eligibility requirements into zero-knowledge verification conditions — allowing users to prove they qualify without revealing their underlying sensitive data.

## Details

### What problem does our project solve?

Many eligibility decisions only require a simple answer:

> **Does this person satisfy the requirement?**

Yet traditional verification processes often require applicants to reveal far more information than necessary.

For example, to prove that someone earns at least **$4,000 per month**, a verifier may receive the applicant's exact salary, financial documents, or other sensitive information.

Private AI Verification bridges **natural-language requirements** with **privacy-preserving verification**.

A verifier can write a requirement such as:

> "Applicant must be 21+ and earn at least $4,000 per month."

AI converts that request into structured eligibility conditions, while Midnight evaluates the applicant's private information using zero-knowledge verification.

The verifier receives the eligibility result without needing access to the applicant's actual age or income.

### Libraries / Services

- **Midnight Network** — zero-knowledge verification infrastructure
- **Compact** — privacy-preserving smart contract / circuit logic
- **`@midnight-ntwrk/proof-provider-wasm`** — proof-provider functionality running directly in the browser runtime
- **AI LLM parser** — converts natural-language requirements into structured verification rules
- **React + Vite** — frontend user experience
- **Express API** — AI policy parsing backend

### Scalability

Future versions can extend the current MVP by:

- supporting multi-attribute credential verification circuits
- integrating native Midnight wallet adapters such as Lace
- integrating trusted credential issuers
- expanding beyond age and income verification
- supporting additional policy operators and eligibility conditions
- adding real-time proof status updates to the UI

---

# Product Experience

The frontend turns the underlying AI and zero-knowledge infrastructure into a simple three-step verification experience:

> **Describe → Review → Verify**

The goal is to make privacy-preserving verification understandable even for users who know nothing about zero-knowledge proofs.

## 1. Define the Requirement

The verifier begins by entering an eligibility requirement in everyday language.

For example:

> "Applicant must be 21+ and earn at least $4,000 per month."

The React frontend sends this requirement to:

`POST /api/policy/parse`

The AI backend interprets the request and converts it into a structured `EligibilityPolicy`.

Example:

```json
{
  "version": 1,
  "logic": "AND",
  "rules": [
    {
      "field": "age",
      "operator": ">=",
      "value": 21
    },
    {
      "field": "income",
      "operator": ">=",
      "value": 4000,
      "unit": "USD_MONTHLY"
    }
  ]
}
```

The frontend consumes the returned policy dynamically rather than relying on hard-coded eligibility thresholds.

This creates the first bridge in the system:

**Human intent → AI interpretation → machine-verifiable policy**

---

## 2. Review the AI-Interpreted Policy

The second screen shows the verifier exactly how the AI interpreted the original requirement before private verification begins.

For the example above, the verifier sees:

- **Age ≥ 21**
- **Monthly income ≥ $4,000**

This confirmation step is important because the AI does not silently decide what will be verified.

The verifier can see the **public eligibility conditions**, but not the applicant's private values.

For example:

```text
Public requirement:
Age ≥ 21

Private applicant value:
Hidden
```

and:

```text
Public requirement:
Monthly income ≥ $4,000

Private applicant value:
Hidden
```

The current MVP focuses on:

`age >= minimum age AND income >= minimum income`

This aligns the frontend policy experience with the current Compact eligibility circuit.

---

## 3. Private Verification Result

The structured policy is passed into the Midnight verification flow as public verification criteria.

The applicant's actual age and income remain on the private verification side.

The verifier ultimately receives only the overall result:

**QUALIFIED**

or

**NOT QUALIFIED**

The interface intentionally avoids revealing the applicant's underlying values.

Our privacy principle is:

> **Prove that the requirement is satisfied without revealing the private values used to prove it.**

For the MVP, the final result is based on the overall Midnight `verified` outcome rather than exposing separate age or income pass/fail results.

---

# End-to-End Architecture

```text
Verifier
   │
   │ Natural-language requirement
   ▼
React + Vite Frontend
   │
   │ POST /api/policy/parse
   ▼
AI Policy Parser
   │
   │ EligibilityPolicy
   ▼
Frontend Policy Review
   │
   ▼
Policy Adapter
   │
   │ Public criteria:
   │ { minAge, minIncome }
   ▼
Midnight / Compact
   │
   │ Private applicant witness data
   │ + Zero-knowledge verification
   ▼
Qualified / Not Qualified
```

The system separates three responsibilities:

**AI determines what needs to be proven.**

**Midnight determines whether the private information satisfies those requirements.**

**The frontend reveals only the result the verifier needs.**

---

# Privacy by Design

Private AI Verification separates the system into three categories of information.

### Public Requirement

The verifier defines the eligibility condition.

Example:

```text
Age >= 21
Monthly income >= $4,000
```

### Private Applicant Data

The applicant's actual values remain private during verification.

Example:

```text
Actual age = private
Actual income = private
```

### Verification Result

The verifier receives:

```text
Qualified
```

or:

```text
Not Qualified
```

This allows the system to answer:

> **"Does this applicant satisfy my requirements?"**

without unnecessarily answering:

> **"What is this applicant's exact age or income?"**

---

# Current Frontend Status

- ✅ Three-screen React + Vite verification experience
- ✅ Natural-language verification requirement input
- ✅ Live integration with `POST /api/policy/parse`
- ✅ AI-generated `EligibilityPolicy`
- ✅ Dynamic age and income thresholds
- ✅ Dynamic policy operators
- ✅ AI interpretation loading state
- ✅ Backend/API error handling
- ✅ Human-readable policy review
- ✅ Qualified and Not Qualified result interfaces
- ✅ Privacy-focused result design
- 🔄 Final `policyAdapter → executeVerification()` Midnight connection in progress

---

# Frontend Stack

- **React** — component-based user interface
- **Vite** — frontend development and build tooling
- **JavaScript / JSX** — frontend state and application logic
- **CSS** — custom responsive interface and visual system
- **REST API** — communication with the AI policy parser

---

# Design Philosophy

The frontend was designed around three principles.

### Clarity

AI policy generation and zero-knowledge verification are technically complex.

The user experience should not be.

The interface therefore reduces the process to:

> **Describe → Review → Verify**

### Privacy

The verifier should receive the information required to make a decision without automatically receiving the applicant's underlying sensitive data.

### Trust

The AI-generated conditions are shown to the verifier before private verification begins, creating a visible connection between the original request and the policy Midnight evaluates.

> **AI understands the requirement. Midnight verifies the private facts. The interface reveals only what matters.**

---

# Set Up Instructions

## 1. Clone the Repository & Install Dependencies

```bash
git clone https://github.com/your-org/private-ai-verification.git
cd private-ai-verification
npm install
```

## 2. Download Compact 0.19.0

Follow the link below and download the Windows/Linux release:

https://docs.midnight.network/relnotes/compact

Move the downloaded file into the cloned repository.

Enter Linux and unzip:

```bash
wsl
cd {YOUR_DIRECTORY}
unzip /mnt/{YOUR_DIRECTORY}/compactc-linux.zip -d ./compiler
```

## 3. Install Midnight Tooling

Install the required Midnight packages:

```bash
npm install @midnight-ntwrk/midnight-js-http-client-proof-provider
npm install @midnight-ntwrk/compact-runtime
```

## 4. Compile the Compact ZK Circuit

```bash
compact compile enligibilityChecker.compact managed/eligibility
npm run build
```

If compilation fails, try:

```bash
compact compile eligibilityChecker.compact managed/eligibility
ls -l /home/{YOUR_USERNAME}/.local/bin/compact
/home/{YOUR_USERNAME}/.local/bin/compact compile enligibilityChecker.compact managed/eligibility
ls managed/eligibility
```

## 5. Run the TypeScript / Midnight Setup

```bash
npx ts-node mainAPI.ts
npm install -D tsx

curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
source ~/.bashrc
compact update
```

## 6. Run the Midnight Test

After running the build:

```bash
npx tsx testRun.ts
```
