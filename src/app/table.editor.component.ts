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
    filterPivotFields: string = '';
    hasClicked: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
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
            // Get DS
            this.currentDatasources = this.globalVariableService.currentDatasources.slice();

            // Create new W
            // this.localWidget = this.globalVariableService.widgetTemplate;
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Table';

        } else {

            // this.localWidget = Object.assign({}, this.selectedWidget);
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // TODO - handle properly and close form
            if (this.localWidget.datasourceID == 0) {
                alert('No Widget was selected, or could not find it in glob vars')
            };

            // Get DS
            this.currentDatasources = this.globalVariableService.currentDatasources
                .filter(ds => ds.id == this.localWidget.datasourceID)

            // TODO - handle properly and close form
            if (this.currentDatasources.length != 1) {
                alert('Datasource not found in global currentDatasources')
            };

            // Get local vars - easier for ngFor
            this.containerHasContextMenus = this.localWidget.containerHasContextMenus;
            this.containerHasTitle = this.localWidget.containerHasTitle;

            // this.dataFieldNames = this.currentDatasources[0].dataFields;
            // this.dataFieldLengths = this.currentDatasources[0].dataFieldLengths;
            // this.dataFieldTypes = this.currentDatasources[0].dataFieldTypes;

            this.showTable = true;
            this.clickDSrow(-1, this.localWidget.datasourceID)
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

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.localWidget.containerHasContextMenus = this.containerHasContextMenus;
        this.localWidget.containerHasTitle = this.containerHasTitle;

        // Set width, depending on ColorField change
        if (this.newWidget) {
            if (this.localWidget.graphColorField != ''
                    &&  this.localWidget.graphColorField != null) {
                this.localWidget.graphWidth = this.localWidget.containerWidth - 130;
            } else {
                this.localWidget.graphWidth = this.localWidget.containerWidth - 60;
            };

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

            this.globalVariableService.addWidget(this.localWidget).then(res => {
                this.localWidget.id = res.id;

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

            });

        } else {
            if (this.selectedWidget.graphColorField != ''
                &&  this.selectedWidget.graphColorField != null) {
                    if (this.localWidget.graphColorField == ''  ||  this.localWidget.graphColorField == null) {
                        this.localWidget.graphWidth = this.selectedWidget.graphWidth + 70;
                    };
            };
            if (this.selectedWidget.graphColorField == ''
                ||  this.selectedWidget.graphColorField == null) {
                    if (this.localWidget.graphColorField != ''
                        &&  this.localWidget.graphColorField != null) {
                        this.localWidget.graphWidth = this.selectedWidget.graphWidth - 70;
                    };
            };

            // Replace the W
            // this.globalVariableService.widgetReplace(this.localWidget);

            // Update global W and DB
            this.globalVariableService.saveWidget(this.localWidget).then(res => {

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

            });

        };

        // // Tell user
        // this.globalVariableService.showStatusBarMessage(
        //     {
        //         message: 'Table Saved',
        //         uiArea: 'StatusBar',
        //         classfication: 'Info',
        //         timeout: 3000,
        //         defaultMessage: ''
        //     }
        // );

        // this.formWidgetEditorClosed.emit(this.localWidget);
    }

    dragstartField(ev) {
        // Event trigger when start Dragging a Field in the list
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
    }

    // dragoverColumn(ev, actionName: string) {
    //     // Event trigger when a field is dragged over Column element
    //     this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColumn', '@Start');

    //     ev.preventDefault();
    // }


    // dropColumn(ev) {
    //     // Event trigger when the dragged Field is dropped the Column field
    //     this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');
    //     ev.preventDefault();

    //     // Show X icon
    //     this.showColumnDeleteIcon = true;

    //     ev.dataTransfer.dropEffect = "move"
    //     // Get the id of the target and add the moved element to the target's DOM

    //     var data = ev.dataTransfer.getData("text");
    //     // ev.target.appendChild(document.getElementById(data));
    //     this.colField = this.draggedField;
    //     this.localWidget.graphXfield = this.draggedField;
    //     this.localWidget.graphXaxisTitle = this.draggedField;

    //     // Fill the default and allowed types of Vega field types
    //     let fieldType:string = this.getFieldType(this.draggedField);
    //     this.graphTypeFieldX = this.allowedGraphTypeField(fieldType);
    //     this.localWidget.graphXtype = this.defaultGraphTypeField(fieldType);
    //     console.log('Field dropped: ', this.colField )

    //     let definition = this.createVegaLiteSpec();
    //     this.showColFieldAdvanced = true;
    //     this.renderGraph(definition);

    // }


    dragenterColumn(ev, actionName: string) {
        // Event trigger when dragged field enters Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverColor = false;
    }

    clickDSrow(index: number, datasourceID: number) {
        // Set the selected datasourceID
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        this.selectedRowIndex = index;

        this.currentDatasources = this.globalVariableService.currentDatasources
            .filter(ds => ds.id == datasourceID)

        // Load local arrays for ngFor
        this.dataFieldNames = this.currentDatasources[0].dataFields;
        this.dataFieldLengths = this.currentDatasources[0].dataFieldLengths;
        this.dataFieldTypes = this.currentDatasources[0].dataFieldTypes;

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

  }