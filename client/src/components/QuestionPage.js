// QuestionPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../modules/axiosInstance";

const QuestionPage = () => {
    const { id } = useParams(); // Get the question ID from the URL
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axiosInstance.get(`/question/${id}`);
                setQuestion(response.data);
                setLoading(false);
                console.log("You are on the question page.");
            } catch (err) {
                console.error("Error fetching question: ", err);
                setError("Could not fetch question data.");
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-4">{question.title}</h2>
                <p className="text-lg mb-4">
                    Tags:{" "}
                    {Array.isArray(question.tags)
                        ? question.tags.join(", ")
                        : question.tags}
                </p>
                <div>
                    <h3 className="font-semibold mb-2">Answers:</h3>
                    <ul>
                        {question.answers && question.answers.length > 0 ? (
                            question.answers.map((answer, idx) => (
                                <li key={idx} className="mb-2">
                                    {answer.answerId
                                        ? answer.answerId.toString()
                                        : "No answer ID"}{" "}
                                    {answer.answerId &&
                                    question.correctAnswerId &&
                                    answer.answerId.toString() ===
                                        question.correctAnswerId.toString()
                                        ? "(Correct)"
                                        : ""}
                                </li>
                            ))
                        ) : (
                            <li>No answers available.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default QuestionPage;
