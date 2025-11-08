# DUI Fine Distribution Calculator

A proof-of-concept web application that automatically calculates California DUI fine distributions across 20+ statutory line items using Napa County multipliers.

## Overview

California courts must distribute DUI citation fines according to complex state statutes (PC codes, GC codes, VC codes). Each citation can have 20+ distribution line items going to County, City, or State buckets. This POC demonstrates automated calculation to replace error-prone manual spreadsheet calculations.

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Features

- ✅ Automated DUI fine distribution calculation
- ✅ Support for 24 distribution line items
- ✅ County/City split configuration
- ✅ Optional lab penalty support
- ✅ Real-time calculation results
- ✅ Professional UI with color-coded entities
- ✅ Currency formatting
- ✅ Responsive design
- ✅ PDF export button (visual placeholder)

## Test Case Validation

The calculation engine has been validated against Test Case #1:

**Input:**
- Base Fine: $500
- County: 100%
- City: 0%

**Expected Output (Napa County):**
- County Total: $1,215.00
- City Total: $0.00
- State Total: $1,214.00
- **Grand Total: $2,429.00**

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
# Run calculation validation test
node src/testCalculator.js
```

This will validate the calculation engine against Test Case #1 and display detailed results.

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
│   ├── App.jsx              # Main React component with form and results
│   ├── calculator.js        # Core calculation engine
│   ├── testData.js          # Test case data and multipliers
│   ├── testCalculator.js    # Validation test script
│   ├── index.css            # Tailwind directives
│   └── main.jsx             # React entry point
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## Calculation Logic

The calculator follows California statute requirements:

1. **Enhanced Base**: Base fine (priors ignored for POC)
2. **Portion of 10**: Math.ceil(enhancedBase / 10)
3. **Base Reductions** (DUI-specific, applied FIRST):
   - PC 1463.14(a): $50 → COUNTY
   - PC 1463.16: $50 → COUNTY
   - PC 1463.18: $20 → STATE
4. **County/City Split**: Applied to reduced base
5. **Penalty Assessments**: Multiplied by portion of 10
6. **Additional Assessments**: Fixed amounts or percentages
7. **Totals**: Aggregated by entity (County, City, State)

## Usage

1. Open the deployed application
2. Enter base fine amount (default: $500)
3. Set County % (City % auto-calculates)
4. Optionally enable lab penalty
5. Click "Calculate Distribution"
6. View detailed distribution table and totals

## Future Enhancements

- Implement working PDF export
- Add multiple county configurations
- Support for prior convictions
- Database integration for case history
- Multi-case comparison
- User authentication

## License

MIT

## Contact

For questions or feedback about this proof-of-concept, please contact the development team.
