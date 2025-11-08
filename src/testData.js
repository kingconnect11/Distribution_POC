// Test data from TEST_CASE_QUICK_REFERENCE.js

export const NAPA_MULTIPLIERS = {
  // Base reductions (same)
  PC_1463_14a: 50,
  PC_1463_16: 50,
  PC_1463_18: 20,

  // Penalty multipliers (per 10)
  PC_1464_STATE: 7,
  PC_1464_COUNTY: 3,
  GC_76104_6: 1,      // DNA PA (combined in Napa)
  GC_76104_7: 4,      // DNA Addl PA

  // Napa-specific
  GC_76100: 4,   // LCCF
  GC_76101: 1,   // LCJF
  GC_76104: 2,   // EMS
  GC_76104_5: 0, // DNA ID
  GC_76102: 0,   // Auto Fingerprint
  GC_76000_5: 2, // EMS Addl PA

  GC_70372a_ICNA: 4,   // ICNA
  GC_70372a_SCFCF: 1,  // SCFCF

  GC_76000_10c: 4,  // EMAT Penalty (fixed amount)

  // Napa doubles some assessments
  PC_1465_8: 80,  // Court Ops (doubled to $80)
  GC_70373: 60,   // Crim Conv (doubled to $60)
  PC_1463_25: 50,   // Alcohol Edu Penalty
  VC_23649a: 35,    // Alc & Drug Prob Assmnt
  PC_1202_4b: 150   // State Restitution Fine
};

export const TEST_CASE_1 = {
  inputs: {
    caseNumber: 'CR 166313 Lawson',
    violationDate: '2013-06-02',
    countyPercent: 100,
    cityPercent: 0,
    baseFine: 500,
    hasLabPenalty: false,
    labPenaltyAmount: 0
  },

  calculated: {
    enhancedBase: 500,
    portionOf10: 50, // ROUNDUP(500/10)
    reducedBase: 380 // 500 - 120
  },

  expectedTotals: {
    county: 1215.00,
    city: 0.00,
    state: 1214.00,
    grandTotal: 2429.00
  }
};
