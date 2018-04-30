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
import { DashboardPermission }        from './models';
import { CanvasGroup }                from './models';

@Component({
    selector: 'mypermissions',
    templateUrl: './mypermissions.component.html',
    styleUrls: ['./mypermissions.component.css']
})
export class MyPermissionsComponent implements OnInit {

    @Input() selectedDashboard: Dashboard;
    @Output() formDashboardShareClosed: EventEmitter<string> = new EventEmitter();

    dashboardPermissions: DashboardPermission[];
    groupID: number;
    groupName: string = '';
    groups: CanvasGroup[];
    selectedRow: number = 0;
    userID: string = '';


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasGroups().then( res => {
            this.dashboardPermissions = this.globalVariableService.dashboardPermissions.slice();
            this.groups = res;
        });

    }

    clickClose(action: string) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardShareClosed.emit(action);
    }

    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}
