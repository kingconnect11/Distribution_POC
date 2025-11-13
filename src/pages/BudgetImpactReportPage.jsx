import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '../context/CalculationContext';
import { getExampleCitations } from '../exampleCitations';

const BudgetImpactReportPage = () => {
  const navigate = useNavigate();
  const { calculationResults } = useCalculation();
  const [casesPerYear, setCasesPerYear] = useState('');
  const [projectionYears, setProjectionYears] = useState(10);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = () => {
    const annualCases = parseInt(casesPerYear) || 0;
    const years = parseInt(projectionYears) || 10;

    if (annualCases <= 0) {
      alert('Please enter a valid number of cases per year');
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

    // Calculate error rate
    const citationsWithErrors = citationsWithVariance.filter(c => Math.abs(c.variance) > 0.01).length;
    const errorRate = (citationsWithErrors / citations.length) * 100;

    // Calculate annual loss
    const annualLoss = Math.abs(averageVariance * annualCases);

    // Calculate projections for different time periods
    const projections = [];
    const milestones = [1, 5, 10, 15, 20].filter(y => y <= years);

    milestones.forEach(year => {
      const cumulativeLoss = annualLoss * year;
      projections.push({
        year,
        annualLoss,
        cumulativeLoss,
        breakdown: {
          state: cumulativeLoss * 0.35,
          county: cumulativeLoss * 0.55,
          city: cumulativeLoss * 0.10
        }
      });
    });

    // Calculate final projection
    const totalProjectedLoss = annualLoss * years;
    const stateTotal = totalProjectedLoss * 0.35;
    const countyTotal = totalProjectedLoss * 0.55;
    const cityTotal = totalProjectedLoss * 0.10;

    setReportData({
      casesPerYear: annualCases,
      projectionYears: years,
      averageVariance,
      errorRate,
      annualLoss,
      totalProjectedLoss,
      breakdown: {
        state: stateTotal,
        county: countyTotal,
        city: cityTotal
      },
      projections
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
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-8 rounded-lg mb-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Budget Impact Report</h1>
        <p className="text-orange-100">Future Revenue Loss Projection</p>
        <p className="text-orange-200 text-sm mt-2">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculate Future Budget Impact</h2>
          <p className="text-gray-600 mb-6">
            Enter your citation volume and projection timeframe to calculate how much revenue will continue
            to be lost if distribution errors are not corrected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cases Per Year
              </label>
              <input
                type="number"
                value={casesPerYear}
                onChange={(e) => setCasesPerYear(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                placeholder="e.g., 10000"
                min="1"
              />
              <p className="text-sm text-gray-500 mt-2">
                Annual citation volume for your court
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projection Period (Years)
              </label>
              <select
                value={projectionYears}
                onChange={(e) => setProjectionYears(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              >
                <option value="5">5 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                How far to project future impact
              </p>
            </div>
          </div>

          <button
            onClick={generateReport}
            className="mt-6 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all shadow-lg text-lg"
          >
            Generate Budget Impact Report
          </button>
        </div>
      )}

      {/* Report Results */}
      {reportGenerated && reportData && (
        <>
          {/* Key Warning Box */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <span className="text-4xl mr-4">⚠️</span>
              <div>
                <h3 className="text-2xl font-bold text-orange-900 mb-2">
                  {reportData.projectionYears}-Year Projected Loss
                </h3>
                <p className="text-5xl font-bold text-orange-600 mb-3">
                  {formatCurrency(reportData.totalProjectedLoss)}
                </p>
                <p className="text-orange-800 text-lg">
                  If distribution errors continue uncorrected, your county will owe an additional{' '}
                  <strong>{formatCurrency(reportData.totalProjectedLoss)}</strong> over the next{' '}
                  {reportData.projectionYears} years.
                </p>
                <p className="text-orange-700 mt-3 text-sm font-semibold">
                  This projection assumes you continue to process {formatNumber(reportData.casesPerYear)} cases
                  per year with the current error rate of {reportData.errorRate.toFixed(1)}%.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline View */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Projected Loss Timeline</h2>
            <div className="space-y-4">
              {reportData.projections.map((projection, index) => (
                <div
                  key={projection.year}
                  className="flex items-center border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg"
                >
                  <div className="flex-shrink-0 w-24">
                    <span className="text-2xl font-bold text-orange-700">Year {projection.year}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Annual Loss</div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(projection.annualLoss)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Cumulative Total</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(projection.cumulativeLoss)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown by Recipient */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Projected Amount Owed by Recipient ({reportData.projectionYears}-Year Total)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Projected Amount Owed to State</div>
                <div className="text-3xl font-bold text-purple-700">
                  {formatCurrency(reportData.breakdown.state)}
                </div>
                <div className="text-sm text-gray-600 mt-2">Over {reportData.projectionYears} years</div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Projected Amount Owed to County</div>
                <div className="text-3xl font-bold text-blue-700">
                  {formatCurrency(reportData.breakdown.county)}
                </div>
                <div className="text-sm text-gray-600 mt-2">Over {reportData.projectionYears} years</div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                <div className="text-sm text-gray-600 font-semibold mb-2">Projected Amount Owed to City</div>
                <div className="text-3xl font-bold text-green-700">
                  {formatCurrency(reportData.breakdown.city)}
                </div>
                <div className="text-sm text-gray-600 mt-2">Over {reportData.projectionYears} years</div>
              </div>
            </div>
          </div>

          {/* Assumptions Statement */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Projection Assumptions</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Annual case volume: <strong>{formatNumber(reportData.casesPerYear)} citations per year</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Average loss per citation: <strong>{formatCurrency(reportData.averageVariance)}</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Error rate: <strong>{reportData.errorRate.toFixed(1)}%</strong> of citations contain distribution errors
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Projection assumes current error patterns continue unchanged over {reportData.projectionYears} years
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setReportGenerated(false);
                setCasesPerYear('');
              }}
              className="flex-1 px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              Generate New Report
            </button>
            <button
              onClick={() => navigate('/risk-exposure')}
              className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
            >
              View Risk Exposure Report
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
              This Budget Impact Report projects how much revenue will continue to be lost if distribution
              errors are not corrected. The calculations are based on your annual citation volume and
              average variance per citation from sample data analysis. These projections help demonstrate
              the urgency of implementing automated distribution verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetImpactReportPage;
