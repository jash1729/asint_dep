export const fleetAssessmentTestData = {
    createMandatory: {
        description: 'Test Fleet Assessment - Automation Testing',
        className: 'Centrifugal Pump',
        failureDataProfile: 'Pump - Centrifugal V',
        templateName: 'Standard',
        operatingContext: 'Yes',
        createAsBaseline: false
    },
    planningData: {
        lastReviewDate: 'Dec 31, 2026',
        nextReviewDate: 'Jan 31, 2027',
        plannedReviewDate: 'Feb 28, 2027',
        nextTADate: 'Mar 31, 2027',
        secondTADate: 'Apr 30, 2027'
    },
    organizationalData: {
        planningPlant: 'AsInt Inc (1001)',
        maintenancePlant: 'AsInt Inc (1001)'
    },
    rolesAssignment: {
        roles: ['Facilitator', 'Reliability Engineer', 'Maintenance Supervisor'],
        user: 'Krishna Pala'
    },
    rolesUnassignment: {
        role: 'Maintenance Supervisor',
        user: 'Krishna Pala'
    },
    operatingContextAndCondition: {
        name: 'OCC1',
        characteristics: [
            { id: 'CENF_IMPELLER', value: 'OPEN' },
            { id: 'CENF_CASING', value: 'DIFFUSER' }
        ]
    },
    operatingContextAndConditionFlow2: {
        name: 'TestOCC1',
        characteristics: [
            // { id: 'CENF_IMPELLER', value: 'OPEN' },
            // { id: 'CENF_CASING', value: 'DIFFUSER' },
            { id: 'FLUID_CR', valueIndex: 2 }
        ]
    },
    maintainableItemFlow2: {
        searchText: 'Inspection Ports'
    },
    failureModeFlow2: {
        searchText: 'False alarms'
    },
    occRenameFlow2: {
        newName: 'TestOCC1_Renamed'
    },
    failureEffectFlow3: {
        itemText: 'Slow Down'
    },
    failureMechanismFlow3: {
        itemTexts: ['Loose Hub', 'Corrosion/Erosion']
    },
    failureMechanismRemoveFlow3: {
        itemText: 'Loose Hub'
    },
    causesFlow3: {
        itemTexts: ['Misaligned', 'EROSION']
    },
    causesRemoveFlow3: {
        itemText: 'EROSION'
    },
    strategyFlow3: {
        description: 'Test Strategy - Automation',
        longDescription: 'Long description for the automation-created strategy.',
        type: 'Improvement',
        inspectionType: 'CUI Inspection',
        inspectionStage: 'Scoping',
        startDate: 'Dec 31, 2026',
        dueDate: 'Jan 31, 2027'
    },
    strategyEditFlow3: {
        currentDescription: 'Test Strategy - Automation',
        newDescription: 'Test Strategy - Automation (Edited)'
    },
    createWithLongDescription: {
        description: 'Test Fleet Assessment with Long Description',
        className: 'Pump',
        templateName: 'Standard',
        operatingContext: 'Yes',
        longDescription: 'This is a comprehensive fleet assessment created for testing automation scenarios. It includes detailed information about the asset strategy analysis.',
        createAsBaseline: false
    },
    createWithoutOperatingContext: {
        description: 'Test Fleet Assessment without Operating Context',
        className: 'Centrifugal Pump',
        templateName: 'Standard',
        operatingContext: 'No',
        createAsBaseline: false
    },
    createAsBaselineTemplate: {
        description: 'Test Baseline Fleet Assessment',
        className: 'Pump',
        templateName: 'Standard',
        operatingContext: 'Yes',
        createAsBaseline: true,
        longDescription: 'This is a baseline template for fleet assessments.'
    }
} as const;
