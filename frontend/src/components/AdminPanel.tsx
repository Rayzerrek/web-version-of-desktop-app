import { useState, useEffect } from "react";
import type { Course, Module } from "../types/lesson";
import { lessonService } from "../services/LessonService";
import LessonEditDialog from "./LessonEditDialog";
import AdminHeader from "./AdminPanel/AdminHeader";

type AdminTab = "courses" | "lessons" | "create" | "create-course";
import AdminTabs from "./AdminPanel/AdminTabs";
import CoursesTab from "./AdminPanel/CoursesTab";
import LessonsTab from "./AdminPanel/LessonsTab";
import CreateCourseTab from "./AdminPanel/CreateCourseTab";
import CreateLessonTab from "./AdminPanel/CreateLessonTab";

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await lessonService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    loadCourses();
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await lessonService.deleteCourse(courseId);
      alert("Kurs usuniety pomyslnie!");
      await loadCourses();
      setSelectedCourse(null);
      setSelectedModule(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Blad podczas usuwania kursu: " + error);
    }
  };

  const openEdit = (lessonId: string) => {
    setEditingLessonId(lessonId);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminHeader onBack={onBack} />

        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
          style={{
            boxShadow:
              "0 12px 48px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          {activeTab === "courses" && (
            <CoursesTab
              courses={courses}
              loading={loading}
              selectedCourse={selectedCourse}
              selectedModule={selectedModule}
              setSelectedCourse={setSelectedCourse}
              setSelectedModule={setSelectedModule}
              setActiveTab={setActiveTab}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === "lessons" && (
            <LessonsTab
              courses={courses}
              loading={loading}
              onEditLesson={openEdit}
            />
          )}

          {activeTab === "create-course" && (
            <CreateCourseTab
              selectedCourse={selectedCourse}
              selectedModule={selectedModule}
              setSelectedCourse={setSelectedCourse}
              setSelectedModule={setSelectedModule}
              setActiveTab={setActiveTab}
              loadCourses={loadCourses}
            />
          )}

          {activeTab === "create" && (
            <CreateLessonTab
              selectedCourse={selectedCourse}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              setActiveTab={setActiveTab}
              loadCourses={loadCourses}
            />
          )}
        </div>
      </div>

      {editingLessonId && (
        <LessonEditDialog
          isOpen={true}
          onClose={() => setEditingLessonId(null)}
          lessonId={editingLessonId}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
