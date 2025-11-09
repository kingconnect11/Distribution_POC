/**
 * Test script to validate DUI and Standard Distribution calculations
 */

import { calculateDistribution } from './calculationEngine.js';
import { CITATION_TYPES } from './citationConfigs.js';

// Test Case 1: DUI with $500 base (from Napa test data)
const duiTest = {
  inputs: {
    baseFine: 500,
    countyPercent: 100,
    cityPercent: 0,
    hasLabPenalty: false,
    labPenaltyAmount: 0
  },
  expectedTotals: {
    county: 1215.00,
    city: 0.00,
    state: 1214.00,
    grandTotal: 2429.00
  }
};

// Test Case 2: Standard Distribution with $500 base
// Expected: Same as DUI but WITHOUT the $120 in base reductions
// So base split will be $500 instead of $380
const standardTest = {
  inputs: {
    baseFine: 500,
    countyPercent: 100,
    cityPercent: 0,
    hasLabPenalty: false,
    labPenaltyAmount: 0
  },
  // We expect higher total because no base reduction
  expectedBehavior: {
    reducedBase: 500,  // No reduction for standard
    portionOf10: 50
  }
};

console.log('='.repeat(80));
console.log('TESTING DUI CALCULATION');
console.log('='.repeat(80));

const duiResult = calculateDistribution(duiTest.inputs, CITATION_TYPES.DUI);

console.log('\nCalculated Values:');
console.log(`  Enhanced Base: $${duiResult.calculated.enhancedBase}`);
console.log(`  Portion of 10: ${duiResult.calculated.portionOf10}`);
console.log(`  Reduced Base: $${duiResult.calculated.reducedBase}`);

console.log('\nTotals:');
console.log(`  County: $${duiResult.totals.county.toFixed(2)} (Expected: $${duiTest.expectedTotals.county.toFixed(2)})`);
console.log(`  City: $${duiResult.totals.city.toFixed(2)} (Expected: $${duiTest.expectedTotals.city.toFixed(2)})`);
console.log(`  State: $${duiResult.totals.state.toFixed(2)} (Expected: $${duiTest.expectedTotals.state.toFixed(2)})`);
console.log(`  Grand Total: $${duiResult.totals.grandTotal.toFixed(2)} (Expected: $${duiTest.expectedTotals.grandTotal.toFixed(2)})`);

// Validation
const tolerance = 0.01;
const duiPassed =
  Math.abs(duiResult.totals.county - duiTest.expectedTotals.county) < tolerance &&
  Math.abs(duiResult.totals.city - duiTest.expectedTotals.city) < tolerance &&
  Math.abs(duiResult.totals.state - duiTest.expectedTotals.state) < tolerance &&
  Math.abs(duiResult.totals.grandTotal - duiTest.expectedTotals.grandTotal) < tolerance;

console.log('\nDUI Test Result:', duiPassed ? '✓ PASSED' : '✗ FAILED');

console.log('\n' + '='.repeat(80));
console.log('TESTING STANDARD DISTRIBUTION CALCULATION');
console.log('='.repeat(80));

const standardResult = calculateDistribution(standardTest.inputs, CITATION_TYPES.STANDARD);

console.log('\nCalculated Values:');
console.log(`  Enhanced Base: $${standardResult.calculated.enhancedBase}`);
console.log(`  Portion of 10: ${standardResult.calculated.portionOf10}`);
console.log(`  Reduced Base: $${standardResult.calculated.reducedBase}`);

console.log('\nTotals:');
console.log(`  County: $${standardResult.totals.county.toFixed(2)}`);
console.log(`  City: $${standardResult.totals.city.toFixed(2)}`);
console.log(`  State: $${standardResult.totals.state.toFixed(2)}`);
console.log(`  Grand Total: $${standardResult.totals.grandTotal.toFixed(2)}`);

console.log('\nLine Items:');
standardResult.lineItems.forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.code} - ${item.desc} (${item.entity}): $${item.amount.toFixed(2)}`);
});

// Validation
const standardPassed =
  standardResult.calculated.reducedBase === standardTest.expectedBehavior.reducedBase &&
  standardResult.calculated.portionOf10 === standardTest.expectedBehavior.portionOf10;

console.log('\nStandard Distribution Test Result:', standardPassed ? '✓ PASSED' : '✗ FAILED');

console.log('\n' + '='.repeat(80));
console.log('COMPARISON: DUI vs STANDARD with same $500 base');
console.log('='.repeat(80));
console.log(`DUI Reduced Base: $${duiResult.calculated.reducedBase} (after $120 reduction)`);
console.log(`Standard Reduced Base: $${standardResult.calculated.reducedBase} (no reduction)`);
console.log(`Difference in Grand Total: $${(standardResult.totals.grandTotal - duiResult.totals.grandTotal).toFixed(2)}`);
console.log('This makes sense because Standard has $120 more in the base distribution!');

console.log('\n' + '='.repeat(80));
console.log('OVERALL TEST RESULTS');
console.log('='.repeat(80));
console.log(`DUI Test: ${duiPassed ? '✓ PASSED' : '✗ FAILED'}`);
console.log(`Standard Test: ${standardPassed ? '✓ PASSED' : '✗ FAILED'}`);
console.log(`Overall: ${duiPassed && standardPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
console.log('='.repeat(80));
