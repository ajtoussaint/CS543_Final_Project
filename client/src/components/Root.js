// Root.js
import React, { useState, useEffect } from 'react';
import axiosInstance from "../modules/axiosInstance";

const Root = () => {
  const [message, setMessage] = useState('message not yet loaded...');
  const [questions, setQuestions] = useState([]); // State to store questions

  useEffect(() => {
    const fetchData = async () => {
      console.log("Trying to access the server...");
      try {
        // Fetch users
        const usersRes = await axiosInstance.get("data");
        setMessage(usersRes.data
          .map(user => user.username)
          .join(", ")
        );

        // Fetch questions
        const questionsRes = await axiosInstance.get("/questions");
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error("Error fetching data: ", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Current Users:</h2>
        <p className="text-2xl font-semibold text-gray-700">{message}</p>

        <h2 className="text-3xl font-bold mt-8 mb-4">Questions:</h2>
        <div className="text-left text-lg text-gray-800">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={index} className="border p-4 mb-4">
                <h3 className="font-semibold">Title: {question.title}</h3>
                <p>Tags: {question.tags}</p>
                <div>Answers:
                  <ul>
                    {question.answers.map((answer, idx) => (
                      <li key={idx}>
                        {answer.answerId} {answer.answerId === question.correctAnswerId ? "(Correct)" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Root;
