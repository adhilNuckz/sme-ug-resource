import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/StudentLayout';
import { codingModuleService } from '../../services';
import Editor from '@monaco-editor/react';
import { FiPlay, FiRotateCcw, FiList, FiCode } from 'react-icons/fi';

const CodingPlayground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (id && modules.length > 0) {
      const module = modules.find((m) => m._id === id);
      if (module) {
        setSelectedModule(module);
        setCode(module.defaultCode);
      }
    }
  }, [id, modules]);

  const fetchModules = async () => {
    try {
      const response = await codingModuleService.getModules({ limit: 50 });
      setModules(response.data.modules || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleModuleSelect = (module) => {
    navigate(`/coding/${module._id}`);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Capture console.log output
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      // Execute code in a safe way
      try {
        // Create a function from the code
        const func = new Function(code);
        func();
        
        // Restore console.log
        console.log = originalLog;
        
        // Set output
        if (logs.length > 0) {
          setOutput(logs.join('\n'));
        } else {
          setOutput('Code executed successfully. No output.');
        }
      } catch (error) {
        console.log = originalLog;
        setOutput(`Error: ${error.message}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (selectedModule) {
      setCode(selectedModule.defaultCode);
      setOutput('');
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Coding Playground</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Module List Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <FiList className="mr-2" />
                Modules
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {modules.map((module) => (
                  <button
                    key={module._id}
                    onClick={() => handleModuleSelect(module)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedModule?._id === module._id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium text-sm">{module.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{module.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Editor and Output */}
          <div className="lg:col-span-3 space-y-6">
            {selectedModule ? (
              <>
                <div className="card">
                  <h2 className="text-xl font-bold mb-2">{selectedModule.title}</h2>
                  <p className="text-gray-600 mb-4">{selectedModule.description}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                      {selectedModule.category}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {selectedModule.programmingLanguage}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {selectedModule.difficulty}
                    </span>
                  </div>
                  {selectedModule.instructions && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">{selectedModule.instructions}</p>
                    </div>
                  )}
                </div>

                {/* Code Editor */}
                <div className="card">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Code Editor</h3>
                    <div className="flex gap-2">
                      <button onClick={handleReset} className="btn-secondary flex items-center">
                        <FiRotateCcw className="mr-2" />
                        Reset
                      </button>
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="btn-primary flex items-center"
                      >
                        <FiPlay className="mr-2" />
                        {isRunning ? 'Running...' : 'Run Code'}
                      </button>
                    </div>
                  </div>

                  <Editor
                    height="400px"
                    defaultLanguage={selectedModule.programmingLanguage === 'cpp' ? 'cpp' : selectedModule.programmingLanguage}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                {/* Output */}
                <div className="card">
                  <h3 className="font-semibold text-lg mb-4">Output</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[150px] max-h-[300px] overflow-auto">
                    {output || 'Output will appear here...'}
                  </div>
                </div>

                {/* Sample Inputs */}
                {selectedModule.sampleInputs && selectedModule.sampleInputs.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold text-lg mb-4">Sample Test Cases</h3>
                    <div className="space-y-3">
                      {selectedModule.sampleInputs.map((sample, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">{sample.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Input:</p>
                              <code className="text-xs bg-white p-2 rounded block">{sample.input}</code>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Expected Output:</p>
                              <code className="text-xs bg-white p-2 rounded block">{sample.expectedOutput}</code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center py-12">
                <FiCode className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a module from the sidebar to start coding</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default CodingPlayground;
