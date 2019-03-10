/*
 * Shows form to add, edit the selected Table
 */

 // Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { Datasource }                 from './models';
import { Widget }                     from './models';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'table-editor',
    templateUrl: './table.editor.component.html',
    styleUrls: ['./table.editor.component.css']
  })
  export class TableEditorComponent implements OnInit {

    @Input() newWidget: boolean;
    @Input() showDatasourcePopup: boolean;
    @Input() selectedWidget: Widget;

    @Output() formWidgetEditorClosed: EventEmitter<Widget> = new EventEmitter();
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSave('Saved');
            return;
        };

    }

    clickedButtonAggregateNo: boolean = false;
    colField: string = 'Drag a field here ...';
    containerHasContextMenus: boolean = true;
    containerHasTitle: boolean = true;
    currentData: any = [];
    currentDatasources: Datasource[] = null;               // Current DS for the selected W
    dataFieldNames: string[] = [];
    dataFieldLengths: number[] = [];
    dataFieldTypes: string[] = [];
    draggedField: string = '';
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverColor: boolean = false;
    errorMessage: string = '';
    filterPivotFields: string = '';
    hasClicked: boolean = false;
    isBusyRetrievingData: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
    oldWidget: Widget = null;                       // W at start
    opened: boolean = true;
    showPropertiesArea: boolean;
    rowField: string = 'Drag a field here ...';
    selectedRow: string[] = [];
    selectedRowIndex: number = 0;
    showRowFieldAdvanced: boolean = false;
    showColFieldAdvanced: boolean = false;
    showColFieldAdvancedArea: boolean = false;
    showRowFieldAdvancedArea: boolean = false;
    showColumnDeleteIcon: boolean = false;
    showColourDeleteIcon: boolean = false;
    showRowDeleteIcon: boolean = false;
    showTable: boolean = false;
    showType: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // ngOnInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (this.newWidget) {
            // Get DS to which user has permissions
            this.currentDatasources = this.globalVariableService.datasources
                .slice()
                .filter(ds => 
                    this.globalVariableService.datasourcePermissionsCheck(ds.id, 'CanView')
                )
                .sort( (obj1, obj2) => {
                    if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                }
            );

            // Count the Ws
            let widgets: Widget[];
            this.currentDatasources.forEach(ds => {
                widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
                ds.nrWidgets = widgets.length;
            });

            // Create new W
            // this.localWidget = this.globalVariableService.widgetTemplate;
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Table';

        } else {

            // Deep copy original W
            this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Deep copy Local W
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // TODO - handle properly and close form
            if (this.localWidget.datasourceID == 0) {
                alert('No Widget was selected, or could not find it in glob vars')
            };

            // Get DS
            this.currentDatasources = this.globalVariableService.currentDatasources
                .filter(ds => ds.id == this.localWidget.datasourceID)
                .filter(ds => 
                    this.globalVariableService.datasourcePermissionsCheck(ds.id, 'CanView')
                )
                .sort( (obj1, obj2) => {
                    if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                }
            );

            // TODO - handle properly and close form
            if (this.currentDatasources.length != 1) {
                alert('Datasource not found in global currentDatasources')
            };

            // Get local vars - easier for ngFor
            this.containerHasContextMenus = this.localWidget.containerHasContextMenus;
            this.containerHasTitle = this.localWidget.containerHasTitle;

            this.dataFieldNames = this.currentDatasources[0].dataFields;
            this.dataFieldLengths = this.currentDatasources[0].dataFieldLengths;
            this.dataFieldTypes = this.currentDatasources[0].dataFieldTypes;

            this.showTable = true;
            // this.clickDSrow(-1, this.localWidget.datasourceID)
        }

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

    }

  	clickClose(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(null);
    }

    clickDSrow(index: number, datasourceID: number) {
        // Set the selected datasourceID
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        // Highlight selected row
        this.selectedRowIndex = index;
        this.errorMessage = '';

        // Determine if data obtains in Glob Var
        let dSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
            ds => ds.datasourceID == datasourceID
        );

        if (dSetIndex < 0) {

            if (this.isBusyRetrievingData) {
                this.errorMessage = 'Still retrieving the actual data for this DS';
                return;
            };

            this.isBusyRetrievingData = true;
            this.errorMessage = 'Getting data ...'
            this.globalVariableService.addCurrentDatasource(datasourceID)
                .then(res => {

                    // Reset
                    this.isBusyRetrievingData = false
                    this.currentDatasources = this.globalVariableService.datasources
                        .slice()
                        .filter(ds => 
                            this.globalVariableService.datasourcePermissionsCheck(ds.id, 'CanView')
                        )
                        .sort( (obj1, obj2) => {
                            if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                                return 1;
                            };
                            if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                                return -1;
                            };
                            return 0;
                        }
                    );
        
                    // Tell user
                    this.errorMessage = 'Data retrieved - click row again to continue';

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in table.editor reading widgetGraphs: ' + err);
                });
    
            // Stop Synch execution
            return;
        };

        // Load local arrays for ngFor
        let dsIndex: number = this.currentDatasources.findIndex(ds => ds.id == datasourceID);

        if (dsIndex >= 0) {
            this.dataFieldNames = this.currentDatasources[dsIndex].dataFields;
            this.dataFieldLengths = this.currentDatasources[dsIndex].dataFieldLengths;
            this.dataFieldTypes = this.currentDatasources[dsIndex].dataFieldTypes;

            // Reset
            this.isBusyRetrievingData = false;
        } else {

            if (this.isBusyRetrievingData) {
                this.errorMessage = 'Retrieving the actual data - click row again once done';
                return;
            };

            this.isBusyRetrievingData = true;
            this.globalVariableService.addCurrentDatasource(datasourceID)
                .then(res => {
                    this.isBusyRetrievingData = false
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in table.editor addCurrentDatasources: ' + err);
                });
        };

        // Switch on the preview after the first row was clicked
        this.hasClicked = true;

        // Get latest dSet for the selected DS
        let ds: number[]=[];
        let dSetID: number = 0;

        for (var i = 0; i < this.globalVariableService.currentDatasets.length; i++) {
            if(this.globalVariableService.currentDatasets[i].datasourceID == datasourceID) {
                ds.push(this.globalVariableService.currentDatasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        } else {
            // Make proper error handling
            alert('Error: no dataSet in glob vars for DSid = ' + datasourceID)
        };

        // Load first few rows into preview
        this.currentData = this.globalVariableService.currentDatasets.filter(
            d => d.id == dSetID)[0].data.slice(0,5);

        // Fill in data info
        if (this.newWidget) {
            this.localWidget.datasourceID = datasourceID;
            this.localWidget.datasetID = dSetID;
            this.localWidget.graphData = this.globalVariableService.currentDatasets.filter(
                d => d.id == dSetID)[0].data;
        };

    }

    clickContinue(){
        // Continue to design / edit the W, and close the form for the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

        this.showDatasourcePopup = false;
        this.showTable = true;
    }

    clickProperties(){
        // Show popup for full list of Table Properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickProperties', '@Start');

        this.showPropertiesArea = true;
    }

    clickApplyProperties(action: string) {
        // Apply changes to Table properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickApplyProperties', '@Start');

        if (action == 'Close') {
            this.showPropertiesArea = false;
            return;
        };

        // TODO - save to DB
        this.showPropertiesArea = false;
    }

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.localWidget.containerHasContextMenus = this.containerHasContextMenus;
        this.localWidget.containerHasTitle = this.containerHasTitle;

        // Set width, depending on ColorField change
        if (this.newWidget) {
            // if (this.localWidget.graphColorField != ''
            //         &&  this.localWidget.graphColorField != null) {
            //     this.localWidget.graphWidth = this.localWidget.containerWidth - 130;
            // } else {
            //     this.localWidget.graphWidth = this.localWidget.containerWidth - 60;
            // };

            // TODO - improve this when using a DB!
            // let newID: number = 1;
            // let ws: number[]=[];
            // for (var i = 0; i < this.globalVariableService.widgets.length; i++) {
            //     ws.push(this.globalVariableService.widgets[i].id)
            // };
            // if (ws.length > 0) {
            //     newID = Math.max(...ws) + 1;
            // };
            // this.localWidget.id = newID;

            this.localWidget.dashboardTabIDs.push(this.globalVariableService.
                currentDashboardInfo.value.currentDashboardTabID
            );

            // this.globalVariableService.widgets.push(this.localWidget);
            // this.globalVariableService.currentWidgets.push(this.localWidget);

            this.globalVariableService.addResource('widgets', this.localWidget)
                .then(res => {
                    this.localWidget.id = res.id;

                    // Action
                    // TODO - cater for errors + make more generic
                    let actID: number = this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        this.localWidget.id,
                        'Widget',
                        'Edit',
                        'Update Title',
                        'W Title clickSave',
                        null,
                        null,
                        null,
                        this.localWidget,
                        false               // Dont log to DB yet
                    );
                    // Tell user
                    this.globalVariableService.showStatusBarMessage(
                        {
                            message: 'Table Added',
                            uiArea: 'StatusBar',
                            classfication: 'Info',
                            timeout: 3000,
                            defaultMessage: ''
                        }
                    );

                    // Return to main menu
                    this.formWidgetEditorClosed.emit(this.localWidget);

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in table.editor adding widgets: ' + err);
                });

        } else {

            // Update global W and DB
            this.globalVariableService.saveWidget(this.localWidget)
                .then(res => {

                    // Action
                    // TODO - cater for errors + make more generic
                    let actID: number = this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        this.localWidget.id,
                        'Widget',
                        'Edit',
                        'Update Title',
                        'W Title clickSave',
                        null,
                        null,
                        this.oldWidget,
                        this.localWidget,
                        false               // Dont log to DB yet
                    );

                    // Tell user
                    this.globalVariableService.showStatusBarMessage(
                        {
                            message: 'Graph Saved',
                            uiArea: 'StatusBar',
                            classfication: 'Info',
                            timeout: 3000,
                            defaultMessage: ''
                        }
                    );

                    this.formWidgetEditorClosed.emit(this.localWidget);

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in table.editor saveWidget: ' + err);
                });

        };
    }

  }