/*
 * Manage Permissions of the current user
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
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

interface localDashboardPermission extends DashboardPermission {
    dashboardName?: string;
}

@Component({
    selector: 'mypermissions',
    templateUrl: './mypermissions.component.html',
    styleUrls: ['./mypermissions.component.css']
})
export class MyPermissionsComponent implements OnInit {

    @Input() selectedDashboard: Dashboard;
    @Output() formDashboardMyPermissionsClosed: EventEmitter<string> = new EventEmitter();

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

    dashboardPermissions: localDashboardPermission[];
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

        this.globalVariableService.getResource('canvasGroups').then(res => {
            this.groups = res;

            let filteredDashboard: Dashboard[] = [];
            this.dashboardPermissions = this.globalVariableService.dashboardPermissions.slice();

            // Get supplimentary info
            // TODO - do this better with DB
            this.dashboardPermissions.forEach(dP => {
                filteredDashboard = this.globalVariableService.dashboards.filter(d =>
                    d.id == dP.dashboardID
                );
                if (filteredDashboard.length > 0) {
                    dP.dashboardName = filteredDashboard[0].name;
                };

                this.groups.forEach(grp => {
                    if (grp.id == dP.groupID) {
                        dP.groupName = grp.name;
                    };
                });
            });

            // Filter for current user
            this.dashboardPermissions = this.dashboardPermissions.filter(dP =>
                (dP.userID == this.globalVariableService.currentUser.userID)
                ||
                (this.globalVariableService.currentUser.groups
                    .map(x => x.toLowerCase())
                    .indexOf(dP.groupName.toLocaleLowerCase()) > 0)
            );
        });

    }

    clickClose(action: string) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardMyPermissionsClosed.emit(action);
    }

    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }

}
