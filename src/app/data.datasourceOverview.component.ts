/*
 * Shows an overview of different properties for a selected Datasources.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';
import { Dataset }                    from './models';
import { DataQualityIssue }           from './models';
import { Widget }                     from './models';

interface localDatasources extends Datasource
    {
        isSelected?: boolean;
        hasWidget?: boolean;
    }

@Component({
    selector: 'data-datasourceOverview',
    templateUrl: './data.datasourceOverview.component.html',
    styleUrls:  ['./data.datasourceOverview.component.css']
})
export class DataDatasourceOverviewComponent implements OnInit {

    @Output() formDataDatasourceOverviewClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    // datasources: Datasource[];
    clickedDeleteDS: boolean = false;
    clickedViewDescription: boolean = false;
    clickedViewPreview: boolean = false;
    clickedViewOverview: boolean = false;
    clickedViewFields: boolean = false;
    clickedViewFieldProperties: boolean = false;
    clickedViewFieldProfile: boolean = false;
    clickedViewDataQuality: boolean = false;
    currentData: any = [];
    currentDSids: number[] = [];                    // List of DS-IDs in use
    dataFieldLengths: number[] = [];
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    dataQualityIssues: DataQualityIssue[];
    datasources: localDatasources[];
    errorMessage: string = '';
    fileName: string = '';
    folderName: string = '';
    finalFields: any = [];
    selectedDatasource: Datasource;
    selectedRowID: number = 0;
    selectedRowIndex: number = 0;
    selectedRowName: string = '';
    selectedRowDescription: string = '';
    selectedRowNrWidgetsInUse: number = 0;
    widgets: Widget[] = [];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        let widgetIDs: number[] = [];
        this.globalVariableService.currentWidgets.forEach(w => {
            widgetIDs.push(w.datasourceID);
        });
        this.globalVariableService.currentDatasources.forEach(cds => {
            this.currentDSids.push(cds.id);
        });

        // Load from global variables
        this.globalVariableService.getResource('datasources')
            .then(res => {
                this.datasources = res;

                this.datasources.forEach(ds => {
                    if (widgetIDs.indexOf(ds.id) >= 0) {
                        ds.hasWidget = true;
                    } else {
                        ds.hasWidget = false;
                    };
                    if (this.currentDSids.indexOf(ds.id) >= 0) {
                        ds.isSelected = true;
                    } else {
                        ds.isSelected = false;
                    };
                });

                // Reset
                this.selectedRowID = -1;
                this.selectedRowIndex = -1;
                this.selectedRowName = '';
                this.selectedRowNrWidgetsInUse = 0;

                // Select first row if exists
                if (this.datasources.length > 0) {
                    this.clickSelectedDatasource(0, this.datasources[0].id);
                };

                // TODO - fix!!
                this.finalFields = this.globalVariableService.finalFields.slice();

                // Show first tab
                this.clickDSDescription('gridViewDescription');
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.overview reading datasources: ' + err);
            });
        
        this.globalVariableService.getResource('widgets')
            .then(res => {
                this.widgets = res;
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in dataCombination.append reading widgets: ' + err);
            });
    }

    clickDSDescription(area: string) {
        // Show description area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSDescription', '@Start');

        // Make area visible
        this.clickViewOptions(area);
    }

    clickDSPreview(area: string) {
        // Show preview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSPreview', '@Start');

        // Make area visible
        this.clickViewOptions(area);

        // Reset
        this.errorMessage = '';

        // Get the data, either lives in the dataset, or in a url
        let selectedDataset: Dataset[] = this.globalVariableService.datasets.filter(dS =>
            dS.datasourceID == this.selectedRowID
        );

        // TODO - do better with DB
        let maxDsetIndex: number = selectedDataset.length - 1;
        if (selectedDataset.length > 0) {

            if (selectedDataset[maxDsetIndex].dataRaw != null) {
                this.currentData = selectedDataset[maxDsetIndex].dataRaw;
            } else {

                this.globalVariableService.getData('datasourceID=' + selectedDataset[maxDsetIndex].id.toString())
                    .then(dt => {
                        this.currentData = dt;
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in Datasource.overview reading datasourceID: ' + err);
                    });
            };
        };

    }

    clickViewProperties(area: string) {
        // Show  area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewProperties', '@Start');

        // Make area visible
        this.clickViewOptions(area);

    }

    clickViewProfile(area: string) {
        // Show profile area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewProfile', '@Start');

        // Make area visible
        this.clickViewOptions(area);

    }

    clickViewOverview(area: string) {
        // Show overview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewOverview', '@Start');

        // Make area visible
        this.clickViewOptions(area);

    }

    clickViewFields(area: string) {
        // Show fields area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewFields', '@Start');

        // Make area visible
        this.clickViewOptions(area);

    }

    clickViewDataQuality(area: string) {
        // Show data quality areclickViewOptionsa
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewDataQuality', '@Start');

        // Make area visible
        this.clickViewOptions(area);

    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

        let dsIndex: number = -1;
        dsIndex = this.datasources.findIndex(ds => ds.id == id);
        if (dsIndex != -1) {
            this.selectedDatasource = this.datasources[dsIndex];
            this.dataFieldNames = this.selectedDatasource.dataFields;
            this.selectedRowID = this.datasources[dsIndex].id;
            this.selectedRowName = this.datasources[dsIndex].name;
            this.selectedRowDescription = this.datasources[dsIndex].description;

            this.selectedRowNrWidgetsInUse = this.widgets.filter(w =>
                w.datasourceID == this.datasources[index].id
                &&
                w.dashboardID == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
            ).length;


            // Show first tab
            this.clickDSDescription('gridViewDescription');
        };
        this.errorMessage = '';
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDatasourceOverviewClosed.emit(action);

    }

    clickViewOptions(area: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewOptions', '@Start');

        this.clickedViewDescription = false;
        this.clickedViewPreview = false;
        this.clickedViewOverview = false;
        this.clickedViewFields = false;
        this.clickedViewFieldProperties = false;
        this.clickedViewFieldProfile = false;
        this.clickedViewDataQuality = false;
        if (area == 'gridViewDescription') {
            this.clickedViewDescription = true;
        };
        if (area == 'gridViewPreview') {
            this.clickedViewPreview = true;
        };
        if (area == 'gridViewFieldProperties') {
            this.clickedViewFieldProperties = true;
        };
        if (area == 'gridViewFieldProfile') {
            this.clickedViewFieldProfile = true;
        };
        if (area == 'gridViewOverview') {
            this.clickedViewOverview = true;
        };

        if (area == 'gridViewFields') {
            this.clickedViewFields = true;
        };
        if (area == 'gridViewDataQuality') {
            this.clickedViewDataQuality = true;
        };

    }


}


