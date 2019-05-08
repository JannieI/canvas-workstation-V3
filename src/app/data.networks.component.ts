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
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }

    datasourceRelationshipNames: string[] = [];
    datasourcePropertyNames: string[] = [];
    datasources: Datasource[] = [];
    editing: boolean = true;  // TODO - must be received via @Input
    errorMessage: string = '';
    navigatorNetworks: NavigatorNetwork[] = [];
    selectedDashboardRelationshipID: number = -1;
    selectedDashboardPropertyID: number = -1;
    selectedNavigatorNetwork: NavigatorNetwork = null;
    selectedNetworkName: string = '';
    selectedNetworkDescription: string = '';
    selectedPropertyDS: string = '';
    selectedRelationshipDS: string = '';
    selectedRowID: number = -1;
    selectedRowIndex: number = 0;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get Datasource list
        this.globalVariableService.getResource('datasources')
            .then(res => {
                this.datasources = res;

                // Filter those that are relationships
                let datasourceRelationships: Datasource[] = this.datasources.filter(
                    ds => { 
                        let temp: validationReturn = this.validateRelationshipDS(ds.id);
                        if (temp.isValid) return true;
                    }
                );

                // Construct list of names and ids
                datasourceRelationships.forEach(ds => {
                    this.datasourceRelationshipNames.push(ds.name + ' (' + ds.id + ')');
                });

                this.datasourceRelationshipNames = this.datasourceRelationshipNames.sort( (obj1,obj2) => {
                    if (obj1.toLowerCase() > obj2.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.toLowerCase() < obj2.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });
                this.datasourceRelationshipNames = ['', ...this.datasourceRelationshipNames];

                // Filter those that are properties
                let datasourceProperty: Datasource[] = this.datasources.filter(
                    ds => { 
                        let temp: validationReturn = this.validatePropertyDS(ds.id)
                        if (temp.isValid) return true;
                    }
                );

                // Construct list of names and ids
                datasourceProperty.forEach(ds => {
                    this.datasourcePropertyNames.push(ds.name + ' (' + ds.id + ')');
                });

                this.datasourcePropertyNames = this.datasourcePropertyNames.sort( (obj1,obj2) => {
                    if (obj1.toLowerCase() > obj2.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.toLowerCase() < obj2.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });
                this.datasourcePropertyNames = ['', ...this.datasourcePropertyNames];
                
                // Get Networks
                this.globalVariableService.getResource('navigatorNetworks')
                    .then (nw => {
                        this.navigatorNetworks = nw;
                        
                        // Select the first nework, or be ready to Add
                        if (this.navigatorNetworks.length > 0) {
                            this.clickRow(0, this.navigatorNetworks[0].id);
                        } else {
                            this.editing = false;
                        };
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in Data.Networks reading navigatorNetworks: ' + err);
                    });
    

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
        this.selectedRowID = id;
        this.selectedRowIndex = index;

        // Show data for selected record
        this.selectedNetworkName = this.navigatorNetworks[this.selectedRowIndex].name;
        this.selectedNetworkDescription = this.navigatorNetworks[this.selectedRowIndex].description;
        this.selectedDashboardRelationshipID = this.navigatorNetworks[this.selectedRowIndex].relationshipDatasourceID;
        this.selectedDashboardPropertyID = this.navigatorNetworks[this.selectedRowIndex].propertiesDatasourceID;

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

    }

    changeSelectRelationshipDS(ev: any) {
        // User selected a Relationship DS
        this.globalFunctionService.printToConsole(this.constructor.name,'changeSelectRelationshipDS', '@Start');

        // Reset
        this.errorMessage = '';

        let selectedDashboardString: string = ev.target.value;
        if (selectedDashboardString != '') {

            // Get D info
            this.selectedDashboardRelationshipID = this.constructIDfromString(
                this.selectedRelationshipDS);
    
        } else {
            this.selectedDashboardRelationshipID = null;
        };

    }

    changeSelectPropertyDS(ev: any) {
        // User selected a Property DS
        this.globalFunctionService.printToConsole(this.constructor.name,'changeSelectPropertyDS', '@Start');
 
        // Reset
        this.errorMessage = '';

        let selectedDashboardString: string = ev.target.value;

        if (selectedDashboardString != '') {

            // Get D info
            this.selectedDashboardPropertyID = this.constructIDfromString(
                this.selectedPropertyDS);
    
        } else {
            this.selectedDashboardPropertyID = null;
        };

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        // Reset
        this.errorMessage = '';

		this.formDataNetworksClosed.emit('Close');
    }

    dblclickDeleteNetwork(index: number, networkID: number) {
        // Delete a network
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDeleteNetwork', '@Start');
    
        this.globalVariableService.deleteResource('navigatorNetworks', networkID)
            .then(res => {
                // Remove from Local & clear
                this.selectedNetworkName = '';
                this.selectedNetworkDescription = '';
                this.selectedRelationshipDS = '';
                this.selectedPropertyDS = '';
                this.navigatorNetworks = this.navigatorNetworks.filter(
                    nw => nw.id != networkID
                );

                if (this.navigatorNetworks.length > 0) {
                    this.clickRow(0, this.navigatorNetworks[0].id)
                }
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks deleting navigatorNetworks: ' + err);
            });
    }

    clickCancel() {
        // Switch to Edit mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        // Load and return
        if (this.navigatorNetworks.length > 0) {
            this.clickRow(0, this.navigatorNetworks[0].id)
        }
        this.editing = true;
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
                    this.selectedRowIndex = networkIndex;
                    this.clickRow(this.selectedRowIndex, res.id);
                }
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks adding navigatorNetworks: ' + err);
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

        // Update Network record
        let today = new Date();
        let navigatorNetworkIndex: number = this.navigatorNetworks.findIndex(
            nw => nw.id == this.selectedRowID
        );
        if (navigatorNetworkIndex < 0) {
            this.errorMessage = 'Error finding Network record';
            return;
        };

        this.navigatorNetworks[navigatorNetworkIndex].name = this.selectedNetworkName;
        this.navigatorNetworks[navigatorNetworkIndex].description = this.selectedNetworkDescription;
        this.navigatorNetworks[navigatorNetworkIndex].relationshipDatasourceID = this.selectedDashboardRelationshipID;
        this.navigatorNetworks[navigatorNetworkIndex].propertiesDatasourceID = this.selectedDashboardPropertyID;
        this.navigatorNetworks[navigatorNetworkIndex].editor = this.globalVariableService.currentUser.userID;
        this.navigatorNetworks[navigatorNetworkIndex].dateEdited = today;

        // Add to DB and locally
        this.globalVariableService.saveResource(
            'navigatorNetworks', this.navigatorNetworks[navigatorNetworkIndex]
            )
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks saving navigatorNetworks: ' + err);
            });

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

            // No fields
            if (this.datasources[relationshipIndex].dataFields == null) {
                return { 
                    isValid: false, 
                    errorMessage: 'The Datasource does not have any fields metadata' 
                };
            };

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
            isValid: true, 
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
            isValid: true, 
            errorMessage: '' 
        };
    }

}
