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
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            if (this.newWidget) {
                this.clickAdd();
            } else {
                this.clickSave();
            };
            return;
        };

    }

    navigatorNetworkNames: string[] = [];
    errorMessage: string = '';
    localWidget: Widget;
    navigators: Widget[] = [];
    navigatorNetworks: NavigatorNetwork[] = [];
    oldWidget: Widget = null;                       // W at start
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

                // Fill local Widget
                if (this.newWidget) {
                    this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
                    this.localWidget.graphLayers[0].graphSpecification =
                        this.globalVariableService.widgetNavigatorVegaSpecification;
                } else {

                    // Deep copy original W
                    this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));
                    this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget))

                    this.selectedNetworkName = this.localWidget.name;
                    this.selectedNetworkDescription = this.localWidget.description;
                    this.selectedNetworkTitle = this.localWidget.titleText;
                    this.selectedNavigatorNetworkID = this.localWidget.navigatorNetworkID;

                    let networkIndex: number = this.navigatorNetworks.findIndex(
                        nw => nw.id == this.selectedNavigatorNetworkID);
                    if (networkIndex >= 0) {
                        this.selectedNavigatorNetwork = 
                            this.navigatorNetworks[networkIndex].name + ' (' 
                            + this.selectedNavigatorNetworkID + ')';
                    };
            
                };

            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
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

        // Create new Navigator record - Take note of the specific settings !
        let today = new Date();
        this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
        this.localWidget.id = null;
        this.localWidget.name = this.selectedNetworkName;
        this.localWidget.description = this.selectedNetworkDescription;
        this.localWidget.titleText = this.selectedNetworkTitle;
        this.localWidget.navigatorSelectParentNodeType = "";
        this.localWidget.navigatorSelectParentNodeName = "";
        this.localWidget.navigatorSelectRelationship = "";
        this.localWidget.navigatorSelectView = "";
        this.localWidget.visualGrammar = "Vega";
        this.localWidget.visualGrammarType = "custom";
        this.localWidget.widgetType = 'Navigator';
        this.localWidget.navigatorNetworkID = this.selectedNavigatorNetworkID;
        this.localWidget.containerHasTitle = true;
        this.localWidget.graphLayers[0].graphMark = 'Navigator';
        // Populate predefined dimensions, considering layouts
        if (this.localWidget.graphLayers[0].graphColorScheme === ''
            ||  this.localWidget.graphLayers[0].graphColorScheme == null) {
            this.localWidget.graphLayers[0].graphColorScheme = 'None';
        };
        this.localWidget.containerLeft = 100;
        this.localWidget.containerHeight = 600;
        this.localWidget.containerTop = 100;
        this.localWidget.containerWidth = 600;
        if (this.newWidgetContainerLeft > 0) {
            this.localWidget.containerLeft = this.newWidgetContainerLeft;
        };
        if (this.newWidgetContainerTop > 0) {
            this.localWidget.containerTop = this.newWidgetContainerTop;
        };

        this.localWidget.graphLayers.forEach(w => {
            let graphspec: string = JSON.stringify(w.graphSpecification);
            if (graphspec != null) {
                w.graphSpecification = JSON.parse(graphspec.replace("$schema","_schema"));
            };
        });

        this.localWidget.widgetCreatedOn = today;
        this.localWidget.widgetCreatedBy = this.globalVariableService.currentUser.userID;
        this.localWidget.widgetUpdatedOn = null;
        this.localWidget.widgetUpdatedBy = '';

        // Add to DB and locally
        this.globalVariableService.addResource('widgets', this.localWidget)
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
                this.localWidget.id = res._id;
                this.localWidget.id = res.id;
                this.formNavigatorEditorClosed.emit(this.localWidget);

            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
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
        let today = new Date();
        this.localWidget.name = this.selectedNetworkName;
        this.localWidget.description = this.selectedNetworkDescription;
        this.localWidget.titleText = this.selectedNetworkTitle;
        this.localWidget.navigatorNetworkID = this.selectedNavigatorNetworkID;
        this.localWidget.widgetUpdatedOn = today;
        this.localWidget.widgetUpdatedBy = this.globalVariableService.currentUser.userID;

        // Add to DB
        this.globalVariableService.saveWidget(this.localWidget)
            .then(res => {

                // Action
                // TODO - cater for errors + make more generic
                let actID: number = this.globalVariableService.actionUpsert(
                    null,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    this.localWidget.id,
                    'Widget',
                    'Edit',
                    'Update Widget',
                    'W Ed clickSave',
                    null,
                    null,
                    this.oldWidget,
                    this.localWidget,
                    false               // Dont log to DB yet
                );

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Navigator Saved',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formNavigatorEditorClosed.emit(this.localWidget);

            })
                    .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
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
