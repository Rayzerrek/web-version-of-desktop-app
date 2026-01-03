import { useState } from "react";
import CodeEditor from "./CodeEditor";
import ButtonComponent from "./common/ButtonComponent";
import { apiFetch, authHeaders } from "../services/ApiClient";
import HtmlCssPreview from "./HtmlCssPreview";
import type {
  OnboardingRecommendation,
  OnboardingAnswers,
} from "../types/onboarding";

interface OnboardingDemoLessonProps {
  recommendation?: OnboardingRecommendation;
  interest?: OnboardingAnswers["interest"];
  onFinish: () => void;
}

const DEMO_CONTENT: Record<
  string,
  { language: string; code: string; title: string; instruction: string }
> = {
  python: {
    language: "python",
    code: '# Witaj! Wpisz swój pierwszy kod w Pythonie\nprint("Witaj, Świecie!")',
    title: "Wypróbuj Pythona",
    instruction:
      'Kliknij przycisk "Uruchom kod", aby wykonać swój pierwszy skrypt w Pythonie.',
  },
  "javascript/typescript": {
    language: "javascript",
    code: '// Witaj w JavaScript!\nconsole.log("Witaj, Świecie!");',
    title: "Wypróbuj JavaScript",
    instruction:
      'Kliknij przycisk "Uruchom kod", aby zobaczyć wynik działania JavaScript.',
  },
  html: {
    language: "html",
    code: "<!-- Stwórz nagłówek w HTML -->\n<h1>Witaj, Świecie!</h1>\n<p>To jest Twój pierwszy element HTML.</p>",
    title: "Wypróbuj HTML",
    instruction:
      "W HTML budujesz strukturę strony. Zmień tekst w nagłówku <h1>.",
  },
  css: {
    language: "css",
    code: "/* Dodaj kolory do swojej strony */\nbody {\n  background-color: #f0f9ff;\n}\nh1 {\n  color: #1d4ed8;\n  text-align: center;\n}",
    title: "Wypróbuj CSS",
    instruction:
      "CSS odpowiada za wygląd. Spróbuj zmienić kolor (np. na 'red').",
  },
  default: {
    language: "python",
    code: '# Witaj! Wpisz swój pierwszy kod w Pythonie\nprint("Witaj, Świecie!")',
    title: "Wypróbuj swoją pierwszą lekcję",
    instruction:
      "To jest Twój edytor kodu. Spróbuj uruchomić kod, a następnie zmodyfikuj go i uruchom ponownie!",
  },
};

export const OnboardingDemoLesson = ({
  recommendation,
  interest,
  onFinish,
}: OnboardingDemoLessonProps) => {
  const content =
    interest && DEMO_CONTENT[interest]
      ? DEMO_CONTENT[interest]
      : DEMO_CONTENT.default;

  const [code, setCode] = useState(content.code);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async (codeToRun: string) => {
    setIsRunning(!isRunning);
    try {
      const token = localStorage.getItem("access_token");
      const response = await apiFetch("/validate_code", {
        method: "POST",
        headers: authHeaders(token || ""),
        body: JSON.stringify({
          code: codeToRun,
          language: content.language,
          expectedOutput: "",
        }),
      });

      setOutput(
        (response as any).output || (response as any).result || "Kod wykonany",
      );
    } catch (error: any) {
      setOutput(`Błąd: ${error.message || "Nie udało się wykonać kodu"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinish = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await apiFetch("/users/onboarding/complete", {
        method: "POST",
        headers: authHeaders(token || ""),
      });
      onFinish();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      onFinish();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {content.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {content.instruction}
          </p>
          {recommendation && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-900 dark:text-blue-300">
                <strong>Twoja ścieżka:</strong> {recommendation.coursePath}
              </p>
              <p className="text-blue-800 dark:text-blue-400 text-sm mt-1">
                {recommendation.message}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Instrukcje
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                1. Kliknij przycisk <strong>"Uruchom kod"</strong>, aby wykonać
                swój kod
              </p>
              <p>2. Spróbuj zmienić tekst w edytorze</p>
              <p>3. Uruchom ponownie, aby zobaczyć zmiany</p>
              <p>
                4. Kliknij przycisk <strong>"Resetuj"</strong> wewnątrz edytora,
                aby zacząć od nowa
              </p>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                Wskazówka
              </h3>
              <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                Każda lekcja w kursie ma podobną strukturę: instrukcje po lewej,
                kod po prawej. Ucz się w swoim tempie!
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Edytor kodu
              </h2>
              <CodeEditor
                value={code}
                language={content.language}
                onChange={setCode}
                onRun={handleRunCode}
              />

              {output &&
                content.language !== "html" &&
                content.language !== "css" && (
                  <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-auto max-h-48">
                    <div className="text-xs text-gray-500 mb-2">Output:</div>
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
            </div>

            {(content.language === "html" || content.language === "css") && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Podgląd na żywo
                </h2>
                <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white">
                  <HtmlCssPreview
                    html={
                      content.language === "html"
                        ? code
                        : "<h1>Witaj, Świecie!</h1><p>CSS zmienia wygląd tej strony.</p>"
                    }
                    css={content.language === "css" ? code : ""}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gotowy/a na więcej?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Przejdź do pełnego kursu i zacznij swoją podróż w programowaniu!
              </p>
            </div>
            <ButtonComponent onClick={handleFinish} size="large">
              Przejdź do kursu →
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
