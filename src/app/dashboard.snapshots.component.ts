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
    currentDashboardSnapshots: DashboardSnapshot[];
    selectedRow : Number;
    setClickedRow : Function;  // use (click)="setClickedRow(i)" in html to call this

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {

        this.setClickedRow = function(index){
            this.selectedRow = index;
        }

    }

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.refreshGrid();

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSnapshotsClosed.emit(action);
    }

    clickSave(snapshotNameInput: string, snapshotCommentInput: string) {
        // Save the snapshot
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.globalVariableService.saveLocal('DashboardSnapshot', {
            id: null,
            dashboardID: this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            name: snapshotNameInput,
            comment: snapshotCommentInput
            }).then(i => {
            console.log('saved', i)
        });

        this.refreshGrid();

    }

    refreshGrid() {
        // Refresh the snapshot Grid with the latest info
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.globalVariableService.getCurrentDashboardSnapshots(
            this.globalVariableService.currentDashboardID).then
              (i => this.currentDashboardSnapshots = i);

    }

    clickRefreshDashboard(index: number) {
        // Refresh the D to the selected Snapshot, after saving the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefreshDashboard', '@Start');

        this.globalVariableService.saveLocal('DashboardSnapshot', {
            id: null,
            dashboardID: this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            name: 'Backup before RollBack',
            comment: 'Saved before rollback was performed'
            }).then(i => {
            console.log('saved', i)
            // TODO - fix hardcoding
            this.globalVariableService.refreshCurrentDashboard(
                'snapshot-clickRefreshDashboard', 1, 2, ''
            );

            // Close the form
            this.formDashboardSnapshotsClosed.emit('Rollback');
        })
    }

}
