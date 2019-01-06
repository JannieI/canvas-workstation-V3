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
        this.canvasGroups = this.globalVariableService.canvasGroups.filter(g =>
            g.name != ''
        ).sort((n1,n2) => {
            if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                return 1;
            };
        
            if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                return -1;
            };
        
            return 0;
        });

        // Click first row
        if (this.canvasGroups.length > 0) {
            this.clickRow(0, this.canvasGroups[0].id);
        };

        if (this.canvasGroups.length > 0) {
            this.canvasUsers = this.globalVariableService.canvasUsers.filter(u => 
                u.groups.map(x => x.toLowerCase()).indexOf(this.canvasGroups[0].name.toLowerCase()) >= 0
            )
        } else {
            this.canvasUsers = [];
        };

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardGroupsClosed.emit(action);
    }

    clickRow(index: number, groupID: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'setClickedRow', '@Start');

        this.selectedRow = index;
        this.selectedID = groupID;

        this.groupName = this.canvasGroups[index].name;
        this.canvasGroups.forEach(g => {
            if (g.id == groupID) {
                this.canvasUsers = this.globalVariableService.canvasUsers.filter(u => 
                    u.groups.map(x => x.toLowerCase()).indexOf(g.name.toLowerCase()) > 0
                )
            };
        })
     
    }

    dblclickDelete(id: number) {
        // Delete selected group
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        this.globalVariableService.deleteCanvasGroup(id).then( () => {
            this.message = "Group Deleted"
            this.canvasGroups = this.canvasGroups.filter(
                grp => grp.id != id
            );        
        })
        .catch(err => {
            this.errorMessage = "Deletion of group failed " + err.message;
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
            id: null,
            name: this.groupName,
            editedBy:  this.globalVariableService.currentUser.userID,
            editedOn:  new Date(),
            createdBy: this.canvasGroups[this.selectedRow].createdBy,
            createdOn: this.canvasGroups[this.selectedRow].createdOn
        }

        this.globalVariableService.saveCanvasGroup(newGroup).then( () => {
            this.message = "Group Updated"
            this.canvasGroups[this.selectedRow] = newGroup;
        })
        .catch(err => {
            this.errorMessage = "Updating of group failed " + err;
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

        this.globalVariableService.addCanvasGroup(newGroup).then( (res) => {
            this.message = "Group Added"
            this.canvasGroups.push(newGroup);
            this. selectedRow = this.canvasGroups.findIndex(grp => grp.id == res.id);
            this.selectedID = res.id;
        })
        .catch(err => {
            this.errorMessage = "Deletion of group failed " + err;
        });

    }

}

