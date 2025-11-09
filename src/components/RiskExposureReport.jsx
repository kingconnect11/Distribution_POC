import { useEffect, useState } from 'react';
import { getExampleCitations } from '../exampleCitations';
import HomeButton from './HomeButton.jsx';

const RiskExposureReport = ({ onHome }) => {
  const [reportData, setReportData] = useState(null);
  const [timeframe, setTimeframe] = useState('year');

  useEffect(() => {
    generateReport();
  }, [timeframe]);

  const generateReport = () => {
    // Get example citations for analysis
    const citations = getExampleCitations();

    // Calculate aggregated data
    const totalCitations = citations.length;

    // Calculate variances for each citation
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

    const totalExpected = citationsWithVariance.reduce((sum, c) => sum + c.expected, 0);
    const totalActual = citationsWithVariance.reduce((sum, c) => sum + c.actual, 0);
    const totalVariance = totalExpected - totalActual;
    const averageVariance = totalVariance / totalCitations || 0;

    // Group by citation type
    const byType = {};
    citationsWithVariance.forEach(c => {
      const type = c.data.citationType;
      if (!byType[type]) {
        byType[type] = {
          count: 0,
          expected: 0,
          actual: 0,
          variance: 0
        };
      }
      byType[type].count++;
      byType[type].expected += c.expected;
      byType[type].actual += c.actual;
      byType[type].variance += c.variance;
    });

    // Calculate projections
    const projectedAnnualCitations = 10000; // Example projection
    const projectedAnnualRecovery = Math.abs(averageVariance * projectedAnnualCitations);

    setReportData({
      summary: {
        totalCitations,
        totalExpected,
        totalActual,
        totalVariance,
        averageVariance,
        projectedAnnualCitations,
        projectedAnnualRecovery
      },
      byType,
      citationsWithVariance,
      topVariances: [...citationsWithVariance].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    });
  };

  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (!reportData) return <div className="p-8 text-center">Loading report...</div>;

  return (
    <div className="max-w-7xl mx-auto px-8 lg:px-12 py-6">
      {/* Home Button */}
      {onHome && <HomeButton onClick={onHome} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg mb-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">⚠️ Risk Exposure Report</h1>
        <p className="text-red-100">Revenue Recovery Analysis • California Citation Distribution Audit</p>
        <p className="text-red-200 text-sm mt-2">
          Generated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
          <div className="text-sm text-gray-600 font-semibold mb-2">Citations Audited</div>
          <div className="text-3xl font-bold text-gray-900">
            {reportData.summary.totalCitations}
          </div>
          <div className="text-xs text-gray-500 mt-2">Sample citations analyzed</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-orange-500">
          <div className="text-sm text-gray-600 font-semibold mb-2">Avg Variance Per Citation</div>
          <div className="text-3xl font-bold text-red-600">
            -{formatCurrency(reportData.summary.averageVariance)}
          </div>
          <div className="text-xs text-gray-500 mt-2">Lost revenue per citation</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-500">
          <div className="text-sm text-gray-600 font-semibold mb-2">Total Variance Detected</div>
          <div className="text-3xl font-bold text-red-600">
            -{formatCurrency(reportData.summary.totalVariance)}
          </div>
          <div className="text-xs text-gray-500 mt-2">From {reportData.summary.totalCitations} citations</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-lg border-2 border-yellow-400">
          <div className="text-sm text-gray-700 font-bold mb-2">💰 Projected Annual Recovery</div>
          <div className="text-3xl font-bold text-yellow-700">
            {formatCurrency(reportData.summary.projectedAnnualRecovery)}
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Based on {reportData.summary.projectedAnnualCitations.toLocaleString()} annual citations
          </div>
        </div>
      </div>

      {/* Alert Box */}
      {reportData.summary.totalVariance > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <span className="text-3xl mr-4">🚨</span>
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Critical Revenue Loss Detected</h3>
              <p className="text-red-800">
                Analysis of {reportData.summary.totalCitations} sample citations reveals systematic
                distribution errors averaging <strong>{formatCurrency(reportData.summary.averageVariance)}</strong> per
                citation. At current error rates, this projects to approximately{' '}
                <strong className="text-2xl">{formatCurrency(reportData.summary.projectedAnnualRecovery)}</strong> in
                lost annual revenue based on 10,000 citations per year.
              </p>
              <p className="text-red-700 mt-3 text-sm font-semibold">
                Immediate implementation of automated variance detection could recover this lost revenue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Variance by Citation Type */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span>📊</span>
          <span>Variance by Citation Type</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Citation Type</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700">Count</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700">Expected</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700">Actual</th>
                <th className="text-right py-3 px-4 font-bold text-red-600">Variance</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700">Avg/Citation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reportData.byType).map(([type, data]) => (
                <tr key={type} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-900">{type}</td>
                  <td className="text-right py-4 px-4">{data.count}</td>
                  <td className="text-right py-4 px-4 font-mono">{formatCurrency(data.expected)}</td>
                  <td className="text-right py-4 px-4 font-mono">{formatCurrency(data.actual)}</td>
                  <td className="text-right py-4 px-4 text-red-600 font-bold font-mono">
                    -{formatCurrency(data.variance)}
                  </td>
                  <td className="text-right py-4 px-4 font-mono">
                    -{formatCurrency(data.variance / data.count)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="py-4 px-4">TOTAL</td>
                <td className="text-right py-4 px-4">{reportData.summary.totalCitations}</td>
                <td className="text-right py-4 px-4 font-mono">{formatCurrency(reportData.summary.totalExpected)}</td>
                <td className="text-right py-4 px-4 font-mono">{formatCurrency(reportData.summary.totalActual)}</td>
                <td className="text-right py-4 px-4 text-red-600 font-mono text-lg">
                  -{formatCurrency(reportData.summary.totalVariance)}
                </td>
                <td className="text-right py-4 px-4 font-mono">
                  -{formatCurrency(reportData.summary.averageVariance)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Variances */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span>🔍</span>
          <span>Citations with Largest Variances</span>
        </h2>
        <div className="space-y-4">
          {reportData.topVariances.map((citation, index) => (
            <div
              key={citation.id}
              className={`p-4 rounded-lg border-2 ${
                Math.abs(citation.variance) > 200
                  ? 'bg-red-50 border-red-300'
                  : Math.abs(citation.variance) > 100
                  ? 'bg-orange-50 border-orange-300'
                  : 'bg-yellow-50 border-yellow-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-gray-900 text-lg">{citation.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{citation.description}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Case: {citation.data.caseNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Variance</div>
                  <div className="text-2xl font-bold text-red-600">
                    -{formatCurrency(citation.variance)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((citation.variance / citation.expected) * 100).toFixed(1)}% error rate
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projection Scenarios */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-lg mb-8 border-2 border-blue-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center flex items-center justify-center gap-2">
          <span>📈</span>
          <span>Annual Revenue Recovery Scenarios</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border-2 border-blue-300">
            <div className="text-xs font-semibold text-blue-700 uppercase mb-2">Conservative</div>
            <div className="text-sm text-gray-600 mb-3">5,000 citations/year</div>
            <div className="text-3xl font-bold text-blue-900">
              {formatCurrency(Math.abs(reportData.summary.averageVariance) * 5000)}
            </div>
            <div className="text-xs text-gray-600 mt-2">potential annual recovery</div>
          </div>

          <div className="bg-white p-6 rounded-lg border-4 border-indigo-500 shadow-lg">
            <div className="text-xs font-semibold text-indigo-700 uppercase mb-2">Moderate (Baseline)</div>
            <div className="text-sm text-gray-600 mb-3">10,000 citations/year</div>
            <div className="text-3xl font-bold text-indigo-900">
              {formatCurrency(Math.abs(reportData.summary.averageVariance) * 10000)}
            </div>
            <div className="text-xs text-gray-600 mt-2">potential annual recovery</div>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-purple-300">
            <div className="text-xs font-semibold text-purple-700 uppercase mb-2">High Volume</div>
            <div className="text-sm text-gray-600 mb-3">15,000 citations/year</div>
            <div className="text-3xl font-bold text-purple-900">
              {formatCurrency(Math.abs(reportData.summary.averageVariance) * 15000)}
            </div>
            <div className="text-xs text-gray-600 mt-2">potential annual recovery</div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-semibold flex items-center gap-2">
          <span>📊</span>
          <span>Export to Excel</span>
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold flex items-center gap-2">
          <span>📄</span>
          <span>Generate PDF Report</span>
        </button>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg font-semibold flex items-center gap-2">
          <span>📧</span>
          <span>Email Report</span>
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg font-semibold flex items-center gap-2"
        >
          <span>🖨️</span>
          <span>Print Report</span>
        </button>
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This report is based on {reportData.summary.totalCitations} sample citations.
          Full implementation will analyze your complete citation database for comprehensive audit reporting.
        </p>
      </div>
    </div>
  );
};

export default RiskExposureReport;
