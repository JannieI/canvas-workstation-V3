/*
 * Shows form to manage Navigator Networks
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
import { NavigatorNetwork }           from './models';
import { Widget }                     from './models';


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

    @Output() formNavigatorEditorClosed: EventEmitter<Widget> = new EventEmitter();

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
    errorMessage: string = '';
    localWidget: Widget;
    navigators: Widget[] = [];
    navigatorNetworks: NavigatorNetwork[] = [];
    selectedNavigatorNetworkID: number = -1;
    selectedRowID: number = -1;
    selectedRowIndex: number = -1;
    selectedNetworkDescription: string = '';
    selectedNetworkName: string = '';
    selectedNetworkTitle: string = '';
    selectedNavigatorNetwork: string = '';


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        selectedWidget
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

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        // Reset
        this.errorMessage = '';

		this.formNavigatorEditorClosed.emit(null);
    }

    clickAdd() {
        // Add Navigator
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Validation input
        if (this.validateInput() != '') {
            return;
        };

        // Create new Navigator record
        let today = new Date();
        let localWidget: Widget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
        localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
        localWidget.id = null;
        localWidget.name = this.selectedNetworkName;
        localWidget.description = this.selectedNetworkDescription;
        localWidget.widgetType=='Navigator';
        localWidget.navigatorNetworkID = this.selectedNavigatorNetworkID;

        // Populate predefined dimensions, considering layouts
        if (localWidget.graphLayers[0].graphColorScheme === ''
            ||  localWidget.graphLayers[0].graphColorScheme == null) {
            localWidget.graphLayers[0].graphColorScheme = 'None';
        };
        localWidget.containerLeft = 100;
        localWidget.containerHeight = 600;
        localWidget.containerTop = 100;
        localWidget.containerWidth = 600;
        if (this.newWidgetContainerLeft > 0) {
            localWidget.containerLeft = this.newWidgetContainerLeft;
        };
        if (this.newWidgetContainerTop > 0) {
            localWidget.containerTop = this.newWidgetContainerTop;
        };

        localWidget.graphLayers.forEach(w => {
            let graphspec: string = JSON.stringify(w.graphSpecification);
            if (graphspec != null) {
                w.graphSpecification = JSON.parse(graphspec.replace("$schema","_schema"));
            };
        });

        localWidget.widgetCreatedOn = today;
        localWidget.widgetCreatedBy = this.globalVariableService.currentUser.userID;
        localWidget.widgetUpdatedOn = null;
        localWidget.widgetUpdatedBy = '';

        // Add to DB and locally
        this.globalVariableService.addResource('widgets', localWidget)
            .then(res => {

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Navigator Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                // Return to main menu
                this.formNavigatorEditorClosed.emit(localWidget);

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator Editor adding navigators: ' + err);
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

        // Update local info
        this.navigators[navigatorIndex].name = this.selectedNetworkName;
        this.navigators[navigatorIndex].description = this.selectedNetworkDescription;
        this.navigators[navigatorIndex].navigatorNetworkID = this.selectedNavigatorNetworkID;
        this.navigators[navigatorIndex].widgetUpdatedOn = today;
        this.navigators[navigatorIndex].widgetUpdatedBy = this.globalVariableService.currentUser.userID;

        // Add to DB
        this.globalVariableService.saveResource(
            'widgets', this.navigators[navigatorIndex]
            )
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator.Editor saving widgets: ' + err);
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
