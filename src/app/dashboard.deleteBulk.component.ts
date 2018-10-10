/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

interface ClrDatagridStringFilterInterface<T> {
    accepts(item: T, search: string): boolean;
}

class FilterName implements ClrDatagridStringFilterInterface<Dashboard> {
    accepts(dashboard: Dashboard, search: string):boolean {
        return "" + dashboard.name == search
            || dashboard.name.toLowerCase().indexOf(search) >= 0;
    }
}
class FilterDescription implements ClrDatagridStringFilterInterface<Dashboard> {
    accepts(dashboard: Dashboard, search: string):boolean {
        return "" + dashboard.description == search
            || dashboard.description.toLowerCase().indexOf(search) >= 0;
    }
}
@Component({
    selector: 'dashboard-bulk-delete',
    templateUrl: './dashboard.deleteBulk.component.html',
    styleUrls: ['./dashboard.deleteBulk.component.css']
})
export class DashboardDeleteBulkComponent implements OnInit {

    @Output() formDashboardDeleteBulkClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Closed');
            return;
        };

    }

    dashboards: Dashboard[];
    errorMessage: string = '';
    filterName = new FilterName();
    filterDescription = new FilterDescription();
    selectedRow: number = 0;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards
            .filter(d => d.state != 'Draft')
            .filter(d => d.draftID == null)
            .slice()
            .sort((n1,n2) => {
                if (n1.name > n2.name) {
                    return 1;
                };

                if (n1.name < n2.name) {
                    return -1;
                };

                return 0;
            });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDeleteBulkClosed.emit(action);
    }

    dblclickDelete(index: number, id: number) {
        // Delete selected D and all related records, if user has access
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        // Determine access
        if (!this.globalVariableService.dashboardPermissionCheck(id, 'CanDelete')) {
            this.errorMessage = 'No access';
            return;
        };

        // TODO - remove later on!!
        if (
            (id < 9  || id == 40  ||  id == 41)
            &&
            this.globalVariableService.currentDashboardInfo.value.currentDashboardState == 'Complete'
            ) {
            alert('Dont delete Complete version of ids 1-8, 40, 41 while testing !')
            return;
        };

        this.errorMessage = '';

        // Cant delete CurrentD here -> goto Delete option
        if (id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID) {
            this.errorMessage = 'Current Dashboard must be deleted with Dashboard -> Delete option';
            return;
        };

        // Delete D, as all related Entities
        this.dashboards = this.dashboards.filter(d => d.id != id);
        this.globalVariableService.deleteDashboardInfo(id);

    }

    clickRow(index: number) {
        // Show selected record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}
