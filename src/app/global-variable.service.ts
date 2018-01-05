// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// Our Serives
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { ButtonBarAvailable }         from './models'
import { CanvasSlicer}                from './models'
import { DashboardRecent}             from './models'
import { ButtonBarSelected }          from './models';
import { CSScolor }                   from './models';
import { Dashboard }                  from './models';
import { DashboardTab }               from './models';
import { DashboardSnapshot }          from './models';
import { DashboardTag }               from './models';
import { DashboardTheme }             from './models';
import { DashboardTemplate }          from './models';
import { DashboardSchedule }          from './models';
import { DashboardPermission }        from './models';

import { Datasource }                 from './models';
import { Transformation }             from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { DataQualityIssue}            from './models'
import { DatasourceFilter}            from './models'
import { DatasourcePermission}        from './models'
import { CanvasComment }              from './models';
import { CanvasAlert }                from './models';
import { CanvasMessage }              from './models';
import { CanvasActivity }             from './models';
import { CanvasWidget }               from './models';
import { CanvasShape }                from './models';
import { Combination }                from './models';
import { CombinationDetail }          from './models';

// Data
import { httpFake }                   from './data/dashboards'

import * as dl                        from 'datalib';
import { Observable }                 from 'rxjs/Observable';

// Setup / Settings / General
const backgroundcolors: CSScolor[] =
[
    {
        name: 'transparent'
    },
    {
        name: 'beige'
    },
    {
        name: 'white'
    }
];

const shapeButtonsAvailable: ButtonBarAvailable[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Widget, for example the graph type.',
        sortOrder: 1,
        isDefault: true
    },
    {
        id: 2,
        buttonText: 'Duplicate',
        description: 'Duplicates the current Shape with a new name (adding ... Copy n).  The Dataset is not duplicated.',
        sortOrder: 2,
        isDefault: true
    },
    {
        id: 3,
        buttonText: 'Backward',
        description: 'Send the selected Widget backwards.',
        sortOrder: 3,
        isDefault: true
    },
    {
        id: 4,
        buttonText: 'Forward',
        description: 'Bring the selected Widget forward.',
        sortOrder: 4,
        isDefault: true
    },
    {
        id: 5,
        buttonText: 'Delete',
        description: 'Delete the selected Widget.',
        sortOrder: 5,
        isDefault: true
    },
    {
        id: 6,
        buttonText: 'Background toggle',
        description: 'Toggle the background of the selected Shape on / of.',
        sortOrder: 6,
        isDefault: true
    },
    {
        id: 7,
        buttonText: 'Increase size',
        description: 'Increase the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 7,
        isDefault: true
    },
    {
        id: 8,
        buttonText: 'Decrease',
        description: 'Decrease the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 8,
        isDefault: true
    }
]

const shapeButtonsSelected: ButtonBarSelected[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Shape, for example the color of a circle.',
        sortOrder: 1
    }
]

const widgetButtonsAvailable: ButtonBarAvailable[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Widget, for example the graph type.',
        sortOrder: 1,
        isDefault: true
    },
    {
        id: 2,
        buttonText: 'Refresh',
        description: 'Refresh the data linked to the current Widget.',
        sortOrder: 2,
        isDefault: false
    },
    {
        id: 3,
        buttonText: 'Expand',
        description: 'Open a separate window showing all the data in the Dataset linked to the Widget.',
        sortOrder: 3,
        isDefault: false
    },
    {
        id: 4,
        buttonText: 'Duplicate',
        description: 'Duplicates the current Widget with a new name (adding ... Copy n).  The Dataset is not duplicated.',
        sortOrder: 4,
        isDefault: false
    },
    {
        id: 5,
        buttonText: 'Backward',
        description: 'Send the selected Widget backwards.',
        sortOrder: 5,
        isDefault: false
    },
    {
        id: 6,
        buttonText: 'Forward',
        description: 'Bring the selected Widget forward.',
        sortOrder: 6,
        isDefault: false
    },
    {
        id: 7,
        buttonText: 'Comments',
        description: 'Show the comments linked to the selected Widget.',
        sortOrder: 7,
        isDefault: false
    },
    {
        id: 8,
        buttonText: 'Data Quality',
        description: 'Show a form with Data Quality issues pertaining to the Dataset linked to the selected Widget.',
        sortOrder: 8,
        isDefault: false
    },
    {
        id: 9,
        buttonText: 'Save Checkpoint',
        description: 'Save the current layout of the selected Widget as a Checkpoint.',
        sortOrder: 9,
        isDefault: false
    },
    {
        id: 10,
        buttonText: 'Delete',
        description: 'Delete the selected Widget.',
        sortOrder: 10,
        isDefault: false
    },
    {
        id: 11,
        buttonText: 'Export png',
        description: 'Export the graph of the selected Widget as a .png file, which is a static image.',
        sortOrder: 11,
        isDefault: false
    },
    {
        id: 12,
        buttonText: 'Tags',
        description: 'Show the tags associated with the selected Widget.',
        sortOrder: 12,
        isDefault: false
    },
    {
        id: 13,
        buttonText: 'Border toggle',
        description: 'Toggle the border around the selected Widget between none, gray and black.  The line is 1px solid.',
        sortOrder: 13,
        isDefault: false
    },
    {
        id: 14,
        buttonText: 'Links',
        description: 'Show a form with links from and to the selected Widget.  New links can be added here.',
        sortOrder: 14,
        isDefault: false
    },
    {
        id: 15,
        buttonText: 'Increase size',
        description: 'Increase the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 15,
        isDefault: false
    },
    {
        id: 16,
        buttonText: 'Decrease',
        description: 'Decrease the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 16,
        isDefault: false
    }
]

const widgetButtonsSelected: ButtonBarSelected[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Widget, for example the graph type.',
        sortOrder: 1,
    },
    {
        id: 2,
        buttonText: 'Refresh',
        description: 'Refresh the data linked to the current Widget.',
        sortOrder: 2,
    }
]


// Messages / Activities / Alerts / Comments
const  canvasActivities: CanvasActivity[] =
[
    {
        id: 1,
        createdBy: 'AlexanderB',
        createdOn: '2017/01/01',
        activityType: 'Action',
        activityStatus: 'Open',
        linkedDashboardList: [],
        activityText: 'Refactor Widget for coal levels',
        activityComments: ['2017/01/01 @BorisN Levels in tenk 1-A checked and good']
    }
];

const canvasAlerts: CanvasAlert[] =
[
    {
        id: 1,
        sentOn: '2017/01/01',
        recipient: 'BonitaS',
        read: false,
        alertText: 'Schedule Weekly reports failed',
    },
    {
        id: 2,
        sentOn: '2017/01/01',
        recipient: 'AlisonW',
        read: true,
        alertText: 'Please log out for maintenance',
    },
    {
        id: 3,
        sentOn: '2017/01/01',
        recipient: 'GavinO',
        read: false,
        alertText: 'Longrunning query finished',
    },
    {
        id: 4,
        sentOn: '2017/01/01',
        recipient: 'WendyA',
        read: true,
        alertText: 'Query xyz failed',
    }
];

const canvasMessages: CanvasMessage[] =
[
    {
        id: 1,
        sentBy: 'GinaU',
        sentOn: '2017/01/01',
        toUsers: ['GinaU'],
        toGroups: [''],
        recipient: '',
        read: false,
        subject: 'Please QA attached Dashboard',
        body: 'I have amended the graph type for marketing expenses',
        dashboardID: 12
    },
    {
        id: 2,
        sentBy: 'PeterJ',
        sentOn: '2017/01/01',
        toUsers: [''],
        toGroups: ['Admin'],
        recipient: 'QuintinY',
        read: true,
        subject: 'Admin cleanup',
        body: 'Cleanout old users',
        dashboardID: null
    },
    {
        id: 3,
        sentBy: 'RubinV',
        sentOn: '2017/01/01',
        toUsers: [''],
        toGroups: ['Admin'],
        recipient: 'YasserK',
        read: false,
        subject: 'Admin cleanup',
        body: 'Cleanout old users',
        dashboardID: null
    }
];

const canvasComments: CanvasComment[] =
[
    {
        id: 1,
        dashboardID: 2,
        dashboardTabID: 1,
        widgetID: 4,
        shapeID: 0,
        comment: 'Checkpoints show more detail',
        creator: 'MarcoD',
        createdOn: '2017/01/01'
    }
]


// Data
const finalFields =
[
    {
        fieldName: 'MonthTraded',
        dataType: 'string',
        localName: 'Date',
        filtered: '2 flters',
        transformed: ''
    },
    {
        fieldName: 'TradeType',
        dataType: 'string',
        localName: '',
        filtered: '',
        transformed: ''
    },
    {
        fieldName: 'Volume',
        dataType: 'number',
        localName: '',
        filtered: '1 flters',
        transformed: '2 transf'
    },
    {
        fieldName: 'Price',
        dataType: 'number',
        localName: '',
        filtered: '',
        transformed: '6 transf'
    },
    {
        fieldName: 'Value',
        dataType: 'Calculated: number',
        localName: '',
        filtered: '',
        transformed: '1 transf'
    }
];

const combinations: Combination[] =
[
    {
        combinationID: 1,
        dashboardID: 1,
        type: 'Union'
    }
];

const combinationDetails: CombinationDetail[] =
[
    {
        combinationDetailID: 1,
        combinationID: 2,
        lhDatasourceID: 3,
        lhFieldName: 'TradeType',
        rhDatasourceID: 4,
        rhFieldName: 'TradeType'
    }
];

const datasourcePermissions: DatasourcePermission[] =
[
    {
        id: 1,
        datasourceID: 1,
        userID: 'KilmarE',
        groupID: '',
        canView: true,
        canEdit: false,
    },
    {
        id: 2,
        datasourceID: 1,
        userID: 'UweH',
        groupID: '',
        canView: false,
        canEdit: true,
    },
    {
        id: 3,
        datasourceID: 1,
        userID: 'IgnusO',
        groupID: '',
        canView: true,
        canEdit: true,
    }
];

const currentDataset =
[
    {
        datasourceID: 1,
        data:
        [
            {
            Name: 'Jay',
            Type: 'Origon',
            Description: 'bla-bla',
            CreatedBy: 'aasdf',
            CreatedOn: 'on',
            RefreshedBy: 'by',
            RefreshedOn: '2/2'
            },
            {
            Name: 'Jay',
            Type: 'Origon',
            Description: 'bla-bla',
            CreatedBy: 'aasdf',
            CreatedOn: 'on',
            RefreshedBy: 'by',
            RefreshedOn: '2/2'
            },
            {
            Name: 'Jay',
            Type: 'Origon',
            Description: 'bla-bla',
            CreatedBy: 'aasdf',
            CreatedOn: 'on',
            RefreshedBy: 'by',
            RefreshedOn: '2/2'
            },
            {
            Name: 'Jay',
            Type: 'Origon',
            Description: 'bla-bla',
            CreatedBy: 'aasdf',
            CreatedOn: 'on',
            RefreshedBy: 'by',
            RefreshedOn: '2/2'
            }
        ]
    }
];

const datasets: any[] =
[
    {
        datasourceID: 1,
        data:
        [
            {
              Name: 'Jay',
              Type: 'Origon',
              Description: 'bla-bla',
              CreatedBy: 'aasdf',
              CreatedOn: 'on',
              RefreshedBy: 'by',
              RefreshedOn: '2/2'
            },
            {
              Name: 'Jay',
              Type: 'Origon',
              Description: 'bla-bla',
              CreatedBy: 'aasdf',
              CreatedOn: 'on',
              RefreshedBy: 'by',
              RefreshedOn: '2/2'
            },
            {
              Name: 'Jay',
              Type: 'Origon',
              Description: 'bla-bla',
              CreatedBy: 'aasdf',
              CreatedOn: 'on',
              RefreshedBy: 'by',
              RefreshedOn: '2/2'
            },
            {
              Name: 'Jay',
              Type: 'Origon',
              Description: 'bla-bla',
              CreatedBy: 'aasdf',
              CreatedOn: 'on',
              RefreshedBy: 'by',
              RefreshedOn: '2/2'
            }
        ]
    },
    {
        datasourceID: 2,
        data:
        [
            {Month: "01",Trades: 28}, {Month: "02",Trades: 55},
            {Month: "03",Trades: 43}, {Month: "04",Trades: 91},
            {Month: "05",Trades: 81}, {Month: "06",Trades: 53},
            {Month: "07",Trades: 19}, {Month: "08",Trades: 87},
            {Month: "09",Trades: 52}, {Month: "10",Trades: 42},
            {Month: "11",Trades: 62}, {Month: "12",Trades: 82}
        ]
    }
];

const currentDatasources: Datasource [] =
[
    {
        id: 1,
        name: 'My Expenses',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    }
];

const datasources: Datasource [] =
[
    {
        id: 1,
        name: 'My Expenses',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 2,
        type: 'File',
        subType: 'CSV',
        typeVersion: 'Comma-Separator',
        name: 'Stocks4.csv',
        description: 'Hard coded name',
        createdBy: 'Me',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: 'None'
    },
    {
        id: 3,
        name: 'Bitcoin Trades',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 4,
        name: 'My Budget',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 5,
        name: 'Bicycle Sales',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 6,
        name: 'Bond Valuation',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 7,
        name: 'Auditors',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 8,
        name: 'Student Marks',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 9,
        name: 'Security Breaches',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 10,
        name: 'Milk Proteins',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 11,
        name: 'Malaria Cases',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 12,
        name: 'Investments',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 13,
        name: 'Bridge Maintenance',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 14,
        name: 'Parts in storage',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 15,
        name: 'Customer Complaints',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 16,
        name: 'Issues',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 17,
        name: 'Tickets',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 18,
        name: 'Clothing lines',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2010',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 19,
        name: 'Shoe Sales',
        type: 'Server',
        subType: 'PostgreSQL',
        typeVersion: '',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 20,
        name: 'World Indices',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 21,
        name: 'SP Companies*',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 22,
        name: 'Stock prices TEMP',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 23,
        name: 'Trades per Year',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 24,
        name: 'Bond volume trades',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 25,
        name: 'Trades by Trade Type',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 26,
        name: 'YTD Expenditure by Cost Center',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 27,
        name: 'Headcount',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    },
    {
        id: 28,
        name: 'Customer List',
        type: 'Server',
        subType: 'MSSQL',
        typeVersion: 'SQL 2016',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''
    }
];

const fields: Field[] =
[
    {
        id: 1,
        datasourceID: 12,
        name: 'DateTrade',
        type: 'Date',
        format: '',
        filter: '',
        calc: '',
        order: 'Asc 1'
    },
    {
        id: 2,
        datasourceID: 12,
        name: 'Share',
        type: 'Text',
        format: '',
        filter:  '',
        calc:  '',
        order: ''
    },
    {
        id: 3,
        datasourceID: 12,
        name: 'Volume',
        type: 'Number',
        format: 'Integer',
        filter: '',
        calc:  '',
        order: ''
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Value',
        type: 'Number',
        format: '2 decimals',
        filter: '> 1m',
        calc: 'Volume * 10',
        order: ''
    }
];

const fieldsMetadata: FieldMetadata[] =
[
    {
        id: 4,
        datasourceID: 12,
        name: 'DateTrade',
        type: 'Date',
        description: 'Date on which trade when through trading system',
        keyField: false,
        explainedBy: ''
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Share',
        type: 'String',
        description: 'Name of share (stock) that traded, ie Anglo American plc',
        keyField: true,
        explainedBy: 'Bar of new Listings per Month'
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Volume',
        type: 'Number',
        description: 'Number of instruments traded.  Single counted, excluding BR, YT trade types.',
        keyField: false,
        explainedBy: 'Pie of Trades by Broker'
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Value',
        type: 'Number',
        description: 'Value in Rand of the instruments traded, based on Volume and Price.',
        keyField: false,
        explainedBy: 'Custom Query: TradeAttribution'
    }
];

const dataQualityIssues: DataQualityIssue[] =
[
    {
        id: 1,
        datasourceID: 12,
        status: 'Open',
        name: 'Missing Data',
        type: 'Data',
        description: 'bla-bla-bla',
        nrIssues: 0,
        loggedBy: 'AstonK',
        loggedOn: '2017/01/01',
        solvedBy: '',
        solvedOn: '',
    },
    {
        id: 2,
        datasourceID: 12,
        status: '',
        name: 'Invalid Entries',
        type: 'Process',
        description: 'bla-bla-bla',
        nrIssues: 12,
        loggedBy: 'BarbaraR',
        loggedOn: '2017/01/01',
        solvedBy: 'GordonL',
        solvedOn: '2017/01/01',
    }
]

const transformationsFormat: Transformation[] =
[
    {
        id: 1,
        datasourceID: 12,
        category: 'Column-level',
        name: 'FormatDate',
        description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 16,
        datasourceID: 12,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 20,
        datasourceID: 12,
        category: 'Column-level',
        name: 'FormatNumber',
        description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’',
        fieldName: 'Date',
        parameters: ''

    }
];

const currentTransformations: Transformation[] =
[
    {
        id: 1,
        datasourceID: 12,
        category: 'Format',
        name: 'FillBlanks',
        description: 'bla-bla-bla',
        fieldName: 'Region',
        parameters: ""
    }
]

// TODO - check why this is not used
const transformationsFill: Transformation[] =
[
    {
        id: 2,
        datasourceID: 12,
        category: 'Column-level',
        name: 'FillBlanks',
        description: '(columnName, newValue)',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 3,
        datasourceID: 12,
        category: 'Column-level',
        name: 'FillNull',
        description: '(columnName, newValue)',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 4,
        datasourceID: 12,
        category: 'ColucurrentTransformationsmn-level',
        name: 'FillBlankAndNull',
        description: '(columnName, newValue)',
        fieldName: 'Date',
        parameters: ''

    }
];

// TODO - check why this is not used
const transformationsGeo: Transformation[] =
[
    {
        id: 21,
        datasourceID: 12,
        category: 'Column-level',
        name: 'AddLatitude',
        description: '(reference-columnName, new-columnName), add a new column with latitude, based on the information in the reference-columnName',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 22,
        datasourceID: 12,
        category: 'Column-level',
        name: 'AddLongitude',
        description: '(reference-columnName, new-columnName), add a new column with longitude, based on the information in the reference-columnName',
        fieldName: 'Date',
        parameters: ''

    }
];

// TODO - check why this is not used
const transformationsReplace: Transformation[] =
[
    {
        id: 5,
        datasourceID: 12,
        category: 'Column-level',
        name: 'ReplaceNumbers',
        description: '(columnName, from, to, newValue)',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 6,
        datasourceID: 12,
        category: 'Column-level',
        name: 'ReplaceString',
        description: '(columnName, oldValue, newValue)',
        fieldName: 'Date',
        parameters: ''

    }
];

// TODO - check why this is not used
const transformationsAddColumn: Transformation[] =
[
    {
        id: 7,
        datasourceID: 12,
        category: 'Column-level',
        name: 'AppendColumn',
        description: '(newColumnName, dataType, fillValue)',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 10,
        datasourceID: 12,
        category: 'Column-level',
        name: 'CalcColumn',
        description: '(newColumnName, columnOne, columnTwo, Operator, fillValue)',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 17,
        datasourceID: 12,
        category: 'Column-level',
        name: 'Concatenate',
        description: '(columnNameOne, ColumnNameTwo)',
        fieldName: 'Date',
        parameters: ''

    }
];

// TODO - check why this is not used
const transformationsTrim: Transformation[] =
[
    {
        id: 12,
        datasourceID: 12,
        category: 'Column-level',
        name: 'LeftTrim',
        description: '(columnName)',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 13,
        datasourceID: 12,
        category: 'Column-level',
        name: 'RightTrim',
        description: '(columnName)',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 14,
        datasourceID: 12,
        category: 'Column-level',
        name: 'Trim',
        description: '(columnName), which combines LeftTrim and RightTrim',
        fieldName: 'Date',
        parameters: ''

    }
];

// TODO - check why this is not used
const transformationsPortion: Transformation[] =
[
    {
        id: 11,
        datasourceID: 12,
        category: 'Column-level',
        name: 'Substring',
        description: '(columnName, startPosition, length)',
        fieldName: 'Date',
        parameters: ''
    },
    {
        id: 15,
        datasourceID: 12,
        category: 'Column-level',
        name: 'RightSubstring',
        description: '(columnName, startPosition, length) is similar to Substring, but startPosition is counted from the right.',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 16,
        datasourceID: 12,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 18,
        datasourceID: 12,
        category: 'Column-level',
        name: 'ConcatenateColumn',
        description: '(columnName, preString, postString) will append strings to the front or back of a column',
        fieldName: 'Date',
        parameters: ''

    },
];

const datasourceRecent: Datasource[] =
[
    {
        id: 1,
        name: 'CPI figures',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2007',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''

    },
    {
        id: 1,
        name: 'GDP by Country',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2007',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''

    }
];

const datasourceSample: Datasource[] =
[
    {
        id: 1,
        name: 'Bicycle trips in Rome',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2007',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''

    },
    {
        id: 2,
        name: 'Vega Airport Dataset',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2007',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''

    },
    {
        id: 3,
        name: 'Home Budget',
        type: 'File',
        subType: 'Excel',
        typeVersion: '2007',
        description: '',
        createdBy: '',
        createdOn: '',
        refreshedBy: '',
        refreshedOn: '',
        parameters: ''

    }
];

const datasourceFilters: DatasourceFilter[] =
[
    {
        id: 1,
        datasourceID: 12,
        fieldName: 'symbol',
        operator: 'Equal',
        filterValue: 'MSFT'
    },
    {
        id: 2,
        datasourceID: 12,
        fieldName: 'price',
        operator: 'GreaterEqual',
        filterValue: '100'
    }
]


// Dashboard
const dashboardPermissions: DashboardPermission[] =
[
    {
        id: 1,
        dashboardID: 1,
        userID: 'KilmarE',
        groupID: '',
        canView: true,
        canEdit: false,
    },
    {
        id: 2,
        dashboardID: 1,
        userID: 'UweH',
        groupID: '',
        canView: false,
        canEdit: true,
    },
    {
        id: 3,
        dashboardID: 1,
        userID: 'IgnusO',
        groupID: '',
        canView: true,
        canEdit: true,
    }
];

const localWidgets: CanvasWidget[] =
[
    {
        isTrashed: false,
        dashboardID: 1,
        dashboardTabID: 1,
        dashboardTabName: '',
        id: 1,
        name: 'barchart for start',
        description: 'bla-bla-bla',
        grammar: '',
        version: 1,
        isSelected: false,
        isLiked: false,
        datasetID: 1,
        dataParameters:
        [
            {
                "field": '',
                "value": '',
            }
        ],
        reportID: 1,
        reportName: '',
        rowLimit: 1,
        addRestRow: false,
        size: '',
        hyperlinkDashboardID: 1,
        hyperlinkDashboardTabID: 1,
        containerBackgroundcolor: 'transparent',
        containerBorder: '2px solid black',
        containerBoxshadow: '2px 2px gray',
        containerColor: 'transparent',
        containerFontsize: 12,
        containerHeight: 320,
        containerLeft: 50,
        containerWidgetTitle: 'Title 1',
        containerTop: 240,      // was 140
        containerWidth: 250,
        containerZindex: 50,
        titleText: '',
        titleBackgroundColor: '#192b35',
        titleBorder: '',
        titleColor: '',
        titleFontsize: 1,
        titleFontWeight: '',
        titleHeight: 1,
        titleLeft: 1,
        titleMargin: '',
        titlePadding: '',
        titlePosition: '',
        titleTextAlign: '',
        titleTop: 1,
        titleWidth: 1,
        graphType: '',
        graphHeight: 1,
        graphLeft: 1,
        graphTop: 1,
        graphWidth: 1,
        graphGraphPadding: 1,
        graphHasSignals: false,
        graphXcolumn: '',
        graphYcolumn: '',
        graphFillColor: '',
        graphHoverColor: '',
        graphSpecification: {
            "data": {"url": "../assets/vega-datasets/cars.json"},
            "mark": "point",
            "encoding": {
                "x": {"field": "Horsepower", "type": "quantitative"},
                "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
            }
        },
        tableColor: '',
        tableCols: 1,
        tableHeight: 1,
        tableHideHeader: false,
        tableLeft: 1,
        tableRows: 1,
        tableTop: 1,
        tableWidth: 1,
        refreshMode: '',
        refreshFrequency: 1,
        widgetRefreshedOn: '',
        widgetRefreshedBy: '',
        widgetCreatedOn: '',
        widgetCreatedBy: '',
        widgetUpdatedOn: '',
        widgetUpdatedBy: '',
    },
    {
        isTrashed: false,
        dashboardID: 1,
        dashboardTabID: 1,
        dashboardTabName: '',
        id: 2,
        name: 'scatter for start',
        description: 'bla-bla-bla',
        grammar: '',
        version: 1,
        isSelected: false,
        isLiked: false,
        datasetID: 1,
        dataParameters:
        [
            {
                "field": '',
                "value": '',
            }
        ],
        reportID: 1,
        reportName: '',
        rowLimit: 1,
        addRestRow: false,
        size: '',
        hyperlinkDashboardID: 1,
        hyperlinkDashboardTabID: 1,
        containerBackgroundcolor: 'transparent',
        containerBorder: '',
        containerBoxshadow: '2px 2px gray',
        containerColor: 'transparent',
        containerFontsize: 12,
        containerHeight: 320,
        containerLeft: 350,
        containerWidgetTitle: 'Title 1',
        containerTop: 140,
        containerWidth: 250,
        containerZindex: 50,
        titleText: '',
        titleBackgroundColor: '',
        titleBorder: '',
        titleColor: '',
        titleFontsize: 1,
        titleFontWeight: '',
        titleHeight: 1,
        titleLeft: 1,
        titleMargin: '',
        titlePadding: '',
        titlePosition: '',
        titleTextAlign: '',
        titleTop: 1,
        titleWidth: 1,
        graphType: '',
        graphHeight: 1,
        graphLeft: 1,
        graphTop: 1,
        graphWidth: 1,
        graphGraphPadding: 1,
        graphHasSignals: false,
        graphXcolumn: '',
        graphYcolumn: '',
        graphFillColor: '',
        graphHoverColor: '',
        graphSpecification: {
            "data": {"url": "../assets/vega-datasets/cars.json"},
            "mark": "bar",
            "encoding": {
                "x": {"field": "Horsepower", "type": "quantitative"},
                "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
            }
        },
        tableColor: '',
        tableCols: 1,
        tableHeight: 1,
        tableHideHeader: false,
        tableLeft: 1,
        tableRows: 1,
        tableTop: 1,
        tableWidth: 1,
        refreshMode: '',
        refreshFrequency: 1,
        widgetRefreshedOn: '',
        widgetRefreshedBy: '',
        widgetCreatedOn: '',
        widgetCreatedBy: '',
        widgetUpdatedOn: '',
        widgetUpdatedBy: '',
    },
    {
        isTrashed: false,
        dashboardID: 1,
        dashboardTabID: 1,
        dashboardTabName: '',
        id: 3,
        name: 'barchart for start',
        description: 'bla-bla-bla',
        grammar: '',
        version: 1,
        isSelected: false,
        isLiked: false,
        datasetID: 1,
        dataParameters:
        [
            {
                "field": '',
                "value": '',
            }
        ],
        reportID: 1,
        reportName: '',
        rowLimit: 1,
        addRestRow: false,
        size: '',
        hyperlinkDashboardID: 1,
        hyperlinkDashboardTabID: 1,
        containerBackgroundcolor: 'transparent',
        containerBorder: '',
        containerBoxshadow: '',
        containerColor: 'transparent',
        containerFontsize: 12,
        containerHeight: 300,
        containerLeft: 650,
        containerWidgetTitle: 'Title 1',
        containerTop: 140,
        containerWidth: 420,
        containerZindex: 50,
        titleText: '',
        titleBackgroundColor: '',
        titleBorder: '',
        titleColor: '',
        titleFontsize: 1,
        titleFontWeight: '',
        titleHeight: 1,
        titleLeft: 1,
        titleMargin: '',
        titlePadding: '',
        titlePosition: '',
        titleTextAlign: '',
        titleTop: 1,
        titleWidth: 1,
        graphType: '',
        graphHeight: 1,
        graphLeft: 1,
        graphTop: 1,
        graphWidth: 1,
        graphGraphPadding: 1,
        graphHasSignals: false,
        graphXcolumn: '',
        graphYcolumn: '',
        graphFillColor: '',
        graphHoverColor: '',
        graphSpecification: {
            "data": {"url": "../assets/vega-datasets/seattle-weather.csv"},
            "mark": "bar",
            "encoding": {
              "x": {
                "timeUnit": "month",
                "field": "date",
                "type": "ordinal"
              },
              "y": {
                "aggregate": "count",
                "field": "*",
                "type": "quantitative"
              },
              "color": {
                "field": "weather",
                "type": "nominal"
              }
            }
        },
        tableColor: '',
        tableCols: 1,
        tableHeight: 1,
        tableHideHeader: false,
        tableLeft: 1,
        tableRows: 1,
        tableTop: 1,
        tableWidth: 1,
        refreshMode: '',
        refreshFrequency: 1,
        widgetRefreshedOn: '',
        widgetRefreshedBy: '',
        widgetCreatedOn: '',
        widgetCreatedBy: '',
        widgetUpdatedOn: '',
        widgetUpdatedBy: '',
    }
];

const localWidgets1: CanvasWidget =
    {
        isTrashed: false,
        dashboardID: 4,
        dashboardTabID: 1,
        dashboardTabName: '',
        id: 4,
        name: 'barchart for start',
        description: 'bla-bla-bla',
        grammar: '',
        version: 1,
        isSelected: false,
        isLiked: false,
        datasetID: 1,
        dataParameters:
        [
            {
                "field": '',
                "value": '',
            }
        ],
        reportID: 1,
        reportName: '',
        rowLimit: 1,
        addRestRow: false,
        size: '',
        hyperlinkDashboardID: 1,
        hyperlinkDashboardTabID: 1,
        containerBackgroundcolor: 'transparent',
        containerBorder: '2px solid black',
        containerBoxshadow: '2px 2px gray',
        containerColor: 'transparent',
        containerFontsize: 12,
        containerHeight: 320,
        containerLeft: 1000,
        containerWidgetTitle: 'Title 1',
        containerTop: 260,
        containerWidth: 250,
        containerZindex: 50,
        titleText: '',
        titleBackgroundColor: '',
        titleBorder: '',
        titleColor: '',
        titleFontsize: 1,
        titleFontWeight: '',
        titleHeight: 1,
        titleLeft: 1,
        titleMargin: '',
        titlePadding: '',
        titlePosition: '',
        titleTextAlign: '',
        titleTop: 1,
        titleWidth: 1,
        graphType: '',
        graphHeight: 1,
        graphLeft: 1,
        graphTop: 1,
        graphWidth: 1,
        graphGraphPadding: 1,
        graphHasSignals: false,
        graphXcolumn: '',
        graphYcolumn: '',
        graphFillColor: '',
        graphHoverColor: '',
        graphSpecification: {
            "data": {"url": "../assets/vega-datasets/cars.json"},
            "mark": "point",
            "encoding": {
                "x": {"field": "Horsepower", "type": "quantitative"},
                "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
            }
        },
        tableColor: '',
        tableCols: 1,
        tableHeight: 1,
        tableHideHeader: false,
        tableLeft: 1,
        tableRows: 1,
        tableTop: 1,
        tableWidth: 1,
        refreshMode: '',
        refreshFrequency: 1,
        widgetRefreshedOn: '',
        widgetRefreshedBy: '',
        widgetCreatedOn: '',
        widgetCreatedBy: '',
        widgetUpdatedOn: '',
        widgetUpdatedBy: '',
    };

const localDashboards: dl.spec.TopLevelExtendedSpec[] =
[
    {
        "data": {"url": "../assets/vega-datasets/cars.json"},
        "mark": "point",
        "encoding": {
            "x": {"field": "Horsepower", "type": "quantitative"},
            "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
        }
    },
    {
        "data": {"url": "../assets/vega-datasets/seattle-weather.csv"},
        "mark": "bar",
        "encoding": {
          "x": {
            "timeUnit": "month",
            "field": "date",
            "type": "ordinal"
          },
          "y": {
            "aggregate": "count",
            "field": "*",
            "type": "quantitative"
          },
          "color": {
            "field": "weather",
            "type": "nominal"
          }
        }
    }
];

const dashboardSchedules: DashboardSchedule[] =
[
    {
        id: 1,
        dashboardID: 12,
        datasourceID: 0,
        name: 'Daily',
        description: '7 Days a weeks, forever',
        repeats: 'Daily',
        repeatsEvery: 1,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: true,
        EndsAfter: null,
        EndsOn: null
    },
    {
        id: 2,
        dashboardID: 12,
        datasourceID: 0,
        name: 'Weekday (M-F)',
        description: 'Mon-Fri for 10 times',
        repeats: 'Weekday (M-F)',
        repeatsEvery: null,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: null,
        EndsAfter: 10,
        EndsOn: null
    },
    {
        id: 3,
        dashboardID: 12,
        datasourceID: 0,
        name: 'Weekly',
        description: 'Every second week on Tuesday and Friday',
        repeats: 'Weekly',
        repeatsEvery: 2,
        repeatsOn: ['Tuesday, Friday'],
        repeatsFor: 'DayOfWeek',
        startsOn: '2017/01/01',
        EndsNever: true,
        EndsAfter: 0,
        EndsOn: ''
    },
    {
        id: 4,
        dashboardID: 12,
        datasourceID: 0,
        name: 'Monthly',
        description: 'Quarterly for one year',
        repeats: 'Monthly',
        repeatsEvery: 3,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: null,
        EndsAfter: null,
        EndsOn: '2017/12/31'
    },
    {
        id: 1,
        dashboardID: 12,
        datasourceID: 0,
        name: 'Yearly',
        description: 'Annualy forever',
        repeats: 'Yearly',
        repeatsEvery: 1,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: true,
        EndsAfter:null,
        EndsOn: null
    }
];

const dashboardThemes: DashboardTheme[] =
[
    {
        id: 1,
        name: 'Theme basic',
        description: 'bla-bla-bla'
    }
]

const dashboardTemplates: DashboardTemplate[] =
[
    {
        id: 1,
        name: 'Corporate Logo and Name',
        description: 'bla-bla-bla'
    }
]

const dashboardTags: DashboardTag[] =
[
    {
        id: 1,
        dashboardID: 12,
        tag: 'budget2017'
    },
    {
        id: 2,
        dashboardID: 12,
        tag: 'savings'
    },
    {
        id: 3,
        dashboardID: 12,
        tag: 'projectAard'
    }
];

const dashboardSnapshots: DashboardSnapshot[] =
[
    {
        id: 1,
        dashboardID: 1,
        name: 'Rough layut',
        comment: ''
    },
    {
        id: 2,
        dashboardID: 1,
        name: 'Costing done',
        comment: 'Still need to confirm figures'
    }
]

const dashboards: Dashboard[] =
[
    {
        id: 1,
        state: 'Draft',
        version: 1,
        code: 'Mkt Overview',
        name: 'Market Overview',
        description: 'Economic indicator summary',

        password: '',
        refreshMode: '',
        refreshTimer: 0,
        defaultTabID: 0,
        defaultExportFileType: '',
        url: '',
        qaRequired: true,
        isSample: true,
    
        backgroundColor: '',
        backgroundImage: '',
        templateDashboardID: 0,
    
        creator: 'JonathanS',
        dateCreated: '',
        editor: 'JonathanS',
        dateEdited: '',
        refresher: '',
        dateRefreshed: '',
            
        nrWidgets: 1,
        nrShapes: 0,
        nrRecords: 12,
        nrTimesOpened: 0,
        tabs: [2],
        tags: [],
        permissions: []
    },
    {
        id: 2,
        state: 'Pending',
        version: 1,
        code: 'Costing',
        name: 'Costing Summary',
        description: 'Costing Summary',

        password: '',
        refreshMode: '',
        refreshTimer: 0,
        defaultTabID: 0,
        defaultExportFileType: '',
        url: '',
        qaRequired: true,
        isSample: true,
    
        backgroundColor: '',
        backgroundImage: '',
        templateDashboardID: 0,
    
        creator: 'JonathanS',
        dateCreated: '',
        editor: 'JonathanS',
        dateEdited: '',
        refresher: '',
        dateRefreshed: '',
            
        nrWidgets: 1,
        nrShapes: 0,
        nrRecords: 12,
        nrTimesOpened: 0,
        tabs: [2],
        tags: [],
        permissions: []
    },
    {
        id: 3,
        state: 'Complete',
        version: 1,
        code: 'Budget',
        name: 'Home Budget',
        description: 'Home Budget',

        password: '',
        refreshMode: '',
        refreshTimer: 0,
        defaultTabID: 0,
        defaultExportFileType: '',
        url: '',
        qaRequired: true,
        isSample: true,
    
        backgroundColor: '',
        backgroundImage: '',
        templateDashboardID: 0,
    
        creator: 'JonathanS',
        dateCreated: '',
        editor: 'JonathanS',
        dateEdited: '',
        refresher: '',
        dateRefreshed: '',
            
        nrWidgets: 1,
        nrShapes: 0,
        nrRecords: 12,
        nrTimesOpened: 0,
        tabs: [2],
        tags: [],
        permissions: []
    },
    {
        id: 4,
        state: 'Complete',
        version: 1,
        code: 'Bitcoin',
        name: 'Bitcoin sales',
        description: 'Bitcoin sales',

        password: '',
        refreshMode: '',
        refreshTimer: 0,
        defaultTabID: 0,
        defaultExportFileType: '',
        url: '',
        qaRequired: true,
        isSample: true,
    
        backgroundColor: '',
        backgroundImage: '',
        templateDashboardID: 0,
    
        creator: 'JonathanS',
        dateCreated: '',
        editor: 'JonathanS',
        dateEdited: '',
        refresher: '',
        dateRefreshed: '',
            
        nrWidgets: 1,
        nrShapes: 0,
        nrRecords: 12,
        nrTimesOpened: 0,
        tabs: [2],
        tags: [],
        permissions: []
    },
    {
        id: 5,
        state: 'Pending',
        version: 1,
        code: 'Cycling',
        name: 'Cycling routes',
        description: 'Cycling routes',

        password: '',
        refreshMode: '',
        refreshTimer: 0,
        defaultTabID: 0,
        defaultExportFileType: '',
        url: '',
        qaRequired: true,
        isSample: true,
    
        backgroundColor: '',
        backgroundImage: '',
        templateDashboardID: 0,
    
        creator: 'JonathanS',
        dateCreated: '',
        editor: 'JonathanS',
        dateEdited: '',
        refresher: '',
        dateRefreshed: '',
            
        nrWidgets: 1,
        nrShapes: 0,
        nrRecords: 12,
        nrTimesOpened: 0,
        tabs: [2],
        tags: [],
        permissions: []
    }
];

// Old, Full list
    // const transformations: transformation[] =
    // [
    //     {
    //         id: 1,
    //         category: 'Column-level',
    //         name: 'FormatDate',
    //         description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.'
    //     },
    //     {
    //         id: 2,
    //         category: 'Column-level',
    //         name: 'FillBlanks',
    //         description: '(columnName, newValue)'
    //     },
    //     {
    //         id: 3,
    //         category: 'Column-level',
    //         name: 'FillNull',
    //         description: '(columnName, newValue)'
    //     },
    //     {
    //         id: 4,
    //         category: 'Column-level',
    //         name: 'FillBlankAndNull',
    //         description: '(columnName, newValue)'
    //     },
    //     {
    //         id: 5,
    //         category: 'Column-level',
    //         name: 'ReplaceNumbers',
    //         description: '(columnName, from, to, newValue)'
    //     },
    //     {
    //         id: 6,
    //         category: 'Column-level',
    //         name: 'ReplaceString',
    //         description: '(columnName, oldValue, newValue)'
    //     },
    //     {
    //         id: 7,
    //         category: 'Column-level',
    //         name: 'AppendColumn',
    //         description: '(newColumnName, dataType, fillValue)'
    //     },
    //     {
    //         id: 8,
    //         category: 'Column-level',
    //         name: 'Columns',
    //         description: '([column1, column2, ...]) to be returned'
    //     },
    //     {
    //         id: 9,
    //         category: 'Column-level',
    //         name: 'Field Filters',
    //         description: '([ {columnX, operator, value} ]'
    //     },
    //     {
    //         id: 10,
    //         category: 'Column-level',
    //         name: 'CalcColumn',
    //         description: '(newColumnName, columnOne, columnTwo, Operator, fillValue)'
    //     },
    //     {
    //         id: 11,
    //         category: 'Column-level',
    //         name: 'Substring',
    //         description: '(columnName, startPosition, length)'
    //     },
    //     {
    //         id: 12,
    //         category: 'Column-level',
    //         name: 'LeftTrim',
    //         description: '(columnName)'
    //     },
    //     {
    //         id: 13,
    //         category: 'Column-level',
    //         name: 'RightTrim',
    //         description: '(columnName)'
    //     },
    //     {
    //         id: 14,
    //         category: 'Column-level',
    //         name: 'Trim',
    //         description: '(columnName), which combines LeftTrim and RightTrim'
    //     },
    //     {
    //         id: 15,
    //         category: 'Column-level',
    //         name: 'RightSubstring',
    //         description: '(columnName, startPosition, length) is similar to Substring, but startPosition is counted from the right.'
    //     },
    //     {
    //         id: 16,
    //         category: 'Column-level',
    //         name: 'DatePart',
    //         description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second'
    //     },
    //     {
    //         id: 17,
    //         category: 'Column-level',
    //         name: 'Concatenate',
    //         description: '(columnNameOne, ColumnNameTwo)'
    //     },
    //     {
    //         id: 18,
    //         category: 'Column-level',
    //         name: 'ConcatenateColumn',
    //         description: '(columnName, preString, postString) will append strings to the front or back of a column'
    //     },
    //     {
    //         id: 19,
    //         category: 'Column-level',
    //         name: 'Calculate',
    //         description: '(columnName, expression) where operation is a valid math expression, for example ‘+ 2’, or ‘/1000’.  The [columnName] (in square brackets) can be part of the expression, say [columnName] * 1.14'
    //     },
    //     {
    //         id: 20,
    //         category: 'Column-level',
    //         name: 'FormatNumber',
    //         description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’'
    //     },
    //     {
    //         id: 21,
    //         category: 'Column-level',
    //         name: 'AddLatitude',
    //         description: '(reference-columnName, new-columnName), add a new column with latitude, based on the information in the reference-columnName'
    //     },
    //     {
    //         id: 22,
    //         category: 'Column-level',
    //         name: 'AddLongitude',
    //         description: '(reference-columnName, new-columnName), add a new column with longitude, based on the information in the reference-columnName'
    //     },
    //     {
    //         id: 100,
    //         category: 'Table-level',
    //         name: 'Pivot',
    //         description: '(row-heading, column-heading, operator, data-heading) '
    //     },
    //     {
    //         id: 101,
    //         category: 'Table-level',
    //         name: 'Transpose',
    //         description: 'turning rows into columns and vice versa'
    //     },
    //     {
    //         id: 102,
    //         category: 'Table-level',
    //         name: 'FormatTable',
    //         description: '(format), where format = json, csv, tsv, Excel, ADO, etc.'
    //     },
    // ];
// End of list


@Injectable()
export class GlobalVariableService {

    // Constants
    NoQueryRunningMessage: string = 'No Query';
    QueryRunningMessage: string = 'Query running...';

    // Permanent data - later to come from http
    backgroundcolors: CSScolor[] = backgroundcolors;
    canvasActivities: CanvasActivity[] = canvasActivities;
    canvasAlerts: CanvasAlert[] = canvasAlerts;
    canvasComments: CanvasComment[] = canvasComments;
    canvasMessages: CanvasMessage[] =  canvasMessages;
    filePath: string;
    shapeButtonsAvailable: ButtonBarAvailable[] = shapeButtonsAvailable;
    widgetButtonsAvailable: ButtonBarAvailable[] = widgetButtonsAvailable;

    dashboards: Dashboard[] = dashboards;
    dashboardTabs: DashboardTab[] = [];
    dashboardsRecent: number[];
    dashboardPermissions: DashboardPermission[] = dashboardPermissions;
    dashboardTags: DashboardTag[] = dashboardTags;
    dashboardSnapshots: DashboardSnapshot[] = dashboardSnapshots;
    dashboardThemes: DashboardTheme[] = dashboardThemes;
    dashboardTemplates: DashboardTemplate[] = dashboardTemplates;
    dashboardSchedules: DashboardSchedule[] = dashboardSchedules;
    widgets: CanvasWidget[] = [];
    shapes: CanvasShape[] = [];
    slicers: CanvasSlicer[] = [];

    datasources = new BehaviorSubject<Datasource[]>(datasources);
    datasourceFilters: DatasourceFilter[] = datasourceFilters;
    datasourcePermissions: DatasourcePermission[] = datasourcePermissions;
    dataQualityIssues: DataQualityIssue[] = dataQualityIssues;
    transformationsFormat: Transformation[] = transformationsFormat;
    fields: Field[] = fields;
    fieldsMetadata: FieldMetadata[] = fieldsMetadata;
    datasourceRecent: Datasource[] = datasourceRecent;
    datasourceSample: Datasource[] = datasourceSample;
    datasets: any = datasets;
    slicerHeader = new BehaviorSubject<string>('Filer: Make')
    finalFields: any = finalFields;
    pivotCols: string[];
    pivotRows: string[];
    pivotAgg: string[];
    pivotResults: any[] =
    [
        {
            Date: '2017/01/01',
            AAPL: 11,
            AMZN: 26,
            GOOG: 30,
            IBM: 47,
            MSFT: 50
        },
        {
            Date: '2017/01/01',
            AAPL: 12,
            AMZN: 25,
            GOOG: 34,
            IBM: 49,
            MSFT: 51
        },
        {
            Date: '2017/01/01',
            AAPL: 13,
            AMZN: 24,
            GOOG: 37,
            IBM: 48,
            MSFT: 50
        }
    ]


    // Data for CURRENT Dashboard and Datasources: only some models are loaded
    currentDatasources = new BehaviorSubject<Datasource[]>(currentDatasources);
    currentDatasourcePermissions: DatasourcePermission[] = [];
    currentDataset: any = currentDataset;
    currentTransformations: Transformation[] = currentTransformations;
    currentDatasourceFilters: DatasourceFilter[] = [];
    currentDashboards = new BehaviorSubject<Dashboard[]>([]);
    currentDashboardTabs = new BehaviorSubject<DashboardTab[]>([]);
    currentWidgets = new BehaviorSubject<CanvasWidget[]>([]);
    currentShapes = new BehaviorSubject<CanvasShape[]>([]);
    currentSlicers = new BehaviorSubject<CanvasSlicer[]>([]);

    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage = this.messageSource.asObservable();


    // Global vars that guide all interactions
    // ***************************************
    // Modes and Display
    editMode = new BehaviorSubject<boolean>(false);
    presentationMode = new BehaviorSubject<boolean>(false);
    showGrid = new BehaviorSubject<boolean>(false);
    // First time user
    isFirstTimeDashboard = new BehaviorSubject<boolean>(false);
    isFirstTimeDashboardOpen = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardSave = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardDiscard = new BehaviorSubject<boolean>(true);
    isFirstTimePresentation = new BehaviorSubject<boolean>(true);
    isFirstTimeWidgetLinked = new BehaviorSubject<boolean>(true);
    isFirstTimeDataCombination = new BehaviorSubject<boolean>(true);
    // Menu-related
    menuCreateDisabled = new BehaviorSubject<boolean>(true);
    showMainMenu = new BehaviorSubject<boolean>(true);
    // Opening forms
    openDashboardFormOnStartup: boolean = false;
    showModalLanding: boolean = true;  // Shows Landing page
    // Session
    currentDashboardID = new BehaviorSubject<number>(null);
    sessionDebugging: boolean = true;
    sessionLogging: boolean = false;
    shapeButtonsSelected: ButtonBarSelected[] = shapeButtonsSelected;
    widgetButtonsSelected: ButtonBarSelected[] = widgetButtonsSelected;
    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.NoQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessages = new BehaviorSubject<string>('1 Message');


    // Temp vars
    localDashboards: dl.spec.TopLevelExtendedSpec[] = localDashboards;
    localWidgets = new BehaviorSubject< CanvasWidget[]>(localWidgets);
    localShapes = new BehaviorSubject< CanvasShape[]>(null);
    localTrash = new BehaviorSubject< CanvasWidget[]>([]);

    dataGetFromSwitch = new BehaviorSubject<string>('File');
    duplicateDashboard = new BehaviorSubject<boolean>(false);
    refreshDashboard = new BehaviorSubject<boolean>(false);


    // Company related variables
    companyName: string = 'Clarity Analytics';                  // Optional, set in SystemConfig
    companyLogo: string = '';                                   // Optional file name, set in SystemConfig

    // System-wide related variables, set at Installation
    // systemConfigurationID: number = -1;
    // backendName: string = 'Eazl';
    // backendUrl: string = '';                                    // RESTi url, set in SystemConfig
    // defaultDaysToKeepResultSet: number = 1;                     // Optional, set in SystemConfig
    // frontendName: string = 'Canvas';
    // maxRowsDataReturned: number = 1000000;                      // Optional, set in SystemConfig
    // maxRowsPerWidgetGraph: number = 1;                          // Optional, set in SystemConfig
    // systemTitle: string = 'Canvas';

    // Current User
    // canvasUser = new BehaviorSubject<CanvasUser>(null);
    // isAuthenticatedOnEazl: boolean = false;        // True if authenticated

    // This session
    // showSystemConfigButtons: boolean = true;       // Menu option called = True: SystemConfiguration, False: System Info
    // sessionDateTimeLoggedin: string = '';
    // sessionDashboardTabID: number = null;          // Tab ID to load when form opens, -1 = none
    // sessionLoadOnOpenDashboardID: number = null;   // Dashboard to load when form opens, 0 = none
    // sessionLoadOnOpenDashboardName: string = '';   // Dashboard to load when form opens, '' = none

    // At startup
    // startupDashboardID: number = 0;                             // Dashboard to load @start, 0 = none
    // startupDashboardTabID: number = 0;                          // Tab ID to load @start, -1 = none
    // startupMessageToShow: string = '';                          // Message to show at start

    // Environment
    // testEnvironmentName: string = '';                           // Spaces = in PROD

    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    isDirtyWidgets: boolean = true;
    isDirtyDashboards: boolean = true;
    isDirtyDashboardsRecent: boolean = true;
    // isDirtyTextAlignDropdown: boolean = true;
    // isDirtyBorderDropdown: boolean = true;
    // isDirtyBoxShadowDropdown: boolean = true;
    // isDirtyBackgroundImageDropdown: boolean = true;
    // isDirtyDashboardTab: boolean = true;
    // isDirtyCanvasMessage: boolean = true;
    // isDirtyCanvasMessageRecipient: boolean = true;
    // isDirtyDashboardTag: boolean = true;
    // isDirtyDashboardTagMembership: boolean = true;
    // isDirtyDashboard: boolean = true;
    // isDirtyDatasource: boolean = true;
    // isDirtyFilter: boolean = true;
    // isDirtyFontSizeDropdown: boolean = true;
    // isDirtyFontWeightDropdown: boolean = true;
    // isDirtyGraphType: boolean = true;
    // isDirtyGridSizeDropdown: boolean = true;
    // isDirtyGroup: boolean = true;
    // isDirtyImageSourceDropdown: boolean = true;
    // isDirtyPackageTask: boolean = true;
    // isDirtyReport: boolean = true;
    // isDirtyReportWidgetSet: boolean = true;
    // isDirtyReportHistory: boolean = true;
    // isDirtySystemConfiguration: boolean = true;
    // isDirtyTextMarginDropdown: boolean = true;
    // isDirtyTextPaddingDropdown: boolean = true;
    // isDirtyTextPositionDropdown: boolean = true;
    // isDirtyWidgetTemplate: boolean = true;
    // isDirtyWidgetType: boolean = true;
    // isDirtyUser: boolean = true;

    // System & operation config
    // averageWarningRuntime: number = 0;
    // defaultWidgetConfiguration: string = '';
    // dashboardIDStartup: number = null;
    // defaultReportFilters: string = '';
    // environment: string = '';
    // frontendColorScheme: string = '';
    // gridSize: number = 3;
    // snapToGrid: boolean = true;

    // Settings that can be set via UI for next time, from then on it will change
    // as the user uses them, and used the next time (a Widget is created)
    // lastContainerFontSize: SelectedItem =
    //     {
    //         id: 1,
    //         name: '1'
    //     };
    // lastColor: SelectedItemColor =
    //     {
    //         id: 'black',
    //         name: 'black',
    //         code: '#000000'
    //     };
    // lastBoxShadow: SelectedItem =
    //     {
    //         id:1,
    //         name: ''
    //     };
    // lastBorder: SelectedItem =
    //     {
    //         id:1,
    //         name: '1px solid black'
    //     };
    // lastBackgroundColor: SelectedItemColor =
    //     {
    //         id: 'white',
    //         name: 'white',
    //         code: '#FFFFFF'
    //     };
    // lastWidgetHeight: number = 300;
    // lastWidgetWidth: number = 400;
    // lastWidgetLeft: number = 25;
    // lastWidgetTop: number = 80;


    constructor(        
        // private globalFunctionService: GlobalFunctionService,
        httpFake: httpFake
    ) {
        this.localShapes = new BehaviorSubject< CanvasShape[]>(httpFake.getLocalShapes());
        this.currentDashboardID.subscribe(
            i => {console.log('fuuuuc', i)
                this.refreshCurrentDashboardInfo(i);
        });
     }

    refreshCurrentDashboardInfo(dashboardID: number) {
        // Refreshes all info related to current D

		// Load the current Dashboard, and Optional template
        this.getCurrentDashboards(dashboardID);

		// Load the current DashboardTab
        this.currentDashboardTabs.next(this.dashboardTabs
            .filter(i => i.dashboardID = dashboardID
		));

		// Load Widgets, Shapes and Slicers
        this.getCurrentWidgets(dashboardID);
    }

    changeMessage(message: string) {
        console.log('changeMessage', message)
        this.messageSource.next(message)
    }

    changeMenuCreateDisabled(value: boolean) {
        this.menuCreateDisabled.next(value);
    }

    deleteWidget(index: number) {
        this.localWidgets.forEach( i => (i.forEach( e => {
            if (e.id == index) {
                e.isTrashed = true;
                console.log('Deleted id:', e.id)
            }
        })))
    }

    currentDatasourceAdd(newData: Datasource) {
        let arr: Datasource[] = this.currentDatasources.value;
        arr.push(newData);
        console.log('arr', arr)
        this.currentDatasources.next(arr)
        console.log('yy', this.currentDatasources.value)
    }

    datasourceAdd(newData: Datasource) {
        let arr: Datasource[] = this.datasources.value;
        arr.push(newData);
        console.log('arr', arr)
        this.datasources.next(arr)
        console.log('yy', this.datasources.value)
    }

    currentDatasourceDelete(index: number) {
        console.log('str', index, this.currentDatasources.value)
        let arr: Datasource[] = this.currentDatasources.value.splice(index,1);
        console.log('arr', arr)
        this.currentDatasources.next( this.currentDatasources.value)
        console.log('end', this.currentDatasources.value)
    }

    datasourceDelete(index: number) {
        let arr: Datasource[] = this.datasources.value.splice(index,1);
        console.log('arr', arr)
        this.datasources.next(this.datasources.value)
        console.log('yy', this.datasources.value)
    }

    dashboardDelete(index: number) {
        console.log('dashboardDelete', index)
        let arr: CanvasWidget[] = this.localWidgets.value.filter(
            i => {
                    if (i.id == index) { i.isTrashed = true}
                }
        );
        console.log('arr', arr)
        this.localWidgets.next(arr);
        // console.log('yy', this.localWidgets.value);
        // this.refreshDashboard.next(true);
    }

    deleteDashboardRecent(index: number) {
        let arr = this.dashboardsRecent.splice(index, 1);
    }


    getCurrentDashboards(dashboardID: number): Promise<Dashboard[]> {
        // Description: Gets current D (and optional Template)

        // Parames:
        //   dashboardID 

        // Returns: this.currentDashboards array, unless:
        //   If not cached or if dirty, get from File
        
        // Refresh from source at start, or if dirty
        if ( (this.dashboards == [])  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {

                        // Load the current Dashboard, and Optional template
                        let currentDashboards: Dashboard[] = [];
                        currentDashboards.push(this.dashboards[dashboardID]);
                        if (currentDashboards[0].templateDashboardID != 0) {
                            let templeteDashboard: Dashboard[] = null;

                            templeteDashboard = this.dashboards.filter(
                                i => i.id = currentDashboards[0].templateDashboardID
                            );

                            if (templeteDashboard == null) {
                                alert('Dashboard template id does not exist in Dashboards Array')
                            } else {
                                currentDashboards.push(templeteDashboard[0]);
                            }
                        }
                        this.currentDashboards.next(currentDashboards);

                        console.log('getCurrentDashboards 1', data)
                        resolve(currentDashboards);
                        
                })
             })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {

                // Load the current Dashboard, and Optional template
                let currentDashboards: Dashboard[] = [];
                currentDashboards.push(this.dashboards[dashboardID]);
                if (currentDashboards[0].templateDashboardID != 0) {
                    let templeteDashboard: Dashboard[] = null;

                    templeteDashboard = this.dashboards.filter(
                        i => i.id = currentDashboards[0].templateDashboardID
                    );

                    if (templeteDashboard == null) {
                        alert('Dashboard template id does not exist in Dashboards Array')
                    } else {
                        currentDashboards.push(templeteDashboard[0]);
                    }
                }
                this.currentDashboards.next(currentDashboards);

                console.log('getCurrentDashboards 2', currentDashboards)
                resolve(currentDashboards);
            });
        };

    }

    getCurrentWidgets(dashboardID: number): Promise<CanvasWidget[]> {
        // Description: Gets all W for current D

        // Parames:
        //   dashboardID 

        // Returns: this.currentWidgets array, unless:
        //   If not cached or if dirty, get from File
        
        // Usage: getWidgets(1)  =>  Returns W for DashboardID = 1
        
        // Refresh from source at start, or if dirty
        if ( (this.widgets == [])  ||  (this.isDirtyWidgets) ) {
            return new Promise<CanvasWidget[]>((resolve, reject) => {
                this.getWidgets()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentWidgets.next(data);
                        console.log('getCurrentWidgets 1', data)
                        resolve(data);
                        
                })
             })
        } else {
            return new Promise<CanvasWidget[]>((resolve, reject) => {
                let returnData: CanvasWidget[];
                returnData = this.widgets.filter(
                        i => i.dashboardID == dashboardID
                    )
                this.currentWidgets.next(returnData);
                console.log('getCurrentWidgets 2', returnData)
                resolve(returnData);
            });
        };

    }

    getWidgets(): Promise<CanvasWidget[]> {
        // Description: Gets all W

        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File
        
        // Usage: getWidgets(1)  =>  Returns W for DashboardID = 1
        //        getWidgets()   =>  Returns All W
        let url: string = 'getWidgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<CanvasWidget[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgets == [])  ||  (this.isDirtyWidgets) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.widgets = data;
                        this.isDirtyWidgets = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        resolve(this.widgets);
                    });
            } else {
                resolve(this.widgets);
            }
        });

    }

    getDashboards(): Promise<Dashboard[]> {
        // Description: Gets all D

        // Returns: this.dashboards array, unless:
        //   If not cached or if dirty, get from File
        
        let url: string = 'getDashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<Dashboard[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboards == [])  ||  (this.isDirtyDashboards) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboards = data;
                        this.isDirtyDashboards = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        resolve(this.dashboards);
                    });
            } else {
                resolve(this.dashboards);
            }
        });

    }

    getDashboardSamples(): Promise<Dashboard[]> {
        // Description: Gets all Sample D

        // Returns: an array extracted from [D], unless:
        //   If D not cached or if dirty, get from File
        
        // Refresh from source at start, or if dirty
        if ( (this.dashboards == [])  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {
                        data = data.filter(
                            i => (i.isSample)
                        );
                        console.log('getDashboardSamples 1', data)
                        resolve(data);
                        
                })
            })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let data: Dashboard[] = this.dashboards.filter(
                    i => (i.isSample)
                )
                console.log('getDashboardSamples 2', data)
                resolve(data);
            });
        };

    }

    getDashboardsRecentList(userID: string): Promise<number[]> {
        // Description: Gets a LIST of Recent D

        // Returns: this.dashboardsRecent array, unless:
        //   If not cached or if dirty, get from File
        
        let url: string = 'getDashboards';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<number[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.isDirtyDashboards)  ||  (this.isDirtyDashboardsRecent) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => { 
                        console.log('this.dashboardsRecent 1', data)
                        this.dashboardsRecent = [];
                        // TODO - http must be sorted => include in Options ...
                        let temp: DashboardRecent[] = data.filter(
                            i => i.userID == userID
                        )
                        temp.forEach( j => {
                            this.dashboardsRecent.push(j.dashboardID)
                        });
                        console.log('dashboardsRecent', this.dashboardsRecent)
                        this.isDirtyDashboardsRecent = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        resolve(this.dashboardsRecent);
                    });
            } else {
                console.log('this.dashboardsRecent 2', this.dashboardsRecent)
                resolve(this.dashboardsRecent);
            }
        });

    }

    getDashboardsRecent(userID: string): Promise<Dashboard[]> {
        // Description: Gets all Recent D

        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File
        
        // Usage: getWidgets(1)  =>  Returns W for DashboardID = 1
        
        // Refresh from source at start, or if dirty
        if ( (this.widgets == [])  ||  (this.isDirtyDashboardsRecent) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboardsRecentList(userID)
                    .then(data => {
                        console.log('data', data)
                        let returnData: Dashboard[] = [];
                        for (var i = 0; i < this.dashboards.length; i++) {
                            if (data.indexOf(this.dashboards[i].id) != -1) {
                                returnData.push(this.dashboards[i]);
                            }
                        }
                        resolve(returnData);
                                
                })
             })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let returnData: Dashboard[];
                for (var i = 0; i < this.dashboards.length; i++) {
                    if (this.dashboardsRecent.indexOf(this.dashboards[i].id) != -1) {
                        returnData.push(this.dashboards[i]);
                    }
                }
                resolve(returnData);
            });
        };

    }

    get<T>(url: string, options?: any, dashboardID?: number, datasourceID?: number): Promise<any> {
        // Generic GET data, later to be replaced with http

        return new Promise((resolve, reject) => {
            // Get from source - files for now ...
            dl.json({url: this.filePath}, {}, (err, currentData) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(currentData);
                }
                });
            }
        );
    }

    getAlldatasources(datasourceID: number) {

    }

    getAlldatasourceSample(length: number) {

    }

    getAllcurrentDatasources() {

    }

    getAllcurrentDatasourcePermissions() {

    }

    getAllcurrentDataset(datasourceID: number) {

    }

    getAllcurrentTransformations(datasourceID: number) {

    }

    getAllcurrentDatasourceFilters(datasourceID: number) {

    }

    getAllCurrentDashboardTabs(dashboardID: number) {
        // Get all Tabs for current D

    }

    getAllCurrentWidgets(dashboardID: number) {
        // Get all W for current D

    }

    getAllcurrentShapes(dashboardID: number) {
        // Get all S for current D

    }

    getAllcurrentSlicers(datasourceID: number) {
        // Get all Sl for current DS

    }

    getAlldatasourceFilters(datasourceID: number) {
        // Get all F for a DS

    }

    getAlldatasourcePermissions(datasourceID: number) {
        // Get P for a dS

    }

    getAlldataQualityIssues(datasourceID: number) {
        // Get dQ for one or more DS
    }

    getAlltransformationsFormat(datasourceID: number) {
        // Get TsFmt for a DS

    }

    getAllfields(datasourceID: number) {
        // Get all F for a DS

    }

    getAllfieldsMetadata(datasourceID: number) {
        // Get Fmdata for a DS

    }

    getAlldashboards(dashboardIDs: number[]) {
        // Get all / some D

    }

    getAlldashboardTabs(dashboardIDs: number[]) {

    }

    getAlldashboardPermissions(dashboardIDs: number[]) {

    }

    getAlldashboardTags(dashboardIDs: number[]) {

    }

    getAlldashboardSnapshots(dashboardIDs: number[]) {

    }

    getAlldashboardThemes() {

    }

    getAlldashboardTemplates(dashboardIDs: number[]) {

    }

    getAlldashboardSchedules(dashboardIDs: number[]) {

    }

    getAllshapes(dashboardIDs: number[]) {

    }

    getAllslicers() {

    }

    sleep(milliseconds: number) {
        console.log('sleeping ...', milliseconds);
        var start: number = new Date().getTime();
        console.log('  start', start, new Date().getTime())
        for (var counter = 0; counter < 3600001; counter++) {
            let mod:number = counter%60000;
            // TODO - remove this console.log BUT at moment sleep increments counter * 60000
            console.log(counter, mod);
            if (mod == 0) {     
                console.log ('Minutes elapsed ', counter, mod )
            }
            if ((new Date().getTime() - start) > milliseconds){
                console.log('  end', start, new Date().getTime())
                
                break;
            }
        }
    }
}