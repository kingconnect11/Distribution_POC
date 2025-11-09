import { getCitationConfig } from './citationConfigs.js';

function ResultsReport({ result, formData, onBackToForm }) {
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

  const citationConfig = getCitationConfig(formData.citationType);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Group line items by entity for better organization
  const countyItems = result.lineItems.filter(item => item.entity.toUpperCase() === 'COUNTY');
  const cityItems = result.lineItems.filter(item => item.entity.toUpperCase() === 'CITY');
  const stateItems = result.lineItems.filter(item => item.entity.toUpperCase() === 'STATE');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Buttons - Top (Hidden in Print) */}
        <div className="no-print mb-6 flex justify-between items-center">
          <button
            onClick={onBackToForm}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors shadow-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Form
          </button>

          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>

        {/* Professional Report Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none">
          {/* Report Header */}
          <div className="border-b-4 border-blue-600 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              CALIFORNIA CITATION FINE DISTRIBUTION REPORT
            </h1>
            <p className="text-center text-gray-600 font-medium">
              Napa County Court System
            </p>
            <p className="text-center text-gray-500 text-sm mt-2">
              Generated: {today}
            </p>
          </div>

          {/* Case Information */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Case Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Case Number:</span>
                <p className="text-gray-900 font-semibold">{formData.caseNumber || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Citation Type:</span>
                <p className="text-gray-900 font-semibold">{citationConfig.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Violation Type:</span>
                <p className="text-gray-900 font-semibold">{formData.violationType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Base Fine:</span>
                <p className="text-gray-900 font-semibold">{formatCurrency(formData.baseFine)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Violation Date:</span>
                <p className="text-gray-900 font-semibold">{formData.violationDate || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Arresting Agency:</span>
                <p className="text-gray-900 font-semibold">{formData.arrestingAgency}</p>
              </div>
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-sm font-medium text-blue-700">Enhanced Base</span>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(result.calculated.enhancedBase)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700">Portion of 10</span>
                <p className="text-2xl font-bold text-blue-900">{result.calculated.portionOf10}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700">Modified Base</span>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(result.calculated.reducedBase)}</p>
              </div>
            </div>
          </div>

          {/* Distribution Table */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Distribution Breakdown</h2>

            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                      Statute Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700 uppercase">
                      Entity
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-gray-700 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.lineItems.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.desc}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEntityColorClass(item.entity)}`}>
                          {item.entity}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Totals */}
          <div className="border-4 border-gray-300 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Distribution Summary</h2>
            <div className="space-y-3">
              {result.totals.county > 0 && (
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-2 border-blue-200">
                  <span className="text-lg font-semibold text-gray-700">County Total:</span>
                  <span className="text-2xl font-bold font-mono text-blue-700">
                    {formatCurrency(result.totals.county)}
                  </span>
                </div>
              )}
              {result.totals.city > 0 && (
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-2 border-green-200">
                  <span className="text-lg font-semibold text-gray-700">City Total:</span>
                  <span className="text-2xl font-bold font-mono text-green-700">
                    {formatCurrency(result.totals.city)}
                  </span>
                </div>
              )}
              {result.totals.state > 0 && (
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-2 border-purple-200">
                  <span className="text-lg font-semibold text-gray-700">State Total:</span>
                  <span className="text-2xl font-bold font-mono text-purple-700">
                    {formatCurrency(result.totals.state)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-4 px-4 bg-blue-600 rounded-lg mt-4">
                <span className="text-xl font-bold text-white">GRAND TOTAL:</span>
                <span className="text-3xl font-bold font-mono text-white">
                  {formatCurrency(result.totals.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-600">
            <p>This report was generated using validated California statute calculations for Napa County.</p>
            <p className="mt-1">All amounts are calculated according to current state and county regulations.</p>
          </div>
        </div>

        {/* Action Buttons - Bottom (Hidden in Print) */}
        <div className="no-print mt-6 flex justify-between items-center">
          <button
            onClick={onBackToForm}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors shadow-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Form
          </button>

          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsReport;
