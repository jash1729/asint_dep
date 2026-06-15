export const safetydata = {
    createHAZOP: {
        hazopname : 'AutomationTestHAZOP',
        Hzdescription: 'This is a test hazop created by automation script',
        Hzfloc: 'ASIN-N001-PROD-P1001',
        hzstartdate : 'Mar 31,2026',
        hzenddate : 'Dec 31,2026',
        nodeNumName: 'AutomationNode',
        nodeSD : 'This Automation Node SD',
        nodeLD : 'This is Automation Node LD',
        parameter :'Temperature',
        guidedWord : 'Less',
        cause : 'AutomationCause',
        causeld : 'LD OF Cause',
        conse : 'AutomationConsequence',
        conseLD : 'LD of Consequence',
        impact1 : 'Environmental',
        impact2 : 'Financial',
        impact3 : 'Safety',
        severity1 : 'A',
        severity2 : 'B',
        severity3 : 'C',
        likelihood1 : 'I',
        likelihood2 : 'II',
        likelihood3 : 'III',
        barrierdes : 'BarrierAutomation',
        barriertype : 'Mitigative',
        barrierDiscipline : 'Civil',
        barrierRemarks : 'BarrierRemarks!@',
        objtypeRecomm : 'Functional',
        sdOfRecomme : 'Automation Recommendation for Hazop',
        LdofRecomme : 'Automation LD Of recomm for Hazop',
        recommSubType : 'Condition',



        }
   
} as const;
