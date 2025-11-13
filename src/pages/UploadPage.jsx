import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '../context/CalculationContext';
import { calculateDistribution } from '../calculationEngine.js';
import { getCitationConfig } from '../citationConfigs.js';
import CitationUpload from '../components/CitationUpload.jsx';
import { getAllSampleNames } from '../data/sampleCitations.js';

const UploadPage = () => {
  const navigate = useNavigate();
  const { updateResults, updateFormData } = useCalculation();
  const [currentCitationType, setCurrentCitationType] = useState('DUI');
  const sampleCitations = getAllSampleNames();

  // Handle extracted data from CitationUpload component
  const handleCitationExtracted = (extractedData) => {
    // Update form data in context
    updateFormData(extractedData);

    // Auto-calculate distribution
    const inputs = {
      baseFine: parseFloat(extractedData.baseFine),
      countyPercent: parseFloat(extractedData.countyPercent),
      cityPercent: 100 - parseFloat(extractedData.countyPercent),
      hasLabPenalty: extractedData.hasLabPenalty || false,
      labPenaltyAmount: parseFloat(extractedData.labPenaltyAmount) || 0,
      probationSupervision: parseFloat(extractedData.probationSupervision) || 0
    };

    const config = getCitationConfig(extractedData.citationType);
    const calculationResult = calculateDistribution(inputs, config);

    // Store results in context
    updateResults({
      ...calculationResult,
      actualAmounts: null,
      metadata: {
        citationType: extractedData.citationType,
        caseNumber: extractedData.caseNumber,
        baseFine: extractedData.baseFine,
        arrestingAgency: extractedData.arrestingAgency,
        violationType: extractedData.violationType,
        violationDate: extractedData.violationDate
      }
    });

    // Navigate to results page
    setTimeout(() => {
      navigate('/results');
    }, 2500);
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Citation</h1>
        <p className="text-gray-600">Upload a citation document to automatically extract data</p>
      </div>

      {/* Upload Interface Section */}
      <div className="mb-12">
        <CitationUpload
          onDataExtracted={handleCitationExtracted}
          currentCitationType={currentCitationType}
        />
      </div>

      {/* Divider */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 text-gray-500 font-medium">Sample Citations</span>
        </div>
      </div>

      {/* Sample Cases Gallery Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Sample Citations</h2>
        <p className="text-gray-600 mb-6">
          These sample files can be used to test the upload and OCR extraction functionality
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCitations.map((sample, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-400 transition-all p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{sample.displayName}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {sample.citationType}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 font-mono">{sample.fileName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">Demo Mode</h4>
            <p className="text-sm text-blue-800">
              This is a demonstration using pre-configured sample citations. The production version will process
              any California citation using advanced OCR technology. To test the upload feature, use the
              "Try Demo Citation" button or manually create a file with one of the sample filenames shown above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
