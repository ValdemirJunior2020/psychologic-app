import React, { useState } from "react";
import axios from "axios";
import { db } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import DayCard from "./DayCard";

const InputForm = ({ user }) => {
  const [feeling, setFeeling] = useState("");
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (type) => {
    if (!feeling.trim()) return;

    const prompt =
      type === "bible"
        ? `I feel: "${feeling}". Please provide a 7-day action plan with comforting words based on the Bible, incorporating scripture, faith, and spiritual guidance.`
        : `I feel: "${feeling}". Please give a 7-day science-based plan using psychology and mental health advice to help someone cope and feel better.`;

    setLoading(true);
    setDays([]);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }
      );

      const rawText = res.data.candidates[0].content.parts[0].text;
      const splitDays = rawText
        .split(/Day \d:/)
        .slice(1)
        .map((text, i) => `Day ${i + 1}: ${text.trim()}`);
      setDays(splitDays);

      await addDoc(collection(db, "plans"), {
        uid: user.uid,
        feeling,
        type,
        days: splitDays,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Gemini Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Describe how you're feeling..."
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
      />
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => handleGenerate("bible")}>🙏 Bible Perspective</button>
        <button onClick={() => handleGenerate("science")}>🧠 Science Perspective</button>
      </div>

      {loading && (
        <div className="loading-container">
          <img
            src="https://media.tenor.com/FugLH5N9vLQAAAAi/internet-slow.gif"
            alt="Loading..."
            className="loading-gif"
          />
        </div>
      )}

      <div className="cards">
        {days.map((day, i) => (
          <DayCard key={i} text={day} />
        ))}
      </div>
    </div>
  );
};

export default InputForm;
