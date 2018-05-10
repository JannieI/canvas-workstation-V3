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
import { Datasource }                from './models';

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

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

  	clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formCollaborateTaskAddClosed.emit(action);
    }

    clickSave(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');
        
        id: null,
        taskText
        activityType
        taskStatus
        assignedToUserID
        precedingTaskID
        linkedDashboardID
        taskComments
        startDate
        deadlineDate
        endDate
        durationDays

        editedBy
        editedOn
        createdBy
        createdOn
        
        this.formCollaborateTaskAddClosed.emit(action);
    }


}