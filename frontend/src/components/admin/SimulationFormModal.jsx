import { useState, useEffect, useRef } from 'react';
import { FiX, FiSave, FiMaximize2, FiMinimize2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';
import graphicsSimulationService from '../../services/graphicsSimulationService';

const TOPIC_OPTIONS = [
  { value: 'translation', label: '2D Translation', dimension: '2d' },
  { value: 'scaling', label: '2D Scaling', dimension: '2d' },
  { value: 'rotation', label: '2D Rotation', dimension: '2d' },
  { value: 'shearing', label: '2D Shearing', dimension: '2d' },
  { value: 'translation3d', label: '3D Translation', dimension: '3d' },
  { value: 'rotation3d', label: '3D Rotation', dimension: '3d' },
  { value: 'scaling3d', label: '3D Scaling', dimension: '3d' }
];

const SimulationFormModal = ({ simulation, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topicId: '',
    dimension: '2d',
    language: 'english',
    icon: '🎨',
    difficulty: 'beginner',
    order: 1,
    instructions: '',
    codeTemplate: '',
    editableVariables: [],
    isActive: true
  });
  const [isCodeEditorFullscreen, setIsCodeEditorFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (simulation) {
      setFormData({
        title: simulation.title || '',
        description: simulation.description || '',
        topicId: simulation.topicId || '',
        dimension: simulation.dimension || '2d',
        language: simulation.language || 'english',
        icon: simulation.icon || '🎨',
        difficulty: simulation.difficulty || 'beginner',
        order: simulation.order || 1,
        instructions: simulation.instructions || '',
        codeTemplate: simulation.codeTemplate || '',
        editableVariables: simulation.editableVariables || [],
        isActive: simulation.isActive !== undefined ? simulation.isActive : true
      });
    }
  }, [simulation]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-update dimension when topicId changes
    if (field === 'topicId') {
      const topic = TOPIC_OPTIONS.find(t => t.value === value);
      if (topic) {
        setFormData(prev => ({ ...prev, dimension: topic.dimension }));
      }
    }
  };

  const handleCodeChange = (value) => {
    setFormData(prev => ({ ...prev, codeTemplate: value || '' }));
  };

  const handleAddVariable = () => {
    setFormData(prev => ({
      ...prev,
      editableVariables: [
        ...prev.editableVariables,
        { name: '', type: 'number', defaultValue: 0, min: 0, max: 100, description: '' }
      ]
    }));
  };

  const handleRemoveVariable = (index) => {
    setFormData(prev => ({
      ...prev,
      editableVariables: prev.editableVariables.filter((_, i) => i !== index)
    }));
  };

  const handleVariableChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      editableVariables: prev.editableVariables.map((variable, i) => 
        i === index ? { ...variable, [field]: value } : variable
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
    if (!formData.topicId) {
      toast.error('Topic ID is required');
      return;
    }
    if (!formData.codeTemplate.trim()) {
      toast.error('Code template is required');
      return;
    }

    try {
      setSaving(true);
      
      // Prepare data
      const submitData = {
        ...formData,
        order: parseInt(formData.order) || 1,
        editableVariables: formData.editableVariables.map(v => ({
          name: v.name,
          type: v.type,
          defaultValue: v.type === 'number' ? parseFloat(v.defaultValue) : v.defaultValue,
          min: v.min !== '' ? parseFloat(v.min) : undefined,
          max: v.max !== '' ? parseFloat(v.max) : undefined,
          description: v.description
        }))
      };

      if (simulation) {
        await graphicsSimulationService.updateSimulation(simulation._id, submitData);
        toast.success('Simulation updated successfully');
      } else {
        await graphicsSimulationService.createSimulation(submitData);
        toast.success('Simulation created successfully');
      }
      
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save simulation');
      console.error('Error saving simulation:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isCodeEditorFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col ${
        isCodeEditorFullscreen ? 'w-full h-full' : 'w-full max-w-6xl max-h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {simulation ? 'Edit Simulation' : 'Create New Simulation'}
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
              <div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic ID *
                </label>
                <select
                  value={formData.topicId}
                  onChange={(e) => handleChange('topicId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={!!simulation}
                >
                  <option value="">Select Topic</option>
                  {TOPIC_OPTIONS.map(topic => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </select>
                {simulation && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Topic ID cannot be changed after creation
                  </p>
                )}
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
                  Dimension *
                </label>
                <select
                  value={formData.dimension}
                  onChange={(e) => handleChange('dimension', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled
                >
                  <option value="2d">2D</option>
                  <option value="3d">3D</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Auto-selected based on Topic ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language *
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
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="🎨"
                />
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleChange('order', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
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
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Instructions for students on how to use this simulation..."
                />
              </div>
            </div>

            {/* Code Template Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code Template *
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
                  defaultLanguage="javascript"
                  value={formData.codeTemplate}
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

            {/* Editable Variables */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Editable Variables
                </label>
                <button
                  type="button"
                  onClick={handleAddVariable}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Variable
                </button>
              </div>

              {formData.editableVariables.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No variables defined. Click "Add Variable" to add parameters that students can modify.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.editableVariables.map((variable, index) => (
                    <div key={index} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Variable #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(index)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={variable.name}
                            onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                            placeholder="tx"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Type *
                          </label>
                          <select
                            value={variable.type}
                            onChange={(e) => handleVariableChange(index, 'type', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                          >
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="string">String</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Default Value *
                          </label>
                          <input
                            type={variable.type === 'number' ? 'number' : 'text'}
                            value={variable.defaultValue}
                            onChange={(e) => handleVariableChange(index, 'defaultValue', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                            required
                          />
                        </div>
                        {variable.type === 'number' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Min
                              </label>
                              <input
                                type="number"
                                value={variable.min}
                                onChange={(e) => handleVariableChange(index, 'min', e.target.value)}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Max
                              </label>
                              <input
                                type="number"
                                value={variable.max}
                                onChange={(e) => handleVariableChange(index, 'max', e.target.value)}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                              />
                            </div>
                          </>
                        )}
                        <div className={variable.type === 'number' ? '' : 'md:col-span-2'}>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={variable.description}
                            onChange={(e) => handleVariableChange(index, 'description', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Description for students"
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
                  {simulation ? 'Update' : 'Create'} Simulation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimulationFormModal;
