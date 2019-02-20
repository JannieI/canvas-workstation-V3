// Service to provide global variables
import { BehaviorSubject }            from 'rxjs';
import { Injectable }                 from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
import { HttpHeaders }                from "@angular/common/http";

// Our Models
import { CanvasAction }               from './models';
import { CanvasAuditTrail }           from './models';
import { CanvasGroup }                from './models';
import { CanvasHttpResponse }         from './models';
import { CanvasMessage }              from './models';
import { CanvasSettings }             from './models';
import { CanvasTask }                 from './models';
import { CanvasUser}                  from './models';
import { Combination }                from './models';
import { CombinationDetail }          from './models';
import { CSScolor }                   from './models';
import { CurrentDashboardInfo }       from './models';
import { Dashboard }                  from './models';
import { DashboardLayout }            from './models';
import { DashboardPermission }        from './models';
import { DashboardRecent}             from './models';
import { DashboardSnapshot }          from './models';
import { DashboardSchedule }          from './models';
import { DashboardScheduleLog }       from './models';
import { DashboardSubscription }      from './models';
import { DashboardTab }               from './models';
import { DashboardTag }               from './models';
import { DataCachingTable }           from './models';
import { DataConnection }             from './models';
import { DatasourceTransformation }   from './models';
import { DatasourceSchedule }         from './models';
import { DatasourceScheduleLog }      from './models';
import { DataField }                  from './models';
import { Dataset }                    from './models';
import { DataTable }                  from './models';
import { Datasource }                 from './models';
import { DatasourcePermission}        from './models';
import { GraphCalculation }           from './models';
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';
import { StatusBarMessage }           from './models';
import { StatusBarMessageLog }        from './models';
import { Transformation }             from './models';
import { TributaryServerType }        from './models';
import { TributarySource }            from './models';
import { WebSocketMessage }           from './models';
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';
import { WidgetLayout }               from './models';
import { WidgetGraph }                from './models';
import { WidgetStoredTemplate }       from './models';

// Dexie
import Dexie                          from 'dexie';
import { CanvasAppDatabase }          from './dexieDatabase';
import { DataCachingDatabase }        from './dexieDatabase';

// TODO - to remove
import { Token }                      from './models';

// External
import * as dl                        from 'datalib';

// Environment
import { environment } from '../environments/environment';
import { message } from 'vega-lite/build/src/log';

// Vega template
const vlTemplate: dl.spec.TopLevelExtendedSpec =
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

// Widget template
const widgetTemplateInner: any = {

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

const widgetTemplate: Widget =
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
        "graphSpecification": "",
        "graphDescription": "",

        // "graphXfield": "",
        // "graphXaggregateName": "",
        // "graphXaggregate": "",
        // "graphXbin": false,
        // "graphXMaxBins": 0,
        // "graphXformat": "",
        // "graphXimpute": "",
        // "graphXimputeValue": "0",
        // "graphXstack": "",
        // "graphXsort": "",
        // "graphXtimeUnit": "",
        // "graphXtype": "ordinal",
        // "graphXtypeName": "Ordinal",

        // "graphYfield": "",
        // "graphYaggregateName": "",
        // "graphYaggregate": "",
        // "graphYbin": false,
        // "graphYMaxBins": 0,
        // "graphYformat": "",
        // "graphYimpute": "",
        // "graphYimputeValue": 0,
        // "graphYstack": "",
        // "graphYsort": "",
        // "graphYtimeUnit": "",
        // "graphYtype": "",
        // "graphYtypeName": "",

        // "graphColorField": "",
        // "graphColorAggregateName": "",
        // "graphColorAggregate": "",
        // "graphColorBin": false,
        // "graphColorMaxBins": 0,
        // "graphColorFormat": "",
        // "graphColorImpute": "",
        // "graphColorImputeValue": "",
        // "graphColorScheme": "blues",
        // "graphColorSort": "Default",
        // "graphColorStack": "",
        // "graphColorType": "",
        // "graphColorTypeName": "",
        // "graphColorTimeUnit": "",

        // "graphXaxisScaleType": "",
        // "graphXaxisTitle": "",
        // "graphXaxisTitleCheckbox": true,
        // "graphXaxisGrid": true,
        // "graphXaxisGridColorName": "gray",
        // "graphXaxisGridColor": "gray",
        // "graphXaxisFormat": "",
        // "graphXaxisLabels": true,
        // "graphXaxisLabelAngle": 0,
        // "graphXaxisLabelColorName": "",
        // "graphXaxisLabelColor": "",

        // "graphYaxisScaleType": "Default",
        // "graphYaxisTitleCheckbox": true,
        // "graphYaxisTitle": "",
        // "graphYaxisGrid": true,
        // "graphYaxisGridColorName": "gray",
        // "graphYaxisGridColor": "gray",
        // "graphYaxisFormat": "",
        // "graphYaxisLabels": true,
        // "graphYaxisLabelAngle": 0,
        // "graphYaxisLabelColorName": "",
        // "graphYaxisLabelColor": "",

        // "graphLegendAxisScaleType": "",
        // "graphLegendHide": false,
        // "graphLegendTitleCheckbox": true,
        // "graphLegendTitle": "",
        // "graphLegendFormat": "",
        // "graphLegendLabels": true,
        // "graphLegendLabelColorName": '',
        // "graphLegendLabelColor": '',

        // "graphSizeField": "",
        // "graphSizeType": "",
        // "graphSizeTypeName": "",
        // "graphSizeAggregateName": "",
        // "graphSizeAggregate": "",
        // "graphSizeBin": true,
        // "graphSizeMaxBins": 0,

        // "graphRowField": "",
        // "graphRowType": "",
        // "graphRowTypeName": "",

        // "graphColumnField": "",
        // "graphColumnType": "",
        // "graphColumnTypeName": "",

        // "graphDetailField": "",
        // "graphDetailType": "",
        // "graphDetailTypeName": "",

        // "graphX2Field": "",
        // "graphX2Type": "",
        // "graphX2TypeName": "",
        // "graphX2AggregateName": "",

        // "graphY2Field": "",
        // "graphY2Type": "",
        // "graphY2TypeName": "",
        // "graphY2AggregateName": "",

        // "graphProjectionType": "",
        // "graphProjectionFieldLatitude": "",
        // "graphProjectionFieldLongitude": "",

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

// Dashboard template
const dashboardTemplate: Dashboard =
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

const dashboardTabTemplate: DashboardTab =
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


// Data
const transformationsFormat: Transformation[] =
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


@Injectable()
export class GlobalVariableService {


    // Utility vars, ie used on more than one accasion:
    colourPickerClosed = new BehaviorSubject<
        {
            callingRoutine: string;
            selectedColor:string;
            cancelled: boolean
        }
    >(null);
    conditionFieldDataType: string = '';
    conditionOperator: string = '';
    continueToTransformations: boolean = false;         // True after Edit DS -> Open Transformations form
    getSource: string = 'Test';     // Where to read/write: File, Test (JSON Server), Canvas Server
    headers = new HttpHeaders().set("Content-Type", "application/json");

    selectedWidgetIDs: number[] = [];
    previousGraphEditDSID: number = -1;
    templateInUse = new BehaviorSubject<boolean>(false);
    widgetGroup = new BehaviorSubject<number[]>([]);




    // Prerequired info for Canvas
    // *********************************************************************************

    // Templates, Constants
    dashboardTemplate: Dashboard = dashboardTemplate;
    dashboardTabTemplate: DashboardTab = dashboardTabTemplate;
    vlTemplate: dl.spec.TopLevelExtendedSpec = vlTemplate;
    widgetTemplate: Widget = widgetTemplate;
    widgetTemplateInner: any = widgetTemplateInner;
    serverTypes: TributaryServerType[] =
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


    // Environment settings: Server Url, etc read from external
    ENVCanvasServerList: {
        serverName: string,
        serverHostURI: string
    }[] = environment.ENVCanvasServerList;
    ENVStartupCanvasServerName: string = environment.ENVStartupCanvasServerName;
    ENVCanvasDatabaseLocalUrlS1: string = environment.ENVCanvasDatabaseLocalUrlS1;
    ENVCanvasDatabaseLocalUrlS2: string = environment.ENVCanvasDatabaseLocalUrlS2;
    ENVCanvasDatabaseLocalUrlS3: string = environment.ENVCanvasDatabaseLocalUrlS3;
    ENVCanvasDatabaseLocalUrlS4: string = environment.ENVCanvasDatabaseLocalUrlS4;
    ENVCanvasDatabaseLocalUrlS5: string = environment.ENVCanvasDatabaseLocalUrlS5;




    // Identification info: Canvas-Server, Company, User
    // *********************************************************************************
    // TODO - get from DB, not Constants



    // User
    // *********************************************************************************

    // Current Canvas Server & User info - stored locally and used to login / verify
    canvasServerName: string = environment.ENVStartupCanvasServerName;
    currentUserID: string = '';
    currentUser: CanvasUser;                            // Current logged in user
    canvasServerURI: string = '';
    currentCompany: string = '';
    currentToken: string = '';
    loggedIntoServer = new BehaviorSubject<boolean>(true);  // Emits True when log in/out of server

    // Canvas Server Profile (and settings)
    canvasSettings: CanvasSettings = {
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

    // Company Profile (and defaults)


    // Canvas-related info and Data
    // *********************************************************************************

    // Cache of Permanent Canvas-related data read from the Canvas-Server
    // It hold full sets (all the records) but not necessarily complete (some portions like
    // the data arrays may be missing)
    actions: CanvasAction[] = [];
    backgroundcolors: CSScolor[] = [];
    canvasGroups: CanvasGroup[] = [];
    canvasUsers: CanvasUser[] = [];
    dashboardPermissions: DashboardPermission[] = [];
    dashboardsRecent: DashboardRecent[] = [];           // List of Recent Dashboards
    dashboardsRecentBehSubject = new BehaviorSubject<DashboardRecent[]>([]);  // Recently used Dashboards
    dashboards: Dashboard[] = [];
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardSnapshots: DashboardSnapshot[] = [];
    dashboardSubscriptions: DashboardSubscription[] = [];
    dashboardTabs: DashboardTab[] = [];
    dashboardTags: DashboardTag[] = [];
    datasources: Datasource[] = [];
    datasourceSchedules: DatasourceSchedule[] = [];
    datasourceScheduleLog: DatasourceScheduleLog[] = [];
    dataCachingTable: DataCachingTable[] = [];
    dataConnections: DataConnection[] = [];
    dataFields: DataField[] = [];
    datasets: any = [];                                 // List of dSets, NO data
    datasourcePermissions: DatasourcePermission[] = [];
    datasourceTransformations: DatasourceTransformation[] = [];
    dataTables: DataTable[] = [];
    finalFields: any = finalFields;
    hasNewMessage = new BehaviorSubject<boolean>(false);
    lastMessageDateTime: Date = new Date(); // Last time a caching message was received
    statusBarMessageLogs: StatusBarMessageLog[] = [];
    transformations: Transformation[] = [];
    transformationsFormat: Transformation[] = transformationsFormat;
    widgetCheckpoints: WidgetCheckpoint[] = [];
    widgets: Widget[] = [];
    widgetGraphs: WidgetGraph[] =[];
    widgetStoredTemplates: WidgetStoredTemplate[] =[];

    // TODO - delete Depricated Caching when ready ...
    // backgroundcolorsDefault: CSScolor[] = [];
    // isDirtyBackgroundColorsDefault: boolean = true;
    // canvasComments: CanvasComment[] = [];
    // isDirtyCanvasComments: boolean = true;
    // canvasAuditTrails: CanvasAuditTrail[] = [];
    // isDirtyCanvasAuditTrails: boolean = true;
    canvasMessages: CanvasMessage[] = [];
    isDirtyCanvasMessages: boolean = true;
    // dataQualityIssues: DataQualityIssue[] = [];
    // currentDataQualityIssues: DataQualityIssue[] = [];
    // isDirtyDataQualityIssues: boolean = true;
    // dataOwnerships: DataOwnership[] = [];
    // currentDataOwnerships: DataOwnership[] = [];
    // isDirtyDataOwnership: boolean = true;
    // canvasTasks: CanvasTask[] = [];
    // isDirtyCanvasTasks: boolean = true;
    // containerStyles: ContainerStyle[] = [];
    // isDirtyContainerStyles: boolean = true;
    dashboardScheduleLog: DashboardScheduleLog[] = [];
    // currentDatasourceSchedules: DatasourceSchedule[] = [];
    // isDirtyDatasourceSchedules: boolean = true;
    // dashboardThemes: DashboardTheme[] = [];
    // isDirtyDashboardThemes: boolean = true;
    dashboardLayouts: DashboardLayout[] = [];
    widgetLayouts: WidgetLayout[] = [];


    // Cache of Permanent Canvas-related data for the currentDashboard and
    // currentDatasources.  It holds complete data
    currentDashboardInfo = new BehaviorSubject<CurrentDashboardInfo>(null);      // Null when not defined
    currentDashboardName = new BehaviorSubject<string>('');
    currentDashboardPermissions: DashboardPermission[] = [];
    currentDashboards: Dashboard[] = [];
    currentDashboardSchedules: DashboardSchedule[] = [];
    currentDashboardSnapshots: DashboardSnapshot[] = [];
    currentDashboardTabs: DashboardTab[] = [];
    currentDashboardTags: DashboardTag[] = [];
    currentDatasets: any = [];                          // Used in current D, with data
    currentDatasources: Datasource[] = [];
    currentDatasourcePermissions: DatasourcePermission[] = [];
    currentPaletteButtonBar: PaletteButtonBar[];
    currentPaletteButtonsSelected= new BehaviorSubject<PaletteButtonsSelected[]>([]);
    currentTransformations: Transformation[] = [];
    changedWidget = new BehaviorSubject<Widget>(null);    // W that must be changed
    currentWidgetCheckpoints: WidgetCheckpoint[] = [];
    currentWidgets: Widget[] = [];


    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    isDirtyBackgroundColors: boolean = true;
    isDirtyCanvasGroups: boolean = true;
    isDirtyCanvasSettings: boolean = true;
    isDirtyCanvasUsers: boolean = true;
    isDirtyDashboardPermissions: boolean = true;
    isDirtyDashboards: boolean = true;
    isDirtyDashboardsRecent: boolean = true;
    isDirtyDashboardSchedules: boolean = true;
    isDirtyDashboardSnapshots: boolean = true;
    isDirtyDashboardSubscription: boolean = true;
    isDirtyDashboardTabs: boolean = true;
    isDirtyDashboardTags: boolean = true;
    isDirtyDataConnections: boolean = true;
    isDirtyDataFields: boolean = true;
    isDirtyDatasets: boolean = true;
    isDirtyDatasourcePermissions: boolean = true;
    isDirtyDatasources: boolean = true;
    isDirtyDataTables: boolean = true;
    isDirtyDatasourceTransformations: boolean = true;
    isDirtyPaletteButtonBar: boolean = true;
    isDirtyPaletteButtonsSelected: boolean = true;
    isDirtyShapes: boolean = true;
    isDirtySlicers: boolean = true;
    isDirtystatusBarMessageLogs: boolean = true;
    isDirtyTransformations: boolean = true;
    isDirtyUserPaletteButtonBar: boolean = true;
    isDirtyWidgetCheckpoints: boolean = true;
    isDirtyWidgets: boolean = true;
    isDirtyWidgetGraphs: boolean = true;




    // Global vars that guide all interactions
    // *********************************************************************************
    // Modes and Display
    editMode = new BehaviorSubject<boolean>(false);     // True/False = EditMode/ViewMode
    showGrid = new BehaviorSubject<boolean>(false);     // True to show th egrid
    showPalette = new BehaviorSubject<boolean>(true);   // True to show the palette
    preferencePaletteHorisontal = new BehaviorSubject<boolean>(true); // Palette orientation
    loadVariableOnStartup = new BehaviorSubject<boolean>(false); // True to load variables in App.ngOnInit

    // First time user
    isFirstTimeDashboardOpen = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardSave = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardDiscard = new BehaviorSubject<boolean>(true);
    isFirstTimeWidgetLinked = new BehaviorSubject<boolean>(true);
    isFirstTimeDataCombination = new BehaviorSubject<boolean>(true);
    firstAction: boolean = true;               // True if 1st action per D

    // Opening forms
    openDashboardFormOnStartup: boolean = false;
    hasDatasources = new BehaviorSubject<boolean>(false);   // Used to set menu
    showModalLanding = new BehaviorSubject<boolean>(true);  // Shows Landing page
    lastDashboardOpened: 
        {
            wasHyperlink: boolean; 
            lastDashboardID: number; 
            lastDashboardTabID: number
        } = {
            wasHyperlink: false, 
            lastDashboardID: null, 
            lastDashboardTabID: null
        };


    // Session
    dontDisturb = new BehaviorSubject<boolean>(false);   // True means dont disturb display
    dsIDs: number[] = [];           // Dataset IDs
    sessionDateTimeLoggedin: string = '';
    sessionDebugging: boolean = true;      // True to log multiple messages to Console
    sessionLogging: boolean = false;


    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.canvasSettings.noQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessage = new BehaviorSubject<StatusBarMessage>(null)

    // Dexie
    dbCanvasAppDatabase;
    dbDataCachingTable;


    constructor(
        private http: HttpClient,
    ) {

    }

     databaseInit() {
        // Initial
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables databaseInit',
                "color: black; background: lightgray; font-size: 10px",)
        };

        // Initialise 
        this.dbCanvasAppDatabase = new CanvasAppDatabase
        this.dbCanvasAppDatabase.open();
        this.dbDataCachingTable = new DataCachingDatabase;
        this.dbDataCachingTable.open();
    }

     refreshCurrentDashboardInfo(dashboardID: number, dashboardTabID: number):
        Promise<boolean> {
        // Refreshes all info related to current D
        // dashboardTabID = -1 if unknown, so get first T
        // Returns True if all worked, False if something went wrong
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables refreshCurrentDashboardInfo D,T id = ',
                "color: black; background: lightgray; font-size: 10px",
                {dashboardID}, {dashboardTabID})
        };

        // Load the current Dashboard, and Optional template.  The dependants are stakced
        // in a Promise chain, to ensure we have all or nothing ...
        return new Promise<boolean>((resolve, reject) => {
            this.getCurrentDashboard(dashboardID).then( i => {

                // Load the DashboardTabs
                this.getCurrentDashboardTabs(dashboardID).then(j => {
                    if (dashboardTabID == -1) {
                        if (j.length > 0) {dashboardTabID = j[0].id}
                    };

                    // Set T-index
                    this.currentDashboardInfo.value.currentDashboardTabIndex =
                        this.currentDashboardTabs.findIndex(t => t.id == dashboardTabID);

                    // Load Permissions for D
                    this.getCurrentDashboardPermissions(dashboardID).then( l => {

                    // Load Checkpoints for D
                    this.getCurrentWidgetCheckpoints(dashboardID).then( l => {

                    // Load Datasets
                    this.getDataset().then(m => {

                        // Load Widgets
                        this.getCurrentWidgets(dashboardID, dashboardTabID).then(n => {

                            // Load current DS
                            this.getCurrentDatasources(dashboardID).then(k => {

                                // Get info for W
                                this.getWidgetsInfo().then(n => {

                                    // Add to recent
                                    this.amendDashboardRecent(dashboardID, dashboardTabID); //.then(n => {

                                    if (this.currentDatasources.length > 0) {
                                        this.hasDatasources.next(true);
                                    } else {
                                        this.hasDatasources.next(false);
                                    }
                                    resolve(true)
                                    // })
                                })
                            })
                        })
                    })

                })
                })
                })
            });
        });
    }

    actionWebSocket(webSocketMessage: WebSocketMessage) {
        // Handles all the WebSocket messages, depending on the type messageType and Action
        // It is async, so returns a Promise<boolean>
        if (this.sessionDebugging) {
            console.log('%c        Global-Variables actionWebSocket ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        // Handle each messageType
        if (webSocketMessage.messageType == 'canvasData') {
            // Canvas-related data like dashboards, datasources, widgets, etc
            //   Actions: Individual record action: Add, Update, Delete.  Whole resource: ReplaceAll

            // Find object in localCachingTable
            let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                dct.key == webSocketMessage.objectName
            );

            // If in CachingTable, update locally
            if (dataCachingTableIndex >= 0) {

                // Set vars to use here
                let localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                let localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;
                let localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                let localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                let localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;

                // Add an object
                if (webSocketMessage.action.toLowerCase() == 'add') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id == webSocketMessage.objectID);

                            if (localVarIndex < 0) {
                                this[localVariableName].push(webSocketMessage.content);
                            };
                        };

                        // Update Current Var
                        // TODO - consider this carefully: dont think we should add stuff to
                        // currentVars, ie currentDashboards = current D selected by user
                        console.log('xx ADD Memory Updated', this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .put(webSocketMessage.content)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx Add Disc count @ end ', res);
                                    });
                            });
                        };
                    };
                };

                // Update an object
                if (webSocketMessage.action.toLowerCase() == 'update') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id == webSocketMessage.objectID);

                            if (localVarIndex >0) {
                                this[localVariableName][localVarIndex] = webSocketMessage.content;
                            };
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            let localCurrentVarIndex: number = this[localCurrentVariableName].findIndex(
                                lv => lv.id == webSocketMessage.objectID);

                            if (localCurrentVarIndex >0) {
                                this[localCurrentVariableName][localCurrentVarIndex] = webSocketMessage.content;
                            };
                        };
                        console.log('xx UPDATE Memory Updated', this[localCurrentVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                    if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(webSocketMessage.objectID)
                                .put(webSocketMessage.content)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx UPDATE Disc count @ end ', res);
                                    });
                            });
                        };
                    };
                }

                // Delete an object
                if (webSocketMessage.action.toLowerCase() == 'delete') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            this[localVariableName] = this[localVariableName].filter(
                                lv => {
                                    return lv.id != webSocketMessage.objectID
                                });
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            this[localCurrentVariableName] = this[localCurrentVariableName].filter(
                                lv => {
                                    return lv.id != webSocketMessage.objectID
                                });
                        };
                        console.log('xx DELETE Memory updated', this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {
                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(webSocketMessage.objectID)
                                .delete()
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx DELETE count @end', res);
                                    });
                            });
                        };
                    };
                };

                // Update dataCaching in Memory
                let dt: Date = new Date();
                let seconds: number = 86400;
                if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                    seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                };
                this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                    this.dateAdd(dt, 'second', seconds);
                this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                    webSocketMessage.messageDateTime;
                console.log('xx dataCachingTable memory upd', this.dataCachingTable)


                // Update dataCaching on Disc
                this.dbDataCachingTable.table("localDataCachingTable")
                    .bulkPut(this.dataCachingTable)
                    .then(res => {
                        this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                            console.warn('xx localDataCachingTable count @end', res);
                        });
                });

            };

            // If Dashboard is currently open

            // Warn user
            if(this.currentDashboardInfo.value != null) {
                if (webSocketMessage.objectName == 'dashboards'
                    &&
                    webSocketMessage.objectID == this.currentDashboardInfo.value.currentDashboardID) {
                        this.showStatusBarMessage(
                            {
                                message: 'This Dashboard has been changed',
                                uiArea: 'StatusBar',
                                classfication: 'Warning',
                                timeout: 3000,
                                defaultMessage: ''
                            }
                        );
                };
            };

            // Force refresh of Dashboard if critical
            // Consider carefulle:
            // - usecase for this
            // - how to do this elegantly, so that user is not surprised, or loses work if
            //   busy editing (which edits should not be accepted anyways)
        };

        if (webSocketMessage.messageType == 'clientData') {
            // client-related data, ie XIS Trades
            //   Actions: Refresh
        };

        if (webSocketMessage.messageType == 'canvasMessages') {
            // collaboration via Canvas Messages
            //   Actions: NewMessage
            this.hasNewMessage.next(true);
        };

        if (webSocketMessage.messageType == 'canvasSystem') {
            //system generated messages, ie from the server
            //   Actions: undetermined at the moment
        };

        return new Promise<string>((resolve, reject) => {
            // Handle the different websocket messages
            // Return a string with the error message if not okay

            setTimeout( () => {
                resolve('Success');
            }, 3000);
        });
    }

    getResource(resource: string = '', params: string = ''): Promise<any> {
        // Description: Gets the data (either from cached or HTTP), and updates
        // variables this.resource (ie this.dashboards)and cache (if from HTTP and cacheable)

        // Note: in order to use a resource, it must be defined in the Dexie.ts file.
        //       Also, it may be necessary to delete the whole IndexedDB before adding new tables ...
        if (this.sessionDebugging) {
            console.log('%c        Global-Variables getResource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };
        console.time("DURATION getResource");

        return new Promise<any>((resolve, reject) => {

            // Assume worse case that all has to be obtained from HTTP server
            let isFresh: boolean = false;
            let localCacheableMemory: boolean = false;
            let localCacheableDisc: boolean = false;
            let localVariableName: string = null;
            let localCurrentVariableName: string = '';
            let localTableName: string = '';

            // Initialise DB
            // this.dbCanvasAppDatabase = new CanvasAppDatabase
            // this.dbCanvasAppDatabase.open();
            // this.dbDataCachingTable = new DataCachingDatabase;
            // this.dbDataCachingTable.open();

            // Find DS in localCachingTable
            let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                dct.key == resource
            );

            if (dataCachingTableIndex >= 0) {
                console.log('xx inside IF')
                // Get var and table names
                localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;
                console.warn('xx vars', dataCachingTableIndex, localCacheableMemory, localCacheableDisc, localVariableName);

                // Local Memory is used, if fresh
                if (localCacheableMemory) {
                    console.log('xx in local Memory')

                    // Fresh if not expired as yet
                    let dn: Date = new Date();
                    let tn: number = dn.getTime()
                    let dl: Date = new Date(this.dataCachingTable[dataCachingTableIndex]
                        .localExpiryDateTime);
                    let tl: number = dl.getTime();
                    if (tl >= tn) {
                        isFresh = true;
                    } else {
                        isFresh = false;
                    };

                    console.log('xx fresh vars', dn, tn, dl, tl, isFresh)
                    // Use local cache variable or table if fresh
                    // TODO - check the assumption that there is data when fresh (else returns [])
                    if (isFresh) {
                        console.log('xx is FRESH')

                        // Get from Memory (local var)
                        if ( (localVariableName != null)
                                &&
                                (this[localVariableName].length != 0)
                            ) {
                            console.warn('xx data returned from Memory', this[localVariableName]);
                            // var type = 'article';
                            // this[type+'_count'] = 1000;  // in a function we use "this";
                            // alert(this.article_count);
                            resolve(this[localVariableName]);
                            console.timeEnd("DURATION getResource");
                            return;

                        // Get from Disc (Dexie)
                        } else if (localTableName != null) {
                            console.warn('xx in local Disc');
                            this.dbCanvasAppDatabase.table(localTableName)
                            .toArray()
                            .then(res => {
                                this[localVariableName] = res;
                                console.log('xx data returned from Disc', this[localVariableName])
                                resolve(this[localVariableName]);
                            });

                            //  Return, else goes through to HTTP (its async)
                            console.timeEnd("DURATION getResource");
                            return;
                        };
                    };
                };
            };
            console.warn('xx Will now try GET HTTP')

            // Get from HTTP server
            let pathUrl: string = resource + params;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
            console.log('xx finalUrl', finalUrl)
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                httpResult  => {
                    console.warn('xx inside HTTP')

                    if(httpResult.statusCode != 'success') {
                        if (this.sessionDebugging) {
                            console.log('Error getResource FAILED', {httpResult});
                        };
   
                        reject(httpResult.message);
                        console.timeEnd("DURATION getResource");
                        return;
                    };

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {
                        localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                        localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                        localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                        localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                        localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;
                        console.warn('xx vars', dataCachingTableIndex, localCacheableMemory, localCacheableDisc, localVariableName);
        
                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {
                                this[localVariableName] = [];
                                this[localVariableName] = httpResult.data;
                                console.warn('xx updated cached Memory to', this[localVariableName]);
                            };

                            // TODO - should we fill Current Var here a well?
                        };

                        // Fill Disc
                        if (localCacheableDisc) {

                            if (localTableName != null) {

                                this.dbCanvasAppDatabase.table(localTableName).clear().then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName)
                                    .bulkPut(httpResult.data)
                                    .then(resPut => {

                                        // Count
                                        this.dbCanvasAppDatabase.table(localTableName)
                                            .count(resCount => {
                                                console.warn('xx updated local Disc to', resCount);
                                        });
                                    });
                                });
                            };
                        };

                        // Update dataCaching in Memory
                        let dt: Date = new Date();
                        let seconds: number = 86400;
                        if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                            seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                        };
                        this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                            this.dateAdd(dt, 'second', seconds);
                        this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                            new Date();
                        console.log('xx dataCachingTable memory upd', this.dataCachingTable)

                        // Update dataCaching on Disc
                        this.dbDataCachingTable.table("localDataCachingTable")
                            .bulkPut(this.dataCachingTable)
                            .then(res => {
                                this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                                    console.warn('xx dataCachingTable updated count @end', res);
                                });
                        });
                    };

                    console.warn('xx data retured from HTTP', httpResult.data);
                    resolve(httpResult.data);
                    console.timeEnd("DURATION getResource");
                    return;
                },
                err => {
                    console.timeEnd("DURATION getResource");
                    if (this.sessionDebugging) {
                        console.log('Error getResource FAILED', {err});
                    };
                    reject(err.message)
                }
            );

        });
    }

    addResource(resource: string = '', data: any): Promise<any> {
        // Description: Adds a new Resource
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addResource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };
        console.time("DURATION addResource");

        return new Promise<any>((resolve, reject) => {

            // Get from HTTP server
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = resource;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                httpResult  => {
                    console.warn('xx inside POST HTTP')

                    if(httpResult.statusCode != 'success') {
                        reject(httpResult.message);
                        console.timeEnd("DURATION addResource");
                        return;
                    };

                    // Assume worse case that all has to be obtained from HTTP server
                    let isFresh: boolean = false;
                    let localCacheableMemory: boolean = false;
                    let localCacheableDisc: boolean = false;
                    let localVariableName: string = null;
                    let localCurrentVariableName: string = '';
                    let localTableName: string = '';

                    // Find DS in localCachingTable
                    let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                        dct.key == resource
                    );

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {

                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {
                                // TODO - TEST This !!!!
                                let localIndex: number = this[localVariableName].findIndex(rec =>
                                    rec.id == data.id
                                );
                                if (localIndex >= 0) {
                                    this[localVariableName][localIndex] = data;
                                };
                                console.warn('xx updated cached Memory to', this[localVariableName]);
                            };

                            // TODO - should we fill Current Var here a well?
                        };

                        // Fill Disc
                        if (localCacheableDisc) {

                            if (localTableName != null) {
                                // this.dbCanvasAppDatabase = new CanvasAppDatabase
                                // this.dbCanvasAppDatabase.open();

                                this.dbCanvasAppDatabase.table(localTableName).clear().then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName)
                                    .bulkPut(httpResult.data)
                                    .then(resPut => {

                                        // Count
                                        this.dbCanvasAppDatabase.table(localTableName)
                                            .count(resCount => {
                                                console.warn('xx updated local Disc to', resCount);
                                        });
                                    });
                                });
                            };
                        };

                        // Update dataCaching in Memory
                        let dt: Date = new Date();
                        let seconds: number = 86400;
                        if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                            seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                        };
                        this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                            this.dateAdd(dt, 'second', seconds);
                        this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                            new Date();
                        console.log('xx dataCachingTable memory upd', this.dataCachingTable)

                        // Update dataCaching on Disc
                        this.dbDataCachingTable.table("localDataCachingTable")
                            .bulkPut(this.dataCachingTable)
                            .then(res => {
                                this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                                    console.warn('xx dataCachingTable updated count @end', res);
                                });
                        });
                    };

                    console.warn('xx data retured from HTTP', httpResult.data);
                    resolve(httpResult.data);
                    console.timeEnd("DURATION addResource");
                    return;
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addResource FAILED', {err});
                    };

                    console.timeEnd("DURATION addResource");
                    reject(err.message)
                }
            );

        });
    }

    saveResource(resource: string = '', data: any): Promise<string> {
        // Description: Saves Resource
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveResource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            // Set final path
            let pathUrl: string = resource;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                httpResult => {
                    if(httpResult.statusCode != 'success') {
                        reject(httpResult.message);
                        return;
                    };

                    // Assume worse case that all has to be obtained from HTTP server
                    let isFresh: boolean = false;
                    let localCacheableMemory: boolean = false;
                    let localCacheableDisc: boolean = false;
                    let localVariableName: string = null;
                    let localCurrentVariableName: string = '';
                    let localTableName: string = '';

                    // Find DS in localCachingTable
                    let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                        dct.key == resource
                    );

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {

                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {

                                // Replace local
                                // TODO - TEST This !!!!
                                let localIndex: number = this[localVariableName].findIndex(rec =>
                                    rec.id == data.id
                                );
                                if (localIndex >= 0) {
                                    this[localVariableName][localIndex] = data;
                                };
                                console.warn('xx updated cached Memory to', this[localVariableName]);
                            };

                            // TODO - should we fill Current Var here a well?
                        };

                        // Fill Disc
                        if (localCacheableDisc) {

                            if (localTableName != null) {
                                // this.dbCanvasAppDatabase = new CanvasAppDatabase
                                // this.dbCanvasAppDatabase.open();

                                this.dbCanvasAppDatabase.table(localTableName).clear().then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName)
                                    .bulkPut(httpResult.data)
                                    .then(resPut => {

                                        // Count
                                        this.dbCanvasAppDatabase.table(localTableName)
                                            .count(resCount => {
                                                console.warn('xx updated local Disc to', resCount);
                                        });
                                    });
                                });
                            };
                        };

                        // Update dataCaching in Memory
                        let dt: Date = new Date();
                        let seconds: number = 86400;
                        if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                            seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                        };
                        this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                            this.dateAdd(dt, 'second', seconds);
                        this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                            new Date();
                        console.log('xx dataCachingTable memory upd', this.dataCachingTable)

                        // Update dataCaching on Disc
                        this.dbDataCachingTable.table("localDataCachingTable")
                            .bulkPut(this.dataCachingTable)
                            .then(res => {
                                this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                                    console.warn('xx dataCachingTable updated count @end', res);
                                });
                        });
                    };

                    if (this.sessionDebugging) {
                        console.log('saveResource SAVED', {data})
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveResource FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    deleteResource(resource: string = '', id: number): Promise<string> {
        // Description: Deletes a Resources
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteResource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = resource;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // Update NrComments field if a W is linked
                    // TODO - how do we fix this !!!???
                    // if (widgetID != null) {
                    //     this.widgets.forEach(w => {
                    //         if (w.id == widgetID) {
                    //             w.nrComments = w.nrComments - 1;
                    //         };
                    //     });
                    // };

                    // Assume worse case that all has to be obtained from HTTP server
                    let isFresh: boolean = false;
                    let localCacheableMemory: boolean = false;
                    let localCacheableDisc: boolean = false;
                    let localVariableName: string = null;
                    let localCurrentVariableName: string = '';
                    let localTableName: string = '';

                    // Find DS in localCachingTable
                    let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                        dct.key == resource
                    );

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {

                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {

                                // TODO - TEST This !!!!
                                this[localVariableName] = this[localVariableName].filter(
                                    com => com.id != id
                                );
                            };
                        };

                        // Fix Disc
                        if (localCacheableDisc) {
                            // TODO - figure out
                        };

                    };
                    


                    if (this.sessionDebugging) {
                        console.log('deleteResource DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteResource FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getDashboards(params: string = ''): Promise<Dashboard[]> {
        // Description: Gets all D
        // Returns: this.dashboards array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboards ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        if (params.length > 2  &&  params.substring(0 ,1) != '?') {
            params = '?' + params;
        };

        return new Promise<Dashboard[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'dashboards' + params;
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        console.log('xx    resssssssssssssssssss', res)
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.dashboards = res.data;
                        this.isDirtyDashboards = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDashboards 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.dashboards);
                        };
                        resolve(this.dashboards);
                    },
                    err => {
                        reject(err.message)
                    }
                )
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDashboards 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };
                resolve(this.dashboards);
            }
        });

    }

    // editDashboard(dashboardID: number): Promise<any> {
    //     // Description: Gets all D
    //     // Returns: this.dashboards array, unless:
    //     //   If not cached or if dirty, get from File
    //     if (this.sessionDebugging) {
    //         console.log('%c        Global-Variables editDashboard ...',
    //             "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
    //     };

    //     return new Promise<any>((resolve, reject) => {

    //         let pathUrl: string = '/canvasDashboardEdit?dashboardID=' + dashboardID;
    //         let finalUrl: string = this.canvasServerURI + pathUrl;
    //         console.log('finalUrl', finalUrl)
    //         this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
    //             res  => {
    //                 if(res.statusCode != 'success') {
    //                     reject(res.message);
    //                     return;
    //                 };

    //                 if (this.sessionDebugging) {
    //                     console.log('%c    Global-Variables editDashboard 1',
    //                         "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
    //                         "Draft created for current Dashboard")
    //                 };

    //                 resolve(res.data);
    //             },
    //             err => {
    //                 reject(err.message)
    //             }
    //         );
    //     });
    // }

    copyDashboard(
        dashboardID: number,
        name: string = null,
        state: string = null
        ): Promise<Dashboard> {
        // Copies a given Dashboard, with all related info
        // - dashboardID = D to copy (= Original)
        // - name, state: optional values for the new copy
        // - To make a draft: originalD.state = Complete, state = Draft
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables copyDashboard',
                "color: black; background: lightgray; font-size: 10px", {dashboardID})
        };

        // Duplicate the D and all related info
        return new Promise<Dashboard>((resolve, reject) => {

            // Get D
            let dashboardIndex: number = this.dashboards.findIndex(d => d.id == dashboardID);
            if (dashboardIndex >= 0) {

                // Create new D, and fill in where possible
                let today = new Date();
                // let newD = Object.assign({}, this.dashboards[dashboardIndex]);
                let newD = JSON.parse(JSON.stringify(this.dashboards[dashboardIndex]));
                newD._id = null;
                newD.id = null;
                newD.creator = this.currentUser.userID;
                newD.dateCreated = today;
                newD.editor = null;
                newD.dateEdited = null;

                if (name != null) {
                    newD.name = name;
                };
                if (state != null) {
                    newD.state = state;
                };

                // Draft can only be edited by its creator
                if (state == 'Draft') {
                    newD.accessType = 'Private';
                    newD.editor = this.currentUser.userID;
                    newD.dateEdited = today;
                };

                newD.draftID = null;
                if (this.dashboards[dashboardIndex].state == 'Complete'
                    && state == 'Draft') {
                    newD.originalID = this.dashboards[dashboardIndex].id;
                } else {
                    newD.originalID = null;
                };

                this.addDashboard(newD).then (addedD => {

                    let promiseArrayT = [];

                    // Save original ID
                    if (this.dashboards[dashboardIndex].state == 'Complete'
                        &&  state == 'Draft') {
                        let currentDashboardIndex: number = this.currentDashboards.
                            findIndex(d => d.id == dashboardID);
                        if (currentDashboardIndex >= 0) {
                            this.currentDashboards[currentDashboardIndex].draftID =
                                addedD.id;
                        };
                        this.dashboards[dashboardIndex].draftID = addedD.id;
                        this.saveDashboard(this.dashboards[dashboardIndex]);
                    };

                    // T
                    this.dashboardTabs.forEach(t => {
                        if (t.dashboardID == dashboardID) {
                            // Deep copy
                            // let newT: DashboardTab = Object.assign({}, t);
                            let newT: DashboardTab = JSON.parse(JSON.stringify(t));
                            newT._id = null;
                            newT.id = null;
                            newT.dashboardID = addedD.id;
                            newT.originalID = t.id;
                            promiseArrayT.push(this.addDashboardTab(newT));
                        };

                    });
                    this.allWithAsync(...promiseArrayT).then(resolvedData => {
                        // W
                        let promiseArrayW = [];
                        let dashboardTabsResult = JSON.parse(JSON.stringify(resolvedData));

                        dashboardTabsResult.forEach(t => {
                            if (t.dashboardID == addedD.id) {
                                this.widgets.forEach(w => {
                                    if (w.dashboardID == dashboardID
                                        &&
                                        w.dashboardTabIDs.indexOf(t.originalID) >= 0) {
                                        // Deep copy
                                        // let newW: Widget = Object.assign({}, w);
                                        let newW: Widget = JSON.parse(JSON.stringify(w));
                                        newW._id = null;
                                        newW.id = null;
                                        newW.dashboardID = addedD.id;
                                        newW.dashboardTabID = t.id;
                                        newW.originalID = w.id;
                                        // TODO - fix for multi-Tabbed Ws
                                        newW.dashboardTabIDs = [t.id];

                                        promiseArrayW.push(this.addWidget(newW));

                                    };
                                });
                            };
                        });
                        this.allWithAsync(...promiseArrayW).then(resolvedData => {

                            // Checkpoints
                            let promiseArrayChk = [];
                            let widgetResults = [];
                            console.log('xx resolvedData', resolvedData)
                            if (resolvedData != null  &&  resolvedData != '') {
                                widgetResults = JSON.parse(JSON.stringify(resolvedData));
                            };
                            if (widgetResults.length > 0) {
                                widgetResults.forEach(w => {
                                    if (w.dashboardID == addedD.id) {

                                        this.widgetCheckpoints.forEach(chk => {
                                            if (chk.dashboardID == dashboardID
                                                && chk.widgetID == w.originalID) {
                                                // Deep copy
                                                // let newChk: WidgetCheckpoint = Object.assign({}, chk);
                                                let newChk: WidgetCheckpoint = JSON.parse(JSON.stringify(chk));
                                                newChk._id = null;
                                                newChk.id = null;
                                                newChk.dashboardID = addedD.id;
                                                newChk.widgetID = w.id;
                                                newChk.originalID = chk.id;

                                                newChk.widgetSpec.dashboardID = addedD.id;
                                                newChk.widgetSpec.dashboardTabID = w.dashboardTabID;
                                                newChk.widgetSpec.widgetID = w.id;
                                                // TODO - fix for multi-Tabbed Ws
                                                newChk.widgetSpec.dashboardTabIDs = w.dashboardTabIDs;

                                                promiseArrayChk.push(this.addWidgetCheckpoint(newChk));
                                            };
                                        });
                                    };

                                });
                            };
                            this.allWithAsync(...promiseArrayChk).then(resolvedData => {

                                // Rebuild [checkpointIDs]
                                let promiseArrayWS = [];
                                let newCheckpointIDs: number[] = [];
                                let chkpntIndex: number;
                                let wID: number;
                                this.widgets.forEach(w => {
                                    if (w.dashboardID == addedD.id) {
                                        w.checkpointIDs.forEach(cids => {
                                            chkpntIndex = this.widgetCheckpoints.findIndex(
                                                wc => wc.originalID == cids
                                            );
                                            if (chkpntIndex >= 0) {
                                                newCheckpointIDs.push(
                                                    this.widgetCheckpoints[chkpntIndex].id
                                                );
                                            };
                                        });
                                        w.checkpointIDs = newCheckpointIDs;
                                        promiseArrayWS.push(this.saveWidget(w))
                                    };
                                });
                                this.allWithAsync(...promiseArrayWS).then(resolvedData => {

                                    // SOME Permissions, with these changes:
                                    // - canEdit ONLY for the creator
                                    // - canAddDatasource ONLY for the creator
                                    // - remove canDelete for all (cannot do this to a Draft)
                                    // - remove canGrantAccess for all
                                    let promiseArrayP = [];
                                    this.dashboardPermissions.forEach(p => {
                                        if (p.dashboardID == dashboardID) {

                                            // Deep copy
                                            // let newP: DashboardPermission = Object.assign({}, p);
                                            let newP: DashboardPermission = JSON.parse(JSON.stringify(p));
                                            newP._id = null;p
                                            newP.id = null;
                                            newP.dashboardID = addedD.id;
                                            if (newP.userID != this.currentUser.userID) {
                                                newP.canEditRight = false;
                                                newP.canAddDatasource = false;
                                            };
                                            newP.canDeleteRight = false;
                                            newP.canGrantAccess = false;

                                            promiseArrayP.push(this.addDashboardPermission(newP));
                                        };

                                    });

                                    this.allWithAsync(...promiseArrayChk).then(resolvedData => {
                                        resolve(addedD);
                                    });
                                });
                            });
                        });
                    });
                });
            };
        });
    }

    letDashboard(dashboardID: number = null): Dashboard {
        // Returns the given D from the internal arrays
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables letDashboard ...',
                "color: black; background: lightgray; font-size: 10px", {dashboardID});
        };

        // Set to current if none provided
        if (dashboardID == null) {
            dashboardID = this.currentDashboardInfo.value.currentDashboardID;
        };

        // Get D
        let dashboardIndex: number = this.dashboards.findIndex(d => d.id == dashboardID);
        if (dashboardIndex >= 0) {
            return this.dashboards[dashboardIndex];
        } else {
            alert ('Dashboard ID ' + dashboardID.toString() + ' does not exist in the dashboards array - should be impossible');
            return null;
        };
    }

    discardDashboard(): Promise<number> {
        // Discards the Current Draft Dashboard, which means all changes are deleted
        // Returns true if successfull

        if (this.sessionDebugging) {
            console.log('%c    Global-Variables discardDashboard ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<number>((resolve, reject) => {

            // 1. Update the Original/Draft ids on the original
            let draftDashboardID: number = this.currentDashboardInfo.value.currentDashboardID;
            let draftDashboard: Dashboard = this.letDashboard(draftDashboardID);
            let originalDashboard: Dashboard = this.letDashboard(draftDashboard.originalID);
            let originalDashboardID: number = originalDashboard.id;

            if (draftDashboard.state != 'Draft') {
                reject('This is not a draft Dashboard');
            };
            
            // Clear related Actions in Memory
            this.actions = this.actions.filter(act => act.dashboardID != draftDashboardID);

            // Perform steps (business logic in Server)
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = '/canvasDashboardDiscard';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl + '?draftDashboardID=' 
                + draftDashboardID + '&originalDashboardID=' + originalDashboardID, null, {headers})
                .subscribe(
                    res => {
                        if(res.statusCode != 'success') {
                            reject('Error deleting Draft Dashboard: '+ res.message);
                        };
                        resolve(originalDashboardID);
                    },
                    err => {
                        console.log('Error deleteDashboard FAILED', {err});
                        reject('Error deleteDashboard FAILED: ' + err.message);
                    }
                )
        })
    }

    saveDraftDashboard(deleteSnapshots: boolean): Promise<number> {
        // saves Draft Dashboard back to the original, keeping all changes
        // Returns original dashboardID (for the current Draft D)

        // The following are unmodified:
        // - the AuditTrails are kept against the Draft

        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDraftDashboard ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {deleteSnapshots});
        };

        // Change the D
        return new Promise<number>((resolve, reject) => {

            // 1. Update the Original/Draft ids on the original
            let draftDashboardID: number = this.currentDashboardInfo.value.currentDashboardID;
            let draftDashboard: Dashboard = this.letDashboard(draftDashboardID);
            let originalDashboard: Dashboard = this.letDashboard(draftDashboard.originalID);
            let originalDashboardID: number = originalDashboard.id;

            if (draftDashboard.state != 'Draft') {
                reject('This is not a draft Dashboard');
            };
            
            // Clear related Actions in Memory
            this.actions = this.actions.filter(act => act.dashboardID != draftDashboardID);

            // TODO - Fix / Improve this with single Caching routine
            // For now, just make the core Dashboard entities dirty
            this.isDirtyDashboards = true;
            this.isDirtyDashboardTabs = true;
            this.isDirtyWidgets = true;
            this.isDirtyWidgetCheckpoints = true;
            this.isDirtyDashboardsRecent = true;

            // Perform steps (business logic in Server)
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = '/canvasDashboardSaveDraft';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl + '?draftDashboardID=' 
                + draftDashboardID + '&originalDashboardID=' + originalDashboardID, null, {headers})
                .subscribe(
                    res => {
                        if(res.statusCode != 'success') {
                            reject('Error saving Draft Dashboard: '+ res.message);
                        };
                        resolve(originalDashboardID);
                    },
                    err => {
                        console.log('Error saveDashboard FAILED', {err});
                        reject('Error deleteDashboard FAILED: ' + err.message);
                    }
                )

        });
    }

    // Treatment of Dashboard and related entities:
    // Background: A Dashboard is logically seen as one concept, but lives in the database
    // in different entities, called the core entities.  These core entities should be logically
    // treated as one unit.  A Dashboard can have further sets of information, like schedules.
    // These are called related entities, and are optional.  There are other (non-Dashboard) entities
    // that may be linked to a Dashboard (for example the user record may point to a startup Dashboard).
    // These are called linked entities.
    //
    // This doc explains:
    // 1. the core entities contained in a new Dashboard (Draft or copy created with SaveAs)
    // 2. how related entities are treated in the different processes for Dashboards 
    //    (creating, discarding and saving a Draft, copying a Complete Dashboard)
    // Note: a Dashboard has two states: Complete and Draft

    // Special routes:
    //      - Edit Dashboard, which creates the Draft Dashboard (canvasDashboardEdit)
    //      - Discard Draft Dashboard (canvasDashboardDiscard)
    //      - Delete Dashboard with related entities (canvasDashboardDelete)
    //      - Save Draft Dashboard, to Complete (canvasDashboardSaveDraft)
    //      - SaveAs Dashboard, making a copy of the Complete Dashboard (canvasDashboardSaveAs)

    // 1. Core Entities are created when a Draft Dashboard is created, or a Dashboard is copied:
    //      Dashboards						
    //      DashboardTabs					
    //      Widgets							
    //      WidgetCheckpoints				
    //      WidgetLayout                     
    //
    //   Edit (create Draft):              
    //    - These entities are copied to the new Dashboard from the Original Dashboard, with new IDs.  
    //    - new state = Draft
    //    - The new IDs are linked, W -> T -> D -> W-Chk.
    //   Discard:
    //    - original/draft IDs updated on the Original Dashboard
    //    - The Draft Dashboard and core entities are deleted
    //   Save Draft (to Complete):
    //    - the Original (Complete) Dashboard record content is updated with Draft content, and 
    //      original/draft IDs updated on the Original Dashboard
    //    - link core entities (Tabs, Widgets, WidgetCheckpoints) to the Original Dashboard
    //      (thus the previous Draft Widgets are now linked to the Original Dashboard)
    //    - Delete one Draft core entity: Dashboard
    //    - Delete three Orignal core entities: Tabs, Widgets, WidgetCheckpoints
    //   Delete (Original):
    //    - The Dashboard and core entities are deleted
    //   SaveAs (copy a Complete Dashboard):
    //    - These entities are copied to the new Dashboard when created, with new IDs.  
    //    - The new IDs are linked, W -> T -> D -> W-Chk.
    //    - the new state = Complete

    // 2. Related Entities can be linked to a Draft and Complete Dashboard, but are deleted when the
    //    Draft Dashboard is deleted.  The rational for this is that these entities are instance 
    //    specific - they are useful only for the Draft Dashboard:
    //      DashboardSnapshots
    //      DashboardSchedules
    //      DashboardScheduleLog
    //      DashboardSubscriptions
    //      DashboardTags
    //      DashboardPermissions
    //      DashboardUsedAsFavourite
    //      DashboardLayout - TODO, this must be redesigned !
    //
    //   Edit (create Draft):              
    //    - No action
    //   Discard:
    //    - Delete these entities
    //   Save Draft (to Complete):
    //    - Delete these entities
    //   Delete (Original):
    //    - Delete these entities
    //   SaveAs (copy a Complete Dashboard):
    //    - These entities are NOT copied - TODO is this correct ???
    //
    // 3. Entities that can be linked to a Draft, and are re-linked to the Original Dashboard
    //    when the Draft is deleted.  These links point the the Dashboard as a whole, irrespective
    //    of the state (so a link to Draft should translate to a link to Complete):
    //      CanvasComments
    //      CanvasMessages
    //      CanvasTasks
    //      HyperlinkedWidgets
    //      UsedAsStartup
    //      UsedAsTemplate
    //
    //   Edit (create Draft):              
    //    - No action
    //   Discard:
    //    - Re-link these entities to the Original Dashboard
    //   Save Draft (to Complete):
    //    - Re-link these entities to the Original Dashboard
    //   Delete (Original):
    //    - Make the link null
    //   SaveAs (copy a Complete Dashboard):
    //    - No action

    // 4. General entities that can be linked to Draft and must be deleted when the Draft
    //    Dashboard is deleted.
    //      DashboardRecent
    //      StatusBarMessageLog
    //      CanvasActions
    //
    //   Edit (create Draft):              
    //    - No action (add record to Recent list)
    //   Discard:
    //    - Delete these entities
    //   Save Draft (to Complete):
    //    - Delete these entities
    //   Delete (Original):
    //    - Null the D-id for these entities
    //   SaveAs (copy a Complete Dashboard):
    //    - No action

    // TODO - finish these once overall design is done !
    // DatasourceFilter                    Delete  - 
    // Combinations                  ?     Not Sure !!!


    deleteDashboardInfo(dashboardID: number): Promise<string> {
        // Deletes D with all related Entities
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardInfo ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        // NB: has to be in synch with route canvasDashboardDelete !!!!!
        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = '/canvasDashboardDelete';
            let finalUrl: string = this.canvasServerURI + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + dashboardID, {headers})
                .subscribe(
                    res => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
                            return;
                        };

                        // Remove where D used as template
                        this.dashboards.forEach(d => {
                            if (d.templateDashboardID == dashboardID) {
                                d.templateDashboardID == 0;
                            };
                        });
                        this.currentDashboards.forEach(d => {
                            if (d.templateDashboardID == dashboardID) {
                                d.templateDashboardID == 0;
                            };
                        });

                        // Remove where D was used for hyperlink
                        this.widgets.forEach(w => {
                            if (w.hyperlinkDashboardID == dashboardID) {
                                w.hyperlinkDashboardID = 0;
                            };
                        });
                        this.currentWidgets.forEach(w => {
                            if (w.hyperlinkDashboardID == dashboardID) {
                                w.hyperlinkDashboardID = 0;
                            };
                        });

                        // Remove where D was used as fav, startup
                        this.canvasUsers.forEach(u => {
                            if (u.preferenceStartupDashboardID == dashboardID) {
                                u.preferenceStartupDashboardID = null;
                            };
                            u.favouriteDashboards.filter(f => f != dashboardID)
                            // TODO - improve this to not update ALL users
                        });

                        resolve('Deleted');
                    },
                    err => {
                        if (this.sessionDebugging) {
                            console.log('Error deleteDashboard FAILED', {err});
                        };

                        reject(err.message);
                    }
                )
        });

    }

    clearDashboardInfo() {
        // Clears all related Entities of a D
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables clearDashboardInfo ...',
                "color: black; background: lightgray; font-size: 10px");
        };

        // TODO - find a better way to keep all related items in sync, and list updated
        this.currentDashboards = [];
        this.currentDashboardTabs = [];
        this.currentWidgets = [];
        this.currentDashboardSnapshots = [];
        this.currentDashboardSchedules = [];
        this.currentDashboardTags = [];
        this.currentDashboardPermissions = [];
        this.currentWidgetCheckpoints = [];
        this.currentDatasets = [];

    }

    addDashboard(data: Dashboard): Promise<any> {
        // Description: Adds a new Dashboard
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDashboard ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboards';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Clear all related info
                    this.clearDashboardInfo();

                    // Update Global vars to make sure they remain in sync
                    this.dashboards.push(JSON.parse(JSON.stringify(res.data)));
                    this.currentDashboards.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addDashboard ADDED', res.data, this.dashboards)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDashboard FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    saveDashboard(data: Dashboard): Promise<string> {
        // Description: Saves Dashboard
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDashboard ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",{data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboards';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.dashboards.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.dashboards[localIndex] = data;
                    };
                    localIndex = this.currentDashboards.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.currentDashboards[localIndex] = data;
                    };

                    if (this.sessionDebugging) {
                        console.log('saveDashboard SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDashboard FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDashboard(id: number): Promise<string> {
        // Description: Deletes a Dashboard
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboard ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboards';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboards = this.dashboards.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboards = this.currentDashboards.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDashboard DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboard FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getCurrentDashboard(dashboardID: number): Promise<Dashboard[]> {
        // Description: Gets current D (and optional Template)
        // Params:
        //   dashboardID
        // Returns: this.currentDashboards array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDashboards ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {dashboardID});
        };

        // Refresh from source at start, or if dirty
        if (
            (this.currentDashboards.length == 0
            ||  this.dashboards.length == 0)
            ||  (this.isDirtyDashboards)
            ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(res => {

                        // Load the current Dashboard, and Optional template
                        // let currentDashboards: Dashboard[] = [];
                        this.currentDashboards = this.dashboards.filter(
                            i => i.id == dashboardID
                        );

                        let hasAccess: boolean = false;
                        if (this.currentDashboards.length > 0) {
                            if (this.currentDashboards[0].templateDashboardID != 0
                                &&
                                this.currentDashboards[0].templateDashboardID != null) {

                                hasAccess = false;
                                if (this.dashboardPermissionCheck(
                                    this.currentDashboards[0].templateDashboardID,
                                    'canviewright')) {
                                        hasAccess = true;
                                };
                                if (this.dashboardPermissionCheck(
                                    this.currentDashboards[0].templateDashboardID,
                                    'canviewandcanedit')) {
                                        hasAccess = true;
                                };

                                if (hasAccess) {

                                    let templateDashboard: Dashboard[] = null;

                                    templateDashboard = this.dashboards.filter(
                                        i => i.id == this.currentDashboards[0].templateDashboardID
                                    );

                                    if (templateDashboard == null) {
                                        alert('Dashboard template id does not exist in Dashboards Array')
                                    } else {
                                        this.currentDashboards.push(templateDashboard[0]);
                                        this.templateInUse.next(true);
                                    }
                                } else {
                                    this.templateInUse.next(false);
                                };
                            } else {
                                this.templateInUse.next(false);
                            };
                        }
                        // this.currentDashboards.next(currentDashboards);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentDashboards 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {dashboardID}, this.currentDashboards)
                        };

                        resolve(this.currentDashboards);

                })
             })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {

                // Load the current Dashboard, and Optional template
                // let currentDashboards: Dashboard[] = [];
                this.currentDashboards = this.dashboards.filter(
                    i => i.id == dashboardID
                );

                if (this.currentDashboards.length == 0) {
                    console.log('xx global var error in getCurrentDashboard - this.currentDashboards.length == 0', dashboardID, this.currentDashboards)
                    alert('xx global var error in getCurrentDashboard - this.currentDashboards.length == 0 ');
                }
                if (this.currentDashboards[0].templateDashboardID != 0  &&  this.currentDashboards[0].templateDashboardID != null) {
                    let templateDashboard: Dashboard[] = null;

                    templateDashboard = this.dashboards.filter(
                        i => i.id == this.currentDashboards[0].templateDashboardID
                    );

                    if (templateDashboard == null) {
                        alert('Dashboard template id does not exist in Dashboards Array')
                    } else {
                        this.currentDashboards.push(templateDashboard[0]);
                        this.templateInUse.next(true);
                    }
                } else {
                    this.templateInUse.next(false);
                };

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentDashboards 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID}, this.currentDashboards)
                };

                resolve(this.currentDashboards);
            });
        };

    }

    addDashboardToCache(dashboard: Dashboard,        
        dashboardTabs: DashboardTab[],
        widgets: Widget[],
        widgetCheckpoints: WidgetCheckpoint[]
        ): Promise<boolean> {
        // Add a Dashboard with Core Entities to cache

        if (this.sessionDebugging) {




            // TODO - REMOVE after testing !!!
            return;



            console.log('%c    Global-Variables addDashboardToCache ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        // TODO - this does NOT cater for async case when cached is only on Disc 
        //        => may not be ready before refreshDashboard is run !!
        return new Promise<boolean>((resolve, reject) => {
            this.updateLocalCacheMemory(
                'add', 
                dashboard.id, 
                'dashboards', 
                dashboard
            );

            dashboardTabs.forEach(dashboardTab => {
                this.updateLocalCacheMemory(
                    'add', 
                    dashboardTab.id, 
                    'dashboardTabs', 
                    dashboardTab
                );
            });

            widgets.forEach(widget => {
                this.updateLocalCacheMemory(
                    'add', 
                    widget.id, 
                    'widgets', 
                    widget
                );
            });

            widgetCheckpoints.forEach(widgetCheckpoint => {
                this.updateLocalCacheMemory(
                    'add', 
                    widgetCheckpoint.id, 
                    'widgetCheckpoints', 
                    widgetCheckpoint
                );
            });

            // Done
            resolve(true);
        });
    }

    updateLocalCacheMemory(
        cacheAction: string, 
        cachedEntityID: number, 
        cachedEntityName: string, 
        cachedEntityData: any): Promise<boolean> {
        // Amend local Workstation Memory Cache
        //   cacheAction = add, update, delete
        //   cachedEntityID = ID of the entity to amend, ie 9 (for say dashboardID = 9)
        //   cachedEntityName = variable to amend, ie dashboards (for caching Table lookup)
        //   cachedEntityData = data to add, update

        if (this.sessionDebugging) {
            console.log('%c    Global-Variables updateLocalCacheMemory ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<boolean>((resolve, reject) => {
            let today = new Date();

            // Find object in localCachingTable
            let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                dct.key == cachedEntityName
            );

            // If in CachingTable, update locally
            if (dataCachingTableIndex >= 0) {

                // Set vars to use here
                let localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                let localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;
                let localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                let localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                let localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;

                // Add an object
                if (cacheAction.toLowerCase() == 'add') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id == cachedEntityID);

                            if (localVarIndex < 0) {
                                this[localVariableName].push(cachedEntityData);
                            };
                        };

                        // Update Current Var
                        // TODO - consider this carefully: dont think we should add stuff to
                        // currentVars, ie currentDashboards = current D selected by user
                        console.log('xx ADD Memory Updated', this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .put(cachedEntityData)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx Add Disc count @ end ', res);
                                    });
                            });
                        };
                    };
                };

                // Update an object
                if (cacheAction.toLowerCase() == 'update') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id == cachedEntityID);

                            if (localVarIndex >0) {
                                this[localVariableName][localVarIndex] = cachedEntityData;
                            };
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            let localCurrentVarIndex: number = this[localCurrentVariableName].findIndex(
                                lv => lv.id == cachedEntityID);

                            if (localCurrentVarIndex >0) {
                                this[localCurrentVariableName][localCurrentVarIndex] = cachedEntityData;
                            };
                        };
                        console.log('xx UPDATE Memory Updated', this[localCurrentVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                    if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(cachedEntityID)
                                .put(cachedEntityData)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx UPDATE Disc count @ end ', res);
                                    });
                            });
                        };
                    };
                }

                // Delete an object
                if (cacheAction.toLowerCase() == 'delete') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            this[localVariableName] = this[localVariableName].filter(
                                lv => {
                                    return lv.id != cachedEntityID
                                });
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            this[localCurrentVariableName] = this[localCurrentVariableName].filter(
                                lv => {
                                    return lv.id != cachedEntityID
                                });
                        };
                        console.log('xx DELETE Memory updated', this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {
                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(cachedEntityID)
                                .delete()
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx DELETE count @end', res);
                                    });
                            });
                        };
                    };
                };

                // Update dataCaching in Memory
                let dt: Date = new Date();
                let seconds: number = 86400;
                if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                    seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                };
                this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                    this.dateAdd(dt, 'second', seconds);
                this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                today;
                console.log('xx dataCachingTable memory upd', this.dataCachingTable)


                // Update dataCaching on Disc
                this.dbDataCachingTable.table("localDataCachingTable")
                    .bulkPut(this.dataCachingTable)
                    .then(res => {
                        this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                            console.warn('xx localDataCachingTable count @end', res);
                        });
                });

            };
        
            // Done
            console.log('xx after cache update', this.dashboards)
            resolve(true);
        });
    }

    getDashboardTabs(): Promise<DashboardTab[]> {
        // Description: Gets all T
        // Returns: this.dashboardTabs array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardTabs ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DashboardTab[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTabs.length == 0)  ||  (this.isDirtyDashboardTabs) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'dashboardTabs';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.dashboardTabs = res.data;
                        this.isDirtyDashboardTabs = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDashboardTabs 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.dashboardTabs)
                        };
                        resolve(this.dashboardTabs);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDashboardTabs 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };
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
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDashboardTabs ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        // Refresh from source at start, or if dirty
        if ( (this.dashboardTabs.length == 0)  ||  (this.isDirtyDashboardTabs) ) {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                this.getDashboardTabs()
                    .then(res => {
                        res = res.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTabs = res;
                        this.currentDashboardTabs = this.currentDashboardTabs.sort( (obj1,obj2) => {
                            if (obj1.displayOrder > obj2.displayOrder) {
                                return 1;
                            };
                            if (obj1.displayOrder < obj2.displayOrder) {
                                return -1;
                            };
                            return 0;
                        });

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentDashboardTabs 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {dashboardID}, this.currentDashboardTabs)
                        };
                        resolve(this.currentDashboardTabs);

                })
             })
        } else {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                let returnData: DashboardTab[];
                returnData = this.dashboardTabs.filter(
                        i => i.dashboardID == dashboardID
                );
                this.currentDashboardTabs = returnData;
                this.currentDashboardTabs = this.currentDashboardTabs.sort( (obj1,obj2) => {
                    if (obj1.displayOrder > obj2.displayOrder) {
                        return 1;
                    };
                    if (obj1.displayOrder < obj2.displayOrder) {
                        return -1;
                    };
                    return 0;
                });

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentDashboardTabs 2',
                      "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID}, this.currentDashboardTabs)
                };
                resolve(this.currentDashboardTabs);
            });
        };

    }

    addDashboardTab(data: DashboardTab): Promise<any> {
        // Description: Adds a new DashboardTab
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDashboardTab ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardTabs';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.dashboardTabs.push(JSON.parse(JSON.stringify(res.data)));
                    this.currentDashboardTabs.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addDashboardTab ADDED', res.data, this.dashboardTabs)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDashboardTab FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    saveDashboardTab(data: DashboardTab): Promise<string> {
        // Description: Saves DashboardTab
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDashboardTab ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardTabs';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.currentDashboardTabs.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.currentDashboardTabs[localIndex] = data;
                    };
                    localIndex = this.dashboardTabs.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.dashboardTabs[localIndex] = data;
                    };

                    if (this.sessionDebugging) {
                        console.log('saveDashboardTab SAVED', res.data);
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDashboardTab FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDashboardTab(id: number): Promise<string> {
        // Description: Deletes a DashboardTab
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardTab ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardTabs';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboardTabs = this.dashboardTabs.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardTabs = this.currentDashboardTabs.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardTab DELETED id: ', {id})
                    };

                    resolve('Deleted');

                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardTab FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    getDashboardSamples(): Promise<Dashboard[]> {
        // Description: Gets all Sample D
        // Returns: an array extracted from [D], unless:
        //   If D not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardSamples ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        // Refresh from source at start, or if dirty
        if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(res => {
                        res = res.filter(
                            i => (i.isSample)  && i.state == 'Complete'
                        );

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDashboardSamples 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {res})
                        };

                        resolve(res);

                    })
                    .catch(err => reject(err.message))
            })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let data: Dashboard[] = this.dashboards.filter(
                    i => (i.isSample)
                )
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDashboardSamples 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data})
                };

                resolve(data);
            });
        };

    }

    getDashboardsRecent(userID: string): Promise<DashboardRecent[]>  {
        // Description: Gets an array of recently used D (not the Ds itself)
        // Returns: return array from source, not cached
        // Note:  data is ALWAYS synced to 3 different places:
        // - DB
        // - this.dashboardsRecent (array in Global Vars)
        // - dashboardsRecentBehSubject (.next)
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardsRecent ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {userID});
        };

        return new Promise<DashboardRecent[]>((resolve, reject) => {

            // Refresh from source at start
            // this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

            // let pathUrl: string = 'dashboardsRecent';
            // let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            // this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
            //     res  => {
            //         if(res.statusCode != 'success') {
            //             reject(res.message);
            //             return;
            //         };

            this.getResource('dashboardsRecent')
                .then(res => {

                    // TODO - http must be sorted => include in Options ...
                    let temp: DashboardRecent[] = res.filter(
                        i => i.userID == userID
                    );

                    // Add State and Name, at Runtime
                    for (var x = 0; x < temp.length; x++) {
                        temp[x].stateAtRunTime = 'Deleted';
                        let newDate = new Date(temp[x].accessed);
                        temp[x].accessed = newDate;
                        for (var y = 0; y < this.dashboards.length; y++) {
                            if (this.dashboards[y].id ==
                                temp[x].dashboardID) {
                                    temp[x].stateAtRunTime = this.dashboards[y].state;
                                    temp[x].nameAtRunTime = this.dashboards[y].name;
                                };
                            };
                        };

                    // Sort DESC
                    // TODO - in DB, ensure dateTime stamp is used, as IDs may not work
                    temp = temp.sort( (obj1,obj2) => {
                        if (obj1.accessed > obj2.accessed) {
                            return -1;
                        };
                        if (obj1.accessed < obj2.accessed) {
                            return 1;
                        };
                        return 0;
                    });

                    // Remove Deleted ones
                    temp = temp.filter(t => t.stateAtRunTime != 'Deleted');

                    this.dashboardsRecent = temp;
                    this.dashboardsRecentBehSubject.next(temp);
                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    this.isDirtyDashboardsRecent = false;

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables dashboardsRecent 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {temp})
                    };

                    resolve(temp);
                })
                .catch(err => {
                    reject(err.message)
                });
        });
    }

    dashboardIndexInRecentList(dashboardID: number): number {
        // Returns index of first D in the Recent list. Else -1
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables dashboardIndexInRecentList ...',
                "color: black; background: lightgray; font-size: 10px", {dashboardID});
        };

        // Determine index in Recent list
        let index: number = this.dashboardsRecent.findIndex(dR =>
            dR.dashboardID == dashboardID
        );
        return index;
    }

    dashboardTabIndexInRecentList(dashboardID: number, dashboardTabID: number): number {
        // Returns index of first D, T in the Recent list.  Else -1
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables dashboardTabIndexInRecentList ...',
                "color: black; background: lightgray; font-size: 10px",
                {dashboardID}, {dashboardTabID});
        };

        // Determine index in Recent list
        let index: number = this.dashboardsRecent.findIndex(dR =>
            dR.dashboardID == dashboardID
            &&
            dR.dashboardTabID == dashboardTabID
        );
        return index;
    }

    amendDashboardRecent(
        dashboardID: number,
        dashboardTabID: number): Promise<any>  {
        // Compares given IDs against the Recent list:
        // - if D not there, call ADD
        // - if D there but T change, call SAVE
        // - if D & T there, do nothing
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables amendDashboardRecent ...',
                "color: black; background: lightgray; font-size: 10px",
                {dashboardID}, {dashboardTabID});
        };

        // TODO - fix this timing issue, as I have no idea why this is happening here
        // this.sleep(2000);

        let indexD: number = this.dashboardIndexInRecentList(dashboardID);
        let indexTab: number = this.dashboardTabIndexInRecentList(dashboardID, dashboardTabID);
        let today = new Date();

        // D not in Recent List, so Add
        if (indexD == -1) {

            let newRecent: DashboardRecent = {
                id: null,
                userID: this.currentUser.userID,
                dashboardID: dashboardID,
                dashboardTabID: dashboardTabID,
                editMode: this.editMode.value,
                accessed: new Date(this.formatDate(today)),
                stateAtRunTime: 'Draft',
                nameAtRunTime: ''
            };
            return new Promise<any>((resolve, reject) => {
                this.addDashboardRecent(newRecent).then(dR =>
                    resolve(dR)
                )
            });
        } else {

            // D + T in Recent List, so amend
            let recentD: DashboardRecent = this.dashboardsRecent[indexD];

            // Change Tab
            if (indexTab == -1) {
                recentD.dashboardTabID = dashboardTabID;
            };

            // Reset editMode, accessed
            recentD.editMode = this.editMode.value;
            recentD.accessed = new Date(this.formatDate(today));

            return new Promise<any>((resolve, reject) => {
                this.saveDashboardRecent(recentD).then(res =>
                    resolve(recentD)
                )
            });
        };

    }

    touchupDashboardRecentVar(dashboardID:number, dashboardName: string) {
        // Description: Touchup DashboardRecent by changing selected fields
        // NOTE: It does NOT change the DB -> this is only updating the local variable.
        // - Next time one reads the list from the DB, it will be filled correctly
        // NOTE: it does NOT change position in the global variable.
        // It is typically used:
        // - change current D Desc => position remains unchanged
        // - D Rename => position should not be affected
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables touchupDashboardRecent ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px"
                , {dashboardID}, {dashboardName});
        };

        let newRecentIndex: number = this.dashboardsRecent
            .findIndex(dR => dR.dashboardID == dashboardID);

        if (newRecentIndex >= 0) {
            this.dashboardsRecent[newRecentIndex].nameAtRunTime = dashboardName;
            // this.saveDashboardRecent(this.dashboardsRecent[newRecentIndex],);
        };

    }

    addDashboardRecent(data: DashboardRecent): Promise<any> {
        // Adds a D to the Recent list, and update:
        // - this.dashboardsRecent
        // - this.dashboardsRecentBehSubject.next()
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDashboardRecent ...',
            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardsRecent';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    let dashboardRecentAmended: DashboardRecent = JSON.parse(JSON.stringify(res.data));

                    // Add State and Name, at Runtime
                    for (var i = 0; i < this.dashboards.length; i++) {
                        if (this.dashboards[i].id ==
                            dashboardRecentAmended.dashboardID) {
                                dashboardRecentAmended.stateAtRunTime = this.dashboards[i].state;
                                dashboardRecentAmended.nameAtRunTime = this.dashboards[i].name;
                        };
                    };

                    // Update Global vars to make sure they remain in sync
                    this.dashboardsRecent = [dashboardRecentAmended].concat(this.dashboardsRecent);

                    this.dashboardsRecentBehSubject.next(this.dashboardsRecent);

                    if (this.sessionDebugging) {
                        console.log('dashboardsRecent ADDED', dashboardRecentAmended, this.dashboardsRecent)
                    };

                    resolve(dashboardRecentAmended);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error dashboardsRecent FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    saveDashboardRecent(data: DashboardRecent): Promise<string> {
        // Description: Saves DashboardRecent
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDashboardRecent ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardsRecent';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.dashboardsRecent.findIndex(u =>
                        u.id == data.id
                    );

                    if(localIndex>= 0) {

                        this.dashboardsRecent[localIndex] = data;

                        // Change order - last accessed one must be at top
                        let temp: DashboardRecent[] = [ this.dashboardsRecent[localIndex] ].concat(
                            this.dashboardsRecent.filter(dR => dR.id != data.id)
                        );
                        this.dashboardsRecent = temp;
                        this.dashboardsRecentBehSubject.next(this.dashboardsRecent);

                        if (this.sessionDebugging) {
                            console.log('saveDashboardRecent SAVED', res.data)
                        };

                        resolve('Saved');
                    } else {
                        resolve('Failed: id not in globalVariables.dashboardsRecent');
                    };
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDashboardRecent FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDashboardRecent(id: number): Promise<string> {
        // Description: Deletes a Recent Dashboard, and updates:
        // - this.dashboardsRecent
        // - this.dashboardsRecentBehSubject.next()
        // Returns 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardRecent ...',
            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardsRecent';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboardsRecent = this.dashboardsRecent.filter(
                        rec => rec.id != id
                    );

                    this.dashboardsRecentBehSubject.next(this.dashboardsRecent);

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardRecent DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardRecent FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    getDatasourceTransformations(): Promise<DatasourceTransformation[]> {
        // Description: Gets DatasourceTransformations
        // Returns: this.DatasourceTransformation
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDatasourceTransformations ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DatasourceTransformation[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourceTransformations.length == 0)  ||  (this.isDirtyDatasourceTransformations) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'datasourceTransformations';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.datasourceTransformations = res.data;
                        this.isDirtyDatasourceTransformations = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDatasourceTransformation 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.datasourceTransformations)
                        };

                        resolve(this.datasourceTransformations);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDatasourceTransformation 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.datasourceTransformations)
                };

                resolve(this.datasourceTransformations);
            }
        });

    }

    addDatasourceTransformation(data: DatasourceTransformation): Promise<any> {
        // Description: Adds a new DatasourceTransformation
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDatasourceTransformation ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasourceTransformations';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.datasourceTransformations.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addDatasourceTransformation ADDED', res.data,
                            this.datasourceTransformations)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDatasourceTransformation FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    saveDatasourceTransformation(data: DatasourceTransformation): Promise<string> {
        // Description: Saves DatasourceTransformation
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDatasourceTransformation ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasourceTransformations';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.datasourceTransformations.findIndex(d =>
                        d.id == data.id
                    );
                    this.datasourceTransformations[localIndex] = data;

                    if (this.sessionDebugging) {
                        console.log('saveDatasourceTransformation SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDatasourceTransformation FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDatasourceTransformation(id: number): Promise<string> {
        // Description: Deletes a DatasourceTransformations
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDatasourceTransformation ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasourceTransformations';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.datasourceTransformations = this.datasourceTransformations.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDatasourceTransformation DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDatasourceTransformation FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getDataTable(): Promise<DataTable[]> {
        // Description: Gets DataTables, WITHOUT data
        // Returns: this.dataTable
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDataTable ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DataTable[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataTables.length == 0)  ||  (this.isDirtyDataTables) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'dataTables';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.dataTables = res.data;
                        this.isDirtyDataTables = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDataTable 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.dataTables)
                        };

                        resolve(this.dataTables);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDataTable 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.dataTables)
                };

                resolve(this.dataTables);
            }
        });

    }

    getDataField(): Promise<DataField[]> {
        // Description: Gets DataFields, WITHOUT data
        // Returns: this.dataField
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDataField ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DataField[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataFields.length == 0)  ||  (this.isDirtyDataFields) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'dataFields';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.dataFields = res.data;
                        this.isDirtyDataFields = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDataField 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.dataFields)
                        };

                        resolve(this.dataFields);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDataField 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.dataFields)
                };

                resolve(this.dataFields);
            }
        });

    }

    getDataset(): Promise<Dataset[]> {
        // Description: Gets Datasets, WITHOUT data
        // Returns: this.dataset
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDataset ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<Dataset[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasets.length == 0)  ||  (this.isDirtyDatasets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'datasets';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.datasets = res.data;
                        this.isDirtyDatasets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDataset 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.datasets)
                        };

                        resolve(this.datasets);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDataset 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.datasets)
                };

                resolve(this.datasets);
            }
        });

    }

    getCurrentDataset(datasourceID: number, datasetID: number): Promise<Dataset> {
        // Description: Gets a global Dataset, and inserts it once into
        // this.currentDatasets.  Then add the data from respective data location.
        // Returns: dataset
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDataset ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {datasourceID}, {datasetID});
        };

        // TODO - go through this logic again !!!
        let pathUrl: string = 'dataset';
        let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

        // Get list of dSet-ids to make array work easier
        let dsCurrIDs: number[] = [];       // currentDataset IDs
        let dsSourceLocation: string = '';
        let folderName: string = '';
        let fileName: string = '';
        this.currentDatasets.forEach(d => dsCurrIDs.push(d.id));
        let datasetIndex: number = null;

        for (var i = 0; i < this.datasets.length; i++) {
            if (this.datasets[i].id == datasetID) {
                datasetIndex = i;
                dsSourceLocation = this.datasets[i].sourceLocation;
                pathUrl = this.datasets[i].url;
                if (this.datasets[i].folderName == ''  ||  this.datasets[i].folderName == null) {
                    this.datasets[i].folderName = '../assets/';
                };
                if (this.datasets[i].fileName == ''  ||  this.datasets[i].fileName == null) {
                    this.datasets[i].fileName = 'data.dataset' + this.datasets[i].id.toString() + '.json';
                };
                folderName = this.datasets[i].folderName;
                fileName = this.datasets[i].fileName;
            }
        };

        return new Promise<any>((resolve, reject) => {

            // Read data from different places
            if (dsSourceLocation == 'File') {

                if (datasetIndex != null) {
                    // Add to Currentatasets (contains all data) - once
                    if (dsCurrIDs.indexOf(datasetID) < 0) {
                        this.currentDatasets.push(this.datasets[datasetIndex]);
                    };
                } else {
                    if (this.sessionDebugging) {
                        console.log('Error in getCurrentDataset - datasetIndex == null')
                    };

                };
            };

            if (dsSourceLocation == 'HTTP') {

                console.log('getCurrentDataset start HTTP')

                // NB: Note that the Server will return the data based on the
                //     datasourceID= in the query parameters !
                let finalUrl: string = this.canvasServerURI + '/clientData/?&datasourceID=' 
                    + datasourceID;

                    this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        console.log('getCurrentDataset after http.get', res)
                        if(res.statusCode != 'success') {
                            console.log('Error in getCurrentDataset after http.get');
                            reject(res.message);
                            return;
                        };

                        let newdSet: Dataset = {
                            id: datasetID,
                            datasourceID: datasourceID,
                            url: pathUrl,
                            sourceLocation: 'HTTP',
                            folderName: folderName,
                            fileName: fileName,
                            cacheServerStorageID: null,
                            cacheLocalStorageID: null,
                            isLocalDirty: null,
                            data: res.data,
                            dataRaw: res.data
                        };

                        // // Add to datasets (contains all data) - once
                        // if (dSetIDs.indexOf(datasetID) < 0) {
                        //     this.datasets.push(newdSet);
                        // };

                        // Add to Currentatasets (contains all data) - once
                        if (dsCurrIDs.indexOf(datasetID) < 0) {
                            this.currentDatasets.push(newdSet);
                        };

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentDataset 1 from ',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {dsSourceLocation}, ' for DS-id  = ', {datasourceID}, '.  Added dSet: ',
                                {newdSet}, ', and currentDatasets = ', this.currentDatasets)
                        };

                        console.log('getCurrentDataset before RESOLVE')

                        resolve(newdSet);
                    },
                    err => {
                        console.log('ERROR in getCurrentDataset !', err)
                        reject(err.message)
                    }
                );
            } else {
                console.log('Currently onlycaters for HTTP as a sourceLocation, not', dsSourceLocation);
                reject('Currently onlycaters for HTTP as a sourceLocation, not ' + dsSourceLocation);
            };
        });
    }

    addDataset(data: Dataset): Promise<any> {
        // Description: Adds a new Dataset
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDataset ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasets';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    let dataset: Dataset = JSON.parse(JSON.stringify(res.data));
                    this.datasets.push(dataset);

                    // Note: currentDS contains data as well, so this.currentDatasets.push
                    //       will result in a record with no data.  So, in the Widget
                    //       Editor for example, the DS will show on the list, but it will
                    //       be empty (Preview empty, nothing to plot)

                    this.getCurrentDataset(data.datasourceID, dataset.id).then(dataset => {

                        if (this.sessionDebugging) {
                            console.log('addDataset ADDED', res.data, this.datasets, this.currentDatasets)
                        };

                        resolve(res.data);

                    });
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDataset FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    saveDataset(data: Dataset): Promise<string> {
        // Description: Saves Dataset
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDataset ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasets';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.datasets.findIndex(dSet =>
                        dSet.id == data.id
                    );
                    this.datasets[localIndex] = data;

                    let localCurrentIndex: number = this.currentDatasets.findIndex(dSet =>
                        dSet.id == data.id
                    );
                    this.currentDatasets[localCurrentIndex] = data;

                    if (this.sessionDebugging) {
                        console.log('saveDataset SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDataset FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDataset(id: number): Promise<string> {
        // Description: Deletes a Dataset
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDataset ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasets';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.datasets = this.datasets.filter(
                        dSet => dSet.id != id
                    );
                    this.currentDatasets = this.currentDatasets.filter(
                        dSet => dSet.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDataset DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDataset FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getData(parameters: string): Promise<any[]> {
        // Description: Gets Data
        // parameters: list of ways to modify the result, for example:
        //   datasourceID=68                       REQUIRED - data for this DS 
        //   &sortObject=-Month                    Comma separated list of fields, - means DESC     
        //   &fields=Year, Month                   Fields to return, NOTE spaces     
        //   &filterObject={"Year":2019}           Filter object in Mongo format             
        //   &aggregationObject=aggregationObject  How to aggregate the data after SELECT statement                         
        //   &nrRowsToReturn=2                     Rows to return after ALL else have been done     
        // Returns: res.data
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getData ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {parameters});
        };

        return new Promise<Dataset[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // if ( (this.datasets.length == 0)  ||  (this.isDirtyDatasets) ) {
            this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

            if (parameters.substring(0, 1) != '?') {
                parameters = '?' + parameters;
            };

            // let finalUrl: string = this.canvasServerURI + '/clientdata?id=' + id.toString()
            let finalUrl: string = this.canvasServerURI + '/clientdata' + parameters;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getData',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            {res})
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDataset FAILED', {err});
                    };

                    reject(err.message);
                }
            );
        });

    }

    addData(data: any): Promise<any> {
        // Description: Adds DATA used in a new Dataset
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addData  ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        // TODO - kill all 'data' paths, kill the collection in Mongo and 
        //        do according to the new way
        let pathUrl: string = 'data';
        let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post<{id: number, data: any}>(finalUrl, data, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('addData ADDED', res.data)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addData FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    saveData(data: any): Promise<string> {
        // Description: Saves Data
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveData ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        let pathUrl: string = 'data';
        let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put(finalUrl + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // No local to Replace

                    if (this.sessionDebugging) {
                        console.log('saveData SAVED', {res})
                    };
                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveData FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteData(id: number): Promise<string> {
        // Description: Deletes given Data
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteData ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");
            // let pathUrl: string = 'data';
            // let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
        
            let finalUrl: string = this.canvasServerURI + '/clientdata';
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
                .subscribe(res => {

                    if (this.sessionDebugging) {
                        console.log('deleteData DELETED id: ', {id})
                    };
                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteData FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    filterSlicer(dataSet: Dataset): Dataset {
        // Filter a given Dataset on .dataRaw by applying all applicable Sl, and put result
        // into .data
        // Note: Objects and arrays are passed by reference. Primitive values like number,
        // string, boolean are passed by value.  Thus, original object (dSet) is modified here.
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables filterSlicer ...',
                "color: black; background: lightgray; font-size: 10px", {dataSet});
        };

        // this.currentWidgets.forEach(w => {
        //     console.warn('xx strt graphData', w.graphUrl, w.graphData);
        // });

        // Get all Sl for the given dSet
        // TODO: cater (carefully) for case where sl.datasetID == -1, ie what if DS has
        // two dSets with different values ...
        let relatedSlicers: Widget[] = this.currentWidgets.filter(w =>
            w.datasourceID == dataSet.datasourceID
            &&  w.datasetID == dataSet.id
            &&  w.widgetType == 'Slicer'
        );

        // Reset the filtered data
        dataSet.data = dataSet.dataRaw;
        console.log('xx data, dataRaw.length', dataSet.data.length, dataSet.dataRaw.length)

        // Loop on related Sl and filter data
        relatedSlicers.forEach(w => {
            console.log('Releated Slicers are (id, type): ', w.id, w.slicerType)

            // Type = List
            if (w.slicerType == 'List') {

                // Build array of selection values
                let selectedValues: string[] = [];
                let allSelectedValues: string[] = [];

                w.slicerSelection.forEach(f => {
                    if (f.isSelected) {
                        selectedValues.push(f.fieldValue);
                    };
                    allSelectedValues.push(f.fieldValue);
                });

                // Apply selected once, empty means all
                let tempData: any = [];
                    dataSet.data.forEach(d => {
                        if (selectedValues.indexOf(d[w.slicerFieldName]) >= 0) {
                            tempData.push(d);
                        };
                        if ( (w.slicerAddRest  &&  w.slicerAddRestValue)
                            &&
                            allSelectedValues.indexOf(d[w.slicerFieldName]) < 0) {
                                tempData.push(d);
                        };
                    });

                    // Replace the filtered data, used by the graph
                dataSet.data = tempData;
                console.log('xx End of list data.length', dataSet.data.length)

            };

            // Type = Bins
            if (w.slicerType == 'Bins') {

                // Build array of selection values
                let rangeValues: {fromValue: number; toValue:number}[] = [];

                w.slicerBins.forEach(bn => {
                    if (bn.isSelected) {
                        rangeValues.push(
                            {fromValue: bn.fromValue, toValue: bn.toValue}
                        )
                    };
                });

                // Loop on Bins, and add filtered ones
                let filterBinData: any = [];

                rangeValues.forEach(rv => {
                    dataSet.data.forEach(d => {
                        if (+d[w.slicerFieldName] >= rv.fromValue
                            &&
                            +d[w.slicerFieldName] <= rv.toValue) {
                                filterBinData.push(d);
                        };
                    });
                });

                // Replace the filtered data, used by the graph
                dataSet.data = filterBinData;

            };
        });

        // Filter data in [W] related to this dSet
        // TODO - cater later for cases for we use graphUrl
        this.currentWidgets.forEach(w => {
            if (w.datasourceID == dataSet.datasourceID
                &&   w.datasetID == dataSet.id
                && w.widgetType != 'Slicer') {
                    console.log('xx Related W: ', w.id)
                    w.graphUrl = "";
                    w.graphData = dataSet.data;

            };
        });

        console.warn('xx filt Sl', this.currentWidgets, dataSet)
        return dataSet;
    }

    deleteDashboardSchedule(id: number): Promise<string> {
        // Description: Deletes a DashboardSchedules
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardSchedule ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardSchedules';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboardSchedules = this.dashboardSchedules.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardSchedules = this.currentDashboardSchedules.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardSchedule DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardSchedule FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getDashboardScheduleLog(
        dashboardID: number = null,
        sentAfter: Date = null,
        sentBefore: Date = null): Promise<DashboardScheduleLog[]> {
        // Description: Gets the Schedule Log for a single D or requested range
        // Returns: this.dashboardScheduleLog array
        // NOTE: this routine does NOT use cached or if dirty (goes to DB each time)
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardScheduleLog ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID} , {sentAfter}, {sentBefore})
        };

        return new Promise<DashboardScheduleLog[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

            let pathUrl: string = 'dashboardScheduleLog';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.dashboardScheduleLog = res.data;

                    // TODO - perform on DB side
                    if (dashboardID != null) {
                        this.dashboardScheduleLog = this.dashboardScheduleLog.filter(
                            dsl => dsl.dashboardID == dashboardID);
                    };
                    if (sentAfter != null) {
                        this.dashboardScheduleLog = this.dashboardScheduleLog.filter(
                            dsl => dsl.sentOn >= sentAfter);
                    };
                    if (sentBefore != null) {
                        this.dashboardScheduleLog = this.dashboardScheduleLog.filter(
                            dsl => dsl.sentOn <= sentBefore);
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getDashboardScheduleLog 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            this.dashboardScheduleLog)
                    };

                    resolve(this.dashboardScheduleLog);
                },
                err => {
                    reject(err.message)
                });
        });

    }

    getDatasourceScheduleLog(
        datasourceID: number = null,
        sentAfter: Date = null,
        sentBefore: Date = null): Promise<DatasourceScheduleLog[]> {
        // Description: Gets the Schedule Log for a single DS or requested range
        // Returns: this.datasourceScheduleLog array
        // NOTE: this routine does NOT use cached or if dirty (goes to DB each time)
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDatasourceScheduleLog ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {datasourceID} , {sentAfter}, {sentBefore})
        };

        return new Promise<DatasourceScheduleLog[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

            let pathUrl: string = 'datasourceScheduleLog';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // TODO - perform on DB side
                    this.datasourceScheduleLog = res.data;
                    if (datasourceID != null) {
                        this.datasourceScheduleLog = this.datasourceScheduleLog.filter(
                            dsl => dsl.datasourceID == datasourceID);
                    };
                    if (sentAfter != null) {
                        this.datasourceScheduleLog = this.datasourceScheduleLog.filter(
                            dsl => dsl.sentOn >= sentAfter);
                    };
                    if (sentBefore != null) {
                        this.datasourceScheduleLog = this.datasourceScheduleLog.filter(
                            dsl => dsl.sentOn <= sentBefore);
                    };
                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getDatasourceScheduleLog 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            {res})
                    };
                    resolve(this.datasourceScheduleLog);
                },
                err => {
                    reject(err.message)
                }
            );
        });

    }

    getDashboardTags(): Promise<DashboardTag[]> {
        // Description: Gets all Sch
        // Returns: this.dashboardTagsget array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardTags ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DashboardTag[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTags.length == 0)  ||  (this.isDirtyDashboardTags) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'dashboardTags';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.dashboardTags = res.data;
                        this.isDirtyDashboardTags = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDashboardTags 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {res})
                        };

                        resolve(this.dashboardTags);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDashboardTags 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };

                resolve(this.dashboardTags);
            }
        });

    }

    getCurrentDashboardTags(dashboardID: number): Promise<DashboardTag[]> {
        // Description: Gets all Tags for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardTags array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDashboardTags ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        // Refresh frogetm source at start, or if dirty
        if ( (this.dashboardTags.length == 0)  ||  (this.isDirtyDashboardTags) ) {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                this.getDashboardTags()
                    .then(res => {
                        res = res.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTags = res;

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentDashboardTags 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {dashboardID}, {res})
                        };

                        resolve(this.currentDashboardTags);
                })
             })
        } else {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                let returnData: DashboardTag[];
                returnData = this.dashboardTags.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardTags = returnData;

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentDashboardTags 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID})
                };

                resolve(this.currentDashboardTags);
            });
        };
    }

    addDashboardTag(data: DashboardTag): Promise<any> {
        // Description: Adds a new DashboardTag
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDashboardTag ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardTags';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    console.log('xx   ----  res ---- ', res)
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.dashboardTags.push(JSON.parse(JSON.stringify(res.data)));
                    this.currentDashboardTags.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addDashboardTag ADDED', res.data, this.dashboardTags)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDashboardTag FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    deleteDashboardTag(id: number): Promise<string> {
        // Description: Deletes a DashboardTag
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardTag ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardTags';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboardTags = this.dashboardTags.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardTags = this.currentDashboardTags.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardTag DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardTag FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getDashboardPermissions(): Promise<DashboardPermission[]> {
        // Description: Gets all P
        // Returns: this.dashboardPermissions array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardPermissions ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DashboardPermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardPermissions.length == 0)  ||  (this.isDirtyDashboardPermissions) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'dashboardPermissions';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.dashboardPermissions = res.data;
                        this.isDirtyDashboardPermissions = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDashboardPermissions 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {res})
                        };

                        resolve(this.dashboardPermissions);
                    },
                    err => {
                        reject(err.message)
                    });
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDashboardPermissions 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };

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
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDashboardPermissions ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        // Refresh from source at start, or if dirty
        if ( (this.dashboardPermissions.length == 0)  ||  (this.isDirtyDashboardPermissions) ) {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                this.getDashboardPermissions()
                    .then(res => {
                        res = res.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardPermissions =res;

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentDashboardPermissions 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {dashboardID}, {res})
                        };

                        resolve(this.currentDashboardPermissions);
                })
             })
        } else {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                let returnData: DashboardPermission[];
                returnData = this.dashboardPermissions.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardPermissions =returnData;

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentDashboardPermissions 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID})
                };

                resolve(this.currentDashboardPermissions);
            });
        };
    }

    addDashboardPermission(data: DashboardPermission): Promise<any> {
        // Description: Adds a new DashboardPermission
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDashboardPermission ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardPermissions';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.dashboardPermissions.push(JSON.parse(JSON.stringify(res.data)));
                    this.currentDashboardPermissions.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addDashboardPermission ADDED', res.data,
                            this.currentDashboardPermissions, this.dashboardPermissions)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDashboardPermission FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    saveDashboardPermission(data: DashboardPermission): Promise<string> {
        // Description: Saves DashboardPermission
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDashboardPermission ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardPermissions';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // Replace local
                    let localIndex: number = this.dashboardPermissions.findIndex(d =>
                        d.id == data.id
                    );
                    this.dashboardPermissions[localIndex] = data;

                    if (this.sessionDebugging) {
                        console.log('saveDashboardPermission SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDashboardPermission FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDashboardPermission(id: number): Promise<string> {
        // Description: Deletes a DashboardPermissions
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardPermission ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");


            let pathUrl: string = 'dashboardPermissions';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboardPermissions = this.dashboardPermissions.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardPermissions = this.currentDashboardPermissions.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardPermission DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardPermission FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getCanvasGroups(): Promise<CanvasGroup[]> {
        // Description: Gets all G
        // Returns: this.canvasGroups array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCanvasGroups ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<CanvasGroup[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasGroups.length == 0)  ||  (this.isDirtyCanvasGroups) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'canvasGroups';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.canvasGroups = res.data;
                        this.isDirtyCanvasGroups = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCanvasGroups 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            {res})
                        };

                        resolve(this.canvasGroups);
                    },
                    err => {
                        reject(err.message)
                    }
                )
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCanvasGroups 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };

                resolve(this.canvasGroups);
            }
        });

    }

    addCanvasGroup(data: CanvasGroup): Promise<any> {
        // Description: Adds a new canvasGroup
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addCanvasGroup ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasGroups';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.canvasGroups.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addCanvasGroup ADDED', this.canvasGroups,
                            this.canvasGroups)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addCanvasGroup FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    saveCanvasGroup(data: CanvasGroup): Promise<string> {
        // Description: Saves CanvasGroup
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveCanvasGroup ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasGroups';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };
            // this.http.put(finalUrl + '?id=' + data.id, data, {headers}).subscribe(res => {

                // Replace local
                let localIndex: number = this.canvasGroups.findIndex(u =>
                    u.id == data.id
                );
                if (localIndex >= 0) {
                    this.canvasGroups[localIndex] = data;
                };

                if (this.sessionDebugging) {
                    console.log('saveCanvasGroup SAVED', res.data)
                };

                resolve('Saved');
            },
            err => {
                if (this.sessionDebugging) {
                    console.log('Error saveCanvasGroup FAILED', {err});
                };

                reject(err.message);
            });
        });
    }

    deleteCanvasGroup(id: number, widgetID: number = null): Promise<string> {
        // Description: Deletes a canvasGroups
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteCanvasGroup ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasGroups';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.canvasGroups = this.canvasGroups.filter(
                        grp => grp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteCanvasGroup DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteCanvasGroup FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getWidgetGraphs(): Promise<WidgetGraph[]> {
        // Description: Gets all G
        // Returns: this.WidgetGraphs array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getWidgetGraphs ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<WidgetGraph[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgetGraphs.length == 0)  ||  (this.isDirtyWidgetGraphs) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'widgetGraphs';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.widgetGraphs = res.data;
                        this.isDirtyWidgetGraphs = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getWidgetGraphs 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            {res})
                        };

                        resolve(this.widgetGraphs);
                    },
                    err => {
                        reject(err.message)
                    }
                )
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getWidgetGraphs 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };

                resolve(this.widgetGraphs);
            }
        });

    }

    getDashboardSnapshots(): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn
        // Returns: this.dashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardSnapshots ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DashboardSnapshot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'dashboardSnapshots';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.dashboardSnapshots = res.data;
                        this.isDirtyDashboardSnapshots = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDashboardSnapshots 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.dashboardSnapshots)
                        };

                        resolve(this.dashboardSnapshots);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDashboardSnapshots 2',
                    "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };

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
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDashboardSnapshots ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                this.getDashboardSnapshots()
                    .then(res => {
                        res = res.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardSnapshots = res;

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentDashboardSnapshots 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {dashboardID}, {res})
                        };

                        resolve(this.currentDashboardSnapshots);
                })
             })
        } else {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                let returnData: DashboardSnapshot[];
                returnData = this.dashboardSnapshots.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSnapshots = returnData;

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentDashboardSnapshots 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID})
                };

                resolve(this.currentDashboardSnapshots);
            });
        };
    }

    findlastDashboardSnapshot(dashboardID: number): Promise<DashboardSnapshot> {
        // Description: Gets all Sn for current D
        // Params:
        //   dashboardID
        // Returns: this.getDashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables findlastDashboardSnapshot ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
            return new Promise<DashboardSnapshot>((resolve, reject) => {
                this.getDashboardSnapshots()
                    .then(res => {
                        res = res.filter(
                            i => i.dashboardID == dashboardID
                        );
                        let lastDashboardSnapshot: DashboardSnapshot = null;
                        if (res.length > 0) {
                            lastDashboardSnapshot = res[res.length - 1];
                        };

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables findlastDashboardSnapshot 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {lastDashboardSnapshot})
                        };

                        resolve(lastDashboardSnapshot);
                })
             })
        } else {
            return new Promise<DashboardSnapshot>((resolve, reject) => {
                let returnData: DashboardSnapshot[];
                returnData = this.dashboardSnapshots.filter(
                    i => i.dashboardID == dashboardID
                );
                let lastDashboardSnapshot: DashboardSnapshot = null;
                if (returnData.length > 0) {
                    lastDashboardSnapshot = returnData[returnData.length - 1];
                };

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables findlastDashboardSnapshot 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID})
                };

                resolve(lastDashboardSnapshot);
            });
        };
    }

    newDashboardSnapshot(
        snapshotName: string,
        snapshotComment: string,
        snapshotType: string): Promise<any>  {
        // Description: Adds a new DashboardSnapshot
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables newDashboardSnapshot ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {snapshotName}, {snapshotComment}, {snapshotType});
        };

        return new Promise<any>((resolve, reject) => {

            // Create new record
            let newSn: DashboardSnapshot = {
                id: null,
                dashboardID: this.currentDashboardInfo.value.currentDashboardID,
                name: snapshotName,
                snapshotType: snapshotType,
                comment: snapshotComment,
                dashboards: this.currentDashboards.slice(),
                dashboardTabs: this.currentDashboardTabs.slice(),
                widgets: this.currentWidgets.slice(),
                datasets: this.currentDatasets.slice(),
                datasources: this.currentDatasources.slice(),
                widgetCheckpoints: this.currentWidgetCheckpoints.slice(),
                editedBy: '',
                editedOn: null,
                createdBy: this.currentUser.userID,
                createdOn: new Date()
            };

            // Add to DB
            this.addDashboardSnapshot(newSn).then(res => {
                resolve(res);
            });
        });
    }

    addDashboardSnapshot(data: DashboardSnapshot): Promise<any> {
        // Description: Adds a new DashboardSnapshot
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDashboardSnapshot ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardSnapshots';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.dashboardSnapshots.push(JSON.parse(JSON.stringify(res.data)));
                    this.currentDashboardSnapshots.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addDashboardSnapshot ADDED', res.data,
                            this.currentDashboardSnapshots, this.dashboardSnapshots)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDashboardSnapshot FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDashboardSnapshot(id: number): Promise<string> {
        // Description: Deletes a DashboardSnapshots
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardSnapshot ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardSnapshots';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboardSnapshots = this.dashboardSnapshots.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardSnapshots = this.currentDashboardSnapshots.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardSnapshot DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardSnapshot FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getDashboardTemplates(): Promise<Dashboard[]> {
        // Description: Gets all Tpl
        // Returns: recent [D] array, unless:
        //   If not cached or if dirty, get from File
        // Refresh from source at start, or if dirty
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardTemplates ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        if ( this.dashboards == []  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(res => {
                        let arrTemplateIDs: number[] = [];
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].templateDashboardID != 0  &&
                                res[i].templateDashboardID != null) {
                                arrTemplateIDs.push(res[i].templateDashboardID)
                            };
                        };
                        let returnData: Dashboard[] = [];
                        if (arrTemplateIDs.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                if (arrTemplateIDs.indexOf(res[i].id) != -1) {
                                    returnData.push(res[i]);
                                };
                            };
                        };

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDashboardTemplates 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {returnData})
                        };

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
                    };
                };
                let returnData: Dashboard[] = [];
                if (arrTemplateIDs.length > 0) {
                    for (var i = 0; i < this.dashboards.length; i++) {
                        if (arrTemplateIDs.indexOf(this.dashboards[i].id) != -1) {
                            returnData.push(this.dashboards[i]);
                        };
                    };
                };

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDashboardTemplates 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {returnData})
                };

                resolve(returnData);

            });
        };

    }

    getDatasources(): Promise<Datasource[]> {
        // Description: Gets all DS
        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDatasources ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'datasources';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.datasources = res.data;
                        this.isDirtyDatasources = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDatasources 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.datasources)
                        };

                        resolve(this.datasources);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDatasources 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };

                resolve(this.datasources);
            }
        });

    }

    getCurrentDatasources(dashboardID: number): Promise<Datasource[]> {
        // Description: Gets DS for current D
        // Params: dashboardID = current D
        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File
        // NB: assume this.currentWidgets exists !!
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDatasources ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // TODO - What if databoards empty or diry - is that okay?
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.getDatasources()
                    .then(ds =>
                        {
                            let datasourceIDs: number[] = [];
                            let dashboardWidgets: Widget[] = this.widgets.filter(w =>
                                w.dashboardID == dashboardID
                            );

                            for (var i = 0; i < dashboardWidgets.length; i++) {
                                if (datasourceIDs.indexOf(dashboardWidgets[i].datasourceID) < 0) {

                                    if (dashboardWidgets[i].datasourceID != null) {
                                        datasourceIDs.push(dashboardWidgets[i].datasourceID)
                                    };
                                }
                            };
                            let returnData: Datasource[] = [];
                            for (var i = 0; i < ds.length; i++) {
                                if (datasourceIDs.indexOf(ds[i].id) >= 0) {
                                    if (ds[i] != null) {
                                        returnData.push(ds[i]);
                                    };
                                };
                            };

                            this.isDirtyDatasources = false;
                            this.currentDatasources = returnData;
                            this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                            if (this.sessionDebugging) {
                                console.log('%c    Global-Variables getCurrentDatasources 1',
                                    "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                    {dashboardID}, this.currentDatasources);
                            };

                            resolve(this.currentDatasources);
                        }
                    )
            } else {
                let datasourceIDs: number[] = [];
                let dashboardWidgets: Widget[] = this.widgets.filter(w =>
                    w.dashboardID == dashboardID
                );

                for (var i = 0; i < dashboardWidgets.length; i++) {
                    if (datasourceIDs.indexOf(dashboardWidgets[i].datasourceID) < 0) {
                        if (dashboardWidgets[i].datasourceID != null) {
                            datasourceIDs.push(dashboardWidgets[i].datasourceID)
                        };
                    };
                };
                let returnData: Datasource[] = [];
                for (var i = 0; i < this.datasources.length; i++) {
                    if (datasourceIDs.indexOf(this.datasources[i].id) >= 0) {
                        returnData.push(this.datasources[i]);
                    };
                };

                this.isDirtyDatasources = false;
                this.currentDatasources = returnData;
                this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentDatasources 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID}, this.currentDatasources);
                };

                resolve(this.currentDatasources);
            }
        });
    }

    addDatasource(data: Datasource): Promise<any> {
        // Description: Adds a new Datasource, if it does not exist
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDatasource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasources';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    let newDS: Datasource = JSON.parse(JSON.stringify(res.data))
                    if (this.datasources.filter(i => i.id == newDS.id).length == 0) {
                        this.datasources.push(newDS);
                    };
                    if (this.currentDatasources.filter(i => i.id == newDS.id).length == 0) {
                        this.currentDatasources.push(newDS);
                    };

                    // Inform that we now at a DS
                    this.hasDatasources.next(true);

                    if (this.sessionDebugging) {
                        console.log('addDatasource ADDED', res.data,
                            this.currentDatasources, this.datasources)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDatasource FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    addCurrentDatasource(datasourceID: number){
        // Add DS AND dSet to current-arrays (from DS and dSet arrays) for a given DS-id
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addCurrentDatasource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<any>((resolve, reject) => {

            // Fill currentDS from DS, if required
            let localDatasource: Datasource;
            let datasourceIndex: number = this.datasources.findIndex(ds =>
                ds.id == datasourceID
            );
            let currentDatasourceIndex: number = this.currentDatasources
                .findIndex(dS => dS.id == datasourceID
            );

            // DS exists in gv datasources, but not in currentDatasources
            if (datasourceIndex >= 0  &&  currentDatasourceIndex < 0) {

                // Add DS to currentDS
                localDatasource = this.datasources[datasourceIndex];
                this.currentDatasources.push(localDatasource);

                this.hasDatasources.next(true);
            };
            let dataSetIndex: number = this.datasets.findIndex(dS =>
                dS.datasourceID == datasourceID
            );

            let currentDataSetIndex: number = this.currentDatasets
                .findIndex(dS => dS.id == datasourceID
            );

            // Dset exists in gv datasets, but not in currentDatasets
            if (dataSetIndex >= 0  &&  currentDataSetIndex < 0) {
                console.log('GV 0')
                // Get latest dSet-ID
                let allDataSets: number[] = [];
                let dSetID: number = -1;

                for (var i = 0; i < this.datasets.length; i++) {
                    if(this.datasets[i].datasourceID == datasourceID) {
                        allDataSets.push(this.datasets[i].id)
                    }
                };
                if (allDataSets.length > 0) {
                    dSetID = Math.max(...allDataSets);
                    console.log('GV 3')
                    // Get dSet with Data
                    this.getCurrentDataset(datasourceID, dSetID)
                        .then(res => {
                            console.log('GV 4', res)
                            resolve(res);
                        })
                        .catch(err => {
                            console.log('GV 5')
                            reject('Error:' + err.message);
                        });
                };
            };

            // Already there
            resolve('DS already in locals');
        });

    }

    saveDatasource(data: Datasource): Promise<string> {
        // Description: Saves Datasource
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDatasource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasources';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.currentDatasources.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.currentDatasources[localIndex] = data;
                    };
                    localIndex = this.datasources.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.datasources[localIndex] = data;
                    };

                    if (this.sessionDebugging) {
                        console.log('saveDatasource SAVED', {res})
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDatasource FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDatasource(id: number): Promise<string> {
        // Description: Deletes a Datasources
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDatasource ...',
            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasources';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.datasources = this.datasources.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDatasources = this.currentDatasources.filter(
                        dsp => dsp.id != id
                    );

                    // Delete where DS was used in Stored Template
                    this.getWidgetStoredTemplates().then(swt => {
                        swt.forEach(swt => {
                            this.widgets.forEach(w => {
                                if (swt.widgetID == w.id  &&  w.datasourceID == id) {
                                    this.deleteWidgetStoredTemplate(swt.id);
                                };
                            });
                        });
                    });

                    if (this.sessionDebugging) {
                        console.log('deleteDatasource DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDatasource FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    // TODO - is this still needed?
    deleteCurrentDatasource(id: number) {
        // Delete current DS
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteCurrentDatasource',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {id}, this.currentDatasources)
        };

        let index: number = -1;
        for (var i = 0; i < this.currentDatasources.length; i++) {
            if (this.currentDatasources[i].id == id) {
                index = i;
            };
        };
        if (index != -1) {
            this.currentDatasources.splice(index,1)
        };

        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteCurrentDatasource end',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                this.currentDatasources)
        };
    }

    getTransformations(): Promise<Transformation[]> {
        // Description: Gets all Tr
        // Returns: this.transformations array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getTransformations ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<Transformation[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.transformations.length == 0)  ||  (this.isDirtyTransformations) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'transformations';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.transformations = res.data;
                        this.isDirtyTransformations = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getTransformations 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {res})
                        };

                        resolve(this.transformations);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getTransformations 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                };

                resolve(this.transformations);
            }
        });

    }

    getCurrentTransformations(datasourceID: number): Promise<Transformation[]> {
        // Description: Gets Tr for current DS
        // Returns: this.currentTransformations.value array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentTransformations ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        if ( (this.currentTransformations.length == 0)  ||  (this.isDirtyTransformations) ) {
            return new Promise<Transformation[]>((resolve, reject) => {
                this.getTransformations()
                    .then(res => {
                        // data = data.filter(
                        //     i => i.datasourceID == datasourceID
                        // );
                        this.currentTransformations = res;

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getTransformations 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {datasourceID}, {res})
                        };

                        resolve(this.currentTransformations);
                })
             })
        } else {
            return new Promise<Transformation[]>((resolve, reject) => {
                let returnData: Transformation[];
                returnData = this.transformations;
                // returnData = this.transformations.filter(
                //     i => i.datasourceID == datasourceID
                // );
                this.currentTransformations = returnData;

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getTransformations 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {datasourceID}, {returnData})
                };

                resolve(this.currentTransformations);
            });
        };
    }

    getDatasourcePermissions(): Promise<DatasourcePermission[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePermissions array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDatasourcePermissions ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<DatasourcePermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePermissions.length == 0)  ||  (this.isDirtyDatasourcePermissions) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'datasourcePermissions';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        // Fill in @RunTime info
                        res.data.forEach(d => {
                            this.datasources.forEach(ds => {
                                if (ds.id == d.datasourceID) {
                                    d.name = ds.name;
                                };
                            });
                            this.canvasGroups.forEach(grp => {
                                if (grp.id == d.groupID) {
                                    d.groupName = grp.name;
                                };
                            });
                        });
                        this.datasourcePermissions = res.data;
                        this.isDirtyDatasourcePermissions = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getDatasourcePermissions 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.datasourcePermissions)
                        };

                        resolve(this.datasourcePermissions);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getDatasourcePermissions 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.datasourcePermissions)
                };

                resolve(this.datasourcePermissions);
            }
        });
    }

    getCurrentDatasourcePermissions(datasourceID: number): Promise<DatasourcePermission[]> {
        // Description: Gets DS-P for current DS
        // Returns: this.datasourcePermissions.value array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDatasourcePermissions ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {datasourceID});
        };

        if ( (this.currentDatasourcePermissions.length == 0)  ||  (this.isDirtyDatasourcePermissions) ) {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                this.getDatasourcePermissions()
                    .then(res => {
                        res = res.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourcePermissions = res;

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentDatasourcePermissions 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {datasourceID}, {res})
                        };

                        resolve(this.currentDatasourcePermissions);
                })
             })
        } else {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                let returnData: DatasourcePermission[];
                returnData = this.datasourcePermissions.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourcePermissions = returnData;

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentDatasourcePermissions 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {datasourceID})
                };

                resolve(this.currentDatasourcePermissions);
            });
        };

    }

    addDatasourcePermission(data: DatasourcePermission): Promise<any> {
        // Description: Adds a new DatasourcePermission, if it does not exist
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDatasourcePermission ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasourcePermissions';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    let newDS: DatasourcePermission = JSON.parse(JSON.stringify(res.data))
                    if (this.datasourcePermissions.filter(i => i.id == newDS.id).length == 0) {
                        this.datasourcePermissions.push(newDS);
                    };
                    if (this.currentDatasourcePermissions.filter(i => i.id == newDS.id).length == 0) {
                        this.currentDatasourcePermissions.push(newDS);
                    };

                    if (this.sessionDebugging) {
                        console.log('addDatasourcePermission ADDED', res.data,
                            this.currentDatasourcePermissions, this.datasourcePermissions)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addDatasourcePermission FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    saveDatasourcePermission(data: DatasourcePermission): Promise<string> {
        // Description: Saves DatasourcePermission
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDatasourcePermission ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasourcePermissions';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.datasourcePermissions.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.datasourcePermissions[localIndex] = data;
                    };
                    localIndex = this.currentDatasourcePermissions.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.currentDatasourcePermissions[localIndex] = data;
                    };

                    if (this.sessionDebugging) {
                        console.log('saveDatasourcePermission SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveDatasourcePermission FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });

    }

    deleteDatasourcePermission(id: number) {
        // Remove a record from the global and current DatasourcePermissions
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDatasourcePermission ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'datasourcePermissions';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };


                    this.datasourcePermissions = this.datasourcePermissions.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDatasourcePermissions = this.currentDatasourcePermissions.filter(
                        dsp => dsp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteDatasourcePermission DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDatasourcePermission FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });


    }

    getSystemSettings(): Promise<CanvasSettings> {
        // Description: Gets system settings
        // Returns: this.canvasSettings object, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getSystemSettings ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<CanvasSettings>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyCanvasSettings) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'canvasSettings';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
                            return;
                        };
                        if(res.data.length == 0) {
                            reject(res.message);
                            return;
                        };
                        this.canvasSettings = res.data[0];

                        // Load global Vars
                        // TODO - create glob vars when needed, or delete totally
                        // this.canvasSettings.companyName = res.data.companyName;
                        // this.canvasSettings.companyLogo = res.data.companyLogo;
                        // this.canvasSettings.dashboardTemplate = res.data.dashboardTemplate;
                        // this.canvasSettings.maxTableLength = +res.data.maxTableLength;
                        // this.canvasSettings.widgetsMinZindex = +res.data.widgetsMinZindex;
                        // this.canvasSettings.widgetsMaxZindex = +res.data.widgetsMaxZindex;
                        // this.canvasSettings.gridSize = +res.data.gridSize;
                        // this.canvasSettings.snapToGrid = res.data.snapToGrid;
                        // this.canvasSettings.printDefault = res.data.printDefault;
                        // this.canvasSettings.printSize = res.data.printSize;
                        // this.canvasSettings.printLayout = res.data.printLayout;
                        // this.canvasSettings.notInEditModeMsg = res.data.notInEditModeMsg;
                        // this.canvasSettings.noQueryRunningMessage = res.data.noQueryRunningMessage;
                        // this.canvasSettings.queryRunningMessage = res.data.queryRunningMessage;

                        // Sanitize
                        if (this.canvasSettings.gridSize > 100
                            || this.canvasSettings.gridSize == null
                            || this.canvasSettings.gridSize == undefined) {
                            this.canvasSettings.gridSize = 100;
                        };

                        this.isDirtyCanvasSettings = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getSystemSettings 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.canvasSettings, this.canvasSettings.companyName, res)
                        };
                        resolve(this.canvasSettings);
                    },
                    err => {
                        reject(err.message)
                    });
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getSystemSettings 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.canvasSettings)
                };

                resolve(this.canvasSettings);
            }
        });

    }

    saveSystemSettings(data: CanvasSettings): Promise<string> {
        // Description: Saves system settings
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveSystemSettings ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasSettings';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.canvasSettings = JSON.parse(JSON.stringify(res.data));

                    if (this.sessionDebugging) {
                        console.log('saveSystemSettings SAVED', {res})
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveSystemSettings FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDashboardSubscription(id: number): Promise<string> {
        // Description: Deletes a DashboardSubscription
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardSubscription ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardSubscriptions';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.dashboardSubscriptions = this.dashboardSubscriptions.
                        filter(sub => sub.id != id);

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardSubscription DELETED', {id}, {res},
                            this.dashboardSubscriptions)
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardSubscription FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    getPaletteButtonBar(): Promise<PaletteButtonBar[]> {
        // Description: Gets currentgetPaletteButtonBar
        // Returns: this.currentgetPaletteButtonBar object, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getPaletteButtonBar ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<PaletteButtonBar[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyPaletteButtonBar) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'paletteButtonBars';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.currentPaletteButtonBar = res.data;

                        this.isDirtyPaletteButtonBar = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getPaletteButtonBar 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.currentPaletteButtonBar)
                        };

                        resolve(this.currentPaletteButtonBar);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getPaletteButtonBar 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.currentPaletteButtonBar)
                };

                resolve(this.currentPaletteButtonBar);
            }
        });

    }

    savePaletteButtonBar(data: PaletteButtonBar): Promise<string> {
        // Description: Saves PaletteButtonBar
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables savePaletteButtonBar ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'paletteButtonBars';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.currentPaletteButtonBar.findIndex(d =>
                        d.id == data.id
                    );
                    this.currentPaletteButtonBar[localIndex] = data;

                    if (this.sessionDebugging) {
                        console.log('savePaletteButtonBar SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error savePaletteButtonBar FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getPaletteButtonsSelected(): Promise<PaletteButtonsSelected[]> {
        // Description: Gets currentgetPaletteButtonsSelected
        // Returns: this.currentgetPaletteButtonsSelected object, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getPaletteButtonsSelected ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<PaletteButtonsSelected[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyPaletteButtonsSelected) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'paletteButtonsSelecteds';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        res.data = res.data.sort( (obj1,obj2) => {
                            if (obj1.sortOrderSelected > obj2.sortOrderSelected) {
                                return 1;
                            };
                            if (obj1.sortOrderSelected < obj2.sortOrderSelected) {
                                return -1;
                            };
                            return 0;
                        });
                        this.currentPaletteButtonsSelected.next(res.data);

                        this.isDirtyPaletteButtonsSelected = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getPaletteButtonsSelected 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.currentPaletteButtonsSelected.value);
                        };

                        resolve(this.currentPaletteButtonsSelected.value);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getPaletteButtonsSelected 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.currentPaletteButtonsSelected.value);
                };

                resolve(this.currentPaletteButtonsSelected.value);
            }
        });

    }

    addPaletteButtonsSelected(data: PaletteButtonsSelected): Promise<any> {
        // Description: Adds a new PaletteButtonsSelected
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addPaletteButtonsSelected ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'paletteButtonsSelecteds';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                        // Update Global vars to make sure they remain in sync
                        this.currentPaletteButtonsSelected.value.push(JSON.parse(JSON.stringify(res.data)));

                        // Inform subscribers
                        this.currentPaletteButtonsSelected.next(
                            this.currentPaletteButtonsSelected.value
                        );

                        if (this.sessionDebugging) {
                            console.log('PaletteButtonsSelected ADDED', res.data, this.currentPaletteButtonsSelected)
                        };

                        resolve(res.data);
                    },
                    err => {
                        if (this.sessionDebugging) {
                            console.log('Error addPaletteButtonsSelected FAILED', {err});
                        };

                        reject(err.message);
                    }
                )
        });
    }

    savePaletteButtonsSelected(data: PaletteButtonsSelected): Promise<string> {
        // Description: Saves PaletteButtonsSelected
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables savePaletteButtonsSelected ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'paletteButtonsSelecteds';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.currentPaletteButtonsSelected.value.findIndex(d =>
                        d.id == data.id
                    );
                    this.currentPaletteButtonsSelected.value[localIndex] = data;

                    if (this.sessionDebugging) {
                        console.log('savePaletteButtonsSelected SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error savePaletteButtonsSelected FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deletePaletteButtonsSelected(id: number): Promise<string> {
        // Description: Deletes a PaletteButtonsSelected
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deletePaletteButtonsSelected ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'paletteButtonsSelecteds';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // This is a different case: currentPaletteButtonsSelected is an
                    // Observable, and will be refreshed with a .next by the calling
                    // routine
                    let dID: number = -1;
                    for (var i = 0; i < this.currentPaletteButtonsSelected.value.length; i++) {

                        if (this.currentPaletteButtonsSelected.value[i].id == id) {
                            dID = i;
                            break;
                        };
                    };
                    if (dID >=0) {
                        this.currentPaletteButtonsSelected.value.splice(dID, 1);
                    };

                    // Inform subscribers
                    this.currentPaletteButtonsSelected.next(
                        this.currentPaletteButtonsSelected.value
                    );

                    if (this.sessionDebugging) {
                        console.log('deletePaletteButtonsSelected DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deletePaletteButtonsSelected FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getWidgets(params: string = ''): Promise<Widget[]> {
        // Description: Gets all W
        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getWidgets ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                this.widgets.length);
        };

        return new Promise<Widget[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgets.length == 0)  ||  (this.isDirtyWidgets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'widgets' + params;
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res => {

                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.widgets = res.data;

                        // TODO - fix hardcoding, issue with datalib jsonTree
                        this.widgets.forEach(w => {

                            // TODO - with DB, get summarised fields like NrComments, NrDataQual, etc

                            // Get Checkpoint info for ALL W, not only current one
                            // TODO - fix when using DB
                            let tempChk: WidgetCheckpoint[] = this.widgetCheckpoints
                                .filter(wc =>
                                    wc.dashboardID == w.dashboardID
                                    &&
                                    wc.widgetID == w.id
                            );

                            if (tempChk.length > 0) {
                                w.showCheckpoints = false;
                                w.checkpointIDs = [];
                                w.currentCheckpoint = 0;
                                w.lastCheckpoint = tempChk.length - 1;

                                for (var x = 0; x < tempChk.length; x++) {
                                    w.checkpointIDs.push(tempChk[x].id);
                                };

                            } else {
                                w.showCheckpoints = false;
                                w.checkpointIDs = [];
                                w.currentCheckpoint = 0;
                                w.lastCheckpoint = -1;
                            };

                            // Constants in Text and Bullets
                            if (w.widgetType == 'Shape') {
                                if (w.widgetSubType == 'Text') {
                                    w.shapeTextDisplay =
                                        this.calcShapeTextDisplay(w.shapeText);
                                };
                            };

                            // TODO - this does NOT work in datalib: if the first dashboardTabIDs
                            // = "a,b,c", then all works.  Else, it gives a big number 1046785...
                            // irrespective ...
                            // if (w.dashboardTabIDs != null) {
                            //     // re = regEx
                            //     var re = /t/gi;
                            //     let d: string = w.dashboardTabIDs.toString();
                            //     d = d.replace(re, '');
                            //     let dA: string[] = d.split(',');
                            //     w.dashboardTabIDs = [];
                            //     dA.forEach(da => w.dashboardTabIDs.push(+da));
                            // }

                            // TODO - fix when using DB
                            // Update slicerSelection
                            // if (w.slicerSelection != null) {
                            //     let s: string = w.slicerSelection.toString();
                            //     let sF: string[] = s.split(',');
                            //     let sO: {isSelected: boolean; fieldValue: string}[] = [];
                            //     let i: number = 0;
                            //     let oSel: boolean;
                            //     let oFld: string;
                            //     w.slicerSelection = [];
                            //     sF.forEach(s => {
                            //         i = i + 1;
                            //         if (i == 1) {
                            //             oSel = (s == 'true');
                            //         } else {
                            //             oFld = s;
                            //             i = 0;
                            //             let o: {isSelected: boolean; fieldValue: string} =
                            //                 {isSelected: oSel, fieldValue: oFld};
                            //             w.slicerSelection.push(o);
                            //         }
                            //     })
                            // };

                            // TODO - fix when using DB
                            // Update slicerBins
                            if (w.slicerBins != null) {
                                let s: string = w.slicerBins.toString();
                                let sF: string[] = s.split(',');
                                let sO: {
                                    isSelected: boolean; name: string; fromValue: number; toValue: number
                                }[] = [];
                                let i: number = 0;
                                let oSel: boolean;
                                let oName: string;
                                let oFrom: number;
                                let oTo: number;
                                w.slicerBins = [];
                                sF.forEach(s => {
                                    i = i + 1;
                                    if (i == 1) {
                                        oSel = (s == 'true');
                                    };
                                    if (i == 2) {
                                        oName = s;
                                    };
                                    if (i == 3) {
                                        oFrom = +s;
                                    };
                                    if (i == 4) {
                                        oTo  = +s;
                                        i = 0;
                                        let o: {isSelected: boolean; name: string; fromValue: number; toValue: number} =
                                            {isSelected: oSel, name: oName, fromValue: oFrom, toValue: oTo};

                                        w.slicerBins.push(o);
                                    }
                                })
                            };
                        });

                        this.isDirtyWidgets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getWidgets 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.widgets)
                        };

                        resolve(this.widgets);
                    },
                    err => {
                        reject(err.message)
                    }
                )
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getWidgets 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.widgets)
                };

                this.widgets.forEach(w => {

                    // Constants in Text and Bullets
                    if (w.widgetType == 'Shape') {
                        if (w.widgetSubType == 'Text') {
                            w.shapeTextDisplay =
                                this.calcShapeTextDisplay(w.shapeText);
                        };
                    };
                });

                resolve(this.widgets);
            }
        });

    }

    getCurrentWidgets(dashboardID: number, dashboardTabID: number): Promise<Widget[]> {
        // Description: Gets all W for current D
        // Params:
        //   dashboardID
        //   dashboardTabID (0 => all Tabs)
        // Returns: arrays of current W, Sl, Sh, Tbl; unless:
        //   If not cached or if dirty, get from File
        // Usage: getWidgets(1, -1)  =>  Returns W for DashboardID = 1
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentWidgets ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID}, {dashboardTabID});
        };

        // Refresh from source at start, or if dirty
        if ( (this.widgets.length == 0)  ||  (this.isDirtyWidgets) ) {
            return new Promise<Widget[]>((resolve, reject) => {
                this.getWidgets()
                    .then(res => {

                        // Filter the widgets
                        // TODO - use i.dashboardTabIDs.indexOf(dashboardTabID) >= 0 once datalib
                        // reads arrays correctly.  That should be the only change ...
                        res = res.filter(
                            i => (i.dashboardID == dashboardID)
                                 &&
                                 (i.dashboardTabIDs.indexOf(dashboardTabID) >= 0)
                        );
                        this.currentWidgets = res;

                        // Constants in Text and Bullets
                        this.currentWidgets.forEach(w => {
                            if (w.widgetType == 'Shape') {
                                if (w.widgetSubType == 'Text') {
                                    w.shapeTextDisplay =
                                        this.calcShapeTextDisplay(w.shapeText);
                                };
                            };
                        });

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentWidgets 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.currentWidgets)
                        };

                        resolve(this.currentWidgets);
                })
             })
        } else {
            return new Promise<Widget[]>((resolve, reject) => {

                // Filter all Tabs belonging to this D
                let data: Widget[];
                data = this.widgets.filter(
                    i => (i.dashboardID == dashboardID)
                    &&
                    (i.dashboardTabIDs.indexOf(dashboardTabID) >= 0)
                )

                // Constants in Text and Bullets
                this.currentWidgets.forEach(w => {
                    if (w.widgetType == 'Shape') {
                        if (w.widgetSubType == 'Text') {
                            w.shapeTextDisplay =
                                this.calcShapeTextDisplay(w.shapeText);
                        };
                    };
                });

                this.currentWidgets = data;

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentWidgets 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID}, {dashboardTabID},  this.currentWidgets, this.widgets)
                };

                resolve(this.currentWidgets);

            });
        };

    }

    addWidget(data: Widget): Promise<any> {
        // Description: Adds a new Widget
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addWidget ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgets';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.widgets.push(JSON.parse(JSON.stringify(res.data)));
                    this.currentWidgets.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addWidget ADDED', res.data, this.widgets)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addWidget FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    saveWidget(data: Widget): Promise<string> {
        // Description: Saves Widget
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveWidget ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgets';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update widgets and currentWidgets
                    this.widgetReplace(data);

                    //     // TODO - do this better in a DB
                    //     if (this.currentWidgetCheckpoints.length > 0) {
                    //         this.currentWidgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //             };
                    //         });
                    //     };
                    //     if (this.widgetCheckpoints.length > 0) {
                    //         this.widgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //                 this.saveWidgetCheckpoint(chk);
                    //             };
                    //         });
                    //     };
                    // };

                    // TODO - remove the commented code once all good
                    // Mark Checkpoints to indicate parentW is dead
                    // if (data.isTrashed) {

                    //     // TODO - do this better in a DB
                    //     if (this.currentWidgetCheckpoints.length > 0) {
                    //         this.currentWidgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //             };
                    //         });
                    //     };
                    //     if (this.widgetCheckpoints.length > 0) {
                    //         this.widgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //                 this.saveWidgetCheckpoint(chk);
                    //             };
                    //         });
                    //     };
                    // };

                    if (this.sessionDebugging) {
                        console.log('saveWidget SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveWidget FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    duplicateSingleWidget(originalWidget: Widget) {
        // Duplicate the given Widget
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables duplicateSingleWidget ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {originalWidget});
        };

        // Find latest copy #
        let copyPosition: number = 1;
        for (var i = 0; i < 21; i++) {
            this.currentWidgets.forEach(w => {
                if ( w.titleText.includes(' (copy ' + i.toString() + ')') ) {
                    copyPosition = i + 1;
                };
            });
        };

        // Make a deep copy
        let copiedWidget: Widget = JSON.parse(JSON.stringify(originalWidget));

        copiedWidget._id = null;
        copiedWidget.id = null;
        copiedWidget.dashboardID = this.currentDashboardInfo.value.currentDashboardID;
        copiedWidget.dashboardTabID = this.currentDashboardInfo.value.currentDashboardTabID;

        // Assume this is a NEW W, so forget about tabs that original belongs
        copiedWidget.dashboardTabIDs = [copiedWidget.dashboardTabID];
        copiedWidget.isSelected = false;
        copiedWidget.containerLeft = 120;
        copiedWidget.containerTop = 120;
        copiedWidget.isLocked = false;
        copiedWidget.titleText = copiedWidget.titleText + ' (copy ' +
            copyPosition.toString() + ')';

        // Add to all and current W
        this.addWidget(copiedWidget).then(res => {
            copiedWidget.id = res.id;

            this.changedWidget.next(copiedWidget);

            // Add to Action log
            this.actionUpsert(
                null,
                this.currentDashboardInfo.value.currentDashboardID,
                this.currentDashboardInfo.value.currentDashboardTabID,
                copiedWidget.id,
                'Widget',
                'Edit',
                'Duplicate',
                'App clickMenuWidgetDuplicate',
                null,
                null,
                null,
                copiedWidget
            );
        });

    }

    deleteWidget(id: number): Promise<string> {
        // Description: Deletes a Widgets
        // Returns: 'Deleted' or error message
        // NOTE: this permananently deletes a W, from arrays and DB.
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteWidget ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgets';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.widgets = this.widgets.filter(
                        w => w.id != id
                    );
                    this.currentWidgets = this.currentWidgets.filter(
                        w => w.id != id
                    );

                    // Delete where W was used in Chkpnt
                    this.widgetCheckpoints.forEach(chk => {
                        if (chk.widgetID == id) {
                            this.deleteWidgetCheckpoint(chk.id);
                        };
                    });

                    // Delete where W was used in Stored Template
                    this.getWidgetStoredTemplates().then(swt => {
                        swt = swt.filter(w1 => w1.widgetID == id);
                        swt.forEach(w2 => {
                            this.deleteWidgetStoredTemplate(w2.id);
                        });
                    });

                    if (this.sessionDebugging) {
                        console.log('deleteWidget DELETED id: ', {id}, this.widgetCheckpoints,
                            this.currentWidgetCheckpoints)
                    };

                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteWidget FAILED', {err});
                    reject(err.message);
                }
            )
        });
    }

    getWidgetsInfo(): Promise<boolean> {
        // Description: Gets data and other info for [W]
        // Returns: this.datasets, currentDataset array
        // NB: this assumes [W] and [datasets] are available !!
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getWidgetsInfo ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        // Empty the necessary
        let dsCurrIDs: number[] = [];       // Current Dataset IDs
        let promiseArray = [];

        // Get list of dSet-ids to make array work easier
        this.currentDatasets.forEach(d => dsCurrIDs.push(d.id));

        return new Promise(async (resolve, reject) => {

            // Construct array with correct datasetIDs
            this.currentWidgets.forEach(w => {

                // Constants in Text and Bullets
                if (w.widgetType == 'Shape') {
                    if (w.widgetSubType == 'Text') {
                        w.shapeTextDisplay =
                            this.calcShapeTextDisplay(w.shapeText);
                    };
                };

                // Only get data from Graphs and Text boxes
                if (w.datasourceID != null  &&  w.datasetID != null) {

                    // Build array of promises, each getting data for 1 widget if not store already
                    if (dsCurrIDs.indexOf(w.datasetID) < 0) {

                        // Get the latest datasetID (when -1 is stored on W)
                        if (w.datasetID == -1) {
                            let ds: number[]=[];

                            for (var i = 0; i < this.datasets.length; i++) {
                                if(this.datasets[i].datasourceID == w.datasourceID) {
                                    ds.push(this.datasets[i].id)
                                }
                            };
                            if (ds.length > 0) {
                                w.datasetID = Math.max(...ds);
                            };
                        };

                        // Remember, AFTER latest was found
                        dsCurrIDs.push(w.datasetID);

                        promiseArray.push(this.getCurrentDataset(w.datasourceID, w.datasetID));
                    };
                }
            });

            // Get all the dataset to local vars
            this.allWithAsync(...promiseArray)
                .then(resolvedData => {

                    // Filter currentDatasets by Sl linked to DS
                    this.currentDatasets.forEach(cd => {
                        // TODO - improve
                        // this.filterSlicer(cd);
                    })

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getWidgetsInfo 1 True',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
                    };

                    resolve(true);
                },
                rejectionReason => console.log('reason:', {rejectionReason}) // reason: rejected!
            );
        });
    }

    allWithAsync = (...listOfPromises) => {
        // Resolve all promises in array
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables allWithAsync ...',
                "color: black; background: lightgray; font-size: 10px");
        };

        return new Promise(async (resolve, reject) => {
            let results = []
            if (listOfPromises.length == 0) {
                resolve(true);
            } else {
                for (let promise of listOfPromises.map(Promise.resolve, Promise)) {
                    results.push(await promise.then(async resolvedData => await resolvedData, reject))
                    if (results.length === listOfPromises.length) resolve(results)
                }
            };
        })
    }

    getBackgroundColors(): Promise<CSScolor[]> {
        // Description: Gets all Background colors
        // Returns: this.backgroundcolors array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getBackgroundColors ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<CSScolor[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.backgroundcolors.length == 0)  ||  (this.isDirtyBackgroundColors) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'canvasBackgroundcolors';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
                            return;
                        };

                        this.backgroundcolors = res.data;

                        // Sort the list
                        this.backgroundcolors.sort( (obj1,obj2) => {
                            if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                                return 1;
                            };
                            if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                                return -1;
                            };
                            return 0;
                        });

                        this.isDirtyBackgroundColors = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getBackgroundColors 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.backgroundcolors)
                        };

                        resolve(this.backgroundcolors);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getBackgroundColors 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.backgroundcolors)
                };

                // Sort the list
                this.backgroundcolors.sort( (obj1,obj2) => {
                    if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });

                resolve(this.backgroundcolors);
            }
        });

    }

    addBackgroundColor(data: CSScolor): Promise<any> {
        // Description: Adds a new BackgroundColor
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addBackgroundColor ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");


            let pathUrl: string = 'canvasBackgroundcolors';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers})
                .subscribe(
                    res => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
                            return;
                        };

                        // Update Global vars to make sure they remain in sync
                        this.backgroundcolors.push(JSON.parse(JSON.stringify(res.data)));

                        if (this.sessionDebugging) {
                            console.log('addBackgroundColor ADDED', {res}, this.backgroundcolors)
                        };

                        resolve(res.data);
                    },
                    err => {
                        if (this.sessionDebugging) {
                            console.log('Error addBackgroundColor FAILED', {err});
                        };

                        reject(err.message);
                    }
                )
        });
    }

    saveBackgroundColor(data: CSScolor): Promise<string> {
        // Description: Saves BackgroundColor
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveBackgroundColor ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            let pathUrl: string = 'canvasBackgroundcolors';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // Replace local
                    let localIndex: number = this.backgroundcolors.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.backgroundcolors[localIndex] = data;
                    };

                    if (this.sessionDebugging) {
                        console.log('saveBackgroundColor SAVED', {res})
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveBackgroundColor FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteBackgroundColor(id: number): Promise<string> {
        // Description: Deletes a BackgroundColor
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteBackgroundColor ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasBackgroundcolors';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // This is a different case: BackgroundColors is an
                    // Observable, and will be refreshed with a .next by the calling
                    // routine
                    let dID: number = -1;
                    for (var i = 0; i < this.backgroundcolors.length; i++) {

                        if (this.backgroundcolors[i].id == id) {
                            dID = i;
                            break;
                        };
                    };
                    if (dID >=0) {
                        this.backgroundcolors.splice(dID, 1);
                    };

                    if (this.sessionDebugging) {
                        console.log('deleteBackgroundColor DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteBackgroundColor FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    updateCanvasMessagesAsRead(userID: string): Promise<string> {
        // Marks all messages for this userID as read - typically done when Messages form
        // is closed, or at logout.
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables updateCanvasMessagesAsRead ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {userID});
        };
        

        // TODO - this must be done via the DB: for now, only glob-var array
        // let today = new Date();
        // this.canvasMessages.forEach(msg => {
        //     msg.recipients.forEach(rec => {
        //         if (rec.userID == userID) {
        //             rec.readOn = today;
        //         };
        //     });
        // });


        return new Promise<string>((resolve, reject) => {

            // Perform steps (business logic in Server)
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = '/canvasDataMarkMessagesAsRead';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl + '?userID=' 
                + userID, null, {headers})
                .subscribe(
                    res => {
                        if(res.statusCode != 'success') {
                            reject('Error marking Messages as read: '+ res.message);
                        };
                        resolve("Done");
                    },
                    err => {
                        console.log('Error marking Messages as read: ', {err});
                        reject('Error marking Messages as read FAILED: ' + err.message);
                    }
                )
        })


    }

    getWidgetCheckpoints(): Promise<WidgetCheckpoint[]> {
        // Description: Gets all Canvas Messages
        // Returns: this.widgetCheckpoints array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getWidgetCheckpoints ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                this.widgetCheckpoints.length);
        };

        return new Promise<WidgetCheckpoint[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgetCheckpoints.length == 0)  ||  (this.isDirtyWidgetCheckpoints) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'widgetCheckpoints';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.widgetCheckpoints = res.data.filter(d => (!d.parentWidgetIsDeleted) );

                        this.isDirtyWidgetCheckpoints = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getWidgetCheckpoints 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.widgetCheckpoints)
                        };

                        resolve(this.widgetCheckpoints);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getWidgetCheckpoints 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.widgetCheckpoints)
                };

                resolve(this.widgetCheckpoints);
            }
        });

    }

    getCurrentWidgetCheckpoints(dashboardID: number): Promise<WidgetCheckpoint[]> {
        // Description: Gets all Checkpoints for current D
        // Returns: this.currentWidgetCheckpoints array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentWidgetCheckpoints ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };

        // Refresh from source at start, or if dirty
        if ( (this.widgetCheckpoints.length == 0)  ||  (this.isDirtyWidgetCheckpoints) ) {
            return new Promise<WidgetCheckpoint[]>((resolve, reject) => {
                this.getWidgetCheckpoints()
                    .then(res => {
                        res = res.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentWidgetCheckpoints = res;

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCurrentWidgetCheckpoints 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                {dashboardID}, {res})
                        };

                        resolve(this.currentWidgetCheckpoints);

                })
             })
        } else {
            return new Promise<WidgetCheckpoint[]>((resolve, reject) => {
                let returnData: WidgetCheckpoint[];
                returnData = this.widgetCheckpoints.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentWidgetCheckpoints = returnData;

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCurrentWidgetCheckpoints 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        {dashboardID}, {returnData})
                };

                resolve(this.currentWidgetCheckpoints);
            });
        };

    }

    addWidgetCheckpoint(data: WidgetCheckpoint): Promise<any> {
        // Description: Adds a new WidgetCheckpoint
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addWidgetCheckpoint ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgetCheckpoints';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.widgetCheckpoints.push(JSON.parse(JSON.stringify(res.data)));
                    this.currentWidgetCheckpoints.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addWidgetCheckpoint ADDED', res.data,
                            this.currentWidgetCheckpoints, this.widgetCheckpoints)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addWidgetCheckpoint FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    saveWidgetCheckpoint(data: WidgetCheckpoint): Promise<string> {
        // Description: Saves Widget Checkpoint
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveWidgetCheckpoint ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgetCheckpoints';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.widgetCheckpoints.findIndex(d =>
                        d.id == data.id
                    );
                    this.widgetCheckpoints[localIndex] = data;

                    if (this.sessionDebugging) {
                        console.log('saveWidgetCheckpoint SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveWidgetCheckpoint FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteWidgetCheckpoint(id: number): Promise<string> {
        // Description: Deletes a WidgetCheckpoints
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteWidgetCheckpoint ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgetCheckpoints';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update vars
                    this.widgetCheckpoints = this.widgetCheckpoints.filter(
                        chk => chk.id != id
                    );
                    this.currentWidgetCheckpoints = this.currentWidgetCheckpoints.filter(
                        chk => chk.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteWidgetCheckpoint DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteWidgetCheckpoint FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    getCanvasUsers(): Promise<CanvasUser[]> {
        // Description: Gets all Canvas Users
        // Returns: this.users array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCanvasUsers ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<CanvasUser[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasUsers.length == 0)  ||  (this.isDirtyCanvasUsers) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'canvasUsers';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.canvasUsers = res.data;
                        this.isDirtyCanvasUsers = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        // Set Default to false
                        this.canvasUsers.forEach(cu => {

                            if (cu.dashboardCanViewRole == undefined) {
                                cu.dashboardCanViewRole = false;
                            };
                            if (cu.dashboardCanSaveRole == undefined) {
                                cu.dashboardCanSaveRole = false;
                            };
                            if (cu.dashboardCanGrantAccessRole == undefined) {
                                cu.dashboardCanGrantAccessRole = false;
                            };
                            if (cu.dashboardCanEditRole == undefined) {
                                cu.dashboardCanEditRole = false;
                            };
                            if (cu.dashboardCanDeleteRole == undefined) {
                                cu.dashboardCanDeleteRole = false;
                            };
                            if (cu.dashboardCanCreateRole == undefined) {
                                cu.dashboardCanCreateRole = false;
                            };
                            if (cu.dashboardCanAddDatasourceRole == undefined) {
                                cu.dashboardCanAddDatasourceRole = false;
                            };
                            if (cu.canManageGroupRole == undefined) {
                                cu.canManageGroupRole = false;
                            };
                            if (cu.datasourceCanCreateRole == undefined) {
                                cu.datasourceCanCreateRole = false;
                            };
                            if (cu.datasourceCanViewRole == undefined) {
                                cu.datasourceCanViewRole = false;
                            };
                            if (cu.datasourceCanEditRole == undefined) {
                                cu.datasourceCanEditRole = false;
                            };
                            if (cu.datasourceCanDeleteRole == undefined) {
                                cu.datasourceCanDeleteRole = false;
                            };
                            if (cu.datasourceCanGrantAccessRole == undefined) {
                                cu.datasourceCanGrantAccessRole = false;
                            };
                        });

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getCanvasUsers 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.canvasUsers)
                        };

                        resolve(this.canvasUsers);
                    });
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getCanvasUsers 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.canvasUsers)
                };

                resolve(this.canvasUsers);
            }
        });

    }

    addCanvasUser(data: CanvasUser): Promise<any> {
        // Description: Adds a new canvasUser
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addCanvasUser ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasUsers';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.canvasUsers.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addCanvasUser ADDED', res.data, this.canvasUsers)
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addCanvasUser FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    clearCurrentUser() {
        // Description: reset the Global currentUser variable
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables clearCurrentUser ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        this.currentUser.userID = '';
        this.currentUser.isSuperuser = false;
        this.currentUser.isStaff = false;
        this.currentUser.groups = [];
        this.currentUser.dashboardCanViewRole = false;
        this.currentUser.dashboardCanSaveRole = false;
        this.currentUser.dashboardCanGrantAccessRole = false;
        this.currentUser.dashboardCanEditRole = false;
        this.currentUser.dashboardCanDeleteRole = false;
        this.currentUser.dashboardCanCreateRole = false;
        this.currentUser.dashboardCanAddDatasourceRole = false;
        this.currentUser.canManageGroupRole = false;
        this.currentUser.datasourceCanCreateRole = false;
        this.currentUser.datasourceCanViewRole = false;
        this.currentUser.datasourceCanEditRole = false;
        this.currentUser.datasourceCanDeleteRole = false;
        this.currentUser.datasourceCanGrantAccessRole = false;
    }

    updateCurrentUserProperties(parameters:
        {
            isFirstTimeUser?: boolean,
            preferencePaletteHorisontal?: boolean,
            preferencePlaySound?: boolean,
            preferenceAutoSync?: boolean,
            preferenceShowOpenStartupMessage?: boolean,
            preferenceShowOpenDataCombinationMessage?: boolean,
            preferenceShowViewStartupMessage?: boolean,
            preferenceShowDiscardStartupMessage?: boolean,
            preferenceDefaultTemplateID?: number,
            preferenceDefaultDateformat?: string,
            preferenceDefaultFolder?: string,
            preferenceDefaultPrinter?: string,
            preferenceDefaultPageSize?: string,
            preferenceDefaultPageLayout?: string,
            preferenceDefaultSnapshotMins?: number,
            preferenceStartupDashboardID?: number,
            preferenceStartupDashboardTabID?: number,
            preferenceShowWidgetEditorLite?: boolean
        }
        ) {
        // Description: update properties in the the Global currentUser variable
        // NOTE: This does NOT update the DB or any other Variable
        // Returns: 'Setted', else 'Error: userID does not exist in canvasUsers'
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables updateCurrentUserProperties ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        if (parameters.isFirstTimeUser != null) {
            this.currentUser.isFirstTimeUser = parameters.isFirstTimeUser;
        };
        if (parameters.preferencePaletteHorisontal != null) {
            this.currentUser.preferencePaletteHorisontal = parameters.preferencePaletteHorisontal;
        };
        if (parameters.preferencePlaySound != null) {
            this.currentUser.preferencePlaySound = parameters.preferencePlaySound;
        };
        if (parameters.preferenceAutoSync != null) {
            this.currentUser.preferenceAutoSync = parameters.preferenceAutoSync;
        };
        if (parameters.preferenceShowOpenStartupMessage != null) {
            this.currentUser.preferenceShowOpenStartupMessage = parameters.preferenceShowOpenStartupMessage;
        };
        if (parameters.preferenceShowOpenDataCombinationMessage != null) {
            this.currentUser.preferenceShowOpenDataCombinationMessage = parameters.preferenceShowOpenDataCombinationMessage;
        };
        if (parameters.preferenceShowViewStartupMessage != null) {
            this.currentUser.preferenceShowViewStartupMessage = parameters.preferenceShowViewStartupMessage;
        };
        if (parameters.preferenceShowDiscardStartupMessage != null) {
            this.currentUser.preferenceShowDiscardStartupMessage = parameters.preferenceShowDiscardStartupMessage;
        };
        if (parameters.preferenceDefaultTemplateID != null) {
            this.currentUser.preferenceDefaultTemplateID = parameters.preferenceDefaultTemplateID;
        };
        if (parameters.preferenceDefaultDateformat != null) {
            this.currentUser.preferenceDefaultDateformat = parameters.preferenceDefaultDateformat;
        };
        if (parameters.preferenceDefaultFolder != null) {
            this.currentUser.preferenceDefaultFolder = parameters.preferenceDefaultFolder;
        };
        if (parameters.preferenceDefaultPrinter != null) {
            this.currentUser.preferenceDefaultPrinter = parameters.preferenceDefaultPrinter;
        };
        if (parameters.preferenceDefaultPageSize != null) {
            this.currentUser.preferenceDefaultPageSize = parameters.preferenceDefaultPageSize;
        };
        if (parameters.preferenceDefaultPageLayout != null) {
            this.currentUser.preferenceDefaultPageLayout = parameters.preferenceDefaultPageLayout;
        };
        if (parameters.preferenceDefaultSnapshotMins != null) {
            this.currentUser.preferenceDefaultSnapshotMins = parameters.preferenceDefaultSnapshotMins;
        };

        if (parameters.preferenceStartupDashboardID != null) {
            this.currentUser.preferenceStartupDashboardID = parameters.preferenceStartupDashboardID;
        };
        if (parameters.preferenceStartupDashboardTabID != null) {
            this.currentUser.preferenceStartupDashboardTabID = parameters.preferenceStartupDashboardTabID;
        };
        if (parameters.preferenceShowWidgetEditorLite != null) {
            this.currentUser.preferenceShowWidgetEditorLite = parameters.preferenceShowWidgetEditorLite;
        };

    }

    saveCanvasUser(data: CanvasUser): Promise<string> {
        // Description: Saves CanvasUser
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveCanvasUser ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasUsers';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };
            // this.http.put(finalUrl + '?id=' + data.id, data, {headers}).subscribe(res => {

                // Replace local
                let localIndex: number = this.canvasUsers.findIndex(u =>
                    u.id == data.id
                );
                if (localIndex >= 0) {
                    this.canvasUsers[localIndex] = data;
                };

                if (this.sessionDebugging) {
                    console.log('saveCanvasUser SAVED', res.data)
                };

                resolve('Saved');
            },
            err => {
                if (this.sessionDebugging) {
                    console.log('Error saveCanvasUser FAILED', {err});
                };

                reject(err.message);
            });
        });
    }

    deleteCanvasUser(id: number, widgetID: number = null): Promise<string> {
        // Description: Deletes a canvasUsers
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteCanvasUser ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'canvasUsers';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.canvasUsers = this.canvasUsers.filter(
                        grp => grp.id != id
                    );

                    if (this.sessionDebugging) {
                        console.log('deleteCanvasUser DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteCanvasUser FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getStatusBarMessageLogs(userID: string): Promise<StatusBarMessageLog[]> {
        // Description: Gets all StatusBarMessageLogs
        // Returns: this.statusBarMessageLogss array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getstatusBarMessageLogss ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                this.statusBarMessageLogs.length);
        };

        return new Promise<StatusBarMessageLog[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.statusBarMessageLogs.length == 0)  ||  (this.isDirtystatusBarMessageLogs) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                let pathUrl: string = 'statusBarMessageLogs';
                let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
                this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                    res  => {
                        if(res.statusCode != 'success') {
                            reject(res.message);
							return;
                        };

                        this.statusBarMessageLogs = res.data;

                        this.isDirtystatusBarMessageLogs = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables getstatusBarMessageLogss 1',
                                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                this.statusBarMessageLogs)
                        };

                        resolve(this.statusBarMessageLogs);
                    },
                    err => {
                        reject(err.message)
                    }
                );
            } else {
                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables getstatusBarMessageLogss 2',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                        this.statusBarMessageLogs.slice(0, 100))
                };

                resolve(this.statusBarMessageLogs);
            }
        });

    }

    addStatusBarMessageLog(data: StatusBarMessageLog): Promise<any> {
        // Description: Adds a new statusBarMessageLogs
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addstatusBarMessageLogs ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'statusBarMessageLogs';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Update Global vars to make sure they remain in sync
                    this.statusBarMessageLogs.push(JSON.parse(JSON.stringify(res.data)));

                    if (this.sessionDebugging) {
                        console.log('addstatusBarMessageLogs ADDED', res.data, this.statusBarMessageLogs,
                            this.statusBarMessageLogs.slice(0, 100))
                    };

                    resolve(res.data);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error addstatusBarMessageLogs FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteDashboardLayout(id: number): Promise<string> {
        // Description: Deletes a DashboardLayout
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteDashboardLayout ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'dashboardLayouts';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };
                    this.dashboardLayouts = this.dashboardLayouts.filter(wl => wl.id != id);

                    if (this.sessionDebugging) {
                        console.log('deleteDashboardLayout DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteDashboardLayout FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteWidgetLayout(id: number, dashboardLayoutID: number): Promise<string> {
        // Description: Deletes a WidgetLayout
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteWidgetLayout ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgetLayouts';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.widgetLayouts = this.widgetLayouts.filter(wl => wl.id != id);

                    // TODO - do this better in DB as we are checking local Array length
                    //        which may be diff to DB
                    // Delete the DashboardLayout if last one
                    if (this.widgetLayouts.length == 0) {
                        this.deleteDashboardLayout(dashboardLayoutID);
                    };

                    if (this.sessionDebugging) {
                        console.log('deleteWidgetLayout DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteWidgetLayout FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getWidgetStoredTemplates(): Promise<WidgetStoredTemplate[]> {
        // Description: Gets WidgetStoredTemplates.
        // Returns: this.WidgetStoredTemplates object, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getWidgetStoredTemplates ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<WidgetStoredTemplate[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

            let pathUrl: string = 'widgetStoredTemplates';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                    this.widgetStoredTemplates = res.data;

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getWidgetStoredTemplates 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            this.widgetStoredTemplates);
                    };

                    resolve(this.widgetStoredTemplates);
                },
                err => {
                    reject(err.message)
                }
            );

        });

    }

    addWidgetStoredTemplate(data: WidgetStoredTemplate): Promise<any> {
        // Description: Adds a new WidgetStoredTemplate
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addWidgetStoredTemplate ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgetStoredTemplates';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                        // Update Global vars to make sure they remain in sync
                        this.widgetStoredTemplates.push(JSON.parse(JSON.stringify(res.data)));

                        if (this.sessionDebugging) {
                            console.log('addWidgetStoredTemplate ADDED', res.data)
                        };

                        resolve(res.data);
                    },
                    err => {
                        if (this.sessionDebugging) {
                            console.log('Error addWidgetTemplate FAILED', {err});
                        };

                        reject(err.message);
                    }
                )
        });
    }

    saveWidgetStoredTemplate(data: WidgetStoredTemplate): Promise<string> {
        // Description: Saves WidgetStoredTemplate
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveWidgetStoredTemplate ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {data});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgetStoredTemplates';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    // Replace local
                    let localIndex: number = this.widgetStoredTemplates.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.widgetStoredTemplates[localIndex] = data;
                    };

                    if (this.sessionDebugging) {
                        console.log('saveWidgetStoredTemplate SAVED', res.data)
                    };

                    resolve('Saved');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error saveWidgetStoredTemplate FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    deleteWidgetStoredTemplate(id: number): Promise<string> {
        // Description: Deletes a WidgetStoredTemplate
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables deleteWidgetStoredTemplate ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = 'widgetStoredTemplates';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                res => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
						return;
                    };

                    this.widgetStoredTemplates = this.widgetStoredTemplates.filter(
                        wst => wst.id != id);

                    if (this.sessionDebugging) {
                        console.log('deleteWidgetStoredTemplate DELETED id: ', {id})
                    };

                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error deleteWidgetStoredTemplate FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    setBaseUrl(pathUrl: string): string {
       // Description: Gets the caching table that drives local caching process
       if (this.sessionDebugging) {
        console.log('%c    Global-Variables setBaseUrl ...',
            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
            this.statusBarMessageLogs.length);
        };

        // CanvasDatabase: Local or Server
        let baseUrl: string = this.canvasServerURI + '/canvasdata/';

        // Return
        return baseUrl;

    }

    getDataCachingTable(): Promise<DataCachingTable[]> {
       // Description: Gets the caching table that drives local caching process
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDataCachingTable ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                this.statusBarMessageLogs.length);
        };

        return new Promise<DataCachingTable[]>((resolve, reject) => {

            let pathUrl: string = 'dataCachingTable';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.dataCachingTable = res.data;

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getDataCachingTable',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            this.dataCachingTable)
                    };

                    resolve(this.dataCachingTable);
                },
                err => {
                    reject(err.message)
                }
            );
        });

    }

    refreshCurrentDashboard(
        refreshingRoutine: string,
        dashboardID: number,
        dashboardTabID: number = 0,
        tabToShow: string = '',
        widgetsToRefresh: number[] = []) {
        // Refresh the global var currentDashboardInfo, then .next it.
        // This will refresh the Dashboard on the screen (via .subscribe)
        // If a dashboardTabID is given, this one will be shown.  Else, it will navigate
        // to tabToShow, which can be First, Previous, Next, Last.  tabToShow overules
        // dashboardTabID if tabToShow is given.  It does not assume that all the currentD
        // Info has already been collected - to allow for the first time this is called.
        // It does assume that we have a currentDashboardInfo object if Previous/Next are
        // parameters.
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables refreshCurrentDashboard ...',
                "color: black; background: lightgray; font-size: 10px",
                {refreshingRoutine}, {dashboardID}, {dashboardTabID}, {tabToShow},
                {widgetsToRefresh});
        };

        // TODO - add Permissions, either here or automatically in DB !!!

        // Make sure the currT are indeed for the requested D
        let currentDashboardTabs: DashboardTab[];
        currentDashboardTabs = this.dashboardTabs.filter(t => t.dashboardID == dashboardID);
        currentDashboardTabs = currentDashboardTabs.sort( (obj1,obj2) => {
            if (obj1.displayOrder > obj2.displayOrder) {
                return 1;
            };
            if (obj1.displayOrder < obj2.displayOrder) {
                return -1;
            };
            return 0;
        });

        // Assume we have all currentD info
        if ( ( (tabToShow == 'Previous')  ||  (tabToShow == 'Next') )  &&
            (this.currentDashboardInfo == null) ) {
            return;
        };

        let dt = new Date();
        let x: number = 0;
        let y: number = 0;

        if (tabToShow != '') {
            if (currentDashboardTabs.length == 0) {

                if (this.sessionDebugging) {
                    console.log('this.currentDashboardTabs empty');
                };

                return;
            }
            if (tabToShow == 'First') {
                x = 0;
            }
            if (tabToShow == 'Previous') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex - 1;
                if (x < 0) {
                    x = currentDashboardTabs.length - 1;
                }
            }
            if (tabToShow == 'Next') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex + 1;
                if (x >= currentDashboardTabs.length) {
                    x = 0;
                }
            }
            if (tabToShow == 'Last') {
                x = currentDashboardTabs.length - 1;

            }
            y = currentDashboardTabs[x].id;
        } else {
            y = dashboardTabID;

            if (currentDashboardTabs.length == 0) {
                x = 0;
            } else {
                for (var i = 0; i < currentDashboardTabs.length; i++) {
                    if (currentDashboardTabs[i].id == dashboardTabID) {
                        x = i;
                    };
                };
            };
        };

        // Register in Recent
        // this.amendDashboardRecent(dashboardID, y);

        // Inform subscribers of the change
        let dashboardIndex: number = this.dashboards.findIndex(d => d.id == dashboardID)
        let state: string = 'Draft';
        if (dashboardIndex >= 0) {
            state = this.dashboards[dashboardIndex].state;
        };
        this.currentDashboardInfo.next({
            currentDashboardID: dashboardID,
            currentDashboardState: state,
            currentDashboardTabID: y,
            currentDashboardTabIndex: x,
            refreshingRoutine: refreshingRoutine,
            refreshDateTime: dt,
            widgetsToRefresh
        });

    }

    widgetReplace(changedWidget: Widget) {
        // Replaces (ByVal) the global W and currentW
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables ... widgetReplace',
                "   color: black; background: lightgray; font-size: 10px", {changedWidget});
        };

        // Replace into widgets
        let widgetIndex: number = this.widgets.findIndex(w =>
            w.id == changedWidget.id
        );
        if (widgetIndex >= 0) {
            this.widgets[widgetIndex] =
                JSON.parse(JSON.stringify(changedWidget));
        };

        // Replace into currentWidgets
        let currentWidgetIndex: number = this.currentWidgets.findIndex(w =>
            w.id == changedWidget.id
        );
        if (currentWidgetIndex >= 0) {
            this.currentWidgets[currentWidgetIndex] =
            JSON.parse(JSON.stringify(changedWidget));
        };
    }

    sleep(milliseconds: number) {
        // Sleep for a while
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables sleep ...',
                "color: black; background: lightgray; font-size: 10px", {milliseconds});
        };

        var start: number = new Date().getTime();
        console.log('  start', {start}, new Date().getTime())
        for (var counter = 0; counter < 3600001; counter++) {
            let mod:number = counter%60000;
            // TODO - remove this console.log BUT at moment sleep increments counter * 60000
            console.log({counter}, {mod});
            if (mod == 0) {
                console.log ('   Minutes elapsed ', {counter}, {mod} )
            }
            if ((new Date().getTime() - start) > milliseconds){
                console.log('  end', {start}, new Date().getTime())

                break;
            }
        }
    }

    createVegaSpec(
        widget: Widget,
        height: number = 0,
        width: number = 0,
        showSpecificGraphLayer: boolean = false,
        specificLayerToShow: number = 0): dl.spec.TopLevelExtentedSpec {

        // Creates and returns a specification for Vega visual grammar
        // The specification All the information needed to create
        if (this.sessionDebugging) {
            let widgetID: number = widget.id;
            console.log('%c    Global-Variables createVegaSpec ...',
                "color: black; background: lightgray; font-size: 10px", {widgetID});
        };

        // Sanitiy Check
        let specification: any = {};
        if (widget.visualGrammarType == null) {
            widget.visualGrammarType = 'standard';
        };
        if (widget.graphLayers == null  ||  widget.graphLayers.length == 0) {
            return;
        };

        // Custom visualGrammarType - return after each one
        if (widget.visualGrammarType.toLowerCase() == 'custom') {
            specification = widget.graphLayers[0].graphSpecification;

            // Replace the data in the spec - each custom one is different
            if (widget.graphLayers[0].graphMark == 'donutSliders') {
                let xDataValues: any = widget.graphData.map(x => {
                    let obj: any = {
                        "id": x[widget.graphLayers[0].graphXfield],
                        "field": x[widget.graphLayers[0].graphYfield]
                    };
                    return obj;
                });

                specification['data'][0]['values'] = xDataValues;

                return specification;
            };
            if (widget.graphLayers[0].graphMark == 'wordCloud') {
                let xColumnValues: any = widget.graphData.map(
                    x => x[widget.graphLayers[0].graphXfield]
                );
                specification['data'][0]['values'] = xColumnValues;

                return specification;
            };
            if (widget.graphLayers[0].graphMark == 'networkCircle') {

                return specification;
            };

        };


        // NB - the rest of the Code deals ONLY with the STANDARD visualGrammarType

        return;
    }

    createVegaLiteSpec(
        widget: Widget,
        height: number = 0,
        width: number = 0,
        showSpecificGraphLayer: boolean = false,
        specificLayerToShow: number = 0): dl.spec.TopLevelExtentedSpec {

        // Creates and returns a specification for Vega-Lite visual grammar
        if (this.sessionDebugging) {
            let widgetID: number = widget.id;
            console.log('%c    Global-Variables createVegaLiteSpec ...',
                "color: black; background: lightgray; font-size: 10px", {widgetID});
        };

        let specification: any = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "description": "A simple bar chart with embedded data.",
            "background": widget.graphBackgroundColor,
            "title": {
                "text": "",
                "anchor": "start",
                "angle": 0,
                "baseline": "top",
                "color": "red",
                "font": "",
                "fontSize": 10,
                "fontWeight": 400,
                "limit": 0
            },
            "data": {
                "values": []
            },
            "transform": [],
            "config": {
                "style": {
                  "cell": {
                    "stroke": widget.graphBorderColor
                  }
                }
            }
        };

        // Custom visualGrammarType - RETURN after each one
        if (widget.visualGrammarType == null) {
            widget.visualGrammarType = 'standard';
        };
        if (widget.visualGrammarType.toLowerCase() == 'custom') {
            specification = widget.graphLayers[0].graphSpecification;

            // Replace the data in the spec - each custom one is different
            if (widget.graphLayers[0].graphMark == 'waterfall') {
                // let xDataValues: any = widget.graphData.map(x => {
                //     let obj: any = {
                //         "id": x[widget.graphLayers[0].graphXfield],
                //         "field": x[widget.graphLayers[0].graphYfield]
                //     };
                //     return obj;
                // });

                // specification['data'][0]['values'] = xDataValues;

                return specification;
            };
            if (widget.graphLayers[0].graphMark == 'marginalHistogram') {

                return specification;
            };
            if (widget.graphLayers[0].graphMark == 'geoshape') {

                return specification;
            };
        };


        // NB - the rest of the Code deals ONLY with the STANDARD visualGrammarType



        // Optional Sampling
        if (widget.sampleNumberRows != 0) {
            specification['transform']['sample'] = widget.sampleNumberRows;
        };

        // General
        specification['description'] = widget.graphDescription;
        specification['width'] = width;
        specification['height'] = height;


        // Title
        specification['title']['text'] = widget.graphTitleText;
        if (widget.graphTitleAnchor != null) {
            specification['title']['anchor'] = widget.graphTitleAnchor.toLowerCase();
        };
        specification['title']['angle'] = widget.graphTitleAngle;
        if (widget.graphTitleBaseline != null) {
            specification['title']['baseline'] = widget.graphTitleBaseline.toLowerCase();
        };
        specification['title']['color'] = widget.graphTitleColor;
        specification['title']['font'] = widget.graphTitleFont;
        specification['title']['fontSize'] = widget.graphTitleFontSize;
        specification['title']['fontWeight'] = widget.graphTitleFontWeight;
        specification['title']['limit'] = widget.graphTitleLength;
        if (widget.graphTitleOrientation != null) {
            specification['title']['orient'] = widget.graphTitleOrientation.toLowerCase();
        };


        // Data
        if (widget.graphUrl != ""  &&  widget.graphUrl != null) {
            specification['data'] = {"url": widget.graphUrl};
        } else {
            specification['data'] = {"values": widget.graphData};
        };

        // Selection
        if (widget.graphPanAndZoom) {
            specification['selection'] =
                {
                    "grid": {
                    "type": "interval", "bind": "scales"
                    }
                };
        };

        // Calculated Fields
        if (widget.graphCalculations == null) {
            widget.graphCalculations = [];
        };
        for (var i = 0; i < widget.graphCalculations.length; i++) {

            // Split function
            let calcFunction: string = '';
            let calcFields: string[] = [];
            let sortFields: string[] = [];
            let frameFields: string[] = [];

            // Take out spaces typed by user
            widget.graphCalculations[i].calculatedExpression =
                widget.graphCalculations[i].calculatedExpression.replace(/ /gi,"");

            // Get brackets and extract Formula and Fields
            let bracketLeftIndex: number = widget.graphCalculations[i].calculatedExpression.indexOf('(');
            let bracketRightIndex: number = widget.graphCalculations[i].calculatedExpression.indexOf(')');

            if ( (bracketLeftIndex > 0)  ||  ( (bracketRightIndex - bracketLeftIndex) > 1) ) {
                calcFunction = widget.graphCalculations[i].calculatedExpression
                    .substring(0, bracketLeftIndex);
                calcFields = widget.graphCalculations[i].calculatedExpression
                    .substring(bracketLeftIndex + 1, bracketRightIndex)
                    .split(",");
            };

            // Cumulation Function
            if (calcFunction.toLowerCase() == 'sum'  &&  calcFields.length > 0) {
                specification['transform'].push(
                    {
                        "window": [{
                            "op": "sum",
                            "field": calcFields[0],
                            "as": widget.graphCalculations[i].calculatedAs
                        }],
                        "frame": [null, null]
                    }
                );

            } else if (calcFunction.toLowerCase() == 'cumulate'  &&  calcFields.length > 0) {
                specification['transform'].push(
                    {
                        "sort": [{"field": calcFields[0]}],
                        "window": [
                            {
                                "op": "count",
                                "field": "count",
                                "as": widget.graphCalculations[i].calculatedAs
                            }
                        ],
                        "frame": [null, 0]
                    }
                );

            } else if (calcFunction.toLowerCase() == 'rank'  &&  calcFields.length > 1) {
                specification['transform'].push(
                    {
                        "sort": [
                            {"field": calcFields[0], "order": "descending"},
                            {"field": calcFields[1], "order": "descending"}
                        ],
                        "window": [{
                        "op": "rank",
                        "as": widget.graphCalculations[i].calculatedAs
                        }],
                        "groupby": [calcFields[1]]
                    }
                );
            } else {

                // Add Calculation Formula the transformation channel
                specification['transform'].push(
                    {
                            "calculate": widget.graphCalculations[i].calculatedExpression,
                            "as": widget.graphCalculations[i].calculatedAs
                    }
                );

            };
        };


        // Filter
        if (widget.graphFilters == null) {
            widget.graphFilters = [];
        };
        let graphFilters = widget.graphFilters.filter(gflt => gflt.isActive).slice();

        for (var i = 0; i < graphFilters.length; i++) {

            let filterSpec: any = null;
            let filterFieldDataType: string = 'string';
            let filterFieldDataTypeIndex: number = widget.dataschema.findIndex(
                dat => dat.name == graphFilters[i].filterFieldName
            );

            if (filterFieldDataTypeIndex >= 0) {
                filterFieldDataType = widget.dataschema[filterFieldDataTypeIndex].type;
            };


            if (graphFilters[i].filterOperator == 'Not Equal') {
                if (filterFieldDataType == 'string'
                    ||
                    graphFilters[i].filterTimeUnit.toLowerCase() == 'month') {
                    filterSpec =
                        {"filter":

                                "datum." + graphFilters[i].filterFieldName + " != '"
                                + graphFilters[i].filterValue + "'"

                        };
                } else {
                    filterSpec =
                        {"filter":

                                "datum." + graphFilters[i].filterFieldName + " != "
                                + +graphFilters[i].filterValue

                        };
                };
            };

            if (graphFilters[i].filterOperator == 'Equal') {
                if (filterFieldDataType == 'string'
                    ||
                    graphFilters[i].filterTimeUnit.toLowerCase() == 'month') {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "equal": graphFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "equal": +graphFilters[i].filterValue
                            }
                        };
                };
            };

            if (graphFilters[i].filterOperator == 'Less Than') {

                if (filterFieldDataType == 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "lt": graphFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "lt": +graphFilters[i].filterValue
                            }
                        };
                };

            };

            if (graphFilters[i].filterOperator == 'Less Than Equal') {

                if (filterFieldDataType == 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "lte": graphFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "lte": +graphFilters[i].filterValue
                            }
                        };
                };
            };

            if (graphFilters[i].filterOperator == 'Greater Than') {

                if (filterFieldDataType == 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "gt": graphFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "gt": +graphFilters[i].filterValue
                            }
                        };
                };
            };

            if (graphFilters[i].filterOperator == 'Greater Than Equal') {

                if (filterFieldDataType == 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "gte": graphFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "gte": +graphFilters[i].filterValue
                            }
                        };
                };
            };

            if (graphFilters[i].filterOperator == 'Range') {

                if (filterFieldDataType == 'number') {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "range": [
                                    +graphFilters[i].filterValueFrom,
                                    +graphFilters[i].filterValueTo
                                ]
                            }
                        };

                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "range": [
                                    graphFilters[i].filterValueFrom,
                                    graphFilters[i].filterValueTo
                                ]
                            }
                        };
                };
            };

            if (graphFilters[i].filterOperator == 'One Of') {

                let fromTo: string[] = graphFilters[i].filterValue.split(',');
                if (fromTo.length > 0) {
                    if (filterFieldDataType == 'number') {
                        let fromToNumber: number[] = fromTo.map(x => +x);
                        filterSpec =
                            {"filter":
                                {
                                    "field": graphFilters[i].filterFieldName,
                                    "oneOf": fromToNumber
                                }
                            };

                    } else {
                        filterSpec =
                            {"filter":
                                {
                                    "field": graphFilters[i].filterFieldName,
                                    "oneOf": fromTo
                                }
                            };
                    };
                };
            };

            if (graphFilters[i].filterOperator == 'Valid') {

                if (filterFieldDataType == 'number') {
                    filterSpec =
                        {"filter":
                            {
                                "field": graphFilters[i].filterFieldName,
                                "valid": true
                            }
                        };
                };
            };

            if (graphFilters[i].filterOperator == 'Selection') {

                filterSpec = [
                    {"filter":
                        {
                            "field": graphFilters[i].filterValue,
                            "selection": graphFilters[i].filterValue
                        }
                    }
                ];
            };

            // Add to Vega Spec
            if (filterSpec != null) {
                if (graphFilters[i].filterTimeUnit != '') {
                    filterSpec['filter']['timeUnit'] = graphFilters[i].filterTimeUnit.toLowerCase();
                };

                specification['transform'].push(filterSpec);
                // widget.graphTransformations.push(graphTransformationSpec);
            };

            console.warn('xx END FILTER widget.graphFilters', widget.graphFilters);

        }

        let currentGraphLayer: number = 0;
        let specificationInnerArray: any[] = [];

        for (currentGraphLayer = 0; currentGraphLayer < widget.graphLayers.length; currentGraphLayer++) {

            // Define new innec Spec
            let specificationInner: any = {
                "mark": {
                    "type": "bar",
                    "tooltip": {
                        "content": "data"
                }
                },
                "encoding": {
                    "x": {
                        "field": "",
                        "type": "",
                        "axis": "",
                        "scale": ""
                    },
                    "y": {
                        "field": "",
                        "type": "",
                        "axis": "",
                        "scale": ""
                    },
                    "color": {
                        "field": "",
                        "type": "",
                        "scale": "",
                        "legend": ""
                    },
                    "size": {
                        "field": ""
                    }
                }
            };

            // Mark
            specificationInner['mark']['type'] = widget.graphLayers[currentGraphLayer].graphMark;
            specificationInner['mark']['orient'] = widget.graphLayers[currentGraphLayer].graphMarkOrient.toLowerCase();
            specificationInner['mark']['line'] = widget.graphLayers[currentGraphLayer].graphMarkLine;
            if (widget.graphLayers[currentGraphLayer].graphMarkPoint) {
                specificationInner['mark']['point'] = { "color": widget.graphLayers[currentGraphLayer].graphMarkPointColor};
            };
            specificationInner['mark']['color'] = widget.graphLayers[currentGraphLayer].graphMarkColour;
            specificationInner['mark']['cornerRadius'] = widget.graphLayers[currentGraphLayer].graphMarkCornerRadius;
            specificationInner['mark']['opacity'] = widget.graphLayers[currentGraphLayer].graphMarkOpacity;
            specificationInner['mark']['binSpacing'] = widget.graphLayers[currentGraphLayer].graphMarkBinSpacing;
            if (widget.graphLayers[currentGraphLayer].graphMarkInterpolate == "Step") {
                specificationInner['mark']['interpolate'] = "step-after";
            };

            let vegaGraphMarkExtent: string = 'stderr';
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent == 'Confidence Interval') {
                vegaGraphMarkExtent = 'ci';
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent == 'Std Error') {
                vegaGraphMarkExtent = 'stderr';
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent == 'Std Deviation') {
                vegaGraphMarkExtent = 'stdev';
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent == 'Q1 and Q3') {
                vegaGraphMarkExtent = 'iqr';
            };

            specificationInner['mark']['extent'] = "";
            if (widget.graphLayers[currentGraphLayer].graphMark == 'errorband') {
                specificationInner['mark']['extent'] = vegaGraphMarkExtent;
            };
            if (widget.graphLayers[currentGraphLayer].graphMark == 'errorbar') {
                specificationInner['mark']['extent'] = vegaGraphMarkExtent;
                specificationInner['mark']['ticks'] = true;
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkSize != null
                &&
                widget.graphLayers[currentGraphLayer].graphMarkSize != 0) {
                specificationInner['mark']['size'] =
                    widget.graphLayers[currentGraphLayer].graphMarkSize;
            };


            // Text Channel
            if (widget.graphLayers[currentGraphLayer].graphMark == 'text') {
                if (widget.graphLayers[currentGraphLayer].graphXfield != '') {
                    specificationInner['encoding']['text'] = {
                        "field": widget.graphLayers[currentGraphLayer].graphXfield,
                        "type": widget.graphLayers[currentGraphLayer].graphXtype.toLowerCase(),
                        "aggregate": widget.graphLayers[currentGraphLayer].graphXaggregate,
                        "align": "left",
                        "baseline": "middle",
                        "dx": 3,
                        "format": widget.graphLayers[currentGraphLayer].graphXformat
                    };
                };
            };


            // X field
            if (widget.graphLayers[currentGraphLayer].graphXfield != '') {
                specificationInner['encoding']['x']['field'] = widget.graphLayers[currentGraphLayer].graphXfield;
                specificationInner['encoding']['x']['aggregate'] = widget.graphLayers[currentGraphLayer].graphXaggregate;
                if (widget.graphLayers[currentGraphLayer].graphXMaxBins > 0) {
                    specificationInner['encoding']['x']['bin'] =
                        {"maxbins": widget.graphLayers[currentGraphLayer].graphXMaxBins};
                } else {
                    specificationInner['encoding']['x']['bin'] = widget.graphLayers[currentGraphLayer].graphXbin;
                };
                specificationInner['encoding']['x']['format'] = widget.graphLayers[currentGraphLayer].graphXformat.toLowerCase();
                if (widget.graphLayers[currentGraphLayer].graphXimpute != '') {
                    if (widget.graphLayers[currentGraphLayer].graphXimpute == 'Value') {
                        specificationInner['encoding']['x']['impute'] =
                            {"value": widget.graphLayers[currentGraphLayer].graphXimputeValue };
                    } else {
                        specificationInner['encoding']['x']['impute'] =
                            {"method": widget.graphLayers[currentGraphLayer].graphXimpute};
                    };
                };
                specificationInner['encoding']['x']['stack'] = widget.graphLayers[currentGraphLayer].graphXstack;
                specificationInner['encoding']['x']['sort'] = widget.graphLayers[currentGraphLayer].graphXsort.toLowerCase();
                specificationInner['encoding']['x']['type'] = widget.graphLayers[currentGraphLayer].graphXtype.toLowerCase();
                specificationInner['encoding']['x']['timeUnit'] = widget.graphLayers[currentGraphLayer].graphXtimeUnit.toLowerCase();

                if (widget.graphLayers[currentGraphLayer].graphXaxisScaleType != 'Default'  &&  widget.graphLayers[currentGraphLayer].graphXaxisScaleType != undefined) {
                    specificationInner['encoding']['x']['scale'] =
                    {"type": widget.graphLayers[currentGraphLayer].graphXaxisScaleType.toLowerCase() };
                };

                specificationInner['encoding']['x']['axis'] = {"grid": widget.graphLayers[currentGraphLayer].graphXaxisGrid };
                if (widget.graphLayers[currentGraphLayer].graphXaxisGrid) {
                    specificationInner['encoding']['x']['axis'] = {"gridColor": widget.graphLayers[currentGraphLayer].graphXaxisGridColor };
                };

                specificationInner['encoding']['x']['axis']['labels'] = widget.graphLayers[currentGraphLayer].graphXaxisLabels;
                if (widget.graphLayers[currentGraphLayer].graphXaxisLabelAngle != 0){
                    specificationInner['encoding']['x']['axis']['labelAngle'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelAngle;
                };
                if (widget.graphLayers[currentGraphLayer].graphXaxisLabels) {
                    specificationInner['encoding']['x']['axis']['labelColor'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelColor;
                    specificationInner['encoding']['x']['axis']['tickColor'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelColor;
                    specificationInner['encoding']['x']['axis']['titleColor'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelColor;
                    if (widget.graphLayers[currentGraphLayer].graphXaxisLabelsLength != null
                        && widget.graphLayers[currentGraphLayer].graphXaxisLabelsLength > 0) {
                            specificationInner['encoding']['x']['axis']['labelLimit'] =
                                widget.graphLayers[currentGraphLayer].graphXaxisLabelsLength;
                    };
                };

                if (!widget.graphLayers[currentGraphLayer].graphXaxisTitleCheckbox) {
                    specificationInner['encoding']['x']['axis']['title'] = null;
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphXaxisTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphXaxisTitle != undefined) {
                        specificationInner['encoding']['x']['axis']['title'] = widget.graphLayers[currentGraphLayer].graphXaxisTitle;
                    };
                };

                if (widget.graphLayers[currentGraphLayer].graphXaxisFormat != '') {
                    specificationInner['encoding']['x']['axis']['format'] =  widget.graphLayers[currentGraphLayer].graphXaxisFormat;
                };

                specificationInner['encoding']['x']['axis']['maxExtent'] = widget.graphDimensionBottom;
                // specificationInner['encoding']['x']['axis']['labelLimit'] = widget.graphDimensionBottom;


                if (widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart != null
                    &&
                    widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd != null) {

                    if(specificationInner['encoding']['x']['scale'] == "") {
                        specificationInner['encoding']['x']['scale'] = {
                            "domain":
                            [
                                Number(widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart),
                                Number(widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd)
                            ]
                        };
                    } else {
                        specificationInner['encoding']['x']['scale']['domain'] =
                            [
                                widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart,
                                widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd
                            ];
                        specificationInner['mark']['clip'] = true;
                    };
                };            };


            // Y field
            if (widget.graphLayers[currentGraphLayer].graphYfield != '') {
                specificationInner['encoding']['y']['field'] = widget.graphLayers[currentGraphLayer].graphYfield;
                specificationInner['encoding']['y']['aggregate'] = widget.graphLayers[currentGraphLayer].graphYaggregate;
                if (widget.graphLayers[currentGraphLayer].graphYMaxBins > 0) {
                    specificationInner['encoding']['y']['bin'] =
                        {"maxbins": widget.graphLayers[currentGraphLayer].graphYMaxBins};
                } else {
                    specificationInner['encoding']['y']['bin'] = widget.graphLayers[currentGraphLayer].graphYbin;
                };
                specificationInner['encoding']['y']['format'] = widget.graphLayers[currentGraphLayer].graphYformat.toLowerCase();
                if (widget.graphLayers[currentGraphLayer].graphYimpute != '') {
                    if (widget.graphLayers[currentGraphLayer].graphYimpute == 'Value') {
                        specificationInner['encoding']['y']['impute'] =
                            {"value": +widget.graphLayers[currentGraphLayer].graphYimputeValue };
                    } else {
                        specificationInner['encoding']['y']['impute'] =
                            {"method": widget.graphLayers[currentGraphLayer].graphYimpute.toLowerCase() };
                    };
                };
                specificationInner['encoding']['y']['stack'] = widget.graphLayers[currentGraphLayer].graphYstack.toLowerCase();
                specificationInner['encoding']['y']['sort'] = widget.graphLayers[currentGraphLayer].graphYsort.toLowerCase();
                specificationInner['encoding']['y']['type'] = widget.graphLayers[currentGraphLayer].graphYtype.toLowerCase();
                specificationInner['encoding']['y']['timeUnit'] = widget.graphLayers[currentGraphLayer].graphYtimeUnit.toLowerCase();

                if (widget.graphLayers[currentGraphLayer].graphYaxisScaleType != 'Default'  &&  widget.graphLayers[currentGraphLayer].graphYaxisScaleType != undefined) {
                    specificationInner['encoding']['y']['scale'] =
                    {"type": widget.graphLayers[currentGraphLayer].graphYaxisScaleType.toLowerCase() };
                };

                specificationInner['encoding']['y']['axis'] = {"grid": widget.graphLayers[currentGraphLayer].graphYaxisGrid };
                if (widget.graphLayers[currentGraphLayer].graphYaxisGrid) {
                    specificationInner['encoding']['y']['axis'] = {"gridColor": widget.graphLayers[currentGraphLayer].graphYaxisGridColor };
                };

                specificationInner['encoding']['y']['axis']['labels'] = widget.graphLayers[currentGraphLayer].graphYaxisLabels;
                if (widget.graphLayers[currentGraphLayer].graphYaxisLabelAngle != 0){
                    specificationInner['encoding']['y']['axis']['labelAngle'] =
                        widget.graphLayers[currentGraphLayer].graphYaxisLabelAngle;
                };
                if (widget.graphLayers[currentGraphLayer].graphYaxisLabels) {
                    specificationInner['encoding']['y']['axis']['labelColor'] = widget.graphLayers[currentGraphLayer].graphYaxisLabelColor;
                    specificationInner['encoding']['y']['axis']['tickColor'] = widget.graphLayers[currentGraphLayer].graphYaxisLabelColor;
                    specificationInner['encoding']['y']['axis']['titleColor'] = widget.graphLayers[currentGraphLayer].graphYaxisLabelColor;
                };
                if (widget.graphLayers[currentGraphLayer].graphYaxisLabelsLength != null
                    && widget.graphLayers[currentGraphLayer].graphYaxisLabelsLength > 0) {
                        specificationInner['encoding']['y']['axis']['labelLimit'] =
                            widget.graphLayers[currentGraphLayer].graphYaxisLabelsLength;
                };

                if (!widget.graphLayers[currentGraphLayer].graphYaxisTitleCheckbox) {
                    specificationInner['encoding']['y']['axis']['title'] = null;
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphYaxisTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphYaxisTitle != undefined) {
                        specificationInner['encoding']['y']['axis']['title'] =
                            widget.graphLayers[currentGraphLayer].graphYaxisTitle;
                    };
                };

                if (widget.graphLayers[currentGraphLayer].graphYaxisFormat != '') {
                    specificationInner['encoding']['y']['axis']['format'] =  widget.graphLayers[currentGraphLayer].graphYaxisFormat;
                };
                specificationInner['encoding']['y']['axis']['maxExtent'] = widget.graphDimensionLeft;
                // specificationInner['encoding']['y']['axis']['labelLimit'] = widget.graphDimensionLeft;

                if (widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart != null
                    &&
                    widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd != null) {

                    if(specificationInner['encoding']['y']['scale'] == "") {
                        specificationInner['encoding']['y']['scale'] = {
                            "domain":
                            [
                                Number(widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart),
                                Number(widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd)
                            ]
                        };
                    } else {
                        specificationInner['encoding']['y']['scale']['domain'] =
                            [
                                widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart,
                                widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd
                            ];
                        specificationInner['mark']['clip'] = true;
                    };
                };
            };


            // Conditional pre-work
            this.conditionFieldDataType = 'string';
            this.conditionOperator = '==';
            if (widget.graphLayers[currentGraphLayer].conditionFieldName != ''
            && widget.graphLayers[currentGraphLayer].conditionFieldName != null) {

                let conditionFieldDataTypeIndex: number = widget.dataschema.findIndex(
                    dat => dat.name == widget.graphLayers[currentGraphLayer].conditionFieldName
                );
                if (conditionFieldDataTypeIndex >= 0) {
                    this.conditionFieldDataType = widget.dataschema[conditionFieldDataTypeIndex].type;
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator == 'Less Than') {
                    this.conditionOperator = '<';
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator == 'Less Than Equal') {
                    this.conditionOperator = '<=';
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator == 'Greater Than') {
                    this.conditionOperator = '>';
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator == 'Greater Than Equal') {
                    this.conditionOperator = '>=';
                };
            };

            // Color field
            if (widget.graphLayers[currentGraphLayer].graphColorField != '') {
                let colorBinMax: any = false;
                if (widget.graphLayers[currentGraphLayer].graphColorMaxBins > 0) {
                    colorBinMax = {"maxbins": widget.graphLayers[currentGraphLayer].graphColorMaxBins};
                } else {
                    colorBinMax = widget.graphLayers[currentGraphLayer].graphColorBin;
                };

                specificationInner['encoding']['color'] = {
                    "aggregate": widget.graphLayers[currentGraphLayer].graphColorAggregate,
                    "bin": colorBinMax,
                    "field": widget.graphLayers[currentGraphLayer].graphColorField,
                    "format": widget.graphLayers[currentGraphLayer].graphColorFormat.toLowerCase(),
                    "legend": "",
                    "sort": widget.graphLayers[currentGraphLayer].graphColorSort.toLowerCase(),
                    "stack": widget.graphLayers[currentGraphLayer].graphColorStack.toLowerCase(),
                    "timeUnit": widget.graphLayers[currentGraphLayer].graphColorTimeUnit.toLowerCase(),
                    "type": widget.graphLayers[currentGraphLayer].graphColorType.toLowerCase(),
                    "scale": widget.graphLayers[currentGraphLayer].graphColorScheme ==
                        'None'?  null  :  {"scheme": widget.graphLayers[currentGraphLayer].graphColorScheme.toLowerCase()}
                };

                if (widget.graphLayers[currentGraphLayer].conditionFieldName != ''
                    && widget.graphLayers[currentGraphLayer].conditionFieldName != null) {

                        if (this.conditionFieldDataType.toLowerCase() == 'string') {
                            specificationInner['encoding']['color']['condition'] =
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " '" + widget.graphLayers[currentGraphLayer].conditionValue
                                + "'",
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            };
                        } else {
                            specificationInner['encoding']['color']['condition'] =
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " " + widget.graphLayers[currentGraphLayer].conditionValue,
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            };

                        };
                };

                // Legend
                if (widget.graphLayers[currentGraphLayer].graphLegendHide) {
                    specificationInner['encoding']['color']['legend'] = null;
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphLegendTitle == null) {
                        widget.graphLayers[currentGraphLayer].graphLegendTitle = '';
                    };
                    specificationInner['encoding']['color']['legend'] =
                        {
                            "labelColor" : widget.graphLayers[currentGraphLayer].graphLegendLabels?
                                           widget.graphLayers[currentGraphLayer].graphLegendLabelColor
                                           : 'transparent',
                            "tickColor" : widget.graphLayers[currentGraphLayer].graphLegendLabels?
                                          widget.graphLayers[currentGraphLayer].graphLegendLabelColor
                                          : 'transparent',
                            "titleColor" : widget.graphLayers[currentGraphLayer].graphLegendLabelColor,
                            "labelLimit": widget.graphDimensionRight,
                            "title": widget.graphLayers[currentGraphLayer].graphLegendTitleCheckbox?
                                        widget.graphLayers[currentGraphLayer].graphLegendTitle
                                        :  null
                        };
                };


                if (widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType != 'Default'
                    &&
                    widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType != undefined
                    &&
                    widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType != '') {
                    specificationInner['encoding']['color']['scale'] =
                    {"type": widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType.toLowerCase() };
                };


                // if (widget. != '') {
                //     if (widget. == 'Value') {
                //         specificationInner['encoding']['color']['impute'] =
                //             {"value":' + widget.Value + '};
                //     } else {
                //         specificationInner['encoding']['color']['impute'] =
                //             {"method": "' + widget. + '"};
                //     };
                // };

            } else {

                if (widget.graphLayers[currentGraphLayer].conditionFieldName != ''
                    && widget.graphLayers[currentGraphLayer].conditionFieldName != null) {

                        if (this.conditionFieldDataType.toLowerCase() == 'string') {
                            specificationInner['encoding']['color'] =
                            { "condition":
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " '" + widget.graphLayers[currentGraphLayer].conditionValue
                                + "'",
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            }
                            };
                        } else {
                            specificationInner['encoding']['color']['condition'] =
                            specificationInner['encoding']['color'] =
                            { "condition":
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " " + widget.graphLayers[currentGraphLayer].conditionValue,
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            }
                            };

                        };
                };

            };


            // Size field
            if (widget.graphLayers[currentGraphLayer].graphSizeField != '') {

                specificationInner['encoding']['size']['field'] = widget.graphLayers[currentGraphLayer].graphSizeField;
                specificationInner['encoding']['size']['type'] = widget.graphLayers[currentGraphLayer].graphSizeType.toLowerCase();
                specificationInner['encoding']['size']['aggregate'] = widget.graphLayers[currentGraphLayer].graphSizeAggregate.toLowerCase();
                if (widget.graphLayers[currentGraphLayer].graphSizeMaxBins > 0) {
                    specificationInner['encoding']['size']['bin'] =
                        {"maxbins": widget.graphLayers[currentGraphLayer].graphSizeMaxBins};
                } else {
                    specificationInner['encoding']['size']['bin'] = widget.graphLayers[currentGraphLayer].graphSizeBin;
                };


            } else {
                specificationInner['encoding']['size'] = {
                    "field": ""
                };
            };


            // Row field
            if (widget.graphLayers[currentGraphLayer].graphRowField != '') {

                specificationInner['encoding']['row'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphRowField,
                    "type": widget.graphLayers[currentGraphLayer].graphRowType.toLowerCase()
                };

                if (!widget.graphLayers[currentGraphLayer].graphRowTitleCheckbox) {
                    specificationInner['encoding']['row']['header'] = {"title": null};
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphRowTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphRowTitle != undefined) {
                        specificationInner['encoding']['row']['header'] = {"title": widget.graphLayers[currentGraphLayer].graphRowTitle};
                    };
                };

            };


            // Column field
            if (widget.graphLayers[currentGraphLayer].graphColumnField != '') {

                specificationInner['encoding']['column'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphColumnField,
                    "type": widget.graphLayers[currentGraphLayer].graphColumnType.toLowerCase()
                };

                if (!widget.graphLayers[currentGraphLayer].graphColumnTitleCheckbox) {
                    specificationInner['encoding']['column']['header'] = {"title": null};
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphColumnTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphColumnTitle != undefined) {
                        specificationInner['encoding']['column']['header'] = {"title": widget.graphLayers[currentGraphLayer].graphColumnTitle};
                    };
                };

            };


            // Detail field
            if (widget.graphLayers[currentGraphLayer].graphDetailField != '') {

                specificationInner['encoding']['detail'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphDetailField,
                    "type": widget.graphLayers[currentGraphLayer].graphDetailType
                };

            };


            // X2 field
            if (widget.graphLayers[currentGraphLayer].graphX2Field != '') {

                specificationInner['encoding']['x2'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphX2Field,
                    "type": widget.graphLayers[currentGraphLayer].graphX2Type
                };

            };


            // Y2 field
            if (widget.graphLayers[currentGraphLayer].graphY2Field != '') {

                specificationInner['encoding']['y2'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphY2Field,
                    "type": widget.graphLayers[currentGraphLayer].graphY2Type
                };

            };


            // Projection
            if (widget.graphLayers[currentGraphLayer].graphProjectionType != ''  &&  widget.graphLayers[currentGraphLayer].graphProjectionType != null) {
                let projection: string = 'albersUsa';
                if (widget.graphLayers[currentGraphLayer].graphProjectionType != ''  &&  widget.graphLayers[currentGraphLayer].graphProjectionType != null) {
                    projection = widget.graphLayers[currentGraphLayer].graphProjectionType;
                };
                specificationInner['projection'] = {
                    "type":  widget.graphLayers[currentGraphLayer].graphProjectionType
                };
                specificationInner['encoding']['latitude'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphProjectionFieldLatitude,
                    "type": "quantitative"
                };
                specificationInner['encoding']['longitude'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphProjectionFieldLongitude,
                    "type": "quantitative"
                };
            };

            // Add to Inner Array
            specificationInnerArray.push(specificationInner);
        };

        // Put spec together from pieces, with or without layers
        if (specificationInnerArray.length == 1  ||  showSpecificGraphLayer) {
            specification = {...specification, ...specificationInnerArray[specificLayerToShow]}
        } else {
            specification = {...specification, [widget.graphLayerFacet.toLowerCase()]: specificationInnerArray}
        };

        // Tooltip setting
        // specification['mark']['tooltip']['content'] = "";

        // Return
        return specification;

    }

    actionUpsert(
        id: number,
        dashboardID: number,
        dashboardTabID: number,
        widgetID: number,
        objectType: string,
        actionType: string,
        action: string,
        description: string,
        undoID: number,
        redoID: number,
        oldWidget: any,
        newWidget: any,
        logToDB: boolean = true
     ): number {
        let actID: number = 1;
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables actionUpsert ...',
                "color: black; background: lightgray; font-size: 10px", {logToDB},
                {oldWidget}, {newWidget});
        };

        // Make snapshot when start changing
        if (this.firstAction) {
            let dashboardIndex: number = this.dashboards.findIndex(
                d => d.id ==
                this.currentDashboardInfo.value.currentDashboardID
            );
            let today = new Date();
            let snapshotName: string = this.dashboards[
                dashboardIndex]
                .name + ' ' + this.formatDate(today);
            let snapshotComment: string = 'Added automated Snapshot before first Action';

            // Determine if last snapshot for this D was an auto first
            this.findlastDashboardSnapshot(
                this.currentDashboardInfo.value.currentDashboardID
            ).then(lss => {
                // Add if last snap was not an auto (null returned if no last snapshot)
                if (lss != null) {
                    if (lss.comment != snapshotComment) {
                        this.newDashboardSnapshot(snapshotName, snapshotComment,'BeforeFirstEdit')
                            .then(res => {
                                this.showStatusBarMessage(
                                    {
                                        message: 'Added automated Snapshot before first Action',
                                        uiArea: 'StatusBar',
                                        classfication: 'Info',
                                        timeout: 3000,
                                        defaultMessage: ''
                                    }
                                );

                            });
                    };
                };
            });

            this.firstAction = false;
        };

        if (id == null) {
            // Add / Update an action to the ActionLog.  It returns id of new/updated record
            // It returns -1 if it failed.
            // NB: id = null => Add, else Update
            // The update replaces any give non-null values

            // TODO - decide if lates / -1 is best choice here
            let act: number[] = [];
            for (var i = 0; i < this.actions.length; i++) {
                act.push(this.actions[i].id)
            };
            if (act.length > 0) {
                actID = Math.max(...act) + 1;
            };

            let today = new Date();
            this.actions.push({
                id: actID,
                dashboardID: dashboardID,
                dashboardTabID: dashboardTabID,
                widgetID: oldWidget == null? null : oldWidget.id,
                objectType: objectType,
                actionType: actionType,
                action: action,
                description: description,
                undoID: undoID,
                redoID: redoID,
                oldWidget: oldWidget == null? null : JSON.parse(JSON.stringify(oldWidget)),
                newWidget: newWidget == null? null : JSON.parse(JSON.stringify(newWidget)),
                createor: this.currentUser.userID,
                created: today
            });

            console.warn('Upsert action done for:', this.actions);

        } else {
            this.actions.forEach(ac => {
                if (ac.id == id) {
                    if (action != null) {ac.action = action};
                    if (description != null) {ac.description = description};
                    if (undoID != null) {ac.undoID = undoID};
                    if (redoID != null) {ac.redoID = redoID};
                    if (oldWidget != null) {
                        // ac.oldWidget =  Object.assign({}, oldWidget)
                        ac.oldWidget =  JSON.parse(JSON.stringify(oldWidget))
                    };
                    if (newWidget != null) {
                        // ac.newWidget = Object.assign({}, newWidget)
                        ac.newWidget = JSON.parse(JSON.stringify(newWidget))
                    };
                    actID = id;
                };
            });

        };

        // Log to DB
        if (logToDB) {

            // Get Old and New
            let actOldWidget: Object = null;
            let actNewWidget: Object = null;
            let ac: CanvasAction = this.actions.filter(ac => ac.id == actID)[0];
            if (ac != null  &&  ac != undefined) {
                actOldWidget = ac.oldWidget;
                actNewWidget = ac.newWidget;
            };

            // Brief description of diff
            var result: any[] = [];
            if (actOldWidget == null) {
                result.push('Whole new Widget added')
            };
            if (actNewWidget == null) {
                result.push('Widget deleted')
            };
            if (actOldWidget != null  &&  actNewWidget != null) {

                for(var key in actNewWidget) {
                    if (key != 'data'  &&  key != 'graphData') {

                        if(actOldWidget[key] != actNewWidget[key]) {

                            // Add to DB
                            let today = new Date();
                            let newAuditTrail: CanvasAuditTrail ={
                                id: null,
                                dashboardID: this.currentDashboardInfo.value.currentDashboardID,
                                dashboardTabID: this.currentDashboardInfo.value.currentDashboardTabID,
                                widgetID: widgetID,
                                objectType: objectType,
                                actionType: actionType,
                                action: action,
                                description: description,
                                keyChanged: key,
                                oldValue: actOldWidget[key],
                                newValue: actNewWidget[key],
                                userID: this.currentUser.userID,
                                changedOn: today
                            }
                            this.addResource('canvasAuditTrails', newAuditTrail);

                            // Show to Dev
                            result.push(key + ' changed from ' + actOldWidget[key]
                                + ' to ' + actNewWidget[key]);
                        };
                    };
                };
            };

        };

        // Return
        return actID;

    }

    alignToGripPoint(inputValue: number) {
        // This routine recalcs a value to a gridpoint IF snapping is enabled
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables alignToGripPoint ...',
                "color: black; background: lightgray; font-size: 10px", {inputValue});
        };

        if (this.canvasSettings.snapToGrid) {
            if ( (inputValue % this.canvasSettings.gridSize) >= (this.canvasSettings.gridSize / 2)) {
                inputValue = inputValue + this.canvasSettings.gridSize - (inputValue % this.canvasSettings.gridSize);
            } else {
                inputValue = inputValue - (inputValue % this.canvasSettings.gridSize);
            }
        };

        // Return the value
        return inputValue;
    }

    showStatusBarMessage(statusBarMessage: StatusBarMessage
        ): void {
        // Shows a message in the right area, ie StatusBar
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables showStatusBarMessage ...',
                "color: black; background: lightgray; font-size: 10px", {statusBarMessage});
        };

        // Add to DB (if a Dashboard on display)
        if(this.currentDashboardInfo.value != null) {
            let newStatusBarMessageLog: StatusBarMessageLog = {
                id: null,
                logDateTime: new Date(),
                userID: this.currentUser.userID,
                dashboardID: this.currentDashboardInfo.value.currentDashboardID,
                dashboardName: null,
                message:statusBarMessage.message,
                uiArea: statusBarMessage.uiArea,
                classfication: statusBarMessage.classfication,
                timeout: statusBarMessage.timeout,
                defaultMessage: statusBarMessage.defaultMessage
            };

            this.addStatusBarMessageLog(newStatusBarMessageLog);
        };

        // No messages during dont disturb
        if (!this.dontDisturb.value) {

            // Pop message in right area
            if (statusBarMessage.uiArea == 'StatusBar') {
                this.statusBarMessage.next(statusBarMessage);
            };
        };
    }

    dashboardPermissionCheck(
        dashboardID: number,
        accessRequired: string = 'CanViewOrCanEdit'
        ): boolean {
        // Checks if the current user has access to the given D.
        // - accessRequired = type of access requested.  Can be basic (CanView, CanEdit,
        //   etc), or composite : string = CanViewOrCanEdit, CanViewAndCanEdit,
        //   CanEditOrCanDelete, CanEditAndCanDelete.  These are Hard-Coded
        //   It is NOT case sensitive, and only applicable to accessType = 'AccessList'

        if (this.sessionDebugging) {
            console.log('%c    Global-Variables dashboardPermissionCheck ...',
                "color: black; background: lightgray; font-size: 10px", {dashboardID}, {accessRequired});
        };

        // Assume no access
        let hasAccess: boolean = false;
        accessRequired = accessRequired.toLowerCase();

        // Format user
        let userID = this.currentUser.userID;

        let dashboard: Dashboard;
        this.dashboards.forEach(d => {
            if (d.id == dashboardID) {
                dashboard = JSON.parse(JSON.stringify(d));
            };
        });

        // Make sure we have a D
        if (dashboard == undefined) {
            return;
        };

        // Everyone has access to Public Ds
        if (dashboard.accessType.toLowerCase() == 'public') {
            hasAccess = true;
        };

        // The owner has access to Private ones
        if (dashboard.accessType.toLowerCase() == 'private'
            &&
            dashboard.creator.toLowerCase() == userID.toLowerCase()) {
                hasAccess = true;
        };
        if (dashboard.accessType.toLowerCase() == 'accesslist') {

            this.dashboardPermissions.forEach(dp => {

                if (dp.dashboardID == dashboard.id) {

                    if (dp.userID != null) {

                        if (dp.userID.toLowerCase() == userID.toLowerCase()) {
                            if (accessRequired == 'canviewright'  &&  dp.canViewRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'caneditright'  &&  dp.canEditRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'candsaveright'  &&  dp.canSaveRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'candeleteright'  &&  dp.canDeleteRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canadddatasource'  &&  dp.canAddDatasource) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'cangrantaccess'  &&  dp.canGrantAccess) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canvieworcanedit'  &&  (dp.canViewRight  ||  dp.canEditRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canviewandcanedit'  &&  (dp.canViewRight  &&  dp.canEditRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'caneditorcandelete'  &&  (dp.canEditRight  ||  dp.canDeleteRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'caneditandcandelete'  &&  (dp.canEditRight  &&  dp.canDeleteRight) ) {
                                hasAccess = true;
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (accessRequired == 'canviewright'  &&  dp.canViewRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'caneditright'  &&  dp.canEditRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'candsaveright'  &&  dp.canSaveRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'candeleteright'  &&  dp.canDeleteRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'canadddatasource'  &&  dp.canAddDatasource) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'cangrantaccess'  &&  dp.canGrantAccess) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'canvieworcanedit'  &&  (dp.canViewRight  ||  dp.canEditRight) ) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'canviewandcanedit'  &&  (dp.canViewRight  &&  dp.canEditRight) ) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'caneditorcandelete'  &&  (dp.canEditRight  ||  dp.canDeleteRight) ) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'caneditandcandelete'  &&  (dp.canEditRight  &&  dp.canDeleteRight) ) {
                                    hasAccess = true;
                                };
                            };
                    };
                };
            });
        };

        // Return
        if (this.sessionDebugging) {
            if (!hasAccess) {
                console.log('  Access FAILED for: ', {dashboardID}, {accessRequired}, dashboard.accessType, {hasAccess});
            };
        };
        console.log('xx', {hasAccess}) 
        return hasAccess;
    }

    datasourcePermissionsCheck(datasourceID: number, accessRequired: string = 'CanView'): boolean {
        // Description: Determines if the current user has the given access to a DS
        // Access is given directly to a user, and indirectly to a group (to which the user
        // belongs).
        // Returns: T/F
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables datasourcePermissionsCheck ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };
        // Assume no access
        let hasAccess: boolean = false;
        accessRequired = accessRequired.toLowerCase();

        // Format user
        let userID = this.currentUser.userID;

        let datasource: Datasource;
        this.datasources.forEach(ds => {
            if (ds.id == datasourceID) {
                datasource = JSON.parse(JSON.stringify(ds));
            };
        });

        // Make sure we have a D
        if (datasource == undefined) {
            return;
        };

        if (datasource.accessType.toLowerCase() == 'public') {
            hasAccess = true;
        };

        // The owner has access to Private ones
        if (datasource.accessType.toLowerCase() == 'private'
            &&
            datasource.createdBy.toLowerCase() == userID.toLowerCase()) {
                hasAccess = true;
        };
        if (datasource.accessType.toLowerCase() == 'accesslist') {

            this.datasourcePermissions.forEach(dp => {

                if (dp.datasourceID == datasource.id) {

                    if (dp.userID != null) {

                        if (dp.userID.toLowerCase() == userID.toLowerCase()) {
                            if (accessRequired == 'canview'  &&  dp.canView) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canedit'  &&  dp.canEdit) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'candelete'  &&  dp.canDelete) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canrefresh'  &&  dp.canRefresh) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'cangrant'  &&  dp.canGrant) {
                                hasAccess = true;
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (accessRequired == 'canview'  &&  dp.canView) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'canedit'  &&  dp.canEdit) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'candelete'  &&  dp.canDelete) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'canrefresh'  &&  dp.canRefresh) {
                                    hasAccess = true;
                                };
                                if (accessRequired == 'cangrant'  &&  dp.canGrant) {
                                    hasAccess = true;
                                };
                            };
                    };
                };
            });
        };

        // Return
        if (this.sessionDebugging) {
            if (!hasAccess) {
                console.log('  Access type, result: ', {datasourceID}, {accessRequired}, datasource.accessType, {hasAccess})
            };
        };

        return hasAccess;
    }

    dashboardPermissionList(id: number): string[] {
        // Returns Array of Permissions for the current user to the given D.
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables dashboardPermissionList ...',
                "color: black; background: lightgray; font-size: 10px", {id});
        };

        // Assume no access
        let accessList: string[] = [];

        // Format user
        let userID = this.currentUser.userID;

        let dashboard: Dashboard;
        this.dashboards.forEach(d => {
            if (d.id == id) {
                dashboard = JSON.parse(JSON.stringify(d));
            };
        });

        // Make sure we have a D
        if (dashboard == undefined) {
            return accessList;
        };

        // Everyone has access to Public Ds
        if (dashboard.accessType.toLowerCase() == 'public') {
            accessList = ['canviewright' ,'caneditright' ,
            'cansaveright', 'candeleteright', 'canadddatasource', 'cangrantaccess'];
        };

        // The owner has access to Private ones
        if (dashboard.accessType.toLowerCase() == 'private'
            &&
            dashboard.creator.toLowerCase() == userID.toLowerCase()) {
                accessList = ['canviewright' ,'caneditright' ,
                'cansaveright', 'candeleteright', 'canadddatasource', 'cangrantaccess'];
        };

        if (dashboard.accessType.toLowerCase() == 'accesslist') {
            this.dashboardPermissions.forEach(dp => {
                if (dp.dashboardID == dashboard.id) {
                    if (dp.userID != null) {
                        if (dp.userID.toLowerCase() == userID.toLowerCase()) {
                            if (dp.canViewRight) {
                                accessList.push('canviewright');
                            };
                            if (dp.canEditRight) {
                                accessList.push('caneditright');
                            };
                            if (dp.canSaveRight) {
                                accessList.push('candsaveright');
                            };
                            if (dp.canDeleteRight) {
                                accessList.push('candeleteright');
                            };
                            if (dp.canAddDatasource) {
                                accessList.push('canadddatasource');
                            };
                            if (dp.canGrantAccess) {
                                accessList.push('cangrantaccess');
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (dp.canViewRight) {
                                    accessList.push('canViewright');
                                };
                                if (dp.canEditRight) {
                                    accessList.push('canEditright');
                                };
                                if (dp.canSaveRight) {
                                    accessList.push('candsaveright');
                                };
                                if (dp.canDeleteRight) {
                                    accessList.push('canDeleteright');
                                };
                                if (dp.canAddDatasource) {
                                    accessList.push('canadddatasource');
                                };
                                if (dp.canGrantAccess) {
                                    accessList.push('cangrantaccess');
                                };
                        };
                    };
                };
            });
        };

        // Return
        return accessList;
    }

    formatDate(date: Date, returnFormat: string = 'dateTime') {
        // Formats a given date into requested format
        // - date: date to format
        // - returnFormat: format to return
        //   = date (YYYY/MM/DD) - Default
        //   = time (HH:MM:SS)
        //   = dateTime (YYYY/MM/DD HH:MM:SS)
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables formatDate ...',
                "color: black; background: lightgray; font-size: 10px", {date});
        };

        let d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if (returnFormat == 'date') {
            return [year, month, day].join('/');
        };
        if (returnFormat == 'time') {
            return hour + ':' + minute + ':' + second;
        };

        // Default
        return [year, month, day].join('/') + ' ' + hour + ':' + minute + ':' + second;
    }



    // Canvas-Server, stuffies
    // ***********************************************************************

    verifyCanvasUser(
        givenCanvasServerName: string,
        givenCanvasServerURI: string,
        givenCompanyName: string,
        givenUserID: string,
        givenToken: string): Promise<boolean> {
        // Checks if userID exists.  If not, return false.
        // If so, set currentUser object and return true
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables verifyCanvasUser ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {givenCanvasServerName}, {givenCanvasServerURI}, {givenCompanyName}, {givenUserID});
        };

        // TODO - do in more safe way with DB, Auth0, etc
        return new Promise<boolean>((resolve, reject) => {

            // Nothing to do
            if (givenUserID == null  ||  givenUserID == '') {
                resolve(false);
            };

            this.http.post<Token>(
                givenCanvasServerURI + '/auth/local/verify',
                {
                    "companyName": givenCompanyName,
                    "userID": givenUserID }
                ).subscribe(res => {

                // Store locally
                // localStorage.setItem("canvs-token", JSON.stringify(token));

                if (res) {

                        // TODO - must this be done here ??  Needed to setBaseUrl
                        this.canvasServerURI = givenCanvasServerURI;

                        this.getCanvasGroups().then();

                        this.getCanvasUsers().then(usr => {
                            let foundIndex: number = this.canvasUsers.findIndex(u => u.userID == givenUserID);
                            if (foundIndex < 0) {

                                if (this.sessionDebugging) {
                                    console.warn('GV.verifyCanvasUser: Invalid userid', givenUserID)
                                };
                                resolve(false);
                            } else {

                                if (this.sessionDebugging) {
                                    console.warn('GV.verifyCanvasUser: Valid userid', givenUserID)
                                };

                                // Set User var
                                this.currentUser = this.canvasUsers[foundIndex];

                                // Store User ID info
                                this.canvasServerName = givenCanvasServerName;
                                this.canvasServerURI = givenCanvasServerURI;
                                this.currentCompany = givenCompanyName;
                                this.currentUserID = givenUserID;
                                this.currentToken = givenToken;

                                // Register session start time
                                let today = new Date();
                                this.sessionDateTimeLoggedin =
                                    this.formatDate(today);

                                // Indicate logged in; so StatusBar shows Server Name
                                this.loggedIntoServer.next(true);

                                // Optional start D
                                if (this.currentUser.preferenceStartupDashboardID != null) {
                                    console.log('xx NOOOOOOOOOOOOOOOOOOOOOOOOO *****************')
                                    let startTabID: number = -1;
                                    if (this.currentUser.preferenceStartupDashboardTabID != null) {
                                        startTabID = this.currentUser.preferenceStartupDashboardTabID;
                                    };

                                    this.refreshCurrentDashboard(
                                        'statusbar-clickTabDelete',
                                        this.currentUser.preferenceStartupDashboardID,
                                        startTabID,
                                        ''
                                    );
                                };

                                // Create Var with data
                                let localCanvasUser =
                                    {
                                        canvasServerName: givenCanvasServerName,
                                        canvasServerURI: givenCanvasServerURI,
                                        currentCompany: givenCompanyName,
                                        currentUserID: givenUserID,
                                        currentToken: givenToken
                                    };
                                console.warn('GV.verifyCanvasUser localCanvasUser', localCanvasUser)

                                // Add / Update DB with Put
                                let currentCanvasUserCount: number = 0;

                                // Local App info DB
                                console.warn('GV.verifyCanvasUser: @local DB')
                                // let dbCanvasAppDatabase = new CanvasAppDatabase
                                // dbCanvasAppDatabase.open();

                                this.dbCanvasAppDatabase.table("currentCanvasUser")
                                    .put(localCanvasUser)
                                    .then(res => {
                                        console.warn('GV.verifyCanvasUser Add/Update currentCanvasUser res', res);

                                        // Count
                                        this.dbCanvasAppDatabase.table("currentCanvasUser").count(res => {
                                            console.warn('GV.verifyCanvasUser currentCanvasUser Count', res);
                                            currentCanvasUserCount = res;

                                            // Return
                                            if (currentCanvasUserCount > 0) {
                                                console.warn('GV.verifyCanvasUser setCanvasServerState');
                                                return true;
                                            } else {
                                                return false;
                                            };
                                        });
                                    }
                                );

                                // Refresh
                                this.loadVariableOnStartup.next(true);

                                resolve(true);
                            };
                        });

                } else {
                    console.warn('GV.verifyCanvasUser: Registration failed on : ',
                        givenCanvasServerURI, givenUserID, res);
                    resolve(false);
                };
            },
            err => {
                console.log('Error Registration FAILED on : ',
                givenCanvasServerURI, {err});
                console.warn('GV.verifyCanvasUser: HTTP Error'), err;
                resolve(false);
            });

        });
    }

    registerCanvasUser(
        givenCanvasServerName: string,
        givenCompanyName: string,
        givenUserID: string,
        givenPassword: string): Promise<string> {
        // Registers a user on a given Server & Company (add to Users) if he/she does not
        // already exist
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables registerCanvasUser ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {givenCanvasServerName}, {givenCompanyName},
                {givenUserID}, {givenPassword});
        };

        return new Promise<string>((resolve, reject) => {

            // Get the ServerURL
            let serverURLIndex: number = this.ENVCanvasServerList.findIndex(
                srv => srv.serverName == givenCanvasServerName
            );
            if (serverURLIndex < 0) {
                resolve('Error: Server Name not in ENV configuration');
            };
            let givenCanvasServerURI: string = this.ENVCanvasServerList[serverURLIndex]
                .serverHostURI;

            console.warn('xx givenCanvasServerURI', givenCanvasServerURI)
            this.http.post<CanvasHttpResponse>(givenCanvasServerURI + '/auth/local/signup',
                {
                    "companyName": givenCompanyName,
                    "userID": givenUserID,
                    "password": givenPassword
                }
                ).subscribe(res => {

                    if (res.statusCode == 'failed') {
                        console.warn('xx GV Failed: ' + res.message, res);

                        resolve('Failed: ' + res.message);
                    };
                    if (res.statusCode == 'success') {
                        console.warn('Success: ' + res.message);

                        resolve('Success: ' + res.message);
                    };
                    if (res.statusCode == 'error') {
                        console.warn('Error: ' + res.message);

                        resolve('Error: ' + res.message);
                    };
            },
            err => {
                console.log('Error Registration FAILED', {err});
                resolve('Error: Registration FAILED ' + err.message);
            });
        });
    }

    loginCanvasServer(
        givenCanvasServerName: string,
        givenCompanyName: string,
        givenUserID: string,
        givenPassword: string): Promise<{ message: string, token: string}> {
        // Logs a user on a given Server & Company
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables loginCanvasServer ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {givenCanvasServerName}, {givenCompanyName},
                {givenUserID}, {givenPassword});
        };

        return new Promise<{ message: string, token: string}>((resolve, reject) => {

            // Get the ServerURL
            let serverURLIndex: number = this.ENVCanvasServerList.findIndex(
                srv => srv.serverName == givenCanvasServerName
            );
            if (serverURLIndex < 0) {
                resolve({ message:'Error: Server Name not in ENV configuration', token: null});
            };
            let givenCanvasServerURI: string = this.ENVCanvasServerList[serverURLIndex]
                .serverHostURI;

                console.warn('xx LOGIN givenCanvasServerURI', serverURLIndex, givenCanvasServerURI)
            this.http.post<CanvasHttpResponse>(givenCanvasServerURI + '/auth/local/login',
                {
                    "companyName": givenCompanyName,
                    "userID": givenUserID,
                    "password": givenPassword
                }
                ).subscribe(res => {

                    console.warn('xx GV.loginCanvasServer res', res);

                    if (res.statusCode == 'failed') {
                        console.warn('xx GV.loginCanvasServer Failed: ' + res.message);

                        resolve({ message:'Failed: ' + res.message, token: null});
                    };
                    if (res.statusCode == 'success') {
                        console.warn('xx GV.loginCanvasServer Success: ' + res.message);

                        resolve({ message:'Success: ' + res.message, token: res.token});
                    };
                    if (res.statusCode == 'error') {
                        console.warn('xx GV.loginCanvasServer Error: ' + res.message);

                        resolve({ message:'Error: ' + res.message, token: null});
                    };
            },
            err => {
                console.log('xx GV.loginCanvasServer Error Login FAILED', {err});
                resolve({ message:'Error: Login FAILED ' + err.message, token: null});
            });
        });
    }

    getListTables(
        serverType: string,
        serverName: string,
        databaseName: string,
        port: string,
        username: string,
        password: string): Promise<CanvasHttpResponse> {
        // Description: Returns an Array of tables in the given Server and DB
        if (this.sessionDebugging) {
            console.log('%c        Global-Variables getListTables ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<CanvasHttpResponse>((resolve, reject) => {

            // Get data
            let pathUrl: string = 'listTables?' +
                "serverType=" + serverType +
                "&serverName=" + serverName +
                "&databaseName=" + databaseName +
                "&port=" + port +
                "&username=" + username +
                "&password=" + password;
            let finalUrl: string = this.canvasServerURI + '/clientData/' + pathUrl;

            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getListTables 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            res.data);
                    };
                    resolve(res);
                },
                err => {
                    reject(err.message  || err.sqlMessage);
                }
            )
        });

    }

    getListFields(
        serverType: string,
        serverName: string,
        databaseName: string,
        tableName: string,
        port: string,
        username: string,
        password: string): Promise<CanvasHttpResponse> {
        // Description: Returns an Array of Fields in the given Server and DB
        if (this.sessionDebugging) {
            console.log('%c        Global-Variables getListFields ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<CanvasHttpResponse>((resolve, reject) => {

            // Get data
            let pathUrl: string = 'listFields?' +
                "serverType=" + serverType +
                "&serverName=" + serverName +
                "&databaseName=" + databaseName +
                "&tableName=" + tableName +
                "&port=" + port +
                "&username=" + username +
                "&password=" + password;
            let finalUrl: string = this.canvasServerURI + '/clientData/' + pathUrl;

            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getListTables 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            res.data.length);
                    };
                    resolve(res);
                },
                err => {
                    reject(err.message  ||  err.sqlMessage);
                }
            )
        });

    }

    getExecQuery(
        serverType: string,
        serverName: string,
        databaseName: string,
        sqlStatement: string,
        port: string,
        username: string,
        password: string,
        datasourceID: number = null,
        nrRowsToReturn: number = 0): Promise<CanvasHttpResponse> {
        // Description: Executes a SQL Statement and returns an Array of data
        // Input: 
        // - serverType = type of DB, ie MySQL, MicrosoftSQL, etc
        // - serverName, databaseName, port, username, password = DB connection string & credentials
        // - sqlStatement = SQL Statement
        // - datasourceID = Optional DS-id if clientData must be saved (cached)
        // - nrRowsToReturn = Optional number of rows to return, 0 = all

        if (this.sessionDebugging) {
            console.log('%c        Global-Variables getExecQuery ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        return new Promise<CanvasHttpResponse>((resolve, reject) => {

            // Get data
            let pathUrl: string = 'execQuery?' +
                "serverType=" + serverType +
                "&serverName=" + serverName +
                "&databaseName=" + databaseName +
                "&sqlStatement=" + sqlStatement +
                "&port=" + port +
                "&username=" + username +
                "&password=" + password +
                "&datasourceID=" + datasourceID +
                "&nrRowsToReturn=" + nrRowsToReturn;
            let finalUrl: string = this.canvasServerURI + '/clientData/' + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getExecQuery 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            res.data.length);
                    };
                    resolve(res);
                },
                err => {
                    reject(err.message  || err.sqlMessage);
                }
            )
        });

    }

    getCurrentDashboardAndTabNEW(
        id: number,
        dashboardTabID: number,
        datasourceIDexclude: string = ""): Promise<string> {
        // Gets the data that is DISPLAYED for the given Dashboard and Tab.  Load:
        // - Dashboard template
        // - All Tabs for this D
        // - All Widgets for the given Tab (not the rest)
        // - All Datasources used by the above Widgets
        //   Optionally exclude comma separated list of Datasource IDs in datasourceIDexclude
        //   as these are already loaded.
        //
        // Clear the CurrentXXX vars and reload with the info read from the DB.
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getCurrentDashboardAndTabNEW ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardTabID}, {datasourceIDexclude});
        };
        return new Promise<string>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
            //     this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

            // TODO - fix HARD Coding !!!
            // TODO - add CACHED
            let pathUrl: string = '/canvasCurrentDashboard?id=68&dashboardTabID=175&datasourceIDexclude=1,2';
            let finalUrl: string = this.canvasServerURI + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // this.datasources = res.data;
                    // this.isDirtyDatasources = false;
                    // this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getCurrentDashboardAndTabNEW 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            "Current Dashboard retrieved")
                    };

                    resolve("success");
                },
                err => {
                    reject(err.message)
                }
            );
        });
    };

    getDashboardSummaryNEW(dashboardID: number): Promise<any> {
        // Gets a summary of related Entities for the given Dashboard 
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getDashboardSummaryNEW ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {dashboardID});
        };
        return new Promise<any>((resolve, reject) => {

            let pathUrl: string = '/canvasDashboardSummary?id=' + dashboardID.toString();
            let finalUrl: string = this.canvasServerURI + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl).subscribe(
                res  => {
                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables canvasDashboardSummary',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            "Data retrieved")
                    };

                    resolve(res);
                },
                err => {
                    reject(err.message)
                }
            );
        });
    };

    addDatasourceNEW(datasourceInput: Datasource, datasetInput: Dataset, clientDataInput: any): Promise<string> {
        // Add a new Datasource, given the following:
        // - datasource
        // - dataset
        // - data
        // The Server adds the records, with the correct IDs
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables addDatasourceNEW ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                datasourceInput.name);
        };
        return new Promise<string>((resolve, reject) => {

            // Create Combo body
            let body: any = {
                "datasourceInput": datasourceInput,
                "datasetInput": datasetInput,
                "clientDataInput": clientDataInput
            };

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = '/canvasDatasource';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.post<CanvasHttpResponse>(finalUrl, body, {headers}).subscribe(
                res  => {

                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // Add to global vars
                    let datasourceAdded: Datasource = res.data.datasource;
                    let datasetsAdded: Dataset = res.data.datasets;

                    if (datasourceAdded != null) {
                        let datasourceIndex: number = this.datasources.findIndex(ds => ds.id == datasourceAdded.id);
                        if (datasourceIndex < 0) {
                            this.datasources.push(datasourceAdded);
                        };
                    };
                    if (datasetsAdded != null) {
                        let datasetIndex: number = this.datasets.findIndex(ds => ds.id == datasetsAdded.id);
                        if (datasetIndex < 0) {
                            this.datasets.push(datasetsAdded);
                            console.log('xx post', this.datasets.length)
                        };
                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables addDatasourceNEW 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            "Datasource and related records saved", this.datasources, this.datasets)
                    };

                    resolve("success");
                },
                err => {
                    reject(err.message)
                }
            );
            // } else {
            //     if (this.sessionDebugging) {
            //         console.log('%c    Global-Variables getDatasources 2',
            //             "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
            //     };

            //     resolve("success");
            // }
        });
    };

    saveDatasourceNEW(datasourceInput: Datasource, datasetInput: Dataset, clientDataInput: any): Promise<string> {
        // Saves a Datasource, given the following:
        // - datasource
        // - dataset
        // - data
        // The Server adds the records, with the correct IDs
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables saveDatasourceNEW ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                datasourceInput.name);
        };
        return new Promise<string>((resolve, reject) => {

            // Create Combo body
            let body: any = {
                "datasourceInput": datasourceInput,
                "datasetInput": datasetInput,
                "clientDataInput": clientDataInput
            };

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            let pathUrl: string = '/canvasDatasource';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl, body, {headers}).subscribe(
                res  => {

                    if(res.statusCode != 'success') {
                        reject(res.message);
                        return;
                    };

                    // Add to global vars
                    let currentDatasetsAdded: Dataset = JSON.parse(JSON.stringify(datasetInput));
                    currentDatasetsAdded.dataRaw = clientDataInput.data;
                    currentDatasetsAdded.data = clientDataInput.data;

console.log('xx currentDatasetsAdded', currentDatasetsAdded)
                    // Update Datasources
                    let datasourceIndex: number = this.datasources.findIndex(
                        ds => ds.id == datasourceInput.id);
                    if (datasourceIndex < 0) {
                        this.datasources.push(datasourceInput);
                    } else {
                        this.datasources[datasourceIndex] = datasourceInput;
                    };

                    // Update CurrentDatasources
                    let currentDatasourceIndex: number = this.currentDatasources.findIndex(
                        ds => ds.id == datasourceInput.id);
                    if (currentDatasourceIndex >= 0) {
                        this.currentDatasources[currentDatasourceIndex] = datasourceInput;
                    };

                    // Update Datasets, without data
                    let datasetIndex: number = this.datasets.findIndex(
                        ds => ds.id == datasetInput.id);
                    if (datasetIndex < 0) {
                        this.datasets.push(datasetInput);
                    } else {
                        this.datasets[datasetIndex] = datasetInput;
                    };

                    // Update CurrentDatasets, with Data
                    let currentDatasetIndex: number = this.currentDatasets.findIndex(
                        ds => ds.id == datasetInput.id);
                    if (currentDatasetIndex >= 0) {
                        this.currentDatasets[currentDatasetIndex] = currentDatasetsAdded;
                    };
                    
                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables saveDatasourceNEW 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            "Datasource and related records saved", this.datasources, this.datasets, this.currentDatasources, this.currentDatasets)
                    };

                    resolve("success");
                },
                err => {
                    reject(err.message)
                }
            );
            // } else {
            //     if (this.sessionDebugging) {
            //         console.log('%c    Global-Variables getDatasources 2',
            //             "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
            //     };

            //     resolve("success");
            // }
        });
    };

    tributaryCreateSession(sampleSize: number = null) {
        // Create a new Tributary Session
        // - sampleSize = optional nr of rows to return
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables tributaryCreateSession ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {sampleSize});
        };

        let pathUrl: string = this.canvasServerURI +
            'canvas/datasources/sessions/create-session/';

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "JWT " + localToken.token);
            const sampleString: any = { "sample_size": sampleSize };
            this.http.post(pathUrl, sampleString, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('tributaryCreateSession Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error tributaryCreateSession FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });

    }

    tributaryInspect(inspectURL: string, source: any) {
        // Inspect a DS using the given URL
        // - inspectURL - url obtained from tributaryCreateSession()
        // - source = specification for Tributary
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables tributaryInspect ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {inspectURL});
        };

        let pathUrl: string = inspectURL;

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "JWT " + localToken.token);
            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('tributaryInspect Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error tributaryInspect FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });

    }

    tributaryExecute(executeURL: string, source: any) {
        // Executes a DS using the given URL
        // - executeURL - url obtained from tributaryCreateSession()
        // - source = specification for Tributary
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables tributaryExecute ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {executeURL});
        };

        let pathUrl: string = executeURL;

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "JWT " + localToken.token);
            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('tributaryExecute Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error tributaryExecute FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });

    }

    getTributaryData(source: any): Promise<any> {
        // Description: Gets data from the Tributary Server
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getTributaryData ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {source});
        };

        let pathUrl: string = this.canvasServerURI + 'canvas/enqueue/';

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));
            console.warn('xx token', localToken)
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Authorization", "JWT " + localToken.token);

            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('Tributary Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error Get Tributary Data FAILED', {err});
                    };

                    reject(err.message);
                }
            )
        });
    }

    getTributaryInspect(source: any): Promise<any> {
        // Description: Gets data from the Tributary Server
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getTributaryData ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {source});
        };

        let pathUrl: string = this.canvasServerURI + 'canvas/inspect/';

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));
            console.warn('xx token', localToken)
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Authorization", "JWT " + localToken.token);

            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('Tributary Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    if (this.sessionDebugging) {
                        console.log('Error Get Tributary Inspect FAILED', {err});
                    };
                    reject(err.message);
                }
            )
        });
    }

    constructTributarySQLSource(
        connector: string,
        drivername: string,
        username: string,
        password: string,
        database: string,
        host: string,
        port: number,
        query: string): TributarySource {
        // Description: constructs a Tributary Source object from the given parameters
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables constructTributarySQLSource ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {connector}, {drivername}, {username}, {password}, {database}, {host}, {port},
                {query});
        };

        let tributarySource: TributarySource = {
            "source": {
                "connector": connector,
                "drivername": drivername,
                "username": username,
                "password": password,
                "database": database,
                "host": host,
                "port": port,
                "query": query
            }
        };

        // Return
        return tributarySource;
    };

    dateAdd(date: Date, interval: string, units: number) {
        // Adds an element to a data, similar to ADDDATE SQL-style
        //  - date  Date to start with
        //  - interval  One of: year, quarter, month, week, day, hour, minute, second
        //  - units  Number of units of the given interval to add.
        //  Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now
        // Returns: Amended Date
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getTributaryDirectDBSchema ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {date}, {interval}, {units});
        };

        // Get the original
        var ret: Date = new Date(date); //don't change original date

        var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
        switch(interval.toLowerCase()) {
            case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
            case 'year2'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;

            case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
            case 'quarters':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;

            case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
            case 'months'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;

            case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
            case 'weeks'   :  ret.setDate(ret.getDate() + 7*units);  break;

            case 'day'    :  ret.setDate(ret.getDate() + units);  break;
            case 'days'    :  ret.setDate(ret.getDate() + units);  break;

            case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
            case 'hours'   :  ret.setTime(ret.getTime() + units*3600000);  break;

            case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
            case 'minutes' :  ret.setTime(ret.getTime() + units*60000);  break;
            
            case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
            case 'seconds' :  ret.setTime(ret.getTime() + units*1000);  break;

            default       :  ret = undefined;  break;
        };

        return ret;
    }

    dateDiff(fromDate: Date, toDate: Date, interval: string): number {
        // Returns the difference between two dates in the given interval, similar to DATEDIFF SQL-style
        //  - fromDate  From Date
        //  - toDate  To Date
        //  - interval  One of: year, quarter, month, week, day, hour, minute, second
        //  Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now
        // Returns: Amended Date
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getTributaryDirectDBSchema ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                {fromDate}, {toDate}, {interval});
        };

        // Cater for missing input
        if (fromDate == null) {
            fromDate = new Date();
        };
        if (toDate == null) {
            toDate = new Date();
        };
        let diffDays: number = toDate.getDate() - fromDate.getDate(); // milliseconds between two dates
        let diffTime: number = toDate.getTime() - fromDate.getTime(); // milliseconds between two dates
        let diff: number = +toDate - +fromDate; // milliseconds between two dates
        console.log('xx gv diffMs', diffDays, diffTime, diff / 86400000)
        let ret: number = -1;
        switch(interval.toLowerCase()) {
            case 'year'        : ret = diffDays / 365;  break;
            case 'quarter'     : ret = diffDays / 120;  break;
            case 'month'       : ret = diffDays / 30;  break;
            case 'week'        : ret = diffDays / 7 ;  break;
            case 'day'         : ret = diffTime / 86400000;  break;
            case 'hour'        : ret = diffTime / 3600000;  break;
            case 'minute'      : ret = diffTime / 60000;  break;
            case 'second'      : ret = diffTime / 1000;  break;
            case 'millisecond' : ret = diffTime;  break;
            default       	   : ret = undefined;
        };

        return ret;
    }

    calcShapeTextDisplay(shapeText: string): string {
        // Description: Transforms the .shapeText property to .shapeTextDisplay using
        // keywords like #pagenr, #pages, #date
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables calcShapeTextDisplay ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", {shapeText});
        };

        let today = new Date();
        let pages: number = this.currentDashboardTabs.length;
        let selectedTabIndex: number = this.currentDashboardInfo
            .value.currentDashboardTabIndex;
        selectedTabIndex = selectedTabIndex + 1;
        let shapeTextDisplay = shapeText;
        shapeTextDisplay = shapeTextDisplay
            .replace(/#date/g, this.formatDate(today, 'date'));
        shapeTextDisplay = shapeTextDisplay
            .replace(/#pagenr/g, selectedTabIndex.toString());
        shapeTextDisplay = shapeTextDisplay
            .replace(/#pages/g, pages.toString());

        // Return
        return shapeTextDisplay;
    }

    calcGraphHeight(widget: Widget): number {
        // Description: calculate the Height of the graph in a Widget
        // Returns: Graph Height, null if impossible to do so
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables calcGraphHeight ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        // Ignore bad input
        if (widget == null) {
            return null;
        };

        let graphHeight: number;

        // Set Graph Height and Width
        // if (widget.graphXaxisTitle != ''
        //     &&
        //     widget.graphXaxisTitle != null) {
        //         graphHeight = widget.containerHeight - 55;
        // } else {
        //     graphHeight = widget.containerHeight - 15;
        // };
        graphHeight = widget.containerHeight - 15;

        // Return
        return graphHeight;
    }

    calcGraphWidth(widget: Widget): number {
        // Description: calculate the Width of the graph in a Widget
        // Returns: Graph Width, null if impossible to do so
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables calcGraphWidth ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        };

        // Ignore bad input
        if (widget == null) {
            return null;
        };

        let graphWidth: number;

        // Set Graph Width and Width - Assume font size 12 for now
        // if (widget.graphColorField != ''
        //     &&  widget.graphColorField != null) {
        //     graphWidth = widget.containerWidth - 35;
        // } else {
        //     graphWidth = widget.containerWidth - 35;
        // };
        graphWidth = widget.containerWidth - 35;

        // Return
        return graphWidth;
    }

    testBingMaps() {
        // Test to get DistanceMatrix from Bing via Async - not sure how to get results !
        console.log('bingMaps Start')

        let pathUrl: string = 'https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrixAsync';
        pathUrl = pathUrl + '?origins=-33.8689103,18.5167131';
        pathUrl = pathUrl + '&destinations=-34.0165939,22.8028049;-34.19553,22.091511;-34.0386276,22.2109966;-33.590777,22.200313;-33.573833,22.437935;-34.014232,22.452362;-34.0386162,23.0488625;-33.9676361,22.4382248;-34.04956,23.354508;-33.980665,25.571136;-34.17686,22.100389;-33.95696,22.4624252;-34.180534,22.1436;-33.9676361,22.4382248;-33.92873,25.482503;-34.045921,23.323514;-34.1754951,22.1035347;-34.0043068,22.4864826;-34.0256271,22.8132019;-34.0450058,23.3695278;-32.349277,22.582667;-34.014437,22.452317;-34.0043068,22.4864826;-34.05893,23.37694;-34.0403137,23.0469074;-33.9560623,22.6195;-33.59527,22.23417;-34.1844063,22.1460972;-33.58964,22.205465;-34.03452,23.04515;-34.0347939,23.0454731;-34.056427,23.3725662;-33.9701538,22.4885139;-34.1270183,22.1173702999999;-34.147772,22.103731;-33.95044,22.432437;-33.997984,22.615692;-33.94693,22.410223;-33.945488,22.4643173;-34.1833534,22.1141949;-33.96437,22.4831429;-33.9524231,22.4433327;-34.1825371,22.14276;-34.07952,22.150616;-34.18756,22.1141472;-33.940074,25.597108;-33.999468,25.535987;-34.0564537,23.3729343;-34.0362434,23.0409622;-34.147772,22.10343';
        pathUrl = pathUrl + '&distanceUnit=km';
        pathUrl = pathUrl + '&travelMode=driving';
        pathUrl = pathUrl + '&startTime=2017-06-15T13:00:00-07:00';
        pathUrl = pathUrl + '&key=An32WT6o1FBmePyg2qOelW0-eby7-hW9H1YmxfAw9yVrEvPloQ9Wte1l0n3h1DED';
        
        this.http.get<any>(pathUrl).subscribe(
            httpResult  => {
                console.log('httpResult', httpResult)
            },
            err => {
                console.log('err', err)
            }
        );
    }

}