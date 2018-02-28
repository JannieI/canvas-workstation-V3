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
    selector: 'data-slicers',
    templateUrl: './data.slicers.component.html',
    styleUrls: ['./data.slicers.component.css']
  })
  export class DataSlicersComponent implements OnInit {
    @Input() newWidget: boolean;

    @Output() formDataSlicersClosed: EventEmitter<Widget> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    currentDatasources: Datasource[] = [];
    dataFields: string[] = [];
    dataValues: string[] = [];
    localWidget: Widget;                            // W to modify, copied from selected
    numberToShow: string = 'All';
    selectedDatasourceID: number = -1;
    selectedDatasetID: number = -1;
    selectedField: string = '';
    showNumber: boolean = false;
    showSortFields: boolean = false;
    showSortFieldOrder: boolean = false;
    sortField: string = '';
    sortFieldOrder: string = 'Ascending';

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

            let x: number = 0;
            this.globalVariableService.currentWidgets.forEach(w => {
                if (w.isSelected) {
                    x = w.datasourceID;
                    // this.localWidget = w;
                    // Make a deep copy
                    this.localWidget = Object.assign({}, w);
                }
            });
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
        console.log('xx cl Fld', tempData, this.selectedField);

        // Sort, if so wished
        if (this.sortField != '') {
            if (this.sortField != '') {
                tempData.sort( (obj1,obj2) => {
                    if (obj1[this.sortField] > obj2[this.sortField]) {
                        return 1;
                    };
                    if (obj1[this.sortField] < obj2[this.sortField]) {
                        return -1;
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
        if (this.numberToShow != 'All') {
            tempData = tempData.splice(0, +this.numberToShow);
        }        
    }

    clickDataValue(id: number, index: number){
        // Clicked a Value, now ....
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataValue', '@Start');

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
        this.localWidget.slicerFieldName = 'Origin';
        this.localWidget.slicerSelection = [];
        this.dataFields.forEach(df => 
            this.localWidget.slicerSelection.push( 
                {
                    isSelected: true, fieldValue: df
                })
        );
        let widgetsToRefresh: number = this.localWidget.id;

	  	this.formDataSlicersClosed.emit(this.localWidget);
    }

    clickSortField(sortField: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortField', '@Start');

        this.sortField = sortField;
        this.showSortFields = false;
        console.log('xx sortField', this.sortField)
    }

    clickSortFieldOrder(sortFieldOrder: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortField', '@Start');

        this.sortFieldOrder = sortFieldOrder;
        this.showSortFieldOrder = false;
        console.log('xx sortFieldOrder', this.sortFieldOrder)
    }

    clickShowNumber(numberToShow: string) {
        // Clicked the number of records to show
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortField', '@Start');

        this.numberToShow = numberToShow;
        this.showNumber = false;
        console.log('xx numberToShow', this.numberToShow)
    }
  }
