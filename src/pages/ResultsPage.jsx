import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCalculation } from '../context/CalculationContext';
import ResultsReport from '../ResultsReport.jsx';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { calculationResults: contextResults } = useCalculation();

  // Use location state if available, otherwise fall back to context
  const calculationResults = location.state?.calculationResults || contextResults;

  // If no calculation results, redirect to landing page
  if (!calculationResults) {
    navigate('/');
    return null;
  }

  const formData = calculationResults.metadata || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Results Report Component */}
      <ResultsReport
        result={calculationResults}
        formData={formData}
        onBackToForm={() => navigate(-1)}
      />

      {/* Report Action Buttons - Fixed at Bottom (Hidden in Print) */}
      <div className="no-print fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl py-6 z-50">
        <div className="max-w-6xl mx-auto px-8 lg:px-12">
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/risk-exposure')}
              className="flex-1 px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <span className="text-3xl">📊</span>
              <div className="text-left">
                <div className="text-xl">Risk Exposure Report</div>
                <div className="text-sm font-normal opacity-90">How much revenue was already lost</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/budget-impact')}
              className="flex-1 px-8 py-5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <span className="text-3xl">📈</span>
              <div className="text-left">
                <div className="text-xl">Budget Impact Report</div>
                <div className="text-sm font-normal opacity-90">Future revenue loss projections</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom buttons */}
      <div className="h-32 no-print"></div>
    </div>
  );
};

export default ResultsPage;
