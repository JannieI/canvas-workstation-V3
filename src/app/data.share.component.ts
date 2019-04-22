/*
 * Shows form to manage permissions for Datasources
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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    canView: boolean = false;
    canEdit: boolean = false;
    canAdd: boolean = false;
    canDelete: boolean = false;
    canGrant: boolean = false;
    canRefresh: boolean = false;
    datasourcePermissions: DatasourcePermission[];
    datasources: Datasource[];
    errorMessage: string = '';
    groupNames: string[] = [];
    groups: CanvasGroup[];
    infoMessage: string = '';
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

        this.globalVariableService.getResource('datasources')
            .then(res => {
                this.datasources = res
                    .filter(ds => ds.accessType === 'AccessList')
                    .slice();

                this.globalVariableService.getDatasourcePermissions().then (dp => {
                    this.datasourcePermissions = dp.slice();
                    this.datasourcePermissions.forEach(tdsp => {
                        tdsp.name = this.datasources.filter(
                            ds => ds.id === tdsp.datasourceID)[0].name;
                    });
                    this.datasourcePermissions = this.datasourcePermissions.sort( (obj1, obj2) => {
                        if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                            return 1;
                        };
                        if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                            return -1;
                        };
                        return 0;
                    });

                    this.globalVariableService.getResource('canvasUsers').then(usr => {
                        this.userNames = usr.sort((n1,n2) => {
                            if (n1.userID.toLowerCase() > n2.userID.toLowerCase()) {
                                return 1;
                            };

                            if (n1.userID.toLowerCase() < n2.userID.toLowerCase()) {
                                return -1;
                            };

                            return 0;
                        })
                        .map(u => u.userID);
                        this.userNames = ['', ...this.userNames];
                        this.users = usr;

                        this.globalVariableService.getResource('canvasGroups').then(grp => {
                            this.groupNames = grp.sort((n1,n2) => {
                                if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                                    return 1;
                                };

                                if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                                    return -1;
                                };

                                return 0;
                            })
                            .map(g => g.name);

                            this.groups = grp.slice();
                            this.groupNames = ['', ...this.groupNames];
                        })
                        .catch(err => {
                            this.errorMessage = err.slice(0, 100);
                            console.error('Error in Datasource.share reading canvasGroups: ' + err);
                        });
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in Datasource.share reading canvasUsers: ' + err);
                    });
    
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Datasource.share getDatasourcePermissions: ' + err);
                });
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.share reading datasources: ' + err);
            });

    }

    clickRow(index: number, id: number) {
        // Highlight selected Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;
    }

    clickToggleView(index: number, id: number) {
        // User dblclicked View - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleView', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Check permissions
        if (!this.globalVariableService.datasourcePermissionsCheck(
            this.datasourcePermissions[index].datasourceID, 'CanGrant') ) {
            this.errorMessage = 'No permission to grant access on this record';
            return;
        };

        // Toggle
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id === id) {
                this.datasourcePermissions[i].canView =
                    !this.datasourcePermissions[i].canView;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource(
                'datasourcePermissions',
                this.datasourcePermissions[index]
                ).then(res => {
                    this.infoMessage = 'Changes saved';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Datasource.share saving datasourcePermissions: ' + err);
                });
        };
    }

    clickToggleEdit(index: number, id: number) {
        // User dblclicked Edit - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleEdit', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Check permissions
        if (!this.globalVariableService.datasourcePermissionsCheck(
            this.datasourcePermissions[index].datasourceID, 'CanGrant') ) {
            this.errorMessage = 'No permission to grant access on this record';
            return;
        };

        // Toggle
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id === id) {
                this.datasourcePermissions[i].canEdit =
                    !this.datasourcePermissions[i].canEdit;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource(
                'datasourcePermissions',
                this.datasourcePermissions[index]
                ).then(res => {
                    this.infoMessage = 'Changes saved';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Datasource.share saving datasourcePermissions: ' + err);
                });
        };
    }

    clickToggleDelete(index: number, id: number) {
        // User dblclicked Delete - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleDelete', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Check permissions
        if (!this.globalVariableService.datasourcePermissionsCheck(
            this.datasourcePermissions[index].datasourceID, 'CanGrant') ) {
            this.errorMessage = 'No permission to grant access on this record';
            return;
        };

        // Toggle
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id === id) {
                this.datasourcePermissions[i].canDelete =
                    !this.datasourcePermissions[i].canDelete;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource(
                'datasourcePermissions', 
                this.datasourcePermissions[index]
                ).then(res => {
                    this.infoMessage = 'Changes saved';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Datasource.share saving datasourcePermissions: ' + err);
                });
        };
    }

    clickToggleRefresh(index: number, id: number) {
        // User dblclicked Refresh - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleRefresh', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Check permissions
        if (!this.globalVariableService.datasourcePermissionsCheck(
            this.datasourcePermissions[index].datasourceID, 'CanGrant') ) {
            this.errorMessage = 'No permission to grant access on this record';
            return;
        };

        // Toggle
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id === id) {
                this.datasourcePermissions[i].canRefresh = ! this.datasourcePermissions[i].canRefresh;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource(
                'datasourcePermissions', 
                this.datasourcePermissions[index]
                ).then(res => {
                    this.infoMessage = 'Changes saved';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Datasource.share saving datasourcePermissions: ' + err);
                });
        };
    }

    clickToggleGrant(index: number, id: number) {
        // User dblclicked Grant - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleGrant', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Check permissions
        if (!this.globalVariableService.datasourcePermissionsCheck(
            this.datasourcePermissions[index].datasourceID, 'CanGrant') ) {
            this.errorMessage = 'No permission to grant access on this record';
            return;
        };

        // Toggle
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id === id) {
                this.datasourcePermissions[i].canGrant =
                    !this.datasourcePermissions[i].canGrant;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource(
                'datasourcePermissions', 
                this.datasourcePermissions[index]
                ).then(res => {
                    this.infoMessage = 'Changes saved';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Datasource.share saving datasourcePermissions: ' + err);
                });

        };
    }

    dblclickDeletePermission(id: number, index: number) {
        // Delete the selected Permission
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeletePermission', '@Start');

        this.datasourcePermissions.splice(index,1);
        this.globalVariableService.deleteResource('datasourcePermissions', id)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.share deleting datasourcePermissions: ' + err);
            });
}

    clickAdd() {
        // Add a new Permission
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';

        // Validation
        if (this.selectedDatasource === ''  ||  this.selectedDatasource == null) {
            this.errorMessage = 'Please select a Datasource';
            return;
        };
        if (this.selectedUserID === ''  &&  this.selectedGroupName === '') {
            this.errorMessage = 'Select at least a user or a group';
            return;
        };

        // Get groupID
        let groupID: number = -1;
        if (this.selectedGroupName != '') {
            let groupIndex: number = this.groups.findIndex(
                grp => grp.name === this.selectedGroupName);
            if (groupIndex < 0) {
                this.errorMessage = 'Unexpected error - group not found';
                return;
            };
            groupID = this.groups[groupIndex].id;
        };

        // Get DS-ID
        let datasourceIndex: number = this.datasources.findIndex(
            ds => ds.name === this.selectedDatasource);
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
                canRefresh: this.canRefresh,
                canGrant: this.canGrant,
                editedBy: '',
                editedOn: null,
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: new Date()
        };
        this.globalVariableService.addResource(
            'datasourcePermissions', 
            newDatasourcePermision
            ).then(res => this.datasourcePermissions.push(res))
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.share adding datasourcePermissions: ' + err);
            });

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDataShareClosed.emit(action);
    }
}
