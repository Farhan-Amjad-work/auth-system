import app from './app'
import { config } from './config'


const server = app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})