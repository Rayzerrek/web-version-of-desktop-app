import { useState } from "react";
import type { Course, Module } from "../../types/lesson";
import { lessonService } from "../../services/LessonService";

type AdminTab = "courses" | "lessons" | "create" | "create-course";

interface NewCourseData {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  language: string;
  color: string;
  estimatedHours: number;
}

interface NewModuleData {
  title: string;
  description: string;
  iconEmoji: string;
}

const initialNewCourse: NewCourseData = {
  title: "",
  description: "",
  difficulty: "beginner",
  language: "python",
  color: "#3B82F6",
  estimatedHours: 10,
};

const initialNewModule: NewModuleData = {
  title: "",
  description: "",
  iconEmoji: "",
};

interface CreateCourseTabProps {
  selectedCourse: Course | null;
  selectedModule: Module | null;
  setSelectedCourse: (course: Course | null) => void;
  setSelectedModule: (module: Module | null) => void;
  setActiveTab: (tab: AdminTab) => void;
  loadCourses: () => Promise<void>;
}

export default function CreateCourseTab({
  selectedCourse,
  selectedModule,
  setSelectedCourse,
  setSelectedModule,
  setActiveTab,
  loadCourses,
}: CreateCourseTabProps) {
  const [newCourse, setNewCourse] = useState<NewCourseData>(initialNewCourse);
  const [newModule, setNewModule] = useState<NewModuleData>(initialNewModule);

  const handleCreateCourse = async () => {
    try {
      const created = await lessonService.createCourse({
        title: newCourse.title,
        description: newCourse.description,
        difficulty: newCourse.difficulty,
        language: newCourse.language,
        color: newCourse.color,
        order_index: 0,
        isPublished: true,
        estimatedHours: newCourse.estimatedHours,
      });

      alert(`Kurs "${created.title}" utworzony!`);
      setNewCourse(initialNewCourse);

      await loadCourses();
      setSelectedCourse(created);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error: " + error);
    }
  };

  const handleCreateModule = async () => {
    if (!selectedCourse) {
      alert("Najpierw wybierz kurs!");
      return;
    }

    try {
      const created = await lessonService.createModule({
        course_id: selectedCourse.id,
        title: newModule.title,
        description: newModule.description,
        orderIndex: selectedCourse.modules.length,
        iconEmoji: newModule.iconEmoji,
      });

      alert(`Modul "${created.title}" utworzony!`);
      setNewModule(initialNewModule);

      await loadCourses();
      setSelectedModule(created);
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Error: " + error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Utworz nowy kurs i moduly
      </h2>

      <div className="mb-8 p-6 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Krok 1: Utworz kurs
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tytul kursu *
              </label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                                 focus:ring-0 focus:border-blue-500 outline-none
                                 transition-all duration-200 bg-white hover:border-slate-300"
                placeholder="np. Python dla poczatkujacych"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jezyk programowania *
              </label>
              <select
                value={newCourse.language}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    language: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Opis kursu
            </label>
            <textarea
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  description: e.target.value,
                })
              }
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Krotki opis kursu"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Poziom trudnosci
              </label>
              <select
                value={newCourse.difficulty}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    difficulty: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced",
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="beginner">Poczatkujacy</option>
                <option value="intermediate">Sredniozaawansowany</option>
                <option value="advanced">Zaawansowany</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Szacowany czas (h)
              </label>
              <input
                type="number"
                value={newCourse.estimatedHours}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    estimatedHours: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kolor
              </label>
              <input
                type="color"
                value={newCourse.color}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, color: e.target.value })
                }
                className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleCreateCourse}
            disabled={!newCourse.title}
            className="w-full py-4 bg-linear-to-r from-blue-600 to-cyan-600 
                               hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-300 
                               disabled:to-slate-300 text-white font-bold rounded-full 
                               transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Utworz kurs
          </button>
        </div>
      </div>

      {selectedCourse && (
        <div className="mb-8 p-6 bg-linear-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Krok 2: Dodaj modul do kursu "{selectedCourse.title}"
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Moduly to sekcje w kursie. Kazdy modul zawiera lekcje.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tytul modulu *
                </label>
                <input
                  type="text"
                  value={newModule.title}
                  onChange={(e) =>
                    setNewModule({
                      ...newModule,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="np. Podstawy skladni"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ikona emoji
                </label>
                <input
                  type="text"
                  value={newModule.iconEmoji}
                  onChange={(e) =>
                    setNewModule({
                      ...newModule,
                      iconEmoji: e.target.value,
                    })
                  }
                  maxLength={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none text-2xl text-center"
                  placeholder=""
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Opis modulu
              </label>
              <input
                type="text"
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Co zawiera ten modul?"
              />
            </div>

            <button
              onClick={handleCreateModule}
              disabled={!newModule.title}
              className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 
                                  hover:from-green-700 hover:to-emerald-700 disabled:from-slate-300 
                                  disabled:to-slate-300 text-white font-bold rounded-full 
                                  transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              Dodaj modul
            </button>
          </div>
        </div>
      )}

      {selectedModule && (
        <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Gotowe!</h3>
          <p className="text-slate-700 mb-4">
            Modul "{selectedModule.title}" utworzony! Teraz mozesz:
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("create")}
              className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition shadow-md"
            >
              Dodaj lekcje do tego modulu
            </button>
            <button
              onClick={() => {
                setSelectedModule(null);
              }}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
            >
              Utworz kolejny modul
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
