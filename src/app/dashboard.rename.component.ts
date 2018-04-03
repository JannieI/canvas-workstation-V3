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

        // if (this.filterCreatedBy != '') {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        // if (this.filterDatasource != '') {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        // if (this.filterFavourite) {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        // if (this.filterField != '') {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        if (this.filterName != '') {
            this.filteredDashboards = this.filteredDashboards.filter(d => {
                (d.name.indexOf(this.filterName) >= 0)
                ||
                (d.description.toLowerCase().indexOf(this.filterName.toLowerCase()) >= 0)
            });
        }
        // if (this.filterSharedByMe) {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        // if (this.filterSharedToMe) {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        // if (this.filterSharedToGroup != '') {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        // if (this.filterSharedToUser != '') {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
        // if (this.filterTag != '') {
        //     this.filteredDashboards = this.filteredDashboards.filter(d => {

        //     });
        // }
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
