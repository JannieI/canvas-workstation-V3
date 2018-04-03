/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Dashboard } from 'app/models';

@Component({
    selector: 'dashboard-rename',
    templateUrl: './dashboard.rename.component.html',
    styleUrls: ['./dashboard.rename.component.css']
})
export class DashboardRenameComponent implements OnInit {

    @Output() formDashboardRenameClosed: EventEmitter<string> = new EventEmitter();

    filterCreatedBy: string;
    filterDatasource: string;
    filteredDashboards: Dashboard[] = [];       // Filtered Ds, shown on form
    filterFavourite: boolean;
    filterField: string;
    filterName: string;
    filterNewName: string;
    filterSharedByMe: boolean;
    filterSharedToMe: boolean;
    filterSharedToGroup: string;
    filterSharedToUser: string;
    filterTag: string;

    constructor(
        // private globalFunctionService: GlobalFunctionService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.filteredDashboards = this.globalVariableService.dashboards.slice();
    }
 
    clickClose(action: string) {
        // Close form, no futher changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardRenameClosed.emit(action);
    }

    clickSearch() {
        // Search Ds according to the filter criteria filled in
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSearch', '@Start');
        
        // Start afresh
        this.filteredDashboards = this.globalVariableService.dashboards.slice();

        if (this.filterCreatedBy != ''  &&  this.filterCreatedBy != undefined) {
            this.filteredDashboards = this.filteredDashboards.filter(d => 
                d.creator == this.filterCreatedBy
            );
        };
        if (this.filterDatasource != ''  &&  this.filterDatasource != undefined) {

            // List of DS ids that contains the search string
            let dsIDs: number[] = [];
            this.globalVariableService.datasources.forEach(ds => {
                if (ds.name.toLowerCase().indexOf(
                    this.filterDatasource.toLowerCase()) >= 0) {
                    dsIDs.push(ds.id);
                };
            });

            // List of W that contains above DS ids -> [Dids]
            let dIDs: number[] = [];
            this.globalVariableService.widgets.forEach(w => {
                if (dsIDs.indexOf(w.datasourceID) >=0 ) {
                    dIDs.push(w.dashboardID);
                };
            });

            // Filter D that are in above list of dIDs
            this.filteredDashboards = this.globalVariableService.dashboards.filter(d => 
                dIDs.indexOf(d.id) >= 0
            );
            
        };

        if (this.filterFavourite  &&  this.filterFavourite != undefined) {
            this.filteredDashboards = this.filteredDashboards.filter(d => 
                this.globalVariableService.currentUser.favouriteDashboards
                    .indexOf(d.id) >= 0
            );
        };
        if (this.filterField != ''  &&  this.filterField != undefined) {
            
            // List of DS ids that contains the field
            let dsIDs: number[] = [];
            this.globalVariableService.datasources.forEach(ds => {
                if (ds.dataFields.map(x => x.toLowerCase()).indexOf(
                    this.filterField.toLowerCase()) >= 0) {
                    dsIDs.push(ds.id);
                };
            });

            // List of W that contains above DS ids -> [Dids]
            let dIDs: number[] = [];
            this.globalVariableService.widgets.forEach(w => {
                if (dsIDs.indexOf(w.datasourceID) >=0 ) {
                    dIDs.push(w.dashboardID);
                };
            });

            // Filter D that are in above list of dIDs
            this.filteredDashboards = this.globalVariableService.dashboards.filter(d => 
                dIDs.indexOf(d.id) >= 0
            );                
        };
        if (this.filterName != ''  &&  this.filterName!= undefined) {
            this.filteredDashboards = this.filteredDashboards.filter(d => {
                if (
                    (d.name.toLowerCase().indexOf(this.filterName.toLowerCase()) >= 0)
                    ||
                    (d.description.toLowerCase().indexOf(this.filterName.toLowerCase()) >= 0)
                ) { 
                    return d;
                }
            });
        };
        if (this.filterSharedByMe) {
            this.filteredDashboards = this.filteredDashboards.filter(d => {

            });
        };
        if (this.filterSharedToMe) {
            this.filteredDashboards = this.filteredDashboards.filter(d => {

            });
        };
        if (this.filterSharedToGroup != ''  &&  this.filterSharedToGroup != undefined) {
            this.filteredDashboards = this.filteredDashboards.filter(d => {

            });
        };
        if (this.filterSharedToUser != ''  &&  this.filterSharedToUser !=  undefined) {
            this.filteredDashboards = this.filteredDashboards.filter(d => {

            });
        };
        if (this.filterTag != '' &&  this.filterTag != undefined) {
            this.filteredDashboards = this.filteredDashboards.filter(d => {

            });
        };
    }

    clickRename() {
        // Search Ds according to the filter criteria filled in
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSearch', '@Start');

        // Validation
        if (this.filterNewName == '') {
            return;
        };
    }

}
