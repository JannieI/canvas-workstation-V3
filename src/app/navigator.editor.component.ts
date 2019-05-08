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
    selectedNavigatorNetworkID: number = -1;
    selectedRowID: number = -1;
    selectedRowIndex: number = -1;
    selectedNetworkName: string = '';
    selectedNetworkDescription: string = '';
    selectedNavigatorNetwork: string = '';


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

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
        this.selectedRowID = id;
        this.selectedRowIndex = index;

        // Show data for selected record
        this.selectedNetworkName = this.navigators[this.selectedRowIndex].name;
        this.selectedNetworkDescription = this.navigators[this.selectedRowIndex].description;
        this.selectedNavigatorNetworkID = this.navigators[this.selectedRowIndex].navigatorNetworkID;

        // Find the Network record
        let networkIndex: number = this.navigatorNetworks.findIndex(
            nw => nw.id == this.selectedNavigatorNetworkID);
        if (networkIndex >= 0) {
            this.selectedNavigatorNetwork = this.navigatorNetworks[networkIndex].name + ' ('
                + this.navigatorNetworks[networkIndex].id + ')';
        } else {
            this.selectedNavigatorNetwork = '';
        };

    }

    changeSelectNetwork(ev: any) {
        // User selected a Network
        this.globalFunctionService.printToConsole(this.constructor.name,'changeSelectNetwork', '@Start');

        // Reset
        this.errorMessage = '';

        let selectedDashboardString: string = ev.target.value;
        if (selectedDashboardString != '') {

            // Get D info
            this.selectedNavigatorNetworkID = this.constructIDfromString(
                this.selectedNavigatorNetwork);

        } else {
            this.selectedNavigatorNetworkID = null;
        };

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
        this.selectedNavigatorNetwork = '';

        this.editing = false;
    }

    clickAddSave() {
        // Add
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddSave', '@Start');

        // Validation input
        if (this.validateInput() != '') {
            return;
        };

        // Create new Navigator record
        let today = new Date();
        let localWidget: Widget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
        localWidget.id = null;
        localWidget.navigatorNetworkID = this.selectedNavigatorNetworkID;
        localWidget.widgetCreatedOn = today;
        localWidget.widgetCreatedBy = this.globalVariableService.currentUser.userID;
        localWidget.widgetUpdatedOn = null;
        localWidget.widgetUpdatedBy = '';

        // Add to DB and locally
        this.globalVariableService.addResource('widgets', localWidget)
            .then(res => {
                this.navigators.push(res);
                let networkIndex: number = this.navigators.findIndex(
                    nw => nw.id == res.id
                );
                if (networkIndex >= 0) {
                    this.selectedRowIndex = networkIndex;
                    this.clickRow(this.selectedRowIndex, res.id);
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

        // Update Network record
        let today = new Date();
        let navigatorIndex: number = this.navigators.findIndex(
            nav => nav.id == this.selectedRowID
        );
        if (navigatorIndex < 0) {
            this.errorMessage = 'Error finding Navigator record';
            return;
        };

        let localWidget: Widget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
        this.navigators[navigatorIndex].navigatorNetworkID = this.selectedNavigatorNetworkID;
        this.navigators[navigatorIndex].widgetUpdatedOn = today;
        this.navigators[navigatorIndex].widgetUpdatedBy = this.globalVariableService.currentUser.userID;

        // Add to DB and locally
        this.globalVariableService.saveResource(
            'widgets', this.navigators[navigatorIndex]
            )
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks saving widgets: ' + err);
            });

        }

    validateInput(): string {
        // Validates the input, and returns '' / errorMessage
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessage = '';
        // Validation input
        if (this.selectedNavigatorNetwork == '') {
            this.errorMessage = 'The network is compulsory';
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
