import express from 'express'
import { createDatabase } from './db/index'


const app = express()
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

app.use('/api', weatherRouter)


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})