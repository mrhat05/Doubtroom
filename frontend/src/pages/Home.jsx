import React, { useEffect, useState } from 'react'
import CollegeCard from '../components/CollegeCard'
import { HelpCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import DataService from '../firebase/DataService'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataService = new DataService('questions');
        
        // Get all questions
        const questionsData = await dataService.getAllDocuments();
        
        // Sort questions by date (newest first)
        const sortedQuestions = questionsData.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setQuestions(sortedQuestions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch questions. Please try again later.');
        console.error('Error:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const formatText = (text) => {
    if (!text) return 'Question';
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 text-center">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className='mt-24 flex flex-col justify-center items-center'>
        <h2 className='text-3xl font-bold text-gray-800 dark:text-white mb-4'>Most Recent Queries</h2>
        <div className='border border-t-2 border-blue-800 dark:border-blue-400 w-1/4' />
      </div>

      {/* Ask Question Tab */}
      <Link to='/ask-question'>
        <div className="max-w-5xl mx-auto mt-8 ml-5 mr-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                  <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Have a doubt? Ask here</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get help from the community</p>
                </div>
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
                Ask Question
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Questions Grid */}
      <section className="max-w-8xl mx-auto py-10 ">
        {questions.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No questions yet. Be the first to ask!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-5 mr-5">
            {questions.map((question) => (
              <CollegeCard
                key={question.id}
                id={question.id}
                collegeName={formatText(question.collegeName) || 'Question'}
                img={question.photo || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                branch={formatText(question.branch) || 'Question'}
                collegeYear="2023"
                topic={formatText(question.topic) || 'General'}
                noOfAnswers={question.answers || 0}
                postedOn={formatTimeAgo(question.createdAt)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home