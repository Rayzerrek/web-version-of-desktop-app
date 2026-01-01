import { useState, useEffect } from "react";
import { apiFetch } from "../services/ApiClient";
import CodeEditor from "./CodeEditor";
import LessonSuccessModal from "./LessonSuccessModal";
import QuizLesson from "./QuizLesson";
import { lessonService } from "../services/LessonService";
import { progressService } from "../services/ProgressService";
import type { Lesson, Course } from "../types/lesson";
import { getNextLessonId, findCourseByLessonId } from "../utils/courseUtils";

interface CodeValidationResponse {
  success: boolean;
  output: string;
  error?: string;
  is_correct: boolean;
}

interface LessonDemoProps {
  lessonId?: string;
  onNextLesson?: (nextLessonId: string) => void;
  onBackToCourse?: () => void;
}

export default function LessonDemo({
  lessonId = "py-001",
  onNextLesson,
}: LessonDemoProps) {
  const [output, setOutput] = useState<string>("");
  const [currentCode, setCurrentCode] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [htmlPreview, setHtmlPreview] = useState<string>("");

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Enter") {
        e.preventDefault();
        handleRunCode(currentCode);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentCode]);

  const loadLesson = async () => {
    try {
      const lessonData = await lessonService.getLessonById(lessonId);
      setLesson(lessonData);

      if (lessonData) {
        const courses = await lessonService.getCourses();
        const foundCourse = findCourseByLessonId(courses, lessonId);
        setCourse(foundCourse || null);
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Ładowanie lekcji...
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Lekcja nie znaleziona
          </p>
        </div>
      </div>
    );
  }

  const starterCode =
    lesson.content.type === "exercise" ? lesson.content.starterCode : "";
  const expectedOutput =
    lesson.content.type === "exercise" && lesson.content.testCases?.[0]
      ? lesson.content.testCases[0].expectedOutput
      : "";

  const handleRunCode = async (code: string) => {
    try {
      if (lesson.language === "html") {
        setHtmlPreview(code);
      }

      const isDOMInteraction =
        lesson.language === "javascript" &&
        (code.includes("document.") ||
          code.includes("window.") ||
          code.includes("addEventListener"));

      if (isDOMInteraction) {
        setHtmlPreview(code);
      }

      const result = await apiFetch<CodeValidationResponse>(`/validate_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: isDOMInteraction
            ? `
            const __mockEl = {
              addEventListener: () => {},
              removeEventListener: () => {},
              style: {},
              innerHTML: "",
              textContent: "",
              value: "",
              appendChild: (el) => el,
              classList: { add: () => {}, remove: () => {}, toggle: () => {} }
            };
            const document = {
              getElementById: () => __mockEl,
              querySelector: () => __mockEl,
              querySelectorAll: () => [__mockEl],
              body: __mockEl,
              createElement: () => __mockEl,
              addEventListener: () => {}
            };
            const window = { addEventListener: () => {}, document };
            // Define variables used in code that might be missing (like 'b' from ID)
            ${(code.match(/[a-zA-Z_$][0-9a-zA-Z_$]*/g) || [])
              .filter((v, i, a) => a.indexOf(v) === i)
              .filter(
                (v) =>
                  ![
                    "const",
                    "let",
                    "var",
                    "function",
                    "if",
                    "else",
                    "for",
                    "while",
                    "return",
                    "true",
                    "false",
                    "null",
                    "undefined",
                    "document",
                    "window",
                    "console",
                  ].includes(v),
              )
              .map(
                (v) =>
                  `var ${v} = typeof ${v} !== 'undefined' ? ${v} : __mockEl;`,
              )
              .join("\n")}
            ${code}
            `
            : code,
          language: lesson.language,
          expectedOutput,
        }),
      });

      if (result.error) {
        setOutput(result.error);
        setIsCorrect(false);
      } else {
        let isCorrect = result.is_correct;

        // Dodatkowa weryfikacja logiczna (opcjonalna - sprawdzenie czy kod nie jest zbyt uproszczony)
        if (
          isCorrect &&
          lesson.content.type === "exercise" &&
          lesson.content.solution
        ) {
          const normalizedCode = code.replace(/\s+/g, "").toLowerCase();
          const normalizedSolution = lesson.content.solution
            .replace(/\s+/g, "")
            .toLowerCase();

          // Jeśli rozwiązanie zawiera warunek, a kod użytkownika nie (lub ma inny),
          // to sprawdzamy czy kluczowe elementy logiki są obecne.
          const logicKeywords = [
            "if",
            "else",
            "for",
            "while",
            ">",
            "<",
            "==",
            "===",
            "!=",
          ];
          for (const word of logicKeywords) {
            if (
              normalizedSolution.includes(word) &&
              !normalizedCode.includes(word)
            ) {
              isCorrect = false;
              result.output = `Twój kod działa dla tego przypadku, ale brakuje w nim wymaganej logiki (np. użycia '${word}').`;
              break;
            }
          }
        }

        // Friendly message for correct code
        if (isCorrect) {
          const successMessages = [
            "✅ Doskonała robota! Kod działa prawidłowo.",
            "🎉 Wspaniale! Wszystko się zgadza.",
            "✨ Perfekcyjnie! Kod został wykonany poprawnie.",
            "🎯 Celnie! Twój kod działa bez zarzutu.",
            "🚀 Świetnie! Kod działa zgodnie z oczekiwaniami.",
          ];
          const randomMessage =
            successMessages[Math.floor(Math.random() * successMessages.length)];
          setOutput(
            result.output
              ? `${randomMessage}\n\n${result.output}`
              : randomMessage,
          );
        } else {
          setOutput(
            result.output ||
              "Wynik nie zgadza się z oczekiwanym lub brakuje wymaganej logiki.",
          );
        }
        setIsCorrect(isCorrect);

        if (isCorrect) {
          const userId = localStorage.getItem("user_id");
          if (userId) {
            try {
              await progressService.markLessonCompleted(userId, lessonId);
              console.log("✅ Lekcja ukończona!");
            } catch (error) {
              console.error("Error saving progress:", error);
            }
          }

          setTimeout(() => {
            setShowSuccessModal(true);
          }, 500);
        }
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsCorrect(false);
    }
  };

  const handleNextLesson = async () => {
    setShowSuccessModal(false);
    console.log("Moving to next lesson from:", lessonId);

    const courses = await lessonService.getCourses();
    const nextId = getNextLessonId(courses, lessonId);

    if (nextId === "course-complete") {
      console.log("Course completed! Showing completion screen");
      onNextLesson?.("course-complete");
    } else if (nextId) {
      console.log("Next lesson:", nextId);
      onNextLesson?.(nextId);
    } else {
      console.log("No next lesson found!");
    }
  };

  if (lesson.content.type === "quiz") {
    return (
      <QuizLesson
        lesson={lesson}
        course={course}
        onNextLesson={handleNextLesson}
        lessonId={lessonId}
      />
    );
  }

  // Theory lesson view - no code editor, just content display
  if (lesson.content.type === "theory") {
    const theoryContent = lesson.content as any;

    return (
      <>
        <LessonSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          onNextLesson={handleNextLesson}
          xpReward={lesson.xpReward}
          lessonTitle={lesson.title}
        />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                <span className="font-medium">{course?.title || "Kurs"}</span>
                <span className="text-slate-400 dark:text-slate-500">
                  {String.fromCharCode(8250)}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                  Lekcja {lesson.orderIndex}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                {lesson.title}
              </h1>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  📚 Teoria
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {theoryContent.content || lesson.description}
                  </p>
                </div>
              </div>

              {theoryContent.exampleCode && (
                <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 border border-slate-700">
                  {theoryContent.exampleDescription && (
                    <div className="mb-4 pb-3 border-b border-slate-700">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {theoryContent.exampleDescription}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium ml-2">
                      Przykładowy kod
                    </span>
                  </div>
                  <pre className="text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">
                    <code>{theoryContent.exampleCode}</code>
                  </pre>
                </div>
              )}

              <div className="flex items-center justify-between bg-amber-400 rounded-2xl p-5 shadow-lg">
                <span className="text-white font-semibold">
                  Nagroda za ukończenie
                </span>
                <span className="text-3xl font-bold text-white">
                  +{lesson.xpReward} XP
                </span>
              </div>

              <button
                onClick={async () => {
                  // Mark theory lesson as completed
                  const userId = localStorage.getItem("user_id");
                  if (userId) {
                    try {
                      await progressService.markLessonCompleted(
                        userId,
                        lessonId,
                      );
                      console.log("✅ Lekcja ukończona!");
                      setShowSuccessModal(true);
                    } catch (error) {
                      console.error("Error saving progress:", error);
                      alert("Błąd podczas zapisywania postępu");
                    }
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ✓ Ukończ lekcję
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LessonSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onNextLesson={handleNextLesson}
        xpReward={lesson.xpReward}
        lessonTitle={lesson.title}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
              <span className="font-medium">{course?.title || "Kurs"}</span>
              <span className="text-slate-400 dark:text-slate-500">
                {String.fromCharCode(8250)}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                Lekcja {lesson.orderIndex}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {lesson.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Instrukcja
                </h2>
                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                    {lesson.description}
                  </p>
                </div>
              </div>

              {lesson.content.type === "exercise" &&
                lesson.content.exampleCode && (
                  <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 border border-slate-700">
                    {lesson.content.exampleDescription && (
                      <div className="mb-4 pb-3 border-b border-slate-700">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {lesson.content.exampleDescription}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium ml-2">
                        Przykładowy kod
                      </span>
                    </div>
                    <pre className="text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">
                      <code>{lesson.content.exampleCode}</code>
                    </pre>
                  </div>
                )}

              {lesson.content.type === "exercise" && (
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    Twoje zadanie
                  </h3>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    {lesson.content.instruction}
                  </p>
                </div>
              )}
              {lesson.content.type === "exercise" && lesson.content.hint && (
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-2xl p-5 border border-amber-100 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                    <strong className="font-semibold">💡 Wskazówka:</strong>{" "}
                    {lesson.content.hint}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between bg-amber-400 rounded-2xl p-5 shadow-lg">
                <span className="text-white font-semibold">
                  Nagroda za ukończenie
                </span>
                <span className="text-3xl font-bold text-white">
                  +{lesson.xpReward} XP
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <CodeEditor
                  initialCode={starterCode}
                  language={lesson.language}
                  onChange={setCurrentCode}
                  onRun={handleRunCode}
                  height="300px"
                  theme="vs-dark"
                />
                {lesson.language === "html" && (
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 flex items-center gap-2">
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                        👁️ Podgląd HTML
                      </span>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 min-h-[200px]">
                      {htmlPreview ? (
                        <iframe
                          title="HTML Preview"
                          srcDoc={htmlPreview}
                          className="w-full h-64 border border-slate-200 dark:border-slate-700 rounded-lg bg-white"
                          style={{ backgroundColor: "white" }}
                        ></iframe>
                      ) : (
                        <div className="text-slate-400 dark:text-slate-500 italic flex items-center gap-2">
                          <span className="font-sans text-base">
                            Uruchom kod aby zobaczyć podgląd...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Konsola
                  </span>
                </div>
                <div className="bg-slate-900 p-6 min-h-[120px] font-mono text-lg">
                  {output ? (
                    <div>
                      <div className="text-slate-400 text-sm mb-2 font-sans">
                        Wynik:
                      </div>
                      <div className="text-green-400">{output}</div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic flex items-center gap-2">
                      <span className="font-sans text-base">
                        Uruchom kod aby zobaczyć wynik...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isCorrect === false && (
                <div className="rounded-3xl p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 shadow-lg">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      Nie do końca...
                    </h3>
                  </div>
                  <p className="text-red-600 dark:text-red-300 leading-relaxed mb-4">
                    Wynik nie jest zgodny z oczekiwanym. Spróbuj ponownie!
                  </p>
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 text-sm">
                    <strong className="text-red-700 dark:text-red-300 font-semibold">
                      Oczekiwany wynik:
                    </strong>{" "}
                    <code className="text-red-600 dark:text-red-400 font-mono bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded">
                      {expectedOutput}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
