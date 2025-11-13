import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CalculationProvider } from './context/CalculationContext';
import SharedLayout from './components/SharedLayout';

// Pages
import LandingPage from './pages/LandingPage';
import ManualEntryPage from './pages/ManualEntryPage';
import UploadPage from './pages/UploadPage';
import ExampleCitationsPage from './pages/ExampleCitationsPage';
import ResultsPage from './pages/ResultsPage';
import RiskExposureReportPage from './pages/RiskExposureReportPage';
import BudgetImpactReportPage from './pages/BudgetImpactReportPage';

function App() {
  return (
    <CalculationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="manual-entry" element={<ManualEntryPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="examples" element={<ExampleCitationsPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="risk-exposure" element={<RiskExposureReportPage />} />
            <Route path="budget-impact" element={<BudgetImpactReportPage />} />
          </Route>
        </Routes>
      </Router>
    </CalculationProvider>
  );
}

export default App;
