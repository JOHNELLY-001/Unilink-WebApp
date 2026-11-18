// Serverless-style entry point (e.g. Vercel `api/` directory).
// The Express app lives in src/app.js — this file just re-exports it.
// For local/dev usage, `npm run dev` starts src/index.js which calls app.listen().
import app from '../src/app.js'

export default app
