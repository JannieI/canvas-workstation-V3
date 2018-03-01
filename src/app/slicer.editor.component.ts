// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { Datasource }                 from './models';
import { Widget }                     from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'slicer-editor',
    templateUrl: './slicer.editor.component.html',
    styleUrls: ['./slicer.editor.component.css']
  })
  export class SlicerEditorComponent implements OnInit {
    @Input() newWidget: boolean;
    @Input() selectedWidget: Widget;

    @Output() formDataSlicersClosed: EventEmitter<Widget> = new EventEmitter();

    currentDatasources: Datasource[] = [];
    dataFields: string[] = [];
    dataValues: string[] = [];
    containerHasTitle: boolean = true;
    localWidget: Widget;                            // W to modify, copied from selected
    selectedDatasourceID: number = -1;
    selectedDatasetID: number = -1;
    selectedField: string = '';
    showNumber: boolean = false;
    showSortFields: boolean = false;
    showSortFieldOrder: boolean = false;
    slicerNumberToShow: string = 'All';
    slicerSortField: string = '';
    slicerSortFieldOrder: string = 'Ascending';

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.currentDatasources = this.globalVariableService.currentDatasources;
        this.dataFields = [];
        this.dataValues = [];

        if (this.newWidget) {

            // Create new W
            this.localWidget = this.globalVariableService.widgetTemplate;
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Slicer';
        } else {

            this.localWidget = Object.assign({}, this.selectedWidget);
            this.dataFields = this.localWidget.dataFields;
            this.containerHasTitle = this.localWidget.containerHasTitle;

            // Get fields in this DS
            this.currentDatasources.forEach(ds => {
                if (ds.id == this.localWidget.datasourceID) {
                    this.dataFields = ds.dataFields;        
                };
            })

            // Get the data values
            this.localWidget.slicerSelection.forEach( sl => 
                this.dataValues.push(sl.fieldValue)
            );

            
            // Set the selected items
            this.selectedDatasourceID = this.localWidget.datasourceID;
            this.selectedDatasetID = this.localWidget.datasetID;
            this.selectedField = this.localWidget.slicerFieldName;

            this.slicerNumberToShow = this.localWidget.slicerNumberToShow;
            this.slicerSortField = this.localWidget.slicerSortField;
            this.slicerSortFieldOrder = this.localWidget.slicerSortFieldOrder;
            
            this.changeValues();
        };

      }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

      }

    clickDatasource(id: number, index: number){
        // Clicked a DS, now load the Fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // Remember selected on
        this.selectedDatasourceID = id;

        // Get fields in this DS
        this.dataFields = this.currentDatasources[index].dataFields;

    }

    clickDataFields(id: number, index: number){
        // Clicked a Field, now load the Values
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataFields', '@Start');

        // Set field, and refresh
        this.selectedField = this.dataFields[index];
        this.changeValues();
    }

    changeValues() {
        // Refresh the list of values, with all the criteria
        this.globalFunctionService.printToConsole(this.constructor.name,'changeValues', '@Start');

        // Do we have a field
        if (this.selectedField == '') {
            return;
        }

        // Get ID of latest dSet for the selected DS
        let dSetIDs: number[] = [];
        this.globalVariableService.currentDatasets.forEach(ds => {
            if (ds.datasourceID == this.selectedDatasourceID) {
                dSetIDs.push(ds.id);
            };
        });
        this.selectedDatasetID = Math.max(...dSetIDs);

        // More into array
        this.dataValues = [];
        let tempData: any[] = this.globalVariableService.currentDatasets.filter(ds =>
            ds.id == this.selectedDatasetID)[0].dataRaw //['Origin'];

        // Sort, if so wished
        if (this.slicerSortField != '') {
            if (this.slicerSortField != '') {
                tempData.sort( (obj1,obj2) => {
                    if (obj1[this.slicerSortField] > obj2[this.slicerSortField]) {
                        if (this.slicerSortFieldOrder == 'Ascending') {
                            return 1;
                        } else {
                            return -1;
                        };
                    };
                    if (obj1[this.slicerSortField] < obj2[this.slicerSortField]) {
                        if (this.slicerSortFieldOrder == 'Ascending') {
                            return -1;
                        } else {
                            return 1;
                        };
                    };
                    return 0;
                });
            };
        };

        // Get a distinct list
        // TODO - this could surely be done better
        tempData.forEach(t => {
            if (this.dataValues.indexOf(t[this.selectedField]) < 0) {
                this.dataValues.push(t[this.selectedField]);
            };
        });

        // Reduce if needed
        if (this.slicerNumberToShow != 'All'  &&  this.slicerNumberToShow != null) {
            this.dataValues = this.dataValues.splice(0, +this.slicerNumberToShow);
        }
    }

    clickDataValue(id: number, index: number){
        // Clicked a Value, now ....
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataValue', '@Start');

    }

    clickSortField(sortField: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortField', '@Start');

        this.slicerSortField = sortField;
        this.showSortFields = false;
        this.changeValues();

    }

    clickSortFieldOrder(sortFieldOrder: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortField', '@Start');

        this.slicerSortFieldOrder = sortFieldOrder;
        this.showSortFieldOrder = false;
        this.changeValues();
    }

    clickShowNumber(numberToShow: string) {
        // Clicked the number of records to show
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortField', '@Start');

        this.slicerNumberToShow = numberToShow;
        this.showNumber = false;
        this.changeValues();
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	this.formDataSlicersClosed.emit(null);
    }

    clickSave() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        if (this.newWidget) {

            // TODO - improve this when using a DB!
            let newID: number = 1;
            let ws: number[]=[];
            for (var i = 0; i < this.globalVariableService.widgets.length; i++) {
                ws.push(this.globalVariableService.widgets[i].id)
            };
            if (ws.length > 0) {
                newID = Math.max(...ws) + 1;
            };
            this.localWidget.id = newID;
            this.globalVariableService.widgets.push(this.localWidget);
            this.globalVariableService.currentWidgets.push(this.localWidget);
            this.localWidget.datasourceID = this.selectedDatasourceID;
            this.localWidget.datasetID = this.selectedDatasetID;

        } else {
            // Replace the W
            this.globalVariableService.widgetReplace(this.localWidget);
        };

        // Set Slicer related data
        this.localWidget.containerHasTitle = this.containerHasTitle;
        this.localWidget.slicerNumberToShow = this.slicerNumberToShow;
        this.localWidget.slicerSortField = this.slicerSortField;
        this.localWidget.slicerSortFieldOrder = this.slicerSortFieldOrder;
        this.localWidget.slicerFieldName = this.selectedField;
        this.localWidget.slicerSelection = [];
        this.dataValues.forEach(df =>
            this.localWidget.slicerSelection.push(
                {
                    isSelected: true, fieldValue: df
                })
        );
        let widgetsToRefresh: number = this.localWidget.id;

	  	this.formDataSlicersClosed.emit(this.localWidget);
    }

}
