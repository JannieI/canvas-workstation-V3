/*
 * Shows form to manage Navigator Networks
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { NavigatorNetwork }           from './models';
import { Widget }                     from './models';

interface validationReturn { 
    isValid: boolean; 
    errorMessage: string 
};

@Component({
    selector: 'navigator-editor',
    templateUrl: './navigator.editor.component.html',
    styleUrls: ['./navigator.editor.component.css']
})

export class NavigatorEditorComponent implements OnInit {

    @Input() newWidget: boolean;
    @Input() selectedWidget: Widget;
    @Input() newWidgetContainerLeft: number;
    @Input() newWidgetContainerTop: number;
    @Input() canSave: boolean = true;

    @Output() formNavigatorEditorClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('widgetDOM') widgetDOM: ElementRef;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }

    navigatorNetworkNames: string[] = [];
    editing: boolean = true;  // TODO - must be received via @Input
    errorMessage: string = '';
    navigators: Widget[] = [];
    navigatorNetworks: NavigatorNetwork[] = [];
    selectedDashboardRelationshipID: number = -1;
    selectedDashboardPropertyID: number = -1;
    selectedRow: number = 0;
    selectedNavigatorNetwork: NavigatorNetwork = null;
    selectedNetworkName: string = '';
    selectedNetworkDescription: string = '';
    selectedRelationshipDS: string = '';

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get Navigators
        this.globalVariableService.getResource(
            'widgets', 'filterObject={"widgetType": "Navigator"}'
            )
            .then (w => {
                this.navigators = w;
                
                // Select the first nework
                if (this.navigators.length > 0) {
                    this.clickRow(0, this.navigators[0].id);
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator Editor reading widgets: ' + err);
            });

        // Get Datasource list
        this.globalVariableService.getResource('navigatorNetworks')
            .then(res => {
                this.navigatorNetworks = res;

                this.navigatorNetworks.forEach(ds => {
                    this.navigatorNetworkNames.push(ds.name + ' (' + ds.id + ')');
                });

                this.navigatorNetworkNames = this.navigatorNetworkNames.sort( (obj1,obj2) => {
                    if (obj1.toLowerCase() > obj2.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.toLowerCase() < obj2.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });
                this.navigatorNetworkNames = ['', ...this.navigatorNetworkNames];

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator Editor reading datasources: ' + err);
            });

    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Reset
        this.errorMessage = '';

        this.selectedRow = index;

        // Show data for selected record
        console.log('xx ...', this.navigators[this.selectedRow])
        this.selectedNetworkName = this.navigators[this.selectedRow].name;
        this.selectedNetworkDescription = this.navigators[this.selectedRow].description;
        this.selectedDashboardRelationshipID = this.navigators[this.selectedRow].relationshipDatasourceID;
        this.selectedDashboardPropertyID = this.navigators[this.selectedRow].propertiesDatasourceID;

        // Find the Relationship record
        let relationshipIndex: number = this.datasources.findIndex(
            ds => ds.id == this.selectedDashboardRelationshipID);
        if (relationshipIndex >= 0) {
            this.selectedRelationshipDS = this.datasources[relationshipIndex].name + ' ('
                + this.datasources[relationshipIndex].id + ')';
        } else {
            this.selectedRelationshipDS = '';
        };

            console.log('xx this.selectedRelationshipDS', this.selectedRelationshipDS)
    }

    changeSelectRelationshipDS(ev: any) {
        // User selected a Relationship DS
        this.globalFunctionService.printToConsole(this.constructor.name,'changeSelectRelationshipDS', '@Start');

        // Reset
        this.errorMessage = '';

        let selectedDashboardString: string = ev.target.value;
        if (selectedDashboardString != 'None') {

            // Get D info
            // let openBracket: number = selectedDashboardString.indexOf('(');
            // let closeBracket: number = selectedDashboardString.indexOf(')');
            // this.selectedDashboardRelationshipID = +selectedDashboardString.substring(openBracket + 1, closeBracket);
            this.selectedDashboardRelationshipID = this.constructIDfromString(
                this.selectedRelationshipDS);
    
        } else {
            this.selectedDashboardRelationshipID = null;
        };

        console.log('xx ev.target.value', ev.target.value, this.selectedDashboardRelationshipID);

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        // Reset
        this.errorMessage = '';

		this.formNavigatorEditorClosed.emit('Close');
    }

    clickAdd() {
        // Switch to add mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';
        this.selectedNetworkName = '';
        this.selectedNetworkDescription = '';
        this.selectedRelationshipDS = '';
        this.editing = true;

        this.editing = false;
    }

    clickAddSave() {
        // Add
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddSave', '@Start');

        // Validation input
        if (this.validateInput() != '') {
            return;
        };

        // Create new Network record
        let today = new Date();
        let navigatorNetworkNew: NavigatorNetwork = {
            id: null,
            name: this.selectedNetworkName,
            description: this.selectedNetworkDescription,
            accessType: '',
            relationshipDatasourceID: this.selectedDashboardRelationshipID,
            propertiesDatasourceID: this.selectedDashboardPropertyID,
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: today,
            editor: '',
            dateEdited: null
        };

        // Add to DB and locally
        this.globalVariableService.addResource('widgets', navigatorNetworkNew)
            .then(res => {
                this.navigators.push(res);
                let networkIndex: number = this.navigators.findIndex(
                    nw => nw.id == res.id
                );
                if (networkIndex >= 0) {
                    this.selectedRow = networkIndex;
                    this.clickRow(this.selectedRow, res.id);
                }
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator Editor adding navigators: ' + err);
            });

        // Back to editing
        this.editing = true;
    };

    clickSave() {
        // Save, and then close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset 
        this.errorMessage = '';

        // Validation input
        if (this.validateInput() != '') {
            return;
        };

        // Get DSs
        // let openBracket: number = this.selectedRelationshipDS.indexOf('(');
        // let closeBracket: number = this.selectedRelationshipDS.indexOf(')');
        // this.selectedDashboardRelationshipID = +this.selectedRelationshipDS.substring(openBracket + 1, closeBracket);
        this.selectedDashboardRelationshipID = this.constructIDfromString(
            this.selectedRelationshipDS);
console.log('xx this.selectedDashboardRelationshipID', this.selectedDashboardRelationshipID)
        // Validate DS as a relationship DS
        let validation: validationReturn = this.validateRelationshipDS(
            this.selectedDashboardRelationshipID);
        if (!validation.isValid) {
            this.errorMessage = validation.errorMessage;
            return;
        };


            console.log('xx this.selectedRelationshipDS', this.selectedRelationshipDS)


    //   this.formDataNetworksClosed.emit('Update');
    }

    validateInput(): string {
        // Validates the input, and returns '' / errorMessage
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessage = '';
        // Validation input
        if (this.selectedRelationshipDS == '') {
            this.errorMessage = 'The relationship Datasource is compulsory';
            return this.errorMessage;
        };

        // Else all good
        return this.errorMessage;
        
    }

    constructIDfromString(inputStringWithID: string): number {
        // Extracts the ID from a string in the format "text (id)"
        // Returns -1 if anything happened
        this.globalFunctionService.printToConsole(this.constructor.name,'constructIDfromString', '@Start');

        let openBracket: number = inputStringWithID.indexOf('(');
        let closeBracket: number = inputStringWithID.indexOf(')');
        let idString: string = inputStringWithID.substring(openBracket + 1, closeBracket);

        // Return
        if(isNaN(parseInt(idString))) {
            return -1;
        } else {
            return parseInt(idString);
        };

    }


}
