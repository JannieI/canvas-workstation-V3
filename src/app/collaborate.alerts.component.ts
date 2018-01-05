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
import { Dashboard }                  from './models';
import { CanvasAlert }                from './models';

@Component({
    selector: 'collaborate-alerts',
    templateUrl: './collaborate.alerts.component.html',
    styleUrls: ['./collaborate.alerts.component.css']
})
export class CollaborateAlertsComponent implements OnInit {

    @Output() formCollaborateAlertsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    canvasAlerts: CanvasAlert[];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.canvasAlerts = this.globalVariableService.canvasAlerts;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formCollaborateAlertsClosed.emit(action);
    }
}
