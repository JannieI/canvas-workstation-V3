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
import { Dashboard }                  from './models';
import { DashboardTag }               from './models';

// Models
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';


@Component({
    selector: 'dashboard-tags',
    templateUrl: './dashboard.tags.component.html',
    styleUrls: ['./dashboard.tags.component.css']
})
export class DashboardTagsComponent implements OnInit {

    @Input() selectedDashboard: Dashboard
    @Output() formDashboardTagsClosed: EventEmitter<string> = new EventEmitter();

    availableDashboardTags: DashboardTag[];
    selectedDashboardTags: DashboardTag[];
    newTag: string;
    paletteButtons: PaletteButtonBar[];
    paletteButtonsSelected: PaletteButtonsSelected[];
    selectedTagIndex: number;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getDashboardTags().then(dt => {
                this.availableDashboardTags = dt;
                this.selectedDashboardTags = dt.filter(f =>
                    f.dashboardID == this.selectedDashboard.id
                )
                console.log('xx dt', this.selectedDashboard.id, dt)
        });

    }

    clickAvailable(id: number, index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');

        this.selectedTagIndex = index;
    }

    clickAdd() {
        // Add all selected on Available list to Selected list, and unselect original
        // Then sort the altered list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Get selected in Available, and add to Selected
        let availID: number[] = [];

        // TODO - do this better with a DB
        let maxIDs: number[] = [];
        let maxID: number = 0;
        this.globalVariableService.currentDashboardTags.forEach(pbs =>
            maxIDs.push (pbs.id)
        );
        maxID = Math.max(...maxIDs);

        maxID = maxID + 1;
        this.selectedDashboardTags.push(
            {
                id: maxID,
                dashboardID: this.selectedDashboard.id,
                tag: this.newTag

            }
        );

        console.log('xx added', this.selectedDashboardTags.length)
    }

    clickDelete(id: number, index: number){
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Remove from seleted list
        this.selectedDashboardTags.splice(index, 1);
        
    }
    
    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardTagsClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data, and Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

console.log('xx sav1', this.selectedDashboardTags)
        // Delete the inital selected ones for this user from the DB only
        this.globalVariableService.currentPaletteButtonsSelected.value.forEach(pbs =>
            this.globalVariableService.deletePaletteButtonsSelected(pbs.id)
        )

        // Unselect all
        this.paletteButtonsSelected.forEach(pbs => pbs.isSelected = false)

        // Add the new ones to the DB
        // TODO - note that IDs in paletteButtonsSelected sent to app is DIFF to DB ...
        this.paletteButtonsSelected.forEach(pbs =>
                this.globalVariableService.addPaletteButtonsSelected(pbs)
        );

        // Inform subscribers
        this.globalVariableService.currentPaletteButtonsSelected.next(this.paletteButtonsSelected);

        // Tell user
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Changes Saved',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );

		this.formDashboardTagsClosed.emit(action);
    }

    clickAddNew() {
        // Add text for a new tag
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddNew', '@Start');

    }
}

