#Feature: Charge Incident Fixes 2018
#
#  Background:
#    Given I am on the home page
#    And I enter training engineer ID "0000991"
#    And I click the select button Tab
#    And User Settings - Gas - I select Working Area "Gas Services" Patch Area "11P4" and Region "1 - Scotland"
#    And I select Ready for work
#    And I wait for Job Details to load and displayed "Your work for today: Customers 15  Activities 21"
#
#  @chargesIncidents
#  Scenario: Complete Job 1351525001 scenario 1
#    And I click on first customer info on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click "Activities" button
#    And Activities - I select task "HTG UP'GRD"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And Appliance Booking - Is the job part L/J reportable? - I select "Yes"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliance Details - I click the first appliance
#    And Appliance Details - Serial Number - I type "12345"
#    And Appliance Details - I select Flue Type the first option
#    And Appliance Details - I click BG Installation - NO
#    And I click appliance Reading Tab
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And I click Parts button
#    And I click the Warranty Return chevron
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And Parts Basket - I select "search for part manually"
#    And Parts Basket - I enter "555123" stock reference ID
#    And Parts Basket - I click Search for part
#    And Parts Basket - I click Add to order list
#    And Parts Basket - I set quantity to 1
#    And 555051 - Gasket - Cover Plate - I checked Van Stock
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057445,    premises: {      id: L271309,      address: {},      contact: {        id: 022201826,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        jobPartLJReportable: true,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1351525001002,        newWork: false,        jobType: HU,        applianceType: WH,        chargeType: ALP2API,        sequence: 2,        applianceId: 202224165,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 2838,            quantityCharged: 1,            quantityUsed: 1,            description: Timer Mechanical EMT 2 TOTE,            stockReferenceId: 555123          },          {            charge: 321,            quantityCharged: 2,            quantityUsed: 2,            description: 22mm Speedfit Tank Connector TOTE,            stockReferenceId: F00006          }        ],        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 1,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 7821,        vatAmount: 15642,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 4341      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: WH,      id: 202224165,      flueType: V,      serialId: 12345,      bgInstallationIndicator: 0,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"
#    And I click Customer Details Tab
#
#  @chargesIncidents
#  Scenario: Complete Job 1389425001, scenario 2
#    And Job List - I click on Customer Information "Job No: 1389425001" on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click Activities tab
#    And Activities - I select task "HTG UP'GRD"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And Appliance Booking - Is the job part L/J reportable? - I select "Yes"
#    And I click Parts button
#    And Tabs - I click Activities tab
#    And Activities - I select task "ENSAV UPGD"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliance Details - I click the first appliance
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And Gas Safety - click next task
#    And Appliances - I click Appliance Detail Tab
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And I click Parts button
#    And I click the Warranty Return chevron
#    And I select "Yes" for Is this part going to be returned as a Warranty claim
#    And I set Quantity to claim or return to 1
#    And I click Same ID as Original
#    And Reason for claim - I type "aaaaaaaaaaaaaaa"
#    And I click the 1 index Warranty Return chevron
#    And Second Index - I click Yes for warranty
#    And Second Index - I click Same ID as Original
#    And Second Index - Reason for claim - I type "This is a test"
#    And Tabs - I click Activities tab
#    And Tabs - I click "Parts" button
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057445,    premises: {      id: L271309,      address: {},      contact: {        id: 022201826,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        jobPartLJReportable: true,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1351525001002,        newWork: false,        jobType: HU,        applianceType: WH,        chargeType: ALP2API,        sequence: 2,        applianceId: 202224165,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 2838,            quantityCharged: 1,            quantityUsed: 1,            description: Timer Mechanical EMT 2 TOTE,            stockReferenceId: 555123          },          {            charge: 321,            quantityCharged: 2,            quantityUsed: 2,            description: 22mm Speedfit Tank Connector TOTE,            stockReferenceId: F00006          }        ],        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 1,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 7821,        vatAmount: 15642,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 4341      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: WH,      id: 202224165,      flueType: V,      serialId: 12345,      bgInstallationIndicator: 0,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"
#
#  @ignore
#  Scenario: Complete Job 1332525001, scenario 3
#    And Job List - I click on Customer Information "Job No: 1332525001" on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click "Activities" button
#    And Activities - I select task "RHC CHARGE - Central Heating Boiler"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "CLAIM REJ-NOT COVERD"
#    And Appliance Booking - Activity Type - I select "ASV + T/C ADVICE"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "1111111111"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And I click Parts button
#    And Tabs - I click Activities tab
#    And Activities - I select task "ONLINE COD"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "APPLIANCE"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliance Details - I click the first appliance
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And Gas Safety - click next task
#    And Tabs - I click "Parts" button
#    And I click the Not used return chevron
#    And I set Quantity to claim or return to 2
#    And I click the first not used return reason
#    And I click the 2 index Warranty Return chevron
#    And Parts Basket - Second - I select "No" for Is this part going to be returned as a Warranty claim
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And Parts Basket - I select "search for part manually"
#    And Parts Basket - I enter "555123" stock reference ID
#    And Parts Basket - I click Search for part
#    And Parts Basket - I click Add to order list
#    And 555123 - Gasket - Cover Plate - I checked Van Stock
#    And Tabs - I click Activities tab
#    And Tabs - I click "Parts" button
#    And Parts Basket - Associated Activity - I select "RHC CHARGE"
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057456,    premises: {      id: L271180,      address: {},      contact: {        id: 022201677,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1332525001002,        newWork: false,        jobType: RI,        applianceType: CHB,        chargeType: SLFNONE,        sequence: 2,        applianceId: 202223992,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE 1111111111,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: ATC,        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 0,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        partsNotUsed: [          {            fieldComponentVisitSeq: 2,            locationCode: ,            reasonCode: WG,            quantityNotUsed: 2,            requisitionNumber: ,            stockReferenceId: E21975          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 18952,        vatAmount: 9476,        vatCode: F,        subsequentJobIndicator: true,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 18952      },      {        id: 1332525001003,        newWork: false,        jobType: OL,        applianceType: COD,        chargeType: CPONONE,        sequence: 2,        applianceId: 202224166,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 321,            quantityCharged: 2,            quantityUsed: 2,            description: 22mm Speedfit Tank Connector TOTE,            stockReferenceId: F00006          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 642,        vatAmount: 1284,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 0      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: CHB,      id: 202223992,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"
#
#  @ignore
#  Scenario: Complete Job 1362525001, scenario 4
#    And Job List - I click on Customer Information "Job No: 1362525001" on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click "Activities" button
#    And Activities - I select task "PRTS & LAB - Warn Air Unit with Water"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliance Details - I click the first appliance
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And Tabs - I click "Parts" button
#    And I click the Warranty Return chevron
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And Parts Basket - I select "search for part manually"
#    And Parts Basket - I enter "555123" stock reference ID
#    And Parts Basket - I click Search for part
#    And Parts Basket - I click Add to order list
#    And 555123 - Gasket - Cover Plate - I checked Van Stock
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057465,    premises: {      id: L271308,      address: {},      contact: {        id: 022201825,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1362525001001,        newWork: false,        jobType: PL,        applianceType: WAW,        chargeType: ALPNONE,        sequence: 2,        applianceId: 202224161,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 2838,            quantityCharged: 1,            quantityUsed: 1,            description: Timer Mechanical EMT 2 TOTE,            stockReferenceId: 555123          },          {            charge: 1000,            quantityCharged: 2,            quantityUsed: 2,            description: assdsdsd,            stockReferenceId: E28102          }        ],        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 1,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 11561,        vatAmount: 23122,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 6723      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: WAW,      id: 202224161,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"
##    And I click Customer Details Tab
#
# @ignore
#  Scenario: Complete Job 1342525001 scenario 5
#    And Job List - I click on Customer Information "Job No: 1342525001" on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click "Activities" button
#    And Activities - I select task "HTG UP'GRD - Warn Air Unit with Water"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And Appliance Booking - Is the job part L/J reportable? - I select "Yes"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliances - I click the first appliance on the list " - MCCLARY SD 25/30 WH WITH ASCOT 303"
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And Tabs - I click "Appliances" button
#    And Appliances - I click the first appliance on the list " - Test Dess"
#    And Appliance Details - I select Flue Type the first option
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And I click Parts button
#    And I click the Warranty Return chevron
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click the Not used return chevron
#    And I set Quantity to claim or return to 1
#    And I click the first not used return reason
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And Parts Basket - I select "search for part manually"
#    And Parts Basket - I enter "555123" stock reference ID
#    And Parts Basket - I click Search for part
#    And Parts Basket - I click Add to order list
#    And 555123 - Gasket - Cover Plate - I checked Van Stock
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057460,    premises: {      id: L271307,      address: {},      contact: {        id: 022201824,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        jobPartLJReportable: true,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1342525001002,        newWork: false,        jobType: HU,        applianceType: WAW,        chargeType: ALPBNI2,        sequence: 3,        applianceId: 202224154,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 2838,            quantityCharged: 1,            quantityUsed: 1,            description: Timer Mechanical EMT 2 TOTE,            stockReferenceId: 555123          }        ],        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 1,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        partsNotUsed: [          {            fieldComponentVisitSeq: 3,            locationCode: ,            reasonCode: WG,            quantityNotUsed: 1,            requisitionNumber: ,            stockReferenceId: E66527          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 5732,        vatAmount: 11464,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 2894      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: WAW,      id: 202224154,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    },    {      updateMarker: A,      applianceType: WAC,      id: 202224155,      flueType: V,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"
##    And I click Customer Details Tab
#
#  @chargesIncidents
#  Scenario: Complete Job 1301525001 scenario 6
#    And Job List - I click on Customer Information "Job No: 1301525001" on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click "Activities" button
#    And Activities - I select task "IQ BLR IB"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And I click Parts button
#    And Tabs - I click Activities tab
#    And Activities - I select task "HTG UP'GRD"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And Appliance Booking - Is the job part L/J reportable? - I select "Yes"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliances - I click the first appliance on the list "CHB"
#    And Appliance Details - I select System Type 2 the first option
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And Tabs - I click "Parts" button
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And Parts Basket - I select "search for part manually"
#    And Parts Basket - I enter "555123" stock reference ID
#    And Parts Basket - I click Search for part
#    And Parts Basket - I click Add to order list
#    And Parts Basket - Associated Activity - I select "HTG UP'GRD"
#    And Parts Basket - I set quantity to 1
#    And 555051 - Gasket - Cover Plate - I checked Van Stock
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I wait for Job Details to load and displayed "Your work for today: Customers 0  Activities 0"
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057445,    premises: {      id: L271309,      address: {},      contact: {        id: 022201826,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        jobPartLJReportable: true,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1351525001002,        newWork: false,        jobType: HU,        applianceType: WH,        chargeType: ALP2API,        sequence: 2,        applianceId: 202224165,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 2838,            quantityCharged: 1,            quantityUsed: 1,            description: Timer Mechanical EMT 2 TOTE,            stockReferenceId: 555123          },          {            charge: 321,            quantityCharged: 2,            quantityUsed: 2,            description: 22mm Speedfit Tank Connector TOTE,            stockReferenceId: F00006          }        ],        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 1,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 7821,        vatAmount: 15642,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 4341      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: WH,      id: 202224165,      flueType: V,      serialId: 12345,      bgInstallationIndicator: 0,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"
#
#  @chargesIncidents
#  Scenario: Complete Job 1359425001 scenario 7
#    And Job List - I click on Customer Information "Job No: 1359425001" on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click "Activities" button
#    And Activities - I select task "PRTS & LAB"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliances - I click the first appliance on the list "WAW"
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And Tabs - I click "Parts" button
#    And I click the Warranty Return chevron
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click the Not used return chevron
#    And I set Quantity to claim or return to 1
#    And I click the first not used return reason
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And Parts Basket - I select "search for part manually"
#    And Parts Basket - I enter "555123" stock reference ID
#    And Parts Basket - I click Search for part
#    And Parts Basket - I click Add to order list
#    And I set Quantity to claim or return to 1
#    And 555123 - Gasket - Cover Plate - I checked Van Stock
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057445,    premises: {      id: L271309,      address: {},      contact: {        id: 022201826,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        jobPartLJReportable: true,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1351525001002,        newWork: false,        jobType: HU,        applianceType: WH,        chargeType: ALP2API,        sequence: 2,        applianceId: 202224165,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 2838,            quantityCharged: 1,            quantityUsed: 1,            description: Timer Mechanical EMT 2 TOTE,            stockReferenceId: 555123          },          {            charge: 321,            quantityCharged: 2,            quantityUsed: 2,            description: 22mm Speedfit Tank Connector TOTE,            stockReferenceId: F00006          }        ],        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 1,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 7821,        vatAmount: 15642,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 4341      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: WH,      id: 202224165,      flueType: V,      serialId: 12345,      bgInstallationIndicator: 0,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"
#
#  @ignore
#  Scenario: Complete Job 1321525001 scenario 8
#    And Job List - I click on Customer Information "Job No: 1321525001" on the Job List
#    And Job List - I click on the Go en-route button and click Arrive Label
#    When I click Got It on risks page
#    And Tabs - I click "Activities" button
#    And Activities - I select task "ENSAV UPGD"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And I click Customer Details Tab
#    And Job List - I click on Customer Information "Job No: 1321525001" on the Job List
#    And Tabs - I click "Activities" button
#    And Activities - I select task "ONLINE COD"
#    And I select the Activity Status to "COMPLETE"
#    And Appliance Booking - Worked On - I click "Appliance"
#    And Appliance Booking - Activity Type - I select "COURTESY PHONE CALL"
#    And Appliance Booking - CHIRP Outcome Code - I select "54CODE - Radical Working"
#    And Appliance Booking - Activity Report - I select "aaaaaaaaaa"
#    And Appliance Booking - Customer Advice - I click "Not required"
#    And I click Gas Property Safety button
#    And Landlord Safety Certificate - ELI Readings Ohms - I select Less Than one
#    And Landlord Safety Certificate - Safety Advice Notice Left - I select "No"
#    And Landlord Safety Certificate - Gas Installation Tightness Test Done - I select "No"
#    And Landlord Safety Certificate - Gas meter and Installation satisfactory I click "Yes"
#    And Tabs - I click "Appliances" button
#    And Appliances - I click the first appliance on the list "CHB"
#    And I click Gas Safety button
#    And Gas Safety - Did you work on the appliance - I click No
#    And Gas Safety - Did you visually check - I click Yes
#    And Gas Safety - Is appliance Safe - I click Yes
#    And Gas Safety - To current standards - I click NA
#    And Tabs - I click "Appliances" button
#    And Appliances - I click the first appliance on the list "COD"
#    And Tabs - I click "Parts" button
#    And I click the Warranty Return chevron
#    And I select "Yes" for Is this part going to be returned as a Warranty claim
#    And I set Quantity to claim or return to 1
#    And I click Same ID as Original
#    And Reason for claim - I type "aaaaaaaaaaaaaaa"
#    And 2 Index - I click "Yes" for warranty
#    And Second Index - I click Same ID as Original
#    And Second Index - Reason for claim - I type "This is a test"
#    And 3 Index - I click "No" for warranty
#    And 4 Index - I click "No" for warranty
#    And 5 Index - I click "No" for warranty
#    And Tabs - I click Activities tab
#    And Tabs - I click "Parts" button
#    And Parts - I click Parts Basket Tab
#    And Parts Basket - I click Clear Order List
#    And Dialog box - I click Yes button
#    And Parts Basket - I select "search for part manually"
#    And Parts Basket - I enter "555123" stock reference ID
#    And Parts Basket - I click Search for part
#    And Parts Basket - I click Add to order list
#    And Tabs - I click Activities tab
#    And Tabs - I click "Parts" button
#    And 555123 - Gasket - Cover Plate - I checked Van Stock
#    And Parts Basket - Associated Activity - I select "ENSAV UPGD"
#    And I select "No" for Is this part going to be returned as a Warranty claim
#    And I click on the Charges tab
#    And I click I Understand. Click to continue
#    And I click charges ok
#    And Tabs - I click "Parts" button
#    And I click on the Complete button
#    And I click the settings Tab
#    And I click the support operations chevron down
#    Then I verify that last job update is "{  job: {    status: {      code: 04,      timestamp: 2018-08-23T09:29:53Z    },    sourceSystem: W,    engineerId: 9999991,    dispatchTime: 2018-08-23T09:29:53Z,    enrouteTime: 2018-08-23T09:29:53Z,    onsiteTime: 2018-08-23T09:29:53Z,    completionTime: 2018-08-23T09:29:53Z,    paymentNonCollectionReasonCode: XE,    visitId: WMW00057440,    premises: {      id: L271307,      address: {},      contact: {        id: 022201824,        contactUpdatedMarker: A      },      safety: {        gasELIReading: <1,        safetyNoticeNotLeftReason: ,        gasInstallationTightnessTestDone: false,        gasMeterInstallationSafe: Yes,        riskIdentifiedAtProperty: false      },      unsafeDetail: {        reasons: []      }    },    tasks: [      {        id: 1321525001001,        newWork: false,        jobType: GU,        applianceType: CHB,        chargeType: ALFBNI2,        sequence: 2,        applianceId: 202224178,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 2838,            quantityCharged: 1,            quantityUsed: 1,            description: Timer Mechanical EMT 2 TOTE,            stockReferenceId: 555123          },          {            charge: 308,            quantityCharged: 1,            quantityUsed: 1,            description: O Ring - Pack of 10 14.4x9.6x2.5 mm,            stockReferenceId: E77199          },          {            charge: 3524,            quantityCharged: 1,            quantityUsed: 1,            description: Bracket - Vertical Flue Pk5,            stockReferenceId: 794929          }        ],        partsUsed: [          {            quantityUsed: 1,            quantityCharged: 1,            requisitionNumber: ,            buyingUnitPrice: 2838,            description: Timer Mechanical EMT 2 TOTE,            sourceCategory: P,            charge: 2838,            stockReferenceId: 555123          }        ],        partsClaimedUnderWarranty: [          {            claimedUnderWarrantyReasonDescription: aaaaaaaaaaaaaaa,            partReturnedIndicator: true,            quantityClaimed: 1,            stockReferenceId: E66527          },          {            claimedUnderWarrantyReasonDescription: This is a test,            partReturnedIndicator: true,            quantityClaimed: 1,            stockReferenceId: E49976          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 8117,        vatAmount: 4058.5,        vatCode: F,        subsequentJobIndicator: true,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 1447      },      {        id: 1321525001002,        newWork: false,        jobType: OL,        applianceType: COD,        chargeType: CPONONE,        sequence: 2,        applianceId: 202224177,        status: C,        componentEndTime: 2018-08-23T09:29:53Z,        componentStartTime: 2018-08-23T09:29:53Z,        report: 54CODE aaaaaaaaaa,        energyEfficiencyOutcome: NOR,        workDuration: 1,        workedOnCode: AP,        visitActivityCode: CPC,        partsCharged: [          {            charge: 1777,            quantityCharged: 1,            quantityUsed: 1,            description: Valve Body Flow Switch,            stockReferenceId: E39696          }        ],        jobStatusCategory: C,        chargeableTime: 1,        chargeExcludingVAT: 1777,        vatAmount: 3554,        vatCode: D,        subsequentJobIndicator: false,        discountAmount: 0,        standardLabourChargeIndicator: false,        totalLabourCharged: 0      }    ]  },  appliances: [    {      updateMarker: A,      applianceType: CHB,      id: 202224178,      readings: [],      safety: {        gasMeterInstallationSafe: Yes,        applianceSafe: Y,        installationSafe: Y,        detailsDate: 2018-08-23T09:29:53Z,        workedOnAppliance: false,        visuallyCheckRelight: Y,        applianceToCurrentStandards: X      }    }  ]}"