import { useState, useEffect, useRef } from 'react';
import { FiX, FiSave, FiMaximize2, FiMinimize2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';
import { codingModuleService } from '../../services';

const CATEGORIES = [
  'DSA',
  'Computer Graphics',
  'Computer Networks',
  'Encryption Algorithms',
  'Sorting Algorithms',
  'Graph Algorithms',
  'Dynamic Programming',
  'Other'
];

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', template: '// Write your JavaScript code here\nfunction solution() {\n  \n}\n\nsolution();' },
  { value: 'python', label: 'Python', template: '# Write your Python code here\ndef solution():\n    pass\n\nsolution()' },
  { value: 'java', label: 'Java', template: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}' },
  { value: 'cpp', label: 'C++', template: '// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}' },
  { value: 'c', label: 'C', template: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}' }
];

const CodingModuleFormModal = ({ module, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'DSA',
    type: 'coding',
    language: 'english',
    programmingLanguage: 'javascript',
    defaultCode: '',
    instructions: '',
    difficulty: 'beginner',
    sampleInputs: [],
    isPublished: true
  });
  const [isCodeEditorFullscreen, setIsCodeEditorFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title || '',
        description: module.description || '',
        category: module.category || 'DSA',
        type: module.type || 'coding',
        language: module.language || 'english',
        programmingLanguage: module.programmingLanguage || 'javascript',
        defaultCode: module.defaultCode || '',
        instructions: module.instructions || '',
        difficulty: module.difficulty || 'beginner',
        sampleInputs: module.sampleInputs || [],
        isPublished: module.isPublished !== undefined ? module.isPublished : true
      });
    } else {
      // Set default template for new modules
      const defaultLang = PROGRAMMING_LANGUAGES.find(l => l.value === 'javascript');
      setFormData(prev => ({ ...prev, defaultCode: defaultLang.template }));
    }
  }, [module]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-update code template when programming language changes
    if (field === 'programmingLanguage' && !module) {
      const lang = PROGRAMMING_LANGUAGES.find(l => l.value === value);
      if (lang) {
        setFormData(prev => ({ ...prev, defaultCode: lang.template }));
      }
    }
  };

  const handleCodeChange = (value) => {
    setFormData(prev => ({ ...prev, defaultCode: value || '' }));
  };

  const handleAddSampleInput = () => {
    setFormData(prev => ({
      ...prev,
      sampleInputs: [
        ...prev.sampleInputs,
        { input: '', expectedOutput: '', description: '' }
      ]
    }));
  };

  const handleRemoveSampleInput = (index) => {
    setFormData(prev => ({
      ...prev,
      sampleInputs: prev.sampleInputs.filter((_, i) => i !== index)
    }));
  };

  const handleSampleInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sampleInputs: prev.sampleInputs.map((input, i) => 
        i === index ? { ...input, [field]: value } : input
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.defaultCode.trim()) {
      toast.error('Default code is required');
      return;
    }

    try {
      setSaving(true);
      
      if (module) {
        await codingModuleService.updateModule(module._id, formData);
        toast.success('Module updated successfully');
      } else {
        await codingModuleService.createModule(formData);
        toast.success('Module created successfully');
      }
      
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save module');
      console.error('Error saving module:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const getEditorLanguage = () => {
    const langMap = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c'
    };
    return langMap[formData.programmingLanguage] || 'javascript';
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isCodeEditorFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col ${
        isCodeEditorFullscreen ? 'w-full h-full' : 'w-full max-w-6xl max-h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {module ? 'Edit Coding Module' : 'Create New Coding Module'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Module Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="coding">Coding</option>
                  <option value="simulation">Simulation</option>
                  <option value="visualization">Visualization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="english">English</option>
                  <option value="tamil">Tamil</option>
                  <option value="sinhala">Sinhala</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Programming Language *
                </label>
                <select
                  value={formData.programmingLanguage}
                  onChange={(e) => handleChange('programmingLanguage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {PROGRAMMING_LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleChange('isPublished', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Published
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Provide instructions, hints, or guidance for students..."
                />
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Default Code Template *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCodeEditorFullscreen(!isCodeEditorFullscreen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isCodeEditorFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isCodeEditorFullscreen ? (
                    <FiMinimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <FiMaximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${
                isCodeEditorFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'
              }`}>
                <Editor
                  height="100%"
                  language={getEditorLanguage()}
                  value={formData.defaultCode}
                  onChange={handleCodeChange}
                  onMount={handleEditorMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: isCodeEditorFullscreen },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    tabSize: 2
                  }}
                />
              </div>
            </div>

            {/* Sample Inputs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sample Test Cases
                </label>
                <button
                  type="button"
                  onClick={handleAddSampleInput}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Test Case
                </button>
              </div>

              {formData.sampleInputs.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No test cases defined. Click "Add Test Case" to add sample inputs and expected outputs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.sampleInputs.map((sampleInput, index) => (
                    <div key={index} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Test Case #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSampleInput(index)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Input
                          </label>
                          <textarea
                            value={sampleInput.input}
                            onChange={(e) => handleSampleInputChange(index, 'input', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white font-mono"
                            placeholder="5, 10"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Expected Output
                          </label>
                          <textarea
                            value={sampleInput.expectedOutput}
                            onChange={(e) => handleSampleInputChange(index, 'expectedOutput', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white font-mono"
                            placeholder="15"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Description
                          </label>
                          <textarea
                            value={sampleInput.description}
                            onChange={(e) => handleSampleInputChange(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Sum of two numbers"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {module ? 'Update' : 'Create'} Module
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodingModuleFormModal;
