/**
 * Pre-configured example citations for client demos
 * These auto-populate the form with validated test case data
 */

export const EXAMPLE_CITATIONS = {
  dui_high: {
    id: 'dui_high',
    name: 'DUI - High Fine ($500)',
    description: 'DUI citation with $500 base fine (Napa County CR 166313 Lawson)',
    expectedTotal: 2429.00,
    data: {
      citationType: 'DUI',
      caseNumber: 'CR 166313 Lawson',
      baseFine: 500,
      arrestingAgency: 'Sheriff',
      subAgency: '',
      agencyLocal: 'County',
      countyPercent: 100,
      gc76000: 0,
      violationDate: '2013-06-02',
      dispDate: '',
      violationType: 'Misdemeanor',
      hasLabPenalty: false,
      labPenaltyAmount: 0
    },
    // Dummy "actual amounts" for variance demo
    // Scenario: Court made several small errors - Total actual: $2,349 (should be $2,429)
    // Variance: -$80 (County lost $80)
    actualAmounts: {
      'PC 1463.14(a)': 50.00,   // Correct
      'PC 1463.16': 50.00,       // Correct
      'PC 1463.18': 20.00,       // Correct
      'PC 1463.001': 380.00,     // Correct
      'PC 1463.002': 0.00,       // Correct
      'PC 1464': 350.00,         // ERROR: Court entered wrong (should match State PA 70%)
      'GC 76104.6': 50.00,       // Correct
      'GC 76104.7': 200.00,      // Correct
      'GC 76100': 200.00,        // Correct
      'GC 76101': 50.00,         // Correct
      'GC 76104': 100.00,        // Correct
      'GC 76104.5': 0.00,        // Correct
      'GC 76102': 0.00,          // Correct
      'GC 76000.5': 100.00,      // Correct
      'GC 76000.10(c)': 4.00,    // Correct
      'GC 70372(a)': 250.00,     // Correct (combined ICNA + SCFCF)
      'PC 1465.7': 100.00,       // Correct
      'PC 1465.8': 80.00,        // Correct
      'GC 70373': 60.00,         // Correct
      'PC 1463.25': 0.00,        // ERROR: Missing (should be 50)
      'VC 23649(a)': 5.00,       // ERROR: Wrong amount (should be 35)
      'PC 1202.4(b)': 150.00     // Correct
    }
  },

  dui_standard: {
    id: 'dui_standard',
    name: 'DUI - Standard Fine ($390)',
    description: 'DUI citation with $390 base fine (Napa County CR180521 Imbach)',
    expectedTotal: 1908.00,
    data: {
      citationType: 'DUI',
      caseNumber: 'CR180521 Imbach',
      baseFine: 390,
      arrestingAgency: 'CHP',
      subAgency: '',
      agencyLocal: 'County',
      countyPercent: 100,
      gc76000: 0,
      violationDate: '2015-08-15',
      dispDate: '',
      violationType: 'Misdemeanor',
      hasLabPenalty: false,
      labPenaltyAmount: 0
    },
    // Dummy "actual amounts" for variance demo
    // Scenario: Court forgot multiple penalty assessments - Total actual: $1,713 (should be $1,908)
    // Variance: -$195 (County lost $195)
    actualAmounts: {
      'PC 1463.14(a)': 50.00,    // Correct
      'PC 1463.16': 50.00,        // Correct
      'PC 1463.18': 20.00,        // Correct
      'PC 1463.001': 270.00,      // Correct
      'PC 1463.002': 0.00,        // Correct
      'PC 1464': 273.00,          // Correct (State PA 70%)
      'GC 76104.6': 39.00,        // Correct
      'GC 76104.7': 156.00,       // Correct
      'GC 76100': 0.00,           // ERROR: Missing (should be 156)
      'GC 76101': 0.00,           // ERROR: Missing (should be 39)
      'GC 76104': 78.00,          // Correct
      'GC 76104.5': 0.00,         // Correct
      'GC 76102': 0.00,           // Correct
      'GC 76000.5': 78.00,        // Correct
      'GC 76000.10(c)': 4.00,     // Correct
      'GC 70372(a)': 195.00,      // Correct (combined)
      'PC 1465.7': 78.00,         // Correct
      'PC 1465.8': 30.00,         // ERROR: Wrong (should be 80)
      'GC 70373': 60.00,          // Correct
      'PC 1463.25': 50.00,        // Correct
      'VC 23649(a)': 35.00,       // Correct
      'PC 1202.4(b)': 150.00      // Correct
    }
  },

  traffic_standard: {
    id: 'traffic_standard',
    name: 'Standard Traffic ($500)',
    description: 'Standard traffic violation with $500 base fine',
    expectedTotal: 2194.00,
    data: {
      citationType: 'STANDARD',
      caseNumber: 'TR 100234 Demo',
      baseFine: 500,
      arrestingAgency: 'PD',
      subAgency: '',
      agencyLocal: 'City',
      countyPercent: 100,
      gc76000: 0,
      violationDate: '2024-01-15',
      dispDate: '',
      violationType: 'Infraction',
      hasLabPenalty: false,
      labPenaltyAmount: 0
    },
    // Dummy "actual amounts" for variance demo
    // Scenario: Mix of over/under - Total actual: $1,994 (should be $2,194)
    // Variance: -$200 (County lost $200)
    actualAmounts: {
      'PC 1463.001': 500.00,      // Correct
      'PC 1463.002': 0.00,        // Correct
      'PC 1464': 500.00,          // ERROR: Over (combined wrong, should be 350+150=500, but actual is off)
      'GC 76104.6': 50.00,        // Correct
      'GC 76104.7': 200.00,       // Correct
      'GC 76100': 200.00,         // Correct
      'GC 76101': 50.00,          // Correct
      'GC 76104': 100.00,         // Correct
      'GC 76104.5': 0.00,         // Correct
      'GC 76102': 0.00,           // Correct
      'GC 76000.5': 100.00,       // Correct
      'GC 76000.10(c)': 4.00,     // Correct
      'GC 70372(a)': 0.00,        // ERROR: Missing (should be 250 combined)
      'PC 1465.7': 100.00,        // Correct
      'PC 1465.8': 80.00,         // Correct
      'GC 70373': 110.00          // ERROR: Over (should be 60)
    }
  }
};

/**
 * Get list of example citations for display
 */
export function getExampleCitations() {
  return Object.values(EXAMPLE_CITATIONS);
}

/**
 * Get specific example citation by ID
 */
export function getExampleCitation(id) {
  return EXAMPLE_CITATIONS[id];
}
