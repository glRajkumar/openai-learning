import express from 'express';
import { createParser } from "eventsource-parser";
import fetch from 'node-fetch';

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { message } = req.body

    const payload = {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "user",
          content: message
        }
      ],
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    })

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    })

    const parser = createParser((event) => {
      if (event.type === 'event') {
        const data = event.data

        if (data === '[DONE]') {
          res.end()
          return;
        }

        try {
          const json = JSON.parse(data)
          const text = json?.choices?.[0]?.delta?.content || ''
          res.write(text)

        } catch (e) {
          res.end()
        }
      }
    });

    response.body.on('data', (chunk) => {
      parser.feed(chunk.toString())
    })

    response.body.on('error', (err) => {
      res.end()
    })

  } catch (error) {
    console.log(error)
  }
})

export default router
