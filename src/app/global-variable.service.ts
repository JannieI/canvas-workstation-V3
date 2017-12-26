// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// Our Models
import { currentDatasource }          from './models';
import { currentTransformation }      from './models';
import { dashboard }                  from './models';
import { datasource }                 from './models';
import { CSScolor }                   from './models';
import { transformation }             from './models';
import { field }                      from './models';
import { dashboardSnapshot }                   from './models';
import { fieldMetadata }              from './models';
import { dashboardTag }               from './models';
import { dashboardTheme }             from './models';
import { dashboardTemplate }          from './models';
import { dashboardSchedule }          from './models';
import { dashboardComment }           from './models';
import { dashboardPermission }        from './models';
import { dataQualityIssue}            from './models'
import { datasourceFilter}            from './models'
import { datasourcePermission}        from './models'
import { buttonBarAvailable}          from './models'
import { buttonBarSelected }          from './models';
import { widgetNote }                 from './models';
import { canvasAlert }                from './models';
import { canvasMessage }              from './models';
import { canvasActivity }             from './models';
import { canvasWidget }               from './models';

import * as dl from 'datalib';

// import { CanvasUser }                 from './model.user';
const datasourcePermissions: datasourcePermission[] = 
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

const dashboardPermissions: dashboardPermission[] = 
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

const localWidgets: canvasWidget[] =
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
        containerTop: 140,
        containerWidth: 250,
        containerZindex: 20,
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
        containerZindex: 20,
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
        containerZindex: 20,
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

    // ,
    // {
    //     id: 2,
    //     name: 'line chart',
    //     description: 'bla-bla-bla',
    //     isSelected: false,
    //     datasetID: 1,
    //     containerBackgroundcolor: 'transparent',
    //     containerBorder: '',
    //     containerBoxshadow: '',
    //     containerColor: 'orange',
    //     containerFontsize: 12,
    //     containerHeight: 300,
    //     containerLeft: 350,
    //     containerWidgetTitle: 'Title Line',
    //     containerTop: 140,
    //     containerWidth: 250,
    //     containerZindex: 20,
    //     graphSpecification: {
    //         "data": {"url": "../assets/vega-datasets/cars.json"},
    //         "mark": "bar",
    //         "encoding": {
    //             "x": {"field": "Horsepower", "type": "quantitative"},
    //             "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
    //         }
    //     }

    // },
    // {
    //     id: 3,
    //     name: 'line chart',
    //     description: 'bla-bla-bla',
    //     isSelected: false,
    //     datasetID: 1,
    //     containerBackgroundcolor: 'transparent',
    //     containerBorder: '',
    //     containerBoxshadow: '',
    //     containerColor: 'orange',
    //     containerFontsize: 12,
    //     containerHeight: 300,
    //     containerLeft: 650,
    //     containerWidgetTitle: 'Title Line',
    //     containerTop: 140,
    //     containerWidth: 430,
    //     containerZindex: 20,
    //     graphSpecification: {
    //         "data": {"url": "../assets/vega-datasets/seattle-weather.csv"},
    //         "mark": "bar",
    //         "encoding": {
    //           "x": {
    //             "timeUnit": "month",
    //             "field": "date",
    //             "type": "ordinal"
    //           },
    //           "y": {
    //             "aggregate": "count",
    //             "field": "*",
    //             "type": "quantitative"
    //           },
    //           "color": {
    //             "field": "weather",
    //             "type": "nominal"
    //           }
    //         }
    //     }
    // }
]
const canvasMessages: canvasMessage[] =
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

// Constants - to be replaced with DB access
const  canvasActivities: canvasActivity[] =
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

const canvasAlerts: canvasAlert[] = 
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

const widgetNotes: widgetNote[] = 
[
    {
        id: 1,
        dashboardID: 2,
        widgetID: 4,
        noteText: 'Checkpoints show more detail',
        updatedBy: 'MarcoD',
        updatedOn: '2017/01/01'
    }
]
const shapeButtonsAvailable: buttonBarAvailable[] =
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

const shapeButtonsSelected: buttonBarSelected[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Shape, for example the color of a circle.',
        sortOrder: 1
    }
]

const widgetButtonsAvailable: buttonBarAvailable[] =
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
        buttonText: 'Notes',
        description: 'Show the notes linked to the selected Widget.',
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

const widgetButtonsSelected: buttonBarSelected[] =
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

const datasourceFilters: datasourceFilter[] =
[
    {
        id: 1,
        fieldName: 'symbol',
        operator: 'Equal',
        filterValue: 'MSFT'
    },
    {
        id: 1,
        fieldName: 'price',
        operator: 'GreaterEqual',
        filterValue: '100'
    }
]

const dataQualityIssues: dataQualityIssue[] =
[
    {
        id: 1,
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

const dashboardComments: dashboardComment[] =
[
    {
        id: 1,
        dashboardID: 42,
        comment: 'We need to investigate the quality of the data',
        creator: 'GerhardD',
        createdOn: '2017/01/01'
    }
]

const dashboardSchedules: dashboardSchedule[] =
[
    {
        id: 1,
        dashboardID: 12,
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

const dashboardThemes: dashboardTheme[] =
[
    {
        id: 1,
        name: 'Theme basic',
        description: 'bla-bla-bla'
    }
]

const dashboardTemplates: dashboardTemplate[] =
[
    {
        id: 1,
        name: 'Corporate Logo and Name',
        description: 'bla-bla-bla'
    }
]

const dashboardTags: dashboardTag[] =
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

const snapshots: dashboardSnapshot[] =
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

const dashboards: Partial<dashboard>[] =
[
    {
        id: 1,
        state: 'Draft',
        version: 1,
        name: 'Market Overview',
        description: 'Economic indicator summary',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 4
    },
    {
        id: 2,
        state: 'Pending',
        version: 1,
        name: 'Costing Summary',
        description: 'Costing Summary',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 0
    },
    {
        id: 3,
        state: 'Complete',
        version: 1,
        name: 'Home Budget',
        description: 'Home Budget',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 21
    },
    {
        id: 4,
        state: 'Complete',
        version: 1,
        name: 'Bitcoin sales',
        description: 'Bitcoin sales',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 4
    },
    {
        id: 5,
        state: 'Pending',
        version: 1,
        name: 'Cycling routes',
        description: 'Cycling routes',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 14
    }
];

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

const currentDatasources: currentDatasource [] = [];

const datasources: currentDatasource [] =
[
    {
        id: 1,
        name: 'My Expenses',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 2,
        name: 'Bitcoin Trades',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 3,
        name: 'My Budget',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 4,
        name: 'Bicycle Sales',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 5,
        name: 'Bond Valuation',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 6,
        name: 'Auditors',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 7,
        name: 'Student Marks',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 8,
        name: 'Security Breaches',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 9,
        name: 'Milk Proteins',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 10,
        name: 'Malaria Cases',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 11,
        name: 'Investments',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 12,
        name: 'Bridge Maintenance',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 13,
        name: 'Parts in storage',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 14,
        name: 'Customer Complaints',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 15,
        name: 'Issues',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 16,
        name: 'Tickets',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 17,
        name: 'Clothing lines',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 18,
        name: 'Shoe Sales',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    }

];

const fields: field[] =
[
    {
        id: 1,
        name: 'DateTrade',
        type: 'Date',
        format: '',
        filter: '',
        calc: '',
        order: 'Asc 1'
    },
    {
        id: 2,
        name: 'Share',
        type: 'Text',
        format: '',
        filter:  '',
        calc:  '',
        order: ''
    },
    {
        id: 3,
        name: 'Volume',
        type: 'Number',
        format: 'Integer',
        filter: '',
        calc:  '',
        order: ''
    },
    {
        id: 4,
        name: 'Value',
        type: 'Number',
        format: '2 decimals',
        filter: '> 1m',
        calc: 'Volume * 10',
        order: ''
    }
];

const fieldsMetadata: fieldMetadata[] =
[
    {
        name: 'DateTrade',
        type: 'Date',
        description: 'Date on which trade when through trading system',
        keyField: false,
        explainedBy: ''
    },
    {
        name: 'Share',
        type: 'String',
        description: 'Name of share (stock) that traded, ie Anglo American plc',
        keyField: true,
        explainedBy: 'Bar of new Listings per Month'
    },
    {
        name: 'Volume',
        type: 'Number',
        description: 'Number of instruments traded.  Single counted, excluding BR, YT trade types.',
        keyField: false,
        explainedBy: 'Pie of Trades by Broker'
    },
    {
        name: 'Value',
        type: 'Number',
        description: 'Value in Rand of the instruments traded, based on Volume and Price.',
        keyField: false,
        explainedBy: 'Custom Query: TradeAttribution'
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

const transformationsFormat: transformation[] =
[
    {
        id: 1,
        category: 'Column-level',
        name: 'FormatDate',
        description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.'
    },
    {
        id: 16,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second'
    },
    {
        id: 20,
        category: 'Column-level',
        name: 'FormatNumber',
        description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’'
    }
];

const currentTransformations: currentTransformation[] =
[
    {
        id: 1,
        category: 'Format',
        name: 'FillBlanks',
        description: 'bla-bla-bla',
        fieldID: 231,
        fieldName: 'Region',
        parameters: ""
    }
]

const transformationsFill: transformation[] =
[
    {
        id: 2,
        category: 'Column-level',
        name: 'FillBlanks',
        description: '(columnName, newValue)'
    },
    {
        id: 3,
        category: 'Column-level',
        name: 'FillNull',
        description: '(columnName, newValue)'
    },
    {
        id: 4,
        category: 'ColucurrentTransformationsmn-level',
        name: 'FillBlankAndNull',
        description: '(columnName, newValue)'
    }
];

const transformationsGeo: transformation[] =
[
    {
        id: 21,
        category: 'Column-level',
        name: 'AddLatitude',
        description: '(reference-columnName, new-columnName), add a new column with latitude, based on the information in the reference-columnName'
    },
    {
        id: 22,
        category: 'Column-level',
        name: 'AddLongitude',
        description: '(reference-columnName, new-columnName), add a new column with longitude, based on the information in the reference-columnName'
    }
];

const transformationsReplace: transformation[] =
[
    {
        id: 5,
        category: 'Column-level',
        name: 'ReplaceNumbers',
        description: '(columnName, from, to, newValue)'
    },
    {
        id: 6,
        category: 'Column-level',
        name: 'ReplaceString',
        description: '(columnName, oldValue, newValue)'
    }
];

const transformationsAddColumn: transformation[] =
[
    {
        id: 7,
        category: 'Column-level',
        name: 'AppendColumn',
        description: '(newColumnName, dataType, fillValue)'
    },
    {
        id: 10,
        category: 'Column-level',
        name: 'CalcColumn',
        description: '(newColumnName, columnOne, columnTwo, Operator, fillValue)'
    },
    {
        id: 17,
        category: 'Column-level',
        name: 'Concatenate',
        description: '(columnNameOne, ColumnNameTwo)'
    }
];

const transformationsTrim: transformation[] =
[
    {
        id: 12,
        category: 'Column-level',
        name: 'LeftTrim',
        description: '(columnName)'
    },
    {
        id: 13,
        category: 'Column-level',
        name: 'RightTrim',
        description: '(columnName)'
    },
    {
        id: 14,
        category: 'Column-level',
        name: 'Trim',
        description: '(columnName), which combines LeftTrim and RightTrim'
    }
];

const transformationsPortion: transformation[] =
[
    {
        id: 11,
        category: 'Column-level',
        name: 'Substring',
        description: '(columnName, startPosition, length)'
    },
    {
        id: 15,
        category: 'Column-level',
        name: 'RightSubstring',
        description: '(columnName, startPosition, length) is similar to Substring, but startPosition is counted from the right.'
    },
    {
        id: 16,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second'
    },
    {
        id: 18,
        category: 'Column-level',
        name: 'ConcatenateColumn',
        description: '(columnName, preString, postString) will append strings to the front or back of a column'
    },
];

const dataServer: datasource[] =
[
    {
        id: 1,
        name: 'World Indices',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'SP Companies*',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Stock prices TEMP',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Trades per Year',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Bond volume trades',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Trades by Trade Type',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'YTD Expenditure by Cost Center',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Headcount',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Customer List',
        type: 'Xls File',
        description: ''
    }
];

const dataRecent: datasource[] =
[
    {
        id: 1,
        name: 'CPI figures',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'GDP by Country',
        type: 'Xls File',
        description: ''
    }
];

const dataSample: datasource[] =
[
    {
        id: 1,
        name: 'Bicycle trips in Rome',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Vega Airport Dataset',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Test1',
        type: 'Xls File',
        description: ''
    }
];

@Injectable()
export class GlobalVariableService {
    dashboardTags: dashboardTag[] = dashboardTags;
    dataGetFromSwitch = new BehaviorSubject<string>('File');
    snapshots: dashboardSnapshot[] = snapshots;
    dashboards: Partial<dashboard>[] = dashboards;
    currentTransformations: currentTransformation[] = currentTransformations;
    backgroundcolors: CSScolor[] = backgroundcolors;
    currentDatasources = new BehaviorSubject<currentDatasource[]>(currentDatasources);
    datasources: currentDatasource[] = datasources;
    dataQualityIssues: dataQualityIssue[] = dataQualityIssues;
    localDashboards: dl.spec.TopLevelExtendedSpec[] = localDashboards;
    // localDashboards = new BehaviorSubject<dl.spec.TopLevelExtendedSpec[]>(localDashboards);
    datasourceFilters: datasourceFilter[] = datasourceFilters;
    transformationsFormat: transformation[] = transformationsFormat;
    fields: field[] = fields;
    fieldsMetadata: fieldMetadata[] = fieldsMetadata;
    dataServer: datasource[] = dataServer;
    dataRecent: datasource[] = dataRecent;
    dataSample: datasource[] = dataSample;
    dashboardThemes: dashboardTheme[] = dashboardThemes;
    dashboardTemplates: dashboardTemplate[] = dashboardTemplates;
    dashboardSchedules: dashboardSchedule[] = dashboardSchedules;
    dashboardComments: dashboardComment[] = dashboardComments;
    duplicateDashboard = new BehaviorSubject<boolean>(false);    
    editMode = new BehaviorSubject<boolean>(false);
    shapeButtonsAvailable: buttonBarAvailable[] = shapeButtonsAvailable;
    widgetNotes: widgetNote[] = widgetNotes;
    shapeButtonsSelected: buttonBarSelected[] = shapeButtonsSelected;
    statusBarRunning = new BehaviorSubject<string>('No Query running');
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessages = new BehaviorSubject<string>('1 Message');
    widgetButtonsAvailable: buttonBarAvailable[] = widgetButtonsAvailable;
    widgetButtonsSelected: buttonBarSelected[] = widgetButtonsSelected;
    canvasMessages: canvasMessage[] =  canvasMessages;
    localWidgets = new BehaviorSubject< canvasWidget[]>(localWidgets);
    dashboardPermissions: dashboardPermission[] = dashboardPermissions;
    localTrash = new BehaviorSubject< canvasWidget[]>([]);
    canvasActivities: canvasActivity[] = canvasActivities;
    canvasAlerts: canvasAlert[] = canvasAlerts;

    showModalLanding: boolean = false;  // Shows Landing page
    showMainMenu = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboard = new BehaviorSubject<boolean>(false);
    isFirstTimeDashboardOpen = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardSave = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardDiscard = new BehaviorSubject<boolean>(true);
    isFirstTimePresentation = new BehaviorSubject<boolean>(true);
    isFirstTimeWidgetLinked = new BehaviorSubject<boolean>(true);
    isFirstTimeDataCombination = new BehaviorSubject<boolean>(true);


    presentation = new BehaviorSubject<boolean>(false);
    showGrid = new BehaviorSubject<boolean>(false);
    xlOpenGetDataWizard: boolean = false;                          // Open/Not the Get Data Wizard
    // Company related variables
    // companyName: string = 'Clarity Analytics';                  // Optional, set in SystemConfig
    // companyLogo: string = '';                                   // Optional file name, set in SystemConfig

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
    sessionDebugging: boolean = false;
    sessionLogging: boolean = false;
    // sessionLoadOnOpenDashboardID: number = null;   // Dashboard to load when form opens, 0 = none
    // sessionLoadOnOpenDashboardName: string = '';   // Dashboard to load when form opens, '' = none

    // At startup
    // startupDashboardID: number = 0;                             // Dashboard to load @start, 0 = none
    // startupDashboardTabID: number = 0;                          // Tab ID to load @start, -1 = none
    // startupMessageToShow: string = '';                          // Message to show at start

    // Environment
    // testEnvironmentName: string = '';                           // Spaces = in PROD

    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    // dirtyDataTextAlignDropdown: boolean = true;
    // dirtyDataBorderDropdown: boolean = true;
    // dirtyDataBoxShadowDropdown: boolean = true;
    // dirtyDataBackgroundImageDropdown: boolean = true;
    // dirtyDataDashboardTab: boolean = true;
    // dirtyDataCanvasMessage: boolean = true;
    // dirtyDataCanvasMessageRecipient: boolean = true;
    // dirtyDataDashboardTag: boolean = true;
    // dirtyDataDashboardTagMembership: boolean = true;
    // dirtyDataDashboard: boolean = true;
    // dirtyDataDatasource: boolean = true;
    // dirtyDataFilter: boolean = true;
    // dirtyDataFontSizeDropdown: boolean = true;
    // dirtyDataFontWeightDropdown: boolean = true;
    // dirtyDataGraphType: boolean = true;
    // dirtyDataGridSizeDropdown: boolean = true;
    // dirtyDataGroup: boolean = true;
    // dirtyDataImageSourceDropdown: boolean = true;
    // dirtyDataPackageTask: boolean = true;
    // dirtyDataReport: boolean = true;
    // dirtyDataReportWidgetSet: boolean = true;
    // dirtyDataReportHistory: boolean = true;
    // dirtyDataSystemConfiguration: boolean = true;
    // dirtyDataTextMarginDropdown: boolean = true;
    // dirtyDataTextPaddingDropdown: boolean = true;
    // dirtyDataTextPositionDropdown: boolean = true;
    // dirtyDataWidget: boolean = true;
    // dirtyDataWidgetTemplate: boolean = true;
    // dirtyDataWidgetType: boolean = true;
    // dirtyDataUser: boolean = true;

    // System & operation config
    // averageWarningRuntime: number = 0;
    // defaultWidgetConfiguration: string = '';
    // dashboardIDStartup: number = null;
    // defaultReportFilters: string = '';
    // environment: string = '';
    // frontendColorScheme: string = '';
    // growlSticky: boolean = false;
    // growlLife: number = 3000;
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

    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage = this.messageSource.asObservable();
    menuCreateDisabled = new BehaviorSubject<boolean>(true);

    constructor() { }

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
    currentDatasourceAdd(newData: currentDatasource) {
        this.currentDatasources.value.push(newData);
        console.log('yy', this.currentDatasources.value)
    }

}