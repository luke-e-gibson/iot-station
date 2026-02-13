import express, { Router } from 'express'
import { Instance } from '../Instance'

const database = Instance.getInstance().getDatabase();

const router = Router()

router.post('/weather', (req: express.Request, res: express.Response) => {
    console.log('Received data:', req.body)
    const { temperature, humidity, device = 'default' } = req.body
    void database.weather.addWeatherRecord(temperature, humidity, device)
    res.status(201).json({ message: 'Data inserted successfully' })
})

router.get('/weather', (req: express.Request, res: express.Response) => {
    const data = database.weather.getWeatherRecords()
    res.json(data)
})

router.get('/weather/latest', (req: express.Request, res: express.Response) => {
    const count = parseInt(req.query.count as string) || 1
    const data = database.weather.getLatestNWeatherRecords(count)
    res.json(data)
})

router.get('/weather/range', (req: express.Request, res: express.Response) => {
    const start = req.query.start as string
    const end = req.query.end as string
    
    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end parameters are required' })
    }
    
    const data = database.weather.getWeatherRecordsInTimeRange(start, end)
    res.json(data)
})

router.get('/weather/stats', (req: express.Request, res: express.Response) => {
    const start = req.query.start as string
    const end = req.query.end as string
    
    let records;
    if (start && end) {
        records = database.weather.getWeatherRecordsInTimeRange(start, end)
    } else {
        records = database.weather.getWeatherRecords()
    }
    
    if (records.length === 0) {
        return res.json({
            count: 0,
            temperature: { min: null, max: null, avg: null },
            humidity: { min: null, max: null, avg: null }
        })
    }

    const temps = records.map(r => r.temperature)
    const humidities = records.map(r => r.humidity)
    
    const stats = {
        count: records.length,
        temperature: {
            min: Math.min(...temps),
            max: Math.max(...temps),
            avg: temps.reduce((a, b) => a + b, 0) / temps.length
        },
        humidity: {
            min: Math.min(...humidities),
            max: Math.max(...humidities),
            avg: humidities.reduce((a, b) => a + b, 0) / humidities.length
        }
    }
    
    res.json(stats)
})

export default router