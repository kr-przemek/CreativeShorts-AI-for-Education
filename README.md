## Creative Shorts #2 - AI for Education

### Assumptions and Goals

Chat GPT is an advanced natural language processing (NLP) model powered by artificial intelligence, developed by OpenAI. OpenAI, a leading research organization, has been at the forefront of AI advancements, creating models like GPT-3, GPT-4, and Codex. GPT-3 and GPT-4 are particularly renowned for their ability to understand and generate human-like text, enabling a wide range of applications from creative writing to coding assistance.

OpenAI offers access to its models through a paid API. Depending on your needs, you can choose from various models, each with different pricing and capabilities. The most basic model, Davinci-003, is available for a few cents per thousand tokens. The newer GPT-4 model is more expensive but provides more advanced features and higher quality text generation.

For comparison, GPT-4, available in 8k (4 cents per 1k tokens) and 32k (8 cents per 1k tokens) versions, is more advanced than GPT-3.5 (1.5 cents per 1k tokens). The choice of the appropriate model depends on the specific project requirements, with more advanced models being suitable for complex tasks but coming with higher costs.

Notably, GPT models not only generate text based on input but also excel at crafting questions from a given text and analyzing responses for accuracy, enhancing their utility in educational and assessment contexts.

In this tutorial, we will guide you through creating a system that generates open-ended questions on a specific topic. We will also cover how to evaluate the accuracy of the answers submitted to these questions, thereby demonstrating practical applications of GPT models in generating and assessing text.

### Preparing the Application and Generating Questions

Before we start, we need to obtain access to the ChatGPT API, which requires an API key. You can generate this key by visiting the [OpenAI API Keys](https://platform.openai.com/api-keys) page. After obtaining the key, add it to the `.env` file in your project. Remember not to share this key publicly and ensure that the `.env` file is added to `.gitignore`:

```dotenv
OPENAI_API_KEY=sk-xxxxx...yyy
```

We will use Next.js with TypeScript for building the application. This is a popular framework for creating React-based applications, which facilitates easy development of server-side and client-side functionality. To communicate with OpenAI, we will install the `openai` library using the following command:

```bash
npm install openai
```

First, let's look at how to interact with the ChatGPT API. We will start by creating and configuring a client that will connect to the OpenAI servers:

```typescript
import { OpenAI } from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
```

Setting the right context is crucial for obtaining accurate and relevant responses from ChatGPT. Context refers to the background information or instructions given to the model, guiding its responses to align with the task at hand. In our application, context ensures that ChatGPT generates questions or evaluates answers in line with specific lesson materials. Providing clear, detailed instructions helps the model understand and perform the required task effectively. A well-crafted context prevents misinterpretation and ensures that the responses are relevant and useful for the intended purpose.

Next, we will prepare a query. We will specify the context in which we want to operate, instructing the system to act as a teacher, and then request the generation of a specified number of questions:

```typescript
const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
        { 
            role: "system", 
            content: "You are a teacher assessing a student's knowledge." 
        },
        { 
            role: "user", 
            content: `Generate ${numberOfQuestions} open-ended questions based on the following context: ${context}` 
        },
  ],
});
```

In response to the query from the previous step, we will receive text containing a list of questions. Each question is on a separate line, so before sending them to our application, we will create an array of questions:

```typescript
const questions = response.choices[0].message.content?.split("\n").filter(line => line.trim() !== "");
```

### Checking Answers

In our application, a key task is to verify the correctness of the answers provided by the student. To achieve this, we want ChatGPT to evaluate the answers in the context of the lesson materials on which the questions were based, and to assess how well the answers address the specific questions. For this purpose, we will use both the context—i.e., the lesson materials—and the previously generated questions and student responses.

Keep in mind that the student answered multiple questions, so we need to make separate requests for each answer evaluation.

```typescript
const evaluations = await Promise.all(answers.map(async (
    answer: string,
    index: number
) => {
    const response: OpenAI.ChatCompletion = await client.chat.completions.create(
        {
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a teacher. Grade the answer from 1 to 6 based on thoroughness in relation to the CONTEXT and relevance to the question; other information is not evaluated. Explanation should be no longer than 8 words. CONTEXT:\n\n${context}`
                }, 
                {
                    role: "user",
                    content: `Evaluate the answer to the question: "${questions[index]}", answer: ${answer}`
                },
            ],
        });
    return response.choices[0].message.content;
}));
```

For this query, the description of the `system` role is detailed and crucial. The accuracy of this description significantly impacts the effectiveness of our AI tutor. Lack of context, additional information, or imprecise specification of the question being answered can result in misinterpretation of the answers or acceptance of correct responses that are unrelated to the lesson topic.

### Implementation

With the backend logic ready, we now focus on developing the user interface (UI) to facilitate interaction with the AI-powered question generation and answer evaluation endpoints.

Our UI will be designed to provide a seamless experience for users. It will include two primary components:

1. **Question Generation Form**: This form allows users to input the context and specify the number of questions they want to generate. Upon submission, the form will request the AI to generate questions based on the provided context.

2. **Answer Evaluation Form**: Once questions are generated, this form enables users to submit their answers for evaluation. Each answer will be assessed by the AI, and results will be displayed accordingly.

These components will be integrated into a cohesive interface that makes it easy to generate questions and evaluate answers. For a practical implementation, you can refer to the example provided in the [CreativeShorts-AI-for-Education GitHub repository](https://github.com/kr-przemek/CreativeShorts-AI-for-Education). This example demonstrates how to set up the UI effectively and can serve as a valuable reference for your project.

Finally, we need to implement the application interface and put our AI teacher into practice. You can start with example https://github.com/kr-przemek/CreativeShorts-AI-for-Education

### Other Uses of ChatGPT in Education & Conclusion

ChatGPT is a powerful tool with vast potential in educational settings. Beyond generating questions and evaluating answers, it can be leveraged for personalized tutoring, curriculum design assistance, and language learning support.

Personalized Tutoring: ChatGPT can act as a virtual tutor, offering individualized help and practice tailored to a student's unique learning needs. This enables students to receive guidance outside the classroom, helping them grasp challenging concepts at their own pace.

Curriculum Design Assistance: Educators can use ChatGPT to assist in designing lesson plans, creating content ideas, and generating diverse educational materials. This support allows teachers to craft more engaging and inclusive learning experiences that cater to various student needs.

Language Learning Support: For language learners, ChatGPT can serve as a conversational partner, correct grammar, build vocabulary, and generate custom exercises. This can significantly enhance the language learning process by providing continuous, on-demand practice.

By incorporating these capabilities into educational strategies, educators can enhance their teaching methods, offer more personalized learning experiences, and provide students with tools to succeed in their academic journeys. As AI technology continues to evolve, its applications in education will likely expand, offering even more innovative ways to support both teaching and learning.
