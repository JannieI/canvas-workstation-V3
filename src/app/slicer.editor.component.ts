// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';

// Our models
import { CSScolor }                   from './models';
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
            this.clickSave();
            return;
        };

    }

    colors: CSScolor[];
    currentDatasources: Datasource[] = [];
    dataFields: string[] = [];
    dataFieldTypes: string[] = [];
    dataValues: {isSelected: boolean; fieldValue: string;}[] = [];
    dataBins: {isSelected: boolean; name: string; fromValue: number; toValue: number}[] = [];
    containerHasContextMenus: boolean = true;
    containerHasTitle: boolean = true;
    containerslicerAddRest: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
    oldWidget: Widget = null;                       // W at start
    selectedColor: string = 'Gray';
    selectedDatasourceID: number = -1;
    selectedDatasetID: number = -1;
    selectedField: string = '';
    selectedFieldType: string = '';
    showContainerslicerAddRest: boolean = false;
    showMultipleBins: boolean = false;
    showNumber: boolean = false;
    showSlicerType: boolean = false;
    showSortFields: boolean = false;
    showSortFieldOrder: boolean = false;
    slicerColor: string = 'gray';
    slicerNumberToShow: string = 'All';
    slicerSortField: string = '';
    slicerSortFieldOrder: string = 'Ascending';
    slicerType: string = 'List';

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.currentDatasources = this.globalVariableService.currentDatasources.slice();
        this.dataFields = [];
        this.dataFieldTypes = [];
        this.dataValues = [];
        this.dataBins = [];
        this.slicerType = 'List';

        // Get setup info
        this.colors = this.globalVariableService.backgroundcolors.slice();
                
        // TODO - fix hardcoding
        // Get Bin values

        if (this.newWidget) {

            // Create new W
            // this.localWidget = this.globalVariableService.widgetTemplate;
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Slicer';
        } else {

            // Deep copy original W
            this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Deep copy Local W
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            this.dataFields = this.localWidget.dataFields;
            this.dataFieldTypes = this.localWidget.dataFieldTypes;
            this.containerHasContextMenus = this.localWidget.containerHasContextMenus;
            this.containerHasTitle = this.localWidget.containerHasTitle;
            this.containerslicerAddRest = this.localWidget.slicerAddRest;

            // Get fields in this DS
            this.currentDatasources.forEach(ds => {
                if (ds.id == this.localWidget.datasourceID) {
                    this.dataFields = ds.dataFields;
                };
            });

            // Get field Typess in this DS
            this.currentDatasources.forEach(ds => {
                if (ds.id == this.localWidget.datasourceID) {
                    this.dataFieldTypes = ds.dataFieldTypes;
                };
            });

            // Get the data values
            this.localWidget.slicerSelection.forEach( sl =>
                this.dataValues.push({
                    isSelected: sl.isSelected,
                    fieldValue: sl.fieldValue}
                    )
            );

            // Get the data Bins
            this.localWidget.slicerBins.forEach( sl =>
                this.dataBins.push({
                    isSelected: sl.isSelected,
                    name: sl.name,
                    fromValue: sl.fromValue,
                    toValue: sl.toValue}
                    )
            );

            // Set the selected items
            this.selectedColor = this.localWidget.slicerColor;
            this.selectedDatasourceID = this.localWidget.datasourceID;
            this.selectedDatasetID = this.localWidget.datasetID;
            this.selectedField = this.localWidget.slicerFieldName;
            this.slicerColor = this.localWidget.slicerColor;
            this.slicerType = this.localWidget.slicerType,
            this.slicerNumberToShow = this.localWidget.slicerNumberToShow;
            this.slicerSortField = this.localWidget.slicerSortField;
            this.slicerSortFieldOrder = this.localWidget.slicerSortFieldOrder;
            if (this.slicerType == 'List') {
                this.showContainerslicerAddRest = true;
                this.showMultipleBins = false;
            } else {
                this.showContainerslicerAddRest = false;
                this.showMultipleBins = true;
            };
            this.changeValues();
        };

      }

    ngAfterViewInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

      }

    clickDatasource(id: number, index: number){
        // Clicked a DS, now load the Fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // Remember selected on
        this.selectedDatasourceID = id;

        // Get fields in this DS
        this.dataFields = this.currentDatasources[index].dataFields;
        this.dataFieldTypes = this.currentDatasources[index].dataFieldTypes;

    }

    clickDataFields(id: number, index: number){
        // Clicked a Field, now load the Values
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataFields', '@Start');

        // Set field, and refresh
        this.selectedField = this.dataFields[index];
        this.selectedFieldType = this.dataFieldTypes[index];

        // Show type(s) of Slicer based on data type
        if (this.selectedFieldType == 'number') {
            this.showMultipleBins = true;

        } else {
            this.slicerType = 'List';
            this.showMultipleBins = false;
        };
        if (this.slicerType == 'List') {
            this.showContainerslicerAddRest = true;
        } else {
            this.showContainerslicerAddRest = false
        };

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

        // Move into array
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
        let fieldValues: number[] = [];
        tempData.forEach(t => {
            if (this.dataValues.findIndex(dt => dt.fieldValue == t[this.selectedField]) < 0) {
                this.dataValues.push({
                    isSelected: true,
                    fieldValue: t[this.selectedField]
                });

                if (this.showMultipleBins) {
                    fieldValues.push(t[this.selectedField]);
                };
            };
        });

        // Reduce if needed
        if (this.slicerNumberToShow != 'All'  &&  this.slicerNumberToShow != null) {
            this.dataValues = this.dataValues.splice(0, +this.slicerNumberToShow);
        }

        // Determine 3 bins
        if (this.showMultipleBins) {
        
            let maxValueBinLarge: number = Math.max(...fieldValues);
            let minValueBinSmall: number = Math.round( (Math.min(...fieldValues) - 0.01) * 100) / 100;
            if (maxValueBinLarge == minValueBinSmall) {
                maxValueBinLarge = minValueBinSmall + 1;
            };
            let gap: number = (maxValueBinLarge - minValueBinSmall) / 3;
            let maxValueBinMedium: number = Math.round(  
                ( minValueBinSmall + ( gap * 2 ) ) * 100) / 100;
            let maxValueBinSmall: number = Math.round( 
                ( minValueBinSmall + gap) * 100) / 100;

            let minValueBinMedium: number = maxValueBinSmall;
            let minValueBinLarge: number = maxValueBinMedium;

            this.dataBins = [];
            // TODO - consider case where initial data is only 1 or 2 values
            this.dataBins.push({
                isSelected: true, name: 'Small', fromValue: minValueBinSmall, toValue: maxValueBinSmall}
            );
            this.dataBins.push({
                isSelected: true, name: 'Medium', fromValue: minValueBinMedium, toValue: maxValueBinMedium}
            );
            this.dataBins.push({
                isSelected: true, name: 'Large', fromValue: minValueBinLarge, toValue: maxValueBinLarge}
            );
        };
    }
  
    clickDataValue(id: number, index: number, ev: any){
        // Clicked a Value, now ....
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataValue', '@Start');

        this.dataValues[index]['isSelected'] = ev.target.checked;
    }

    clickDataBins(id: number, index: number, ev: any){
        // Clicked a Bin, now ....
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataBins', '@Start');

        if (this.slicerType == 'List') {
            this.showContainerslicerAddRest = true;
        } else {
            this.showContainerslicerAddRest = false
        };

        this.dataBins[index]['isSelected'] = ev.target.checked;

    }

    clickSortField(sortField: string) {
        // Sort the fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortField', '@Start');

        this.slicerSortField = sortField;
        this.showSortFields = false;
        this.changeValues();

    }

    clickSortFieldOrder(sortFieldOrder: string) {
        // Sort the fields by Asc/Desc
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSortFieldOrder', '@Start');

        this.slicerSortFieldOrder = sortFieldOrder;
        this.showSortFieldOrder = false;
        this.changeValues();
    }

    clickSlicerType(slicerType: string) {
        // Determine type of Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicerType', '@Start');

        this.slicerType = slicerType;
        this.showSlicerType = false;
        this.changeValues();
    }

    clickShowNumber(numberToShow: string) {
        // Clicked the number of records to show
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowNumber', '@Start');

        this.slicerNumberToShow = numberToShow;
        this.showNumber = false;
        this.changeValues();
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	this.formDataSlicersClosed.emit(null);
    }

    clickSave() {
        // Save the data, and close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Set Slicer related data
        this.localWidget.containerHasContextMenus = this.containerHasContextMenus;
        this.localWidget.containerHasTitle = this.containerHasTitle;
        this.localWidget.slicerAddRest = this.containerslicerAddRest;
        this.localWidget.slicerBins = [];
        this.localWidget.slicerColor = this.selectedColor;
        this.localWidget.slicerFieldName = this.selectedField;
        this.localWidget.slicerNumberToShow = this.slicerNumberToShow;
        this.localWidget.slicerSelection = [];
        this.localWidget.slicerSortField = this.slicerSortField;
        this.localWidget.slicerSortFieldOrder = this.slicerSortFieldOrder;
        this.localWidget.titleText = this.selectedField;
        this.localWidget.slicerType = this.slicerType;

        // Store selected items
        this.dataValues.forEach(df => {
            if (df.isSelected) {
                this.localWidget.slicerSelection.push(
                    {
                        isSelected: df.isSelected, fieldValue: df.fieldValue
                    })
            };
        });

        // Store bins
        this.dataBins.forEach(bn => {
            if (bn.isSelected) {
                this.localWidget.slicerBins.push(
                    {
                        isSelected: bn.isSelected,
                        name: bn.name, 
                        fromValue: bn.fromValue, 
                        toValue: bn.toValue
                    })
            };
        });

        // Must slicer when not All were selected
        // TODO - fix this
        if (this.localWidget.slicerNumberToShow != 'All') {
            this.globalVariableService.currentDatasets.forEach(cd => {
                if (cd.id == this.localWidget.datasetID) {
                    console.warn('xx len before', cd.data.length)
                    let temp = this.globalVariableService.filterSlicer(cd);
                    // console.warn('xx newDataset', newDataset)
                    console.warn('xx len later', cd.data.length, temp.data.length)
                };
            });

            // Refresh Ws that are related to Sl
            this.globalVariableService.currentWidgets.forEach(w => {
                if (w.datasourceID == this.localWidget.datasourceID  
                    &&  
                    w.datasetID == this.localWidget.datasetID  
                    && w.widgetType != 'Slicer') {
                    console.warn('xx Sl-Edt flt', w.id, w.widgetType, w.containerWidth)
                    this.globalVariableService.changedWidget.next(w);
                }
            });
        };

        if (this.newWidget) {

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
            this.localWidget.datasourceID = this.selectedDatasourceID;
            this.localWidget.datasetID = this.selectedDatasetID;

            // this.globalVariableService.widgets.push(this.localWidget);
            // this.globalVariableService.currentWidgets.push(this.localWidget);
            this.globalVariableService.addWidget(this.localWidget).then(res => {
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
                        message: 'Slicer Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                // Return to main menu
                this.formDataSlicersClosed.emit(this.localWidget);

            });

        } else {
            // Replace the W
            // this.globalVariableService.widgetReplace(this.localWidget);
 
            // Update global W and DB
            this.globalVariableService.saveWidget(this.localWidget).then(res => {

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
                        message: 'Slicer Saved',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formDataSlicersClosed.emit(this.localWidget);
                
            });
            
        };

        // // Tell user
        // this.globalVariableService.showStatusBarMessage(
        //     {
        //         message: 'Slicer Saved',
        //         uiArea: 'StatusBar',
        //         classfication: 'Info',
        //         timeout: 3000,
        //         defaultMessage: ''
        //     }
        // );

	  	// this.formDataSlicersClosed.emit(this.localWidget);
    }

    clickSelectAll(ev: any){
        // Select/UnSelect all data values
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectAll', '@Start');

        this.dataValues.forEach(dv => {
            if (ev.target.checked) {
                dv['isSelected'] = true;
            } else {
                dv['isSelected'] = false;

            };
        });
    }

}
