import type { OnboardingAnswers } from "../types/onboarding";

const interestOptions = [
  { value: "python", label: "Backend i analiza danych" },
  { value: "javascript/typescript", label: "Tworzenie stron internetowych" },
  { value: "html", label: "Projektowanie stron" },
  { value: "not-sure", label: "Jeszcze nie wiem" },
];

const experienceOptions = [
  { value: "beginner", label: "Nie, dopiero zaczynam" },
  { value: "intermediate", label: "Mam trochę doświadczenia" },
  { value: "advanced", label: "Jestem dość doświadczony/a" },
];

const getInterstitialMessage = (answers: OnboardingAnswers) => {
  if (answers.interest === "python") {
    return "Świetny wybór! Python to wszechstronny język używany w tworzeniu aplikacji webowych, analizie danych, sztucznej inteligencji i wielu innych dziedzinach. Znajdźmy idealny kurs dla Ciebie.";
  }
  if (answers.interest === "javascript/typescript") {
    return "Super! JavaScript i TypeScript to podstawa nowoczesnego tworzenia stron internetowych. Pomożemy Ci znaleźć kurs dopasowany do Twoich zainteresowań i poziomu umiejętności.";
  }
  if (answers.interest === "html" || answers.interest === "css") {
    return "Fantastycznie! HTML i CSS to fundamenty projektowania stron internetowych. Pomożemy Ci wybrać kurs dopasowany do Twojej kreatywności i poziomu zaawansowania.";
  }
  return "Nie martw się! Pomożemy Ci odkryć różne ścieżki programowania i znajdziemy kurs, który Cię zainteresuje.";
};

const getFinalMessage = (answers: OnboardingAnswers) => {
  if (answers.experience === "beginner") {
    return "Jako osoba początkująca zaczniesz od podstaw i stopniowo będziesz rozwijać swoje umiejętności. Polecamy zacząć od naszych kursów wprowadzających, aby zbudować solidne fundamenty.";
  }
  if (answers.experience === "intermediate") {
    return "Z pewnym doświadczeniem jesteś gotów/a na bardziej wymagające tematy. Sugerujemy nasze kursy średniozaawansowane, które pomogą Ci rozwinąć umiejętności.";
  }
  return "Jako osoba zaawansowana jesteś gotów/a zgłębić złożone tematy. Polecamy nasze kursy zaawansowane, które pomogą Ci osiągnąć mistrzostwo w wybranej dziedzinie.";
};

export {
  interestOptions,
  experienceOptions,
  getInterstitialMessage,
  getFinalMessage,
};
