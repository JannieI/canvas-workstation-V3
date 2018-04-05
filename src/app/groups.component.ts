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
import { CanvasUser }                 from './models';


@Component({
    selector: 'groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    @Output() formDashboardGroupsClosed: EventEmitter<string> = new EventEmitter();

    groups: string[];
    selectedRow: number = 0;
    users: CanvasUser[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getUsers().then(u => {
            this.users = u;
            this.selectedRow = 0;
            if (u.length > 0) {
                this.groups = u[0].groups;
            };
                console.log('xx users', this.users)
        });

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardGroupsClosed.emit(action);
    }

    clickRow(index: number, userID: string) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'setClickedRow', '@Start');
console.log('xx userID', userID)
        this.selectedRow = index;
        this.users.forEach(u => {
            if (u.userID == userID) {
                this.groups = u.groups;
            };
        })
    }

}

