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
import { DashboardSnapshot }                 from './models';

@Component({
    selector: 'dashboard-snapshots',
    templateUrl: './dashboard.snapshots.component.html',
    styleUrls: ['./dashboard.snapshots.component.css']
})
export class DashboardSnapshotsComponent implements OnInit {

    @Output() formDashboardSnapshotsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    currentDashboardSnapshots: DashboardSnapshot[];
    selectedRow : Number;
    setClickedRow : Function;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {

        this.setClickedRow = function(index){
            this.selectedRow = index;
        }

    }

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.getCurrentDashboardSnapshots(
            this.globalVariableService.currentDashboardID).then
              (i => this.currentDashboardSnapshots = i);
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardSnapshotsClosed.emit(action);
    }
}
