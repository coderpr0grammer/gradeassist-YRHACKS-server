const fetch = require("cross-fetch");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const port = 3001;
require("dotenv").config({ path: require("find-config")(".env") });
const cors = require("cors");
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: "org-7EI8r48srsW3pVpQ7E7KPmy6",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function request(req) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: req,
        max_tokens: 150,
        temperature: 0.5,
      }),
    });
    const data = await response.json();
    const chatResponse = data.choices[0].message;
    console.log("chatresponse", chatResponse);
    return chatResponse;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

app.get("/api", (req, res) => {
  console.log("req", req.query);
  async function getReply() {
    const response = await request([{ role: "user", content: req.query.prompt }]);
    console.log(response);
    res.json(response);
  }
  getReply();
});

app.post("/api", (req, res) => {
  async function getReply() {
	const response = await request(req.body.prompt);
    console.log(response);
    res.json(response);
  }
  getReply();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});