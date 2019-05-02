/*
 * Manage a single Navigator component
 */

// From Angular
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

// Our Services
import { GlobalVariableService } from './global-variable.service';
import { GlobalFunctionService } from './global-function.service';

// Our Models
import { Datasource } from './models'
import { NavigatorHistory } from './models'
import { NavigatorRelationship } from './models'
import { NavigatorProperties } from './models'
import { NavigatorNodeFiler } from './models'
import { NavigatorWatchList } from './models'
import { Widget } from './models'

// Functions, 3rd Party
import { parse } from 'vega';
import { View } from 'vega';
import vegaTooltip from 'vega-tooltip';
import { ChildActivationEnd } from '@angular/router';

const MORE_TO_FILTER: string = 'Filter for more ...';

@Component({
    selector: 'widget-navigator',
    templateUrl: './widget.navigator.component.html',
    styleUrls: ['./widget.navigator.component.css']
})
export class WidgetNavigatorComponent {
    @ViewChild('dragWidget', { read: ElementRef }) dragWidget: ElementRef;  //Vega graph
    @Input() selectedWidget: Widget;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        event.preventDefault();
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown' ||
            event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            return false;
        };
    };

    // Note about the structure of the data:
    // The data for the Networks are stored locally in the this.networks variable, and
    // in a DS in the Database, lets call it DSn.  DSn has a property subDatasources[],
    // subDS.  These point to the rest of the DSs used in a network:
    //  - DSn = network name, description, access, etc
    //  - subDS[0] = id of the DS that keeps the relationships, say DSrel.
    //  - subDS[1] = id of the DS that keeps the Node properties, say DSpr.
    //
    // The folowing shapes are temporary, and only used in this routine (not stored in the DB):
    //  - NavigatorHistory
    //  - NavigatorNodeFiler
    errorMessage: string = '';                          // Error on form
    graphData: any[] = [];                              // data formatted for Vega
    graphDataLength: number = 0;

    ngCustomViews:
        {
            id: number;
            name: string;
            description: string;
        }[] = [];                                              // Custom Views
    ngNetworks: Datasource[] = [];                      // All Networks (DS with isNetwork = True)
    ngHistory: NavigatorHistory[] = [];                 // History for current network
    historyAll: NavigatorHistory[] = [];                // All history for All networks

    networkRelationships: NavigatorRelationship[] = []; // Data with Node-Relationship-Node DSrel
    networkProperties: NavigatorProperties[] = [];      // Data with Node-PropertyKeyValye DSprop
    ngDropdownParentNodeTypes: string[] = [];           // Dropdown: Parent Node Types
    ngDropdownParentNodes: string[] = [];               // Dropdown: Parent Nodes
    ngDropdownRelationships: string[] = [];             // Dropdown: Relationships
    ngNodeProperties: string[] = [];                    // Dropdown: Properties per Parent Node Type

    selectedCustomViewID: number = -1;                  // Select Custom View ID
    selectedNetworkID: number = -1;                     // Select NW ID
    selectedNetworkRelationshipID: number = -1;         // DSid for DSrel
    selectedNetworkPropertiesID: number = -1;           // DSid for DSprop
    selectedHistoryID: number = -1;                     // History ID
    selectedAdditonalProperty: string = '';             // Property to shown with Nodes in graph
    selectedView: string = 'DefaultView';               // Selected View Name
    isViewsDisabled: boolean = false;                   // True if all views are disabled

    // Selected - value selected in a dropdown
    selectedParentNodeType: string = '';                // Dropdown: selected Parent Node Type
    selectedParentNode: string = '';                    // Dropdown: selected Parent Node
    selectedRelationship: string = '';                  // Dropdown: selected Relationship
    selectedChildFilterID: number = -1;
    selectedParentFilterID: number = -1;

    startupNavigatorSelectParentNodeType: string = '';  // Startup value of the Parent Node Type
    startupNavigatorSelectParentNodeName: string = '';  // Startup value of the Parent Node Name
    startupNavigatorSelectRelationship: string = '';    // Startup value of the Relationship
    startupNavigatorSelectView: string = '';            // Startup value of the View

    watchList: NavigatorWatchList[] = [];               // Watchlist per user and per NodeType

    ngParentNodeFilterKeyDropdown: string[] = [];       // Dropdown: Parent Nodes Keys Filter
    ngParentNodeFilterPropertyDropdown: string[] = [];  // Dropdown: Parent Nodes Properties Filter
    ngParentNodeFilterSelectedFieldName: string = '';   // Parent Node Filter
    ngParentNodeFilterSelectedOperator: string = 'Equal';    // Parent Node Filter
    ngParentNodeFilterSelectedValue: string = '';       // Parent Node Filter
    parentNodesFilteredList: string[] = [];             // List of Nodes, after filtered on NodeProperties

    ngSelectedRelationshipFilterRole: string = '';      // Relationship Role Filter
    relationshipsFilteredList: string[] = [];           // List of Relationships, after filtered on NodeProperties

    ngChildNodeFilterDropdown: string[] = [];           // Dropdown: Child Nodes Filter
    ngChildNodeFilterSelectedFieldName: string = '';    // Child Node Filter
    ngChildNodeFilterSelectedOperator: string = '';     // Child Node Filter
    ngChildNodeFilterSelectedValue: string = '';        // Child Node Filter
    ngChildFilterShowTop: string = '';                  // Show top n Child Nodes
    ngChildFilterSortFieldName: string = '';            // Sort Child Nodes
    childNodesFilteredList: string[] = [];              // List of Nodes, after filtered on NodeProperties

    // Working
    childDataAll: string[] = [];                        // List of ALL children after filter (ie all levels)
    childDataVisible: any[] = [];                       // Visible children, based on nrShown
    childNodeFilter: NavigatorNodeFiler[] = [];         // Actual Filter
    childFilterErrorMessage: string = '';
    filterID: number = -1;
    firstAdjacencyCellRowNr: number = -1;
    historyBackIndex: number = 0;                       // Note: this initial value is important
    parentFilterErrorMessage: string = '';              // Error Msg
    parentNodeFilter: NavigatorNodeFiler[] = [];        // Actual Filter
    ngRelationshipRoles: string[] = [];
    relationshipFilterErrorMessage: string = '';
    routesPerNode: any[] = [];                          // Array of routes with one starting point
    visibleNumberChildrenShownInput: number = 12;
    visibleNumberChildrenShown: number = 12;
    visibleNumberChildrenStart: number = 0;

    // Graph dimensions
    graphHeight: number = 400;          // TODO - fill this into Spec
    graphWidth: number = 400;           // TODO - fill this into Spec
    graphLevels: number = 2;            // Nr of levels in the graph (1 level = Parent-Relationship-Child)
    graphLevelsMax: number = 10;        // Max Nr of levels allowed per graph

    // Form layout and elements
    graphNotes: string = 'Optional Additional information';
    graphTitle: string = 'Directors for Absa, filtered by age (9/24)';
    showHistory: boolean = false;
    showNetwork: boolean = false;       // Show Network popup
    showCustomView: boolean = false;    // Show Custom View popup
    showAdditionalLevelForRelationships: boolean = false;     // True to add level to graph with all Relationships
    showAdditionalLevelForRoles: boolean = false;             // True to add level to graph with Relationship Roles
    showProperty: boolean = false;          // True to show selected Property with Nodes in graph

    // Widget and Graph (Vega)
    localWidget: Widget;                            // W to modify, copied from selected
    showSpecificGraphLayer: boolean = false;
    specification: any;             // Full spec for Vega, or other grammar

    // Popups and forms
    commonParentSelected: { 
        childNode: string; 
        isSelected: boolean;
    }[] = [];
    showCommonParent: boolean = false;
    showDistanceFromNode: boolean = false;
    showCommonNode: boolean = false;
    showGraphHelp: boolean = false;
    showGraphNotes: boolean = false;
    showGraphProperties: boolean = false;
    showNavBarExplore: boolean = true;
    spinner: boolean = false;
    watchListFiltered: boolean = false;


    navMaxRecursion: number = 100;
    navRecursionCounter: number = 0;
    navVisitedNodes: string[] = [];
    openState: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructor', '@Start');

    }

    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

        // Deep copy Local W
        this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Load startup values
        this.startupNavigatorSelectParentNodeType = this.localWidget.navigatorSelectParentNodeType;
        this.startupNavigatorSelectParentNodeName = this.localWidget.navigatorSelectParentNodeName;
        this.startupNavigatorSelectRelationship = this.localWidget.navigatorSelectRelationship;
        this.startupNavigatorSelectView = this.localWidget.navigatorSelectView;

        // Populate persisted data - TODO via DB
        this.tempCreateDummyData();

        // Read DS for all Networks from DB
        this.globalVariableService.getResource('datasources', 'filterObject={"isNetworkShape": true}')
            .then(res => {
                this.ngNetworks = res;
                console.log('xx this.ngNetworks', this.ngNetworks)
                // Find DS for selected W inside Networks
                let networkIndex: number = this.ngNetworks.findIndex(
                    nw => nw.id == this.localWidget.datasourceID);

                // Select the network for the current W, else the first one
                if (this.ngNetworks.length > 0) {
                    if (networkIndex >= 0) {
                        this.selectedNetworkID = this.ngNetworks[networkIndex].id;

                        this.clickNetwork(networkIndex, this.selectedNetworkID);
                    } else {
                        this.clickNetwork(0, this.ngNetworks[0].id);
                    };
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator.OnInit reading datasources: ' + err);
            });

    }

    clickMenuShowNetworks() {
        // Clicked Menu to open form on which to select a new network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowNetworks', '@Start');

        this.showNetwork = true;
    }

    clickMenuShowHistory() {
        // Click the menu to open Navigated History popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowHistory', '@Start');

        this.showHistory = true;
    }

    clickMenuShowGraphProperties() {
        // Clicked Menu to open popup to edit graph properties like title
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowGraphProperties', '@Start');

        // Show current values
        // this.visibleNumberChildrenShownInput = this.visibleNumberChildrenShown;

        this.showGraphProperties = true;
    }

    clickMenuShowGraphNotes() {
        // Clicked the Menu to show popup to edit notes at bottom of graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowGraphNotes', '@Start');

        this.showGraphNotes = true;
    }

    clickMenuShowGraphHelp() {
        // Clicked Menu to show popup with help information
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowGraphHelp', '@Start');

        this.showGraphHelp = true;
    }

    clickClearHistory() {
        // Clear history for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickClearHistory', '@Start');

        this.ngHistory = this.ngHistory.filter(h => h.networkID != this.selectedNetworkID);
        this.historyAll = this.historyAll.filter(h => h.networkID != this.selectedNetworkID);
    }

    clickMenuExportGraph() {
        // Export the current graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuExportGraph', '@Start');

        let fileName: string = 'Nav Network'
        let newW: Widget = JSON.parse(JSON.stringify(this.selectedWidget));
        newW.dataFiltered = [];
        var obj = JSON.stringify(newW);

        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u, ' + encodeURIComponent(JSON.stringify(obj)));
        a.setAttribute('download', fileName);
        a.click()

    }

    clickCloseCustomViewPopup() {
        // Close CustomView popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseCustomViewPopup', '@Start');

        this.showCustomView = false;

    }

    clickCloseNetworksPopup() {
        // Close network popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseNetworksPopup', '@Start');

        this.showNetwork = false;

    }

    clickCloseHistoryPopup() {
        // Close Navigated History popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseHistoryPopup', '@Start');

        this.showHistory = false;

    }

    dblclickDeleteHistory(index: number, historyID: number) {
        // Delete selected history row.  If current, move to first
        this.globalFunctionService.printToConsole(this.constructor.name, 'dblclickDeleteHistory', '@Start');

        this.ngHistory = this.ngHistory.filter(h => h.id != historyID);
        this.historyAll = this.historyAll.filter(h => h.id != historyID);

        // Reset to first one
        this.selectedHistoryID = -1;

        if (this.ngHistory.length > 0) {
            this.selectedHistoryID = this.ngHistory[0].id
        };

    }

    clickCloseGraphPropertiesPopup(index: number, historyID: number) {
        // Delete selected history row.  If current, move to first
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseGraphPropertiesPopup', '@Start');

        this.showGraphProperties = false;

    }

    clickGraphPropertiesCancel(){
        // Close Graph Property popup without saving changes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickGraphPropertiesCancel', '@Start');

        this.showGraphProperties = false;

    }

    clickGraphPropertiesSave(){
        //  Save changes and then Close Graph Property popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickGraphPropertiesSave', '@Start');

        this.visibleNumberChildrenShown = this.visibleNumberChildrenShownInput;
        this.showGraphProperties = false;

        // Refresh graph
        this.checkShowGraph()
    }

    clickCloseGraphNotesPopup() {
        // Close popup to edit notes at bottom of graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseGraphNotesPopup', '@Start');

        this.showGraphNotes = false;
    }

    clickCloseHelpPopup() {
        // Close popup to edit notes at bottom of graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseHelpPopup', '@Start');

        this.showGraphHelp = false;
    }

    clickAdditionalPropertyClear() {
        // Clear Properties from Nodes, shown in brackets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalPropertyClear', '@Start');

        this.selectedAdditonalProperty = '';

        this.checkShowGraph();
    }

    clickAdditionalPropertyShow() {
        // Show selected Property in brackets with Nodes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalPropertyShow', '@Start');

        this.checkShowGraph();

    }

    clickNetwork(index: number, networkID: number) {
        // Clicked a network (or called from ngOnInit)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNetwork', '@Start');

        // Reset
        this.errorMessage = '';
        this.parentFilterErrorMessage = '';
        this.childFilterErrorMessage = '';

        // Remember the ID of the selected Network
        this.selectedNetworkID = networkID;

        // Read the Data for this W from the DB
        if (this.selectedNetworkID >= 0) {

            if (this.ngNetworks[index].subDatasources.length != 2) {
                // TODO - make friendly
                console.log('ERROR ...')
            } else {

                this.selectedNetworkRelationshipID = this.ngNetworks[index].subDatasources[0];
                this.globalVariableService.getData(
                    'datasourceID=' + this.selectedNetworkRelationshipID.toString()
                )
                    .then(res => {
                        this.networkRelationships = res;

                        // Fill ParentNode type Dropdown
                        this.ngDropdownParentNodeTypes = this.distinctNodeTypes();
                        this.ngDropdownParentNodeTypes = ['', ...this.ngDropdownParentNodeTypes];

                        this.selectedNetworkPropertiesID = this.ngNetworks[index].subDatasources[1];
                        this.globalVariableService.getData(
                            'datasourceID=' + this.selectedNetworkPropertiesID.toString()
                        )
                            .then(res => {
                                this.networkProperties = res;

                                // Disable Views
                                this.isViewsDisabled = true;

                                // Dropdown
                                this.ngNodeProperties = this.distinctNodeProperties();
                                this.ngNodeProperties = ['', ...this.ngNodeProperties];

                                // Clear the rest & reset pointers
                                this.ngDropdownParentNodes = [];
                                this.ngDropdownRelationships = [];
                                this.parentNodeFilter = [];
                                this.childNodeFilter = [];

                                this.selectedParentNodeType = '';
                                this.selectedParentNode = '';
                                this.selectedRelationship = '';
                                this.selectedParentFilterID = -1;
                                this.selectedChildFilterID = -1;

                                // On startup
                                if (this.startupNavigatorSelectParentNodeType != '') {
                                    this.selectedParentNodeType = this.localWidget.navigatorSelectParentNodeType;
                                    this.startupNavigatorSelectParentNodeType = '';
                                    let ev: any = {
                                        target: {
                                            value: this.selectedParentNodeType
                                        }
                                    };
                                    this.changeParentNodeType(ev);

                                    if (this.startupNavigatorSelectParentNodeName != '') {
                                        this.selectedParentNode = this.startupNavigatorSelectParentNodeName;
                                        this.startupNavigatorSelectParentNodeName = '';
                                    };
                                    if (this.startupNavigatorSelectRelationship != '') {
                                        this.selectedRelationship = this.startupNavigatorSelectRelationship;
                                        this.startupNavigatorSelectRelationship = '';
                                        if (this.selectedRelationship != 'All'
                                            &&
                                            this.selectedRelationship != ''
                                            &&
                                            this.selectedParentNode != ''
                                            ) {
                                            this.ngRelationshipRoles = this.distinctRelationshipRoles(
                                                this.selectedParentNode, this.selectedRelationship);
                                        };
                                    };
                                    if (this.startupNavigatorSelectView != '') {
                                        this.selectedView = this.startupNavigatorSelectView;
                                        this.startupNavigatorSelectView = '';
                                        this.clickDefaultView();
                                    };
                                    console.log('xx this.selectedView', this.selectedView )

                                };


                                this.ngHistory = this.historyAll
                                    .filter(h => h.networkID === networkID)
                                    .sort((a, b) => {
                                        if (a.id < b.id) {
                                            return 1;
                                        };
                                        if (a.id > b.id) {
                                            return -1;
                                        };
                                        return 0;
                                    });

                                // Click the first row
                                if (this.ngHistory.length > 0) {
                                    this.clickHistory(0, this.ngHistory[0].id);
                                } else {
                                    // Clear the graph
                                    this.selectedView = 'SummaryView';
                                    this.clickNetworkSummaryView();
                                };

                                // Close Navigated popup
                                this.showHistory = false;
                            })
                            .catch(err => {
                                this.errorMessage = err.slice(0, 100);
                                console.error('Error in Navigator.OnInit reading clientData: ' + err);
                            });
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in Navigator.OnInit reading clientData: ' + err);
                    });

            };
        };

    }

    clickSelectHistory(index: number, historyID: number) {
        // Highlight selected row in istory
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickSelectHistory', '@Start');

        this.selectedHistoryID = historyID;
    }

    clickHistoryBack() {
        // Go back to previous history
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHistoryBack', '@Start');

        if (this.ngHistory.length > 1) {
            this.historyBackIndex = this.historyBackIndex + 1;
            if (this.historyBackIndex >= this.ngHistory.length) {
                this.historyBackIndex = 0;
            };
            this.selectedHistoryID = this.ngHistory[this.historyBackIndex].id;

            this.clickHistory(this.historyBackIndex, this.selectedHistoryID);
        };

    }

    clickHistory(index: number, historyID: number) {
        // Click a point in history, and show that graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHistory', '@Start');

        // Set the history id, selected fields
        this.selectedParentNodeType = this.ngHistory[index].parentNodeType;
        this.selectedParentNode = this.ngHistory[index].parentNode;
        this.selectedRelationship = this.ngHistory[index].relationship;
        this.showAdditionalLevelForRoles = this.ngHistory[index].showRoles;
        this.showAdditionalLevelForRelationships = this.ngHistory[index].showRelationships;
        this.selectedView = this.ngHistory[index].view;

        // Set the selected history ID
        this.selectedHistoryID = historyID;

        // Close Hisotory popup in case it is open
        this.showHistory = false;

        // Show the graph
        this.checkShowGraph(false);
    }

    clickShowCustomView(index: number, customViewID: number) {
        // Show selected Custom View
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickShowCustomView', '@Start');

        this.selectedCustomViewID = customViewID;
        this.checkShowGraph();

        this.showCustomView = false;
    }

    changeParentNodeType(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentNodeType', '@Start');

        // Set selected Nodes
        this.selectedParentNodeType = ev.target.value;

        if (this.selectedParentNodeType === '') {
            return;
        };

        // Fill Dropdowns
        this.ngDropdownParentNodes = this.distinctNodesPerNodeType(this.selectedParentNodeType);
        this.ngDropdownParentNodes = ['', 'All', ...this.ngDropdownParentNodes];

        // Fill Relationships Dropdown
        this.ngDropdownRelationships = this.distinctRelationships(this.selectedParentNodeType, 'All');
        this.ngDropdownRelationships = ['All', ...this.ngDropdownRelationships];

        // Reduce size of Dropdown
        if (this.ngDropdownRelationships.length > 20) {
            this.ngDropdownRelationships = [...this.ngDropdownRelationships.slice(0, 20), MORE_TO_FILTER]
        };

        // Clear Relationship roles
        this.ngRelationshipRoles = [];

        // Clear all Filters
        this.clickParentFilterClear();
        this.clickRelationshipFilterClear();
        this.clickChildFilterClear();

        // Set Parent Node Property Filter properties
        this.ngParentNodeFilterKeyDropdown = this.networkProperties
            .filter(np => np.nodeType == this.selectedParentNodeType && np.propertyKey != '')
            .map(np => np.propertyKey);
        this.ngParentNodeFilterKeyDropdown = this.navUniqifySortNodes(this.ngParentNodeFilterKeyDropdown);

        // Reset filter properties
        this.ngParentNodeFilterPropertyDropdown = [];

        // Reset
        this.visibleNumberChildrenStart = 0;

    }

    changeParentNode(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentNode', '@Start');

        this.selectedParentNode = ev.target.value;

        // More clicked
        if (this.selectedParentNode === MORE_TO_FILTER) {
            return;
        };

        // Clear child filter
        this.clickChildFilterClear();

        // Reset
        this.visibleNumberChildrenStart = 0;
        if (this.selectedRelationship != 'All'
            &&
            this.selectedRelationship != ''
            &&
            this.selectedParentNode != ''
            ) {
            this.ngRelationshipRoles = this.distinctRelationshipRoles(
                this.selectedParentNode, this.selectedRelationship);
        };

        // Show graph if all 3 selected
        this.checkShowGraph();
    }

    changeRelationship(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeRelationship', '@Start');

        this.selectedRelationship = ev.target.value;

        // Reset
        this.visibleNumberChildrenStart = 0;
        this.ngRelationshipRoles = [];
        this.showAdditionalLevelForRoles = false;

        // Clear child filter
        this.clickChildFilterClear();

        // Get Relationship Roles
        if (this.selectedRelationship != 'All'
            &&
            this.selectedRelationship != ''
            &&
            this.selectedParentNode != ''
            ) {
            this.ngRelationshipRoles = this.distinctRelationshipRoles(
                this.selectedParentNode, this.selectedRelationship);
        };

        // Show graph if all 3 selected
        this.checkShowGraph();

    }

    checkShowGraph(addToHistory: boolean = true) {
        // Check if all selected; then show graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'checkShowGraph', '@Start');

        // Switch view from network if last field filled in
        if (this.selectedView === 'SummaryView'
            &&
            this.selectedParentNodeType != ''
            &&
            this.selectedParentNode != ''
            &&
            this.selectedRelationship != '') {

            this.selectedView = 'DefaultView';
        };

        // Network view is always available
        if (this.selectedView === 'SummaryView') {
            this.createGraphDataSummaryView();
        } else {

            // Show the graph when all fields selected
            if (this.selectedParentNodeType != ''
                &&
                this.selectedParentNode != ''
                &&
                this.selectedRelationship != '') {

                // Build the data for the Graph based on the selection and graph type
                switch (this.selectedView) {
                    case 'DefaultView': {
                        this.createGraphDefaultView(0, 0, addToHistory);
                        break;
                    }
                    case 'CommonParentView': {
                        this.createGraphCommonParentView();
                        break;
                    }
                    case 'CommonNodeView': {
                        this.createGraphCommonNodeView();
                        break;
                    }
                    case 'DistanceView': {
                        this.createGraphDistanceView();
                        break;
                    }
                    case 'CustomView': {
                        this.createGraphCustomView();
                        break;
                    }
                    case 'NodeTypeView': {
                        this.createGraphNodeTypeView();
                        break;
                    }

                    default: {
                        // Unknown
                        console.log('Error - unknown selectedView value:', this.selectedView);
                        break;
                    }
                };
            };
        };

        // Show the graph
        this.showGraph();

    }

    createGraphDefaultView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphDefaultView', '@Start');
        console.log('xx createGraphDefaultView ', addToHistory)
        // Build data and graph if all parent & relationship fields selected
        if (this.selectedParentNodeType != ''
            && this.selectedParentNode != ''
            && this.selectedRelationship != '') {

            // Set title, etc
            if (this.showAdditionalLevelForRoles  ||  this.showAdditionalLevelForRelationships) {
                this.graphTitle = '*';
            } else {
                this.graphTitle = '';
            };

            this.graphTitle = this.graphTitle +
                this.selectedRelationship=='All'?  'All relationships'
                :  this.selectedRelationship + '(s)';
            this.graphTitle = this.graphTitle + ' for '
                + this.selectedParentNode;
            if (this.ngChildNodeFilterSelectedFieldName != '') {
                this.graphTitle = this.graphTitle + ', filtered on ' + this.ngChildNodeFilterSelectedFieldName;
            };

            // Format the graphData
            this.graphData = this.constructGraphDataForUnit(
                this.selectedParentNode,
                [this.selectedRelationship],
                this.showAdditionalLevelForRelationships?  true  :  false,
                this.showAdditionalLevelForRoles?  true  :  false
            );

            // Add to History
            // TODO - keep ParentNodeID of selected for here
            // TODO - cater for more than 1 Filter; Parent and Child
            if (addToHistory
                && this.selectedParentNodeType != ''
                && this.selectedParentNode != ''
                && this.selectedRelationship != '') {
                let parentFilterFieldName: string = '';
                let parentFilterOperator: string = '';
                let parentFilterValue: string = '';
                let childFilterFieldName: string = '';
                let childFilterOperator: string = '';
                let childFilterValue: string = '';
                if (this.parentNodeFilter.length > 0) {
                    parentFilterFieldName = this.parentNodeFilter[0].field;
                    parentFilterOperator = this.parentNodeFilter[0].operator;
                    parentFilterValue = this.parentNodeFilter[0].value;

                };
                if (this.childNodeFilter.length > 0) {
                    childFilterFieldName = this.childNodeFilter[0].field;
                    childFilterOperator = this.childNodeFilter[0].operator;
                    childFilterValue = this.childNodeFilter[0].value;

                };
                console.log('xx 7')
                // Add history
                this.selectedHistoryID = this.ngHistory.length;
                let historyNew: NavigatorHistory =
                {
                    id: this.selectedHistoryID,
                    text: this.graphTitle,
                    networkID: this.selectedNetworkID,
                    parentNodeID: null,
                    parentNodeType: this.selectedParentNodeType,
                    parentNode: this.selectedParentNode,
                    relationship: this.selectedRelationship,
                    showRoles: this.showAdditionalLevelForRoles,
                    showRelationships: this.showAdditionalLevelForRelationships,
                    parentNodeFiler:
                    {
                        id: 0,
                        field: parentFilterFieldName,
                        operator: parentFilterOperator,
                        value: parentFilterValue
                    },
                    childNodeFiler:
                    {
                        id: 0,
                        field: childFilterFieldName,
                        operator: childFilterOperator,
                        value: childFilterValue
                    },
                    view: this.selectedView
                };
                this.ngHistory = [historyNew, ...this.ngHistory];
                this.historyAll = [historyNew, ...this.historyAll];
                console.log('xx 8', this.ngHistory, this.showAdditionalLevelForRelationships,
                this.showAdditionalLevelForRoles)
            };

            // Set H & W
            if (inputHeight != 0) {
                this.graphHeight = inputHeight;
            } else {
                if (this.localWidget.graphLayers.length > 0) {
                    this.graphHeight = this.localWidget.graphLayers[0].graphSpecification.height;
                };
            };
            if (this.graphHeight < 100) {
                this.graphHeight = 100;
            };
        } else {
            this.graphTitle = '';
            console.log('xx 9')
            // Set data
            this.graphData = [];
            this.graphData.push(
                {
                    "id": 1,
                    "name": "Select a Parent using the dropdowns at the top"
                });
        };

        // Set H & W
        if (inputWidth != 0) {
            this.graphWidth = inputWidth;
        } else {
            if (this.localWidget.graphLayers.length > 0) {
                this.graphWidth = this.localWidget.graphLayers[0].graphSpecification.width;
            };
        };
        if (this.graphWidth < 100) {
            this.graphWidth = 100;
        };
    }

    createGraphDataSummaryView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphDataSummaryView', '@Start');

        let networkIndex: number = this.ngNetworks.findIndex(nw => nw.id == this.selectedNetworkID);

        // No network selected
        if (networkIndex < 0) {
            return;
        };

        // Find unique Nodes
        let uniqueNodeTypes: string[] = this.distinctNodeTypes();

        // Count relationships
        let nodeCount: number = -1;
        let uniqueNodesWithCount: { nodeType: string; nodeCount: number }[] = [];
        for (var i = 0; i < uniqueNodeTypes.length; i++) {
            nodeCount = this.networkRelationships.filter(x => x.leftNodeType == uniqueNodeTypes[i]).length;
            console.log('xx nodeCount', nodeCount)
            nodeCount = nodeCount + this.networkRelationships
                .filter(x => x.rightNodeType == uniqueNodeTypes[i]).length;
            uniqueNodesWithCount.push(
                {
                    nodeType: uniqueNodeTypes[i],
                    nodeCount: nodeCount
                });
        };
        console.log('xx uniqueNodesWithCount', uniqueNodesWithCount)
        // Set data
        this.graphData = [];
        this.graphData.push(
            {
                "id": 1,
                "name": "Summary"
            });
        for (var i = 0; i < uniqueNodeTypes.length; i++) {

            this.graphData.push(
                {
                    id: i + 2,
                    name: uniqueNodesWithCount[i].nodeType + ' ('
                        + uniqueNodesWithCount[i].nodeCount.toString() + ')',
                    parent: 1
                }
            );
        };

        // Set info
        this.graphTitle = 'Summary of ' + this.ngNetworks[networkIndex].name;
        this.graphDataLength = 2;
        this.calcGraphDataDimensions(2);

        // Dimension it
        this.graphHeight = 400; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 400; //this.localWidget.graphLayers[0].graphSpecification.width;

    }

    createGraphCommonParentView(
        inputHeight: number = 0, 
        inputWidth: number = 0, 
        addToHistory: boolean = true
        ) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphCommonParentView', '@Start');

        // Reset
        this.graphData = [];

        let childNodesSelected: string[] = this.commonParentSelected
            .filter(cp => cp.isSelected)
            .map(cp => cp.childNode);
        console.log('xx this.childNodesSelected', childNodesSelected)

        if (childNodesSelected.length > 0) {

            this.graphData = this.constructGraphDataForCommonParents(childNodesSelected);

            // TODO
            // 1. add to History
            // 2. Set H & W
            if (inputWidth != 0) {
                this.graphWidth = inputWidth;
            } else {
                if (this.localWidget.graphLayers.length > 0) {
                    this.graphWidth = this.localWidget.graphLayers[0].graphSpecification.width;
                };
            };
            if (this.graphWidth < 100) {
                this.graphWidth = 100;
            };

            // Set info
            this.graphTitle = 'Common parent view';
            this.graphDataLength = this.graphData.length;
            this.calcGraphDataDimensions(this.graphData.length);

        };

    }

    createGraphCommonNodeView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphCommonNodeView', '@Start');

        // Reset
        this.graphData = [];

        console.log('xx this.childDataAll', this.childDataAll)

        if (this.childDataAll.length > 0) {

            this.graphData = this.constructGraphDataForCommonNode(
                'Mr van Wyk, Rene', this.childDataAll);

            // TODO
            // 1. add to History
            // 2. Set H & W
            if (inputWidth != 0) {
                this.graphWidth = inputWidth;
            } else {
                if (this.localWidget.graphLayers.length > 0) {
                    this.graphWidth = this.localWidget.graphLayers[0].graphSpecification.width;
                };
            };
            if (this.graphWidth < 100) {
                this.graphWidth = 100;
            };

            // Set info
            this.graphTitle = 'Common Node view';
            this.graphDataLength = this.graphData.length;
            this.calcGraphDataDimensions(this.graphData.length);

        };

    }

    createGraphDistanceView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphDistanceView', '@Start');

        this.nav2WalkInPath(null, 'Mr van Wyk, Rene', "Director Of", 0, [])
        console.log('xx @END of createGraphDistanceView', this.routesPerNode)

        this.graphData = [];
        this.graphData.push({
            id: 1,
            name: 'Distance'
        });

        let nodeCount: number = 0;
        let nodeID: number = 0;
        let nodeParentID: number = 0;

        this.routesPerNode.forEach(route => {
            // Add to parent
            for (var i = 0; i < route.length; i++) {
                nodeID = nodeCount + i + 2;
                if (i == 0) {
                    nodeParentID = 1;
                } else {
                    nodeParentID = nodeID - 1;
                };

                this.graphData.push({
                    id: nodeID,
                    name: this.constructNodeName(route[i]),
                    parent: nodeParentID
                });
            };
            nodeCount = route.length;
        });

        // Set info
        this.graphTitle = 'Distance view';
        this.graphDataLength = this.routesPerNode.length;
        this.calcGraphDataDimensions(this.routesPerNode.length);

    }

    createGraphCustomView() {
        // Create the data for the Custom view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphCustomView', '@Start');

        // Find record in list
        let customeViewIndex: number = this.ngCustomViews
            .findIndex(cv => cv.id == this.selectedCustomViewID);

        if (this.selectedCustomViewID == -1
            ||
            this.selectedCustomViewID == null
            ||
            customeViewIndex == -1) {
            this.graphTitle = 'Unknown Custom View ID'
            return;
        };

        // Setup
        let customViewName: string = this.ngCustomViews[customeViewIndex].name;
        this.graphData = [];

        if (this.selectedCustomViewID = 1) {

            // Set title and list of parents
            this.graphTitle = customViewName;
            let distinctParents: string[] = this.distinctParentNodes(
                'Mr van Wyk, Rene',
                ['All'],
                'All'
                );
            console.log('xx distinctParents', distinctParents)

            // Construct graph data
            this.graphData = [];
            this.graphData.push({
                id: 1,
                name: 'Common Parents'
            });

            let nodeCount: number = 0;

            distinctParents.forEach(par => {

                // Add to parent
                nodeCount = nodeCount + 1;
                this.graphData.push({
                    id: nodeCount + 1,
                    name: this.constructNodeName(par),
                    parent: 1
                });
            });

            // Set info
            this.graphTitle = 'Distance view';
            this.graphDataLength = this.graphData.length;
            this.calcGraphDataDimensions(this.graphData.length);


        };
        if (this.selectedCustomViewID = 2) {
            this.graphTitle = customViewName;

        };
        if (this.selectedCustomViewID = 3) {
            this.graphTitle = customViewName;

        };
        if (this.selectedCustomViewID = 4) {
            this.graphTitle = customViewName;

        };
        if (this.selectedCustomViewID = 5) {
            this.graphTitle = customViewName;

        };
        if (this.selectedCustomViewID = 6) {
            this.graphTitle = customViewName;

        };
    }

    createGraphNodeTypeView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphNodeTypeView', '@Start');

    }

    showGraph(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Re-create the Vega spec, and show the graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'showGraph', '@Start');

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight - 20,  // 280
            this.graphWidth - 20,  // 280
            this.showSpecificGraphLayer,
            0
        );
        console.log('xx this.specification', this.graphTitle, this.graphData, this.specification)

        // Load the data
        this.specification['data'][0]['values'] = this.graphData;
        this.specification['title'] = this.graphTitle;

        // TODO - decide if we need to update the Widget Data too ?
        // this.specification.graphLayers[0].graphSpecification.data = this.graphData;

        // Render in DOM
        let view = new View(parse(this.specification));

        // JS trick to reference outside scope from inside that callback
        var that = this;
        view.addEventListener('click', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            let childNodeClicked: string = datumClick.name;

            // TODO - is it safe to use a ( ?
            if (childNodeClicked.indexOf('(') >= 0) {
                childNodeClicked = childNodeClicked.slice(0, childNodeClicked.indexOf('(') - 1);
            };

            console.log('XX CLICKED ', childNodeClicked, that.selectedView)
            // this.selectedParentNodeType = this.selectedParentNodeType.bind(this);

            // Network Summary -> Fill Node Type
            if (that.selectedView === 'SummaryView') {
                console.log('xx summ View')
                that.selectedParentNodeType = childNodeClicked;
                that.selectedParentNode = '';
                that.selectedRelationship =  '';
                let ev: any = {
                    target: {
                        value: childNodeClicked
                    }
                };

                that.changeParentNodeType(ev);
            } else {
                // Find Child in list of visible children
                let childClickedNodeType: string = '';
                let childClickedIndex: number = that.networkRelationships.findIndex(
                    nr => nr.leftNodeName === childNodeClicked
                );
                if (childClickedIndex >= 0) {
                    childClickedNodeType = that.networkRelationships[childClickedIndex]
                        .leftNodeType;
                } else {
                    childClickedIndex = that.networkRelationships.findIndex(
                        nr => nr.rightNodeName === childNodeClicked
                    );
                    if (childClickedIndex >= 0) {
                        childClickedNodeType = that.networkRelationships[childClickedIndex]
                            .rightNodeType;
                    };
                };
                console.log('xx childClicked', childClickedNodeType, childNodeClicked)

                if (childClickedNodeType != '') {
                    that.selectedParentNodeType = childClickedNodeType;
                    that.selectedParentNode = childNodeClicked;
                    that.selectedRelationship = '';
                    let evNT: any = {
                        target: {
                            value: childClickedNodeType
                        }
                    };
                    that.changeParentNodeType(evNT);

                    let evN: any = {
                        target: {
                            value: childNodeClicked
                        }
                    };
                    that.changeParentNode(evN);
                };

            };
        });
        view.addEventListener('mouseover', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            let childNodeOvered: string = datumClick.name;
            console.log('xx MOUSEover !!', childNodeOvered)
        });

        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();

        vegaTooltip(view);
    }

    constructGraphDataForUnit(
        parentNodeName: string,
        relationships: string[],
        isAddLevelForRelationship: boolean = false,
        isAddLevelForOnRole: boolean = false,
        startID: number = 1
        ): any[] {
        // Creates the graphData for a Unit: parent - relationship(s) - children (1 level deep)
        // This can be called multiple times from calling routines
        // Input:
        //  parentNodeName - SINGLE parent NodeName
        //  relationships - array of relationships, can be 1, some or 'All'
        //  isBreakOnRelationship - add a level per relationship, ie Absa - directors - children
        //     Absa - shareholders - children, etc
        //  isBreakOnRole - break EACH relationship on roles (if there are any), ie
        //     Absa - Executive - children, Absa Non-Executive - children (if relationship = Director)
        //  startID - id in graphData where parent starts (the rest of the rest has this as their parent)
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructGraphDataForUnit', '@Start');

        // Reset list of ALL children
        this.childDataAll = [];

        // Reset the data which will now be created
        let localGraphData = [];
        console.log('xx localGraphData 0', JSON.parse(JSON.stringify(localGraphData)))

        // Add Parent
        localGraphData.push(
            {
                "id": startID,
                "name": this.constructNodeName(parentNodeName)
            });
            console.log('xx localGraphData 0', JSON.parse(JSON.stringify(localGraphData)))

        // There are 4 scenarios, each one creating a different amount of sub-levels

        // 1. parent - children
        if (!isAddLevelForRelationship  &&  !isAddLevelForOnRole) {
            let localChildDataAll = this.distinctChildrenNodes(
                'All',
                parentNodeName,
                relationships,
                'All'
            );

            // Set length
            this.graphDataLength = localChildDataAll.length;

            // Get visible children
            let localChildDataVisible = localChildDataAll.splice(
                this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput)

            // Append to list of ALL children currently displayed
            this.childDataAll = this.childDataAll.concat(localChildDataVisible);

            // Add Children
            let childCnt: number = 0;
            localChildDataVisible.forEach(child => {

                // Increment
                childCnt = childCnt + 1;

                // Add
                localGraphData.push({
                    id: startID + childCnt,
                    name: this.constructNodeName(child),
                    parent: startID
                });
            });

            // Return
            return localGraphData;

        };

        // 2. parent - roles - children
        if (!isAddLevelForRelationship  &&  isAddLevelForOnRole) {
            let relationshipRoles: string[] = this.distinctRelationshipRoles(
                    parentNodeName, this.selectedRelationship);

            // Set length
            this.graphDataLength = relationshipRoles.length;

            // Reduce amount shown
            relationshipRoles = relationshipRoles.splice(
                this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput);

            let roleCounter: number = 0;            // Counter on role
            let childCounter: number = 0;           // Counter on children, spans roles

            relationshipRoles.forEach(role => {

                // Increment
                roleCounter = roleCounter + 1;

                // Add Role
                let roleID: number = startID + roleCounter + childCounter;
                localGraphData.push({
                    id: roleID,
                    name: this.constructNodeName(role),
                    parent: startID
                });

                // Get children for parent - role
                let localChildDataAll = this.distinctChildrenNodes(
                    'All',
                    parentNodeName,
                    relationships,
                    role
                );

                // Set length
                this.graphDataLength = this.graphDataLength + localChildDataAll.length;

                // Get visible children
                let localChildDataVisible = localChildDataAll.splice(
                    this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput)

                // Append to list of ALL children currently displayed
                this.childDataAll = this.childDataAll.concat(localChildDataVisible);

                // Add Children
                localChildDataVisible.forEach(child => {

                    // Increment
                    childCounter = childCounter + 1;

                    // Add
                    localGraphData.push({
                        id: startID + roleCounter + childCounter,
                        name: this.constructNodeName(child),
                        parent: roleID
                    });
                });
            })

            // Return
            return localGraphData;

        };

        // 3. parent - relationship - children
        if (isAddLevelForRelationship  &&  !isAddLevelForOnRole) {
            let relationships: string[] = this.distinctRelationships('All', parentNodeName)

            // Set length
            this.graphDataLength = relationships.length;

            // Reduce amount shown
            relationships = relationships.splice(
                this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput);

            let relationshipCounter: number = 0;            // Counter on relationship
            let childCounter: number = 0;           // Counter on children, spans roles

            relationships.forEach(relationship => {

                // Increment
                relationshipCounter = relationshipCounter + 1;

                // Add Relationship
                let relationshipID: number = startID + relationshipCounter + childCounter;
                localGraphData.push({
                    id: relationshipID,
                    name: this.constructNodeName(relationship),
                    parent: startID
                });

                // Get children for parent - role
                let localChildDataAll = this.distinctChildrenNodes(
                    'All',
                    parentNodeName,
                    [relationship],
                    'All'
                );

                // Set length
                this.graphDataLength = this.graphDataLength + localChildDataAll.length;

                // Get visible children
                let localChildDataVisible = localChildDataAll.splice(
                    this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput)

                // Append to list of ALL children currently displayed
                this.childDataAll = this.childDataAll.concat(localChildDataVisible);

                // Add Children
                localChildDataVisible.forEach(child => {

                    // Increment
                    childCounter = childCounter + 1;

                    // Add
                    localGraphData.push({
                        id: startID + relationshipCounter + childCounter,
                        name: this.constructNodeName(child),
                        parent: relationshipID
                    });
                });
            })

            // Return
            return localGraphData;

        };

        // 4. parent - relationship - roles - children
        if (isAddLevelForRelationship  &&  isAddLevelForOnRole) {
            let relationships: string[] = this.distinctRelationships('All', parentNodeName)

            // Set length
            this.graphDataLength = relationships.length;

            // Reduce amount shown
            relationships = relationships.splice(
                this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput);

            let relationshipCounter: number = 0;    // Counter on relationship
            let roleCounter: number = 0;            // Counter on role
            let childCounter: number = 0;           // Counter on children, spans roles

            relationships.forEach(relationship => {

                // Increment
                relationshipCounter = relationshipCounter + 1;

                // Add Relationship
                let relationshipID: number = startID + relationshipCounter + roleCounter + childCounter;
                localGraphData.push({
                    id: relationshipID,
                    name: this.constructNodeName(relationship),
                    parent: startID
                });

                let relationshipRoles: string[] = this.distinctRelationshipRoles
                    (parentNodeName, relationship);

                // Set length
                this.graphDataLength = this.graphDataLength + relationshipRoles.length;

                // Reduce amount shown
                relationshipRoles = relationshipRoles.splice(
                    this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput);

                relationshipRoles.forEach(role => {

                    // Increment
                    roleCounter = roleCounter + 1;

                    // Add Role
                    let roleID: number = startID + relationshipCounter + roleCounter + childCounter;
                    localGraphData.push({
                        id: roleID,
                        name: this.constructNodeName(role),
                        parent: relationshipID
                    });

                    // Get children for parent - role
                    let localChildDataAll = this.distinctChildrenNodes(
                        'All',
                        parentNodeName,
                        [relationship],
                        role
                    );

                    // Set length
                    this.graphDataLength = this.graphDataLength + localChildDataAll.length;

                    // Get visible children
                    let localChildDataVisible = localChildDataAll.splice(
                        this.visibleNumberChildrenStart, this.visibleNumberChildrenShownInput)

                    // Append to list of ALL children currently displayed
                    this.childDataAll = this.childDataAll.concat(localChildDataVisible);

                    // Add Children
                    localChildDataVisible.forEach(child => {

                        // Increment
                        childCounter = childCounter + 1;

                        // Add
                        localGraphData.push({
                            id: startID + relationshipCounter + roleCounter + childCounter,
                            name: this.constructNodeName(child),
                            parent: roleID
                        });

                    });
                });

            });

            // Return
            return localGraphData;
        };

    }

    constructGraphDataForCommonParents(inputNodes: string[]): any[] {
        // Construct the graph Data of common parents for a given array of Nodes
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructGraphDataForCommonParents', '@Starts');

        // parentRelationshipPerNode = parentRelationshipPerNode.concat(this.parentRelationshipPerNode(nd));
        let parentRelationshipPerNode: {
            parentNodeName: string;
            relatinsionship: string;
            nodeName: string
        }[] = [];

        // List all ParentNode - relationship - Child relationships for the array
        inputNodes.forEach(nd => {
            parentRelationshipPerNode = parentRelationshipPerNode
                .concat(this.parentRelationshipPerNode(nd));
        });
        console.log('xx  1 inputNodes', inputNodes, parentRelationshipPerNode)

        // Loop on children: if anyone is in inputNode array, add it
        // parentRelationshipPerNode = parentRelationshipPerNode
        //     .filter(pr => inputNodes.indexOf(pr.nodeName) >= 0);

        console.log('xx filtered', parentRelationshipPerNode)
        // Create a distinct list of ParentNodes
        let parentNodesUnique: string[] = [];
        parentNodesUnique = parentRelationshipPerNode.map(nr => nr.parentNodeName);
        parentNodesUnique = this.navUniqifySortNodes(parentNodesUnique);
        console.log('xx parentNodesUnique', parentNodesUnique)
        // Array of parentNodes + count with 2 or more occurances
        let parentsCount: { parentNode: string; count: number}[] = [];
        let counter: number = 0;
        parentNodesUnique.forEach(pu => {
            counter = parentRelationshipPerNode.filter(nr => nr.parentNodeName === pu).length;
            if (counter > 1) {
                parentsCount.push({ parentNode: pu, count: counter });
            };
        });

        // Sort on counter
        parentsCount = parentsCount.sort( (a,b) => {
            if (a.count > b.count) {
                return 1;
            };
            if (a.count < b.count) {
                return -1;
            };
                return 0;
        });
        console.log('xx parentsCount', parentsCount)
        // Build the graph Data
        let localGraphData: any[] = [];

        localGraphData.push({
            id: 1,
            name: 'Common Parents'
        });

        // Loop on unique duplicate parents
        let parentNodeCounter: number = 0;             // Counter on parents
        let relationshipCounter: number = 0;        // Counter on relationship
        let childCounter: number = 0;               // Counter on children, spans roles

        parentsCount.forEach(pc => {

            // Increment
            parentNodeCounter = 1 + parentNodeCounter;
            let parentNodeID: number = 1 + parentNodeCounter + relationshipCounter + childCounter;

            // Add parent
            localGraphData.push({
                id: parentNodeID,
                name: this.constructNodeName(pc.parentNode),
                parent: 1
            });

            // Get unique list of relationships
            let localRelationships: string[] = parentRelationshipPerNode
                .filter(nr => nr.parentNodeName === pc.parentNode)
                .map(nr => nr.relatinsionship);
            localRelationships = this.navUniqifySortNodes(localRelationships);

            // Loop on relationships and add Children
            localRelationships.forEach(relationship => {

                // Increment
                relationshipCounter = relationshipCounter + 1;

                // Add Relationship
                let relationshipID: number = 1 + parentNodeCounter + relationshipCounter + childCounter;

                localGraphData.push({
                    id: relationshipID,
                    name: this.constructNodeName(relationship),
                    parent: parentNodeID
                });

                // Distrinct children for this parent and relationship
                let localChildren: string[] = parentRelationshipPerNode
                    .filter(nr => nr.parentNodeName === pc.parentNode
                            &&
                            nr.relatinsionship === relationship)
                    .map(nr => nr.nodeName);
                localChildren = this.navUniqifySortNodes(localChildren);

                // Add each child
                localChildren.forEach(child => {

                    // Increment
                    childCounter = childCounter + 1;

                    // Add
                    localGraphData.push({
                        id: 1 + parentNodeCounter + relationshipCounter + childCounter,
                        name: this.constructNodeName(child),
                        parent: relationshipID
                    });

                });

            });
        });

        // Set length
        this.graphDataLength = localGraphData.length;

        // Return
        return localGraphData;
    }

    constructGraphDataForCommonNode(targetNode: string, inputNodes: string[]): any[] {
        // Construct the graph Data where a given array of Nodes has common parent with a target Node
        // Example: where do directors of Absa have a common parent with Person xyz
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructGraphDataForCommonNode', '@Starts');

        // parentRelationshipPerNode = parentRelationshipPerNode.concat(this.parentRelationshipPerNode(nd));
        let childrenRelationshipPerParent: {
            parentNodeName: string;
            relatinsionship: string;
            nodeName: string
        }[] = [];

        // Get unique parents for targetNode
        let parentNodesUnique: string[] = this.distinctParentNodes(targetNode, ['All'], 'All');
        console.log('xx  uniqueParents', parentNodesUnique)

        // List all ParentNode - relationship - Child relationships for unique Parents
        parentNodesUnique.forEach(par => {
            childrenRelationshipPerParent = childrenRelationshipPerParent
                .concat(this.parentRelationshipPerNode(par));
        });
        console.log('xx parentRelationshipPerNode', childrenRelationshipPerParent)

        // Array of parentNodes with targetNode & at least one inputNodes element
        childrenRelationshipPerParent = childrenRelationshipPerParent
            .filter(nr => (inputNodes.indexOf(nr.parentNodeName) >= 0)
                           ||
                           nr.parentNodeName === targetNode);
        console.log('xx parentRelationshipPerNode FILTERED', childrenRelationshipPerParent)

        // Get >1 element
        let parentsCount: { parentNode: string; count: number}[] = [];
        let counter: number = 0;
        parentNodesUnique.forEach(pu => {
            counter = childrenRelationshipPerParent.filter(nr => nr.nodeName === pu).length;
            if (counter > 1) {
                parentsCount.push({ parentNode: pu, count: counter });
            };
        });

        // Sort on counter
        parentsCount = parentsCount.sort( (a,b) => {
            if (a.count > b.count) {
                return 1;
            };
            if (a.count < b.count) {
                return -1;
            };
                return 0;
        });
        console.log('xx parentsCount', parentsCount)

        // Build the graph Data
        let localGraphData: any[] = [];

        localGraphData.push({
            id: 1,
            name: 'Common Node'
        });

        // Loop on unique duplicate parents
        let parentNodeCounter: number = 0;             // Counter on parents
        let relationshipCounter: number = 0;        // Counter on relationship
        let childCounter: number = 0;               // Counter on children, spans roles

        parentsCount.forEach(pc => {

            // Increment
            parentNodeCounter = 1 + parentNodeCounter;
            let parentNodeID: number = 1 + parentNodeCounter + relationshipCounter + childCounter;

            // Add parent
            localGraphData.push({
                id: parentNodeID,
                name: this.constructNodeName(pc.parentNode),
                parent: 1
            });

            // Get unique list of relationships
            let localRelationships: string[] = childrenRelationshipPerParent
                .filter(nr => nr.nodeName === pc.parentNode)
                .map(nr => nr.relatinsionship);
            localRelationships = this.navUniqifySortNodes(localRelationships);

            // Loop on relationships and add Children
            localRelationships.forEach(relationship => {

                // Increment
                relationshipCounter = relationshipCounter + 1;

                // Add Relationship
                let relationshipID: number = 1 + parentNodeCounter + relationshipCounter + childCounter;

                localGraphData.push({
                    id: relationshipID,
                    name: this.constructNodeName(relationship),
                    parent: parentNodeID
                });

                // Distrinct children for this parent and relationship
                let localChildren: string[] = childrenRelationshipPerParent
                    .filter(nr => nr.nodeName === pc.parentNode
                            &&
                            nr.relatinsionship === relationship)
                    .map(nr => nr.parentNodeName);
                localChildren = this.navUniqifySortNodes(localChildren);

                // Add each child
                localChildren.forEach(child => {

                    // Increment
                    childCounter = childCounter + 1;

                    // Add
                    localGraphData.push({
                        id: 1 + parentNodeCounter + relationshipCounter + childCounter,
                        name: this.constructNodeName(child),
                        parent: relationshipID
                    });

                });

            });
        });

        // Set length
        this.graphDataLength = localGraphData.length;

        // Return
        return localGraphData;
    }

    nav2WalkInPath(
        parent: string,
        nodeName: string,
        relationship: string,
        iterationCount: number,
        path: string[],
        targetNodeName: string = 'Mr Beggs, Colin'
    ) {
        // Walk to next node in path for given info (parent, node, etc)
        this.globalFunctionService.printToConsole(this.constructor.name, 'nav2WalkInPath', '@Start');

        // Stop if target reached
        if (nodeName === targetNodeName) {
            console.log('xx nav2WalkInPath @END path REACHED TARGET', iterationCount, path);

            // Add last Node, push to routes and stop recursion
            path.push(nodeName);
            this.routesPerNode.push(path);

            path = [];
            return;
        };

        // Stop if Cyclical
        if (path.indexOf(nodeName) >= 0) {
            path.push(nodeName + '*');
            console.log('xx nav2WalkInPath @END path CYCLCLE', iterationCount, path);

            for (var i = 0; i < path.length; i++) {
                if (path[i].indexOf(targetNodeName) >= 0) {
                    this.routesPerNode.push(path);
                    break;
                };
            };

            path = [];
            return;
        };

        // Add this node to path
        path.push(nodeName);

        // Increment
        iterationCount = iterationCount + 1;

        // Get next nodes in path, Left and Right, excluding the Parent
        let nextInPath: string[] = [];
        let leftInPath: string[] = this.networkRelationships
            .filter(nw => nw.leftNodeName === nodeName && nw.rightNodeName != parent)
            .map(nw => nw.rightNodeName);
        let rightInPath: string[] = this.networkRelationships
            .filter(nw => nw.rightNodeName === nodeName && nw.leftNodeName != parent)
            .map(nw => nw.leftNodeName);

        // Combine
        nextInPath = leftInPath.concat(rightInPath);

        // Log
        console.log('xx nav2WalkInPath related nodeName', nodeName, ' (from ', parent, ')', nextInPath, 'path:', path)

        if (nextInPath.length == 0) {
            console.log('xx nav2WalkInPath @END path NORMAL', iterationCount, path);

            for (var i = 0; i < path.length; i++) {
                if (path[i].indexOf(targetNodeName) >= 0) {
                    this.routesPerNode.push(path);
                    break;
                };
            };

            path = [];
        };

        // Call recursively, starting a new path
        nextInPath.forEach(child => {
            let newPath: string[] = [];
            path.forEach(c => newPath.push(c));
            this.nav2WalkInPath(nodeName, child, relationship, iterationCount, newPath)
        });
    }

    distinctNodeTypes(): string[] {
        // Return distinct array of Nodes Type for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctNodeTypes', '@Start');

        // Find unique Nodes
        let leftNodeTypes: string[] = this.networkRelationships.map(x => x.leftNodeType);
        let rightNodeTypes: string[] = this.networkRelationships.map(x => x.rightNodeType);
        let uniqueNodeTypes: string[] = leftNodeTypes.concat(rightNodeTypes);
        uniqueNodeTypes = this.navUniqifySortNodes(uniqueNodeTypes);

        // Return
        return uniqueNodeTypes;
    }

    distinctNodesPerNodeType(selectedParentNodeType: string): string[] {
        // Return distinct array of Nodes per Node Type for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctNodesPerNodeType', '@Start');

        // Filter correct Col
        let leftNodeTypes: string[] = this.networkRelationships
            .filter(nr => nr.leftNodeType == selectedParentNodeType)
            .map(nr => nr.leftNodeName);
        let rightNodeTypes: string[] = this.networkRelationships
            .filter(nr => nr.rightNodeType == selectedParentNodeType)
            .map(nr => nr.rightNodeName);
        let nodesPerNodeType = Array.from(new Set(leftNodeTypes.concat(rightNodeTypes)));

        // TODO - fix for Other Than Equal Operator
        // Filter parent Nodes IF a filter active
        if (this.ngParentNodeFilterSelectedFieldName != ''
            &&
            this.ngParentNodeFilterSelectedOperator != '') {
            nodesPerNodeType = nodesPerNodeType.filter(
                x => this.parentNodesFilteredList.indexOf(x) >= 0
            );
        };

        // Make sure it is unique, non-null list
        nodesPerNodeType = this.navUniqifySortNodes(nodesPerNodeType);

        // Return
        return nodesPerNodeType;
    }

    distinctRelationships(
        selectedParentNodeType: string = 'All',
        selectedParentNodeName: string = 'All',
        ): string[] {
        // Return distinct array of Relationships per Node Type for the current Network
        // Filtering is Optional
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctRelationships', '@Start');

        // Fill ParentNode type Dropdown
        let leftRelationships: string[] = this.networkRelationships
            .filter(nr => (
                            (
                                nr.leftNodeType === selectedParentNodeType
                                &&  selectedParentNodeType != 'All'
                            )
                            ||
                            selectedParentNodeType == 'All'
                           )
            )
            .filter(nr => selectedParentNodeName == 'All'
                          ||
                          (
                              selectedParentNodeName != 'All'
                              &&
                              nr.leftNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => nr.relationshipLeftToRight != '')
            .map(nr => nr.relationshipLeftToRight);

        let rightRelationships: string[] = this.networkRelationships
            .filter(nr => (
                            (
                                nr.rightNodeType === selectedParentNodeType
                                &&
                                selectedParentNodeType != 'All'
                            )
                            ||
                            selectedParentNodeType == 'All'
                           )
            )
            .filter(nr => selectedParentNodeName == 'All'
                          ||
                          (
                              selectedParentNodeName != 'All'
                              &&
                              nr.rightNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => nr.relationshipRightToLeft != '')
            .map(nr => nr.relationshipRightToLeft);

        let nodeRelationships: string[] = Array.from(new Set(leftRelationships.concat(rightRelationships)));

        // Make sure it is unique, non-null list
        nodeRelationships = this.navUniqifySortNodes(nodeRelationships);

        // Return
        return nodeRelationships;
    }

    distinctParentNodes(
        selectedChildNodeName: string,
        selectRelationships: string[],
        selectedRelationshipFilterRole: string
        ): string[] {
        // Return distinct array of Parent Nodes for the selected Info
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctParentNodes', '@Start');

        // Fill ParentNode type Dropdown
        let leftParents: string[] = this.networkRelationships
            .filter(nr => selectedChildNodeName == 'All'
                          ||
                          (
                              selectedChildNodeName != 'All'
                              &&
                              nr.leftNodeName === selectedChildNodeName
                          )
            )
            .filter(nr => (
                            selectRelationships.length == 1
                            &&
                            selectRelationships[0] == 'All'
                          )
                          ||
                          selectRelationships.indexOf(nr.relationshipLeftToRight) >= 0
            )
            .filter(nr => selectedRelationshipFilterRole === 'All'
                          ||
                          (
                              selectedRelationshipFilterRole != 'All'
                              &&
                              nr.relationshipProperty === selectedRelationshipFilterRole
                          )
                )
            .filter(nr => nr.rightNodeName != '')
            .map(nr => nr.rightNodeName);

        let rightParents: string[] = this.networkRelationships
            .filter(nr => selectedChildNodeName === 'All'
                          ||
                          (
                              selectedChildNodeName != 'All'
                              &&
                              nr.rightNodeName === selectedChildNodeName
                          )
            )
            .filter(nr => (
                            selectRelationships.length === 1
                            &&
                            selectRelationships[0] === 'All'
                          )
                          ||
                          selectRelationships.indexOf(nr.relationshipRightToLeft) >= 0
            )
            .filter(nr => selectedRelationshipFilterRole === 'All'
                          ||
                          (
                              selectedRelationshipFilterRole != 'All'
                              &&
                              nr.relationshipProperty === selectedRelationshipFilterRole
                          )
            )
            .filter(nr => nr.leftNodeName != '')
            .map(nr => nr.leftNodeName);

        let nodeParents: string[] = Array.from(new Set(leftParents.concat(rightParents)));

        // Filter if a Child filter is active
        if (this.childNodesFilteredList.length > 0) {
                nodeParents = nodeParents.filter(c => this.childNodesFilteredList.indexOf(c) >= 0);
        };

        // Make sure it is unique, non-null list
        nodeParents = this.navUniqifySortNodes(nodeParents);

        // Return
        return nodeParents;
    }

    distinctChildrenNodes(
        selectedParentNodeType: string,
        selectedParentNodeName: string,
        selectRelationships: string[],
        selectedRelationshipFilterRole: string
        ): string[] {
        // Return distinct array of Children for the selected Info
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctChildrenNodes', '@Start');

        // Fill ParentNode type Dropdown
        let leftChildren: string[] = this.networkRelationships
            .filter(nr => (selectedParentNodeType === 'All'
                           ||
                           (
                                selectedParentNodeType != 'All'
                                &&
                                nr.leftNodeType === selectedParentNodeType)
                           )
            )
            .filter(nr => selectedParentNodeName == 'All'
                          ||
                          (
                              selectedParentNodeName != 'All'
                              &&
                              nr.leftNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => (
                            selectRelationships.length == 1
                            &&
                            selectRelationships[0] == 'All'
                          )
                          ||
                          selectRelationships.indexOf(nr.relationshipLeftToRight) >= 0
            )
            .filter(nr => selectedRelationshipFilterRole === 'All'
                          ||
                          (
                              selectedRelationshipFilterRole != 'All'
                              &&
                              nr.relationshipProperty === selectedRelationshipFilterRole
                          )
                )
            .filter(nr => nr.rightNodeName != '')
            .map(nr => nr.rightNodeName);

        let rightChildren: string[] = this.networkRelationships
            .filter(nr => (selectedParentNodeType === 'All'
                           ||
                           (
                                selectedParentNodeType != 'All'
                                &&
                                nr.rightNodeType === selectedParentNodeType)
                           )
            )
            .filter(nr => selectedParentNodeName === 'All'
                          ||
                          (
                              selectedParentNodeName != 'All'
                              &&
                              nr.rightNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => (
                            selectRelationships.length === 1
                            &&
                            selectRelationships[0] === 'All'
                          )
                          ||
                          selectRelationships.indexOf(nr.relationshipRightToLeft) >= 0
            )
            .filter(nr => selectedRelationshipFilterRole === 'All'
                          ||
                          (
                              selectedRelationshipFilterRole != 'All'
                              &&
                              nr.relationshipProperty === selectedRelationshipFilterRole
                          )
            )
            .filter(nr => nr.leftNodeName != '')
            .map(nr => nr.leftNodeName);

        let nodeChildren: string[] = Array.from(new Set(leftChildren.concat(rightChildren)));

        // Filter if a Child filter is active
        if (this.childNodesFilteredList.length > 0) {
                nodeChildren = nodeChildren.filter(c => this.childNodesFilteredList.indexOf(c) >= 0);
        };

        // Make sure it is unique, non-null list
        nodeChildren = this.navUniqifySortNodes(nodeChildren);

        // Return
        return nodeChildren;
    }

    distinctRelationshipRoles(selectedParentNode: string, selectedRelationship: string): string[] {
        // Return distinct array of Nodes per Relationship Roles for a given Parent Node
        // and Relationship
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctRelationshipRoles', '@Start');

        // Filter on Relationship
        let leftRelationships: string[] = this.networkRelationships
            .filter(nr => nr.leftNodeName === selectedParentNode)
            .filter(nr => nr.relationshipLeftToRight === selectedRelationship)
            .map(nr => nr.relationshipProperty);
        let rightRelationships: string[] = this.networkRelationships
            .filter(nr => nr.rightNodeName === selectedParentNode)
            .filter(nr => nr.relationshipRightToLeft === selectedRelationship)
            .map(nr => nr.relationshipProperty);
        let nodeRelationships: string[] = leftRelationships.concat(rightRelationships);
        nodeRelationships = nodeRelationships.filter(nr => nr != '');

        // Make unique & Sort
        nodeRelationships = this.navUniqifySortNodes(nodeRelationships);

        // Return
        return nodeRelationships;
    }

    distinctNodeProperties(selectedParentNodeType: string = null): string[] {
        // Return distinct array of Properties per Node Type for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctNodeProperties', '@Start');

        // Fill ParentNode type Dropdown
        let nodeProperties: string[] = this.networkProperties
            .filter(np => (
                    (
                        selectedParentNodeType == null
                        ||
                        (
                            selectedParentNodeType != null
                            &&
                            np.nodeType === selectedParentNodeType
                        )
                    )
                    &&  np.propertyKey != ''
            ))
            .map(np => np.propertyKey);

        // Make sure it is unique, non-null list
        nodeProperties = this.navUniqifySortNodes(nodeProperties);
        console.log('xx nodeProperties', nodeProperties)
        // Return
        return nodeProperties;
    }

    constructNodeName(nodeName: string): string {
        // Return constructed Node Name to show in the graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructNodeName', '@Start');

        let returnNodeName: string = nodeName;
        if (this.selectedAdditonalProperty != '') {

            let nodePropertyIndex: number = this.networkProperties
                .findIndex(np => np.nodeName == nodeName
                           &&
                           np.propertyKey == this.selectedAdditonalProperty
                );

            if (nodePropertyIndex >= 0) {
                returnNodeName = returnNodeName + ' ('
                    + this.networkProperties[nodePropertyIndex].propertyValue + ')';
            };
        };

        // Return
        return returnNodeName;
    }

    navUniqifySortNodes(
        inputNodes: string[],
        uniqify: boolean = true,
        sort: boolean = false
    ): string[] {
        // Make given array of nodes unique and sort, if so requested
        // this.globalFunctionService.printToConsole(this.constructor.name, 'navUniqifySortNodes', '@Start');

        // Make sure it is a non-null list
        if (inputNodes == null || inputNodes == undefined) {
            inputNodes = [];
        };

        // Make sure it is unique, non-null list
        if (uniqify) {
            inputNodes = Array.from(new Set(inputNodes));
        };

        // No undefined
        inputNodes.filter(n => n != undefined);

        // Sort
        inputNodes.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });

        // Return
        return inputNodes;

    }

    parentsPerNode(inputNodeName: string): string[] {
        // Return list of unique parent Nodes for a given node
        this.globalFunctionService.printToConsole(this.constructor.name, 'parentsPerNode', '@Start');

        let leftParentNodes: string[] = this.networkRelationships
            .filter(nr => nr.rightNodeName === inputNodeName)
            .map(nr => nr.leftNodeName);
        let rightParentNodes: string[] = this.networkRelationships
            .filter(nr => nr.leftNodeName === inputNodeName)
            .map(nr => nr.rightNodeName);
        let parentNodes: string[] = leftParentNodes.concat(rightParentNodes);

        parentNodes = this.navUniqifySortNodes(parentNodes);

        // Return
        return parentNodes;

    }

    parentRelationshipPerNode(inputNodeName: string):
        {parentNodeName: string; relatinsionship: string; nodeName: string}[]
        {
        // Return list of unique ParentNode - Relationship - inputNodeName for a given node
        this.globalFunctionService.printToConsole(this.constructor.name, 'parentRelationshipPerNode', '@Start');

        let parentRelationshipNodes: {parentNodeName: string; relatinsionship: string; nodeName: string}[] = [];

        let leftNodes: NavigatorRelationship[] = this.networkRelationships
            .filter(nr => nr.leftNodeName === inputNodeName
                    &&
                    nr.relationshipLeftToRight != '')

        leftNodes.forEach(ln => parentRelationshipNodes.push(
            {
                parentNodeName: ln.rightNodeName,
                relatinsionship: ln.relationshipLeftToRight,
                nodeName: ln.leftNodeName
            })
        );

        let rightNodes: NavigatorRelationship[] = this.networkRelationships
            .filter(nr => nr.rightNodeName === inputNodeName
                    &&
                    nr.relationshipRightToLeft != '')

        rightNodes.forEach(ln => parentRelationshipNodes.push(
            {
                parentNodeName: ln.leftNodeName,
                relatinsionship: ln.relationshipRightToLeft,
                nodeName: ln.rightNodeName
            })
        );

        // Return
        return parentRelationshipNodes;

    }

    //[]a//     this.globalFunctionService.printToConsole(this.constructor.name, 'navSingleRoute', '@Start');

    //     console.log('xx navSingleRoute START node-parent-path', this.navRecursionCounter, navStartNode, parentNode, path)

    //     // Safety }

    //     this.navRecursionCounter = this.navRecursionCounter + 1;
    //     if (this.navRecursionCounter > this.navMaxRecursion) {
    //         console.log('xx navSingleRoute navMaxRecursion EXCEEDED')
    //         return;
    //     };

    //     // Add to path
    //     path.push(navStartNode);
    //     this.navVisitedNodes.push(navStartNode);

    //     // Get children of start Node in the SAME path
    //     let childrenOfStartNode: string[] = this.navNextNodesInPath(navStartNode, relationship);
    //     console.log('xx navSingleRoute childrenOfStartNode', childrenOfStartNode)

    //     // Create new path, minus navStartNode and parentNode
    //     let newChildrendOfStartNode: string [] = [];
    //     childrenOfStartNode.forEach(child => {
    //         if (child != navStartNode
    //             &&
    //             child != parentNode
    //             &&
    //             path.indexOf(child) < 0
    //             &&
    //             this.navVisitedNodes.indexOf(child) < 0
    //             ) {
    //             newChildrendOfStartNode.push(child)
    //         };
    //     });
    //     console.log('xx navSingleRoute newChildrendOfStartNode', newChildrendOfStartNode);

    //     // Single, unique route if pathNew is empty
    //     if (newChildrendOfStartNode.length == 0) {
    //         this.singleRoutesArray.push(path);
    //         console.log('xx navSingleRoute ROUTE path', path);
    //         this.navSinglePaths.push(path);
    //         path = [];
    //         return;
    //     };

    //     // Call recursively with new path
    //     newChildrendOfStartNode.forEach(child =>  {
    //         let newPath: string[] = [];
    //         path.forEach(c => newPath.push(c));
    //         console.log('xx newPath', newPath);
    //         this.navSingleRoute(child, navStartNode, relationship, newPath);
    //     });
    // }

    changeParentFilterKey() {
        // Build the property values for the selected key in the Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentFilterKey', '@Start');

        this.ngParentNodeFilterPropertyDropdown = this.networkProperties
            .filter(np => np.nodeType == this.selectedParentNodeType 
                    && 
                    np.propertyKey === this.ngParentNodeFilterSelectedFieldName)
            .map(np => np.propertyValue);
        this.ngParentNodeFilterPropertyDropdown = this.navUniqifySortNodes(this.ngParentNodeFilterPropertyDropdown);
        this.ngParentNodeFilterPropertyDropdown = ['', ...this.ngParentNodeFilterPropertyDropdown];
    }

    clickParentFilterClear() {
        // Clear the Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickParentFilterClear', '@Start');

        this.ngParentNodeFilterKeyDropdown = [];
        this.ngParentNodeFilterSelectedFieldName = '';
        this.ngParentNodeFilterSelectedOperator = 'Equal';
        this.ngParentNodeFilterSelectedValue = '';
        this.parentNodesFilteredList = [];
    }

    clickParentFilterSave() {
        // Add Parent Filter, and create list of parent nodes as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickParentFilterSave', '@Start');

        // TODO - for now, only one filter on one option.  In future, consider more than one as
        // data structurs allows it
        console.log('xx ngParentNodeFilterSelectedFieldName', this.ngParentNodeFilterSelectedFieldName)
        console.log('xx ngParentNodeFilterSelectedValue', this.ngParentNodeFilterSelectedValue)
        // Validation
        if (this.ngParentNodeFilterSelectedFieldName === '') {
            this.parentFilterErrorMessage = 'The field name is compulsory';
            return;
        };
        if (this.ngParentNodeFilterSelectedOperator === '') {
            this.parentFilterErrorMessage === 'The operator is compulsory';
            return;
        };
        if (this.ngParentNodeFilterSelectedValue === '') {
            this.parentFilterErrorMessage === 'The value is compulsory';
            return;
        };

        // Create Filtered List of ParentNodes
        // TODO - do other operator than ==
        this.parentNodesFilteredList = this.networkProperties
            .filter(np => np.propertyKey === this.ngParentNodeFilterSelectedFieldName
                &&
                np.propertyValue === this.ngParentNodeFilterSelectedValue)
            .map(np => np.nodeName);

        // Make unique
        this.parentNodesFilteredList = Array.from(new Set(this.parentNodesFilteredList));
console.log('xx parentNodesFilteredList', this.parentNodesFilteredList)
        // Filter Parent Nodes
        this.ngDropdownParentNodes = this.ngDropdownParentNodes
            .filter(pn => this.parentNodesFilteredList.indexOf(pn) >= 0
            );
            console.log('xx ngDropdownParentNodes', this.ngDropdownParentNodes)
    }

    clickRelationshipFilterClear() {
        // Clear the Relationship Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickRelationshipFilterClear', '@Start');

        this.ngSelectedRelationshipFilterRole = '';
        this.relationshipsFilteredList = [];
    }

    clickRelationshipFilterSave() {
        // Add Relationship Filter, and create list of relationships as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickRelationshipFilterSave', '@Start');

        // TODO - for now, only one filter by choice.  In future, consider more than one as
        // data structurs allows it

        // Validation
        if (this.ngSelectedRelationshipFilterRole === '') {
            this.relationshipFilterErrorMessage = 'The field name is compulsory';
            return;
        };

        // Create Filtered List of ParentNodes
        // TODO - do other operator than ==
        let lefRelationshipsFilteredList = this.networkRelationships
            .filter(nr => nr.relationshipLeftToRight === this.selectedRelationship
                          &&
                          nr.relationshipProperty === this.ngSelectedRelationshipFilterRole
            )
            .map(nr => nr.relationshipLeftToRight);
        let rightRelationshipsFilteredList = this.networkRelationships
            .filter(nr => nr.relationshipRightToLeft === this.selectedRelationship
                          &&
                          nr.relationshipProperty === this.ngSelectedRelationshipFilterRole
            )
            .map(nr => nr.relationshipRightToLeft);
        this.relationshipsFilteredList = lefRelationshipsFilteredList
            .concat(rightRelationshipsFilteredList);

        // Make unique
        this.relationshipsFilteredList = Array.from(new Set(this.relationshipsFilteredList));

    }

    clickChildFilterClear() {
        // Clear Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickChildFilterClear', '@Start');

        this.ngChildNodeFilterDropdown = [];
        this.ngChildNodeFilterSelectedFieldName = '';
        this.ngChildNodeFilterSelectedOperator = '';
        this.ngChildNodeFilterSelectedValue = '';
        this.ngChildFilterShowTop = '';
        this.ngChildFilterSortFieldName = '';
        this.childNodesFilteredList = [];
    }

    clickChildFilterSave() {
        // Add Parent Filter, and create list of parent nodes as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickChildFilterSave', '@Start');

        // TODO - for now, only one filter by choice.  In future, consider more than one as
        // data structurs allows it

        // Validation
        if (this.ngChildNodeFilterSelectedFieldName === '') {
            this.childFilterErrorMessage = 'The field name is compulsory';
            return;
        };
        if (this.ngChildNodeFilterSelectedOperator) {
            this.childFilterErrorMessage = 'The operator is compulsory';
            return;
        };
        if (this.ngChildNodeFilterSelectedValue) {
            this.childFilterErrorMessage = 'The value is compulsory';
            return;
        };

        // Create Filtered List of Child Nodes
        // TODO - do other operator than ==
        this.childNodesFilteredList = this.networkProperties
            .filter(np => np.propertyKey === this.ngChildNodeFilterSelectedFieldName
                &&
                np.propertyValue === this.ngChildNodeFilterSelectedValue)
            .map(np => np.nodeName);

        // Make unique
        this.childNodesFilteredList = Array.from(new Set(this.childNodesFilteredList));

        // Filter Child Nodes
        this.ngChildNodeFilterDropdown = this.ngChildNodeFilterDropdown
            .filter(pn => this.childNodesFilteredList.indexOf(pn) >= 0
            );

    }

    clickNetworkSummaryView() {
        // Show a summary of the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNetworkSummaryView', '@Start');
        let networkIndex: number = this.ngNetworks.findIndex(nw => nw.id == this.selectedNetworkID);

        // Reset
        this.visibleNumberChildrenStart = 0;

        // Set view
        this.selectedView = 'SummaryView';

        // Reset the selections
        this.selectedParentNodeType = '';
        this.selectedParentNode = '';
        this.selectedRelationship = '';

        this.checkShowGraph();

    }

    clickDefaultView() {
        // Show the default view = tree with children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDefaultView', '@Start');

        // Refresh the graph
        this.selectedView = 'DefaultView'

        // Save W
        // TODO - only save 3 fields via a PUT
        this.globalVariableService.saveResource('widgets', this.localWidget)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator.OnInit saving widgets: ' + err);
            });

        this.checkShowGraph();
    }

    clickCommonParentShowForm() {
        // Show the Common Parent view form
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonParentShowForm', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonParentView';

        this.commonParentSelected = [];
        this.childDataAll.forEach(chld => 
            this.commonParentSelected.push(
                { 
                    childNode: chld, 
                    isSelected: false
                }
            )
        );
        this.showCommonParent = true;

    }

    clickCommonParentNode(selCommonParentNode: { 
        childNode: string; 
        isSelected: boolean;
    }) {
        // User clicked a node in the Common Parents list: toggle from selected list
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonParentNode', '@Start');

        let commonParentIndex: number = this.commonParentSelected.findIndex(
            cp => cp.childNode === selCommonParentNode.childNode);
        this.commonParentSelected[commonParentIndex].isSelected = 
            !this.commonParentSelected[commonParentIndex].isSelected;

    }

    clickCommonParentViewClearAll() {
        // Clear all selected Common Parent Nodes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonParentViewClearAll', '@Start');

        this.commonParentSelected.forEach(scp => scp.isSelected = false);
    }

    clickCommonParentViewSelectAll() {
        // Select all selected Common Parent Nodes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonParentViewSelectAll', '@Start');

        this.commonParentSelected.forEach(scp => scp.isSelected = true);
    }
    
    clickCloseCommonParentViewPopup() {
        // Close the popup for Common Parents
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseCommonParentViewPopup', '@Start');

        this.showCommonNode = false;
    }

    clickCommonParentView() {
        // Show the graph of Common Parents for the selected Nodes
        // Example: which directors of Absa are also direcytors of another company
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonParentView', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonParentView';

        this.showCommonParent = false;
        this.checkShowGraph();

    }

    clickCommonNodeShowForm() {
        // Show the Common Node view form
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonNodeShowForm', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonNodeView';

        this.showCommonNode = true;

    }
    
    clickCommonNodeView() {
        // Show the Common Parent view = list of all nodes where any children has the
        // same parent as a specified node
        // Example: which directors of Absa are children of the same node as Jannie Mouton
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonNodeView', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonNodeView'
        this.showCommonNode = false;

        this.checkShowGraph();

    }
    
    clickCloseCommonNodeViewPopup() {
        // Close the popup for Common Nodes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseCommonNodeViewPopup', '@Start');

        this.showCommonParent = false;
    }

    clickCloseDistanceFromNodeViewPopup() {
        // Close the popup for Distance from Nodes View
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseDistanceFromNodeViewPopup', '@Start');

        this.showDistanceFromNode = false;
    }

    clickDistanceFromNodeShowForm() {
        // Show the Distance From Nodes view form
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDistanceFromNodeShowForm', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonNodeView';
        this.spinner = false;
        this.showDistanceFromNode = true;

    }
    
    clickDistanceView() {
        // Show the Distance view = sub tree with all nodes between a given child and
        // a specified node
        // Example: how are directors of Absa related to Markus Jooste
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDistanceView', '@Start');

        // Refresh the graph
        this.selectedView = 'DistanceView'
        this.showDistanceFromNode = false;
        this.spinner = true;
        console.log('xx this.spinner',  this.spinner)
        this.checkShowGraph();

    }

    clickCustomView() {
        // Show the selected Custom view
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCustomView', '@Start');

        // Open the popup
        this.selectedView = 'CustomView'
        this.showCustomView = true;

    }

    clickNodeTypeView() {
        // Show the Node Type View = full tree with all children of a given node type
        // Example: all beneficiary shareholders of company and subsidiaries
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNodeTypeView', '@Start');

        // Refresh the graph
        // this.selectedView = 'NodeTypeView'

        this.graphData = [];
        this.graphData.push(
            {
                "id": 1,
                "name": ""
            });
        this.graphData.push({
            id: 2,
            name: "Absa",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "Glenis (Shareholder",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Old Mutual",
            parent: 1
        });
        this.graphData.push({
            id: 5,
            name: "Nedbank",
            parent: 4
        });
        this.graphData.push({
            id: 6,
            name: "Zaheer",
            parent: 5
        });
        this.graphData.push({
            id: 7,
            name: "Capitec",
            parent: 5
        });
        this.graphData.push({
            id: 8,
            name: "Bernard (Shareholder)",
            parent: 7
        });

        this.graphTitle = 'Beneficiary Shareholders of Top 40 companies';

        // Dimension it
        this.graphHeight = 300; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 300; //this.localWidget.graphLayers[0].graphSpecification.width;

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight,
            this.graphWidth,
            this.showSpecificGraphLayer,
            0
        );

        // Load the data
        this.specification['data'][0]['values'] = this.graphData;
        this.specification['title'] = this.graphTitle;

        console.log('xx summ', this.graphHeight, this.graphWidth, this.graphData, this.specification)
        // TODO - decide if we need to update the Widget Data too ?
        // this.specification.graphLayers[0].graphSpecification.data = this.graphData;

        // Render in DOM
        let view = new View(parse(this.specification));
        view.addEventListener('click', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK NodTyp', item, item.datum.text, datumClick.name);
            this.selectedParentNodeType = 'Person';
            this.selectedParentNode = 'Koos';
            this.selectedRelationship = 'Director-Of';
        });
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();

    }

    clickAdditionalLevelRelationship() {
        // Add an additional level to the default view, based on diffrent relationships
        // Example: if false, company  -> ...
        //          if true,  company  -> Directors  ->  ...
        //                             -> Subsidiaries  ->  ...
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalLevelRelationship', '@Start');

        this.showAdditionalLevelForRelationships = !this.showAdditionalLevelForRelationships;

        this.checkShowGraph();
    }

    clickAdditionalLevelRole() {
        // Add an additional level to the default view, based on a property of the relationship
        // that has already been defined.
        // Example: if false, company  -> Directors
        //          if true,  company  ->  Ex/Non-Exec  ->  Directors
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalLevelRole', '@Start');

        this.showAdditionalLevelForRoles = !this.showAdditionalLevelForRoles;

        this.checkShowGraph();
    }

    clickPageFirst() {
        // Move to the First page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageFirst', '@Start');

        this.visibleNumberChildrenStart = 0;

        this.checkShowGraph();
    }

    clickPageLeft() {
        // Move to the previous page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageLeft', '@Start');

        this.visibleNumberChildrenStart = Math.max(
            this.visibleNumberChildrenStart - this.visibleNumberChildrenShown, 0);

        this.checkShowGraph();
    }

    clickPageRight() {
        // Move to the next page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageRight', '@Start');

        let maxStart: number = Math.max(
            this.graphDataLength - this.visibleNumberChildrenShown, 0);

        this.visibleNumberChildrenStart = Math.min(
            this.visibleNumberChildrenStart + this.visibleNumberChildrenShown, maxStart);

        this.checkShowGraph();
    }

    clickPageLast() {
        // Move to the Last page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageLast', '@Start');

        this.visibleNumberChildrenStart = Math.max(
            this.graphDataLength - this.visibleNumberChildrenShown, 0);

        this.checkShowGraph();
    }

    calcGraphDataDimensions(inputGraphDataLength: number) {
        // Calc dimensions of the graph Data to display on the form
        this.globalFunctionService.printToConsole(this.constructor.name, 'calcGraphDataDimensions', '@Start');

        this.visibleNumberChildrenShown = Math.min(this.visibleNumberChildrenShownInput, inputGraphDataLength);

    }

    // Temp dummy data for demo - must be done via DB
    tempCreateDummyData() {

        // Populate the watchList - TODO via DB
        let watchListNew: NavigatorWatchList =
        {
            id: 1,
            userID: 'JannieI',
            nodeType: 'Company',
            nodes: ['Absa', 'PSG']
        };
        this.watchList.push(watchListNew);

        this.ngCustomViews.push(
            {
                id: 1,
                name: 'Rene v Wyk',
                description: 'Parent nodes for Rene v Wyk'
            }
        );
        this.ngCustomViews.push(
            {
                id: 2,
                name: 'Pair-wise search',
                description: 'Show all companies where person A is CEO and person B is CFO of subsidiary'
            }
        );
        this.ngCustomViews.push(
            {
                id: 3,
                name: 'CFO articles-auditors',
                description: 'Show companies where the CFO has appointed the Auditors where he articled'
            }
        );
        this.ngCustomViews.push(
            {
                id: 4,
                name: 'Group Common Parents',
                description: 'Show common parents for a group of nodes (filtered by properties)'
            }
        );
        this.ngCustomViews.push(
            {
                id: 5,
                name: 'Distance < n',
                description: 'Show all nodes that are less than n nodes away from the current children'
            }
        );
        this.ngCustomViews.push(
            {
                id: 6,
                name: 'CFO no AuditCom',
                description: 'Show all companies with a CFO/FM but no Audit Committee'
            }
        );
    }

}

