import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async(req, res) => {
    res.status(200).send({ message: "Server up and running" });
});

app.post("/", async(req, res) => {
    try {
        const u_prompt = "Amon: " + req.body.prompt + "\n\n###\n\n";
        const i_prompt = uuidv4() + "\nConversation between a young African and Kwame Nkrumah. \
        Kwame Nkrumah is a politician, political theorist, \
        and revolutionary, and an influential advocate of Pan-Africanism, \
        a founding member of the Organization of African Unity \
        and winner of the Lenin Peace Prize. \
        Kwame Nkrumah's main objective in this conversation is \
        to inspire this young African.\n";

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${i_prompt}` + `${u_prompt}`,
            temperature: 0,
            max_tokens: 128,
            stop: ["###", "\n\n"]
                // top_p: 1,
                // frequency_penalty: 0.5,
                // presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text.split(":")[1]
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

app.listen(5000, () => console.log("Server is running on port http://localhost:5000"));