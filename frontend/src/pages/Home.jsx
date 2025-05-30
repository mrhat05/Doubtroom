import React, { useEffect, useState } from 'react'
import CollegeCard from '../components/CollegeCard'
import { HelpCircle, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import DataService from '../firebase/DataService'
import LoadingSpinner from '../components/LoadingSpinner'
import { toast } from 'sonner'
import FilterButton from '../components/FilterButton'
import MobileFilterButton from '../components/MobileFilterButton'
import placeholder from '../assets/placeholder.png'

const Home = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showMyBranch, setShowMyBranch] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const formatBranchName = (branch) => {
    if (!branch) return '';
    return branch
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchQuestions = async () => {
      try {
        setFilterLoading(true);
        const dataService = new DataService('questions');
        let fetchedQuestions;
        
        if (showMyBranch && userData.branch) {
          fetchedQuestions = await dataService.getQuestionsByBranch(userData.branch);
        } else {
          fetchedQuestions = await dataService.getAllDocuments();
        }
        
        // Sort questions by createdAt timestamp in descending order (newest first)
        const sortedQuestions = fetchedQuestions.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt); // For descending order (newest first)
        });
        
        setQuestions(sortedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to fetch questions');
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    };

    fetchQuestions();
  }, [showMyBranch, userData.branch]);

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

  const QuestionSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"></div>
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"></div>
      </div>

      <div className="p-5">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Ask Question Tab - Desktop */}
      <div className="hidden md:block max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-24">
        <Link to='/ask-question'>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                  <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Have a doubt?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get help from the community</p>
                </div>
              </div>
              <div className='bg-gradient-to-r from-[#1f5986] to-[#114073] dark:bg-blue-400 rounded-lg p-3'>
                <div className="text-white font-medium flex items-center gap-2">
                  Ask Question
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Questions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h1 className="text-2xl sm:text-4xl font-bold text-blue-900 dark:text-blue-300">Recent Questions</h1>
            {/* Mobile Filter Button */}
            {userData.branch && (
              <div className="sm:hidden">
                <MobileFilterButton
                  isActive={showMyBranch}
                  onClick={() => setShowMyBranch(!showMyBranch)}
                  activeText="Show My Branch Only"
                  inactiveText="Show All Questions"
                />
              </div>
            )}
          </div>
          {/* Desktop Filter Button */}
          {userData.branch && (
            <div className="hidden sm:block">
              <FilterButton
                isActive={showMyBranch}
                onClick={() => setShowMyBranch(!showMyBranch)}
                activeText="Show My Branch Only"
                inactiveText="Show All Questions"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            questions.map((question) => (
              <CollegeCard
                key={question.id}
                id={question.id}
                collegeName={question.collegeName}
                img={question.photo || placeholder}
                branch={question.branch}
                topic={question.topic}
                noOfAnswers={question.noOfAnswers || 0}
                postedOn={question.createdAt}
              />
            ))
          )}
        </div>
        {questions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {showMyBranch 
                ? `No questions found for ${formatBranchName(userData.branch)} branch`
                : 'No questions found'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home