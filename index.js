import express from 'express';
import chatControllers from './server/controllers/chat.js';

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/", chatControllers)

app.listen("5000", () => {
  console.log("Server connected!")
})