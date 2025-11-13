import { useState } from 'react';
import { identifyCitation, getRandomSample } from '../data/sampleCitations';
import '../styles/animations.css';

const CitationUpload = ({ onDataExtracted, currentCitationType }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [extractedFields, setExtractedFields] = useState([]);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processingSteps = [
    { progress: 5, message: '📤 Uploading document...', duration: 500 },
    { progress: 15, message: '🔍 Analyzing document format...', duration: 800 },
    { progress: 30, message: '📝 Extracting text using OCR...', duration: 1200 },
    { progress: 50, message: '🧠 Identifying citation type...', duration: 1000 },
    { progress: 65, message: '🎯 Locating data fields...', duration: 1000 },
    { progress: 80, message: '✨ Applying AI enhancement...', duration: 800 },
    { progress: 90, message: '✅ Validating extracted data...', duration: 700 },
    { progress: 100, message: '🎉 Complete!', duration: 400 }
  ];

  const fieldAnimationOrder = [
    'caseNumber',
    'baseFine',
    'violationDate',
    'violationType',
    'arrestingAgency',
    'countyPercent',
    'agencyLocal'
  ];

  const processFile = async (file) => {
    setIsProcessing(true);
    setUploadedFile(file);
    setError(null);
    setExtractedFields([]);

    // Check if this is a known sample file
    const citationData = identifyCitation(file);

    if (!citationData) {
      // If not a known file, show error after processing animation
      for (let i = 0; i < 3; i++) {
        setProgress(processingSteps[i].progress);
        setCurrentStep(processingSteps[i].message);
        await new Promise(r => setTimeout(r, processingSteps[i].duration));
      }
      setError('Unable to process this citation. Please use one of the sample citations provided or try the "Try Demo Citation" button.');
      setIsProcessing(false);
      return;
    }

    // Show preview if it's an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setShowPreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (citationData.thumbnail) {
      setShowPreview(citationData.thumbnail);
    }

    // Run through processing animation
    for (const step of processingSteps) {
      setProgress(step.progress);
      setCurrentStep(step.message);
      await new Promise(r => setTimeout(r, step.duration));
    }

    // Animate field extraction
    const fields = citationData.extractedData;
    for (const [index, fieldName] of fieldAnimationOrder.entries()) {
      if (fields[fieldName] !== undefined) {
        setExtractedFields(prev => [
          ...prev,
          {
            name: fieldName,
            value: fields[fieldName],
            confidence: 0.85 + Math.random() * 0.14 // 85-99% confidence
          }
        ]);
        await new Promise(r => setTimeout(r, 150));
      }
    }

    // Wait a moment then pass data to parent
    await new Promise(r => setTimeout(r, 1000));
    onDataExtracted(citationData.extractedData);

    // Reset state after delay
    setTimeout(() => {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
      setExtractedFields([]);
      setShowPreview(false);
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDemoClick = () => {
    // Create a fake file object for demo
    const sample = getRandomSample(currentCitationType);
    const fakeFile = new File([''], sample.fileName, { type: 'application/pdf' });
    processFile(fakeFile);
  };

  if (isProcessing) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 animate-scaleUp">
          {/* Preview Section */}
          {showPreview && (
            <div className="mb-6 relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 z-10"></div>
              <img
                src={showPreview}
                alt="Citation preview"
                className="w-full h-64 object-cover"
              />
              {/* Scanning line animation */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="scanner-line"></div>
              </div>
            </div>
          )}

          {/* Progress Section */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-900">Processing Citation</h3>
                <span className="text-sm font-medium text-blue-600">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Current step */}
            <div className="flex items-center space-x-3 animate-fadeIn">
              <div className="animate-spin h-5 w-5 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">{currentStep}</span>
            </div>

            {/* Extracted fields animation */}
            {extractedFields.length > 0 && (
              <div className="border-t pt-4 animate-slideDown">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                  Extracted Fields:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {extractedFields.map((field, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-green-50 rounded animate-slideIn border border-green-200"
                    >
                      <span className="text-xs font-medium text-gray-700">
                        {field.name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs text-green-600 font-bold">
                        {(field.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-3 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 drag-over'
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('citationFileInput').click()}
      >
        <div className="text-6xl mb-4">📄</div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Upload Citation Document
        </h3>
        <p className="text-gray-600 mb-4">
          Drag & drop your citation or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-6">Supports: PDF, JPG, PNG • Max 10MB</p>

        <input
          id="citationFileInput"
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
        />

        <button
          onClick={e => {
            e.stopPropagation();
            handleDemoClick();
          }}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          🎭 Try Demo Citation
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
          <p className="text-red-700 text-sm">{error}</p>
          <p className="text-red-600 text-xs mt-2">
            Try using the "Try Demo Citation" button for a working example.
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>Demo Mode:</strong> This demonstration uses pre-configured sample
          citations. The production version will process any California citation using
          advanced OCR technology.
        </p>
      </div>
    </div>
  );
};

export default CitationUpload;
