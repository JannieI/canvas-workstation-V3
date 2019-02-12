/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DataQualityIssue }           from './models';
import { DashboardTab }               from './models';
import { Widget }                     from './models';

@Component({
    selector: 'dashboard-treeview',
    templateUrl: './dashboard.treeview.component.html',
    styleUrls: ['./dashboard.treeview.component.css']
})
export class DashboardTreeviewComponent implements OnInit {

    @Output() formDashboardTreeviewClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    dashboards: Dashboard[];
    dataQualityIssues: DataQualityIssue[] = [];
    objectTree: any[] = [];
    showTypeDashboard: boolean = false;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();

        this.objectTree = []

        // Get the current D, and then its info (ie DS)
        let currentDashboard: Dashboard = this.globalVariableService.dashboards.filter(d =>
            d.id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        )[0];

        // Get T for this D
        let tabs: DashboardTab[] = this.globalVariableService.currentDashboardTabs.filter(t =>
            t.dashboardID == currentDashboard.id
        );

        // Tabs - at level [0]
        for (var i = 0; i < tabs.length; i++) {
            this.objectTree.push({
                icon: "file-group",
                name: 'Tab: ' + tabs[i].name + ' (' + tabs[i].description + ')',
                active: false,
                children: []
            });

            // Get widgets for this T
            let widgets: Widget[] = this.globalVariableService.widgets.filter(
                w => w.dashboardTabIDs.indexOf(tabs[i].id)>=0
            );

            let dsIDs: number[] = [];

            // Widget Label - at level 1 = [0].children
            this.objectTree[i].children.push({
                name: 'Widgets',
                icon: 'bubble-chart',
                expanded: false,
                grandchildren: []
            });

            // Widgets - at level 2 = [0].children[0].grandchildren
            widgets.forEach(w => {

                // Record DS id
                if (w.datasourceID != null) {
                    if (dsIDs.indexOf(w.datasourceID) < 0) {
                        dsIDs.push(w.datasourceID);
                    };
                };

                // Put W into treeview
                if (w.widgetType == 'Graph') {
                    this.objectTree[i].children[0].grandchildren.push({
                        icon: "line-chart",
                        name: 'Graph (' + w.graphLayers[0].graphYtype + ') ' + w.titleText + ' (' + w.description + ')',
                        active: false
                    });
                };
                if (w.widgetType == 'Table') {
                    this.objectTree[i].children[0].grandchildren.push({
                        icon: "grid-view",
                        name: 'Table ' + w.titleText + ' (' + w.description + ')',
                        active: false
                    });
                };
                if (w.widgetType == 'Slicer') {
                    this.objectTree[i].children[0].grandchildren.push({
                        icon: "slider",
                        name: 'Slicer ' + w.titleText + ' (' + w.description + ')',
                        active: false
                    });
                };
                if (w.widgetType == 'Shape') {
                    this.objectTree[i].children[0].grandchildren.push({
                        icon: "objects",
                        name: 'Shape: ' + w.widgetSubType,
                        active: false
                    });
                };
            });
                    
            // DS Label - at level 1 = [0].children
            this.objectTree[i].children.push({
                name: 'Datasources',
                icon: 'storage',
                expanded: false,
                grandchildren: []
            });

            if (dsIDs.length > 0) {
                dsIDs.forEach(dsid => {
                    let datasourceIndex: number= this.globalVariableService.datasources
                        .findIndex(ds => ds.id == dsid);
                    if (datasourceIndex >= 0) {
                        this.objectTree[i].children[1].grandchildren.push({
                            icon: "folder",
                            name: 'Datasource: ' + this.globalVariableService.datasources[datasourceIndex].name
                            + ' (' + this.globalVariableService.datasources[datasourceIndex].description + ')',
                            active: false
                        });
                    };
                })
            };
  
            // Data Quality Label - at level 1 = [0].children
            this.objectTree[i].children.push({
                name: 'Data Quality',
                icon: 'shield-check',
                expanded: false,
                grandchildren: []
            });
            if (dsIDs.length > 0) {
                dsIDs.forEach(dsid => {
                    this.globalVariableService.getResource(
                        'dataQualityIssues')
                        .then(res => {
                            this.dataQualityIssues = res;
                            let dataqualityIndex: number= this.dataQualityIssues
                                .findIndex(dq => dq.datasourceID == dsid);
                            if (dataqualityIndex >= 0) {
                                this.objectTree[i].children[2].grandchildren.push({
                                    icon: "folder",
                                    name: 'Datasource: ' + this.dataQualityIssues[dataqualityIndex].name
                                    + ' (' + this.dataQualityIssues[dataqualityIndex].description + ')',
                                    active: false
                                });
                            };
                        })                      
                        .catch(err => console.log('Error getting dataQualityIssues: ' + err));
                                

                })
            };
              
            // Usage Label - at level 1 = [0].children
            this.objectTree[i].children.push({
                name: 'Usage',
                icon: 'dashboard',
                expanded: false,
                grandchildren: []
            });
            this.objectTree[i].children[3].grandchildren.push({
                icon: "folder",
                name: 'User - who used and how often ...',
                active: false
            });

        };
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardTreeviewClosed.emit(action);
    }
}
