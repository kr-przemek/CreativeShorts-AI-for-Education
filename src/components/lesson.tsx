'use client';

import { useState } from 'react';
import axios from 'axios';

export function Lesson() {
  const [context, setContext] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<string[]>([]);

  const generateQuestions = async () => {
    setQuestions([]);
    setAnswers([]);
    setEvaluations([]);
    try {
      const response = await axios.post('/api/generateQuestions', {
        context,
        numberOfQuestions: 3,
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error);
    }
  };

  const saveAnswer = (value: string, index: number) => {
    setAnswers((answers) => {
      answers[index] = value;
      return answers;
    });
  };

  const submitAnswers = async () => {
    try {
      const response = await axios.post('/api/checkAnswers', {
        context,
        questions,
        answers,
      });
      setEvaluations(response.data.evaluations);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Tutor AI</h1>

      <div className="flex gap-6">
        <section className="w-[calc(33%-12px)]">
          <h2>Prepare Questions</h2>
          <div>
        <textarea
          className="w-full h-64" placeholder="Enter lesson context" value={context} onChange={(e) => setContext(e.target.value)}
        />
          </div>
          <div className="flex justify-center">
            <button
              className="w-1/2" onClick={generateQuestions} disabled={context.length === 0}
            >Generate Questions
            </button>
          </div>
        </section>

        {questions.length > 0 && (
          <section className="w-[calc(33%-12px)]">
            <h2>Questions</h2>
            {questions.map((question, index) => {
              return (
                <div key={index} className="flex flex-col gap-4">
                  <p>{question}</p>
                  <textarea
                    className="w-full" placeholder="Your answer" onChange={(e) => saveAnswer(e.target.value, index)}
                  />
                </div>
              );
            })}
            <div className="flex justify-center">
              <button className="w-1/2" onClick={submitAnswers}>Submit Answers</button>
            </div>
          </section>
        )}

        {evaluations.length > 0 && (
          <section className="w-[calc(33%-12px)]">
            <h2>Evaluation</h2>
            {evaluations.map((score, index) => (
              <div key={index}>
                <h3>Question {index + 1}</h3>
                <p className="whitespace-pre-wrap pl-8">{score}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
