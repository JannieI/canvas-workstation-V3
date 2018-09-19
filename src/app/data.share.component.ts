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
import { CanvasGroup }                from './models';
import { CanvasUser }                 from './models';
import { DatasourcePermission }       from './models';
import { Datasource }                 from './models';

@Component({
    selector: 'data-share',
    templateUrl: './data.share.component.html',
    styleUrls: ['./data.share.component.css']
})
export class DatasourceShareComponent implements OnInit {

    @Output() formDataShareClosed: EventEmitter<string> = new EventEmitter();

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

    canView: boolean = false;
    canEdit: boolean = false;
    canAdd: boolean = false;
    canDelete: boolean = false;
    canRefresh: boolean = false;
    datasourcePermissions: DatasourcePermission[];
    datasources: Datasource[];
    errorMessage: string = '';
    groupNames: string[] = [];
    groups: CanvasGroup[];
    selectedDatasource: string;
    selectedGroupName: string = '';
    selectedRowIndex: number = 0;
    selectedUserID: string;
    userNames: string[] = [];
    users: CanvasUser[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.datasources = this.globalVariableService.datasources.slice();

        this.globalVariableService.getDatasourcePermissions().then (dp => {
            this.datasourcePermissions = dp;
            this.datasourcePermissions.forEach(tdsp => {
                tdsp.name = this.globalVariableService.datasources.filter(
                    ds => ds.id == tdsp.datasourceID)[0].name;
            })

            this.globalVariableService.getCanvasUsers().then(usr => {
                this.userNames = usr.sort((n1,n2) => {
                    if (n1.userID > n2.userID) {
                        return 1;
                    };

                    if (n1.userID < n2.userID) {
                        return -1;
                    };

                    return 0;
                })
                .map(u => u.userID);
                this.userNames = ['', ...this.userNames];
                this.users = usr;

                this.globalVariableService.getCanvasGroups().then(grp => {
                    this.groupNames = grp.sort((n1,n2) => {
                        if (n1.name > n2.name) {
                            return 1;
                        };

                        if (n1.name < n2.name) {
                            return -1;
                        };

                        return 0;
                    })
                    .map(g => g.name);

                    this.groups = grp;
                });
                this.groupNames = ['', ...this.groupNames];

            });

            console.warn('xx this.datasourcePermissions', this.datasourcePermissions)
        });

    }

    clickRow(index: number, id: number) {
        // Highlight selected Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;
    }

    clickToggleView(id: number, $event) {
        // User dblclicked View - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleView', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id == id) {
                this.datasourcePermissions[i].canView = ! this.datasourcePermissions[i].canView;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDatasourcePermission(
                this.datasourcePermissions[index])
                ;
        };
    }

    clickToggleEdit(id: number, $event) {
        // User dblclicked Edit - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleEdit', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id == id) {
                this.datasourcePermissions[i].canEdit = ! this.datasourcePermissions[i].canEdit;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDatasourcePermission(
                this.datasourcePermissions[index])
                ;
        };
    }

    clickToggleDelete(id: number, $event) {
        // User dblclicked Delete - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleDelete', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id == id) {
                this.datasourcePermissions[i].canDelete = ! this.datasourcePermissions[i].canDelete;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDatasourcePermission(
                this.datasourcePermissions[index])
                ;
        };
    }

    clickToggleRefresh(id: number, $event) {
        // User dblclicked Refresh - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleRefresh', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id == id) {
                this.datasourcePermissions[i].canRefresh = ! this.datasourcePermissions[i].canRefresh;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDatasourcePermission(
                this.datasourcePermissions[index])
                ;
        };
    }

    dblclickDeletePermission(id: number, index: number) {
        // Delete the selected Permission
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeletePermission', '@Start');

        this.datasourcePermissions.splice(index,1);
        this.globalVariableService.deleteDatasourcePermission(id);
    }

    clickAdd() {
        // Add a new Permission
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';

        // Validation
        if (this.selectedDatasource == ''  ||  this.selectedDatasource == null) {
            this.errorMessage = 'Please select a Datasource';
            return;
        };
        if (this.selectedUserID == ''  &&  this.selectedGroupName == '') {
            this.errorMessage = 'Select at least a user or a group';
            return;
        };

        // Get groupID
        let groupID: number = -1;
        if (this.selectedGroupName != '') {
            let groupIndex: number = this.groups.findIndex(
                grp => grp.name == this.selectedGroupName);
            if (groupIndex < 0) {
                this.errorMessage = 'Unexpected error - group not found';
                return;
            };
            groupID = this.groups[groupIndex].id;
        };

        // Get DS-ID
        let datasourceIndex: number = this.datasources.findIndex(
            ds => ds.name == this.selectedDatasource);
        if (datasourceIndex < 0) {
            this.errorMessage = 'Unexpected error - Datasource not found';
            return;
        }
        let datasourceID: number = this.datasources[datasourceIndex].id;

        // Create new Permisions record and save to DB
        let newDatasourcePermision: DatasourcePermission = {
                id: null,
                datasourceID: datasourceID,
                name: this.selectedDatasource,
                userID: this.selectedUserID,
                groupID: groupID,
                groupName: this.selectedGroupName,
                canView: this.canView,
                canEdit: this.canEdit,
                canDelete: this.canDelete,
                canRefresh: this.canRefresh
        };
        this.globalVariableService.addDatasourcePermission(newDatasourcePermision).then(
            res => this.datasourcePermissions.push(res)
        );

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDataShareClosed.emit(action);
    }
}
