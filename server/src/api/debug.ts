import { Request, Response, Router } from 'express'
import { Instance } from '../Instance'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Debug endpoint is working!' })
})

router.get('/create-weather-records', (req: Request, res: Response) => {
    const instance = Instance.getInstance();
    const weatherRecords = instance.getDatabase().weather._debug_create_test_data();
    res.json(weatherRecords);
});

export default router