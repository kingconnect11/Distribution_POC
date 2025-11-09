# California Citation Fine Distribution Calculator

A professional web application that automatically calculates California citation fine distributions across multiple citation types with 20+ statutory line items using Napa County multipliers.

## Overview

California courts must distribute citation fines according to complex state statutes (PC codes, GC codes, VC codes). Each citation can have 20+ distribution line items going to County, City, or State buckets. This application demonstrates automated calculation using a modular architecture that supports multiple citation types.

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel

## Features

### Current Implementation
- ✅ **Multi-citation type support** (DUI, Standard Distribution)
- ✅ **Modular calculation engine** - Easily add new citation types
- ✅ **Enhanced input form** with 15+ fields:
  - Case identification (Case Number, Base Fine)
  - Agency information (Arresting Agency, Sub Agency, Local)
  - Distribution configuration (County %, City %, GC76000)
  - Dates (Violation Date, Disposition Date)
  - Violation details (Type: Infraction/Misdemeanor/Felony)
- ✅ **Citation-specific conditional fields** (e.g., Lab Penalty for DUI)
- ✅ **Professional results table** with:
  - Code + Description column
  - Color-coded entity badges (County=Blue, City=Green, State=Purple)
  - Right-aligned currency amounts
  - Summary totals by entity
- ✅ **Real-time calculations** with instant results
- ✅ **Responsive design** - Works on desktop and mobile
- ✅ **Validated calculations** against production test cases

## Test Case Validation

The calculation engine has been validated against multiple test cases:

### DUI Test Case (Napa County CR 166313 Lawson)
**Input:**
- Citation Type: DUI (VC 23152/23153)
- Base Fine: $500
- County: 100%
- City: 0%

**Expected Output (Napa County):**
- County Total: $1,215.00
- City Total: $0.00
- State Total: $1,214.00
- **Grand Total: $2,429.00**

**Result:** ✅ VALIDATION PASSED!

### Standard Distribution Test Case
**Input:**
- Citation Type: Standard Distribution
- Base Fine: $500
- County: 100%
- City: 0%

**Expected Behavior:**
- No base reductions (unlike DUI which has $120 reduction)
- Reduced Base: $500 (vs DUI's $380)
- Grand Total: $2,194.00 (lower than DUI due to no DUI-specific assessments)

**Result:** ✅ VALIDATION PASSED!

## Installation & Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:5173
```

## Running Validation Tests

```bash
# Run comprehensive calculation validation
node src/testCalculations.js
```

This will validate the calculation engine against both DUI and Standard Distribution test cases and display detailed results including line-by-line breakdowns.

## Build for Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts to deploy. Vercel will automatically detect the Vite configuration.

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## Project Structure

```
dui-calculator/
├── src/
│   ├── App.jsx                 # Main React component with enhanced form
│   ├── calculationEngine.js    # Modular calculation functions
│   ├── citationConfigs.js      # Citation type configurations
│   ├── calculator.js           # Legacy DUI calculator (deprecated)
│   ├── testData.js             # Test case data and multipliers
│   ├── testCalculations.js     # Validation test suite
│   ├── testCalculator.js       # Legacy test (deprecated)
│   ├── index.css               # Tailwind directives
│   └── main.jsx                # React entry point
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

### Key Files

- **calculationEngine.js**: Modular calculation functions (calculateBase, splitBase, calculatePenalties, etc.)
- **citationConfigs.js**: Citation type configurations (DUI_CONFIG, STANDARD_CONFIG, etc.)
- **App.jsx**: Enhanced UI with citation type selector and comprehensive form fields

## Calculation Logic

The modular calculation engine follows California statute requirements:

### General Flow (All Citation Types)
1. **Enhanced Base**: Base fine ± citation-specific modifications
2. **Portion of 10**: Math.ceil(enhancedBase / 10)
3. **Base Modifications**: Citation-type-specific (REDUCE, ENHANCE, or NONE)
4. **County/City Split**: Applied to modified base
5. **Penalty Assessments**: Multiplied by portion of 10
6. **Fixed Assessments**: Fixed amounts or percentages
7. **Optional Items**: Conditional based on citation type
8. **Totals**: Aggregated by entity (County, City, State)

### Citation-Specific Examples

#### DUI (VC 23152/23153) - REDUCE Base
**Base Reductions** (applied FIRST):
- PC 1463.14(a): $50 → COUNTY (DUI Lab Spec Acct)
- PC 1463.16: $50 → COUNTY (DUI Prog Spec Acct)
- PC 1463.18: $20 → STATE (DUI Indemnity Alloc)
- **Total Reduction: $120**

**Additional Assessments**:
- PC 1463.25: $50 → COUNTY (Alcohol Edu Penalty)
- VC 23649(a): $35 → COUNTY (Alc & Drug Prob Assmnt)
- PC 1202.4(b): $150 → STATE (State Restitution Fine)

#### Standard Distribution - NO Base Modifications
- No base reductions
- Modified base = Enhanced base
- Standard penalties and assessments only

### Adding New Citation Types

To add a new citation type, create a configuration object in `citationConfigs.js`:

```javascript
export const NEW_TYPE_CONFIG = {
  name: 'Citation Type Name',
  code: 'TYPE_CODE',
  modificationType: 'REDUCE' | 'ENHANCE' | 'NONE',
  modifications: [
    { code: 'PC XXXX', desc: 'Description', entity: 'COUNTY', amount: 50 }
  ],
  penalties: COMMON_PENALTIES,
  assessments: [...COMMON_ASSESSMENTS, ...typeSpecificAssessments],
  optionalItems: []
};
```

Then register it in `CITATION_TYPES` object. No changes to the calculation engine required!

## Usage

1. **Select Citation Type**: Choose from dropdown (DUI, Standard Distribution)
2. **Enter Case Information**:
   - Case Number (optional)
   - Base Fine amount
   - Arresting Agency details
   - County/City distribution percentage
   - Violation and disposition dates
   - Violation type (Infraction/Misdemeanor/Felony)
3. **Citation-Specific Fields**: If applicable (e.g., Lab Penalty for DUI)
4. **Click "Calculate Distribution"**
5. **View Results**:
   - Enhanced Base, Portion of 10, Reduced Base
   - Detailed line-by-line distribution table
   - Color-coded entity badges
   - Summary totals by entity
   - Grand total

## Future Enhancements

### Phase 3 - Additional Citation Types
- Reckless Driving (VC 23013/23104) - 2 base reductions
- Health & Safety - BASE ENHANCEMENT pattern
- Railroad Violations - 30% special allocation
- Red Light Violations - Special allocation
- Child Seat Violations - 3-way base split

### Phase 4 - Advanced Features
- Multiple county configurations (Sacramento, Solano, etc.)
- Variance tracking (Expected vs Court Distribution)
- PDF/Excel export functionality
- Multiple case management
- Case history database
- User authentication
- Print-friendly reports

### Phase 5 - Production Features
- Support for prior convictions
- Multi-count citations (Count 2, Count 3)
- Batch processing
- Audit trail
- Court integration APIs

## License

MIT

## Contact

For questions or feedback about this proof-of-concept, please contact the development team.
