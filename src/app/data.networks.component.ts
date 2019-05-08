/*
 * Shows form to manage Navigator Networks
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Datasource }                 from './models';
import { NavigatorNetwork }           from './models';

interface validationReturn { 
    isValid: boolean; 
    errorMessage: string 
};

@Component({
    selector: 'data-networks',
    templateUrl: './data.networks.component.html',
    styleUrls: ['./data.networks.component.css']
})

export class DataNetworksComponent implements OnInit {

    @Output() formDataNetworksClosed: EventEmitter<string> = new EventEmitter();
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

    datasourceNames: string[] = [];
    datasources: Datasource[] = [];
    editing: boolean = true;  // TODO - must be received via @Input
    errorMessage: string = '';
    navigatorNetworks: NavigatorNetwork[] = [];
    selectedDashboardRelationshipID: number = -1;
    selectedDashboardPropertyID: number = -1;
    selectedRow: number = 0;
    selectedNavigatorNetwork: NavigatorNetwork = null;
    selectedNetworkName: string = '';
    selectedNetworkDescription: string = '';
    selectedPropertyDS: string = '';
    selectedRelationshipDS: string = '';

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('navigatorNetworks')
            .then (nw => {
                this.navigatorNetworks = nw;
                
                // Select the first nework
                if (this.navigatorNetworks.length > 0) {
                    this.clickRow(0, this.navigatorNetworks[0].id);
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks reading navigatorNetworks: ' + err);
            });

        // Get Datasource list
        this.globalVariableService.getResource('datasources')
            .then(res => {
                this.datasources = res;

                let datasourceRelationships: Datasource[] = this.datasources.filter(
                    ds => { 
                        if(this.validateRelationshipDS(ds.id)) return true;
                    }
                );
                datasourceRelationships.forEach(ds => {
                    this.datasourceNames.push(ds.name + ' (' + ds.id + ')');
                });
                this.datasourceNames = this.datasourceNames.sort( (obj1,obj2) => {
                    if (obj1.toLowerCase() > obj2.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.toLowerCase() < obj2.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });
                this.datasourceNames = ['', ...this.datasourceNames];
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks reading datasources: ' + err);
            });


    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Reset
        this.errorMessage = '';

        this.selectedRow = index;

        // Show data for selected record
        console.log('xx ...', this.navigatorNetworks[this.selectedRow])
        this.selectedNetworkName = this.navigatorNetworks[this.selectedRow].name;
        this.selectedNetworkDescription = this.navigatorNetworks[this.selectedRow].description;
        this.selectedDashboardRelationshipID = this.navigatorNetworks[this.selectedRow].relationshipDatasourceID;
        this.selectedDashboardPropertyID = this.navigatorNetworks[this.selectedRow].propertiesDatasourceID;

        // Find the Relationship record
        let relationshipIndex: number = this.datasources.findIndex(
            ds => ds.id == this.selectedDashboardRelationshipID);
        if (relationshipIndex >= 0) {
            this.selectedRelationshipDS = this.datasources[relationshipIndex].name + ' ('
                + this.datasources[relationshipIndex].id + ')';
        } else {
            this.selectedRelationshipDS = '';
        };

        // Find the Property record
        let propertyIndex: number = this.datasources.findIndex(
            ds => ds.id == this.selectedDashboardPropertyID);
        if (propertyIndex >= 0) {
            this.selectedPropertyDS = this.datasources[propertyIndex].name + ' ('
                + this.datasources[propertyIndex].id + ')';
        } else {
            this.selectedPropertyDS = '';
        };

            console.log('xx this.selectedRelationshipDS', this.selectedRelationshipDS, this.selectedPropertyDS)
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

    changeSelectPropertyDS(ev: any) {
        // User selected a Property DS
        this.globalFunctionService.printToConsole(this.constructor.name,'changeSelectPropertyDS', '@Start');
 
        // Reset
        this.errorMessage = '';

        let selectedDashboardString: string = ev.target.value;

        if (selectedDashboardString != 'None') {

            // Get D info
            // let openBracket: number = selectedDashboardString.indexOf('(');
            // let closeBracket: number = selectedDashboardString.indexOf(')');
            // this.selectedDashboardPropertyID = +selectedDashboardString.substring(openBracket + 1, closeBracket);
            this.selectedDashboardPropertyID = this.constructIDfromString(
                this.selectedPropertyDS);
    
        } else {
            this.selectedDashboardPropertyID = null;
        };

        console.log('xx ev.target.value', ev.target.value, this.selectedDashboardRelationshipID);

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        // Reset
        this.errorMessage = '';

		this.formDataNetworksClosed.emit('Close');
    }

    clickAdd() {
        // Switch to add mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';
        this.selectedNetworkName = '';
        this.selectedNetworkDescription = '';
        this.selectedRelationshipDS = '';
        this.selectedPropertyDS = '';
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
        this.globalVariableService.addResource('navigatorNetworks', navigatorNetworkNew)
            .then(res => {
                this.navigatorNetworks.push(res);
                let networkIndex: number = this.navigatorNetworks.findIndex(
                    nw => nw.id == res.id
                );
                if (networkIndex >= 0) {
                    this.selectedRow = networkIndex;
                    this.clickRow(this.selectedRow, res.id);
                }
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks adding navigatorNetworks: ' + err);
            });

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

        // Find the Property record
        // openBracket = this.selectedPropertyDS.indexOf('(');
        // closeBracket = this.selectedPropertyDS.indexOf(')');
        // this.selectedDashboardPropertyID = +this.selectedPropertyDS.substring(openBracket + 1, closeBracket);
        this.selectedDashboardPropertyID = this.constructIDfromString(
            this.selectedPropertyDS);

        // Validate DS as a relationship DS
        validation = this.validatePropertyDS(this.selectedDashboardPropertyID);
        if (!validation.isValid) {
            this.errorMessage = validation.errorMessage;
            return;
        };
    


            console.log('xx this.selectedRelationshipDS', this.selectedRelationshipDS, this.selectedPropertyDS)

        // Validate DS layout

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
        if (this.selectedPropertyDS == '') {
            this.errorMessage = 'The property is Datasource compulsory';
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

    validateRelationshipDS(datasourceID: number): validationReturn {
        // Validate that the given DS ID is a valid Navigatior Relationship datasource
        // - checks the shape.  Then returns '' / errorMessage
        this.globalFunctionService.printToConsole(this.constructor.name,'validateRelationshipDS', '@Start');

        // Find the Relationship DS record
        let relationshipIndex: number = this.datasources.findIndex(
            ds => ds.id == datasourceID);
        if (relationshipIndex >= 0) {

            // Validate the schema
            // TODO - must make sure MetaData is always 100% good
            // TODO - there MUST be a better way !!!
            let isBadDS: boolean = false;
            let requiredFields: string[] = [
                'leftNodeID',
                'leftNodeType',
                'leftNodeName',
                'relationshipLeftToRight',
                'relationshipRightToLeft',
                'rightNodeID',
                'rightNodeType',
                'rightNodeName',
                'relationshipProperty'
            ];
            
            // Check if any field is missing
            requiredFields.forEach(field => {
                if (this.datasources[relationshipIndex].dataFields.indexOf(field) < 0) { 
                    isBadDS = true
                };
            });
            if (isBadDS) {
                return { 
                    isValid: false, 
                    errorMessage: 'The selected relationship Datasource does not have all the required fields' 
                };
            };

        } else {
            return { 
                isValid: false, 
                errorMessage: 'Error: the relationship Datasource ID ' 
                    + this.selectedDashboardRelationshipID.toString() + ' does not exist!' 
            };
        };

        // Return
        return { 
            isValid: false, 
            errorMessage: '' 
        };
    }

    validatePropertyDS(datasourceID: number): validationReturn {
        // Validate that the given DS ID is a valid Navigatior Property datasource
        // - checks the shape.  Then returns '' / errorMessage
        this.globalFunctionService.printToConsole(this.constructor.name,'validatePropertyDS', '@Start');

        let propertyIndex: number = this.datasources.findIndex(
            ds => ds.id == datasourceID);
        if (propertyIndex >= 0) {

            // Validate the schema
            // TODO - must make sure MetaData is always 100% good
            // TODO - there MUST be a better way !!!
            let isBadDS: boolean = false;
            let requiredFields: string[] = [
                'nodeID',
                'nodeType',
                'nodeName',
                'propertyKey',
                'propertyValue'
            ];
            
            // Check if any field is missing
            requiredFields.forEach(field => {
                if (this.datasources[propertyIndex].dataFields.indexOf(field) < 0) { 
                    console.log('xx bad field', field)
                    isBadDS = true
                };
            });
            if (isBadDS) {
                return { 
                    isValid: false, 
                    errorMessage: 'The selected property Datasource does not have all the required fields'
                };
            };

        } else {
            return { 
                isValid: false, 
                errorMessage: 'Error: the property Datasource ID '
                    + this.selectedDashboardPropertyID.toString() + ' does not exist!'
            };
        };    

        // Return
        return { 
            isValid: false, 
            errorMessage: '' 
        };
    }

}
