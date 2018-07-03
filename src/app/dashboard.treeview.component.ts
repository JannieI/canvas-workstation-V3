/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DashboardTab }               from './models';
import { Datasource }                 from './models';
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

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];

    objectTree: any[] = [
        {
            name: "Datasources",
            icon: "folder",
            expanded: true,
            children: [
                {
                    icon: 'data-cluster',
                    name: 'Budget vs Inflation 2017',
                    active: true,
                    grandchildren: [
                        {
                            icon: "line-chart",
                            name: "Graph: Economic review for 2017 (Bar, Inflation x Industry)",
                            active: true
                        },
                        {
                            icon: "line-chart",
                            name: "Graph: Budget monthly review (Line, year x Costs)",
                            active: false
                        },
                        {
                            icon: "slider",
                            name: "Slicer: Cost Centre (5, sorted on Volume)",
                            active: false
                        },
                        {
                            icon: "grid-view",
                            name: "Table: Economic review for 2017, version 2",
                            active: false
                        }
                    ]
                },
                {
                    icon: 'data-cluster',
                    name: 'Trades 2017',
                    active: false,
                    grandchildren: [
                        {
                            icon: "line-chart",
                            name: "Graph: Value traded (Bar, Market x Month)",
                            active: false
                        },
                        {
                            icon: "line-chart",
                            name: "Graph: Equity Trades ex-OD (Line, Month x Volume)",
                            active: false
                        },
                        {
                            icon: "slider",
                            name: "Slicer: TradeType (5, sorted on Volume)",
                            active: false
                        },
                        {
                            icon: "grid-view",
                            name: "Table: Top 10 brokers",
                            active: false
                        }
                    ]
                }
            ]
        },
        {
            name: "Widgets",
            icon: "folder",
            expanded: false,
            children: [
                {
                    icon: "line-chart",
                    name: "Graph: Economic review for 2017 (Bar, Inflation x Industry)",
                    active: false
                },
                {
                    icon: "line-chart",
                    name: "Graph: Budget monthly review (Line, year x Costs)",
                    active: false
                },
                {
                    icon: "line-chart",
                    name: "Graph: Value traded (Bar, Market x Month)",
                    active: false
                },
                {
                    icon: "line-chart",
                    name: "Graph: Equity Trades ex-OD (Line, Month x Volume)",
                    active: false
                }
            ]
        },
        {
            name: "Tables",
            icon: "folder",
            expanded: false,
            children: [
                {
                    icon: "grid-view",
                    name: "Table: Economic review for 2017, version 2",
                    active: false
                },
                {
                    icon: "grid-view",
                    name: "Table: Top 10 brokers",
                    active: false
                }
            ]
        },
        {
            name: "Slicers",
            icon: "folder",
            expanded: false,
            children: [
                {
                    icon: "slider",
                    name: "Slicer: Cost Centre (5, sorted on Volume)",
                    active: false
                },
                {
                    icon: "slider",
                    name: "Slicer: TradeType (5, sorted on Volume)",
                    active: false
                }
            ]
        },
        {
            name: "Shapes",
            icon: "folder",
            expanded: false,
            children: [
                {
                    icon: "objects",
                    name: "Circle",
                    active: false
                },
            ]
        },
    ];

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
                icon: "objects",
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
            if (widgets.length > 0) {
                this.objectTree[i].children.push({
                    name: 'Widgets',
                    icon: 'folder',
                    expanded: false,
                    grandchildren: []
                });
            };

            // Widgets - at level 2 = [0].children[0].grandchildren
            widgets.forEach(w => {

                // Record DS id
                dsIDs.push(w.id);

                // Put W into treeview
                if (w.widgetType == 'Graph') {
                    this.objectTree[i].children[0].grandchildren.push({
                        icon: "line-chart",
                        name: 'Graph (' + w.graphYtype + ') ' + w.titleText + ' (' + w.description + ')',
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
            if (widgets.length > 0) {
                this.objectTree[i].children.push({
                    name: 'Datasources',
                    icon: 'folder',
                    expanded: false,
                    grandchildren: []
                });
            };
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
        };
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardTreeviewClosed.emit(action);
    }
}
