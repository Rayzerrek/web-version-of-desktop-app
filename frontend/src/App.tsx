import { useState, useEffect } from "react";
import AuthPanel from "./components/AuthPanel";
import LessonDemo from "./components/LessonDemo";
import CourseDashboard from "./components/CourseDashboard";
import AdminPanel from "./components/AdminPanel";
import CodePlayground from "./components/CodePlayground";
import { OnBoardingQuiz } from "./components/OnBoardingQuiz";
import { OnboardingDemoLesson } from "./components/OnboardingDemoLesson";
import ThemeToggle from "./components/ThemeToggle";
import { UserProfileDropdown } from "./components/UserProfileDropdown";
import Toast, { type ToastType } from "./components/Toast";
import Button from "./components/common/Button";
import { lessonService } from "./services/LessonService";
import { useAuth } from "./hooks/useAuth";
import { apiFetch, authHeaders } from "./services/ApiClient";
import type {
  OnboardingRecommendation,
  OnboardingAnswers,
} from "./types/onboarding";
import "./styles/App.css";

function App() {
  const { isAuthenticated, isAdmin, refreshAdmin, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState<
    | "auth"
    | "dashboard"
    | "lesson"
    | "admin"
    | "playground"
    | "onboarding"
    | "onboarding-demo"
  >("auth");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [onboardingData, setOnboardingData] = useState<{
    recommendation?: OnboardingRecommendation;
    answers?: OnboardingAnswers;
  }>({});
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAdmin();
      if (currentView === "auth") {
        // Check if user needs onboarding
        checkOnboardingStatus();
      }
    }
  }, [isAuthenticated, refreshAdmin, currentView]);

  const checkOnboardingStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await apiFetch<{ onboarding_completed: boolean }>(
        "/users/me",
        {
          method: "GET",
          headers: authHeaders(token || ""),
        },
      );

      if (response && !response.onboarding_completed) {
        setCurrentView("onboarding");
      } else {
        setCurrentView("dashboard");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setCurrentView("dashboard");
    }
  };

  const handleCourseSelect = async (courseId: string) => {
    console.log("Selected course ID:", courseId);

    if (courseId === selectedCourseId) {
      setCurrentView("dashboard");
      return;
    }

    setSelectedCourseId(courseId);

    try {
      const courses = await lessonService.getCourses();
      const course = courses.find((c) => c.id === courseId);
      console.log("Found course:", course?.title);

      if (course && course.modules[0]?.lessons[0]) {
        const firstLessonId = course.modules[0].lessons[0].id;
        console.log("First lesson ID:", firstLessonId);
        setSelectedLessonId(firstLessonId);
        setCurrentView("lesson");
      } else {
        console.error("No lessons found in course!");
      }
    } catch (error) {
      console.error("Error loading course:", error);
      setToast({
        message: "Błąd ładowania kursu",
        type: "error",
      });
    }
  };

  const handleAdminAccess = () => {
    if (!isAuthenticated) {
      setToast({
        message: "Musisz być zalogowany aby uzyskać dostęp do panelu admina",
        type: "error",
      });
      return;
    }

    if (!isAdmin) {
      setToast({
        message: "Nie masz uprawnień administratora!",
        type: "error",
      });
      return;
    }

    setCurrentView("admin");
  };

  const handleOnboardingComplete = (
    recommendation: OnboardingRecommendation,
    answers: OnboardingAnswers,
  ) => {
    setOnboardingData({ recommendation, answers });
    setCurrentView("onboarding-demo");
  };

  const handleOnboardingFinish = async () => {
    if(onboardingData.recommendation?.courseId) {
      try {
        const courses = await lessonService.getCourses();
        const recommendedCourse = courses.find(
          (course) => course.id === onboardingData.recommendation?.courseId,
        )
        if(recommendedCourse) {
          await handleCourseSelect(recommendedCourse.id);
        } else {
          setCurrentView("dashboard");
        }
      } catch (error) {
        console.error(`Error loading recommended course: ${error}`);
        setCurrentView("dashboard");
      }
    } else {
      setCurrentView("dashboard");
    }
  };

  if (currentView === "onboarding") {
    return (
      <OnBoardingQuiz
        onComplete={handleOnboardingComplete}
        onSkip={() => setCurrentView("dashboard")}
      />
    );
  }

  if (currentView === "onboarding-demo") {
    return (
      <OnboardingDemoLesson
        recommendation={onboardingData.recommendation}
        onFinish={handleOnboardingFinish}
      />
    );
  }

  if (currentView === "admin") {
    if (!isAdmin) {
      setToast({
        message: "Brak dostępu! Przekierowuję...",
        type: "error",
      });
      setTimeout(() => setCurrentView("dashboard"), 1000);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
              Brak dostępu
            </h1>
            <p className="text-muted dark:text-muted-dark mt-2">
              Tylko administratorzy mogą tutaj wejść
            </p>
          </div>
        </div>
      );
    }
    return <AdminPanel onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "playground") {
    return <CodePlayground onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "lesson") {
    return (
      <div>
        <Button
          onClick={() => {
            setCurrentView("dashboard");
          }}
          variant="secondary"
          size="sm"
          className="fixed bottom-4 left-4 z-50"
        >
          ← Powrót do kursów
        </Button>
        <LessonDemo
          lessonId={selectedLessonId}
          onNextLesson={(nextLessonId) => {
            console.log("App - Setting next lesson:", nextLessonId);
            setSelectedLessonId(nextLessonId);
          }}
        />
      </div>
    );
  }

  if (isAuthenticated && currentView === "dashboard") {
    return (
      <div className="bg-background dark:bg-background-dark min-h-screen">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserProfileDropdown />
          </div>
        </div>
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
          <Button
            onClick={() => {
              logout();
            }}
            variant="danger"
            size="sm"
          >
            Wyloguj
          </Button>
          <Button
            onClick={() => setCurrentView("playground")}
            variant="blue"
            size="sm"
          >
            Code Playground
          </Button>
        </div>
        {isAdmin && (
          <Button
            onClick={handleAdminAccess}
            size="sm"
            className="fixed bottom-4 right-4 bg-black text-white"
          >
            Panel Admina
          </Button>
        )}
        <CourseDashboard onCourseSelect={handleCourseSelect} />
      </div>
    );
  }

  const handleDevLogin = async () => {
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        user_id?: string;
        access_token?: string;
        refresh_token?: string;
      }>(`/auth/login`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          email: "rayserrek@gmail.com",
          password: "Kacper1234!",
        }),
      });

      if (response.success) {
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
        }
        if (response.refresh_token) {
          localStorage.setItem("refresh_token", response.refresh_token);
        }
        if (response.user_id) {
          localStorage.setItem("user_id", response.user_id);
        }
        login();
      } else {
        setToast({
          message: "Dev login failed: " + response.message,
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Dev login error: " + error,
        type: "error",
      });
    }
  };

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <Button
          onClick={handleDevLogin}
          variant="purple"
          size="sm"
          className="font-mono"
        >
          DEV: Skip to Dashboard
        </Button>
      </div>
      <AuthPanel onLoginSuccess={login} />
    </div>
  );
}

export default App;
