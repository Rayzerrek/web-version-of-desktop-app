import { useState } from "react";
import type { Course, Module } from "../../types/lesson";
import { lessonService } from "../../services/LessonService";
import {
  createExerciseContent,
  createQuizContent,
} from "../../utils/lessonHelpers";

type AdminTab = "courses" | "lessons" | "create" | "create-course";

interface NewLessonData {
  title: string;
  description: string;
  language: "python" | "javascript" | "html" | "css" | "typescript";
  lessonType: "exercise" | "theory" | "quiz" | "project";
  xpReward: number;
  instruction: string;
  starterCode: string;
  solution: string;
  hint: string;
  expectedOutput: string;
  exampleCode: string;
  exampleDescription: string;
  quizQuestion: string;
  quizExplanation: string;
  quizOptions: Array<{ text: string; isCorrect: boolean; explanation: string }>;
}

const initialNewLesson: NewLessonData = {
  title: "",
  description: "",
  language: "python",
  lessonType: "exercise",
  xpReward: 10,
  instruction: "",
  starterCode: "",
  solution: "",
  hint: "",
  expectedOutput: "",
  exampleCode: "",
  exampleDescription: "",
  quizQuestion: "",
  quizExplanation: "",
  quizOptions: [
    { text: "", isCorrect: false, explanation: "" },
    { text: "", isCorrect: false, explanation: "" },
    { text: "", isCorrect: false, explanation: "" },
    { text: "", isCorrect: false, explanation: "" },
  ],
};

interface CreateLessonTabProps {
  selectedCourse: Course | null;
  selectedModule: Module | null;
  setSelectedModule: (module: Module | null) => void;
  setActiveTab: (tab: AdminTab) => void;
  loadCourses: () => Promise<void>;
}

export default function CreateLessonTab({
  selectedCourse,
  selectedModule,
  setSelectedModule,
  setActiveTab,
  loadCourses,
}: CreateLessonTabProps) {
  const [newLesson, setNewLesson] = useState<NewLessonData>(initialNewLesson);

  const handleCreateLesson = async () => {
    if (!selectedModule) {
      alert("Najpierw wybierz modul w zakladce 'Kursy'!");
      return;
    }

    try {
      let lessonContent;

      if (newLesson.lessonType === "quiz") {
        const validOptions = newLesson.quizOptions.filter(
          (opt) => opt.text.trim() !== "",
        );
        if (validOptions.length < 2) {
          alert("Quiz musi miec co najmniej 2 opcje odpowiedzi!");
          return;
        }
        if (!validOptions.some((opt) => opt.isCorrect)) {
          alert(
            "Co najmniej jedna odpowiedz musi byc oznaczona jako poprawna!",
          );
          return;
        }
        if (!newLesson.quizQuestion.trim()) {
          alert("Pytanie quizu jest wymagane!");
          return;
        }

        lessonContent = createQuizContent({
          question: newLesson.quizQuestion,
          options: validOptions,
          explanation: newLesson.quizExplanation || undefined,
        });
      } else {
        lessonContent = createExerciseContent({
          instruction: newLesson.instruction,
          starterCode: newLesson.starterCode,
          solution: newLesson.solution,
          hint: newLesson.hint,
          expectedOutput: newLesson.expectedOutput,
          exampleCode: newLesson.exampleCode,
          exampleDescription: newLesson.exampleDescription,
        });
      }

      await lessonService.createLesson({
        module_id: selectedModule.id,
        title: newLesson.title,
        description: newLesson.description,
        lessonType: newLesson.lessonType,
        content: lessonContent,
        language: newLesson.language,
        xpReward: newLesson.xpReward,
        orderIndex: 0,
        isLocked: false,
        estimatedMinutes: 15,
      });

      alert("Lekcja utworzona!");

      setNewLesson(initialNewLesson);

      loadCourses();
    } catch (error) {
      console.error("Error creating lesson:", error);
      alert("Error: " + error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Utworz nowa lekcje
      </h2>

      {!selectedModule ? (
        <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-yellow-800">
              Najpierw wybierz modul
            </h3>
          </div>
          <p className="text-yellow-700 mb-4">
            Aby utworzyc lekcje, musisz najpierw wybrac kurs i modul, do ktorego
            ma nalezec lekcja.
          </p>
          <button
            onClick={() => setActiveTab("courses")}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition shadow-md"
          >
            Przejdz do wyboru kursu i modulu
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Dodajesz lekcje do:</p>
              <p className="text-lg font-bold text-green-800">
                {selectedModule.iconEmoji} {selectedModule.title}
              </p>
              {selectedCourse && (
                <p className="text-sm text-green-600">
                  z kursu: {selectedCourse.title}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedModule(null);
                setActiveTab("courses");
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm"
            >
              Zmien modul
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateLesson();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tytul lekcji *
            </label>
            <input
              type="text"
              value={newLesson.title}
              onChange={(e) =>
                setNewLesson({
                  ...newLesson,
                  title: e.target.value,
                })
              }
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="np. Twoj pierwszy program w Pythonie"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Jezyk programowania *
            </label>
            <select
              value={newLesson.language}
              onChange={(e) =>
                setNewLesson({
                  ...newLesson,
                  language: e.target.value as
                    | "python"
                    | "javascript"
                    | "html"
                    | "css"
                    | "typescript",
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Opis
          </label>
          <input
            type="text"
            value={newLesson.description}
            onChange={(e) =>
              setNewLesson({
                ...newLesson,
                description: e.target.value,
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Krotki opis lekcji"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Typ lekcji *
            </label>
            <select
              value={newLesson.lessonType}
              onChange={(e) =>
                setNewLesson({
                  ...newLesson,
                  lessonType: e.target.value as
                    | "exercise"
                    | "theory"
                    | "quiz"
                    | "project",
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="exercise">Cwiczenie</option>
              <option value="theory">Teoria</option>
              <option value="quiz">Quiz</option>
              <option value="project">Projekt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nagroda XP *
            </label>
            <input
              type="number"
              value={newLesson.xpReward}
              onChange={(e) =>
                setNewLesson({
                  ...newLesson,
                  xpReward: parseInt(e.target.value),
                })
              }
              min="5"
              step="5"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        {newLesson.lessonType === "exercise" && (
          <ExerciseFields newLesson={newLesson} setNewLesson={setNewLesson} />
        )}

        {newLesson.lessonType === "quiz" && (
          <QuizFields newLesson={newLesson} setNewLesson={setNewLesson} />
        )}

        <div className="flex gap-4 pt-6 border-t border-slate-200">
          <button
            type="submit"
            className="flex-1 py-4 bg-linear-to-r from-purple-600 to-indigo-600 
                               hover:from-purple-700 hover:to-indigo-700 text-white font-bold 
                               rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Utworz lekcje
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 
                               font-semibold rounded-full transition-all duration-200"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

interface ExerciseFieldsProps {
  newLesson: NewLessonData;
  setNewLesson: (lesson: NewLessonData) => void;
}

function ExerciseFields({ newLesson, setNewLesson }: ExerciseFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Instrukcja zadania *
        </label>
        <textarea
          value={newLesson.instruction}
          onChange={(e) =>
            setNewLesson({
              ...newLesson,
              instruction: e.target.value,
            })
          }
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          placeholder="np. Napisz kod ktory wyswietli 'Hello World'"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Kod startowy
        </label>
        <textarea
          value={newLesson.starterCode}
          onChange={(e) =>
            setNewLesson({
              ...newLesson,
              starterCode: e.target.value,
            })
          }
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm resize-none"
          placeholder="# Kod ktory uzytkownik zobaczy na starcie"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Rozwiazanie *
        </label>
        <textarea
          value={newLesson.solution}
          onChange={(e) =>
            setNewLesson({
              ...newLesson,
              solution: e.target.value,
            })
          }
          required
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm resize-none"
          placeholder="print('Hello World')"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Przykladowy kod
        </label>
        <textarea
          value={newLesson.exampleCode}
          onChange={(e) =>
            setNewLesson({
              ...newLesson,
              exampleCode: e.target.value,
            })
          }
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm resize-none"
          placeholder="# Przykladowy kod do wyswietlenia uczniowi jako odniesienie"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Opis przykladowego kodu
        </label>
        <input
          type="text"
          value={newLesson.exampleDescription}
          onChange={(e) =>
            setNewLesson({
              ...newLesson,
              exampleDescription: e.target.value,
            })
          }
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
          placeholder="np. 'Zobacz jak uzywa sie funkcji print()'"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Wskazowka
          </label>
          <input
            type="text"
            value={newLesson.hint}
            onChange={(e) =>
              setNewLesson({
                ...newLesson,
                hint: e.target.value,
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Uzyj funkcji print()"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Oczekiwany wynik *
          </label>
          <input
            type="text"
            value={newLesson.expectedOutput}
            onChange={(e) =>
              setNewLesson({
                ...newLesson,
                expectedOutput: e.target.value,
              })
            }
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Hello World"
          />
        </div>
      </div>
    </>
  );
}

interface QuizFieldsProps {
  newLesson: NewLessonData;
  setNewLesson: (lesson: NewLessonData) => void;
}

function QuizFields({ newLesson, setNewLesson }: QuizFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Pytanie quizu *
        </label>
        <textarea
          value={newLesson.quizQuestion}
          onChange={(e) =>
            setNewLesson({
              ...newLesson,
              quizQuestion: e.target.value,
            })
          }
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          placeholder="np. Ktora z ponizszych funkcji sluzy do wyswietlania tekstu w Pythonie?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Opcje odpowiedzi *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Dodaj minimum 2 opcje. Zaznacz poprawna odpowiedz.
        </p>
        <div className="space-y-3">
          {newLesson.quizOptions.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 transition-all ${
                option.isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const updatedOptions = newLesson.quizOptions.map(
                      (opt, i) => ({
                        ...opt,
                        isCorrect: i === index,
                      }),
                    );
                    setNewLesson({
                      ...newLesson,
                      quizOptions: updatedOptions,
                    });
                  }}
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 transition-all ${
                    option.isCorrect
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-slate-300 hover:border-green-400"
                  }`}
                >
                  {option.isCorrect && <span className="text-sm">V</span>}
                </button>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const updatedOptions = [...newLesson.quizOptions];
                      updatedOptions[index] = {
                        ...updatedOptions[index],
                        text: e.target.value,
                      };
                      setNewLesson({
                        ...newLesson,
                        quizOptions: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder={`Opcja ${index + 1}`}
                  />
                  <input
                    type="text"
                    value={option.explanation}
                    onChange={(e) => {
                      const updatedOptions = [...newLesson.quizOptions];
                      updatedOptions[index] = {
                        ...updatedOptions[index],
                        explanation: e.target.value,
                      };
                      setNewLesson({
                        ...newLesson,
                        quizOptions: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    placeholder="Wyjasnienie (opcjonalne) - pojawi sie po wybraniu tej odpowiedzi"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Ogolne wyjasnienie (opcjonalne)
        </label>
        <textarea
          value={newLesson.quizExplanation}
          onChange={(e) =>
            setNewLesson({
              ...newLesson,
              quizExplanation: e.target.value,
            })
          }
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          placeholder="Wyjasnienie ktore pojawi sie po udzieleniu odpowiedzi"
        />
      </div>
    </>
  );
}
