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
import { DataQualityIssue}            from './models';
import { DatasourceFilter}            from './models';
import { DatasourcePermission}        from './models';
import { DatasourcePivot }            from './models';

import { CanvasComment }              from './models';
import { CanvasAlert }                from './models';
import { CanvasMessage }              from './models';
import { CanvasActivity }             from './models';
import { CanvasWidget }               from './models';
import { CanvasShape }                from './models';
import { Combination }                from './models';
import { CombinationDetail }          from './models';

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


// Dashboard

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
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardTags: DashboardTag[] = [];
    dashboardPermissions: DashboardPermission[] = [];
    dashboardSnapshots: DashboardSnapshot[] = [];
    dashboardThemes: DashboardTheme[] = [];
    dashboardTemplates: DashboardTemplate[] = [];
    widgets: CanvasWidget[] = [];
    shapes: CanvasShape[] = [];
    slicers: CanvasSlicer[] = [];

    datasources: Datasource[] = [];
    transformations: Transformation[] = [];
    datasourceFilters: DatasourceFilter[] = [];
    dataQualityIssues: DataQualityIssue[] = [];
    datasourcePermissions: DatasourcePermission[] = [];
    datasourcePivots: DatasourcePivot[] = [];
    transformationsFormat: Transformation[] = transformationsFormat;
    fields: Field[] = fields;
    fieldsMetadata: FieldMetadata[] = fieldsMetadata;
    datasets: any = datasets;
    finalFields: any = finalFields;


    // Data for CURRENT Dashboard and Datasources: only some models are loaded
    currentDatasources = new BehaviorSubject<Datasource[]>([]);
    currentTransformations = new BehaviorSubject<Transformation[]>([]);
    currentDatasourceFilters = new BehaviorSubject<DatasourceFilter[]>([]);
    currentDataQualityIssues = new BehaviorSubject<DataQualityIssue[]>([]);
    currentDatasourcePermissions = new BehaviorSubject<DatasourcePermission[]>([]);
    currentDatasourcePivots = new BehaviorSubject<DatasourcePivot[]>([]);


    currentDataset: any = currentDataset;       //  !!

    currentDashboards = new BehaviorSubject<Dashboard[]>([]);
    currentDashboardTabs = new BehaviorSubject<DashboardTab[]>([]);
    currentWidgets = new BehaviorSubject<CanvasWidget[]>([]);
    currentShapes = new BehaviorSubject<CanvasShape[]>([]);
    currentSlicers = new BehaviorSubject<CanvasSlicer[]>([]);
    currentDashboardSchedules = new BehaviorSubject<DashboardSchedule[]>([]);
    currentDashboardTags = new BehaviorSubject<DashboardTag[]>([]);
    currentDashboardPermissions = new BehaviorSubject<DashboardPermission[]>([]);
    currentDashboardSnapshots = new BehaviorSubject<DashboardSnapshot[]>([]);


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
    showMainMenu = new BehaviorSubject<boolean>(true);
    // Opening forms
    openDashboardFormOnStartup: boolean = false;
    openNewDashboardFormOnStartup: boolean = false;
    showModalData = new BehaviorSubject<boolean>(false);
    showModalLanding = new BehaviorSubject<boolean>(true);  // Shows Landing page
    // Session
    currentDashboardID:number = 0; // = new BehaviorSubject<number>(null);
    currentDashboardTabID:number = 0; //  = new BehaviorSubject<number>(1);
    sessionDebugging: boolean = true;
    sessionLogging: boolean = false;
    shapeButtonsSelected: ButtonBarSelected[] = shapeButtonsSelected;
    widgetButtonsSelected: ButtonBarSelected[] = widgetButtonsSelected;
    menuActionResize = new BehaviorSubject<boolean>(false);
    menuActionSelectAll = new BehaviorSubject<boolean>(false);
    
    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.NoQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessages = new BehaviorSubject<string>('1 Msg');


    // Temp vars
    // localDashboards: dl.spec.TopLevelExtendedSpec[] = localDashboards;
    // localWidgets = new BehaviorSubject< CanvasWidget[]>(localWidgets);
    // localShapes = new BehaviorSubject< CanvasShape[]>(null);
    localTrash = new BehaviorSubject< CanvasWidget[]>([]);

    dataGetFromSwitch = new BehaviorSubject<string>('File');
    duplicateWidget = new BehaviorSubject<boolean>(false);
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
    isDirtyDashboards: boolean = true;
    isDirtyDashboardTabs: boolean = true;
    isDirtyDashboardsRecent: boolean = true;
    isDirtyWidgets: boolean = true;
    isDirtyShapes: boolean = true;
    isDirtySlicers: boolean = true;
    isDirtyDashboardSchedules: boolean = true;
    isDirtyDashboardTags: boolean = true;
    isDirtyDashboardPermissions: boolean = true;
    isDirtyDashboardSnapshots: boolean = true;
    isDirtyDashboardThemes: boolean = true;
    isDirtyDatasources: boolean = true;
    isDirtyTransformations: boolean = true;
    isDirtyDatasourceFilters: boolean = true;
    isDirtyDataQualityIssues: boolean = true;
    isDirtyDatasourcePermissions: boolean = true;
    isDirtyDatasourcePivots: boolean = true;


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
    ) {
        // this.localShapes = new BehaviorSubject< CanvasShape[]>(httpFake.getLocalShapes());
        // this.currentDashboardID.subscribe(
        //     i => {
        //             // Dont refresh at initialise: landing page will decide which ID to load ...
        //             if (i != null) {
        //                 this.refreshCurrentDashboard(i, 1);
        //             };
        //          }
        // );
     }

     refreshCurrentDashboardInfo(dashboardID: number, dashboardTabID: number): 
        Promise<boolean> {
        // Refreshes all info related to current D
        // Returns True if all worked, False if something went wrong
        console.log('Global-Variables refreshCurrentDashboardInfo D,T id = ', dashboardID, dashboardTabID)

        // Load the current Dashboard, and Optional template.  The dependants are stakced
        // in a Promise chain, to ensure we have all or nothing ...
        return new Promise<boolean>((resolve, reject) => {
            this.getCurrentDashboards(dashboardID).then( i => 
                // Load the current DashboardTab
                this.getCurrentDashboardTabs(dashboardID).then(j =>
                    // Load Widgets
                    this.getCurrentWidgets(dashboardID, dashboardTabID).then(k =>
                        // Load Shapes
                        this.getCurrentShapes(dashboardID, dashboardTabID).then(l =>
                            // Load Slicers
                            this.getCurrentSlicers(dashboardID, dashboardTabID).then(m =>
                                // Reset Global Vars
                                {
                                    this.currentDashboardID = dashboardID
                                    this.currentDashboardTabID = dashboardTabID
                                    resolve(true)
                                }
                            )
                        )
                    )
                )
            );
        });
    }

    refreshCurrentDashboard(dashboardID: number, dashboardTabID: number) {
        // Refreshes all info related to current D
        console.log('Global-Variables refreshCurrentDashboard D,T id = ', dashboardID, dashboardTabID)

        // Load Dashboard Themes
        this.getDashboardThemes();

		// Load the current Dashboard, and Optional template
        this.getCurrentDashboards(dashboardID);

		// Load the current DashboardTab
        this.getCurrentDashboardTabs(dashboardID)

		// Load Widgets
        this.getCurrentWidgets(dashboardID, dashboardTabID);

        // Load Shapes
        this.getCurrentShapes(dashboardID, dashboardTabID);

        // Load Slicers
        this.getCurrentSlicers(dashboardID, dashboardTabID);

        // Load Dashboard Schedules
        this.getCurrentDashboardSchedules(dashboardID);

        // Load Dashboard Tags
        this.getCurrentDashboardTags(dashboardID);
        
        // Load Dashboard Permissions
        this.getCurrentDashboardPermissions(dashboardID);
        
        // Load Dashboard Snapshots
        this.getCurrentDashboardSnapshots(dashboardID);

        // Load Dashboard Templates
        this.getDashboardTemplates();
        
        // Load Current Datasources
        this.getCurrentDatasources(dashboardID)

        // Load DatTransformationsasources
        this.getTransformations();     

        // Load Current DatTransformationsasources
        this.getCurrentTransformations(1);     

        // Load DatasourceFilters
        this.getDatasourceFilters();     

        // Load Current DatasourceFilters
        this.getCurrentDatasourceFilters(1);     

        // Load DataQualityIssues
        this.getDataQualityIssues();     

        // Load Current DataQualityIssue
        this.getCurrentDataQualityIssues(1);     

        // Load DatasourcePermissions
        this.getDatasourcePermissions();     

        // Load Current DatasourcePermissions
        this.getCurrentDatasourcePermissions(1);     

        // Load Current DatasourcePivots
        this.getCurrentDatasourcePivots(1);     

        // Reset Global Vars
        this.currentDashboardID = dashboardID;
        this.currentDashboardTabID = dashboardTabID;
        
    }

    deleteWidget(index: number) {
        this.widgets.forEach( e => {
            if (e.id == index) {
                e.isTrashed = true;
                console.log('Global-Variables deleteWidget id:', e.id)
            }
        });
    }

    currentDatasourceAdd(newData: Datasource) {
        let arr: Datasource[] = this.currentDatasources.value;
        arr.push(newData);
        console.log('Global-Variables currentDatasourceAdd arr', arr)
        this.currentDatasources.next(arr)
        console.log('Global-Variables currentDatasourceAdd yy', this.currentDatasources.value)
    }

    datasourceAdd(newData: Datasource) {
        let arr: Datasource[] = this.datasources;
        arr.push(newData);
        console.log('Global-Variables datasourceAdd arr', arr)
        this.datasources = arr;
        console.log('Global-Variables datasourceAdd yy', this.datasources)
    }

    currentDatasourceDelete(index: number) {
        console.log('str', index, this.currentDatasources.value)
        let arr: Datasource[] = this.currentDatasources.value.splice(index,1);
        console.log('Global-Variables currentDatasourceDelete arr', arr)
        this.currentDatasources.next( this.currentDatasources.value)
        console.log('Global-Variables currentDatasourceDelete end', this.currentDatasources.value)
    }

    datasourceDelete(index: number) {
        let arr: Datasource[] = this.datasources.splice(index,1);
        console.log('Global-Variables datasourceDelete arr', arr)
        this.datasources = this.datasources;
        console.log('Global-Variables datasourceDelete yy', this.datasources)
    }

    dashboardDelete(index: number) {
        console.log('Global-Variables dashboardDelete', index)
        let arr: CanvasWidget[] = this.currentWidgets.value.filter(
            i => {
                    if (i.id == index) { i.isTrashed = true}
                }
        );
        console.log('Global-Variables dashboardDelete arr', arr)
        this.currentWidgets.next(arr);
    }

    deleteDashboardRecent(index: number) {
        let arr = this.dashboardsRecent.splice(index, 1);
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
                        console.log('Global-Variables getDashboards 1', data)
                        resolve(this.dashboards);
                    });
            } else {
                console.log('Global-Variables getDashboards 2')
                resolve(this.dashboards);
            }
        });

    }

    getCurrentDashboards(dashboardID: number): Promise<Dashboard[]> {
        // Description: Gets current D (and optional Template)

        // Params:
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
                        currentDashboards = this.dashboards.filter(
                            i => i.id == dashboardID
                        );

                        if (currentDashboards.length > 0) {
                            if (currentDashboards[0].templateDashboardID != 0) {
                                let templeteDashboard: Dashboard[] = null;

                                templeteDashboard = this.dashboards.filter(
                                    i => i.id == currentDashboards[0].templateDashboardID
                                );

                                if (templeteDashboard == null) {
                                    alert('Dashboard template id does not exist in Dashboards Array')
                                } else {
                                    currentDashboards.push(templeteDashboard[0]);
                                }
                            };
                        }
                        this.currentDashboards.next(currentDashboards);

                        console.log('Global-Variables getCurrentDashboards 1', dashboardID, data)
                        resolve(currentDashboards);

                })
             })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {

                // Load the current Dashboard, and Optional template
                let currentDashboards: Dashboard[] = [];
                currentDashboards = this.dashboards.filter(
                    i => i.id == dashboardID
                );

                if (currentDashboards[0].templateDashboardID != 0) {
                    let templeteDashboard: Dashboard[] = null;

                    templeteDashboard = this.dashboards.filter(
                        i => i.id == currentDashboards[0].templateDashboardID
                    );

                    if (templeteDashboard == null) {
                        alert('Dashboard template id does not exist in Dashboards Array')
                    } else {
                        currentDashboards.push(templeteDashboard[0]);
                    }
                }
                this.currentDashboards.next(currentDashboards);
                console.log('Global-Variables getCurrentDashboards 2', dashboardID, currentDashboards)
                resolve(currentDashboards);
            });
        };

    }

    getDashboardTabs(): Promise<DashboardTab[]> {
        // Description: Gets all T

        // Returns: this.dashboardTabs array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<DashboardTab[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTabs == [])  ||  (this.isDirtyDashboardTabs) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTabs = data;
                        this.isDirtyDashboardTabs = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardTabs 1', data)
                        resolve(this.dashboardTabs);
                    });
            } else {
                console.log('Global-Variables getDashboardTabs 2')
                resolve(this.dashboardTabs);
            }
        });

    }

    getCurrentDashboardTabs(dashboardID: number): Promise<DashboardTab[]> {
        // Description: Gets all T for current D

        // Params:
        //   dashboardID

        // Returns: this.currentDashboardTabs array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.dashboardTabs == [])  ||  (this.isDirtyDashboardTabs) ) {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                this.getDashboardTabs()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTabs.next(data);
                        console.log('Global-Variables getCurrentDashboardTabs 1', dashboardID, data)
                        resolve(data);

                })
             })
        } else {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                let returnData: DashboardTab[];
                returnData = this.dashboardTabs.filter(
                        i => i.dashboardID == dashboardID
                    )
                this.currentDashboardTabs.next(returnData);
                console.log('Global-Variables getCurrentDashboardTabs 2', dashboardID, returnData)
                resolve(returnData);
            });
        };

    }

    getWidgets(): Promise<CanvasWidget[]> {
        // Description: Gets all W

        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File

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
                        console.log('Global-Variables getWidgets 1', data)
                        resolve(this.widgets);
                    });
            } else {
                console.log('Global-Variables getWidgets 2')
                resolve(this.widgets);
            }
        });

    }

    getCurrentWidgets(dashboardID: number, dashboardTabID: number): Promise<CanvasWidget[]> {
        // Description: Gets all W for current D

        // Params:
        //   dashboardID
        //   dashboardTabID (0 => all Tabs)

        // Returns: this.currentWidgets array, unless:
        //   If not cached or if dirty, get from File

        // Usage: getWidgets(1)  =>  Returns W for DashboardID = 1

        // Refresh from source at start, or if dirty
        if ( (this.widgets == [])  ||  (this.isDirtyWidgets) ) {
            return new Promise<CanvasWidget[]>((resolve, reject) => {
                this.getWidgets()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID  &&
                                 (dashboardTabID == 0  ||  i.dashboardTabID == dashboardTabID)
                        );
                        this.currentWidgets.next(data);
                        console.log('Global-Variables getCurrentWidgets 1', dashboardID, dashboardTabID, data)
                        resolve(data);

                })
             })
        } else {
            return new Promise<CanvasWidget[]>((resolve, reject) => {
                let returnData: CanvasWidget[];
                returnData = this.widgets.filter(
                        i => i.dashboardID == dashboardID  &&
                        (dashboardTabID == 0  ||  i.dashboardTabID == dashboardTabID)

                    )
                this.currentWidgets.next(returnData);
                console.log('Global-Variables getCurrentWidgets 2', dashboardID, dashboardTabID, returnData)
                resolve(returnData);
            });
        };

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
                        console.log('Global-Variables getDashboardSamples 1', data)
                        resolve(data);

                })
            })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let data: Dashboard[] = this.dashboards.filter(
                    i => (i.isSample)
                )
                console.log('Global-Variables getDashboardSamples 2', data)
                resolve(data);
            });
        };

    }

    getDashboardsRecentList(userID: string): Promise<number[]> {
        // Description: Gets a LIST of Recent D

        // Returns: this.dashboardsRecent array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDashboardsRecentList';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<number[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.isDirtyDashboards)  ||  (this.isDirtyDashboardsRecent) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardsRecent = [];
                        // TODO - http must be sorted => include in Options ...
                        let temp: DashboardRecent[] = data.filter(
                            i => i.userID == userID
                        )
                        temp.forEach( j => {
                            this.dashboardsRecent.push(j.dashboardID)
                        });
                        console.log('Global-Variables dashboardsRecent 1', this.dashboardsRecent)
                        this.isDirtyDashboardsRecent = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        resolve(this.dashboardsRecent);
                    });
            } else {
                console.log('Global-Variables this.dashboardsRecent 2', this.dashboardsRecent)
                resolve(this.dashboardsRecent);
            }
        });

    }

    getDashboardsRecent(userID: string): Promise<Dashboard[]> {
        // Description: Gets all Recent D

        // Returns: recent [D] array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.isDirtyDashboards)  ||  (this.isDirtyDashboardsRecent) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboardsRecentList(userID)
                    .then(data => {
                        let returnData: Dashboard[] = [];
                        for (var i = 0; i < this.dashboards.length; i++) {
                            if (data.indexOf(this.dashboards[i].id) != -1) {
                                returnData.push(this.dashboards[i]);
                            }
                        }
                        console.log('Global-Variables getDashboardsRecent 1', userID, returnData)
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
                console.log('Global-Variables getDashboardsRecent 2', userID, returnData)
                resolve(returnData);
            });
        };

    }

    getShapes(): Promise<CanvasShape[]> {
        // Description: Gets all S

        // Returns: this.shapes array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getShapes';
        this.filePath = './assets/data.shapes.json';

        return new Promise<CanvasShape[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.shapes == [])  ||  (this.isDirtyShapes) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.shapes = data;
                        this.isDirtyShapes = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getShapes 1', data)
                        resolve(this.shapes);
                    });
            } else {
                console.log('Global-Variables getShapes 2')
                resolve(this.shapes);
            }
        });

    }

    getCurrentShapes(dashboardID: number, dashboardTabID: number): Promise<CanvasShape[]> {
        // Description: Gets all S for current D

        // Params:
        //   dashboardID
        //   dashboardTabID (0 => all Tabs)

        // Returns: this.currentShapes array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.shapes == [])  ||  (this.isDirtyShapes) ) {
            return new Promise<CanvasShape[]>((resolve, reject) => {
                this.getShapes()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID  &&
                            (dashboardTabID == 0  ||  i.dashboardTabID == dashboardTabID)

                        );
                        this.currentShapes.next(data);
                        console.log('Global-Variables getCurrentShapes 1', dashboardID, 
                            dashboardTabID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<CanvasShape[]>((resolve, reject) => {
                let returnData: CanvasShape[];
                returnData = this.shapes.filter(
                    i => i.dashboardID == dashboardID  &&
                    (dashboardTabID == 0  ||  i.dashboardTabID == dashboardTabID)

                );
                this.currentShapes.next(returnData);
                console.log('Global-Variables getCurrentShapes 2', dashboardID, 
                    dashboardTabID, returnData)
                resolve(returnData);
            });
        };

    }

    getSlicers(): Promise<CanvasSlicer[]> {
        // Description: Gets all Sl

        // Returns: this.Slicers array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getSlicers';
        this.filePath = './assets/data.slicers.json';

        return new Promise<CanvasSlicer[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.slicers == [])  ||  (this.isDirtySlicers) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.slicers = data;
                        this.isDirtySlicers = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getSlicers 1', data)
                        resolve(this.slicers);
                    });
            } else {
                console.log('Global-Variables getSlicers 2')
                resolve(this.slicers);
            }
        });

    }

    getCurrentSlicers(dashboardID: number, dashboardTabID: number): Promise<CanvasSlicer[]> {
        // Description: Gets all Sl for current D

        // Params:
        //   dashboardID
        //   dashboardTabID (0 => all Tabs)

        // Returns: this.currentSlicers array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.slicers == [])  ||  (this.isDirtySlicers) ) {
            return new Promise<CanvasSlicer[]>((resolve, reject) => {
                this.getSlicers()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID  &&
                            (dashboardTabID == 0  ||  i.dashboardTabID == dashboardTabID)

                        );
                        this.currentSlicers.next(data);
                        console.log('Global-Variables getCurrentSlicers 1', dashboardID, dashboardTabID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<CanvasSlicer[]>((resolve, reject) => {
                let returnData: CanvasSlicer[];
                returnData = this.slicers.filter(
                    i => i.dashboardID == dashboardID  &&
                    (dashboardTabID == 0  ||  i.dashboardTabID == dashboardTabID)

                );
                this.currentSlicers.next(returnData);
                console.log('Global-Variables getCurrentSlicers 2', dashboardID, dashboardTabID, returnData)
                resolve(returnData);
            });
        };

    }

    getDashboardSchedules(): Promise<DashboardSchedule[]> {
        // Description: Gets all Sch

        // Returns: this.dashboardSchedules array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<DashboardSchedule[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSchedules == [])  ||  (this.isDirtyDashboardSchedules) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardSchedules = data;
                        this.isDirtyDashboardSchedules = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardSchedules 1')
                        resolve(this.dashboardSchedules);
                    });
            } else {
                console.log('Global-Variables getDashboardSchedules 2')
                resolve(this.dashboardSchedules);
            }
        });

    }

    getCurrentDashboardSchedules(dashboardID: number): Promise<DashboardSchedule[]> {
        // Description: Gets all Sch for current D

        // Params:
        //   dashboardID

        // Returns: this.currentDashboardSchedules array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSchedules == [])  ||  (this.isDirtyDashboardSchedules) ) {
            return new Promise<DashboardSchedule[]>((resolve, reject) => {
                this.getDashboardSchedules()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardSchedules.next(data);
                        console.log('Global-Variables getCurrentDashboardSchedules 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardSchedule[]>((resolve, reject) => {
                let returnData: DashboardSchedule[];
                returnData = this.dashboardSchedules.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSchedules.next(returnData);
                console.log('Global-Variables getCurrentDashboardSchedules 2', 
                    dashboardID, returnData)
                resolve(returnData);
            });
        };
    }

    getDashboardTags(): Promise<DashboardTag[]> {
        // Description: Gets all Sch

        // Returns: this.dashboardTags array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<DashboardTag[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTags == [])  ||  (this.isDirtyDashboardTags) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTags = data;
                        this.isDirtyDashboardTags = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardTags 1')
                        resolve(this.dashboardTags);
                    });
            } else {
                console.log('Global-Variables getDashboardTags 2')
                resolve(this.dashboardTags);
            }
        });

    }

    getCurrentDashboardTags(dashboardID: number): Promise<DashboardTag[]> {
        // Description: Gets all Sch for current D

        // Params:
        //   dashboardID

        // Returns: this.currentDashboardTags array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.dashboardTags == [])  ||  (this.isDirtyDashboardTags) ) {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                this.getDashboardTags()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTags.next(data);
                        console.log('Global-Variables getCurrentDashboardTags 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                let returnData: DashboardTag[];
                returnData = this.dashboardTags.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardTags.next(returnData);
                console.log('Global-Variables getCurrentDashboardTags 2', dashboardID)
                resolve(returnData);
            });
        };
    }

    getDashboardPermissions(): Promise<DashboardPermission[]> {
        // Description: Gets all P

        // Returns: this.dashboardPermissions array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<DashboardPermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardPermissions == [])  ||  (this.isDirtyDashboardPermissions) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardPermissions = data;
                        this.isDirtyDashboardPermissions = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardPermissions 1')
                        resolve(this.dashboardPermissions);
                    });
            } else {
                console.log('Global-Variables getDashboardPermissions 2')
                resolve(this.dashboardPermissions);
            }
        });

    }

    getCurrentDashboardPermissions(dashboardID: number): Promise<DashboardPermission[]> {
        // Description: Gets all Sch for current D

        // Params:
        //   dashboardID

        // Returns: this.currentDashboardPermissions array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.dashboardPermissions == [])  ||  (this.isDirtyDashboardPermissions) ) {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                this.getDashboardPermissions()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardPermissions.next(data);
                        console.log('Global-Variables getCurrentDashboardPermissions 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                let returnData: DashboardPermission[];
                returnData = this.dashboardPermissions.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardPermissions.next(returnData);
                console.log('Global-Variables getCurrentDashboardPermissions 2', dashboardID)
                resolve(returnData);
            });
        };
    }

    getDashboardSnapshots(): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn

        // Returns: this.dashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<DashboardSnapshot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSnapshots == [])  ||  (this.isDirtyDashboardSnapshots) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardSnapshots = data;
                        this.isDirtyDashboardSnapshots = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardSnapshots 1', data)
                        resolve(this.dashboardSnapshots);
                    });
            } else {
                console.log('Global-Variables getDashboardSnapshots 2')
                resolve(this.dashboardSnapshots);
            }
        });

    }

    getCurrentDashboardSnapshots(dashboardID: number): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn for current D

        // Params:
        //   dashboardID

        // Returns: this.getDashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSnapshots == [])  ||  (this.isDirtyDashboardSnapshots) ) {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                this.getDashboardSnapshots()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardSnapshots.next(data);
                        console.log('Global-Variables getDashboardSnapshots 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                let returnData: DashboardSnapshot[];
                returnData = this.dashboardSnapshots.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSnapshots.next(returnData);
                console.log('Global-Variables getDashboardSnapshots 2', dashboardID)
                resolve(returnData);
            });
        };
    }
    
    getDashboardThemes(): Promise<DashboardTheme[]> {
        // Description: Gets all Th

        // Returns: this.dashboardThemes array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDashboardThemes';
        this.filePath = './assets/data.dashboardThemes.json';

        return new Promise<DashboardTheme[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardThemes == [])  ||  (this.isDirtyDashboardThemes) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardThemes = data;
                        this.isDirtyDashboardThemes = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardThemes 1', data)
                        resolve(this.dashboardThemes);
                    });
            } else {
                console.log('Global-Variables getDashboardThemes 2')
                resolve(this.dashboardThemes);
            }
        });

    }
    
    getDashboardTemplates(): Promise<Dashboard[]> {
        // Description: Gets all Tpl

        // Returns: recent [D] array, unless:
        //   If not cached or if dirty, get from File

        // Refresh from source at start, or if dirty
        if ( this.dashboards == []  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {
                        let arrTemplateIDs: number[] = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].templateDashboardID != 0  &&  
                                data[i].templateDashboardID != null) {
                                arrTemplateIDs.push(data[i].templateDashboardID)
                            }
                        }
                        let returnData: Dashboard[] = [];
                        if (arrTemplateIDs.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                if (arrTemplateIDs.indexOf(data[i].id) != -1) {
                                    returnData.push(data[i]);
                                }
                            }
                        }
                        console.log('Global-Variables getDashboardTemplates 1', returnData)
                        resolve(returnData);
                    });
            });
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let arrTemplateIDs: number[] = [];
                for (var i = 0; i < this.dashboards.length; i++) {
                    if (this.dashboards[i].templateDashboardID != 0  &&  
                        this.dashboards[i].templateDashboardID != null) {
                        arrTemplateIDs.push(this.dashboards[i].templateDashboardID)
                    }
                }
                let returnData: Dashboard[] = [];
                if (arrTemplateIDs.length > 0) {
                    for (var i = 0; i < this.dashboards.length; i++) {
                        if (arrTemplateIDs.indexOf(this.dashboards[i].id) != -1) {
                            returnData.push(this.dashboards[i]);
                        }
                    }
                }
                console.log('Global-Variables getDashboardTemplates 2', returnData)
                resolve(returnData);

            });
        };

    }

    getDatasources(): Promise<Datasource[]> {
        // Description: Gets all DS

        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasources == [])  ||  (this.isDirtyDatasources) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasources = data;
                        this.isDirtyDatasources = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDatasources 1', data)
                        resolve(this.datasources);
                    });
            } else {
                console.log('Global-Variables getDatasources 2')
                resolve(this.datasources);
            }
        });

    }

    getCurrentDatasources(dashboardID: number): Promise<Datasource[]> {
        // Description: Gets DS for current D

        // Params: dashboardID = current D

        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // TODO - What if databoards empty or diry - is that okay?
            if ( (this.datasources == [])  ||  (this.isDirtyDatasources)  ||
                 (this.widgets == [])  ||  (this.isDirtyWidgets) ) {
                this.getDatasources()
                    .then(ds => 
                        {
                            this.getCurrentWidgets(dashboardID, 0)
                                .then( w => 
                                    {
                                        let ids: number[] = [];
                                        for (var i = 0; i < w.length; i++) {
                                            if (ids.indexOf(w[i].datasourceID) < 0) {
                                                ids.push(w[i].datasourceID)
                                            }
                                        };
                                        let returnData: Datasource[] = [];
                                        for (var i = 0; i < ds.length; i++) {
                                            if (ids.indexOf(ds[i].id) >= 0) {
                                                returnData.push(ds[i]);
                                            };
                                        };
                                        this.isDirtyDatasources = false;
                                        this.currentDatasources.next(returnData);
                                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                                        console.log('Global-Variables getCurrentDatasources 1', 
                                            dashboardID, returnData);
                                    }
                                );
                        }
                    )
            } else {
                let ids: number[] = [];
                for (var i = 0; i < this.currentWidgets.value.length; i++) {
                    if (ids.indexOf(this.currentWidgets.value[i].datasourceID) < 0) {
                        ids.push(this.currentWidgets.value[i].datasourceID)
                    }
                };
                let returnData: Datasource[] = [];
                for (var i = 0; i < this.datasources.length; i++) {
                    if (ids.indexOf(this.datasources[i].id) >= 0) {
                        returnData.push(this.datasources[i]);
                    };
                };
                this.isDirtyDatasources = false;
                this.currentDatasources.next(returnData);
                this.statusBarRunning.next(this.NoQueryRunningMessage);
                console.log('Global-Variables getCurrentDatasources 2', dashboardID);
            }
        });
    }

    getTransformations(): Promise<Transformation[]> {
        // Description: Gets all Tr

        // Returns: this.transformations array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getTransformations';
        this.filePath = './assets/data.transformations.json';

        return new Promise<Transformation[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.transformations == [])  ||  (this.isDirtyTransformations) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.transformations = data;
                        this.isDirtyTransformations = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getTransformations 1',  data)
                        resolve(this.transformations);
                    });
            } else {
                console.log('Global-Variables getTransformations 2')
                resolve(this.transformations);
            }
        });

    }

    getCurrentTransformations(datasourceID: number): Promise<Transformation[]> {
        // Description: Gets Tr for current DS

        // Returns: this.currentTransformations.value array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getTransformations';
        this.filePath = './assets/data.transformations.json';

        if ( (this.currentTransformations.value == [])  ||  (this.isDirtyTransformations) ) {
            return new Promise<Transformation[]>((resolve, reject) => {
                this.getTransformations()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentTransformations.next(data);
                        console.log('Global-Variables getTransformations 1', datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<Transformation[]>((resolve, reject) => {
                let returnData: Transformation[];
                returnData = this.transformations.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentTransformations.next(returnData);
                console.log('Global-Variables getTransformations 2', datasourceID, returnData)
                resolve(returnData);
            });
        };
    }

    getDatasourceFilters(): Promise<DatasourceFilter[]> {
        // Description: Gets all F

        // Returns: this.datasourceFilters array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasourceFilters';
        this.filePath = './assets/data.datasourceFilters.json';

        return new Promise<DatasourceFilter[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourceFilters == [])  ||  (this.isDirtyDatasourceFilters) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourceFilters = data;
                        this.isDirtyDatasourceFilters = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDatasourceFilters 1', this.datasourceFilters)
                        resolve(this.datasourceFilters);
                    });
            } else {
                console.log('Global-Variables getDatasourceFilters 2', this.datasourceFilters)
                resolve(this.datasourceFilters);
            }
        });

    }

    getCurrentDatasourceFilters(datasourceID: number): Promise<DatasourceFilter[]> {
        // Description: Gets F for current DS

        // Returns: this.currentDatasourceFilters.value array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasourceFilters';
        this.filePath = './assets/data.datasourceFilters.json';

        if ( (this.currentDatasourceFilters.value == [])  ||  (this.isDirtyDatasourceFilters) ) {
            return new Promise<DatasourceFilter[]>((resolve, reject) => {
                this.getDatasourceFilters()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourceFilters.next(data);
                        console.log('Global-Variables getDatasourceFilters 1', datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DatasourceFilter[]>((resolve, reject) => {
                let returnData: DatasourceFilter[];
                returnData = this.datasourceFilters.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourceFilters.next(returnData);
                console.log('Global-Variables getDatasourceFilters 2', datasourceID)
                resolve(returnData);
            });
        };
    }
    
    getDataQualityIssues(): Promise<DataQualityIssue[]> {
        // Description: Gets all dQual

        // Returns: this.dataQualityIssues array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        return new Promise<DataQualityIssue[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataQualityIssues == [])  ||  (this.isDirtyDataQualityIssues) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataQualityIssues = data;
                        this.isDirtyDataQualityIssues = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDataQualityIssues 1', this.dataQualityIssues)
                        resolve(this.dataQualityIssues);
                    });
            } else {
                console.log('Global-Variables getDataQualityIssues 2', this.dataQualityIssues)
                resolve(this.dataQualityIssues);
            }
        });
    }

    getCurrentDataQualityIssues(datasourceID: number): Promise<DataQualityIssue[]> {
        // Description: Gets dQual for current DS

        // Returns: this.dataQualityIssues.value array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        if ( (this.currentDataQualityIssues.value == [])  ||  (this.isDirtyDataQualityIssues) ) {
            return new Promise<DataQualityIssue[]>((resolve, reject) => {
                this.getDataQualityIssues()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDataQualityIssues.next(data);
                        console.log('Global-Variables getDataQualityIssuess 1', 
                            datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DataQualityIssue[]>((resolve, reject) => {
                let returnData: DataQualityIssue[];
                returnData = this.dataQualityIssues.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDataQualityIssues.next(returnData);
                console.log('Global-Variables getDataQualityIssuess 2', datasourceID, returnData)
                resolve(returnData);
            });
        };
    }
      
    getDatasourcePermissions(): Promise<DatasourcePermission[]> {
        // Description: Gets all DS-P

        // Returns: this.datasourcePermissions array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasourcePermissions';
        this.filePath = './assets/data.datasourcePermissions.json';

        return new Promise<DatasourcePermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePermissions == [])  ||  (this.isDirtyDatasourcePermissions) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePermissions = data;
                        this.isDirtyDatasourcePermissions = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDatasourcePermissions 1', this.datasourcePermissions)
                        resolve(this.datasourcePermissions);
                    });
            } else {
                console.log('Global-Variables getDatasourcePermissions 2', this.datasourcePermissions)
                resolve(this.datasourcePermissions);
            }
        });
    }
 
    getCurrentDatasourcePermissions(datasourceID: number): Promise<DatasourcePermission[]> {
        // Description: Gets DS-P for current DS

        // Returns: this.datasourcePermissions.value array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasourcePermissions';
        this.filePath = './assets/data..datasourcePermissions.json';

        if ( (this.currentDatasourcePermissions.value == [])  ||  (this.isDirtyDatasourcePermissions) ) {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                this.getDatasourcePermissions()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourcePermissions.next(data);
                        console.log('Global-Variables getDatasourcePermissions 1', datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                let returnData: DatasourcePermission[];
                returnData = this.datasourcePermissions.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourcePermissions.next(returnData);
                console.log('Global-Variables getDatasourcePermissions 2', datasourceID)
                resolve(returnData);
            });
        };

    }
  
    getDatasourcePivots(): Promise<DatasourcePivot[]> {
        // Description: Gets all DS-P

        // Returns: this.datasourcePivots array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasourcePivots';
        this.filePath = './assets/data.datasourcePivots.json';

        return new Promise<DatasourcePivot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePivots == [])  ||  (this.isDirtyDatasourcePivots) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePivots = data;
                        this.isDirtyDatasourcePivots = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDatasourcePivots 1', this.datasourcePivots)
                        resolve(this.datasourcePivots);
                    });
            } else {
                console.log('Global-Variables getDatasourcePivots 2', this.datasourcePivots)
                resolve(this.datasourcePivots);
            }
        });
    }
 
    getCurrentDatasourcePivots(datasourceID: number): Promise<DatasourcePivot[]> {
        // Description: Gets DS-P for current DS

        // Returns: this.datasourcePivots.value array, unless:
        //   If not cached or if dirty, get from File

        let url: string = 'getDatasourcePivots';
        this.filePath = './assets/data..datasourcePivots.json';

        if ( (this.currentDatasourcePivots.value == [])  ||  (this.isDirtyDatasourcePivots) ) {
            return new Promise<DatasourcePivot[]>((resolve, reject) => {
                this.getDatasourcePivots()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourcePivots.next(data);
                        console.log('Global-Variables getDatasourcePivots 1', datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DatasourcePivot[]>((resolve, reject) => {
                let returnData: DatasourcePivot[];
                returnData = this.datasourcePivots.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourcePivots.next(returnData);
                console.log('Global-Variables getDatasourcePivots 2', datasourceID, returnData)
                resolve(returnData);
            });
        };

    }
  






    get<T>(url: string, options?: any, dashboardID?: number, datasourceID?: number): Promise<any> {
        // Generic GET data, later to be replaced with http

        return new Promise((resolve, reject) => {
            // Get from source - files for now ...
            dl.json({url: this.filePath}, {children: 'graphSpecification'}, (err, currentData) => {
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

    getAllcurrentDatasourcePermissions() {

    }

    getAllcurrentDataset(datasourceID: number) {

    }

    getAlldatasourcePermissions(datasourceID: number) {
        // Get P for a dS

    }

    getAlltransformationsFormat(datasourceID: number) {
        // Get TsFmt for a DS

    }

    getAllfields(datasourceID: number) {
        // Get all F for a DS

    }


    sleep(milliseconds: number) {
        console.log('Global-Variables sleeping ...', milliseconds);
        var start: number = new Date().getTime();
        console.log('  start', start, new Date().getTime())
        for (var counter = 0; counter < 3600001; counter++) {
            let mod:number = counter%60000;
            // TODO - remove this console.log BUT at moment sleep increments counter * 60000
            console.log(counter, mod);
            if (mod == 0) {
                console.log ('   Minutes elapsed ', counter, mod )
            }
            if ((new Date().getTime() - start) > milliseconds){
                console.log('  end', start, new Date().getTime())

                break;
            }
        }
    }
}