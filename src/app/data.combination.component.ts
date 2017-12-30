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
import { dashboard }                  from './models';

@Component({
    selector: 'data-combination',
    templateUrl: './data.combination.component.html',
    styleUrls: ['./data.combination.component.css']
})
export class DataCombinationComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDataCombinationClosed: EventEmitter<string> = new EventEmitter();

    isFirstTimeDataCombination: boolean;
    showTypeDashboard: boolean = false;
    showNoSecurity: boolean = true;
    showTeam: boolean = false;
    showQArequired: boolean = false;
    dashboards: Partial<dashboard>[];
    selectedUnion: boolean = true;
    selectedIntersect: boolean = false;
    selectedMinus: boolean = false;
    selectedJoin: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.isFirstTimeDataCombination.subscribe(
            i => this.isFirstTimeDataCombination = i
        )
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDataCombinationClosed.emit(action);
    }

    clickSelectStep(ev) {
        this.selectedUnion = false;
        this.selectedIntersect = false;
        this.selectedMinus = false;
        this.selectedJoin = false;
    
        if (ev.target.value == 'Union') { this.selectedUnion = true };
        if (ev.target.value == 'Intersect') { this.selectedIntersect = true };
        if (ev.target.value == 'Minus') { this.selectedMinus = true };
        if (ev.target.value == 'Join') { this.selectedJoin = true };
    }

    clickSaveFile() {
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDataCombination.next(false);
    }
}
