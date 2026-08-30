import http from 'node:http'
import { executeVerification } from './mainAPI.js'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  // Allow the React frontend to call this local bridge
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/verify') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', async () => {
      try {
        const data = JSON.parse(body)

        const { minAge, minIncome, age, income } = data

        const dummyUserId = new Uint8Array(32).fill(1)

        const result = await executeVerification(
          dummyUserId,
          {
            minAge,
            minIncome
          },
          {
            age,
            income
          }
        )

        res.writeHead(200, {
          'Content-Type': 'application/json'
        })

        res.end(
          JSON.stringify({
            verified: result.verified
          })
        )
      } catch (error) {
        console.error('Bridge verification error:', error)

        res.writeHead(500, {
          'Content-Type': 'application/json'
        })

        res.end(
          JSON.stringify({
            verified: false,
            error: 'Verification failed'
          })
        )
      }
    })

    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`VeilAI verification bridge running on http://localhost:${PORT}`)
})