import { Router } from "express";
import { ServerContext } from "../../context";
import { AuthService } from "../../services/Auth";
import * as z from "zod";

const router = Router();
const auth = ServerContext.getInstance().GetService(AuthService);

const loginRegisterBodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

router.get("/", (req, res) => {
  res.status(201).json({
    message: "Auth API",
  });
});

router.post("/register", (req, res) => {
  const parseResult = loginRegisterBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request data",
      details: parseResult.error.issues,
    });
  }

  const response = auth.register(
    parseResult.data.username,
    parseResult.data.password,
  );
  res.status(response.httpCode || 200).json(response);
});

router.post("/login", (req, res) => {
  const parseResult = loginRegisterBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request data",
      details: parseResult.error.issues,
    });
  }

  const response = auth.login(
    parseResult.data.username,
    parseResult.data.password,
  );

  res.status(response.httpCode || 200).json(response);
});

router.post("/create/token", (req, res) => {
  auth.createToken("");
});

export default router;
