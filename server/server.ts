import express from 'express'
import database from './db.ts'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/weather', (req: express.Request, res: express.Response) => {
    const { temperature, humidity } = req.body
    const stmt = database.prepare('INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)')
    stmt.run(temperature, humidity)
    res.status(201).json({ message: 'Data inserted successfully' })
})

app.get('/weather', (req: express.Request, res: express.Response) => {
    const stmt = database.prepare('SELECT * FROM weather_data ORDER BY timestamp DESC')
    const data = stmt.all()
    res.json(data)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})