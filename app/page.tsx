"use client";

import { useState } from "react";
import axios from "axios";

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
    <div>
      <h1 className="text-center text-4xl font-black text-blue-200">
        AI Code Reviewer
      </h1>
      <div className="flex md:flex-row flex-col items-center md:h-[94vh] p-8  gap-10">
        <div className="border-2 resize-none md:w-1/2 w-full h-[85vh] md:h-full overflow-scroll p-5 rounded-2xl text-white bg-white/20 backdrop-blur-2xl TextArea">
          <select
            value={language}
            className="absolute md:left-130 left-55 rounded top-1 md:top-2 h-7 bg-white/20 border focus:outline-none "
            onChange={handleChange}
          >
            {" "}
            {Langs.map((lang, index) => (
              <option
                className="text-center text-black"
                key={index}
                value={lang.lang}
              >
                {lang.lang}
              </option>
            ))}
          </select>
          <textarea
            value={code}
            className="focus:outline-none w-full min-h-1/2 TextArea mt-8"
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
          />
        </div>

        <div className="absolute md:bottom-11 md:left-135 bottom-3 left-60">
          <button
            className="bg-blue-400 border text-white rounded-3xl min-w-28 p-1.5 "
            onClick={analyzeCode}
          >
            {loading ? "Analyzing..." : "Analyze Code"}
          </button>
        </div>
        <div className="border-2 md:w-1/2 w-full md:h-full h-[85vh] overflow-y-scroll p-5 rounded-2xl bg-white/20 backdrop-blur-lg text-white TextArea">
          {" "}
          {result.length > 1 ? (
            <pre className="">{result}</pre>
          ) : (
            "Nothing To Analyse"
          )}
        </div>
      </div>
    </div>
  );
}
