import type { Course, Module, Lesson } from "../../types/lesson";

interface LessonsTabProps {
  courses: Course[];
  loading: boolean;
  onEditLesson: (lessonId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
}

export default function LessonsTab({
  courses,
  loading,
  onEditLesson,
  onDeleteLesson,
}: LessonsTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Wszystkie lekcje
      </h2>
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Ladowanie...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {courses.flatMap((course: Course) =>
            course.modules.flatMap((module: Module) =>
              module.lessons.map((lesson: Lesson) => (
                <div
                  key={lesson.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between hover:shadow-md transition"
                >
                  <div>
                    <span className="text-sm font-mono text-slate-500">
                      {lesson.id}
                    </span>
                    <h4 className="font-semibold text-slate-800">
                      {lesson.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {course.title} • {lesson.language} • {lesson.xpReward} XP
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                      onClick={() => onEditLesson(lesson.id)}
                    >
                      Edytuj
                    </button>
                    <button 
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      onClick={() => {
                        if (confirm(`Czy na pewno chcesz usunąć lekcję "${lesson.title}"?`)) {
                          onDeleteLesson?.(lesson.id);
                        }
                      }}
                    >
                      Usun
                    </button>
                  </div>
                </div>
              )),
            ),
          )}
        </div>
      )}
    </div>
  );
}
