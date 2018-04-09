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

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'dashboard-bulk-delete',
    templateUrl: './dashboard.deleteBulk.component.html',
    styleUrls: ['./dashboard.deleteBulk.component.css']
})
export class DashboardDeleteBulkComponent implements OnInit {

    @Output() formDashboardDeleteClosed: EventEmitter<string> = new EventEmitter();

    dashboards: Dashboard[];
    errorMessage: string = '';
    selectedRow: number = 0;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDeleteClosed.emit(action);
    }

    clickDelete(index: number, id: number) {
        // Delete selected D and all related records, if user has access
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Determine access
        if (!this.globalVariableService.dashboardPermissionCheck(id)) {
            this.errorMessage = 'No access';
            return;
        };

        this.errorMessage = '';

        // Delete D, as all related Entities
        this.dashboards = this.dashboards.filter(d => d.id != id);
        this.globalVariableService.deleteWidget(id);

    }
 
    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}
