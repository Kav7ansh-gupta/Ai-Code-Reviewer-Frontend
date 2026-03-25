import { useState } from "react";
import axios from "axios";

const CodeWindow = () => {
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [screen, setScreen] = useState(true);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const Langs = [
    { id: 1, lang: "Java" },
    { id: 2, lang: "Python" },
    { id: 3, lang: "C++" },
    { id: 4, lang: "C" },
    { id: 4, lang: "Java Script" },
  ];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };
  const codeScreen = () => {
    setScreen(false);
  };
  const outputScreen = () => {
    setScreen(true);
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
    setScreen(false);
  };

  return (
    <div>
      <div className="h-screen w-100% p-2 text-white">
        <h1 className="text-purple-400 md:hidden block text-3xl uppercase text-center m-3 font-extrabold ">
          Ai Code reviewer
        </h1>
        <div className="bg-black w-full h-full p-1 rounded">
          <div className="bg-white/20 w-full h-full rounded">
            <header>
              <div className="h-15 w-full border-b-2 border-white py-2 px-5 flex items-center justify-between">
                <div className="md:py-2 md:px-4 p-1 md:tex font-semibold bg-purple-400 flex gap-2 rounded-4xl border">
                  <button onClick={outputScreen} className="md:text-md text-xs">
                    Code
                  </button>
                  <div className="relative bg-white h-6 w-0.5"></div>
                  <button onClick={codeScreen} className="md:text-md text-xs">
                    Result
                  </button>
                </div>
                <div className="md:ml-30 md:text-4xl hidden md:block uppercase font-extrabold text-purple-400">
                  Ai Code Reviewer
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-purple-400 py-0.5 px-1 md:px-2 md:py-1.5 rounded border md:text-md text-xs">
                    <select
                      value={language}
                      className="focus:outline-none "
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
                  </div>
                  <button
                    onClick={analyzeCode}
                    className="py-1 px-2 md:py-2 md:px-4 bg-purple-400 rounded-4xl border-white border md:text-md text-xs"
                  >
                    {loading ? "Analyzing..." : "Analyze Code"}
                  </button>
                </div>
              </div>
            </header>
            <div className="py-4 px-3 h-8/10 TextArea overflow-scroll text-white text-2xl ">
              {screen ? (
                <textarea
                  value={code}
                  className="focus:outline-none w-full h-full resize-none TextArea overflow-scroll"
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                />
              ) : (
                <>
                  <div className="w-full h-full">
                    <pre className="TextArea overflow-scroll">{result}</pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeWindow;
