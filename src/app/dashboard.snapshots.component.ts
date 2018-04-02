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

        // Remove global Ds
        this.globalVariableService.dashboards = this.globalVariableService.dashboards.filter(d => {
            d.id != dashboardID
        }); 
                
        // Add D from snapshot to global
        snap.dashboards.forEach(s => {
            this.globalVariableService.dashboards.push(s);
        });
     
        // Remove global Ts
        this.globalVariableService.dashboardTabs = this.globalVariableService.dashboardTabs.
            filter(t => {
            t.dashboardID != dashboardID
        }); 
                
        // Add T from snapshot to global
        snap.dashboardTabs.forEach(s => {
            this.globalVariableService.dashboardTabs.push(s);
        });

        // Remove global Ps
        this.globalVariableService.dashboardPermissions = this.globalVariableService.dashboardPermissions.
            filter(p => {
            p.dashboardID != dashboardID
        }); 
                
        // Add P from snapshot to global
        snap.dashboardPermissions.forEach(s => {
            this.globalVariableService.dashboardPermissions.push(s);
        });

        // Remove global Cs
        this.globalVariableService.canvasComments = this.globalVariableService.canvasComments.
            filter(c => {
            c.dashboardID != dashboardID
        }); 
                
        // Add C from snapshot to global
        snap.canvasComments.forEach(s => {
            this.globalVariableService.canvasComments.push(s);
        });

        // Remove global Ws
        this.globalVariableService.widgets = this.globalVariableService.widgets.filter(w => {
            w.dashboardID != dashboardID
        }); 
                
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
            filter(dS => {
            ids.indexOf(dS.id) <0
            }
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
            filter(ds => {
                ids.indexOf(ds.id) <0
            }
        ); 
                
        // Add DS from snapshot to global
        snap.datasources.forEach(s => {
            this.globalVariableService.datasources.push(s);
        });
        
        // Refresh and Close form
		this.globalVariableService.refreshCurrentDashboard(
            'openDashboard-clickOpenEdit', dashboardID, -1, ''
        );

        // Close the form
        this.formDashboardSnapshotsClosed.emit('Rollback');

    }

}
