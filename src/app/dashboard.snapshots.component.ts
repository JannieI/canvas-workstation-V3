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
import { Dashboard, DashboardTab, DashboardPermission, CanvasComment, Widget, Dataset, Datasource, WidgetCheckpoint }                  from './models';
import { DashboardSnapshot }                 from './models';

@Component({
    selector: 'dashboard-snapshots',
    templateUrl: './dashboard.snapshots.component.html',
    styleUrls: ['./dashboard.snapshots.component.css']
})
export class DashboardSnapshotsComponent implements OnInit {

    @Output() formDashboardSnapshotsClosed: EventEmitter<string> = new EventEmitter();

    currentDashboardSnapshots: DashboardSnapshot[];
    setClickedRow : Function;  // use (click)="setClickedRow(i)" in html to call this
    selectedRow : Number = 0;
    snapshotComment: string = '';
    snapshotName: string = '';

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

        this.globalVariableService.getCurrentDashboardSnapshots(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID).then
              (i => this.currentDashboardSnapshots = i.slice());

        let dashboardIndex: number = this.globalVariableService.dashboards.findIndex(
            d => d.id ==
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        );
        if (dashboardIndex >= 0) {
            let today = new Date();
            this.snapshotName = this.globalVariableService.dashboards[dashboardIndex]
                .name + ' ' + this.globalVariableService.formatDate(today);
        };
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSnapshotsClosed.emit(action);
    }

    clickDelete(index: number, id: number) {
        // Delete the selected Snapshot
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.globalVariableService.deleteDashboardSnapshot(id).then(res => {
            this.currentDashboardSnapshots.splice(index, 1)
        });
    }

    clickSave() {
        // Save the snapshot
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // // Get the currentXXX info from global - these contain all the info relevant to
        // // the current D
        // let dashboardID: number = this.globalVariableService.currentDashboardInfo.value.
        //     currentDashboardID;
        // let currentD: Dashboard[] = this.globalVariableService.currentDashboards.slice();
        // let currentT: DashboardTab[] = this.globalVariableService.currentDashboardTabs.slice();
        // let currentW: Widget[] = this.globalVariableService.currentWidgets.slice();
        // let currentDset: Dataset[] = this.globalVariableService.currentDatasets.slice();
        // let currentDS: Datasource[] = this.globalVariableService.currentDatasources.slice();
        // let currentChk: WidgetCheckpoint[] = this.globalVariableService.
        //     currentWidgetCheckpoints.slice();

        // let newSn: DashboardSnapshot = {
        //     id: null,
        //     dashboardID: dashboardID,
        //     name: this.snapshotName,
        //     comment: this.snapshotComment,
        //     dashboards: currentD,
        //     dashboardTabs: currentT,
        //     widgets: currentW,
        //     datasets: currentDset,
        //     datasources: currentDS,
        //     widgetCheckpoints: currentChk
        // };

        // // Save and Close the form
        // this.globalVariableService.addDashboardSnapshot(newSn).then(res => {
        //     this.currentDashboardSnapshots.push(res);
        // });

        this.globalVariableService.newDashboardSnapshot(
            this.snapshotName, this.snapshotComment).then(res => {
            this.currentDashboardSnapshots.push(res);
        });
    }

    clickRestore(index: number) {
        // Refresh the D to the selected Snapshot, after saving the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefreshDashboard', '@Start');

        // Make sure user has sufficient permissions
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEditOrCanDelete')) {
            this.globalVariableService.showStatusBarMessage(
                {
                    message: 'Insufficient permissions to Restore',
                    uiArea: 'StatusBar',
                    classfication: 'Warning',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
            return;
        };

        let dashboardID: number = this.globalVariableService.currentDashboardInfo.
            value.currentDashboardID;
        let snap: DashboardSnapshot = this.currentDashboardSnapshots[index];

        // Remove global D, including Templates
        let dsIDs: number [] = [];
        snap.dashboards.forEach(s => {
            dsIDs.push(s.id);
        });

        this.globalVariableService.dashboards = this.globalVariableService.dashboards.
            filter(d => dsIDs.indexOf(d.id) < 0
        );
        // Add D from snapshot to global
        snap.dashboards.forEach(s => {
            this.globalVariableService.dashboards.push(s);
        });

        // Remove global Ts
        this.globalVariableService.dashboardTabs = this.globalVariableService.dashboardTabs.
            filter(t => t.dashboardID != dashboardID
        );
        // Add T from snapshot to global
        snap.dashboardTabs.forEach(s => {
            this.globalVariableService.dashboardTabs.push(s);
        });

        // // Remove global Ps
        // this.globalVariableService.dashboardPermissions = this.globalVariableService.
        //     dashboardPermissions.filter(p => p.dashboardID != dashboardID
        // );
        // // Add P from snapshot to global
        // snap.dashboardPermissions.forEach(s => {
        //     this.globalVariableService.dashboardPermissions.push(s);
        // });

        // // Remove global Cs
        // this.globalVariableService.canvasComments = this.globalVariableService.
        //     canvasComments.filter(c => c.dashboardID != dashboardID
        // );
        // // Add C from snapshot to global
        // snap.canvasComments.forEach(s => {
        //     this.globalVariableService.canvasComments.push(s);
        // });

        // Remove global Ws
        this.globalVariableService.widgets = this.globalVariableService.widgets.
            filter(w => w.dashboardID != dashboardID
        );
        // Add W from snapshot to global
        snap.widgets.forEach(s => {
            this.globalVariableService.widgets.push(s);
        });

        // Remove global dSets
        let ids: number[] = [];
        snap.datasets.forEach(s => {
            ids.push(s.id);
        });
        this.globalVariableService.datasets = this.globalVariableService.datasets.
            filter(dS => ids.indexOf(dS.id) <0
        );
        // Add dSets from snapshot to global
        snap.datasets.forEach(s => {
            this.globalVariableService.datasets.push(s);
        });

        // Remove global DS
        ids = [];
        snap.datasources.forEach(s => {
            ids.push(s.id);
        });
        this.globalVariableService.datasources = this.globalVariableService.datasources.
            filter(ds => ids.indexOf(ds.id) <0
        );
        // Add DS from snapshot to global
        snap.datasources.forEach(s => {
            this.globalVariableService.datasources.push(s);
        });

        // Refresh and Close form
		this.globalVariableService.refreshCurrentDashboard(
            'openDashboard-clickOpenEdit', dashboardID, -1, ''
        );

        // Remove global Checkpointss
        this.globalVariableService.widgetCheckpoints = this.globalVariableService
            .widgetCheckpoints.filter(w => w.dashboardID != dashboardID
        );
        // Add Checkpoints from snapshot to global
        snap.widgetCheckpoints.forEach(s => {
            this.globalVariableService.widgetCheckpoints.push(s);
        });

        // Close the form
        this.formDashboardSnapshotsClosed.emit('Rollback');

    }

}
