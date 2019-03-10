/*
 * Shows form to manage tags for the current Dashboard
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
import { DashboardTag }               from './models';


@Component({
    selector: 'dashboard-tags',
    templateUrl: './dashboard.tags.component.html',
    styleUrls: ['./dashboard.tags.component.css']
})
export class DashboardTagsComponent implements OnInit {

    @Input() selectedDashboard: Dashboard
    @Output() formDashboardTagsClosed: EventEmitter<string> = new EventEmitter();

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

    availableDashboardTags: DashboardTag[] = [];
    availableTagIndex: number = -1;
    errorMessage: string = '';
    newTag: string = '';
    selectedDashboardTags: DashboardTag[] = [];
    selectedTagIndex: number = -1;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('dashboardTags')
            .then(dt => {

                // Get selected, before any manipulation done to dt
                this.selectedDashboardTags = dt.filter(f =>
                    f.dashboardID == this.selectedDashboard.id
                )

                // Get a unique list of tags
                let availableTagText = new Set(dt.map(t => t.tag));
                let availableTagTextArray = Array.from(availableTagText);

                for (let i = 0; i < dt.length; i++) {

                    if (availableTagTextArray.indexOf(dt[i].tag) >= 0) {
                        this.availableDashboardTags.push(dt[i]);
                        availableTagTextArray = availableTagTextArray.slice(1);
                    };
                };

                // Sort the available tags
                this.availableDashboardTags.sort( (obj1,obj2) => {
                    if (obj1.tag.toLowerCase() > obj2.tag.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.tag.toLowerCase() < obj2.tag.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.tags reading dashboardTags: ' + err);
            });

    }

    clickAvailable(index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');
        
        this.errorMessage = '';
        this.availableTagIndex = index;
    }

    clickSelected(index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelected', '@Start');
        
        this.errorMessage = '';
        this.selectedTagIndex = index;
    }

    clickAddNew() {
        // Add text for a new tag
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddNew', '@Start');
        this.errorMessage = '';

        // Nothing to do
        if (this.newTag == ''  ||  this.newTag == null  ||  this.newTag == undefined) {
            return;
        };
        let isFound: boolean = false;
        this.selectedDashboardTags.forEach(dt => {
            if (dt.tag == this.newTag) {
                isFound = true;
            }
        });
        if (isFound) {
            return;
        };

        // Add to DB, and local Array
        let newTag: DashboardTag =
            {
                id: null,
                dashboardID: this.selectedDashboard.id,
                tag: this.newTag,
                editedBy: '',
                editedOn: null,
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: new Date()
            };

        this.globalVariableService.addResource('dashboardTags', newTag)
            .then(res => {
                this.selectedDashboardTags.push(res);
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.tags adding dashboardTags: ' + err);
            });

    }

    clickAdd() {
        // Add tag that is selected on the Avaliable Tag list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.errorMessage = '';
        // Nothing to do
        if (this.availableTagIndex < 0) {
            return;
        };
        let isFound: boolean = false;
        this.selectedDashboardTags.forEach(dt => {
            if (dt.tag == this.availableDashboardTags[this.availableTagIndex].tag) {
                isFound = true;
            }
        });
        if (isFound) {
            return;
        };

        // Add to DB, and local Array
        let newTag: DashboardTag =
            {
                id: null,
                dashboardID: this.selectedDashboard.id,
                tag: this.availableDashboardTags[this.availableTagIndex].tag,
                editedBy: '',
                editedOn: null,
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: new Date()
            };

        this.globalVariableService.addResource('dashboardTags', newTag)
        .then(res => {
            this.selectedDashboardTags.push(res);
        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in Dashboard.tags adding dashboardTags: ' + err);
        });

    }

    dblclickDelete(id: number, index: number){
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        this.errorMessage = '';
        // Remove from seleted list
        this.globalVariableService.deleteResource('dashboardTags', id)
            .then(res => {
                this.selectedDashboardTags.splice(index, 1);
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.tags deleting dashboardTags: ' + err);
            });

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardTagsClosed.emit(action);
    }

}

