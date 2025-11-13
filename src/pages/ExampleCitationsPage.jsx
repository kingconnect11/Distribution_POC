import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '../context/CalculationContext';
import { calculateDistribution } from '../calculationEngine.js';
import { getCitationConfig } from '../citationConfigs.js';
import { getExampleCitations } from '../exampleCitations.js';

const ExampleCitationsPage = () => {
  const navigate = useNavigate();
  const { updateResults } = useCalculation();
  const [expandedId, setExpandedId] = useState(null);
  const [preCalculatedResults, setPreCalculatedResults] = useState({});
  const examples = getExampleCitations();

  // Pre-calculate all results on mount
  useEffect(() => {
    const results = {};
    examples.forEach(example => {
      const inputs = {
        baseFine: parseFloat(example.data.baseFine),
        countyPercent: parseFloat(example.data.countyPercent),
        cityPercent: 100 - parseFloat(example.data.countyPercent),
        hasLabPenalty: example.data.hasLabPenalty || false,
        labPenaltyAmount: parseFloat(example.data.labPenaltyAmount) || 0,
        probationSupervision: parseFloat(example.data.probationSupervision) || 0
      };

      const config = getCitationConfig(example.data.citationType);
      const calculationResult = calculateDistribution(inputs, config);

      // Add actual amounts for variance tracking
      results[example.id] = {
        ...calculationResult,
        actualAmounts: example.actualAmounts || null,
        metadata: {
          citationType: example.data.citationType,
          caseNumber: example.data.caseNumber,
          baseFine: example.data.baseFine,
          arrestingAgency: example.data.arrestingAgency,
          violationType: example.data.violationType,
          violationDate: example.data.violationDate
        }
      };
    });
    setPreCalculatedResults(results);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const viewFullResults = (example) => {
    // Store results in context
    updateResults(preCalculatedResults[example.id]);
    // Navigate to results page with state to avoid timing issues
    navigate('/results', {
      state: { calculationResults: preCalculatedResults[example.id] }
    });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const calculateVariance = (result) => {
    if (!result.actualAmounts) return null;

    const calculatedTotal = result.calculated.grandTotal;
    const actualTotal = Object.values(result.actualAmounts).reduce((sum, val) => sum + parseFloat(val || 0), 0);
    const variance = actualTotal - calculatedTotal;

    return {
      calculatedTotal,
      actualTotal,
      variance,
      hasError: Math.abs(variance) > 0.01
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Example Citations</h1>
        <p className="text-gray-600">Pre-validated sample cases with calculated distributions and variance tracking</p>
      </div>

      {/* Report Buttons */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => navigate('/risk-exposure')}
          className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <span className="text-2xl mr-2">📊</span>
          View Risk Exposure Report
        </button>
        <button
          onClick={() => navigate('/budget-impact')}
          className="flex-1 px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <span className="text-2xl mr-2">📈</span>
          View Budget Impact Report
        </button>
      </div>

      {/* Example Citations List */}
      <div className="space-y-4">
        {examples.map((example) => {
          const result = preCalculatedResults[example.id];
          const variance = result ? calculateVariance(result) : null;
          const isExpanded = expandedId === example.id;

          return (
            <div
              key={example.id}
              className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden"
            >
              {/* Card Header - Always Visible */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(example.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{example.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {example.data.citationType}
                      </span>
                      {variance && variance.hasError && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                          Variance Detected
                        </span>
                      )}
                      {variance && !variance.hasError && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          No Errors
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{example.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Case: {example.data.caseNumber}</span>
                      <span>Base Fine: {formatCurrency(example.data.baseFine)}</span>
                      {result && <span>Total: {formatCurrency(result.calculated.grandTotal)}</span>}
                    </div>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <div className="flex-shrink-0 ml-4">
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && result && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Distribution Breakdown */}
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Distribution Breakdown</h4>

                  {/* Summary by Entity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">County Total</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {formatCurrency(result.summary.county.total)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="text-sm text-gray-600 mb-1">State Total</div>
                      <div className="text-2xl font-bold text-green-700">
                        {formatCurrency(result.summary.state.total)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-gray-600 mb-1">City Total</div>
                      <div className="text-2xl font-bold text-purple-700">
                        {formatCurrency(result.summary.city.total)}
                      </div>
                    </div>
                  </div>

                  {/* Variance Information */}
                  {variance && variance.hasError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <h5 className="text-sm font-bold text-red-900 mb-2">Variance Detected</h5>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Calculated Total:</span>
                          <div className="font-bold text-gray-900">{formatCurrency(variance.calculatedTotal)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Actual Total:</span>
                          <div className="font-bold text-gray-900">{formatCurrency(variance.actualTotal)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Variance:</span>
                          <div className={`font-bold ${variance.variance < 0 ? 'text-red-700' : 'text-green-700'}`}>
                            {variance.variance < 0 ? '-' : '+'}{formatCurrency(Math.abs(variance.variance))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewFullResults(example);
                    }}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                  >
                    View Full Distribution Report
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">About These Examples</h4>
            <p className="text-sm text-blue-800">
              These example citations have been validated against California state statutes and include variance
              tracking to demonstrate common distribution errors. Click any citation to expand and view detailed
              breakdowns, or click "View Full Distribution Report" to see the complete analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleCitationsPage;
