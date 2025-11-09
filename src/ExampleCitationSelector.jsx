import { getExampleCitations } from './exampleCitations.js';

function ExampleCitationSelector({ onSelectExample, selectedExample }) {
  const examples = getExampleCitations();

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 mb-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Quick Start - Choose an Example Citation
        </h2>
        <p className="text-blue-700 text-sm">
          Click a button below to auto-populate the form with validated test case data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => onSelectExample(example)}
            className={`
              relative p-6 rounded-lg border-2 transition-all duration-200
              ${selectedExample?.id === example.id
                ? 'bg-blue-600 border-blue-700 text-white shadow-lg transform scale-105'
                : 'bg-white border-blue-300 text-gray-900 hover:border-blue-500 hover:shadow-md hover:scale-102'
              }
            `}
          >
            {selectedExample?.id === example.id && (
              <div className="absolute top-2 right-2 bg-white text-blue-600 rounded-full p-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            <div className="text-left">
              <h3 className={`text-lg font-bold mb-2 ${selectedExample?.id === example.id ? 'text-white' : 'text-blue-900'}`}>
                {example.name}
              </h3>
              <p className={`text-sm mb-3 ${selectedExample?.id === example.id ? 'text-blue-100' : 'text-gray-600'}`}>
                {example.description}
              </p>
              <div className={`text-2xl font-bold ${selectedExample?.id === example.id ? 'text-white' : 'text-blue-600'}`}>
                Total: {formatCurrency(example.expectedTotal)}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-blue-700">
        After selecting an example, you can still edit any field manually before calculating
      </div>
    </div>
  );
}

export default ExampleCitationSelector;
