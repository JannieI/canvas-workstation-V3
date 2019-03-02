// List of templates used in the code

import { CanvasSettings }             from './models';
import { Dashboard }                  from './models';
import { DashboardTab }               from './models';
import { Transformation }             from './models';
import { TributaryServerType }        from './models';
import { Widget }                     from './models';
import * as dl                        from 'datalib';

export const vlTemplate: dl.spec.TopLevelExtendedSpec =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",

        // Properties for top-level specification (e.g., standalone single view specifications)
        "background": "",
        "padding": {"left": 5, "top": 5, "right": 5, "bottom": 5},
        "height": "100",
        "width": "100",
        "autosize": "fit",
        // "autosize": "",          NB - add these only if needed, blank causes no graph display
        // "config": "",            NB - add these only if needed, blank causes no graph display

        // Properties for any specifications
        "title":
            {
                "text": "",
                "anchor": "",
                "offset": "",
                "orient": "",
                "style": ""
            },
        "name": "",
        "transform": "",

        "description": "",
        "data": null,
        "mark":
            {
                "type": "",  //bar circle square tick line area point rule text
                "style": "",
                "clip": "",
                "color": "#4682b4"
            },
        "encoding":
            {
                "color":
                    {
                        "field": "",
                        "type": ""
                    },
                "x":
                    {
                        "aggregate": "",
                        "field": "",
                        "type": "ordinal",
                        "bin": "",
                        "timeUnit": "",
                        "axis":
                        {
                            "title": ""
                        },
                        "scale": "",
                        "legend": "",
                        "format": "",
                        "stack": "",
                        "sort": "",
                        "condition": ""
                    },
                "y":
                    {
                        "aggregate": "",
                        "field": "",
                        "type": "quantitative",
                        "bin": "",
                        "timeUnit": "",
                        "axis":
                            {
                                "title": ""
                            },
                        "scale": "",
                        "legend": "",
                        "format": "",
                        "stack": "",
                        "sort": "",
                        "condition": ""
                        }
            }
    };

export const widgetTemplateInner: any = {

    // Mark
    "graphMark": "",
    "graphMarkOrient": "",
    "graphMarkLine": false,
    "graphMarkPoint": false,
    "graphMarkPointColorName": "",
    "graphMarkPointColor": "",
    "graphMarkColourName": "",
    "graphMarkColour": "",
    "graphMarkCornerRadius": 0,
    "graphMarkExtent": "",
    "graphMarkOpacity": 1,
    "graphMarkBinSpacing": 0,
    "graphMarkSize": "",
    "graphMarkInterpolate": "",

    // X
    "graphXfield": "",
    "graphXaggregateName": "",
    "graphXaggregate": "",
    "graphXtimeUnit": "",
    "graphXbin": false,
    "graphXMaxBins": 0,
    "graphXformat": "",
    "graphXimpute": "",
    "graphXimputeValue": "",
    "graphXstack": "",
    "graphXsort": "",
    "graphXtype": "",
    "graphXtypeName": "",

    // Y
    "graphYfield": "",
    "graphYaggregateName": "",
    "graphYaggregate": "",
    "graphYbin": false,
    "graphYMaxBins": 0,
    "graphYformat": "",
    "graphYimpute": "",
    "graphYimputeValue": 0,
    "graphYstack": "",
    "graphYsort": "",
    "graphYtimeUnit": "",
    "graphYtype": "",
    "graphYtypeName": "",

    // Color
    "graphColorField": "",
    "graphColorAggregateName": "",
    "graphColorAggregate": "",
    "graphColorBin": false,
    "graphColorMaxBins": 0,
    "graphColorFormat": "",
    "graphColorImpute": "",
    "graphColorImputeValue": "",
    "graphColorScheme": "blues",
    "graphColorSort": "",
    "graphColorStack": "",
    "graphColorType": "",
    "graphColorTypeName": "",
    "graphColorTimeUnit": "",

    // X Axis
    "graphXaxisFormat": "",
    "graphXaxisGrid": true,
    "graphXaxisGridColorName": "",
    "graphXaxisGridColor": "",
    "graphXaxisLabels": true,
    "graphXaxisLabelAngle": 0,
    "graphXaxisLabelColorName": "",
    "graphXaxisLabelsLength": 0,
    "graphXaxisLabelColor": "",
    "graphXaxisTitle": "",
    "graphXaxisTitleCheckbox": true,
    "graphXaxisScaleType": "",

    // Y Axis
    "graphYaxisFormat": "",
    "graphYaxisGrid": true,
    "graphYaxisGridColorName": "",
    "graphYaxisGridColor": "",
    "graphYaxisLabels": true,
    "graphYaxisLabelAngle": 0,
    "graphYaxisLabelColorName": "",
    "graphYaxisLabelColor": "",
    "graphYaxisScaleType": "",
    "graphYaxisTitle": "",
    "graphYaxisTitleCheckbox": true,

    // Legend
    "graphLegendAxisScaleType": "",
    "graphLegendHide": false,
    "graphLegendTitleCheckbox": true,
    "graphLegendTitle": "",
    "graphLegendFormat": "",
    "graphLegendLabels": true,
    "graphLegendLabelColorName": "",
    "graphLegendLabelColor": "",

    // Size
    "graphSizeField": "",
    "graphSizeType": "",
    "graphSizeTypeName": "",
    "graphSizeAggregateName": "",
    "graphSizeAggregate": "",
    "graphSizeBin": false,
    "graphSizeMaxBins": 0,

    // Row
    "graphRowField": "",
    "graphRowType": "",
    "graphRowTypeName": "",

    // Column
    "graphColumnField": "",
    "graphColumnType": "",
    "graphColumnTypeName": "",

    // Detail
    "graphDetailField": "",
    "graphDetailType": "",
    "graphDetailTypeName": "",

    // X2
    "graphX2Field": "",
    "graphX2Type": "",
    "graphX2TypeName": "",
    "graphX2AggregateName": "",

    // Y2
    "graphY2Field": "",
    "graphY2Type": "",
    "graphY2TypeName": "",
    "graphY2AggregateName": "",

    // Projection
    "graphProjectionType": "",
    "graphProjectionFieldLatitude": "",
    "graphProjectionFieldLongitude": ""
}; 

export const widgetTemplate: Widget =
    {
        "widgetType": "",
        "widgetSubType": "",
        "isLocked": false,
        "dashboardID": null,
        "dashboardTabID": null,
        "dashboardTabIDs": [],
        "id": null,
        "originalID": null,
        "name": "New Widget",
        "description": "New Widget from Template",
        "annotation": '',
        "annotationLastUserID": "",
        "annotationLastUpdated": null,
        "visualGrammar": "Vega-Lite",
        "visualGrammarType": 'standard',
        "version": 1,
        "isSelected": false,
        "isLiked": false,
        "nrDataQualityIssues": 0,
        "nrComments": 0,
        "showCheckpoints": false,
        "checkpointIDs": [],
        "currentCheckpoint": 0,
        "lastCheckpoint": -1,
        "hyperlinkDashboardID": null,
        "hyperlinkDashboardTabID": null,
        "containerStyleID": null,

        "datasourceID": null,
        "data": null,
        "dataFields": null,
        "dataFieldTypes": null,
        "dataFieldLengths": null,
        "dataschema": null,
        "datasetID": null,
        "dataParameters": [],
        "reportID": null,
        "reportName": "",
        "rowLimit": null,
        "addRestRow": false,
        "size": "",

        "containerBackgroundcolor": "transparent",
        "containerBackgroundcolorName": "transparent",
        "containerBorder": "1px solid gray",
        "containerBorderColourName" : "1px solid gray",
        "containerBorderRadius": "6px",
        "containerBoxshadow": "none",
        "containerFontsize": 12,
        "containerHeight": 320,
        "containerLeft": 10,
        "containerHasContextMenus": false,
        "containerHasTitle": false,
        "containerTop": 80,
        "containerWidth": 410,
        "containerZindex": 50,

        "graphLayerFacet": "Single",
        "graphLayers": [
            {
                // Optional Specification, used for Custom graphTypes
                "graphSpecification": null,

                // Mark
                "graphMark": "",
                "graphMarkOrient": "",
                "graphMarkLine": false,
                "graphMarkPoint": false,
                "graphMarkPointColorName": "",
                "graphMarkPointColor": "",
                "graphMarkColourName": "",
                "graphMarkColour": "",
                "graphMarkCornerRadius": 0,
                "graphMarkExtent": "",
                "graphMarkOpacity": 1,
                "graphMarkBinSpacing": 0,
                "graphMarkSize": 20,
                "graphMarkInterpolate": "",

                // X
                "graphXfield": "",
                "graphXaggregateName": "",
                "graphXaggregate": "",
                "graphXtimeUnit": "",
                "graphXbin": false,
                "graphXMaxBins": 0,
                "graphXformat": "",
                "graphXimpute": "",
                "graphXimputeValue": 0,
                "graphXstack": "",
                "graphXsort": "",
                "graphXtype": "",
                "graphXtypeName": "",

                // Y
                "graphYfield": "",
                "graphYaggregateName": "",
                "graphYaggregate": "",
                "graphYbin": false,
                "graphYMaxBins": 0,
                "graphYformat": "",
                "graphYimpute": "",
                "graphYimputeValue": 0,
                "graphYstack": "",
                "graphYsort": "",
                "graphYtimeUnit": "",
                "graphYtype": "",
                "graphYtypeName": "",

                // Color
                "graphColorField": "",
                "graphColorAggregateName": "",
                "graphColorAggregate": "",
                "graphColorBin": false,
                "graphColorMaxBins": 0,
                "graphColorFormat": "",
                "graphColorImpute": "",
                "graphColorImputeValue": 0,
                "graphColorScheme": "blues",
                "graphColorSort": "",
                "graphColorStack": "",
                "graphColorType": "",
                "graphColorTypeName": "",
                "graphColorTimeUnit": "",

                // X Axis
                "graphXaxisFormat": "",
                "graphXaxisGrid": true,
                "graphXaxisGridColorName": "",
                "graphXaxisGridColor": "",
                "graphXaxisLabels": true,
                "graphXaxisLabelAngle": 0,
                "graphXaxisLabelColorName": "",
                "graphXaxisLabelsLength": 0,
                "graphXaxisLabelColor": "",
                "graphXaxisScaleType": "",
                "graphXaxisScaleDomainStart": "",
                "graphXaxisScaleDomainEnd": "",
                "graphXaxisTitle": "",
                "graphXaxisTitleCheckbox": true,

                // Y Axis
                "graphYaxisFormat": "",
                "graphYaxisGrid": true,
                "graphYaxisGridColorName": "",
                "graphYaxisGridColor": "",
                "graphYaxisLabels": true,
                "graphYaxisLabelAngle": 0,
                "graphYaxisLabelColorName": "",
                "graphYaxisLabelColor": "",
                "graphYaxisLabelsLength": 0,
                "graphYaxisScaleType": "",
                "graphYaxisScaleDomainStart": "",
                "graphYaxisScaleDomainEnd": "",
                "graphYaxisTitle": "",
                "graphYaxisTitleCheckbox": true,

                // Legend
                "graphLegendAxisScaleType": "",
                "graphLegendHide": false,
                "graphLegendTitleCheckbox": true,
                "graphLegendTitle": "",
                "graphLegendFormat": "",
                "graphLegendLabels": true,
                "graphLegendLabelColorName": "",
                "graphLegendLabelColor": "",
                "graphLegendLabelsLength" : 0,

                // Size
                "graphSizeField": "",
                "graphSizeType": "",
                "graphSizeTypeName": "",
                "graphSizeAggregateName": "",
                "graphSizeAggregate": "",
                "graphSizeBin": false,
                "graphSizeMaxBins": 0,

                // Row
                "graphRowField": "",
                "graphRowType": "",
                "graphRowTypeName": "",
                "graphRowTitleCheckbox" : true,
                "graphRowTitle" : "",

                // Column
                "graphColumnField": "",
                "graphColumnType": "",
                "graphColumnTypeName": "",
                "graphColumnTitleCheckbox" : true,
                "graphColumnTitle" : "",

                // Detail
                "graphDetailField": "",
                "graphDetailType": "",
                "graphDetailTypeName": "",

                // X2
                "graphX2Field": "",
                "graphX2Type": "",
                "graphX2TypeName": "",
                "graphX2AggregateName": "",

                // Y2
                "graphY2Field": "",
                "graphY2Type": "",
                "graphY2TypeName": "",
                "graphY2AggregateName": "",

                // Projection
                "graphProjectionType": "",
                "graphProjectionFieldLatitude": "",
                "graphProjectionFieldLongitude": "",

                // Condition
                "conditionColourName": "",
                "conditionColour": "",
                "conditionFieldName": "",
                "conditionOperator": "",
                "conditionValue": "",
                "conditionValueFrom": "",
                "conditionValueTo": "",
            }
        ],

        "graphUrl": "",
        "graphData": "",

        "graphTitleText": "",
        "graphTitleAnchor": "Middle",
        "graphTitleAngle": 0,
        "graphBackgroundColorName": "transparent",
        "graphBackgroundColor": "transparent",
        "graphBorderColorName": "lightgray",
        "graphBorderColor": "lightgray",

        "graphTitleBaseline": "Bottom",
        "graphTitleColorName": "Gray",
        "graphTitleColor": "Gray",
        "graphTitleFont": "",
        "graphTitleFontSize": 10,
        "graphTitleFontWeight": 400,
        "graphTitleLength": 0,
        "graphTitleOrientation": "Top",

        "graphTransformations": [{
            "id": 0,
            "sequence": 0,
            "transformationType": ""
        }],
        "graphCalculations": [],
        "graphFilters": [],
        "sampleNumberRows": 0,

        "titleText": "Title of new Widget",
        "titleBackgroundColor": "lightgray",
        "titleBackgroundColorName": "lightgray",
        "titleBorder": "",
        "titleBorderName": "",
        "titleColor": "black",
        "titleColorName": "black",
        "titleFontsize": 12,
        "titleFontWeight": "",
        "titleHeight": 24,
        "titleMargin": "0",
        "titlePadding": "0 0 0 5px",
        "titleTextAlign": "center",
        "titleWidth": 100,
        "graphHeight": 240,
        "graphLeft": 1,
        "graphTop": 1,
        "graphWidth": 240,
        "graphDimensionRight": 140,
        "graphDimensionLeft": 80,
        "graphDimensionBottom": 70,
        "graphGraphPadding": 1,
        "graphHasSignals": false,
        "graphFillColor": "",
        "graphHoverColor": "",
        "graphPanAndZoom": false,
        "graphDescription": "",
        "tableBackgroundColor" : "",
        "tableBackgroundColorName" : "",
        "tableColor": "",
        "tableColorName": "",
        "tableCols": 1,
        "fontSize": 12,
        "tableHeight": 1,
        "tableHideHeader": false,
        "tableLeft": 1,
        "tableLineHeight": 12,
        "tableRows": 1,
        "tableTop": 1,
        "tableWidth": 1,
        "slicerAddRest": false,
        "slicerAddRestValue": false,
        "slicerBins": null,
        "slicerColor": "gray",
        "slicerFieldName": "",
        "slicerNumberToShow": '',
        "slicerSelection": null,
        "slicerSortField": '',
        "slicerSortFieldOrder": '',
        "slicerType": "",
        "shapeBullet": [],
        "shapeBulletStyleType": "",
        "shapeBulletsOrdered": false,
        "shapeBulletMarginBottom": 3,
        "shapeCorner": 15,
        "shapeFill": "",
        "shapeFillName": "",
        "shapeFontSize": 24,
        "shapeLineHeight": "normal",
        "shapeLineLength": 66,
        "shapePath": "",
        "shapeFontFamily": "",
        "shapeImageUrl": "",
        "shapeIsBold": true,
        "shapeIsItalic": false,
        "shapeOpacity": 1,
        "shapeRotation": 0,
        "shapeSize": 1,
        "shapeStroke": "",
        "shapeStrokeName": "",
        "shapeStrokeWidth": "",
        "shapeSvgHeight": 30,
        "shapeSvgWidth": 30,
        "shapeText": "",
        "shapeTextDisplay": "",
        "shapeTextAlign": 'Left',
        "shapeTextColour": "",
        "shapeTextColourName": "",
        "shapeValue": "",
        "refreshMode": "",
        "refreshFrequency": 1,
        "widgetRefreshedOn": "",
        "widgetRefreshedBy": "",
        "widgetCreatedOn": null,
        "widgetCreatedBy": "",
        "widgetUpdatedOn": null,
        "widgetUpdatedBy": ""
    };

export const dashboardTemplate: Dashboard =
{
    id: null,
    originalID: null,
    draftID: null,
    version: 0,
    state: 'Draft',
    code: '',
    name: '',
    description: '',
    accessType: 'Private',
    password: '',
    refreshMode: '',
    refreshTimer: 0,
    defaultTabID: 0,
    defaultExportFileType: '',
    url: '',
    qaRequired: false,
    isSample: false,
    backgroundColor: '',
    backgroundImage: '',
    templateDashboardID: 0,
    creator: '',
    dateCreated: null,
    editor: '',
    dateEdited: null,
    refresher: '',
    dateRefreshed: null,
    nrWidgets: 0,
    nrShapes: 0,
    nrRecords: 0,
    nrTimesOpened: 0,
    nrTimesChanged: 0,
    tabs: [],
    permissions: [],

    // Special info
    userCanViewList: [],
    userCanEditList: [],
    userCanDeleteList: [],
    userCanRefreshList: [],
    userCanGrantList: [],
    groupCanViewList: [],
    groupCanEditList: [],
    groupCanDeleteList: [],
    groupCanRefreshList: [],
    groupCanGrantList: []

};

export const dashboardTabTemplate: DashboardTab =
{
    id: null,
    originalID: null,
    dashboardID: 0,
    name: 'First',
    description: '',
    displayOrder: 0,            // Note: this must start at 0
    backgroundColor: '',
    backgroundColorName: '',
    color: '',
    colorName: '',
    editedBy: '',
    editedOn: null,
    createdBy: '',
    createdOn: null
};

export const transformationsFormat: Transformation[] =
[
    {
        id: 1,
        category: 'Column-level',
        name: 'FormatDate',
        description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.',
        nrParameters: 6,
        parameterPlaceholder: ['place1','place2','place3','place4','place5','place6'],
        parameterTitle: ['tit1','tit2','tit3','tit4','tit5','tit6'],
        parameterDefaultValue: ['txt1','txt2','txt3','txt4','txt5','txt6'],
        parameterHeading: ['head1','head2','head3','head4','head5','head6'],
        parameterType: ['','','','','',''],
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null
    },
    {
        id: 16,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second',
        nrParameters: 1,
        parameterPlaceholder: ['place1'],
        parameterTitle: ['tit1'],
        parameterDefaultValue: ['txt1'],
        parameterHeading: ['head1'],
        parameterType: ['','','','','',''],
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null
    },
    {
        id: 20,
        category: 'Column-level',
        name: 'FormatNumber',
        description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’',
        nrParameters: 1,
        parameterPlaceholder: ['place1'],
        parameterTitle: ['tit1'],
        parameterDefaultValue: ['txt1'],
        parameterHeading: ['head1'],
        parameterType: ['','','','','',''],
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null
    }
];

export const finalFields =
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

export const serverTypes: TributaryServerType[] =
[
    {
        serverType: 'MySQL',
        driverName: 'mysql',
        inspector: 'tributary.inspectors.sql:SqlInspector',
        connector: 'tributary.connectors.sql:SqlConnector',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null

    },
    {
        serverType: 'PostgresSQL',
        driverName: 'postgresql',
        inspector: 'tributary.inspectors.sql:SqlInspector',
        connector: 'tributary.connectors.sql:SqlConnector',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null

    },
    {
        serverType:'MicrosoftSQL',
        driverName: 'mssql',    // "mssql+pyodbc", "mssql+pymssql"
        inspector: 'tributary.inspectors.sql:SqlInspector',
        connector: 'tributary.connectors.sql:SqlConnector',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null

    },
    {
        serverType:'SQLite',
        driverName: 'sqlite',
        inspector: 'tributary.inspectors.sql:SqlInspector',
        connector: 'tributary.connectors.sql:SqlConnector',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null

    },
    {
        serverType:'Oracle',
        driverName: 'oracle',
        inspector: 'tributary.inspectors.sql:SqlInspector',
        connector: 'tributary.connectors.sql:SqlConnector',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null

    },
    {
        serverType:'Mongo',
        driverName: 'mongo',
        inspector: 'tributary.inspectors.mongodb:MongoDBInspector',
        connector: 'tributary.connectors.mongodb:MongoDBConnector',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null
    },
    {
        serverType:'MicrosoftSSAS',
        driverName: 'Microsoft SSAS',
        inspector: 'tributary.inspectors...',
        connector: 'tributary.connectors...',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null
    }
];

export const canvasSettings: CanvasSettings = {
    id: 1,
    companyName: '',
    companyLogo: '',
    dashboardTemplate: '',
    maxTableLength: 500,
    widgetsMinZindex: 50,
    widgetsMaxZindex: 59,
    gridSize: 3,
    snapToGrid: true,
    printDefault: '',
    printSize: '',
    printLayout: '',
    notInEditModeMsg: 'Not in Edit Mode (see Edit menu Option)',
    noQueryRunningMessage: 'No Query',
    queryRunningMessage: 'Query running...',
    cleanCacheOnLogin: false,
    cleanCacheOnLogout: false,
    editedBy: '',
    editedOn: null,
    createdBy: '',
    createdOn: null

};