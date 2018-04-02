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
import { Dashboard, DashboardTab, DashboardPermission, CanvasComment, Widget, Dataset, Datasource }                  from './models';
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
    selectedRow : Number;
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
            this.globalVariableService.currentDashboardID).then
              (i => this.currentDashboardSnapshots = i);

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSnapshotsClosed.emit(action);
    }

    clickDelete(index: number, id: number) {
        // Delete the selected Snapshot
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.globalVariableService.deleteDashboardSnapshots(id).then(res => {
            this.currentDashboardSnapshots.splice(index, 1)
        });
    }

    clickSave() {
        // Save the snapshot
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');


        let dashboardID: number = this.globalVariableService.currentDashboardInfo.value.
            currentDashboardID;
        let currentD: Dashboard[] = this.globalVariableService.currentDashboards.slice();
        let currentT: DashboardTab[] = this.globalVariableService.currentDashboardTabs.slice();
        let currentP: DashboardPermission[] = this.globalVariableService.currentDashboardPermissions.slice();
        let currentC: CanvasComment[] = this.globalVariableService.canvasComments.slice();
        let currentW: Widget[] = this.globalVariableService.currentWidgets.slice();
        let currentDset: Dataset[] = this.globalVariableService.currentDatasets.slice();
        let currentDS: Datasource[] = this.globalVariableService.currentDatasources.slice();
        let newSn: DashboardSnapshot = {
            id: null,
            dashboardID: dashboardID,
            name: this.snapshotName,
            comment: this.snapshotComment,
            dashboards: currentD,
            dashboardTabs: currentT,
            dashboardPermissions: currentP,
            canvasComments: currentC,
            widgets: currentW,
            datasets: currentDset,
            datasources: currentDS                
        };

        // Save and Close the form
        this.globalVariableService.addDashboardSnapshots(newSn).then(res => {
            this.currentDashboardSnapshots.push(res);
            console.log('xx save', res, this.currentDashboardSnapshots)
        });

    }

    clickRestore(index: number) {
        // Refresh the D to the selected Snapshot, after saving the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefreshDashboard', '@Start');
 
        let dashboardID: number = this.globalVariableService.currentDashboardInfo.
            value.currentDashboardID;
        let snap: DashboardSnapshot = this.currentDashboardSnapshots[index];

        this.globalVariableService.currentDashboards = this.currentDashboardSnapshots[index].dashboards;
        this.globalVariableService.currentDashboardTabs = this.currentDashboardSnapshots[index].dashboardTabs;
        this.globalVariableService.currentDashboardPermissions = this.currentDashboardSnapshots[index].dashboardPermissions;
        this.globalVariableService.canvasComments = this.currentDashboardSnapshots[index].canvasComments;
        this.globalVariableService.currentWidgets = this.currentDashboardSnapshots[index].widgets;
        this.globalVariableService.currentDatasets = this.currentDashboardSnapshots[index].datasets;
        this.globalVariableService.currentDatasources = this.currentDashboardSnapshots[index].datasources;
        
        // Remove global Ws
        this.globalVariableService.widgets = this.globalVariableService.widgets.filter(w => {
            w.dashboardID != dashboardID
        }); 
                
        // Add W from snapshot to global
        snap.widgets.forEach(s => {
            this.globalVariableService.widgets.push(s);
        });
        
        // Refresh and Close form
		this.globalVariableService.refreshCurrentDashboard(
            'openDashboard-clickOpenEdit', dashboardID, -1, ''
        );
        // this.formDashboardSnapshotsClosed.emit('Rollback');

    }

}
