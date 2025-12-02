import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/StudentLayout';
import { graphicsSimulationService } from '../../services';
import { FiList, FiPlay, FiMaximize, FiX, FiRotateCw, FiLoader } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
import { useLanguage } from '../../context/LanguageContext';

const GraphicsSimulation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useLanguage();
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [simulations, setSimulations] = useState([]);
  const [topics2D, setTopics2D] = useState([]);
  const [topics3D, setTopics3D] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [dimension, setDimension] = useState('2d');
  const [code, setCode] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch simulations from MongoDB
  useEffect(() => {
    fetchSimulations();
  }, []);

  // Load code when topic changes
  useEffect(() => {
    if (selectedTopic) {
      loadSimulationCode(selectedTopic.topicId);
    }
  }, [selectedTopic]);

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const response = await graphicsSimulationService.getSimulations({ isActive: true });
      const sims = response.data || [];
      
      setSimulations(sims);
      
      // Separate 2D and 3D topics
      const topics2d = sims.filter(s => s.dimension === '2d').map(s => ({
        id: s.topicId,
        name: s.title.replace('2D ', ''),
        icon: s.icon,
        _id: s._id
      }));
      
      const topics3d = sims.filter(s => s.dimension === '3d').map(s => ({
        id: s.topicId,
        name: s.title.replace('3D ', ''),
        icon: s.icon,
        _id: s._id
      }));
      
      setTopics2D(topics2d);
      setTopics3D(topics3d);
      
      // Set default topic
      if (topics2d.length > 0) {
        const defaultSim = sims.find(s => s.topicId === 'translation');
        setSelectedTopic(defaultSim || sims[0]);
      }
    } catch (error) {
      console.error('Error fetching simulations:', error);
      setError('Failed to load simulations');
    } finally {
      setLoading(false);
    }
  };

  const loadSimulationCode = async (topicId) => {
    try {
      const response = await graphicsSimulationService.getSimulationByTopic(topicId);
      const simulation = response.data;
      
      if (simulation && simulation.codeTemplate) {
        setCode(simulation.codeTemplate);
        setError(null);
      }
    } catch (error) {
      console.error('Error loading simulation code:', error);
      setError('Failed to load code template');
    }
  };

  // Auto-run code on load
  useEffect(() => {
    if (code) {
      runCode();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [code]);

  const runCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    setError(null);
    setIsRunning(true);

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid background
      drawGrid(ctx, canvas.width, canvas.height);

      // Execute the code and call the draw function
      // Using Function constructor to safely evaluate code
      const executeCode = new Function('ctx', 'canvas', `
        ${code}
        if (typeof draw === 'function') {
          draw(ctx, canvas);
        }
      `);
      
      executeCode(ctx, canvas);
      
      // For animated topics, keep running
      if (selectedTopic && selectedTopic.topicId === 'rotation3d') {
        animationFrameRef.current = requestAnimationFrame(() => runCode());
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Code execution error:', err);
    } finally {
      if (!selectedTopic || selectedTopic.topicId !== 'rotation3d') {
        setIsRunning(false);
      }
    }
  };

  const drawGrid = (ctx, width, height) => {
    // Light grid
    ctx.strokeStyle = darkMode ? '#333' : '#e5e7eb';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Center axes
    ctx.strokeStyle = darkMode ? '#555' : '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  };

  const handleTopicChange = (topicId) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const simulation = simulations.find(s => s.topicId === topicId);
    if (simulation) {
      setSelectedTopic(simulation);
    }
    setIsRunning(false);
  };

  const handleDimensionChange = (dim) => {
    setDimension(dim);
    const firstTopicId = dim === '2d' ? 'translation' : 'translation3d';
    handleTopicChange(firstTopicId);
  };

  const handleRunCode = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    runCode();
  };

  const handleReset = () => {
    if (selectedTopic && selectedTopic.codeTemplate) {
      setCode(selectedTopic.codeTemplate);
      setError(null);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900'
    : '';

  const content = (
    <div className={`${containerClass} ${!isFullscreen && 'space-y-4'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            🎨 Computer Graphics Lab
          </h1>
          
          {/* Dimension Toggle */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => handleDimensionChange('2d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dimension === '2d'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              2D Transformations
            </button>
            <button
              onClick={() => handleDimensionChange('3d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dimension === '3d'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              3D Transformations
            </button>
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <FiX className="text-xl text-gray-600 dark:text-gray-400" />
          ) : (
            <FiMaximize className="text-xl text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Topic Selector */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <FiLoader className="animate-spin text-primary-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading simulations...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Topic:
            </span>
            {(dimension === '2d' ? topics2D : topics3D).map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTopic && selectedTopic.topicId === topic.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="mr-2">{topic.icon}</span>
                {topic.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content - Split Screen */}
      <div className={`flex ${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[calc(100vh-260px)]'} overflow-hidden`}>
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>📝</span> Code Editor
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="btn-secondary text-sm flex items-center gap-2"
                title="Reset to default code"
              >
                <FiRotateCw />
                Reset
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning && selectedTopic === 'rotation3d'}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <FiPlay />
                Run Code
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300 font-mono">
                ❌ Error: {error}
              </p>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={darkMode ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Tip:</strong> Modify the variables at the top of the code
              (like <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded">tx</code>,{' '}
              <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded">ty</code>,{' '}
              <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded">angle</code>, etc.)
              and click "Run Code" to see the transformation in action!
            </p>
          </div>
        </div>

        {/* Right Panel - Canvas Visualization */}
        <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-gray-800">
          {/* <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
             <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🎬</span> Live Visualization
            </h3> 
          </div> */}

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="display-block"
                style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📊 Legend:
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Original Shape</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Transformed Shape</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Helper Lines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isFullscreen ? content : <StudentLayout>{content}</StudentLayout>;
};

export default GraphicsSimulation;
