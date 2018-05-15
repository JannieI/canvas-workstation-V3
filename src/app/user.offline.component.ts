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

const selectDashboards: any = [
    {
        id: 1,
        dashboardName: 'Fruit exports',
        dataLevel: 'data/schema'
    }
];

@Component({
    selector: 'user-offline',
    templateUrl: './user.offline.component.html',
    styleUrls: ['./user.offline.component.css']
})
export class UserOfflineComponent implements OnInit {

    @Output() formUserOfflineClosed: EventEmitter<string> = new EventEmitter();

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
    selectDashboards: any = selectDashboards;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards.slice();
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formUserOfflineClosed.emit(action);
    }
}
