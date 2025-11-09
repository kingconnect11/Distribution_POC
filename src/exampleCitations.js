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
