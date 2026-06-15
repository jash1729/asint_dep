export const assetCloningSuiteTestData = {
	// Search terms used in the various sub-applications
	searchTerms: {
		asd: 'pala',
		rcm: 'Automation Test (DND)',
		asa: 'Automation_Test (DND)',
		rca: 'Automation test (DND)',
	},

	// Cloned-assessment descriptions
	cloneDescriptions: {
		asd: 'Automation 2',
		rcm: 'Clone of Automation Test (DND) Updated',
		rcmWithCheckbox: 'Clone of Automation Test (DND) Checkbox',
		asa: 'Automation_Test (DND) Updated',
		rca: 'Clone of Automation test (DND) Updated',
	},

	// Asset Cloning Templates — Create New Tasks dialog values
	cloningTemplate: {
		shortDescription: 'ASC e2e Automation',
		assessmentName: 'test',
		relevantFor: 'Equipment',
	},
} as const;
