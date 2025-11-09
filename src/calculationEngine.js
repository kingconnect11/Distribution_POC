/**
 * Modular Calculation Engine for California Citation Fine Distribution
 * Supports multiple citation types with configurable rules
 */

/**
 * Step 1: Calculate base modifications (reductions, enhancements, or allocations)
 */
export function calculateBase(baseFine, modificationType, modifications = []) {
  const enhancedBase = baseFine;
  const portionOf10 = Math.ceil(enhancedBase / 10);
  const lineItems = [];
  let totalModifications = 0;

  // Apply base modifications (reductions or enhancements)
  modifications.forEach(mod => {
    lineItems.push({
      code: mod.code,
      desc: mod.desc,
      entity: mod.entity,
      amount: mod.amount
    });

    if (modificationType === 'REDUCE') {
      totalModifications += mod.amount;
    } else if (modificationType === 'ENHANCE') {
      totalModifications += mod.amount;
    }
  });

  const modifiedBase = modificationType === 'REDUCE'
    ? enhancedBase - totalModifications
    : modificationType === 'ENHANCE'
    ? enhancedBase + totalModifications
    : enhancedBase;

  return {
    enhancedBase,
    portionOf10,
    modifiedBase,
    lineItems
  };
}

/**
 * Step 2: Split base between County and City
 */
export function splitBase(modifiedBase, countyPercent, cityPercent) {
  const countyBase = modifiedBase * (countyPercent / 100);
  const cityBase = modifiedBase * (cityPercent / 100);

  return [
    {
      code: 'PC 1463.001',
      desc: 'Base County',
      entity: 'COUNTY',
      amount: countyBase
    },
    {
      code: 'PC 1463.002',
      desc: 'Base City',
      entity: 'CITY',
      amount: cityBase
    }
  ];
}

/**
 * Step 3: Calculate penalty assessments (multiply by portion of 10)
 */
export function calculatePenalties(portionOf10, penaltyConfig) {
  const lineItems = [];

  penaltyConfig.forEach(penalty => {
    lineItems.push({
      code: penalty.code,
      desc: penalty.desc,
      entity: penalty.entity,
      amount: portionOf10 * penalty.multiplier
    });
  });

  return lineItems;
}

/**
 * Step 4: Calculate fixed assessments
 */
export function calculateFixedAssessments(enhancedBase, assessmentConfig) {
  const lineItems = [];

  assessmentConfig.forEach(assessment => {
    let amount = assessment.amount;

    // Handle percentage-based assessments (like 20% surcharge)
    if (assessment.isPercentage) {
      amount = enhancedBase * assessment.amount;
    }

    lineItems.push({
      code: assessment.code,
      desc: assessment.desc,
      entity: assessment.entity,
      amount: amount
    });
  });

  return lineItems;
}

/**
 * Step 5: Aggregate totals by entity
 */
export function aggregateTotals(lineItems) {
  const totals = {
    county: 0,
    city: 0,
    state: 0,
    court: 0,
    grandTotal: 0
  };

  lineItems.forEach(item => {
    const amount = parseFloat(item.amount);
    totals.grandTotal += amount;

    const entity = item.entity.toUpperCase();
    if (entity === 'COUNTY') {
      totals.county += amount;
    } else if (entity === 'CITY') {
      totals.city += amount;
    } else if (entity === 'STATE') {
      totals.state += amount;
    } else if (entity === 'COURT') {
      totals.court += amount;
    }
  });

  // Round to 2 decimal places
  Object.keys(totals).forEach(key => {
    totals[key] = Math.round(totals[key] * 100) / 100;
  });

  return totals;
}

/**
 * Main calculation dispatcher
 */
export function calculateDistribution(inputs, citationConfig) {
  const {
    baseFine,
    countyPercent,
    cityPercent,
    hasLabPenalty = false,
    labPenaltyAmount = 0
  } = inputs;

  let allLineItems = [];

  // Step 1: Base modifications
  const baseCalc = calculateBase(
    baseFine,
    citationConfig.modificationType,
    citationConfig.modifications
  );
  allLineItems = allLineItems.concat(baseCalc.lineItems);

  // Step 2: County/City split
  const baseSplit = splitBase(
    baseCalc.modifiedBase,
    countyPercent,
    cityPercent
  );
  allLineItems = allLineItems.concat(baseSplit);

  // Step 3: Penalty assessments
  const penalties = calculatePenalties(
    baseCalc.portionOf10,
    citationConfig.penalties
  );
  allLineItems = allLineItems.concat(penalties);

  // Step 4: Fixed assessments
  const assessments = calculateFixedAssessments(
    baseCalc.enhancedBase,
    citationConfig.assessments
  );
  allLineItems = allLineItems.concat(assessments);

  // Step 5: Optional items (like lab penalty)
  if (citationConfig.optionalItems) {
    citationConfig.optionalItems.forEach(optional => {
      if (optional.condition(inputs)) {
        allLineItems.push({
          code: optional.code,
          desc: optional.desc,
          entity: optional.entity,
          amount: optional.getAmount(inputs)
        });
      }
    });
  }

  // Step 6: Aggregate totals
  const totals = aggregateTotals(allLineItems);

  return {
    lineItems: allLineItems,
    totals,
    calculated: {
      enhancedBase: baseCalc.enhancedBase,
      portionOf10: baseCalc.portionOf10,
      reducedBase: baseCalc.modifiedBase
    }
  };
}
