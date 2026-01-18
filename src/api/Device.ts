import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.status(201).json({
        message: "Device API",
    });
})

export default router;