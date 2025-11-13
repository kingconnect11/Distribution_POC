import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        {/* County Name - Dynamic */}
        <div className="mb-12">
          <p className="text-2xl text-gray-600 font-light">
            for <span className="font-semibold text-gray-900">Napa County</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="mb-16">
            <h2 className="text-xl text-gray-600 mb-4">
              Select how you'd like to proceed:
            </h2>
          </div>

          {/* Three Primary Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Upload Citation Button */}
            <button
              onClick={() => navigate('/upload')}
              className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-500 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Upload Citation</h3>
                <p className="text-sm text-gray-600">
                  Upload a citation file and let AI extract the details automatically
                </p>
              </div>
            </button>

            {/* Manual Entry Button */}
            <button
              onClick={() => navigate('/manual-entry')}
              className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-green-500 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Manual Entry</h3>
                <p className="text-sm text-gray-600">
                  Enter citation details manually using the comprehensive form
                </p>
              </div>
            </button>

            {/* Example Citations Button */}
            <button
              onClick={() => navigate('/examples')}
              className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-500 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
                  <svg className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Example Citations</h3>
                <p className="text-sm text-gray-600">
                  View pre-validated sample cases with calculated distributions
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Test your court's revenue distribution calculations against California state statutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
