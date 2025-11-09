// Pre-mapped citation data for demo OCR/upload functionality
export const sampleCitations = {
  // DUI Citation #1 - Napa County CR 166313 (High Fine)
  'dui-napa-cr166313.pdf': {
    fileName: 'dui-napa-cr166313.pdf',
    displayName: 'Napa County DUI - CR 166313 Lawson',
    citationType: 'DUI',
    thumbnail: null,
    extractedData: {
      caseNumber: 'CR 166313',
      baseFine: 500,
      arrestingAgency: 'CHP',
      subAgency: 'Napa Area',
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

  // DUI Citation #2 - Napa County CR180521 (Standard Fine)
  'dui-sacramento-demo.pdf': {
    fileName: 'dui-sacramento-demo.pdf',
    displayName: 'Sacramento DUI - CR 180521 Imbach',
    citationType: 'DUI',
    thumbnail: null,
    extractedData: {
      caseNumber: 'CR 180521',
      baseFine: 390,
      arrestingAgency: 'Sheriff',
      subAgency: '',
      agencyLocal: 'County',
      countyPercent: 100,
      gc76000: 0,
      violationDate: '2015-08-22',
      dispDate: '2015-09-15',
      violationType: 'Misdemeanor',
      hasLabPenalty: false,
      labPenaltyAmount: 0
    }
  },

  // Domestic Violence Citation - Mills CR164294
  'dv-mills-cr164294.pdf': {
    fileName: 'dv-mills-cr164294.pdf',
    displayName: 'Domestic Violence - CR164294 Mills',
    citationType: 'Domestic Violence',
    thumbnail: null,
    extractedData: {
      caseNumber: 'CR164294',
      baseFine: 400,
      arrestingAgency: 'PD',
      subAgency: 'Napa Police',
      agencyLocal: 'City',
      countyPercent: 100,
      gc76000: 0,
      violationDate: '2012-11-30',
      dispDate: '2013-01-15',
      violationType: 'Felony',
      hasLabPenalty: false,
      labPenaltyAmount: 0,
      // DV-specific fields
      dvFee: 400,
      probationSupervision: 435,
      restitutionFine: 300
    }
  },

  // Uninsured Motorist Citation (upload demo only)
  'uninsured-mo514211.pdf': {
    fileName: 'uninsured-mo514211.pdf',
    displayName: 'Uninsured Motorist - MO514211',
    citationType: 'DUI', // Using DUI calculation for now
    thumbnail: null,
    extractedData: {
      caseNumber: 'MO514211',
      baseFine: 500,
      arrestingAgency: 'CHP',
      subAgency: '',
      agencyLocal: 'County',
      countyPercent: 80,
      gc76000: 0,
      violationDate: '2016-01-24',
      dispDate: '2016-02-15',
      violationType: 'Infraction',
      hasLabPenalty: false,
      labPenaltyAmount: 0
    }
  },

  // Traffic Citation (upload demo only)
  'traffic-speeding-demo.pdf': {
    fileName: 'traffic-speeding-demo.pdf',
    displayName: 'Speeding Violation - Highway 101',
    citationType: 'DUI', // Using DUI calculation for now
    thumbnail: null,
    extractedData: {
      caseNumber: 'T-294851',
      baseFine: 238,
      arrestingAgency: 'CHP',
      subAgency: 'Highway Patrol',
      agencyLocal: 'County',
      countyPercent: 100,
      gc76000: 0,
      violationDate: '2023-10-15',
      dispDate: '2023-11-20',
      violationType: 'Infraction',
      hasLabPenalty: false,
      labPenaltyAmount: 0
    }
  }
};

// Helper function to identify uploaded file
export const identifyCitation = (file) => {
  if (!file) return null;

  const fileName = file.name.toLowerCase();

  // Direct match
  if (sampleCitations[fileName]) {
    return sampleCitations[fileName];
  }

  // Fuzzy match - check if filename contains key parts
  const keys = Object.keys(sampleCitations);
  for (const key of keys) {
    // Extract the base name without extension
    const baseName = key.split('.')[0];
    const searchTerm = baseName.substring(0, Math.min(8, baseName.length));

    if (fileName.includes(searchTerm)) {
      return sampleCitations[key];
    }
  }

  // Return null if no match (will show error in UI)
  return null;
};

// Get random sample for demo purposes
export const getRandomSample = (citationType = null) => {
  const samples = Object.values(sampleCitations);

  if (citationType) {
    const filtered = samples.filter(s => s.citationType === citationType);
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }

  return samples[Math.floor(Math.random() * samples.length)];
};

// Get all samples for a specific citation type
export const getSamplesByCitationType = (citationType) => {
  return Object.values(sampleCitations).filter(s => s.citationType === citationType);
};

// Get list of all sample file names for display
export const getAllSampleNames = () => {
  return Object.values(sampleCitations).map(s => ({
    fileName: s.fileName,
    displayName: s.displayName,
    citationType: s.citationType
  }));
};
