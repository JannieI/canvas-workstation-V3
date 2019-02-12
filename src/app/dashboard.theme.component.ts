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
import { DashboardTheme }             from './models';

@Component({
    selector: 'dashboard-theme',
    templateUrl: './dashboard.theme.component.html',
    styleUrls: ['./dashboard.theme.component.css']
})
export class DashboardThemeComponent implements OnInit {

    @Output() formDashboardThemeClosed: EventEmitter<string> = new EventEmitter();

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
    dashboardThemes: DashboardTheme[];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards.slice();
        this.globalVariableService.getResource('dashboardThemes')
            .then(res => this.dashboardThemes = res)
            .catch(err => console.log('Error getting dashboardThemes: ' + err))
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardThemeClosed.emit(action);
    }
}
