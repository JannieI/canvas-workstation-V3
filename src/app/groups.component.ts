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
import { CanvasGroup }                from './models';


@Component({
    selector: 'groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    @Output() formDashboardGroupsClosed: EventEmitter<string> = new EventEmitter();

    groups: CanvasGroup[];
    selectedRow: number = 0;
    users: CanvasUser[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.selectedRow = 0;
        this.groups = this.globalVariableService.canvasGroups.slice();
        if (this.groups.length > 0) {
            this.users = this.globalVariableService.canvasUsers.filter(u => 
                u.groups.map(x => x.toLowerCase()).indexOf(this.groups[0].name) > 0
            )
        } else {
            this.users = [];
        };

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardGroupsClosed.emit(action);
    }

    clickRow(index: number, groupID: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'setClickedRow', '@Start');
console.log('xx groupID', groupID)
        this.selectedRow = index;
        this.groups.forEach(g => {
            if (g.id == groupID) {
                this.users = this.globalVariableService.canvasUsers.filter(u => 
                    u.groups.map(x => x.toLowerCase()).indexOf(g.name) > 0
                )
            };
        })
     
    }

}

