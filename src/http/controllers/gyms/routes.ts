import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";

export async function gymRoutes(app: FastifyInstance) {  
  app.addHook('onRequest', verifyJWT)
}