import { Router } from "express"
import { ServerContext } from "../../context"
import { AuthService } from "./service"

const router = Router()
const auth = ServerContext.getInstance().GetService(AuthService);

router.get("/", (req, res) => {
    res.status(201).json({
        message: "Auth API"
    })
})

router.post("/register", (req, res) => {
    const response = auth.register("", "")
    res.status(response.httpCode || 200).json(response)
})

router.post("/login", (req, res) => {
    const response = auth.login("", "")
    res.status(response.httpCode || 200).json(response)
})


router.post("/create/token", (req, res) => {
    auth.createToken("")
})

export default router