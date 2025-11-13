import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="text-center max-w-5xl mx-auto px-4 relative z-10">
        {/* Hero Title with Gradient */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 animate-fadeIn">
            True Distribute
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-2">
            Court Revenue Distribution Testing Software
          </p>
          <p className="text-lg text-gray-600 font-light">
            for <span className="font-semibold text-purple-700">Napa County</span>
          </p>
        </div>

        {/* Subheading */}
        <div className="mb-12">
          <h2 className="text-xl text-gray-600 mb-4">
            Select how you'd like to proceed:
          </h2>
        </div>

        {/* Three Primary Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {/* Upload Citation Button */}
          <button
            onClick={() => navigate('/upload')}
            className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 animate-shimmer"></div>

            <div className="flex flex-col items-center space-y-4 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Upload Citation</h3>
              <p className="text-sm text-gray-700">
                Upload a citation file and let AI extract the details automatically
              </p>
            </div>
          </button>

          {/* Manual Entry Button */}
          <button
            onClick={() => navigate('/manual-entry')}
            className="group relative bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 animate-shimmer"></div>

            <div className="flex flex-col items-center space-y-4 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">Manual Entry</h3>
              <p className="text-sm text-gray-700">
                Enter citation details manually using the comprehensive form
              </p>
            </div>
          </button>

          {/* Example Citations Button */}
          <button
            onClick={() => navigate('/examples')}
            className="group relative bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 animate-shimmer"></div>

            <div className="flex flex-col items-center space-y-4 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Example Citations</h3>
              <p className="text-sm text-gray-700">
                View pre-validated sample cases with calculated distributions
              </p>
            </div>
          </button>
        </div>

        {/* Features Section with Colorful Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">California State Compliant</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl">⚡</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">Instant Calculations</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl">📊</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">Variance Tracking</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            Test your court's revenue distribution calculations against California state statutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
