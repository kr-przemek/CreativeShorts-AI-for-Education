import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ResponseData = {
  evaluations: string[];
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    const { context, questions, answers } = req.body;

    try {
      const evaluations = await Promise.all(
        answers.map(async (answer: string, index: number) => {
          const response: OpenAI.ChatCompletion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are a teacher. Grade the answer from 1 to 6 based on thoroughness in relation to the CONTEXT and relevance to the question; other information is not evaluated. Explanation should be no longer than 8 words. CONTEXT:\n\n${context}`
              },
              {
                role: "user",
                content: `Evaluate the answer to the question: "${questions[index]}", answer: ${answer}`
              }

            ],
          });
          return response.choices[0].message.content;
        })
      );

      res.status(200).json({
        evaluations: evaluations
      });

    } catch (error: any) {
      res.status(500).json({
        evaluations: [],
        error: error.message
      });
    }
  } else {
    res.status(405).json({
      evaluations: [],
      error: "Method Not Allowed"
    });
  }
}
