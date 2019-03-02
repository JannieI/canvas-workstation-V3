/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasTask }                 from './models';
import { CanvasUser }                 from './models';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

@Component({
    selector: 'collaborate-tasks',
    templateUrl: './collaborate.tasks.component.html',
    styleUrls: ['./collaborate.tasks.component.css']
})
export class CollaborateTasksComponent implements OnInit {

    @Output() formCollaborateTasksClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('widgetDOM') widgetDOM: ElementRef;

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

    canvasTasks: CanvasTask[] = [];
    canvasTasksOrignal: CanvasTask[] = [];
    dashboardNames: string[] = [];
    selectedDashboard: string = '';
    selectedDetailRow: number = 0;
    selectedRow: number = 0;
    selectedStatus: string = '';
    selectedTaskText: string = '';
    selectedUser: string = '';
    userNames: string[] = [];
    users: CanvasUser[] = [];

    displayGantt: boolean = true;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('canvasTasks')
            .then (ca => {

                // Set the data for the grid
                this.canvasTasks = ca;
                this.canvasTasksOrignal = ca;

                // Get User list
                this.globalVariableService.getResource('canvasUsers').then(usr => {
                    this.users = usr;
                    usr.forEach(u => {
                        this.userNames.push(u.userID);
                    });
                    this.userNames = ['', ...this.userNames];

                    // Add 'dead' users from Tasks - in case not in Users any longer
                    let isFound: boolean = false;
                    this.canvasTasks.forEach(tsk => {
                        isFound = false;
                        if (tsk.assignedToUserID != ''  &&  tsk.assignedToUserID != null) {
                            this.userNames.forEach(usn => {
                                if (usn.toLowerCase() == tsk.assignedToUserID.toLowerCase()) {
                                    isFound = true;
                                };
                            });
                            if (!isFound) {
                                this.userNames.push(tsk.assignedToUserID);
                            };
                        };
                    });

                    // Get Dashboard list
                    this.globalVariableService.dashboards.forEach(d => {
                        this.dashboardNames.push(d.name);
                    });
                    this.dashboardNames = ['', ...this.dashboardNames];
                });

            })
            .catch(err => console.log('Error getting tasks: ' + err));
            

        this.clickGantt()
    }

    clickGantt() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGantt', '@Start');

        let definition = this.globalVariableService.vlTemplate;

        definition['data'] = {
            "values": [
                {"task": "A","start": 1, "end": 3},
                {"task": "B","start": 3, "end": 8},
                {"task": "C","start": 8, "end": 10}
            ]
        };
        definition['mark']['type'] ='bar';
        definition['encoding'] = {
            "y": {"field": "task", "type": "ordinal"},
            "x": {"field": "start", "type": "quantitative"},
            "x2": {"field": "end", "type": "quantitative"}
        };

        console.warn('xx this.widgetDOM', this.widgetDOM)
        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .initialize(this.widgetDOM.nativeElement)
            .hover()
            .width(400)
            .height(200)
            .run()
            .finalize();

    }

    clickRow(index: number, id: number){
        // Heighlight the clicked High Level row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
    }

    clickDetailRow(index: number, id: number){
        // Heighlight the clicked Detail row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDetailRow', '@Start');

        this.selectedDetailRow = index;
    }

    clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateTasksClosed.emit(action);
    }

    clickFilter() {
        // Filter results
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilter', '@Start');
        console.warn('xx sel', this.selectedUser, this.selectedDashboard, this.selectedStatus)

        // Reset
        this.canvasTasks = this.canvasTasksOrignal;

        // Filter down
        // TODO - maybe this can be done better.  Also, still todo the detail one ...
        //        but only after feedback on how to make it more useful
        if (this.selectedUser != '') {
            this.canvasTasks = this.canvasTasks.filter(
                tsk => tsk.assignedToUserID == this.selectedUser
            );
        };
        if (this.selectedStatus != '') {
            this.canvasTasks = this.canvasTasks.filter(
                tsk => tsk.taskStatus.toLowerCase() == this.selectedStatus.toLowerCase()
            );
        };
        if (this.selectedTaskText != '') {
            this.canvasTasks = this.canvasTasks.filter(
                tsk => tsk.taskText.toLowerCase().includes(this.selectedTaskText.toLowerCase())
            );
        };

        // TODO - make this better with a DB
        if (this.selectedDashboard != '') {
            let dashboardIndex: number = this.globalVariableService.dashboards.findIndex(
                d => d.name == this.selectedDashboard
            );
            if (dashboardIndex >= 0) {
                let dashboardID: number = this.globalVariableService.dashboards[
                    dashboardIndex].id;

                this.canvasTasks = this.canvasTasks.filter(
                    tsk => tsk.linkedDashboardID == dashboardID
                );
            };
        };

    }
}
