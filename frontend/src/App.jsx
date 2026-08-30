import { useState } from 'react'
import './App.css'

function App() {
  const [requirement, setRequirement] = useState('')
  const [screen, setScreen] = useState('create')
  const [result, setResult] = useState(null)

  const [checkResults, setCheckResults] = useState({
    age: true,
    income: true
  })

  const [conditions, setConditions] = useState({
    age:{
      operator: ">=",
      value: 21
  },
  income: {
    operator: ">=",
    value: 4000
  }
})
  const [policy, setPolicy] = useState(null)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState('')

  async function handleCreateVerification() {
    if (!requirement.trim()) {
      setParseError('Please enter a verification requirement.')
      return
    }
  
    setIsParsing(true)
    setParseError('')
  
    try {
      const response = await fetch(
        'http://localhost:3000/api/policy/parse',
        {
          method: 'POST',
  
          headers: {
            'Content-Type': 'application/json'
          },
  
          body: JSON.stringify({
            requirement: requirement
          })
        }
      )
  
      const data = await response.json()
  
      if (!response.ok || !data.success) {
        throw new Error(
          data?.error?.message || 'Could not interpret the requirement.'
        )
      }
  
      setPolicy(data.policy)
  
      const ageRule = data.policy.rules.find(
        (rule) => rule.field === 'age'
      )
  
      const incomeRule = data.policy.rules.find(
        (rule) => rule.field === 'income'
      )
  
      setConditions({
        age: {
          operator: ageRule?.operator ?? '>=',
          value: ageRule?.value ?? 21
        },
      
        income: {
          operator: incomeRule?.operator ?? '>=',
          value: incomeRule?.value ?? 4000
        }
      })
  
      setScreen('verify')
    } catch (error) {
      console.error(error)
  
      setParseError(
        error.message || 'Something went wrong while contacting the backend.'
      )
    } finally {
      setIsParsing(false)
    }
  }



  if (screen === 'result') {
    return (
      <div className={`result-page ${result ? 'qualified' : 'unqualified'}`}>
  
        <div className="particle particle-one"></div>
        <div className="particle particle-two"></div>
        <div className="particle particle-three"></div>
        <div className="particle particle-four"></div>
        <div className="particle particle-five"></div>
        <div className="particle particle-six"></div>
  
        <nav className="top-nav">
          <div className="brand">
            <div className="brand-icon">V</div>
            <span>VEILAI</span>
          </div>
  
          <div className="nav-status">
            <span className="status-dot"></span>
            Verification Complete
          </div>
        </nav>
  
        <main className="result-content">
  
          <div className="result-icon">
            {result ? '✓' : '×'}
          </div>
  
          <p className="result-eyebrow">
            PRIVATE VERIFICATION COMPLETE
          </p>
  
          <h1 className="result-title">
            {result ? 'QUALIFIED' : 'NOT QUALIFIED'}
          </h1>
  
          <p className="result-description">
            {result
              ? 'The applicant satisfies all requested conditions.'
              : 'The applicant does not satisfy all requested conditions.'}
          </p>
  
          <div className="result-card">
  
            <div className="result-card-heading">
              <div>
                <p className="eyebrow">VERIFICATION RESULTS</p>
                <h2>Requested conditions</h2>
              </div>
  
              <div className="proof-badge">
                ZK Proof complete
              </div>
            </div>
  
            <div className="result-check-row">
  
              <div>
                <span className="result-check-label">
                  Age requirement
                </span>
  
                <p>
                  Age {conditions.age.operator} {conditions.age.value}
                </p>
              </div>
  
              <div
                className={
                  checkResults.age
                    ? 'check-status passed'
                    : 'check-status failed'
                }
              >
                {checkResults.age ? '✓ PASSED' : '× FAILED'}
              </div>
  
            </div>
  
            <div className="result-check-row">
  
              <div>
                <span className="result-check-label">
                  Monthly income requirement
                </span>
  
                <p>
                  Income {conditions.income.operator} $
                  {conditions.income.value.toLocaleString()}
                </p>
              </div>
  
              <div
                className={
                  checkResults.income
                    ? 'check-status passed'
                    : 'check-status failed'
                }
              >
                {checkResults.income ? '✓ PASSED' : '× FAILED'}
              </div>
  
            </div>
  
            <div className="midnight-proof-row">
  
              <div className="midnight-proof-icon">
                ✦
              </div>
  
              <div className="midnight-proof-text">
                <span>ZERO-KNOWLEDGE PROOF</span>
                <strong>Verified privately with Midnight</strong>
              </div>
  
              <div className="verified-badge">
                ✓ VERIFIED
              </div>
  
            </div>
  
          </div>
  
          <div className="privacy-impact">
  
            <div className="privacy-number">
              0
            </div>
  
            <div className="privacy-impact-text">
              <strong>SENSITIVE VALUES REVEALED</strong>
              <span>
                The decision was made without exposing the applicant's private values.
              </span>
            </div>
  
            <div className="privacy-lock">
              🔒
            </div>
  
          </div>
  
          <button
            className="new-verification-button"
            onClick={() => {
              setRequirement('')
              setResult(null)
  
              setCheckResults({
                age: true,
                income: true
              })
  
              setScreen('create')
            }}
          >
            <span>Start New Verification</span>
            <span>↻</span>
          </button>
  
        </main>
  
      </div>
    )
  }
  if (screen === 'verify') {
    return (
      <div className="verify-page">
        <div className="particle particle-one"></div>
        <div className="particle particle-two"></div>
        <div className="particle particle-three"></div>
        <div className="particle particle-four"></div>
        <div className="particle particle-five"></div>
        <div className="particle particle-six"></div>
        <div className="particle particle-seven"></div>
        <div className="particle particle-eight"></div>
  
        <nav className="top-nav">
          <div className="brand">
            <div className="brand-icon">V</div>
            <span>VEILAI</span>
          </div>
  
          <div className="nav-status">
            <span className="status-dot"></span>
            AI Interpretation
          </div>
        </nav>
  
        <div className="verify-content">
  
          <div className="hero-badge">
            ✦ REQUIREMENT INTERPRETED
          </div>
  
          <div className="interpretation-flow">
  
            <div className="request-summary">
              <p className="eyebrow">YOUR REQUEST</p>
  
              <h2>
                “{requirement|| 'Applicant must be 21+ and earn at least $4,000 per month.'}”
              </h2>
  
              <p className="request-note">
                Natural language requirement
              </p>
            </div>
  
            <div className="ai-transform">
              <div className="ai-circle">✦</div>
              <span>AI</span>
              <div className="transform-arrow">→</div>
            </div>
  
            <div className="policy-summary">
              <p className="eyebrow">PRIVATE POLICY</p>
  
              <div className="policy-row">
                <span>Age</span>
                <strong>
                  {conditions.age.operator} {conditions.age.value}
                </strong>
              </div>
  
              <div className="policy-row">
                <span>Monthly income</span>
                <strong>
                  {conditions.income.operator} $
                  {conditions.income.value.toLocaleString()}
                </strong>
              </div>
  
              <p className="policy-status">
                ✓ 2 conditions extracted
              </p>
            </div>
  
          </div>
  
          <div className="private-ready-card">
  
            <div className="private-ready-heading">
              <div>
                <p className="eyebrow">PRIVATE VERIFICATION READY</p>
                <h2>Your applicant data stays hidden.</h2>
              </div>
  
              <div className="lock-badge">
                🔒 Protected
              </div>
            </div>
  
            <div className="hidden-values">
  
              <div className="hidden-row">
                <span>Actual age</span>
                <strong>🔒 Hidden</strong>
              </div>
  
              <div className="hidden-row">
                <span>Actual income</span>
                <strong>🔒 Hidden</strong>
              </div>
  
            </div>
  
            <div className="proof-status">
              <span className="proof-dot"></span>
              Private proof ready with Midnight
            </div>
  
          </div>
  
          <button
            className="primary-button verify-button"
            onClick={() => {
              setCheckResults({
                age: true,
                income: true
              })

              setResult(true)
              setScreen('result')
            }}
          >
            <span>Verify with Midnight</span>
            <span>→</span>
          </button>
  
          <div className="privacy-note">
            <span>◉</span>
            Only the verification result will be revealed.
          </div>
  
        </div>
  
      </div>
    )
  }
  return (
    <div className="landing-page">
  
      <nav className="top-nav">
        <div className="brand">
          <div className="brand-icon">V</div>
          <span>VEILAI</span>
        </div>
  
        <div className="nav-status">
          <span className="status-dot"></span>
          Private Verification
        </div>
      </nav>
  
      <div className="hero-section">
  
        <div className="hero-badge">
          ✦ AI + ZERO-KNOWLEDGE PRIVACY
        </div>
  
        <h1 className="hero-title">
          Verify what matters.
          <span> Reveal nothing else.</span>
        </h1>
  
        <p className="hero-description">
          Turn simple requirements into private verification checks
          without exposing sensitive applicant data.
        </p>
  
        <div className="verification-card">
  
          <div className="card-heading">
            <div>
              <p className="eyebrow">CREATE VERIFICATION</p>
              <h2>What should the applicant prove?</h2>
            </div>
  
            <div className="secure-badge">
              🔒 Private
            </div>
          </div>
  
          <textarea
            className="requirement-input"
            placeholder="Example: Applicant must be 21+ and earn at least $4,000 per month."
            value={requirement}
            onChange={(event) => setRequirement(event.target.value)}
          />
  
          <button
            className="primary-button"
            onClick={handleCreateVerification}


            disabled={isParsing}
          >
            <span>
              {isParsing 
              ? 'Interpreting requirement...'
              : 'Create Verification'}
            </span>
            <span>
              {isParsing ? '✦' : '→'}



            </span>
          </button>
          {parseError && (
            <div className="parse-error">
              {parseError}
            </div>
          )}




  
          <div className="privacy-note">
            <span>◉</span>
            Sensitive values stay private during verification.
          </div>
  
        </div>
  
        <div className="process-flow">
  
          <div className="process-step">
            <span>01</span>
            AI interprets
          </div>
  
          <div className="process-arrow">→</div>
  
          <div className="process-step">
            <span>02</span>
            Midnight verifies privately
          </div>
  
          <div className="process-arrow">→</div>
  
          <div className="process-step">
            <span>03</span>
            Only the result is revealed
          </div>
  
        </div>
  
      </div>
  
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
  
    </div>
  )
  
  }
  
  export default App