import { calculateDUIDistribution, validateCalculation } from './calculator.js';
import { TEST_CASE_1, NAPA_MULTIPLIERS } from './testData.js';

// Test the calculation engine
console.log('='.repeat(80));
console.log('DUI FINE DISTRIBUTION CALCULATOR - VALIDATION TEST');
console.log('='.repeat(80));

const result = calculateDUIDistribution(TEST_CASE_1.inputs, NAPA_MULTIPLIERS);

console.log('\nINPUTS:');
console.log(`  Base Fine: $${TEST_CASE_1.inputs.baseFine}`);
console.log(`  County %: ${TEST_CASE_1.inputs.countyPercent}%`);
console.log(`  City %: ${TEST_CASE_1.inputs.cityPercent}%`);

console.log('\nCALCULATED VALUES:');
console.log(`  Enhanced Base: $${result.calculated.enhancedBase}`);
console.log(`  Portion of 10: ${result.calculated.portionOf10}`);
console.log(`  Reduced Base: $${result.calculated.reducedBase}`);

console.log('\nDISTRIBUTION LINE ITEMS:');
console.log('-'.repeat(80));
result.lineItems.forEach((item, index) => {
  const amount = item.amount.toFixed(2).padStart(10);
  const entity = item.entity.padEnd(7);
  const code = item.code.padEnd(20);
  console.log(`${(index + 1).toString().padStart(2)}. ${code} ${entity} $${amount} - ${item.desc}`);
});

console.log('\n' + '='.repeat(80));
console.log('TOTALS:');
console.log('-'.repeat(80));
console.log(`County:      $${result.totals.county.toFixed(2).padStart(10)}`);
console.log(`City:        $${result.totals.city.toFixed(2).padStart(10)}`);
console.log(`State:       $${result.totals.state.toFixed(2).padStart(10)}`);
console.log('-'.repeat(80));
console.log(`GRAND TOTAL: $${result.totals.grandTotal.toFixed(2).padStart(10)}`);
console.log('='.repeat(80));

console.log('\nEXPECTED TOTALS (Test Case #1):');
console.log('-'.repeat(80));
console.log(`County:      $${TEST_CASE_1.expectedTotals.county.toFixed(2).padStart(10)}`);
console.log(`City:        $${TEST_CASE_1.expectedTotals.city.toFixed(2).padStart(10)}`);
console.log(`State:       $${TEST_CASE_1.expectedTotals.state.toFixed(2).padStart(10)}`);
console.log('-'.repeat(80));
console.log(`GRAND TOTAL: $${TEST_CASE_1.expectedTotals.grandTotal.toFixed(2).padStart(10)}`);
console.log('='.repeat(80));

const validation = validateCalculation(result.totals, TEST_CASE_1.expectedTotals);

console.log('\nVALIDATION RESULTS:');
console.log('-'.repeat(80));
console.log(`County Match:  ${validation.countyMatch ? '✅ PASS' : '❌ FAIL'} (diff: ${validation.differences.county.toFixed(2)})`);
console.log(`City Match:    ${validation.cityMatch ? '✅ PASS' : '❌ FAIL'} (diff: ${validation.differences.city.toFixed(2)})`);
console.log(`State Match:   ${validation.stateMatch ? '✅ PASS' : '❌ FAIL'} (diff: ${validation.differences.state.toFixed(2)})`);
console.log(`Total Match:   ${validation.totalMatch ? '✅ PASS' : '❌ FAIL'} (diff: ${validation.differences.grandTotal.toFixed(2)})`);
console.log('-'.repeat(80));
console.log(`OVERALL:       ${validation.passed ? '✅ VALIDATION PASSED!' : '❌ VALIDATION FAILED!'}`);
console.log('='.repeat(80));
