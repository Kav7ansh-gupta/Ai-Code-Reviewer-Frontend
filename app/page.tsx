"use client";

import { useState } from "react";
import axios from "axios";
import CodeWindow from "./Components/CodeWindow";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };
  const analyzeCode = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/analyze`, {
        code,
        language: language,
      });

      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      setResult("Error analyzing code");
    }

    setLoading(false);
  };
  const Langs = [
    { id: 1, lang: "Java" },
    { id: 2, lang: "Python" },
    { id: 3, lang: "C++" },
    { id: 4, lang: "C" },
    { id: 4, lang: "Java Script" },
  ];
  return (
    <div className="">
      <CodeWindow />
    </div>
  );
}
