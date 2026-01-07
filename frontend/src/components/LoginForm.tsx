import { useState } from "react";
import { Input } from "./common/Input";

interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
  disabled?: boolean;
}

export default function LoginForm({
  onSubmit,
  disabled = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, rememberMe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
        placeholder="twoj@email.com"
      />

      <Input
        label="Hasło"
        type="password"
        value={password}
        onChange={setPassword}
        required
        placeholder="••••••••"
      />

      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          Zapamiętaj mnie
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? "Logowanie..." : "Zaloguj się"}
      </button>
    </form>
  );
}
