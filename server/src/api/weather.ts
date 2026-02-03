import express, { Router } from 'express'
import { Instance } from '../Instance'

const database = Instance.getInstance().getDatabase();

const router = Router()

router.post('/weather', (req: express.Request, res: express.Response) => {
    console.log('Received data:', req.body)
    const { temperature, humidity } = req.body
    void database.weather.addWeatherRecord(temperature, humidity)
    res.status(201).json({ message: 'Data inserted successfully' })
})

router.get('/weather', (req: express.Request, res: express.Response) => {
    const data = database.weather.getWeatherRecords()
    res.json(data)
})

export default router