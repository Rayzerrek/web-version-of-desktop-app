import subprocess
import tempfile
import os
from typing import Tuple
from models import CodeValidationResponse
from constants import MAX_OUTPUT_LENGTH, DEFAULT_CODE_TIMEOUT


class CodeExecutor:

    
    def __init__(self, timeout: int = DEFAULT_CODE_TIMEOUT):
        self.timeout = timeout
        self.max_output_length = MAX_OUTPUT_LENGTH
    
    async def execute_safely(self, command: list) -> Tuple[str, str, int]:

        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            stdout = result.stdout.strip()
            stderr = result.stderr.strip()
            
            if len(stdout) > self.max_output_length:
                stdout = stdout[:self.max_output_length] + "\n... (output truncated)"
            if len(stderr) > self.max_output_length:
                stderr = stderr[:self.max_output_length] + "\n... (output truncated)"
            
            return stdout, stderr, result.returncode
        except subprocess.TimeoutExpired:
            return "", f"Kod wykonywał się zbyt długo (timeout {self.timeout}s)", 1
        except Exception as e:
            return "", f"Błąd wykonania: {str(e)}", 1
    
    async def validate_python(self, code: str, expected_output: str) -> CodeValidationResponse:
        stdout, stderr, returncode = await self.execute_safely(["python", "-c", code])
        
        if stderr or returncode != 0:
            return CodeValidationResponse(
                success=False,
                output=stderr or stdout,
                error=stderr or "Kod zakończył się błędem",
                is_correct=False
            )
        
        is_correct = stdout == expected_output
        
        return CodeValidationResponse(
            success=True,
            output=stdout,
            error=None,
            is_correct=is_correct
        )
    
    async def validate_javascript(self, code: str, expected_output: str) -> CodeValidationResponse:
        stdout, stderr, returncode = await self.execute_safely(["node", "-e", code])
        
        if stderr or returncode != 0:
            return CodeValidationResponse(
                success=False,
                output=stderr or stdout,
                error=stderr or "Kod zakończył się błędem",
                is_correct=False
            )
        
        is_correct = stdout == expected_output
        
        return CodeValidationResponse(
            success=True,
            output=stdout,
            error=None,
            is_correct=is_correct
        )
    
    async def validate_typescript(self, code: str, expected_output: str) -> CodeValidationResponse:
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            try:
                env = {**os.environ, "TS_NODE_TRANSPILE_ONLY": "true"}
                result = subprocess.run(
                    ["ts-node", temp_file],
                    capture_output=True,
                    text=True,
                    timeout=self.timeout,
                    env=env
                )
                
                stdout = result.stdout.strip()
                stderr = result.stderr.strip()
                
                if stderr or result.returncode != 0:
                    return CodeValidationResponse(
                        success=False,
                        output=stderr or stdout,
                        error=stderr or "Kod zakończył się błędem",
                        is_correct=False
                    )
                
                is_correct = stdout == expected_output
                
                return CodeValidationResponse(
                    success=True,
                    output=stdout,
                    error=None,
                    is_correct=is_correct
                )
            finally:
                os.unlink(temp_file)
        except subprocess.TimeoutExpired:
            return CodeValidationResponse(
                success=False,
                output="",
                error=f"Kod wykonywał się zbyt długo (timeout {self.timeout}s)",
                is_correct=False
            )
        except Exception as e:
            return CodeValidationResponse(
                success=False,
                output="",
                error=f"Nie można uruchomić TypeScript: {str(e)}",
                is_correct=False
            )


# Global instance
code_executor = CodeExecutor()
