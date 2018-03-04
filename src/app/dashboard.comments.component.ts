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
import { DataQualityIssue }           from './models';

@Component({
    selector: 'dashboard-comments',
    templateUrl: './dashboard.comments.component.html',
    styleUrls: ['./dashboard.comments.component.css']
})
export class DashboardCommentsComponent implements OnInit {

    @Output() formDashboardCommentsClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedWidgetID: number;

    canvasDataQuality: DataQualityIssue[] = [];
    headerText: string;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        if (this.selectedWidgetID == -1) {
            this.headerText = 'this Dashboard';
        } else {
            this.headerText = 'selected Widget';
        };

        this.globalVariableService.getDataQualityIssues().then(cC => {
             cC.forEach(i => {
                 if (i.datasourceID == this.selectedWidgetID  ||  this.selectedWidgetID == -1) {
                     this.canvasDataQuality.push(i)
                 };
            });
            console.log('xx comm', cC, this.canvasDataQuality)
        });
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardCommentsClosed.emit(action);
    }
}
