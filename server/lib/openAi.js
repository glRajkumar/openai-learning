import { Configuration, OpenAIApi } from "openai";
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { stripIndent } from 'common-tags';
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
  return openAi.createCompletion({
    model: "text-embedding-ada-002",
    prompt: content,
    temperature: 0
  }).then(r => r.data)
}

export const addMsg2 = async (input) => {
  const embeddingRes = await openAi.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  })
  const [{ embedding }] = embeddingRes.data.data

  const { data: documents, error } = await supabase.rpc('match_gpt', {
    query_embedding: embedding,
    match_threshold: .73,
    match_count: 10,
  })

  if (error) throw error

  let contextText = ''

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i]
    const content = document.content

    contextText += `${content.trim()}---\n`
  }

  const prompt = stripIndent`
    Context - ${contextText}
    
    Based on the above context data, answer the following question
    
    Question: """
    ${input}
    """
    Answer as simple text:
  `

  const completionResponse = await openAi.createCompletion({
    model: 'text-embedding-ada-002',
    prompt,
    temperature: 0,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  return completionResponse.data
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