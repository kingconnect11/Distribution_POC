import React, { createContext, useContext, useState } from 'react';

const CalculationContext = createContext();

export const useCalculation = () => {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }
  return context;
};

export const CalculationProvider = ({ children }) => {
  // Calculation results state
  const [calculationResults, setCalculationResults] = useState(null);

  // Form data state for persistence
  const [formData, setFormData] = useState({
    citationType: 'dui',
    caseNumber: '',
    arrestingAgency: 'CHP',
    agencyType: 'county',
    chargeLevel: 'misdemeanor',
    baseFine: '',
    county: 'napa',
    arrDate: '',
    convDate: '',
    arrName: '',
    dob: '',
    totalPaid: '',
    dmvReportingCode: '',
    includeLabPenalty: 'no',
    includeAlcoholEducation: 'no',
    includeAlcoholProgramFee: 'no',
    includeProbationSupervisionFee: 'no',
    probationSupervisionFee: '',
    restitutionFine: '300',
    notes: ''
  });

  // Report parameters state
  const [reportParams, setReportParams] = useState({
    numberOfCases: '',
    casesPerYear: '',
    projectionYears: 10,
    growthRate: 0
  });

  // Update calculation results
  const updateResults = (results) => {
    setCalculationResults(results);
  };

  // Update form data
  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      citationType: 'dui',
      caseNumber: '',
      arrestingAgency: 'CHP',
      agencyType: 'county',
      chargeLevel: 'misdemeanor',
      baseFine: '',
      county: 'napa',
      arrDate: '',
      convDate: '',
      arrName: '',
      dob: '',
      totalPaid: '',
      dmvReportingCode: '',
      includeLabPenalty: 'no',
      includeAlcoholEducation: 'no',
      includeAlcoholProgramFee: 'no',
      includeProbationSupervisionFee: 'no',
      probationSupervisionFee: '',
      restitutionFine: '300',
      notes: ''
    });
  };

  // Update report parameters
  const updateReportParams = (params) => {
    setReportParams(prev => ({ ...prev, ...params }));
  };

  const value = {
    calculationResults,
    updateResults,
    formData,
    updateFormData,
    resetFormData,
    reportParams,
    updateReportParams
  };

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
};
