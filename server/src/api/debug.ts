import { Request, Response, Router } from 'express'
import { Instance } from '../Instance'

const router = Router()

router.get('/debug', (req: Request, res: Response) => {
    res.json({ message: 'Debug endpoint is working!' })
})

router.get('/debug/weather-records', (req: Request, res: Response) => {
    const instance = Instance.getInstance();
    const weatherRecords = instance.getDatabase().weather.getWeatherRecords();
    res.json(weatherRecords);
});

export default router