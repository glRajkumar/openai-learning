import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
dotenv.config()

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

export const getAllFineTunes = async () => {
  return openAi.listFineTunes()
}

export default openAi