import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ResponseData = {
  questions: string[];
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    const { context, numberOfQuestions } = req.body;

    try {
      const response: OpenAI.ChatCompletion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a teacher assessing student's knowledge." },
          { role: "user", content: `Generate ${numberOfQuestions} open-ended questions based on the following context: ${context}` },
        ],
      });

      const questions = response.choices[0].message.content?.split("\n\n");

      res.status(200).json({
        questions: questions || []
      });

    } catch (error: any) {
      res.status(500).json({
        questions: [],
        error: error.message
      });
    }
  } else {
    res.status(405).json({
      questions: [],
      error: "Method Not Allowed"
    });
  }
}
