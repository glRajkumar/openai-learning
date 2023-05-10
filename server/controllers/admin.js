import express from 'express';
import {
  getAllFineTunes, createFineTune,
  getAllUploadedFiles, uploadFile,
  getAllAvailableModels, createEmbedding,
} from '../lib/openAi.js';

const router = express.Router()

router.get('/available-modals', async (req, res) => {
  const data = await getAllAvailableModels()
  return res.json(data)
})

router.get('/all-fine-tunes', async (req, res) => {
  const data = await getAllFineTunes()
  return res.json(data)
})

// use post if you are sending body. just for simplicity used get
router.get('/create-emb', async (req, res) => {
  const { message } = req.body

  const data = await createEmbedding(message)
  return res.json(data)
})

router.get('/all-uploaded-files', async (req, res) => {
  const data = await getAllUploadedFiles()
  return res.json(data)
})

// for simplicity, added file locally and using with get req
router.get('/create-new-fine-tune', async (req, res) => {
  const fileData = await uploadFile("redink.jsonl")
  const data = createFineTune(fileData.id)
  return res.json(data)
})

export default router