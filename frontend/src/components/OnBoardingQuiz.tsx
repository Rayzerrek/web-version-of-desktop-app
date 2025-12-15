import { useState } from "react";
import ButtonComponent from "./common/ButtonComponent";
import type {
  OnboardingAnswers,
  OnboardingRecommendation,
} from "../types/onboarding";
import {
  interestOptions,
  experienceOptions,
  getInterstitialMessage,
  getFinalMessage,
} from "../utils/startQuizQuestions";
import { apiFetch, authHeaders } from "../services/ApiClient";

interface OnBoardingQuizProps {
  onComplete: (
    recommendation: OnboardingRecommendation,
    answers: OnboardingAnswers,
  ) => void;
  onSkip: () => void;
}

export const OnBoardingQuiz = ({ onComplete, onSkip }: OnBoardingQuizProps) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    interest: null,
    experience: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInterestSelect = (interest: string) => {
    setAnswers({
      ...answers,
      interest: interest as OnboardingAnswers["interest"],
    });
  };

  const handleExperienceSelect = (experience: string) => {
    setAnswers({
      ...answers,
      experience: experience as OnboardingAnswers["experience"],
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await apiFetch<OnboardingRecommendation>(
        "/users/onboarding",
        {
          method: "POST",
          headers: authHeaders(token || ""),
          body: JSON.stringify(answers),
        },
      );

      if (response) {
        onComplete(response, answers);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen blue-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Step {step} of 4</span>
            <button
              onClick={handleSkip}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Greetings! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Let's find a learning path for you. What are you most interested
                in?
              </p>
            </div>

            <div className="space-y-3">
              {interestOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInterestSelect(option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answers.interest === option.value
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                  }`}
                >
                  <span className="text-gray-900 dark:text-white font-medium">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <ButtonComponent
              onClick={handleNext}
              disabled={!answers.interest}
              className="w-full"
            >
              Continue
            </ButtonComponent>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🚀</div>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {getInterstitialMessage(answers)}
              </p>
            </div>

            <ButtonComponent onClick={handleNext} className="w-full">
              Continue
            </ButtonComponent>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Have you coded much before?
              </h2>
            </div>

            <div className="space-y-3">
              {experienceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleExperienceSelect(option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answers.experience === option.value
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                  }`}
                >
                  <span className="text-gray-900 dark:text-white font-medium">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <ButtonComponent
              onClick={handleNext}
              disabled={!answers.experience}
              className="w-full"
            >
              Continue
            </ButtonComponent>
          </div>
        )}

        {/* Step 4: Final Interstitial */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🎯</div>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {getFinalMessage(answers)}
              </p>
            </div>

            <ButtonComponent
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Loading..." : "Let's Start!"}
            </ButtonComponent>
          </div>
        )}
      </div>
    </div>
  );
};
