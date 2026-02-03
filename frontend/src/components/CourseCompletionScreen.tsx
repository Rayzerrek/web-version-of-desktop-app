import { useEffect, useState } from "react";
import type { Course } from "../types/lesson";
import ButtonComponent from "./common/ButtonComponent";

interface CourseCompletionScreenProps {
  course: Course;
  onBackToCourses: () => void;
  totalXpEarned: number;
}

export default function CourseCompletionScreen({
  course,
  onBackToCourses,
  totalXpEarned,
}: CourseCompletionScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  ["bg-purple-500", "bg-indigo-500", "bg-blue-500", "bg-pink-500", "bg-yellow-500"][
                    Math.floor(Math.random() * 5)
                  ]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center relative">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="text-8xl animate-bounce">🏆</div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Gratulacje!
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-purple-600 dark:text-purple-400 mb-8">
            Ukończyłeś kurs "{course.title}"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-2xl p-6">
              <div className="text-4xl mb-2"></div>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {totalLessons}
              </div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Ukończonych lekcji
              </div>
            </div>

            <div className="bg-indigo-100 dark:bg-indigo-900 rounded-2xl p-6">
              <div className="text-4xl mb-2"></div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                {totalXpEarned}
              </div>
              <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Zdobytych punktów XP
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-slate-700 rounded-2xl p-8 mb-8">
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-4">
              Osiągnąłeś niesamowity sukces! Ukończyłeś wszystkie lekcje i
              moduły z tego kursu. To dowód Twojego zaangażowania, ciężkiej pracy
              i determinacji.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
              Teraz jesteś gotowy, aby wykorzystać zdobytą wiedzę w praktyce i
              kontynuować swoją przygodę z programowaniem!
            </p>
          </div>


          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonComponent
              onClick={onBackToCourses}
              variant="primary"
              size="large"
              className="px-8 py-4 text-lg font-semibold"
            >
              Przeglądaj więcej kursów
            </ButtonComponent>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear infinite;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  );
}
