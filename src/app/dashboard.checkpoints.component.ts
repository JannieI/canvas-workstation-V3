/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { dashboard }                  from './models';

@Component({
    selector: 'dashboard-checkpoints',
    templateUrl: './dashboard.checkpoints.component.html',
    styleUrls: ['./dashboard.checkpoints.component.css']
})
export class DashboardCheckpointsComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardCheckpointsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  
    dashboards: dashboard[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formDashboardCheckpointsClosed.emit(action);
    }
}
