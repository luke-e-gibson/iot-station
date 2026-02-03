import express from 'express'
import { createDatabase } from './db/index'


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import weatherRouter from './api/weather'

app.use('/api', weatherRouter)


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})