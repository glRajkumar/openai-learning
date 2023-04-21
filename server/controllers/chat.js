import express from 'express';
import { addMsg } from './openAi.js';

const router = express.Router()

router.post('/', async (req, res) => {
  const { message } = req.body

  const data = (await addMsg("user", message))?.choices[0]?.message
  return res.json(data)
})

export default router