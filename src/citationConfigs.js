/**
 * Citation Type Configurations for Napa County
 * Each citation type has its own calculation rules
 */

// Napa County multipliers for per-10 penalties
const NAPA_PENALTY_MULTIPLIERS = {
  PC_1464_STATE: 7,
  PC_1464_COUNTY: 3,
  GC_76104_6: 1,
  GC_76104_7: 4,
  GC_76100: 4,
  GC_76101: 1,
  GC_76104: 2,
  GC_76104_5: 0,
  GC_76102: 0,
  GC_76000_5: 2,
  GC_70372a_ICNA: 4,
  GC_70372a_SCFCF: 1
};

// Common penalties used by most citation types
const COMMON_PENALTIES = [
  {
    code: 'PC 1464',
    desc: 'State PA (70%)',
    entity: 'STATE',
    multiplier: NAPA_PENALTY_MULTIPLIERS.PC_1464_STATE
  },
  {
    code: 'PC 1464',
    desc: 'State PA (30%)',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.PC_1464_COUNTY
  },
  {
    code: 'GC 76104.6',
    desc: 'DNA PA (1/10)',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76104_6
  },
  {
    code: 'GC 76104.7',
    desc: 'DNA Addl PA (4/10)',
    entity: 'STATE',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76104_7
  },
  {
    code: 'GC 76100',
    desc: 'LCCF',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76100
  },
  {
    code: 'GC 76101',
    desc: 'LCJF',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76101
  },
  {
    code: 'GC 76104',
    desc: 'EMS',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76104
  },
  {
    code: 'GC 76104.5',
    desc: 'DNA ID',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76104_5
  },
  {
    code: 'GC 76102',
    desc: 'Auto Fingerprint',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76102
  },
  {
    code: 'GC 76000.5',
    desc: 'EMS Addl PA',
    entity: 'COUNTY',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_76000_5
  },
  {
    code: 'GC 70372(a)',
    desc: 'ICNA',
    entity: 'STATE',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_70372a_ICNA
  },
  {
    code: 'GC 70372(a)',
    desc: 'SCFCF',
    entity: 'STATE',
    multiplier: NAPA_PENALTY_MULTIPLIERS.GC_70372a_SCFCF
  }
];

// Common fixed assessments
const COMMON_ASSESSMENTS = [
  {
    code: 'GC 76000.10(c)',
    desc: 'EMAT Penalty',
    entity: 'STATE',
    amount: 4,
    isPercentage: false
  },
  {
    code: 'PC 1465.7',
    desc: '20% Surcharge',
    entity: 'STATE',
    amount: 0.20,
    isPercentage: true
  },
  {
    code: 'PC 1465.8',
    desc: 'Court Ops Assmnt',
    entity: 'STATE',
    amount: 80,
    isPercentage: false
  },
  {
    code: 'GC 70373',
    desc: 'Crim Conv Assmnt',
    entity: 'STATE',
    amount: 60,
    isPercentage: false
  }
];

/**
 * DUI Citation Configuration (VC 23152/23153)
 * - 3 base reductions totaling $120
 * - Standard penalties
 * - DUI-specific assessments
 */
export const DUI_CONFIG = {
  name: 'DUI (VC 23152/23153)',
  code: 'DUI',
  modificationType: 'REDUCE',
  modifications: [
    {
      code: 'PC 1463.14(a)',
      desc: 'DUI Lab Spec Acct',
      entity: 'COUNTY',
      amount: 50
    },
    {
      code: 'PC 1463.16',
      desc: 'DUI Prog Spec Acct',
      entity: 'COUNTY',
      amount: 50
    },
    {
      code: 'PC 1463.18',
      desc: 'DUI Indemnity Alloc',
      entity: 'STATE',
      amount: 20
    }
  ],
  penalties: COMMON_PENALTIES,
  assessments: [
    ...COMMON_ASSESSMENTS,
    {
      code: 'PC 1463.25',
      desc: 'Alcohol Edu Penalty',
      entity: 'COUNTY',
      amount: 50,
      isPercentage: false
    },
    {
      code: 'VC 23649(a)',
      desc: 'Alc & Drug Prob Assmnt',
      entity: 'COUNTY',
      amount: 35,
      isPercentage: false
    },
    {
      code: 'PC 1202.4(b)',
      desc: 'State Restitution Fine',
      entity: 'STATE',
      amount: 150,
      isPercentage: false
    }
  ],
  optionalItems: [
    {
      code: 'PC 1463.14(b)',
      desc: 'Lab Penalty',
      entity: 'COUNTY',
      condition: (inputs) => inputs.hasLabPenalty && inputs.labPenaltyAmount > 0,
      getAmount: (inputs) => parseFloat(inputs.labPenaltyAmount)
    }
  ]
};

/**
 * Standard Distribution Configuration (Non-Vehicle Code Infraction)
 * - No base reductions
 * - Standard penalties
 * - Basic assessments only
 */
export const STANDARD_CONFIG = {
  name: 'Standard Distribution',
  code: 'STANDARD',
  modificationType: 'NONE',
  modifications: [],
  penalties: COMMON_PENALTIES,
  assessments: COMMON_ASSESSMENTS,
  optionalItems: []
};

/**
 * Domestic Violence Citation Configuration (PC 273.5)
 * - No base reductions (different from DUI)
 * - Standard penalties apply
 * - DV-specific fees and assessments
 * - Higher restitution fines
 */
export const DOMESTIC_VIOLENCE_CONFIG = {
  name: 'Domestic Violence (PC 273.5)',
  code: 'DOMESTIC_VIOLENCE',
  modificationType: 'NONE',
  modifications: [],
  penalties: COMMON_PENALTIES,
  assessments: [
    ...COMMON_ASSESSMENTS,
    {
      code: 'PC 1203.097',
      desc: 'DV Fee',
      entity: 'COUNTY',
      amount: 400,
      isPercentage: false
    },
    {
      code: 'PC 1202.4(b)',
      desc: 'State Restitution Fine',
      entity: 'STATE',
      amount: 300,
      isPercentage: false
    }
  ],
  optionalItems: [
    {
      code: 'PC 1203.1b',
      desc: 'Probation Supervision',
      entity: 'COUNTY',
      condition: (inputs) => inputs.probationSupervision && inputs.probationSupervision > 0,
      getAmount: (inputs) => parseFloat(inputs.probationSupervision || 0)
    }
  ]
};

/**
 * Citation type registry
 */
export const CITATION_TYPES = {
  DUI: DUI_CONFIG,
  STANDARD: STANDARD_CONFIG,
  'Domestic Violence': DOMESTIC_VIOLENCE_CONFIG
};

/**
 * Get citation config by code
 */
export function getCitationConfig(citationType) {
  return CITATION_TYPES[citationType] || STANDARD_CONFIG;
}

/**
 * Get list of available citation types for dropdown
 */
export function getAvailableCitationTypes() {
  return Object.values(CITATION_TYPES).map(config => ({
    value: config.code,
    label: config.name
  }));
}
