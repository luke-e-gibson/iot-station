import express from 'express'
import { Instance } from './Instance'

const instance = Instance.getInstance();
const app = express()

app.use(instance.getLogger().createHttpLogger().expressMiddleware) // Use the HTTP logger middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Cors middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})

import weatherRouter from './api/weather'
import devicesRouter from './api/devices'

import debugRouter from './api/debug'

// Log environment mode
const logger = instance.getLogger();
const environment = instance.getConfig().getEnvironment();
logger.log(`Running in ${environment} mode`);

// Only register debug routes in development mode
if (instance.getConfig().isDevelopment()) {
    logger.log('WARNING: Debug routes are enabled at /api/_debug');
    app.use('/api/_debug', debugRouter)
}

app.use('/api', weatherRouter)
app.use('/api', devicesRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})