/*
 * Shows form to delete any Dashboard, except the current one
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
        return "" + dashboard.name === search
            || dashboard.name.toLowerCase().indexOf(search) >= 0;
    }
}
class FilterDescription implements ClrDatagridStringFilterInterface<Dashboard> {
    accepts(dashboard: Dashboard, search: string):boolean {
        return "" + dashboard.description === search
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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Closed');
            return;
        };

    }

    dashboards: Dashboard[] = [];
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

        this.globalVariableService.getResource('dashboards')
            .then (res => {
                this.dashboards = res
                    .filter(d => d.state != 'Draft')
                    .filter(d => d.draftID === null)
                    .sort((n1,n2) => {
                        if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                            return 1;
                        };

                        if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                            return -1;
                        };

                        return 0;
                    })
            })
            .catch(err => {
                console.error('Error in Dashboard.bulkDelete reading dashboards: ' + err)
                this.errorMessage = err.slice(0, 100);
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

        this.errorMessage = '';

        // Cant delete CurrentD here -> goto Delete option
        if (id === this.globalVariableService.currentDashboardInfo.value.currentDashboardID) {
            this.errorMessage = 'Current Dashboard must be deleted with Dashboard -> Delete option';
            return;
        };

        // Cannot delete Draft from here
        if (this.dashboards[index].draftID != null) {
            this.errorMessage = 'First discard the Draft for this Dashboard';
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
