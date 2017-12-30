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
import { DashboardSnapshot }          from './models';

// Data
import { httpFake }                   from './data/dashboards'

@Component({
    selector: 'dashboard-treeview',
    templateUrl: './dashboard.treeview.component.html',
    styleUrls: ['./dashboard.treeview.component.css']
})
export class DashboardTreeviewComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardTreeviewClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Partial<Dashboard>[];

    rootDirectory: any[] = [
        {
            name: "Datasets",
            icon: "folder",
            expanded: true,
            files: [
                {
                    icon: "calendar",
                    name: "Calendar Widget",
                    active: true
                },
                {
                    icon: "line-chart",
                    name: "Line Charts",
                    active: false
                },
                {
                    icon: "dashboard",
                    name: "Dashboard",
                    active: false
                },
                {
                    icon: "map",
                    name: "Maps",
                    active: false
                },
            ]
        },
        {
            name: "Shapes",
            icon: "folder",
            expanded: false,
            files: [
                {
                    icon: "file",
                    name: "Circle",
                    active: false
                },
            ]
        },
        {
            name: "Slicers",
            icon: "folder",
            expanded: false,
            files: [
                {
                    icon: "file",
                    name: "TradeType",
                    active: false
                },
            ]
        }
    ];
    
    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private httpFake: httpFake,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
    }

    clickClose(action: string) {
		this.formDashboardTreeviewClosed.emit(action);
    }
}
