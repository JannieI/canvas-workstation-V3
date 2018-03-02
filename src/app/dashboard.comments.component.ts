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
import { CanvasComment }              from './models';

@Component({
    selector: 'dashboard-comments',
    templateUrl: './dashboard.comments.component.html',
    styleUrls: ['./dashboard.comments.component.css']
})
export class DashboardCommentsComponent implements OnInit {

    @Output() formDashboardCommentsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    canvasComments: CanvasComment[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.getCanvasComments().then(i =>
            this.canvasComments = i
        );
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardCommentsClosed.emit(action);
    }
}
