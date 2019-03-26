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
    dataFieldNames: string[] = [];
    dataFieldLengths: number[] = [];
    dataFieldTypes: string[] = [];
    datasources: Datasource[] = null;
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

        // Get DS to which user has permissions
        this.datasources = this.globalVariableService.datasources
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
        this.datasources.forEach(ds => {
            widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
            ds.nrWidgets = widgets.length;
        });
    
        if (this.newWidget) {

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

            // Get local vars - easier for ngFor
            this.containerHasContextMenus = this.localWidget.containerHasContextMenus;
            this.containerHasTitle = this.localWidget.containerHasTitle;

            this.dataFieldNames = this.datasources[0].dataFields;
            this.dataFieldLengths = this.datasources[0].dataFieldLengths;
            this.dataFieldTypes = this.datasources[0].dataFieldTypes;

            this.showTable = true;
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
        // let dSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
        //     ds => ds.datasourceID == datasourceID
        // );

        // if (dSetIndex < 0) {

        //     if (this.isBusyRetrievingData) {
        //         this.errorMessage = 'Still retrieving the actual data for this DS';
        //         return;
        //     };

        //     this.isBusyRetrievingData = true;
        //     this.errorMessage = 'Getting data ...'
        //     this.globalVariableService.addCurrentDatasource(datasourceID)
        //         .then(res => {

        //             // Reset
        //             this.isBusyRetrievingData = false
        //             this.currentDatasources = this.globalVariableService.datasources
        //                 .slice()
        //                 .filter(ds => 
        //                     this.globalVariableService.datasourcePermissionsCheck(ds.id, 'CanView')
        //                 )
        //                 .sort( (obj1, obj2) => {
        //                     if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
        //                         return 1;
        //                     };
        //                     if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
        //                         return -1;
        //                     };
        //                     return 0;
        //                 }
        //             );
        
        //             // Tell user
        //             this.errorMessage = 'Data retrieved - click row again to continue';

        //         })
        //         .catch(err => {
        //             this.errorMessage = err.slice(0, 100);
        //             console.error('Error in table.editor reading widgetGraphs: ' + err);
        //         });
    
        //     // Stop Synch execution
        //     return;
        // };

        let currentDatasourceIndex: number = this.globalVariableService.currentDatasources.findIndex(
            ds => ds.id == datasourceID
        );
        if (currentDatasourceIndex < 0) {

            if (this.isBusyRetrievingData) {
                this.errorMessage = 'Still retrieving the actual data for this DS';
                return;
            };

            this.isBusyRetrievingData = true;
            this.errorMessage = 'Getting data ...'
            this.globalVariableService.getCurrentDatasource(datasourceID)
                .then(res => {
        
                    // Update local vars
                    this.dataFieldNames = res.dataFields;
                    this.dataFieldLengths = res.dataFieldLengths;
                    this.dataFieldTypes = res.dataFieldTypes;

                    // Load first few rows into preview
                    this.currentData = res.dataFiltered.slice(0,5);
                    console.log('xx getCurrDS', res, this.currentData, this.dataFieldNames,
                    this.dataFieldLengths,
                    this.dataFieldTypes)

                    // Add data to new Widget
                    if (this.newWidget) {
                        this.localWidget.datasourceID = datasourceID;
                        this.globalVariableService.applyWidgetFilter(this.localWidget);
                    };

                    // Tell user
                    this.hasClicked = true;
                    this.errorMessage = 'Data retrieved - click row again to continue';

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in table.editor reading widgetGraphs: ' + err);
                });
    
        } else {

            // Update local vars
            let datasourceIndex: number = this.datasources.findIndex(
                ds => ds.id == datasourceID
            );
            if (datasourceIndex < 0) {        
                this.dataFieldNames = this.datasources[datasourceIndex].dataFields;
                this.dataFieldLengths = this.datasources[datasourceIndex].dataFieldLengths;
                this.dataFieldTypes = this.datasources[datasourceIndex].dataFieldTypes;
            };
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

            // ** TABIDS
            // this.localWidget.dashboardTabIDs.push(this.globalVariableService.
            //     currentDashboardInfo.value.currentDashboardTabID
            // );

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