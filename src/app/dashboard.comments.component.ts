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
import { CanvasComment }              from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';
import { DashboardNewComponent } from './dashboard.new.component';

@Component({
    selector: 'dashboard-comments',
    templateUrl: './dashboard.comments.component.html',
    styleUrls: ['./dashboard.comments.component.css']
})
export class DashboardCommentsComponent implements OnInit {

    @Output() formDashboardCommentsClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedWidgetID: number;

    canvasComments: CanvasComment[] = [];
    headerText: string;
    showTypeDashboard: boolean = false;
    datagridColumns: DatagridColumn[];
    datagridPagination: boolean = false;
    datagridPaginationSize: number = 6;
    indexLastRecord: number;
    commentText: string;
    editLast: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set header
        if (this.selectedWidgetID == -1) {
            this.headerText = 'this Dashboard';
        } else {
            this.headerText = 'the selected Widget';
        };

        // Set the data for the grid
        this.globalVariableService.getCanvasComments().then (ca => {
            this.canvasComments = ca.filter( c =>
                  (c.dashboardID == this.globalVariableService.currentDashboardInfo
                        .value.currentDashboardID
                   &&
                  (c.widgetID == this.selectedWidgetID  ||  this.selectedWidgetID == -1) )
            );
            this.indexLastRecord = this.canvasComments.length - 1;
        });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardCommentsClosed.emit(action);
    }

    clickEditComment(index: number, id: number) {
        // Last row can be Edited, so start process
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEditComment', '@Start');

        this.commentText = this.canvasComments[this.canvasComments.length - 1].comment;
        this.editLast = true;
        
    }

    clickCancel() {
        // Cancel Editing, go back
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.commentText = '';
        this.editLast = false;
        
    }

    clickSave() {
        // Save changes to the last Comment
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Replace text and leave editing
        this.canvasComments[this.canvasComments.length - 1].comment = this.commentText;
        this.commentText = '';
        this.editLast = false;

        
    }
    clickAdd() {
        // Add a new Comment
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Add
        let dt = new Date();
        
        let newComment: CanvasComment =
            {id: 4,
            dashboardID: 4,
            widgetID: 4,
            comment: this.commentText,
            creator: this.globalVariableService.userID,
            createdOn: dt.toString()
        };
    
        this.canvasComments.push(newComment);
        this.commentText = '';
        this.indexLastRecord = this.canvasComments.length - 1;
    
    }
}