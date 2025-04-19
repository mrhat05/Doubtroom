import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, ArrowLeft, Lightbulb } from 'lucide-react';
import DataService from '../firebase/DataService';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { toast } from 'sonner';
import { Box, Typography, Chip } from '@mui/material';

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    text: '',
    branch: '',
    photo: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const topicSuggestions = [
    "Data Structures",
    "Algorithms",
    "Database Management",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Machine Learning",
    "Artificial Intelligence",
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "Cybersecurity",
    "Blockchain",
    "IoT",
    "Computer Architecture"
  ];

  const branches = [
    { value: 'biotechnology_biochemical_engineering', label: 'Biotechnology & Biochemical Engineering' },
    { value: 'chemical_engineering', label: 'Chemical Engineering' },
    { value: 'civil_engineering', label: 'Civil Engineering' },
    { value: 'structural_engineering', label: 'Structural Engineering' },
    { value: 'geo_technical_engineering', label: 'Geo-technical Engineering' },
    { value: 'transportation_engineering', label: 'Transportation Engineering' },
    { value: 'environmental_engineering', label: 'Environmental Engineering' },
    { value: 'water_resources_engineering', label: 'Water Resources Engineering' },
    { value: 'hydroinformatics_engineering', label: 'Hydroinformatics Engineering' },
    { value: 'seismic_science_engineering', label: 'Seismic Science and Engineering' },
    { value: 'computer_science_engineering', label: 'Computer Science & Engineering' },
    { value: 'artificial_intelligence', label: 'Artificial Intelligence' },
    { value: 'cyber_security', label: 'Cyber Security' },
    { value: 'data_science_engineering', label: 'Data Science and Engineering' },
    { value: 'electrical_engineering', label: 'Electrical Engineering' },
    { value: 'power_electronics_drives', label: 'Power Electronics & Drives' },
    { value: 'power_system_engineering', label: 'Power System Engineering' },
    { value: 'instrumentation_engineering', label: 'Instrumentation Engineering' },
    { value: 'integrated_energy_system', label: 'Integrated Energy System' },
    { value: 'electronics_instrumentation_engineering', label: 'Electronics And Instrumentation Engineering' },
    { value: 'electronics_communication_engineering', label: 'Electronics and Communication Engineering' },
    { value: 'communication_signal_processing', label: 'Communication Systems & Signal Processing' },
    { value: 'vlsi_design', label: 'VLSI Design' },
    { value: 'mechanical_engineering', label: 'Mechanical Engineering' },
    { value: 'material_science_engineering', label: 'Material Science and Engineering' },
    { value: 'thermal_science_engineering', label: 'Thermal Science and Engineering' },
    { value: 'manufacturing_technology', label: 'Manufacturing Technology' },
    { value: 'automotive_engineering', label: 'Automotive Engineering' },
    { value: 'machine_design', label: 'Machine Design' },
    { value: 'production_engineering', label: 'Production Engineering' },
    { value: 'computer_integrated_manufacturing', label: 'Computer Integrated Manufacturing' },
    { value: 'humanities_social_sciences_management', label: 'Humanities & Social Sciences and Management' },
    { value: 'physics', label: 'Physics' },
    { value: 'engineering_physics', label: 'Engineering Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics_computing', label: 'Mathematics and Computing' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'computational_mathematics', label: 'Computational Mathematics' }
  ];

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const dataService = new DataService('questions');
        const questionData = await dataService.getDocumentById(id);
        if (questionData) {
          setQuestion(questionData);
          setFormData({
            topic: questionData.topic || '',
            text: questionData.text || '',
            branch: questionData.branch || '',
            photo: null
          });
          setPreviewUrl(questionData.photo || null);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        toast.error('Failed to fetch question details');
        navigate('/my-questions');
      }
    };

    fetchQuestion();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = async () => {
    try {
      if (question.photoId) {
        const dataService = new DataService('questions');
        await dataService.deleteImage(question.photoId);
        
        // Update the question document to remove photo references
        await dataService.updateDocument(id, {
          photo: null,
          photoId: null,
          updatedAt: new Date().toISOString()
        });
      }
      setFormData(prev => ({
        ...prev,
        photo: null
      }));
      setPreviewUrl(null);
      toast.success('Photo removed successfully');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo. Please try again.');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      topic: suggestion
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.text.trim() || !formData.branch.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const dataService = new DataService('questions');
      let photoUrl = question.photo;
      let photoId = question.photoId;

      // If there's a new photo, delete the old one and upload the new one
      if (formData.photo) {
        // Delete old photo if it exists
        if (question.photoId) {
          try {
            await dataService.deleteImage(question.photoId);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue with the update even if old image deletion fails
          }
        }
        // Upload new photo
        const photoData = await dataService.uploadImage(formData.photo);
        photoUrl = photoData.url;
        photoId = photoData.fileId;
      }

      // Update question document
      const updatedData = {
        topic: formData.topic.trim(),
        text: formData.text.trim(),
        branch: formData.branch.trim(),
        photo: photoUrl,
        photoId: photoId,
        updatedAt: new Date().toISOString()
      };

      await dataService.updateDocument(id, updatedData);
      toast.success('Question updated successfully!');
      navigate('/my-questions');
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Failed to update question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-gray-700 dark:text-gray-200 dark:hover:text-white hover:text-gray-700"
          onClick={() => navigate('/my-questions')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Questions
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#173f67] dark:text-white mb-6">Edit Question</h2>
          
          {/* Topic Suggestions Section */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#1a237e', mb: 1 }} className="dark:text-blue-400">
              Suggested Topics
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {topicSuggestions.map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  onClick={() => handleSuggestionClick(topic)}
                  color={formData.topic === topic ? 'primary' : 'default'}
                  sx={{
                    '&.MuiChip-root': {
                      backgroundColor: formData.topic === topic ? '#1a237e' : '#f5f5f5',
                      color: formData.topic === topic ? 'white' : '#1a237e',
                      '&:hover': {
                        backgroundColor: formData.topic === topic ? '#1a237e' : '#e0e0e0',
                      },
                    },
                  }}
                  className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                />
              ))}
            </Box>
          </Box>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-[#173f67] dark:text-gray-200 mb-2">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#173f67] focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter the topic of your question"
                required
              />
            </div>

            {/* Question Text */}
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-[#173f67] dark:text-gray-200 mb-2">
                Question
              </label>
              <textarea
                id="text"
                name="text"
                rows="6"
                value={formData.text}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#173f67] focus:border-transparent resize-none dark:bg-gray-700 dark:text-white"
                placeholder="Write your question here..."
                required
              />
            </div>

            {/* Branch Input */}
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-[#173f67] dark:text-gray-200 mb-2">
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#173f67] focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select your branch</option>
                {branches.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-[#173f67] dark:text-gray-200 mb-2">
                Photo (Optional)
              </label>
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <X className="w-4 h-4 text-[#173f67] dark:text-gray-200" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-200 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-[#173f67] dark:text-gray-200 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/my-questions')}
                className="dark:text-black dark:hover:text-white dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Update Question
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion; 