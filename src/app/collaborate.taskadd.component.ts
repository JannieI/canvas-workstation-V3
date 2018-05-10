// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { CanvasTask }                 from './models';
import { CanvasUser }                 from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'collaborate-taskadd',
    templateUrl: './collaborate.taskadd.component.html',
    styleUrls: ['./collaborate.taskadd.component.css']
})
export class CollaborateTaskAddComponent implements OnInit {

    @Output() formCollaborateTaskAddClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    canvasTasks: CanvasTask[] = [];
    dashboardNames: string[] = [];
    selectedTaskText: string = '';
    selectedActivityType: string = '';
    selectedTaskStatus: string = '';
    selectedAssignedToUserID: number;
    selectedPrecedingTaskID: number;
    selectedLinkedDashboardID: number;
    selectedTaskComments: string = '';
    selectedStartDate: string = '';
    selectedDeadlineDate: string = '';
    selectedEndDate: string = '';
    selectedDurationDays: string = '';
    taskIDs: number[] = [];
    userNames: string[] = [];
    users: CanvasUser[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasTasks().then (ca => {

            // Set the data for the grid
            this.canvasTasks = ca;

            // Get User list
            this.globalVariableService.getCanvasUsers().then(usr => {
                this.users = usr;
                usr.forEach(u => {
                    this.userNames.push(u.userID);
                });
                this.userNames = ['', ...this.userNames];

                // Add 'dead' users from Tasks - in case not in Users any longer
                let isFound: boolean = false;
                this.canvasTasks.forEach(tsk => {

                    // Add Task text while we here
                    // TODO - make proper with Text, etc - maybe add a short Task Subject
                    this.taskIDs.push(tsk.id);
                    
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
    
        });

    }

  	clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formCollaborateTaskAddClosed.emit(action);
    }

    clickSave(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');
        
       console.warn('xx sel', 
        this.selectedTaskText,
        this.selectedActivityType,
        this.selectedTaskStatus,
        this.selectedAssignedToUserID,
        this.selectedPrecedingTaskID,
        this.selectedLinkedDashboardID,
        this.selectedTaskComments,
        this.selectedStartDate,
        this.selectedDeadlineDate,
        this.selectedEndDate,
        this.selectedDurationDays)

       

        // id: null,
        // taskText
        // activityType
        // taskStatus
        // assignedToUserID
        // precedingTaskID
        // linkedDashboardID
        // taskComments
        // startDate
        // deadlineDate
        // endDate
        // durationDays

        // editedBy
        // editedOn
        // createdBy
        // createdOn
        
        this.formCollaborateTaskAddClosed.emit(action);
    }


}