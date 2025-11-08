import { useState } from 'react';
import { calculateDUIDistribution } from './calculator.js';
import { NAPA_MULTIPLIERS } from './testData.js';

function App() {
  const [baseFine, setBaseFine] = useState(500);
  const [countyPercent, setCountyPercent] = useState(100);
  const [hasLabPenalty, setHasLabPenalty] = useState(false);
  const [labPenaltyAmount, setLabPenaltyAmount] = useState(0);
  const [result, setResult] = useState(null);

  const cityPercent = 100 - countyPercent;

  const handleCalculate = () => {
    const inputs = {
      baseFine: parseFloat(baseFine),
      countyPercent: parseFloat(countyPercent),
      cityPercent,
      hasLabPenalty,
      labPenaltyAmount: parseFloat(labPenaltyAmount)
    };

    const calculationResult = calculateDUIDistribution(inputs, NAPA_MULTIPLIERS);
    setResult(calculationResult);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            DUI Fine Distribution Calculator
          </h1>
          <p className="text-gray-600">
            California DUI citation fine distribution calculator (Napa County)
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Input Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Base Fine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Fine ($)
              </label>
              <input
                type="number"
                value={baseFine}
                onChange={(e) => setBaseFine(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1"
              />
            </div>

            {/* County Percent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                County % (City will be auto-calculated)
              </label>
              <input
                type="number"
                value={countyPercent}
                onChange={(e) => {
                  const value = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                  setCountyPercent(value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
                step="1"
              />
              <p className="mt-1 text-sm text-gray-500">
                City %: {cityPercent}%
              </p>
            </div>

            {/* Lab Penalty */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hasLabPenalty}
                  onChange={(e) => setHasLabPenalty(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Include Lab Penalty
                </span>
              </label>

              {hasLabPenalty && (
                <input
                  type="number"
                  value={labPenaltyAmount}
                  onChange={(e) => setLabPenaltyAmount(e.target.value)}
                  className="mt-2 w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Lab Penalty Amount"
                  min="0"
                  step="1"
                />
              )}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-6">
            <button
              onClick={handleCalculate}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              Calculate Distribution
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Distribution Results
              </h2>
              <button
                onClick={() => alert('PDF export functionality would be implemented here')}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                📄 Export PDF Report
              </button>
            </div>

            {/* Calculated Values */}
            <div className="bg-gray-50 rounded p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Enhanced Base:</span>
                  <span className="ml-2 text-gray-900">{formatCurrency(result.calculated.enhancedBase)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Portion of 10:</span>
                  <span className="ml-2 text-gray-900">{result.calculated.portionOf10}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Reduced Base:</span>
                  <span className="ml-2 text-gray-900">{formatCurrency(result.calculated.reducedBase)}</span>
                </div>
              </div>
            </div>

            {/* Distribution Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.lineItems.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.desc}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.entity === 'COUNTY' ? 'bg-blue-100 text-blue-800' :
                          item.entity === 'CITY' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.entity}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary Totals</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">County Total:</span>
                    <span className="text-lg font-mono font-semibold text-blue-700">
                      {formatCurrency(result.totals.county)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">City Total:</span>
                    <span className="text-lg font-mono font-semibold text-green-700">
                      {formatCurrency(result.totals.city)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">State Total:</span>
                    <span className="text-lg font-mono font-semibold text-purple-700">
                      {formatCurrency(result.totals.state)}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 mt-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">GRAND TOTAL:</span>
                      <span className="text-2xl font-mono font-bold text-gray-900">
                        {formatCurrency(result.totals.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
