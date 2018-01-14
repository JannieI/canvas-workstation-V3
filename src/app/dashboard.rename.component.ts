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
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Dashboard } from 'app/models';

@Component({
    selector: 'dashboard-rename',
    templateUrl: './dashboard.rename.component.html',
    styleUrls: ['./dashboard.rename.component.css']
})
export class DashboardRenameComponent implements OnInit {

    @Output() formDashboardRenameClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];

    constructor(
        // private globalFunctionService: GlobalFunctionService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardRenameClosed.emit(action);
    }
}
