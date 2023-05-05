import express from 'express';
import cors from 'cors';

import adminControllers from './server/controllers/admin.js';
import chatControllers from './server/controllers/chat.js';

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/admin", adminControllers)
app.use("/chat", chatControllers)

app.listen("5000", () => {
  console.log("Server connected!")
})