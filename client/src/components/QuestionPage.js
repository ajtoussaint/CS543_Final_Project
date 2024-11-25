// QuestionPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../modules/axiosInstance";
import { useUser } from "./UserContext"; // Import the useUser hook

const QuestionPage = () => {
    const { id } = useParams(); // Get the question ID from the URL
    const navigate = useNavigate();
    const { user } = useUser(); // Get the current logged-in user
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axiosInstance.get(`/question/${id}`);
                const questionData = response.data;

                // Fetch media data for the question
                const mediaResponses = await Promise.all(
                    questionData.media.map((m) =>
                        axiosInstance.get(`/media/${m.mediaId}`)
                    )
                );
                const mediaData = mediaResponses.map((res) => {
                    const media = res.data;
                    // Generate URL using fileId
                    if (media.fileId) {
                        media.url = `/file/${media.fileId}`;
                    }
                    return media;
                });
                questionData.media = mediaData;

                // Fetch answer data for the question
                const answerResponses = await Promise.all(
                    questionData.answers.map((ans) =>
                        axiosInstance.get(`/answer/${ans.answerId}`)
                    )
                );
                const answerData = answerResponses.map((res) => res.data);
                questionData.answers = answerData;

                setQuestion(questionData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching question: ", err);
                setError("Could not fetch question data.");
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleAnswerSelect = (answerId) => {
        setSelectedAnswer(answerId);
        if (question.correctAnswerId && answerId === question.correctAnswerId) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleEditQuestion = () => {
        navigate(`/create/${id}`);
    };

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
                {/* Conditionally render the Edit button if the logged-in user is the creator */}
                {user && user._id === question.creatorId && (
                    <button
                        onClick={handleEditQuestion}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                        Edit Question
                    </button>
                )}
                <div>
                    <h3 className="font-semibold mb-2">Answers:</h3>
                    <ul>
                        {question.answers && question.answers.length > 0 ? (
                            question.answers.map((answer, idx) => (
                                <li
                                    key={idx}
                                    className={`mb-2 p-2 border rounded cursor-pointer ${
                                        selectedAnswer === answer._id
                                            ? isCorrect
                                                ? "bg-green-200"
                                                : "bg-red-200"
                                            : "bg-gray-50"
                                    }`}
                                    onClick={() =>
                                        handleAnswerSelect(answer._id)
                                    }
                                >
                                    {answer.content}
                                </li>
                            ))
                        ) : (
                            <li>No answers available.</li>
                        )}
                    </ul>
                </div>
                {selectedAnswer && (
                    <div className="mt-4">
                        {isCorrect ? (
                            <p className="text-green-600 font-bold">
                                Correct Answer!
                            </p>
                        ) : (
                            <p className="text-red-600 font-bold">
                                Incorrect Answer. Try Again!
                            </p>
                        )}
                    </div>
                )}
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Media:</h3>
                    {question.media && question.media.length > 0 ? (
                        question.media.map((m, idx) => (
                            <div key={idx} className="mb-4">
                                <h4 className="font-bold">{m.title}</h4>
                                {m.type === "image" && m.url && (
                                    <img
                                        src={m.url}
                                        alt={m.title}
                                        className="max-w-full h-auto mt-2 rounded"
                                    />
                                )}
                                {/* Add handling for other media types if needed */}
                            </div>
                        ))
                    ) : (
                        <p>No media available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionPage;
