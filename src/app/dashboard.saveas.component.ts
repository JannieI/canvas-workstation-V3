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
    selector: 'dashboard-save-as',
    templateUrl: './dashboard.saveas.component.html',
    styleUrls: ['./dashboard.saveas.component.css']
})
export class DashboardSaveComponent implements OnInit {

    @Output() formDashboardSaveClosed: EventEmitter<string> = new EventEmitter();

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

    isFirstTimeDashboardSave: boolean;
    showTypeDashboard: boolean = false;
    showNoSecurity: boolean = true;
    showTeam: boolean = false;
    showQArequired: boolean = false;
    dashboards: Dashboard[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards.slice();
        this.globalVariableService.isFirstTimeDashboardSave.subscribe(
            i => this.isFirstTimeDashboardSave = i
        )
    }
 
    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component. 
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.globalVariableService.isFirstTimeDashboardSave.unsubscribe();
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardSaveClosed.emit(action);
    }

    clickSecurityMode(mode: any) {
        console.log('mode', mode.srcElement.value)
        if (mode.srcElement.value == 'No Security') {
            this.showNoSecurity = true;
            this.showTeam = false;
            this.showQArequired = false;
        }
        if (mode.srcElement.value == 'Team') {
            this.showNoSecurity = false;
            this.showTeam = true;
            this.showQArequired = false;
        }
        if (mode.srcElement.value == 'QA required') {
            this.showNoSecurity = false;
            this.showTeam = false;
            this.showQArequired = true;
        }
    }
 
    clickSaveFile() {
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboardSave.next(false);
    }
}
