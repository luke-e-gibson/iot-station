import { Router } from "express";
import { ServerContext } from "../context";
import { AuthService } from "../services/Auth";
import * as z from "zod";
import { allowedNodeEnvironmentFlags } from "node:process";

const router = Router();
const auth = ServerContext.getInstance().GetService(AuthService);

const loginRegisterBodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

const createTokenBodySchema = z.object({
  authToken: z.string().min(1),
  name: z.string().min(1),
});

const validateTokenBodySchema = z.object({
  deviceToken: z.string().min(1),
});

router.get("/", (req, res) => {
  res.status(201).json({
    message: "Auth API",
  });
});

router.post("/register", async (req, res) => {
  const parseResult = loginRegisterBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request data",
      details: parseResult.error.issues,
    });
  }

  const response = await auth.register(
    parseResult.data.username,
    parseResult.data.password,
  );
  res.status(response.httpCode || 200).json(response);
});

router.post("/login", async (req, res) => {
  const parseResult = loginRegisterBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request data",
      details: parseResult.error.issues,
    });
  }

  const response = await auth.login(
    parseResult.data.username,
    parseResult.data.password,
  );

  res.status(response.httpCode || 200).json(response);
});

router.post("/token/create", async (req, res) => {
  const parseResult = createTokenBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request data",
      details: parseResult.error.issues,
    });
  }
  const response = await auth.createToken(parseResult.data.authToken, parseResult.data.name);
  
  res.status(response.httpCode || 200).json(response);
});

router.post("/token/validate", async (req, res) => {
  const parseResult = validateTokenBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request data",
      details: parseResult.error.issues,
    });
  }

  const response = await auth.verifyDeviceToken(parseResult.data.deviceToken);
  res.status(response.httpCode || 200).json(response);
})

export default router;
