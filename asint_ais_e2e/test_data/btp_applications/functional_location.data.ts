export const funcLocTestData = {
    createMandatory: {
        funLocTemp : 2
    },
    generalInfoEdit: {
        objectType:'Tank',
        authorizationGroup: 'AUTH-01',
        startUpDate: 'Dec 31, 2024',
        inventoryNumber: '1000109-Test-Edited',
        longDescription: 'This is a long description for the functional Location.',
        acqValue:'500',
        acqCurr:'AED',
        assetManufacturer: 'Test Manufacturer',
        partNumber: 'PART-123',
        modelNumber: '2024',
        serialNumber: 'SN-456789',
        country:'AE',
        manufacturerSerialNum:'QDSQW324DJS',
        constructionYear:'2026',
        constructionMonth:'November',
        maintenancePlant:'0003',
        plantSection:'PLE',
        workCenter:'CH-IN-01',
        criticality:'C',
        sortField:'QASWER',
        planPlant:'1001',
        plannerGrp:'INS',
        catalogProfile:'100000002',
        companyCode:'ASNT',
        costCenter:'ASINTCC',
        bussinessArea:'ASIN'
    },
    headerInfoEdit: {
        funLocName:'Functional Location Header Test',
        funLocDesc: 'FuncLocTesting Descption',
        linearAsset: 'Linear Asset',
    },
    strucEdit: {
        superiorFunLoc:'Test',
        compInfoEquip: ['10000116', 'T-Shell2'],
        compInfoFunLoc: '',
    },
    assignmentEdit :{
        noOfFunLocTempToAssign : 3,
        noOfFunctionalClassesToAssign : 2,
        isAutoAssignClass: false
    },
    classificationMDA :{
        noOfCharacteristics: 2
    }
} as const;
