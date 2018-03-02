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
import { CanvasActivity }             from './models';

@Component({
    selector: 'collaborate-activities',
    templateUrl: './collaborate.activities.component.html',
    styleUrls: ['./collaborate.activities.component.css']
})
export class CollaborateActivitiesComponent implements OnInit {

    @Output() formCollaborateActivitiesClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    canvasActivities: CanvasActivity[];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.getCanvasActivities().then(i =>
            this.canvasActivities = i
        );
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formCollaborateActivitiesClosed.emit(action);
    }
}
