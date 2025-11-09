import { useState } from 'react';
import { calculateDistribution } from './calculationEngine.js';
import { getCitationConfig, getAvailableCitationTypes } from './citationConfigs.js';

function App() {
  // Form state
  const [citationType, setCitationType] = useState('DUI');
  const [caseNumber, setCaseNumber] = useState('');
  const [baseFine, setBaseFine] = useState(500);
  const [arrestingAgency, setArrestingAgency] = useState('PD');
  const [subAgency, setSubAgency] = useState('');
  const [agencyLocal, setAgencyLocal] = useState('City');
  const [countyPercent, setCountyPercent] = useState(100);
  const [gc76000, setGc76000] = useState(0);
  const [violationDate, setViolationDate] = useState('');
  const [dispDate, setDispDate] = useState('');
  const [violationType, setViolationType] = useState('Misdemeanor');
  const [hasLabPenalty, setHasLabPenalty] = useState(false);
  const [labPenaltyAmount, setLabPenaltyAmount] = useState(0);
  const [result, setResult] = useState(null);

  const cityPercent = 100 - countyPercent;
  const availableCitationTypes = getAvailableCitationTypes();

  const handleCalculate = () => {
    const inputs = {
      baseFine: parseFloat(baseFine),
      countyPercent: parseFloat(countyPercent),
      cityPercent,
      hasLabPenalty,
      labPenaltyAmount: parseFloat(labPenaltyAmount) || 0
    };

    const config = getCitationConfig(citationType);
    const calculationResult = calculateDistribution(inputs, config);
    setResult(calculationResult);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getEntityColorClass = (entity) => {
    const entityUpper = entity.toUpperCase();
    if (entityUpper === 'COUNTY') return 'bg-blue-100 text-blue-800';
    if (entityUpper === 'CITY') return 'bg-green-100 text-green-800';
    if (entityUpper === 'STATE') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            California Citation Fine Distribution Calculator
          </h1>
          <p className="text-gray-600">
            Multi-citation type fine distribution calculator for Napa County
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Case Information
          </h2>

          {/* Citation Type Selector */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Citation Type
            </label>
            <select
              value={citationType}
              onChange={(e) => setCitationType(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableCitationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Case Identification Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Number
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="CR 123456"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Base (Calculated)
              </label>
              <input
                type="text"
                value={result ? formatCurrency(result.calculated.enhancedBase) : '$0.00'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Agency Information Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arresting Agency
              </label>
              <select
                value={arrestingAgency}
                onChange={(e) => setArrestingAgency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PD">PD</option>
                <option value="Sheriff">Sheriff</option>
                <option value="CHP">CHP</option>
                <option value="Fish & Game">Fish & Game</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Agency
              </label>
              <input
                type="text"
                value={subAgency}
                onChange={(e) => setSubAgency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agency Local
              </label>
              <select
                value={agencyLocal}
                onChange={(e) => setAgencyLocal(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="City">City</option>
                <option value="County">County</option>
              </select>
            </div>
          </div>

          {/* Distribution Percentages Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                County % (City auto-calculated)
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City %
              </label>
              <input
                type="text"
                value={`${cityPercent}%`}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GC76000 (Local Penalty)
              </label>
              <input
                type="number"
                value={gc76000}
                onChange={(e) => setGc76000(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Dates and Violation Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Violation Date
              </label>
              <input
                type="date"
                value={violationDate}
                onChange={(e) => setViolationDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disposition Date
              </label>
              <input
                type="date"
                value={dispDate}
                onChange={(e) => setDispDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Violation Type
              </label>
              <select
                value={violationType}
                onChange={(e) => setViolationType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Infraction">Infraction</option>
                <option value="Misdemeanor">Misdemeanor</option>
                <option value="Felony">Felony</option>
              </select>
            </div>
          </div>

          {/* Citation-Specific Fields (Conditional) */}
          {citationType === 'DUI' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                DUI-Specific Fields
              </h3>
              <div className="mb-4">
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
                    className="mt-2 w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Lab Penalty Amount"
                    min="0"
                    step="1"
                  />
                )}
              </div>
            </div>
          )}

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Distribution Results
              </h2>
            </div>

            {/* Calculated Values Summary */}
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
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Distribution
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.lineItems.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">{item.code}</div>
                        <div className="text-gray-600 text-xs">{item.desc}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEntityColorClass(item.entity)}`}>
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

            {/* Summary Totals */}
            <div className="mt-6 border-t border-gray-300 pt-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Totals</h3>
                <div className="space-y-3">
                  {result.totals.county > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">County Total:</span>
                      <span className="text-xl font-mono font-semibold text-blue-700">
                        {formatCurrency(result.totals.county)}
                      </span>
                    </div>
                  )}
                  {result.totals.city > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">City Total:</span>
                      <span className="text-xl font-mono font-semibold text-green-700">
                        {formatCurrency(result.totals.city)}
                      </span>
                    </div>
                  )}
                  {result.totals.state > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">State Total:</span>
                      <span className="text-xl font-mono font-semibold text-purple-700">
                        {formatCurrency(result.totals.state)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-xl font-bold text-gray-900">GRAND TOTAL:</span>
                    <span className="text-2xl font-mono font-bold text-gray-900">
                      {formatCurrency(result.totals.grandTotal)}
                    </span>
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
