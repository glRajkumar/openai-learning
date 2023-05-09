import express from 'express';
import { addMsg, addMsg2 } from '../lib/openAi.js';

const router = express.Router()

router.post('/', async (req, res) => {
  const { message } = req.body

  const data = (await addMsg("user", message))?.choices[0]?.message
  return res.json(data)
})

router.post('/from-embedding', async (req, res) => {
  const { message } = req.body

  const data = await addMsg2(message)
  return res.json(data)
})

export default router