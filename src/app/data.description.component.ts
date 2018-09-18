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
    selector: 'data-description',
    templateUrl: './data.description.component.html',
    styleUrls: ['./data.description.component.css']
})
export class DatasourceDescriptionComponent implements OnInit {

    @Output() formDataDatasourceDescriptionClosed: EventEmitter<string> = new EventEmitter();

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

    }

    clickRow(index: number, id: number) {
        // Highlight selected Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;
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

		this.formDataDatasourceDescriptionClosed.emit(action);
    }
}
