import { NAPA_MULTIPLIERS } from './testData.js';

/**
 * Calculates DUI fine distribution based on California statutes
 * @param {Object} inputs - { baseFine, countyPercent, cityPercent, hasLabPenalty, labPenaltyAmount }
 * @param {Object} multipliers - County-specific multipliers (defaults to Napa)
 * @returns {Object} - { lineItems: [], totals: { county, city, state, grandTotal } }
 */
export function calculateDUIDistribution(inputs, multipliers = NAPA_MULTIPLIERS) {
  const {
    baseFine,
    countyPercent,
    cityPercent,
    hasLabPenalty = false,
    labPenaltyAmount = 0
  } = inputs;

  const lineItems = [];

  // STEP 1: Calculate enhanced base and portion of 10
  const enhancedBase = baseFine; // (ignore priors for POC)
  const portionOf10 = Math.ceil(enhancedBase / 10);

  // STEP 2: Base reductions (DUI-specific, happens FIRST)
  const PC_1463_14a = multipliers.PC_1463_14a; // 50 - COUNTY
  const PC_1463_16 = multipliers.PC_1463_16;   // 50 - COUNTY
  const PC_1463_18 = multipliers.PC_1463_18;   // 20 - STATE

  lineItems.push({
    code: 'PC 1463.14(a)',
    desc: 'DUI Lab Spec Acct',
    entity: 'COUNTY',
    amount: PC_1463_14a
  });

  lineItems.push({
    code: 'PC 1463.16',
    desc: 'DUI Prog Spec Acct',
    entity: 'COUNTY',
    amount: PC_1463_16
  });

  lineItems.push({
    code: 'PC 1463.18',
    desc: 'DUI Indemnity Alloc',
    entity: 'STATE',
    amount: PC_1463_18
  });

  const totalReductions = PC_1463_14a + PC_1463_16 + PC_1463_18; // 120
  const reducedBase = enhancedBase - totalReductions; // 500 - 120 = 380

  // STEP 3: County/City split
  const countyBase = reducedBase * (countyPercent / 100); // 380 * 1.00 = 380
  const cityBase = reducedBase * (cityPercent / 100);     // 380 * 0.00 = 0

  lineItems.push({
    code: 'PC 1463.001',
    desc: 'Base County',
    entity: 'COUNTY',
    amount: countyBase
  });

  lineItems.push({
    code: 'PC 1463.002',
    desc: 'Base City',
    entity: 'CITY',
    amount: cityBase
  });

  // STEP 4: Penalty assessments (multiply by portionOf10)
  const PC_1464_state = portionOf10 * multipliers.PC_1464_STATE;   // 50 × 7 = 350
  const PC_1464_county = portionOf10 * multipliers.PC_1464_COUNTY; // 50 × 3 = 150

  lineItems.push({
    code: 'PC 1464',
    desc: 'State PA (70%)',
    entity: 'STATE',
    amount: PC_1464_state
  });

  lineItems.push({
    code: 'PC 1464',
    desc: 'State PA (30%)',
    entity: 'COUNTY',
    amount: PC_1464_county
  });

  // GC 76104.6 - DNA PA (Napa uses combined approach)
  const GC_76104_6_county = portionOf10 * multipliers.GC_76104_6; // 50 × 1 = 50
  lineItems.push({
    code: 'GC 76104.6',
    desc: 'DNA PA (1/10)',
    entity: 'COUNTY',
    amount: GC_76104_6_county
  });

  // GC 76104.7 - DNA Additional PA
  const GC_76104_7 = portionOf10 * multipliers.GC_76104_7; // 50 × 4 = 200
  lineItems.push({
    code: 'GC 76104.7',
    desc: 'DNA Addl PA (4/10)',
    entity: 'STATE',
    amount: GC_76104_7
  });

  // GC 76100 - LCCF (Law Library Construction Fund)
  const GC_76100 = portionOf10 * multipliers.GC_76100; // 50 × 4 = 200
  lineItems.push({
    code: 'GC 76100',
    desc: 'LCCF',
    entity: 'COUNTY',
    amount: GC_76100
  });

  // GC 76101 - LCJF (Local Criminal Justice Fund)
  const GC_76101 = portionOf10 * multipliers.GC_76101; // 50 × 1 = 50
  lineItems.push({
    code: 'GC 76101',
    desc: 'LCJF',
    entity: 'COUNTY',
    amount: GC_76101
  });

  // GC 76104 - EMS (Emergency Medical Services)
  const GC_76104 = portionOf10 * multipliers.GC_76104; // 50 × 2 = 100
  lineItems.push({
    code: 'GC 76104',
    desc: 'EMS',
    entity: 'COUNTY',
    amount: GC_76104
  });

  // GC 76104.5 - DNA ID
  const GC_76104_5 = portionOf10 * multipliers.GC_76104_5; // 50 × 0 = 0
  lineItems.push({
    code: 'GC 76104.5',
    desc: 'DNA ID',
    entity: 'COUNTY',
    amount: GC_76104_5
  });

  // GC 76102 - Auto Fingerprint
  const GC_76102 = portionOf10 * multipliers.GC_76102; // 50 × 0 = 0
  lineItems.push({
    code: 'GC 76102',
    desc: 'Auto Fingerprint',
    entity: 'COUNTY',
    amount: GC_76102
  });

  // GC 76000.5 - EMS Additional PA
  const GC_76000_5 = portionOf10 * multipliers.GC_76000_5; // 50 × 2 = 100
  lineItems.push({
    code: 'GC 76000.5',
    desc: 'EMS Addl PA',
    entity: 'COUNTY',
    amount: GC_76000_5
  });

  // GC 76000.10(c) - EMAT Penalty (fixed amount)
  const GC_76000_10c = multipliers.GC_76000_10c; // 4
  lineItems.push({
    code: 'GC 76000.10(c)',
    desc: 'EMAT Penalty',
    entity: 'STATE',
    amount: GC_76000_10c
  });

  // GC 70372(a) - ICNA
  const GC_70372a_ICNA = portionOf10 * multipliers.GC_70372a_ICNA; // 50 × 4 = 200
  lineItems.push({
    code: 'GC 70372(a)',
    desc: 'ICNA',
    entity: 'STATE',
    amount: GC_70372a_ICNA
  });

  // GC 70372(a) - SCFCF
  const GC_70372a_SCFCF = portionOf10 * multipliers.GC_70372a_SCFCF; // 50 × 1 = 50
  lineItems.push({
    code: 'GC 70372(a)',
    desc: 'SCFCF',
    entity: 'STATE',
    amount: GC_70372a_SCFCF
  });

  // STEP 5: Additional assessments (fixed or percentage-based)

  // PC 1465.7 - 20% Surcharge (uses enhancedBase, not reducedBase)
  const PC_1465_7 = enhancedBase * 0.20; // 500 × 0.20 = 100
  lineItems.push({
    code: 'PC 1465.7',
    desc: '20% Surcharge',
    entity: 'STATE',
    amount: PC_1465_7
  });

  // PC 1465.8 - Court Operations Assessment (Napa doubles to $80)
  const PC_1465_8 = multipliers.PC_1465_8; // 80
  lineItems.push({
    code: 'PC 1465.8',
    desc: 'Court Ops Assmnt',
    entity: 'STATE',
    amount: PC_1465_8
  });

  // GC 70373 - Criminal Conviction Assessment (Napa doubles to $60)
  const GC_70373 = multipliers.GC_70373; // 60
  lineItems.push({
    code: 'GC 70373',
    desc: 'Crim Conv Assmnt',
    entity: 'STATE',
    amount: GC_70373
  });

  // PC 1463.25 - Alcohol Education Penalty
  const PC_1463_25 = multipliers.PC_1463_25; // 50
  lineItems.push({
    code: 'PC 1463.25',
    desc: 'Alcohol Edu Penalty',
    entity: 'COUNTY',
    amount: PC_1463_25
  });

  // VC 23649(a) - Alcohol & Drug Problem Assessment
  const VC_23649a = multipliers.VC_23649a; // 35
  lineItems.push({
    code: 'VC 23649(a)',
    desc: 'Alc & Drug Prob Assmnt',
    entity: 'COUNTY',
    amount: VC_23649a
  });

  // PC 1202.4(b) - State Restitution Fine
  const PC_1202_4b = multipliers.PC_1202_4b; // 150
  lineItems.push({
    code: 'PC 1202.4(b)',
    desc: 'State Restitution Fine',
    entity: 'STATE',
    amount: PC_1202_4b
  });

  // STEP 6: Optional Lab Penalty
  if (hasLabPenalty && labPenaltyAmount > 0) {
    lineItems.push({
      code: 'PC 1463.14(b)',
      desc: 'Lab Penalty',
      entity: 'COUNTY',
      amount: labPenaltyAmount
    });
  }

  // STEP 7: Aggregate by entity
  const totals = {
    county: 0,
    city: 0,
    state: 0,
    grandTotal: 0
  };

  lineItems.forEach(item => {
    const amount = parseFloat(item.amount);
    totals.grandTotal += amount;

    if (item.entity === 'COUNTY') {
      totals.county += amount;
    } else if (item.entity === 'CITY') {
      totals.city += amount;
    } else if (item.entity === 'STATE') {
      totals.state += amount;
    }
  });

  // Round to 2 decimal places
  totals.county = Math.round(totals.county * 100) / 100;
  totals.city = Math.round(totals.city * 100) / 100;
  totals.state = Math.round(totals.state * 100) / 100;
  totals.grandTotal = Math.round(totals.grandTotal * 100) / 100;

  return {
    lineItems,
    totals,
    calculated: {
      enhancedBase,
      portionOf10,
      reducedBase
    }
  };
}

/**
 * Validates calculation against expected results
 */
export function validateCalculation(calculated, expected, tolerance = 0.01) {
  const countyMatch = Math.abs(calculated.county - expected.county) < tolerance;
  const cityMatch = Math.abs(calculated.city - expected.city) < tolerance;
  const stateMatch = Math.abs(calculated.state - expected.state) < tolerance;
  const totalMatch = Math.abs(calculated.grandTotal - expected.grandTotal) < tolerance;

  return {
    passed: countyMatch && cityMatch && stateMatch && totalMatch,
    countyMatch,
    cityMatch,
    stateMatch,
    totalMatch,
    differences: {
      county: calculated.county - expected.county,
      city: calculated.city - expected.city,
      state: calculated.state - expected.state,
      grandTotal: calculated.grandTotal - expected.grandTotal
    }
  };
}
