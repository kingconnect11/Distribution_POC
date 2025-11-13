import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '../context/CalculationContext';
import { getExampleCitations } from '../exampleCitations';

const RiskExposureReportPage = () => {
  const navigate = useNavigate();
  const { calculationResults } = useCalculation();
  const [numberOfCases, setNumberOfCases] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = () => {
    const cases = parseInt(numberOfCases) || 0;
    if (cases <= 0) {
      alert('Please enter a valid number of cases');
      return;
    }

    // Get example citations for analysis
    const citations = getExampleCitations();

    // Calculate average variance from example citations
    const citationsWithVariance = citations.map(citation => {
      const expected = citation.expectedTotal;
      const actual = citation.actualAmounts
        ? Object.values(citation.actualAmounts).reduce((sum, val) => sum + val, 0)
        : expected;
      const variance = expected - actual;

      return {
        ...citation,
        expected,
        actual,
        variance
      };
    });

    const totalVariance = citationsWithVariance.reduce((sum, c) => sum + c.variance, 0);
    const averageVariance = totalVariance / citations.length;

    // Calculate total amount owed based on user input
    const totalAmountOwed = Math.abs(averageVariance * cases);

    // Breakdown by recipient (using proportions from example data)
    const stateOwed = totalAmountOwed * 0.35; // Approximate 35% to state
    const countyOwed = totalAmountOwed * 0.55; // Approximate 55% to county
    const cityOwed = totalAmountOwed * 0.10; // Approximate 10% to city

    // Calculate error rate
    const citationsWithErrors = citationsWithVariance.filter(c => Math.abs(c.variance) > 0.01).length;
    const errorRate = (citationsWithErrors / citations.length) * 100;

    setReportData({
      numberOfCases: cases,
      averageVariance,
      totalAmountOwed,
      breakdown: {
        state: stateOwed,
        county: countyOwed,
        city: cityOwed
      },
      errorRate,
      casesAnalyzed: citations.length,
      citationsWithErrors
    });

    setReportGenerated(true);
  };

  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg mb-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Risk Exposure Report</h1>
        <p className="text-red-100">Historical Revenue Loss Analysis</p>
        <p className="text-red-200 text-sm mt-2">
          Generated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Input Section */}
      {!reportGenerated && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculate Historical Revenue Loss</h2>
          <p className="text-gray-600 mb-6">
            Enter the number of citations processed to calculate how much revenue has been lost due to
            distribution errors.
          </p>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Citations Processed
            </label>
            <input
              type="number"
              value={numberOfCases}
              onChange={(e) => setNumberOfCases(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
              placeholder="e.g., 10000"
              min="1"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter the approximate number of citations your court has processed
            </p>
          </div>

          <button
            onClick={generateReport}
            className="mt-6 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg text-lg"
          >
            Generate Risk Exposure Report
          </button>
        </div>
      )}

      {/* Report Results */}
      {reportGenerated && reportData && (
        <>
          {/* Key Insight Box */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <span className="text-4xl mr-4">🚨</span>
              <div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">Total Amount Owed</h3>
                <p className="text-4xl font-bold text-red-600 mb-3">{formatCurrency(reportData.totalAmountOwed)}</p>
                <p className="text-red-800 text-lg">
                  Based on {formatNumber(reportData.numberOfCases)} cases analyzed, your county owes approximately{' '}
                  <strong>{formatCurrency(reportData.totalAmountOwed)}</strong> in under-distributed revenue.
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown by Recipient */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Breakdown by Recipient</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Amount Owed to State</div>
                <div className="text-3xl font-bold text-purple-700">
                  {formatCurrency(reportData.breakdown.state)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  ~{((reportData.breakdown.state / reportData.totalAmountOwed) * 100).toFixed(0)}% of total
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Amount Owed to County Programs</div>
                <div className="text-3xl font-bold text-blue-700">
                  {formatCurrency(reportData.breakdown.county)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  ~{((reportData.breakdown.county / reportData.totalAmountOwed) * 100).toFixed(0)}% of total
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Amount Owed to City</div>
                <div className="text-3xl font-bold text-green-700">
                  {formatCurrency(reportData.breakdown.city)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  ~{((reportData.breakdown.city / reportData.totalAmountOwed) * 100).toFixed(0)}% of total
                </div>
              </div>
            </div>
          </div>

          {/* Error Rate Metrics */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Rate Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Percentage of Citations with Errors</div>
                <div className="text-3xl font-bold text-red-600">
                  {reportData.errorRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {reportData.citationsWithErrors} out of {reportData.casesAnalyzed} samples analyzed
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Average Loss Per Citation</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(reportData.averageVariance)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Based on sample data analysis
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Total Cases Analyzed</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatNumber(reportData.numberOfCases)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Citations processed by your court
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setReportGenerated(false);
                setNumberOfCases('');
              }}
              className="flex-1 px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              Generate New Report
            </button>
            <button
              onClick={() => navigate('/budget-impact')}
              className="flex-1 px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all"
            >
              View Budget Impact Report
            </button>
          </div>
        </>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">About This Report</h4>
            <p className="text-sm text-blue-800">
              This Risk Exposure Report shows how much revenue has already been lost due to distribution errors.
              The calculations are based on sample citation analysis showing average variance per citation.
              These projections help demonstrate the historical impact of distribution discrepancies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskExposureReportPage;
