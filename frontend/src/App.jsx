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
      <div className="app-container">
        <div className="card">
          <h1>Verification Requirements</h1>
  
          <p>The verifier requested:</p>
          <p>{requirement}</p>
  
          <h2>Conditions</h2>
  
          <div className="condition-box">
            ✓ Age ≥ {conditions.age}
          </div>
  
          <div className="condition-box">
            ✓ Monthly income ≥ ${conditions.income.toLocaleString()}
          </div>
  
          <button
            onClick={() => {
              setResult(true)
              setScreen('result')
            }}
          >
            Verify Privately
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="app-container">
      <div className="card">
        <h1>Private AI Verification</h1>
  
        <p className="subtitle">
          Verify what matters without revealing your private information.
        </p>
  
        <h2>Create a verification request</h2>
  
        <p>What should the applicant prove?</p>
  
        <textarea
          placeholder="Example: Applicant must be 21+ and earn at least $4,000 per month."
          value={requirement}
          onChange={(event) => setRequirement(event.target.value)}
        />
  
        <button onClick={() => setScreen('verify')}>
          Create Verification
        </button>
      </div>
    </div>
  )
}
export default App