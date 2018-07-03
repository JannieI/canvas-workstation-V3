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

        // Widgets
        let dsIDs: number[];
        this.objectTree.push({
            name: 'Widgets',
            icon: 'folder',
            expanded: true,
            children: []
        });
        this.globalVariableService.currentWidgets.forEach(w => {
            this.objectTree[0].children.push({
                icon: "objects",
                name: w.titleText,
                active: false
            });
        });
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardTreeviewClosed.emit(action);
    }
}
