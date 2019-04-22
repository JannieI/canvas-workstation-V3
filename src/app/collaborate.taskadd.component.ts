/*
 * Shows form to add a new Task
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { CanvasTask }                 from './models';
import { CanvasUser }                 from './models';
import { Dashboard }                  from './models';

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

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSave('Saved');
            return;
        };
    }

    canvasTasks: CanvasTask[] = [];
    dashboardNames: string[] = [];
    dashboards: Dashboard[] = [];
    errorMessage: string = '....';
    selectedTaskText: string = '';
    selectedActivityType: string = '';
    selectedTaskStatus: string = '';
    selectedAssignedToUserID: string;
    selectedPrecedingTaskID: number;
    selectedLinkedDashboard: string;
    selectedTaskComments: string = '';
    selectedStartDate: Date = null;
    selectedDeadlineDate: Date = null;
    selectedEndDate: Date = null;
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

        this.globalVariableService.getResource('canvasTasks')
            .then (ca => {

                // Set the data for the grid
                this.canvasTasks = ca;

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

                        // Add Task text while we here
                        // TODO - make proper with Text, etc - maybe add a short Task Subject
                        this.taskIDs.push(tsk.id);

                        isFound = false;
                        if (tsk.assignedToUserID != ''  &&  tsk.assignedToUserID != null) {
                            this.userNames.forEach(usn => {
                                if (usn.toLowerCase() === tsk.assignedToUserID.toLowerCase()) {
                                    isFound = true;
                                };
                            });
                            if (!isFound) {
                                this.userNames.push(tsk.assignedToUserID);
                            };
                        };
                    });

                    this.globalVariableService.getResource('dashboards')
                        .then(res => {
                            this.dashboards = res;
                            this.dashboardNames = [];
                            this.dashboards.forEach(d => {
                                this.dashboardNames.push(d.name + ' (' + d.state + ')');
                            });
                            this.dashboardNames = ['', ...this.dashboardNames];

                            this.dashboardNames = this.dashboardNames.sort( (obj1,obj2) => {
                                if (obj1.toLowerCase() > obj2.toLowerCase()) {
                                    return 1;
                                };
                                if (obj1.toLowerCase() < obj2.toLowerCase()) {
                                    return -1;
                                };
                                return 0;
                            });
                        })
                        .catch(err => {
                            console.error('Error in Collaborate.addTask reading dashboards: ' + err)
                            this.errorMessage = err.slice(0, 100);
                        });
                })
                .catch(err => {
                    console.error('Error in Collaborate.addTask reading canvasUsers: ' + err)
                    this.errorMessage = err.slice(0, 100);
                });
            })
            .catch(err => {
                console.error('Error in Collaborate.addTask reading canvasTasks: ' + err)
                this.errorMessage = err.slice(0, 100);
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

        // Validation
        if (this.selectedActivityType == null  ||  this.selectedActivityType === '') {
            this.errorMessage = 'Please select Activity Type';
            return;
        };

        if (this.selectedTaskStatus == null  ||  this.selectedTaskStatus === '') {
            this.errorMessage = 'Please select Activity Status';
            return;
        };

        if (this.selectedTaskText == null  ||  this.selectedTaskText === '') {
            this.errorMessage = 'Please enter a Description';
            return;
        };

        // Get D name and state from dropdown
        let dashboardName: string = '';
        let dashboardState: string = '';
        if (this.selectedLinkedDashboard != null  &&  this.selectedLinkedDashboard != '') {
            let index: number = this.selectedLinkedDashboard.indexOf(' (');
            if (index >= 0) {
                dashboardName = this.selectedLinkedDashboard.substring(0, index);
                dashboardState = this.selectedLinkedDashboard.substring(
                    index + 2, this.selectedLinkedDashboard.length - 1
                );
            };
        };

        let today = new Date();
        let dashboardID: number = null;
        if (dashboardName != '') {
            let dashboardIndex: number = this.dashboards.findIndex(
                d => d.name === dashboardName
                     &&
                     d.state === dashboardState
            );
            if (dashboardIndex >= 0) {
                dashboardID = this.dashboards[
                    dashboardIndex].id;
            };
        };

        // TODO - add place to add Comments - as this is an array, maybe with initials and date
        let newTask: CanvasTask = {

            id: null,
            taskText: this.selectedTaskText,
            activityType: this.selectedActivityType,
            taskStatus: this.selectedTaskStatus,
            assignedToUserID: this.selectedAssignedToUserID,
            precedingTaskID: this.selectedPrecedingTaskID,
            linkedDashboardID: dashboardID,
            taskComments: [this.selectedTaskComments],
            startDate: this.selectedStartDate,
            deadlineDate: this.selectedDeadlineDate,
            endDate: this.selectedEndDate,
            durationDays: +this.selectedDurationDays,
            editedBy: '',
            editedOn: null,
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: today
        };

        this.globalVariableService.addResource('canvasTasks', newTask)
            .then(res => {
                this.formCollaborateTaskAddClosed.emit(action);
            })
            .catch(err => {
                console.error('Error in Collaborate.addTask adding canvasTasks: ' + err)
                this.errorMessage = err.slice(0, 100);
            });
    }


}