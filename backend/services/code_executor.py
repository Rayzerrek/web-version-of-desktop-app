import os
import subprocess
import tempfile
from typing import Tuple

from constants import DEFAULT_CODE_TIMEOUT, MAX_OUTPUT_LENGTH
from models import CodeValidationResponse


class CodeExecutor:
    def __init__(self, timeout: int = DEFAULT_CODE_TIMEOUT):
        self.timeout = timeout
        self.max_output_length = MAX_OUTPUT_LENGTH

    async def execute_safely(self, command: list) -> Tuple[str, str, int]:
        try:
            result = subprocess.run(
                command, capture_output=True, text=True, timeout=self.timeout
            )

            stdout = result.stdout.strip()
            stderr = result.stderr.strip()

            if len(stdout) > self.max_output_length:
                stdout = stdout[: self.max_output_length] + "\n... (output truncated)"
            if len(stderr) > self.max_output_length:
                stderr = stderr[: self.max_output_length] + "\n... (output truncated)"

            return stdout, stderr, result.returncode
        except subprocess.TimeoutExpired:
            return "", f"Kod wykonywał się zbyt długo (timeout {self.timeout}s)", 1
        except Exception as e:
            return "", f"Błąd wykonania: {str(e)}", 1

    async def validate_python(
        self, code: str, expected_output: str
    ) -> CodeValidationResponse:
        stdout, stderr, returncode = await self.execute_safely(["python", "-c", code])

        if stderr or returncode != 0:
            friendly_error = stderr
            if "SyntaxError" in stderr:
                friendly_error = "Błąd składni! Sprawdź czy nie brakuje Ci nawiasu, dwukropka lub cudzysłowu."
            elif "NameError" in stderr:
                friendly_error = "Używasz nazwy (zmiennej lub funkcji), która nie została zdefiniowana."
            elif "IndentationError" in stderr:
                friendly_error = "Błąd wcięć! Pamiętaj, że w Pythonie wcięcia (spacje/tabulacje) są kluczowe dla struktury kodu."
            elif "TypeError" in stderr:
                friendly_error = "Błąd typu! Próbujesz wykonać operację na niekompatybilnych typach danych."
            elif "IndexError" in stderr:
                friendly_error = "Wychodzisz poza zakres listy! Sprawdź czy indeks, którego używasz, istnieje."

            return CodeValidationResponse(
                success=False,
                output=stderr or stdout,
                error=friendly_error,
                is_correct=False,
            )

        is_correct = stdout.strip() == expected_output.strip()

        return CodeValidationResponse(
            success=True, output=stdout, error=None, is_correct=is_correct
        )

    async def validate_javascript(
        self, code: str, expected_output: str
    ) -> CodeValidationResponse:
        stdout, stderr, returncode = await self.execute_safely(["node", "-e", code])

        if stderr or returncode != 0:
            friendly_error = stderr
            if "SyntaxError" in stderr:
                friendly_error = "Błąd składni w JavaScript! Sprawdź czy poprawnie domknąłeś klamry {}, nawiasy () lub czy nie brakuje średnika."
            elif "ReferenceError" in stderr:
                friendly_error = "Odwołujesz się do zmiennej lub funkcji, która nie została zdefiniowana."
            elif "TypeError" in stderr:
                friendly_error = "Błąd typu! Próbujesz wywołać coś, co nie jest funkcją, lub operować na 'undefined/null'."

            return CodeValidationResponse(
                success=False,
                output=stderr or stdout,
                error=friendly_error,
                is_correct=False,
            )

        is_correct = stdout.strip() == expected_output.strip()

        return CodeValidationResponse(
            success=True, output=stdout, error=None, is_correct=is_correct
        )

    async def validate_typescript(
        self, code: str, expected_output: str
    ) -> CodeValidationResponse:
        try:
            with tempfile.NamedTemporaryFile(mode="w", suffix=".ts", delete=False) as f:
                f.write(code)
                temp_file = f.name

            try:
                env = {**os.environ, "TS_NODE_TRANSPILE_ONLY": "true"}
                result = subprocess.run(
                    ["bun", "run", temp_file],
                    capture_output=True,
                    text=True,
                    timeout=self.timeout,
                    env=env,
                )

                stdout = result.stdout.strip()
                stderr = result.stderr.strip()

                if stderr or result.returncode != 0:
                    friendly_error = stderr
                    if "TSError" in stderr or "error TS" in stderr:
                        friendly_error = "Błąd kompilacji TypeScript! Sprawdź zgodność typów i składnię."
                    elif "ReferenceError" in stderr:
                        friendly_error = "Błąd referencji! Zmienna nie istnieje."

                    return CodeValidationResponse(
                        success=False,
                        output=stderr or stdout,
                        error=friendly_error,
                        is_correct=False,
                    )

                is_correct = stdout.strip() == expected_output.strip()

                return CodeValidationResponse(
                    success=True, output=stdout, error=None, is_correct=is_correct
                )
            finally:
                os.unlink(temp_file)
        except subprocess.TimeoutExpired:
            return CodeValidationResponse(
                success=False,
                output="",
                error=f"Kod wykonywał się zbyt długo (timeout {self.timeout}s)",
                is_correct=False,
            )
        except Exception as e:
            return CodeValidationResponse(
                success=False,
                output="",
                error=f"Nie można uruchomić TypeScript: {str(e)}",
                is_correct=False,
            )

    async def validate_html(
        self, code: str, expected_output: str
    ) -> CodeValidationResponse:
        """
        Walidacja HTML/CSS polega na sprawdzeniu, czy kod zawiera oczekiwane fragmenty.
        """
        if not expected_output:
            return CodeValidationResponse(
                success=True,
                output="Kod został poprawnie wyrenderowany.",
                error=None,
                is_correct=True,
            )

        import re

        # Normalizacja dla łatwiejszego porównania
        normalized_code = " ".join(code.split()).lower()
        normalized_expected = " ".join(expected_output.split()).lower()

        # Sprawdzenie obecności fragmentu lub tagu
        is_correct = normalized_expected in normalized_code

        # Próba dopasowania regexem
        if not is_correct:
            try:
                if re.search(expected_output, code, re.IGNORECASE | re.DOTALL):
                    is_correct = True
            except:
                pass

        return CodeValidationResponse(
            success=True,
            output="Podgląd został zaktualizowany.",
            error=None
            if is_correct
            else f"Twój kod nie spełnia wymagań zadania (oczekiwano: {expected_output})",
            is_correct=is_correct,
        )


# Global instance
code_executor = CodeExecutor()
