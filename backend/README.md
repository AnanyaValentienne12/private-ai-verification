# Eligibility backend — quick start

This service turns a verifier’s natural-language eligibility requirement into a validated `EligibilityPolicy`. It does not evaluate applicant private data.

## 1. Install dependencies

```bash
cd private-ai-verification/backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Set `AI_API_KEY` in `.env` to a valid API key. Live `POST /api/policy/parse` calls fail without one.

## 2. Run the backend

```bash
npm run dev
```

The server listens on port **3000** by default (`PORT` in `config/env.ts` and `.env.example`). Change `PORT` in `.env` if that port is already in use.

## 3. Test the health endpoint

```http
GET /health
```

```bash
curl http://127.0.0.1:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "eligibility-backend"
}
```

## 4. Test policy parsing

```http
POST /api/policy/parse
Content-Type: application/json
```

Request body:

```json
{
  "requirement": "Applicant must be 21+ and make at least $4K per month."
}
```

```bash
curl http://127.0.0.1:3000/api/policy/parse -H "Content-Type: application/json" -d '{"requirement":"Applicant must be 21+ and make at least $4K per month."}'
```

The backend converts that natural-language requirement into a validated structured `EligibilityPolicy`. A successful response looks like:

```json
{
  "success": true,
  "policy": {
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
  },
  "publicCriteria": {
    "minAge": 21,
    "minIncome": 4000
  },
  "midnightCompatible": true
}
```

## 5. Important limitation

- Live parsing requires a real `AI_API_KEY`.
- This MVP supports only `age` and `income`.
- Applicant private data is not accepted or stored by this backend.
- This backend does not run Compact/ZK itself. Successful parses that Compact can prove also return `publicCriteria: { minAge, minIncome }` for `executeVerification` in `private-ai-verification/mainAPI.ts`. Applicant age/income stay in the local witness, not in this API.
