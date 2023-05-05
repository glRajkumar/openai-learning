import express from 'express';
import { getAllFineTunes } from '../lib/openAi.js';

const router = express.Router()

router.get('/all-fine-tunes', async (req, res) => {
  return getAllFineTunes()
})

export default router