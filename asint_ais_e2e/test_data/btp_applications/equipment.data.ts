export const equipmentTestData = {
    createMandatory: {
        equipmentName: '2138992-EQUIP-AUTO',
        description: 'This is a test equipment created by automation script',
        equipmentTemplate: 'Test for Equipment',
        parentAsset: '10000112'
    },
    generalInfoEdit: {
        inventoryNumber: '1000109-Test-Edited',
        componentType: 'Component Type 1',
        activationState: 'Active',
        authorizationGroup: 'AUTH-01',
        startUpDate: 'Dec 31, 2024',
        deactivationDate: 'Dec 31, 2025',
        componentRegulatoryId: 'REG-100',
        comments: 'Updated via automation test',
        longDescription: 'This is a long description for the equipment.',
        acquisitionValue: 5000,
        assetManufacturer: 'Test Manufacturer',
        partNumber: 'PART-123',
        modelNumber: 2024,
        serialNumber: 'SN-456789'
    },
    structureInfoEdit: {
        subordinateEquipment: '10000113',
        componentEquipment: { 1 :'10000116', 2: '10000579'}
    },
    assignmentSection: {
        equipmentTemplate: ['OBJT.43565', 'OBJT.43560'],
        equipmentClasses: ['Class A', 'Class B'],
        noOfEquipmentTemplatesToAssign: 2,
        isAutoAssignClass: true,
        noOfEquipmentClassesToAssign: 2,
        noOfCharacteristicsToAssign: 2,
    }

} as const;