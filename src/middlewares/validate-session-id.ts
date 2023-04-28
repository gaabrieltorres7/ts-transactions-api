import { FastifyRequest, FastifyReply } from 'fastify'

export async function validateSessionId(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const sessionId = req.cookies.sessionId

  if (!sessionId) {
    return res.status(401).send({ message: 'Unauthorized' })
  }
}
