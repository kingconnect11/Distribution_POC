import { getExampleCitations } from './exampleCitations.js';

function ExampleCitationSelector({ onSelectExample, selectedExample }) {
  const examples = getExampleCitations();

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Get color scheme based on citation type
  const getColorScheme = (citationType) => {
    const type = citationType?.toUpperCase() || '';

    if (type === 'DUI') {
      // Check if it's high fine DUI (over $1000 base fine)
      // We'll determine this from the example data
      return {
        selected: 'bg-red-600 border-red-700',
        unselected: 'bg-white border-red-300 hover:border-red-500',
        text: 'text-red-900',
        amount: 'text-red-600',
        checkmark: 'text-red-600'
      };
    } else if (type === 'STANDARD') {
      return {
        selected: 'bg-blue-600 border-blue-700',
        unselected: 'bg-white border-blue-300 hover:border-blue-500',
        text: 'text-blue-900',
        amount: 'text-blue-600',
        checkmark: 'text-blue-600'
      };
    } else if (type.includes('DOMESTIC') || type.includes('VIOLENCE')) {
      return {
        selected: 'bg-purple-600 border-purple-700',
        unselected: 'bg-white border-purple-300 hover:border-purple-500',
        text: 'text-purple-900',
        amount: 'text-purple-600',
        checkmark: 'text-purple-600'
      };
    }

    // Default fallback
    return {
      selected: 'bg-gray-600 border-gray-700',
      unselected: 'bg-white border-gray-300 hover:border-gray-500',
      text: 'text-gray-900',
      amount: 'text-gray-600',
      checkmark: 'text-gray-600'
    };
  };

  // Determine if DUI is high fine or standard based on expected total
  const getDUIColorScheme = (example) => {
    const type = example.data.citationType?.toUpperCase() || '';
    if (type === 'DUI') {
      // High fine DUI (over $4000 total) - Red
      if (example.expectedTotal > 4000) {
        return {
          selected: 'bg-red-600 border-red-700',
          unselected: 'bg-white border-red-300 hover:border-red-500',
          text: 'text-red-900',
          amount: 'text-red-600',
          checkmark: 'text-red-600'
        };
      }
      // Standard DUI - Orange
      return {
        selected: 'bg-orange-600 border-orange-700',
        unselected: 'bg-white border-orange-300 hover:border-orange-500',
        text: 'text-orange-900',
        amount: 'text-orange-600',
        checkmark: 'text-orange-600'
      };
    }
    return getColorScheme(example.data.citationType);
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
        {examples.map((example) => {
          const colors = getDUIColorScheme(example);
          const isSelected = selectedExample?.id === example.id;

          return (
            <button
              key={example.id}
              onClick={() => onSelectExample(example)}
              className={`
                relative p-6 rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? `${colors.selected} text-white shadow-lg transform scale-105`
                  : `${colors.unselected} text-gray-900 hover:shadow-md hover:scale-102`
                }
              `}
            >
              {isSelected && (
                <div className={`absolute top-2 right-2 bg-white ${colors.checkmark} rounded-full p-1`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="text-left">
                <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-white' : colors.text}`}>
                  {example.name}
                </h3>
                <p className={`text-sm mb-3 ${isSelected ? 'text-white opacity-90' : 'text-gray-600'}`}>
                  {example.description}
                </p>
                <div className={`text-2xl font-bold ${isSelected ? 'text-white' : colors.amount}`}>
                  Total: {formatCurrency(example.expectedTotal)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center text-sm text-blue-700">
        After selecting an example, you can still edit any field manually before calculating
      </div>
    </div>
  );
}

export default ExampleCitationSelector;
