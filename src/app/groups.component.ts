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
import { CanvasUser }                 from './models';
import { CanvasGroup }                from './models';


@Component({
    selector: 'groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    @Output() formDashboardGroupsClosed: EventEmitter<string> = new EventEmitter();

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

    canvasGroups: CanvasGroup[];
    selectedRow: number = 0;
    canvasUsers: CanvasUser[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.selectedRow = 0;
        this.canvasGroups = this.globalVariableService.canvasGroups.filter(g =>
            g.name != ''
        ).sort((n1,n2) => {
            if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                return 1;
            };
        
            if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                return -1;
            };
        
            return 0;
        });

        if (this.canvasGroups.length > 0) {
            this.canvasUsers = this.globalVariableService.canvasUsers.filter(u => 
                u.groups.map(x => x.toLowerCase()).indexOf(this.canvasGroups[0].name.toLowerCase()) >= 0
            )
        } else {
            this.canvasUsers = [];
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

        this.selectedRow = index;
        this.canvasGroups.forEach(g => {
            if (g.id == groupID) {
                this.canvasUsers = this.globalVariableService.canvasUsers.filter(u => 
                    u.groups.map(x => x.toLowerCase()).indexOf(g.name.toLowerCase()) > 0
                )
            };
        })
     
    }

}

