import { Configuration, OpenAIApi } from "openai";
import { createClient } from '@supabase/supabase-js';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const supabase = createClient(process.env.Supabase_Url, process.env.Supabase_Secret)

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
)

export const addMsg = async (role, content) => {
  return openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role, content }],
  }).then(r => r.data)
}

export const addMsg2 = async (prompt) => {
  return openAi.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0
  }).then(r => r.data)
}

export const getAllFineTunes = async () => {
  return openAi.listFineTunes().then(r => r.data)
}

export const getAllUploadedFiles = async () => {
  return openAi.listFiles().then(r => r.data)
}

export const getAllAvailableModels = async () => {
  return openAi.listModels().then(r => r.data)
}

export const uploadFile = async (fileName) => {
  return openAi.createFile(
    createReadStream(__dirname + `/data/${fileName}`),
    "fine-tune"
  ).then(r => r.data)
}

export const createFineTune = async (training_file) => {
  return openAi.createFineTune({ training_file }).then(r => r.data)
}

export const createEmbedding = async (input) => {
  return openAi.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  }).then(async r => {
    const data = await supabase.from("gpt").insert({
      content: input,
      embedding: r.data.data[0].embedding
    })
    return data
  })
}

export default openAi