import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '../context/CalculationContext';
import { calculateDistribution } from '../calculationEngine.js';
import { getCitationConfig, getAvailableCitationTypes } from '../citationConfigs.js';

const ManualEntryPage = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, updateResults } = useCalculation();
  const availableCitationTypes = getAvailableCitationTypes();

  // Local state for form fields
  const [citationType, setCitationType] = useState(formData.citationType || 'DUI');
  const [caseNumber, setCaseNumber] = useState(formData.caseNumber || '');
  const [baseFine, setBaseFine] = useState(formData.baseFine || 500);
  const [arrestingAgency, setArrestingAgency] = useState(formData.arrestingAgency || 'PD');
  const [subAgency, setSubAgency] = useState(formData.subAgency || '');
  const [agencyLocal, setAgencyLocal] = useState(formData.agencyLocal || 'City');
  const [countyPercent, setCountyPercent] = useState(formData.countyPercent || 100);
  const [gc76000, setGc76000] = useState(formData.gc76000 || 0);
  const [violationDate, setViolationDate] = useState(formData.violationDate || '');
  const [dispDate, setDispDate] = useState(formData.dispDate || '');
  const [violationType, setViolationType] = useState(formData.violationType || 'Misdemeanor');
  const [hasLabPenalty, setHasLabPenalty] = useState(formData.hasLabPenalty || false);
  const [labPenaltyAmount, setLabPenaltyAmount] = useState(formData.labPenaltyAmount || 0);
  const [probationSupervision, setProbationSupervision] = useState(formData.probationSupervision || 0);

  const cityPercent = 100 - countyPercent;

  // Save form data to context whenever it changes
  useEffect(() => {
    updateFormData({
      citationType,
      caseNumber,
      baseFine,
      arrestingAgency,
      subAgency,
      agencyLocal,
      countyPercent,
      gc76000,
      violationDate,
      dispDate,
      violationType,
      hasLabPenalty,
      labPenaltyAmount,
      probationSupervision
    });
  }, [citationType, caseNumber, baseFine, arrestingAgency, subAgency, agencyLocal, countyPercent, gc76000, violationDate, dispDate, violationType, hasLabPenalty, labPenaltyAmount, probationSupervision]);

  const handleCalculate = () => {
    const inputs = {
      baseFine: parseFloat(baseFine),
      countyPercent: parseFloat(countyPercent),
      cityPercent,
      hasLabPenalty,
      labPenaltyAmount: parseFloat(labPenaltyAmount) || 0,
      probationSupervision: parseFloat(probationSupervision) || 0
    };

    const config = getCitationConfig(citationType);
    const calculationResult = calculateDistribution(inputs, config);

    // Store results in context
    updateResults({
      ...calculationResult,
      actualAmounts: null,
      metadata: {
        citationType,
        caseNumber,
        baseFine,
        arrestingAgency,
        violationType,
        violationDate
      }
    });

    // Navigate to results page
    navigate('/results');
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual Entry</h1>
        <p className="text-gray-600">Enter citation details to calculate distribution</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Number
            </label>
            <input
              id="caseNumber"
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="CR 123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Fine ($)
            </label>
            <input
              id="baseFine"
              type="number"
              value={baseFine}
              onChange={(e) => setBaseFine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min="0"
              step="1"
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
              id="arrestingAgency"
              value={arrestingAgency}
              onChange={(e) => setArrestingAgency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              id="agencyLocal"
              value={agencyLocal}
              onChange={(e) => setAgencyLocal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              id="countyPercent"
              type="number"
              value={countyPercent}
              onChange={(e) => {
                const value = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                setCountyPercent(value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              id="violationDate"
              type="date"
              value={violationDate}
              onChange={(e) => setViolationDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              id="violationType"
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Infraction">Infraction</option>
              <option value="Misdemeanor">Misdemeanor</option>
              <option value="Felony">Felony</option>
            </select>
          </div>
        </div>

        {/* DUI-Specific Fields */}
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

        {/* Domestic Violence-Specific Fields */}
        {citationType === 'Domestic Violence' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Domestic Violence-Specific Fields
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probation Supervision Fee ($)
                </label>
                <input
                  type="number"
                  value={probationSupervision}
                  onChange={(e) => setProbationSupervision(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="435"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PC 1203.1b - Typical amount: $435
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <div className="mt-8">
          <button
            onClick={handleCalculate}
            className="w-full px-10 py-6 bg-blue-700 text-white text-2xl font-bold rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Calculate Distribution
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryPage;
