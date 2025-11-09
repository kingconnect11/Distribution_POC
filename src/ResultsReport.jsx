import { getCitationConfig } from './citationConfigs.js';
import HomeButton from './components/HomeButton.jsx';

function ResultsReport({ result, formData, onBackToForm }) {
  const formatCurrency = (amount) => {
    // Add defensive check for null/undefined/non-number values
    const num = parseFloat(amount);
    if (isNaN(num)) {
      console.error('formatCurrency received invalid amount:', amount);
      return '$0.00';
    }
    return `$${num.toFixed(2)}`;
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

  // Check if we have variance data (actualAmounts from example citations)
  const hasVarianceData = result.actualAmounts !== null && result.actualAmounts !== undefined;

  // Calculate totals with variance
  const calculateTotalsWithVariance = () => {
    const totals = {
      calculated: { county: 0, city: 0, state: 0, grandTotal: 0 },
      actual: { county: 0, city: 0, state: 0, grandTotal: 0 },
      variance: { county: 0, city: 0, state: 0, grandTotal: 0 }
    };

    result.lineItems.forEach(item => {
      const calculatedAmount = parseFloat(item.amount);
      const actualAmount = hasVarianceData
        ? (result.actualAmounts[item.code] ?? calculatedAmount)
        : calculatedAmount;
      const variance = actualAmount - calculatedAmount;

      const entity = item.entity.toUpperCase();

      // Calculated totals
      totals.calculated.grandTotal += calculatedAmount;
      if (entity === 'COUNTY') totals.calculated.county += calculatedAmount;
      else if (entity === 'CITY') totals.calculated.city += calculatedAmount;
      else if (entity === 'STATE') totals.calculated.state += calculatedAmount;

      // Actual totals
      totals.actual.grandTotal += actualAmount;
      if (entity === 'COUNTY') totals.actual.county += actualAmount;
      else if (entity === 'CITY') totals.actual.city += actualAmount;
      else if (entity === 'STATE') totals.actual.state += actualAmount;
    });

    // Calculate variances
    totals.variance.county = totals.actual.county - totals.calculated.county;
    totals.variance.city = totals.actual.city - totals.calculated.city;
    totals.variance.state = totals.actual.state - totals.calculated.state;
    totals.variance.grandTotal = totals.actual.grandTotal - totals.calculated.grandTotal;

    return totals;
  };

  const varianceTotals = hasVarianceData ? calculateTotalsWithVariance() : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Home Button */}
      <HomeButton onClick={onBackToForm} />

      <div className="max-w-6xl mx-auto px-8 lg:px-12">
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

          {/* Variance Summary Dashboard (only if there's variance data) */}
          {hasVarianceData && varianceTotals && (
            <div className="mb-6">
              {/* Alert Box for Errors */}
              {varianceTotals.variance.grandTotal !== 0 && (
                <div className={`p-4 rounded-lg mb-4 border-2 ${
                  varianceTotals.variance.grandTotal < 0
                    ? 'bg-red-50 border-red-400'
                    : 'bg-orange-50 border-orange-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <div className="font-bold text-lg text-gray-900">Distribution Error Detected</div>
                      <div className="text-sm text-gray-700">
                        This citation has a <span className="font-bold">{formatCurrency(Math.abs(varianceTotals.variance.grandTotal))}</span> variance.
                        {varianceTotals.variance.grandTotal < 0 && ' County lost revenue due to under-distribution.'}
                        {varianceTotals.variance.grandTotal > 0 && ' Citation was over-distributed.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Variance Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* County Variance Card */}
                {result.totals.county > 0 && (
                  <div className={`rounded-lg p-4 border-2 ${
                    varianceTotals.variance.county < 0
                      ? 'bg-red-50 border-red-300'
                      : varianceTotals.variance.county > 0
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-green-50 border-green-300'
                  }`}>
                    <div className="text-sm font-medium text-gray-600 mb-1">County Variance</div>
                    <div className={`text-2xl font-bold ${
                      varianceTotals.variance.county < 0
                        ? 'text-red-700'
                        : varianceTotals.variance.county > 0
                        ? 'text-orange-700'
                        : 'text-green-700'
                    }`}>
                      {varianceTotals.variance.county === 0 ? '✅ Perfect' : formatCurrency(varianceTotals.variance.county)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {varianceTotals.variance.county < 0 && 'Revenue Lost'}
                      {varianceTotals.variance.county > 0 && 'Over-distributed'}
                      {varianceTotals.variance.county === 0 && 'No Errors'}
                    </div>
                  </div>
                )}

                {/* City Variance Card */}
                {result.totals.city > 0 && (
                  <div className={`rounded-lg p-4 border-2 ${
                    varianceTotals.variance.city < 0
                      ? 'bg-red-50 border-red-300'
                      : varianceTotals.variance.city > 0
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-green-50 border-green-300'
                  }`}>
                    <div className="text-sm font-medium text-gray-600 mb-1">City Variance</div>
                    <div className={`text-2xl font-bold ${
                      varianceTotals.variance.city < 0
                        ? 'text-red-700'
                        : varianceTotals.variance.city > 0
                        ? 'text-orange-700'
                        : 'text-green-700'
                    }`}>
                      {varianceTotals.variance.city === 0 ? '✅ Perfect' : formatCurrency(varianceTotals.variance.city)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {varianceTotals.variance.city < 0 && 'Revenue Lost'}
                      {varianceTotals.variance.city > 0 && 'Over-distributed'}
                      {varianceTotals.variance.city === 0 && 'No Errors'}
                    </div>
                  </div>
                )}

                {/* State Variance Card */}
                {result.totals.state > 0 && (
                  <div className={`rounded-lg p-4 border-2 ${
                    varianceTotals.variance.state < 0
                      ? 'bg-red-50 border-red-300'
                      : varianceTotals.variance.state > 0
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-green-50 border-green-300'
                  }`}>
                    <div className="text-sm font-medium text-gray-600 mb-1">State Variance</div>
                    <div className={`text-2xl font-bold ${
                      varianceTotals.variance.state < 0
                        ? 'text-red-700'
                        : varianceTotals.variance.state > 0
                        ? 'text-orange-700'
                        : 'text-green-700'
                    }`}>
                      {varianceTotals.variance.state === 0 ? '✅ Perfect' : formatCurrency(varianceTotals.variance.state)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {varianceTotals.variance.state < 0 && 'Revenue Lost'}
                      {varianceTotals.variance.state > 0 && 'Over-distributed'}
                      {varianceTotals.variance.state === 0 && 'No Errors'}
                    </div>
                  </div>
                )}
              </div>

              {/* Error Count Summary */}
              {varianceTotals.variance.grandTotal !== 0 && (
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium text-gray-700">
                    {result.lineItems.filter(item => {
                      const calc = parseFloat(item.amount);
                      const actual = result.actualAmounts[item.code] ?? calc;
                      return actual !== calc;
                    }).length} error(s) found in distribution
                  </span>
                </div>
              )}
            </div>
          )}

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

            {!hasVarianceData && (
              <div className="text-sm text-gray-600 italic mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                Note: Variance tracking requires example citation data. Manual entries show calculated amounts only.
              </div>
            )}

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
                      {hasVarianceData ? 'Calculated' : 'Amount'}
                    </th>
                    {hasVarianceData && (
                      <>
                        <th className="px-4 py-3 text-right text-sm font-bold text-gray-700 uppercase">
                          Actual
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-bold text-gray-700 uppercase">
                          Variance
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.lineItems.map((item, index) => {
                    const calculatedAmount = parseFloat(item.amount);
                    const actualAmount = hasVarianceData
                      ? (result.actualAmounts[item.code] ?? calculatedAmount)
                      : calculatedAmount;
                    const variance = actualAmount - calculatedAmount;
                    const hasError = variance !== 0;

                    const rowClass = hasError
                      ? (variance < 0 ? 'bg-red-50' : 'bg-orange-50')
                      : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50');

                    return (
                      <tr key={index} className={rowClass}>
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
                          {formatCurrency(calculatedAmount)}
                        </td>
                        {hasVarianceData && (
                          <>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold text-gray-900">
                              {formatCurrency(actualAmount)}
                            </td>
                            <td className={`px-4 py-3 text-sm text-right font-bold ${
                              variance < 0 ? 'text-red-600' : variance > 0 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {variance === 0 ? (
                                <span className="text-green-600 text-lg">✅</span>
                              ) : (
                                <div className="flex flex-col items-end">
                                  <span className="whitespace-nowrap">
                                    {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                                    {variance < 0 ? ' ❌' : ' ⚠️'}
                                  </span>
                                  <span className="text-xs font-normal text-gray-600 mt-1">
                                    {variance < 0 ? 'Under by ' + formatCurrency(Math.abs(variance)) : 'Over by ' + formatCurrency(variance)}
                                  </span>
                                </div>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Totals */}
          <div className="border-4 border-gray-300 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Distribution Summary</h2>

            {hasVarianceData && varianceTotals ? (
              <div className="space-y-4">
                {/* County Total */}
                {result.totals.county > 0 && (
                  <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
                    <div className="font-semibold text-gray-700 mb-2">County Total:</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Calculated:</span>
                        <div className="font-bold text-blue-700">{formatCurrency(varianceTotals.calculated.county)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <div className="font-bold text-gray-900">{formatCurrency(varianceTotals.actual.county)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Variance:</span>
                        <div className={`font-bold ${varianceTotals.variance.county < 0 ? 'text-red-600' : varianceTotals.variance.county > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {varianceTotals.variance.county === 0 ? '✅ $0.00' : `${formatCurrency(varianceTotals.variance.county)} ${varianceTotals.variance.county < 0 ? '❌' : '⚠️'}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* City Total */}
                {result.totals.city > 0 && (
                  <div className="bg-white rounded-lg border-2 border-green-200 p-4">
                    <div className="font-semibold text-gray-700 mb-2">City Total:</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Calculated:</span>
                        <div className="font-bold text-green-700">{formatCurrency(varianceTotals.calculated.city)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <div className="font-bold text-gray-900">{formatCurrency(varianceTotals.actual.city)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Variance:</span>
                        <div className={`font-bold ${varianceTotals.variance.city < 0 ? 'text-red-600' : varianceTotals.variance.city > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {varianceTotals.variance.city === 0 ? '✅ $0.00' : `${formatCurrency(varianceTotals.variance.city)} ${varianceTotals.variance.city < 0 ? '❌' : '⚠️'}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* State Total */}
                {result.totals.state > 0 && (
                  <div className="bg-white rounded-lg border-2 border-purple-200 p-4">
                    <div className="font-semibold text-gray-700 mb-2">State Total:</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Calculated:</span>
                        <div className="font-bold text-purple-700">{formatCurrency(varianceTotals.calculated.state)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <div className="font-bold text-gray-900">{formatCurrency(varianceTotals.actual.state)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Variance:</span>
                        <div className={`font-bold ${varianceTotals.variance.state < 0 ? 'text-red-600' : varianceTotals.variance.state > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {varianceTotals.variance.state === 0 ? '✅ $0.00' : `${formatCurrency(varianceTotals.variance.state)} ${varianceTotals.variance.state < 0 ? '❌' : '⚠️'}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grand Total */}
                <div className="bg-blue-600 rounded-lg p-4 text-white mt-4">
                  <div className="font-bold text-lg mb-2 text-center">GRAND TOTAL</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-blue-100">Should Distribute:</span>
                      <div className="font-bold text-xl">{formatCurrency(varianceTotals.calculated.grandTotal)}</div>
                    </div>
                    <div>
                      <span className="text-blue-100">Actually Recorded:</span>
                      <div className="font-bold text-xl">{formatCurrency(varianceTotals.actual.grandTotal)}</div>
                    </div>
                    <div>
                      <span className="text-blue-100">Total Variance:</span>
                      <div className={`font-bold text-xl ${varianceTotals.variance.grandTotal < 0 ? 'text-red-300' : varianceTotals.variance.grandTotal > 0 ? 'text-orange-300' : 'text-green-300'}`}>
                        {varianceTotals.variance.grandTotal === 0 ? '✅ $0.00' : `${formatCurrency(varianceTotals.variance.grandTotal)} ${varianceTotals.variance.grandTotal < 0 ? '❌' : '⚠️'}`}
                      </div>
                    </div>
                  </div>
                  {varianceTotals.variance.grandTotal !== 0 && (
                    <div className="text-center mt-3 text-sm text-blue-100">
                      {varianceTotals.variance.grandTotal < 0 && `County lost ${formatCurrency(Math.abs(varianceTotals.variance.grandTotal))} on this citation`}
                      {varianceTotals.variance.grandTotal > 0 && `County over-distributed ${formatCurrency(varianceTotals.variance.grandTotal)} on this citation`}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Original summary without variance */
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
            )}
          </div>

          {/* Revenue Recovery Projection (only show if variance detected) */}
          {hasVarianceData && varianceTotals && varianceTotals.variance.grandTotal !== 0 && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                <span>💰</span>
                <span>Annual Revenue Impact Projection</span>
              </h2>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-3 text-center">
                  Based on this citation's error rate, here's the potential annual revenue impact:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conservative Estimate */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 uppercase mb-2">Conservative</div>
                    <div className="text-sm text-gray-600 mb-1">5,000 citations/year</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(Math.abs(varianceTotals.variance.grandTotal) * 5000)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">potential annual impact</div>
                  </div>

                  {/* Moderate Estimate */}
                  <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-400">
                    <div className="text-xs font-semibold text-indigo-700 uppercase mb-2">Moderate</div>
                    <div className="text-sm text-gray-600 mb-1">10,000 citations/year</div>
                    <div className="text-2xl font-bold text-indigo-900">
                      {formatCurrency(Math.abs(varianceTotals.variance.grandTotal) * 10000)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">potential annual impact</div>
                  </div>

                  {/* High Volume Estimate */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-xs font-semibold text-purple-700 uppercase mb-2">High Volume</div>
                    <div className="text-sm text-gray-600 mb-1">15,000 citations/year</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {formatCurrency(Math.abs(varianceTotals.variance.grandTotal) * 15000)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">potential annual impact</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-start gap-2">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Business Impact</div>
                    <div className="text-sm text-gray-700">
                      {varianceTotals.variance.grandTotal < 0 ? (
                        <>
                          At {formatCurrency(Math.abs(varianceTotals.variance.grandTotal))} per citation, systematic distribution errors
                          could cost the county <span className="font-bold text-red-700">hundreds of thousands to millions</span> in lost revenue annually.
                          <div className="mt-2 font-semibold">
                            Automated variance detection ensures statutory compliance and recovers lost revenue.
                          </div>
                        </>
                      ) : (
                        <>
                          Over-distribution of {formatCurrency(varianceTotals.variance.grandTotal)} per citation
                          represents <span className="font-bold text-orange-700">improper fund allocation</span> that should be corrected.
                          <div className="mt-2 font-semibold">
                            Automated validation prevents over-payment and ensures accurate distribution.
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
