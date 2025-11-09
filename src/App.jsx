import { useState } from 'react';
import { calculateDistribution } from './calculationEngine.js';
import { getCitationConfig, getAvailableCitationTypes } from './citationConfigs.js';
import ExampleCitationSelector from './ExampleCitationSelector.jsx';
import ResultsReport from './ResultsReport.jsx';

function App() {
  // Page state
  const [currentPage, setCurrentPage] = useState('form'); // 'form' or 'results'
  const [selectedExample, setSelectedExample] = useState(null);

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

  // Handle example citation selection
  const handleSelectExample = (example) => {
    setSelectedExample(example);
    const data = example.data;

    // Populate all form fields
    setCitationType(data.citationType);
    setCaseNumber(data.caseNumber);
    setBaseFine(data.baseFine);
    setArrestingAgency(data.arrestingAgency);
    setSubAgency(data.subAgency);
    setAgencyLocal(data.agencyLocal);
    setCountyPercent(data.countyPercent);
    setGc76000(data.gc76000);
    setViolationDate(data.violationDate);
    setDispDate(data.dispDate);
    setViolationType(data.violationType);
    setHasLabPenalty(data.hasLabPenalty);
    setLabPenaltyAmount(data.labPenaltyAmount);

    // Smooth scroll to form
    setTimeout(() => {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 100);
  };

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

    // Add actualAmounts from selected example (if available) for variance tracking
    const resultWithVariance = {
      ...calculationResult,
      actualAmounts: selectedExample?.actualAmounts || null
    };

    setResult(resultWithVariance);

    // Navigate to results page
    setCurrentPage('results');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setCurrentPage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // If on results page, show ResultsReport component
  if (currentPage === 'results' && result) {
    return (
      <ResultsReport
        result={result}
        formData={{
          citationType,
          caseNumber,
          baseFine,
          arrestingAgency,
          violationType,
          violationDate
        }}
        onBackToForm={handleBackToForm}
      />
    );
  }

  // Otherwise show the form page
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

        {/* Example Citation Selector */}
        <ExampleCitationSelector
          onSelectExample={handleSelectExample}
          selectedExample={selectedExample}
        />

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
          <div className="mt-8">
            <button
              onClick={handleCalculate}
              className="w-full px-8 py-5 bg-blue-600 text-white text-2xl font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Calculate Distribution Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
