import { useState } from 'react'
import './App.css'

function App() {
  const [requirement, setRequirement] = useState('')
  const [screen, setScreen] = useState('create')
  const [result, setResult] = useState(null)
  const [conditions, setConditions] = useState({
    age: 21,
    income: 4000
  })

  if (screen === 'result') {
    return (
      <div className="app-container">
        <div className="card">
  
          <h1>Verification Result</h1>
  
          <div className="result-success">
            <h2>
              {result ? '✅ Qualified' : '❌ Not Qualified'}
            </h2>
            <p>
              {result
                ? 'The applicant meets the requested conditions.'
                : 'The applicant does not meet the requested conditions.'
              }
            </p>
          </div>
  
          <div className="privacy-box">
            <p>Actual age: 🔒 Hidden</p>
            <p>Actual income: 🔒 Hidden</p>
            <p>No sensitive values were revealed.</p>
          </div>
  
        </div>
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
                <strong>≥ {conditions.age}</strong>
              </div>
  
              <div className="policy-row">
                <span>Monthly income</span>
                <strong>
                  ≥ ${conditions.income.toLocaleString()}
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
            onClick={() => setScreen('verify')}
          >
            <span>Create Verification</span>
            <span>→</span>
          </button>
  
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