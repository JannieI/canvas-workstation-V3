/*
 * Shows form to manage groups, showing users per group
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
import { CanvasUser }                 from './models';
import { CanvasGroup }                from './models';


@Component({
    selector: 'groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    @Output() formDashboardGroupsClosed: EventEmitter<string> = new EventEmitter();

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

    canvasGroups: CanvasGroup[];
    canvasUsers: CanvasUser[];
    canvasUsersOriginal: CanvasUser[];
    errorMessage: string = '';
    groupName: string = '';
    message: string = '';
    selectedRow: number = 0;
    selectedID: number = -1;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.selectedRow = 0;
        this.globalVariableService.getResource('canvasGroups')
            .then(res => {
                this.canvasGroups = res.filter(g => g.name != '' )
                    .sort((n1,n2) => {
                        if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                            return 1;
                        };

                        if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                            return -1;
                        };

                        return 0;
                    })
                    .slice();

                    this.globalVariableService.getResource('canvasUsers')
                    .then(res => {
                        this.canvasUsersOriginal = res;

                        // Click first row
                        if (this.canvasGroups.length > 0) {
                            this.clickRow(0, this.canvasGroups[0].id);
                        };

                        if (this.canvasGroups.length > 0) {
                            this.canvasUsers = this.canvasUsersOriginal.filter(u =>
                                u.groups.map(x => x.toLowerCase()).indexOf(this.canvasGroups[0].name.toLowerCase()) >= 0
                            )
                        } else {
                            this.canvasUsers = [];
                        };
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in groups reading canvasUsers: ' + err);
                    });
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in groups reading canvasGroups: ' + err);
            });
        }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardGroupsClosed.emit(action);
    }

    clickRow(index: number, groupID: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'setClickedRow', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';
        this.selectedRow = index;
        this.selectedID = groupID;

        // Show users in the selected Group
        this.groupName = this.canvasGroups[index].name;
        this.canvasGroups.forEach(g => {
            if (g.id == groupID) {
                this.canvasUsers = this.canvasUsersOriginal.filter(u =>
                    u.groups.map(x => x.toLowerCase()).indexOf(g.name.toLowerCase()) > 0
                )
            };
        });

    }

    dblclickDelete(id: number) {
        // Delete selected group
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        this.globalVariableService.deleteResource('canvasGroups', id).then( () => {
            this.message = "Group Deleted"
            this.canvasGroups = this.canvasGroups.filter(
                grp => grp.id != id
            );

            // Click first row
            if (this.canvasGroups.length > 0) {
                this.clickRow(0, this.canvasGroups[0].id);
            };
        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in groups deleting canvasGroups: ' + err);
        });
}

    clickSave() {
        // Save groupName back (~Edit)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        // Validation
        if (this.groupName == ''  ||  this.groupName == null) {
            this.errorMessage = 'The group name is compulsory';
            return;
        };
        let groupIndex: number = this.canvasGroups.findIndex(grp => grp.name == this.groupName);
        if (groupIndex >= 0) {
            this.errorMessage = 'The group name must be unique (it exists already)';
            return;
        };

        let newGroup: CanvasGroup = {
            id: this.canvasGroups[this.selectedRow].id,
            name: this.groupName,
            editedBy:  this.globalVariableService.currentUser.userID,
            editedOn:  new Date(),
            createdBy: this.canvasGroups[this.selectedRow].createdBy,
            createdOn: this.canvasGroups[this.selectedRow].createdOn
        };

        this.globalVariableService.saveResource('canvasGroups', newGroup).then( () => {
            this.message = "Group Updated"
            this.canvasGroups[this.selectedRow] = newGroup;
        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in groups saving canvasGroups: ' + err);
        });

    }

    clickAdd() {
        // Add a new groupName
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        // Validation
        if (this.groupName == ''  ||  this.groupName == null) {
            this.errorMessage = 'The group name is compulsory';
            return;
        };
        let groupIndex: number = this.canvasGroups.findIndex(grp => grp.name == this.groupName);
        if (groupIndex >= 0) {
            this.errorMessage = 'The group name must be unique (it exists already)';
            return;
        };

        let newGroup: CanvasGroup = {
            id: null,
            name: this.groupName,
            editedBy: null,
            editedOn: null,
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: new Date()
        };

        this.globalVariableService.addResource('canvasGroups', newGroup).then(res => {
            this.message = "Group Added"
            this.canvasGroups.push(res);
            this. selectedRow = this.canvasGroups.length - 1;
            this.selectedID = res.id;

        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in groups adding canvasGroups: ' + err);
        });

    }

}

