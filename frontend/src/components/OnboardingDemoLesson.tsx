import { useState } from 'react';
import CodeEditor from './CodeEditor';
import ButtonComponent from './common/ButtonComponent';
import { apiFetch, authHeaders } from '../services/ApiClient';
import type { OnboardingRecommendation } from '../types/onboarding';

interface OnboardingDemoLessonProps {
    recommendation?: OnboardingRecommendation;
    onFinish: () => void;
}

export const OnboardingDemoLesson = ({ recommendation, onFinish }: OnboardingDemoLessonProps) => {
    const [code, setCode] = useState('# Welcome! Type your first Python code here\nprint("Hello, World!")');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleRunCode = async () => {
        setIsRunning(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await apiFetch('/services/execute', {
                method: 'POST',
                headers: authHeaders(token || ''),
                body: JSON.stringify({ code, language: 'python' }),
            });

            setOutput((response as any).output || (response as any).result || 'Code executed');
        } catch (error: any) {
            setOutput(`Error: ${error.message || 'Failed to execute code'}`);
        } finally {
            setIsRunning(false);
        }
    };

    const handleReset = () => {
        setCode('# Welcome! Type your first Python code here\nprint("Hello, World!")');
        setOutput('');
    };

    const handleFinish = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await apiFetch('/users/onboarding/complete', {
                method: 'POST',
                headers: authHeaders(token || ''),
            });
            onFinish();
        } catch (error) {
            console.error('Error completing onboarding:', error);
            onFinish();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                        Try Your First Lesson
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        This is your code editor. Try running the code, then modify it and run again!
                    </p>
                    {recommendation && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-blue-900 dark:text-blue-300">
                                <strong>Your path:</strong> {recommendation.coursePath}
                            </p>
                            <p className="text-blue-800 dark:text-blue-400 text-sm mt-1">
                                {recommendation.message}
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Instructions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Instructions
                        </h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p>
                                1. Click the <strong>"Run Code"</strong> button to execute your code
                            </p>
                            <p>
                                2. Try changing the message inside the quotes
                            </p>
                            <p>
                                3. Run it again to see your changes
                            </p>
                            <p>
                                4. Click <strong>"Reset"</strong> if you want to start over
                            </p>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                💡 Quick Tips
                            </h3>
                            <ul className="list-disc list-inside text-blue-800 dark:text-blue-400 space-y-1">
                                <li>Code runs line by line from top to bottom</li>
                                <li>print() displays text in the output</li>
                                <li>Strings need quotes around them</li>
                            </ul>
                        </div>

                        <ButtonComponent onClick={handleFinish} className="w-full mt-6">
                            Finish & Start Learning →
                        </ButtonComponent>
                    </div>

                    {/* Code Editor */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Code Editor
                                </h3>
                                <div className="space-x-2">
                                    <ButtonComponent onClick={handleReset} className="text-sm">
                                        Reset
                                    </ButtonComponent>
                                    <ButtonComponent onClick={handleRunCode} disabled={isRunning} className="text-sm">
                                        {isRunning ? 'Running...' : 'Run Code'}
                                    </ButtonComponent>
                                </div>
                            </div>

                            <CodeEditor
                                initialCode={code}
                                onChange={setCode}
                                language="python"
                                height="300px"
                            />
                        </div>

                        {/* Output */}
                        <div className="bg-gray-900 rounded-lg shadow-lg p-4">
                            <h3 className="font-semibold text-white mb-2">Output</h3>
                            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap min-h-[100px]">
                                {output || 'Click "Run Code" to see output here...'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
