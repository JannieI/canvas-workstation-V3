/*
 * Manage a single Navigator component
 */

// From Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Datasource }                 from './models'
import { NavigatorHistory }           from './models'
import { NavigatorRelationship }      from './models'
import { NavigatorProperties }        from './models'
import { NavigatorNodeFiler }         from './models'
import { NavigatorNodePropertiesOLD }           from './models'
import { NavigatorNodeTypeFieldsOLD }           from './models'
import { NavigatorParentRelatedChildOLD }       from './models'
import { NavigatorWatchList }         from './models'
import { Widget }                     from './models'

// Functions, 3rd Party
import { parse }                      from 'vega';
import { View }                       from 'vega';


@Component({
    selector: 'widget-navigator',
    templateUrl: './widget.navigator.component.html',
    styleUrls: ['./widget.navigator.component.css']
})
export class WidgetNavigatorComponent {
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    @Input() selectedWidget: Widget;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        event.preventDefault();
        if (event.key === 'ArrowRight'  ||  event.key === 'ArrowDown'  ||
            event.key === 'ArrowLeft'   ||  event.key === 'ArrowUp') {
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

    ngNetworks: Datasource[] = [];
    networkRelationships: NavigatorRelationship[] = [];
    networkProperties: NavigatorProperties[] = [];
    ngDropdownParentNodes: string[] = [];
    ngDropdownParentNodeTypes: string[] = [];
    ngDropdownRelationships: string[] = [];

    selectedNetworkID: number = -1;
    selectedNetworkRelationshipID: number = -1;
    selectedNetworkPropertiesID: number = -1;

    // Selected - value selected in a dropdown
    selectedChildFilterID: number = -1;
    selectedHistoryID: number = -1;
    selectedNodeType: string = '';
    selectedParentFilterID: number = -1;
    selectedParentNode: string = '';
    selectedParentNodeType: string = '';
    selectedRelationship: string = '';
    selectedView: string = 'DefaultView';

    networkGraph: Array<string[]> = [];
    networkGraph2: NavigatorRelationship[] = [];
    nodeTypeFields: NavigatorNodeTypeFieldsOLD[] = [];     // Property Fields per NodeType
    nodeProperties: NavigatorNodePropertiesOLD[] = [];     // Properties per node for fields above
    parentRelatedChildren: NavigatorParentRelatedChildOLD[] = [];  // Parents and related children
    watchList: NavigatorWatchList[] = [];               // Watchlist per user and per NodeType

    // Working
    childDataAll: any[] = [];                           // List of all children after filter
    childDataVisible: any[] = [];                       // Visible children, based on nrShown
    childNodeFilter: NavigatorNodeFiler[] = [];         // Actual Filter
    childFields: string[] = ['Gender', 'Age'];
    childFilterErrorMessage: string = '';
    errorMessage: string = '';
    filteredChildNodes: string[] = [];                  // List of Node, after filtered on NodeProperties
    filterChildFieldName: string = '';
    filterChildOperator: string = '';
    filterChildValue: string = '';
    filterID: number = -1;
    filteredParentNodes: string[] = [];                 // List of Node, after filtered on NodeProperties
    filterParentFieldName: string = '';
    filterParentOperator: string = '';
    filterParentValue: string = '';
    firstAdjacencyCellRowNr: number = -1;
    graphData: any[] = [];                              // childDataAll formatted for Vega
    history: NavigatorHistory[] = [];                   // History for current network
    historyAll: NavigatorHistory[] = [];                // All history for All networks
    parentFields: string[] = ['Sector', 'Country', 'City'];
    parentFilterErrorMessage: string = '';
    parentNodeFilter: NavigatorNodeFiler[] = [];        // Actual Filter
    relationshipRoles: string[] = [];
    visibleNumberChildren: number = 12;

    // Graph dimensions
    graphHeight: number = 400;        // TODO - fill this into Spec
    graphWidth: number = 400;         // TODO - fill this into Spec

    // Form layout and elements
    graphNotes: string = 'Optional Additional information';
    graphTitle: string = 'Directors for Absa, filtered by age (9/24)';
    showHistory: boolean = false;
    showNetwork: boolean = false;
    showRoles: boolean = false;
    showVisibleNumberInput: boolean = false;

    // Widget and Graph (Vega)
    localWidget: Widget;                            // W to modify, copied from selected
    showSpecificGraphLayer: boolean = false;
    specification: any;             // Full spec for Vega, or other grammar
    
    // Popups and forms
    showGraphHelp: boolean = false;
    showGraphNotes: boolean = false;
    showGraphProperties: boolean = false;
    showNetworkAdd: boolean = false;

    watchListFiltered: boolean = false;


    navNodeIsDone: string[] = [];
    navNodesToDo: string[] = [];
    singleRoutesArray: Array<string[]> = [];
    navMaxRecursion: number = 100;
    navRecursionCounter: number = 0;
    navVisitedNodes: string[] = [];
    navSinglePaths: Array<string[]> = [];


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


        // Populate persisted data - TODO via DB
        this.tempCreateDummyData();



        // Read DS for all Networks from DB
        this.globalVariableService.getResource('datasources', 'filterObject={"isNetworkShape": true}')
            .then(res => {
                this.ngNetworks = res;

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

    clickMenuClearHistory() {
        // Clear history for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuClearHistory', '@Start');

        this.history = this.history.filter(h => h.networkID != this.selectedNetworkID);
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
        a.setAttribute('href', 'data:text/plain;charset=utf-u, '+encodeURIComponent(JSON.stringify(obj)));
        a.setAttribute('download', fileName);
        a.click()

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

    clickCloseGraphPropertiesPopup() {
        // Close popup for graph properties
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseGraphPropertiesPopup', '@Start');

        this.showGraphProperties = true;
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

    clickNetwork(index: number, networkID: number) {
        // Clicked a network (or called from ngOnInit)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNetwork', '@Start');

        // Remember the ID of the selected Network
        this.selectedNetworkID = networkID;

        // Read the Data for this W from the DB
        if (this.selectedNetworkID >= 0) {
            if (this.ngNetworks[this.selectedNetworkID].subDatasources.length != 2) {
                // TODO - make friendly
                console.log('ERROR ...')
            } else {
                
                this.selectedNetworkRelationshipID = this.ngNetworks[this.selectedNetworkID].subDatasources[0];
                this.globalVariableService.getData(
                    'datasourceID=' + this.selectedNetworkRelationshipID.toString()
                    )
                    .then(res => {
                        this.networkRelationships = res;

                        // Fill ParentNode type combo: + 'All', unique, sorted
                        let leftNodeTypes: string[] = this.networkRelationships.map(nr => nr.leftNodeType);
                        let rightNodeTypes: string[] = this.networkRelationships.map(nr => nr.rightNodeType);
                        this.ngDropdownParentNodeTypes = Array.from(
                            new Set(leftNodeTypes.concat(rightNodeTypes))
                        );

                        this.ngDropdownParentNodeTypes = this.ngDropdownParentNodeTypes
                            .sort( (a,b) => {
                                if (a > b) return 1;
                                if (a < b) return -1;
                                return 0;
                            });
                        this.ngDropdownParentNodeTypes = ['All', ...this.ngDropdownParentNodeTypes];
            
                        this.selectedNetworkPropertiesID = this.ngNetworks[index].subDatasources[1];
                        this.globalVariableService.getData(
                            'datasourceID=' + this.selectedNetworkPropertiesID.toString()
                            )
                            .then(res => {
                                this.networkProperties = res;

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

                                this.history = this.historyAll
                                    .filter(h => h.networkID === networkID)
                                    .sort( (a,b) => {
                                        if (a.id < b.id) {
                                            return 1;
                                        };
                                        if (a.id > b.id) {
                                            return -1;
                                        };
                                        return 0;
                                    });

                                // Click the first row
                                if (this.history.length > 0) {
                                    this.clickHistory(0, this.history[0].id);
                                } else {
                                    // Clear the graph
                                    this.clickNetworkSummary(index);
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

    clickHistory(index: number, historyID: number) {
        // Click a point in history, and show that graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHistory', '@Start');

        // Set the history id, selected fields
        this.selectedParentNodeType = this.history[index].parentNodeType;
        this.selectedParentNode = this.history[index].parentNode;
        this.selectedRelationship = this.history[index].relationship;
        this.showRoles = this.history[index].showRoles;

        // Set the history id and reset the isSelected field in history
        this.selectedHistoryID = historyID;
        this.history.forEach(h => {
            if (h.id === historyID) {
                h.isSelected = true;
            } else {
                h.isSelected = false;
            };
        });

        // Show the graph
        this.showGraph(0, 0, false)
    }
    
    changeParentNodeType(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentNodeType', '@Start');

        // Set selected Nod
        this.selectedParentNodeType = ev.target.value;

        // Fill ParentNodes combo: + '', All', unique, sorted
        this.ngDropdownParentNodes = this.distinctNodesPerNodeType(this.selectedParentNodeType);
        this.ngDropdownParentNodes = ['', 'All', ...this.ngDropdownParentNodes];

        if (this.filteredParentNodes.length > 0) {
            this.ngDropdownParentNodes = this.ngDropdownParentNodes.filter(
                x => this.filteredParentNodes.indexOf(x) >= 0
            );
        };

        // Fill Relationships combo: + 'All', unique, sorted
        this.ngDropdownRelationships = this.distinctRelationships(this.selectedParentNodeType);
        this.ngDropdownRelationships = ['All', ...this.ngDropdownRelationships];

        this.relationshipRoles = [];
        this.selectedParentNode = '';
        this.selectedRelationship = '';
        this.childNodeFilter = [];
        this.selectedChildFilterID = -1;

    }

    changeParentNode(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentNode', '@Start');

        this.selectedParentNode = ev.target.value;

        // Determine relationship roles
        this.relationshipRoles = [];
        this.showRoles = false;
        this.relationshipRoles = this.parentRelatedChildren
            .filter(x => x.parentNodeType === this.selectedParentNodeType
                && x.parentNode === this.selectedParentNode
                && x.relationship === this.selectedRelationship
                && x.role != ''
                && x.role != null)
            .map(y => {
                if (y.role != '') { return y.role};
            });

        // Make unique
        let relationshipRolesSet = new Set(this.relationshipRoles);
        this.relationshipRoles = Array.from(relationshipRolesSet);

        // Clear child filter
        this.clickChildFilterClear();

        // Show graph if all 3 selected
        this.checkShowGraph();
    }

    changeRelationship(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeRelationship', '@Start');

        this.selectedRelationship = ev.target.value;

        // Determine relationship roles
        this.relationshipRoles = [];
        this.showRoles = false;
        this.relationshipRoles = this.parentRelatedChildren
            .filter(x => x.parentNodeType === this.selectedParentNodeType
                && x.parentNode === this.selectedParentNode
                && x.relationship === this.selectedRelationship
                && x.role != ''
                && x.role != null)
            .map(y => {
                if (y.role != '') { return y.role};
            });
    
        // Make unique
        let relationshipRolesSet = new Set(this.relationshipRoles);
        this.relationshipRoles = Array.from(relationshipRolesSet);

        // Clear child filter
        this.clickChildFilterClear();

        // Show graph if all 3 selected
        this.checkShowGraph();

    }

    checkShowGraph() {
        // Check if all selected; then show graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'checkShowGraph', '@Start');


        // Show the graph when all fields selected
        if (this.selectedParentNodeType != ''
            &&
            this.selectedParentNode != ''
            &&
            this.selectedRelationship != '') {
            this.showGraph();
        };
    }

    showGraph(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Re-create the Vega spec, and show the graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'showGraph', '@Start');

        this.graphTitle = '';
        // Build data and graph if all parent & relationship fields selected
        if (this.selectedParentNodeType != ''
            && this.selectedParentNode != ''
            && this.selectedRelationship != '') {

            // Set the data, some unique
            this.childDataAll = this.parentRelatedChildren
                .filter(x => x.parentNodeType === this.selectedParentNodeType
                    && x.parentNode === this.selectedParentNode
                    && x.relationship === this.selectedRelationship)
                .map(y => y.childNode);
            this.relationshipRoles = this.parentRelatedChildren
                .filter(x => x.parentNodeType === this.selectedParentNodeType
                    && x.parentNode === this.selectedParentNode
                    && x.relationship === this.selectedRelationship
                    && x.role != ''
                    && x.role != null)
                .map(y => y.role);

            // Make unique
            let relationshipRolesSet = new Set(this.relationshipRoles);
            this.relationshipRoles = Array.from(relationshipRolesSet);

            // Filter If a Child filter is active
            if (this.filteredChildNodes.length > 0) {
                this.childDataAll = this.childDataAll
                    .filter(z => this.filteredChildNodes.indexOf(z) >= 0);
            };

            // Set title, etc
            this.graphTitle = this.showRoles?  '*'  :  '';
            this.graphTitle = this.graphTitle + this.selectedRelationship + ' for ' 
                + this.selectedParentNode;
            if (this.filterChildFieldName != '') {
                this.graphTitle = this.graphTitle + ', filtered on ' + this.filterChildFieldName;
            };

            // Reduce visible list
            this.childDataVisible = this.childDataAll.slice(0, this.visibleNumberChildren);

            // Format the graphData
            this.graphData = [];
            if (!this.showRoles) {

                // Parent
                this.graphData.push(
                { "id": 1,
                "name": this.selectedParentNode
                });

                // Children
                for (var i = 0; i < this.childDataVisible.length; i++) {
                    this.graphData.push({
                        id: i + 2,
                        name: this.childDataVisible[i],
                        parent: 1
                    });
                };
            } else {

                // Parent
                this.graphData.push(
                    { "id": 1,
                    "name": this.selectedParentNode
                    });

                // Offset
                let offset: number = 2;

                for (var roleID = 0; roleID < this.relationshipRoles.length; roleID++) {
                    let parentRoleID = offset;
                    this.graphData.push(
                        { "id": parentRoleID,
                        "name": this.relationshipRoles[roleID],
                        parent: 1
                        });

                    // Get list of Children for this role
                    let childrenFilteredRole: string[] = this.parentRelatedChildren
                        .filter(x => x.parentNodeType === this.selectedParentNodeType
                            && x.parentNode === this.selectedParentNode
                            && x.relationship === this.selectedRelationship
                            && x.role === this.relationshipRoles[roleID])
                        .map(y => y.childNode);

                    // Increment with 1, which was added above
                    offset = offset + 1;
                    for (var childID = 0; childID < childrenFilteredRole.length; childID++) {
                        this.graphData.push(
                            { "id": childID + offset,
                            "name": childrenFilteredRole[childID],
                            parent: parentRoleID
                            });
                    };
                    offset = offset + childrenFilteredRole.length;
                };
            };

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

                // Deselect all history, and add a new one at the top
                this.history.forEach(x => x.isSelected = false);
                this.selectedHistoryID = this.history.length;
                let historyNew: NavigatorHistory =
                    {
                        id: this.history.length,
                        text: this.graphTitle,
                        networkID: this.selectedNetworkID,
                        parentNodeID: null,
                        parentNodeType: this.selectedParentNodeType,
                        parentNode: this.selectedParentNode,
                        relationship: this.selectedRelationship,
                        showRoles: this.showRoles,
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
                        isSelected: true
                    };
                this.history = [historyNew, ...this.history];
                this.historyAll = [historyNew, ...this.historyAll];
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

            // Set data
            this.graphData = [];
            this.graphData.push(
                { "id": 1,
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

        // Create specification
        // @Demo
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
        view.addEventListener('click', function(event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            let childNodeClicked: string = datumClick.name;

            // this.selectedParentNodeType = this.selectedParentNodeType.bind(this);

            console.log('XX CLICKED showGraph', datumClick.name, childNodeClicked, this.selectedParentNodeType, this.childDataVisible);

            // Find Child in list of visible children
            let childClicked: number = this.childDataVisible.findIndex(
                cdv => cdv.childNode === childNodeClicked);

            if (childClicked >= 0) {
                let childNodeTypeClick: string = this.childDataVisible[childClicked].childNodeType;
                console.log('xx childClicked', childNodeTypeClick)
                this.selectedParentNodeType = childNodeTypeClick;
                this.selectedParentNode = childNodeClicked;
                this.selectedRelationship = 'All';
            };
        });

        // TODO - experimental: this automatically invokes 2 CLICK events as well ...
        view.addEventListener('dblclick', function(event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('DBLCLICK', item, item.datum.text, datumClick.name);
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

    clickNetworkSummary(networkIndex: number) {
        // Show a summary of the network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNetworkSummary', '@Start');

        // Find unique Nodes
        let uniqueNodeTypes: string[] = this.distinctNodeTypes();
        
        // Count relationships
        let nodeCount: number = -1;
        let uniqueNodesWithCount: {nodeType: string; nodeCount: number}[] = [];
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
                    name: uniqueNodesWithCount[i].nodeType  + ' ('
                    + uniqueNodesWithCount[i].nodeCount.toString() + ')',
                    parent: 1
                }
            );
        };

        this.graphTitle = 'Summary of ' + this.ngNetworks[networkIndex].name
            + ' network';

        // Dimension it
        this.graphHeight = 400; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 400; //this.localWidget.graphLayers[0].graphSpecification.width;

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
        view.addEventListener('click', function(event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK nwSumm', item, item.datum.text, datumClick.name);
            this.selectedParentNodeType = 'Person';
            this.selectedParentNode = 'Koos';
            this.selectedRelationship = 'Director-Of';
        });
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();



        // Show all node types
        let nodeTypes: string[] = this.navNodeTypes();
        console.log('xx Node Types navNodesTypes', nodeTypes)


        // Show all nodes for Person Node type
        console.log('xx Properties per Node Type navPropertiesPerNodeType for ', 
            nodeTypes[1], this.navPropertiesPerNodeType(nodeTypes[1]))

        
        // Find the Col Nr for 'Company' in Property List
        console.log('xx Col Nr for Company in Property List:', 
            this.navNodeTypeColumnNumber(nodeTypes[0])) 

        
        // Show Nodes for NodeType 'Company'
        console.log('xx Show Nodes for NodeType Company',
            this.navNodesPerNodeType(nodeTypes[0])) 


        // Find Top 40 'Companies'
        let nodeProperty: string[] = this.navPropertiesPerNodeType(nodeTypes[0]);
        console.log('xx node filtered on :', nodeTypes[0], nodeProperty[0], 
            this.navNodesFilteredPerProperty(nodeTypes[0], nodeProperty[0]))


        // Calc start of adjacency grid
        this.firstAdjacencyCellRowNr = this.navFirstAdjacencyCellRowNr();
        console.log('xx firstAdjacencyCellRowNr', this.firstAdjacencyCellRowNr)

        console.log('xx ------------------------------------------------ 1 ')
        console.log('xx ')

        // Distance from y to z
        this.navNodeIsDone = [];
        this.navNodesToDo = ['y'];
        this.navRecursionCounter = 0;

        let navTargetNode: string = 'z';
        this.singleRoutesArray = [];
        for (var i = 0; i < this.navNodesToDo.length; i++) {

            console.log('xx START AT NODE ', this.navNodesToDo[i])
            console.log('xx ************* ')

            // Get the relationships for this node
            let nodeRelationships: string[] = this.navNodeRelationships(this.navNodesToDo[i]);
            console.log('xx nodeRelationships', nodeRelationships);

            // Travers relationships - used when we have SPECIFIC relatiionships all the way
            // for a tree - Works
            nodeRelationships.forEach(r => {

                // Reset path with just the start node
                this.navNodeIsDone = [this.navNodesToDo[i]];

                // Reset full path 
                this.navVisitedNodes = [];

                // Get all the starting points of this Node.  Then travers the single route
                let relatedNodes: string [] = this.navRelatedNodes(this.navNodesToDo[i], r);
                console.log('xx onInit relatedNodes', this.navNodesToDo[i], relatedNodes)
            
                relatedNodes.forEach(rn => {
                    this.navSingleRoute(rn, this.navNodesToDo[i], r, this.navNodeIsDone);
                });
            });

            // Find relationships and determine single routes for each starting point

            // // Reset path with just the start node
            // this.navNodeIsDone = [this.navNodesToDo[i]];

            // // Reset full path 
            // this.navVisitedNodes = [];

            // // Get all the starting points of this Node.  Then travers the single route
            // let relatedNodes: string [] = this.navRelatedNodes(this.navNodesToDo[i], 'all');
            // console.log('xx onInit relatedNodes', this.navNodesToDo[i], relatedNodes)
        
            // relatedNodes.forEach(rn => {
            //     this.navSingleRoute(rn, this.navNodesToDo[i], 'all', this.navNodeIsDone);
            // });

        };

        // End result
        console.log('xx END RESULT 1 this.navSinglePaths', this.navSinglePaths)


        console.log('xx ------------------------------------------------ 2 ')
        console.log('xx ')

        // Close network popup
        this.showNetwork = false;

    }


    nav2WalkInPath(
        parent: string, 
        nodeName: string, 
        relationship: string, 
        iterationCount: number,
        path: string[]
        ) {
        // Walk to next node in path for given info (parent, node, ect)
        this.globalFunctionService.printToConsole(this.constructor.name, 'nav2WalkInPath', '@Start');

        // Stop if Cyclical
        if (path.indexOf(nodeName) >= 0) {
            path.push(nodeName + '*');
            console.log('xx nav2WalkInPath @END path', iterationCount, path);
            path = [];
            return;
        };

        // Add this node to path
        path.push(nodeName);

        // Increment
        iterationCount = iterationCount + 1;

        // Get next nodes in path, Left and Right, excluding the Parent
        let nextInPath: string[] = [];
        let leftInPath: string[] = this.networkGraph2
            .filter(nw => nw.leftNodeName === nodeName  &&  nw.rightNodeName != parent)
            .map(nw => nw.rightNodeName);
        let rightInPath: string[] = this.networkGraph2
            .filter(nw => nw.rightNodeName === nodeName  &&  nw.leftNodeName != parent)
            .map(nw => nw.leftNodeName);

        // Combine
        nextInPath = leftInPath.concat(rightInPath);

        // Log
        console.log('xx nav2WalkInPath related nodeName', nodeName, ' (from ', parent, ')', nextInPath, 'path:', path)

        if (nextInPath.length == 0) {
            console.log('xx nav2WalkInPath @END path', iterationCount, path)
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
        uniqueNodeTypes =this.navUniqifySortNodes(uniqueNodeTypes);

        // Return
        return uniqueNodeTypes;
    }

    distinctRelationships(selectedParentNodeType: string): string[] {
        // Return distinct array of Relationships per Node Type for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctRelationships', '@Start');

        // Fill ParentNode type combo: + 'All', unique, sorted
        let leftRelationships: string[] = this.networkRelationships
            .map(nr => nr.relationshipLeftToRight);
        let rightRelationships: string[] = this.networkRelationships
            .map(nr => nr.relationshipRightToLeft);
        let nodeRelationships: string[] = Array.from(new Set(leftRelationships.concat(rightRelationships)));

        // Make sure it is unique, non-null list
        nodeRelationships = this.navUniqifySortNodes(nodeRelationships);

        // Return
        return nodeRelationships;
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

        // Make sure it is unique, non-null list
        nodesPerNodeType = this.navUniqifySortNodes(nodesPerNodeType);

        // Return
        return nodesPerNodeType;
    }

    navNodesPerNodeType(nodeType: string): string[] {
        // Return array of Nodes (names) per given Node Type
        this.globalFunctionService.printToConsole(this.constructor.name, 'navNodesPerNodeType', '@Start');

        // Get column number
        let nodeTypeColumnNumber: number = this.navNodeTypeColumnNumber(nodeType);

        // Filter correct Col
        let nodes: string[] = this.networkGraph
            .filter(x => x[nodeTypeColumnNumber] == '1')
            .map(y => y[0]);

        // Make sure it is unique, non-null list
        nodes = this.navUniqifySortNodes(nodes);

        // Return
        return nodes;
    }

    navPropertiesPerNodeType(nodeType: string): string[] {
        // Return distinct sorted array of Properties per given Node Type
        this.globalFunctionService.printToConsole(this.constructor.name, 'navPropertiesPerNodeType', '@Start');

        // Filter correct Col
        let nodeTypeProperties: string[] = this.networkGraph
            .filter(x => x[2] == nodeType)
            .map(y => y[3]);

        // Make sure it is unique, non-null list
        nodeTypeProperties = this.navUniqifySortNodes(nodeTypeProperties, true, true);

        // Return
        return nodeTypeProperties;
    }

    navNodeTypeColumnNumber(property: string): number {
        // Return column number of a given property
        this.globalFunctionService.printToConsole(this.constructor.name, 'navNodeTypeColumnNumber', '@Start');

        let columnNumber: number = -1;

        // Determine the column number in Array where the given property heading lives
        for (var j = 0; j < this.networkGraph[1].length; j++) {
            if (this.networkGraph[1][j] === property) {
                columnNumber = j;
                break;
            };
        };
        
        // Return
        return columnNumber; 

    }


    navNodesFilteredPerProperty(nodeType: string, property: string): string[] {
        // Return array of Nodes (names) filtered on a given Node Type & Property
        this.globalFunctionService.printToConsole(this.constructor.name, 'navNodesFilteredPerProperty', '@Start');

        // Find column number
        let propertyColumnNumber: number = -1;
        for (var j = 0; j < this.networkGraph[1].length; j++) {
            if (this.networkGraph[2][j] == nodeType  &&  this.networkGraph[3][j] == property) {
                propertyColumnNumber = j;
                break;
            };
        };

        if (propertyColumnNumber == -1) {
            return [];
        } else {
            let nodesPerProperty: string[] = this.networkGraph
                .filter(row => row[propertyColumnNumber] == '1')
                .map(x => x[0])

            // Make sure it is unique, non-null list
            nodesPerProperty = this.navUniqifySortNodes(nodesPerProperty);

            // Return
            return nodesPerProperty;

        };
    }
    
    navFirstAdjacencyCellRowNr(): number {
        // Return the row nr of the first cell (= col nr) with adjacency data 
        // this.globalFunctionService.printToConsole(this.constructor.name, 'navFirstAdjacencyCellRowNr', '@Start');

        let firstAdjacencyCellRowNr: number = this.networkGraph[0].findIndex(x => x != '');
        return firstAdjacencyCellRowNr;
    }

    navRelatedNodes(startNode: string, relationship: string): string[] {
        // Return ALL Nodes with specified relationships to startNode.  This is useful when
        // a node is linked to more than one Parent, but cannot be used to traverse a branch
        // of a tree (since a child may occur under the parent, but also in other unrelated
        // places).
        // relationships = 'all' for any relationship
        // this.globalFunctionService.printToConsole(this.constructor.name, 'navRelatedNodesAll', '@Start');

        let firstAdjacencyCellRowNr: number = this.navFirstAdjacencyCellRowNr();
        let relatedNodes: string [] = [];
        
        // Find related Nodes
        for (var r = firstAdjacencyCellRowNr; r < this.networkGraph.length; r++) {
            for (var c = firstAdjacencyCellRowNr; c < this.networkGraph.length; c++) {
                if (
                        this.networkGraph[r][0] === startNode  
                        &&  
                        (
                            (relationship != 'all'  &&  this.networkGraph[r][c] === relationship)
                            ||
                            (relationship == 'all'  &&  this.networkGraph[r][c].trim() != "")
                        )
                        &&
                        (this.networkGraph[0][c] != undefined)   
                    ) {
                    relatedNodes.push(this.networkGraph[0][c]);
                };
            };
        };

        // Make sure it is a unique, non-null list
        relatedNodes = this.navUniqifySortNodes(relatedNodes);

        // Return
        return relatedNodes;

    }

    navNodeRelationships(startNode: string): string[] {
        // Return a unique list of different relationships that a given Node has
        // this.globalFunctionService.printToConsole(this.constructor.name, 'navNodeRelationships', '@Start');

        let firstAdjacencyCellRowNr: number = this.navFirstAdjacencyCellRowNr();
        let relationships: string [] = [];
        
        // Find related Nodes
        for (var r = firstAdjacencyCellRowNr; r < this.networkGraph.length; r++) {
            for (var c = firstAdjacencyCellRowNr; c < this.networkGraph.length; c++) {

                if (this.networkGraph[r][0] === startNode  
                    &&  
                    this.networkGraph[r][c] != ''
                    &&  
                    this.networkGraph[r][c] != undefined) {
                    relationships.push(this.networkGraph[r][c]);
                };
            };
        };

        // Make sure it is a unique, non-null list
        relationships = this.navUniqifySortNodes(relationships);

        // Return
        return relationships;

    }

    navNextNodesInPath(startNode: string, relationship: string, strictNode: string = null): string[] {
        // Return next Nodes in path with specified relationships to startNode
        // this.globalFunctionService.printToConsole(this.constructor.name, 'navNextNodesInPath', '@Start');

        let nextNodesInPath: string [] = [];
        let relatedNodes: string [] = this.navRelatedNodes(startNode, relationship);

        relatedNodes.forEach(n => {
            let grandChildren: string [] = this.navRelatedNodes(startNode, relationship);
            
            // The strictness test means that the grand children (related nodes of 
            // related node) must contain a given node.  Typically used to make sure
            // it only returns true children of the same path (and not jump to 
            // another unrelated path)
            let strictTest: boolean = true;
            if (strictNode != null) {
                let grandChildren: string[] = this.navRelatedNodes(n, relationship);
                if (grandChildren.indexOf(strictNode) < 0) {
                    strictTest = false;
                };
            };

            if (strictTest) {
                nextNodesInPath.push(n);
            };
        })
                
        console.log('xx nextNodesInPath', nextNodesInPath)

        // Make sure it is a unique, non-null list
        nextNodesInPath = this.navUniqifySortNodes(nextNodesInPath);

        // Return
        return nextNodesInPath;

    }

    navUniqifySortNodes(
        inputNodes: string[], 
        uniqify: boolean = true, 
        sort: boolean = false
        ): string[] {
        // Make given array of nodes unique and sort, if so requested
        // this.globalFunctionService.printToConsole(this.constructor.name, 'navUniqifySortNodes', '@Start');

        // Make sure it is a non-null list
        if (inputNodes == null  ||  inputNodes == undefined) {
            inputNodes = [];
        };

        // Make sure it is unique, non-null list
        if (uniqify) {
            inputNodes = Array.from(new Set(inputNodes));
        };

        // No undefined
        inputNodes.filter(n => n != undefined);
        
        // Sort
        inputNodes.sort( (a,b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });

        // Return
        return inputNodes;

    }
        
    navSingleRoute(navStartNode: string, parentNode: string, relationship: string, path: string[]) {
        // Recursive process to get a single route for a start Node
        this.globalFunctionService.printToConsole(this.constructor.name, 'navSingleRoute', '@Start');

        console.log('xx navSingleRoute START node-parent-path', this.navRecursionCounter, navStartNode, parentNode, path)

        // Safety check
        this.navRecursionCounter = this.navRecursionCounter + 1;
        if (this.navRecursionCounter > this.navMaxRecursion) {
            console.log('xx navSingleRoute navMaxRecursion EXCEEDED')
            return;
        };

        // Add to path
        path.push(navStartNode);
        this.navVisitedNodes.push(navStartNode);

        // Get children of start Node in the SAME path
        let childrenOfStartNode: string[] = this.navNextNodesInPath(navStartNode, relationship);
        console.log('xx navSingleRoute childrenOfStartNode', childrenOfStartNode)

        // Create new path, minus navStartNode and parentNode
        let newChildrendOfStartNode: string [] = [];
        childrenOfStartNode.forEach(child => {
            if (child != navStartNode  
                &&  
                child != parentNode  
                &&  
                path.indexOf(child) < 0  
                &&  
                this.navVisitedNodes.indexOf(child) < 0
                ) {
                newChildrendOfStartNode.push(child)
            };
        });
        console.log('xx navSingleRoute newChildrendOfStartNode', newChildrendOfStartNode);

        // Single, unique route if pathNew is empty
        if (newChildrendOfStartNode.length == 0) {
            this.singleRoutesArray.push(path);
            console.log('xx navSingleRoute ROUTE path', path);
            this.navSinglePaths.push(path);
            path = [];
            return;
        };

        // Call recursively with new path
        newChildrendOfStartNode.forEach(child =>  {
            let newPath: string[] = [];
            path.forEach(c => newPath.push(c));
            console.log('xx newPath', newPath);
            this.navSingleRoute(child, navStartNode, relationship, newPath);
        });
    }

    dblclickDeleteHistory(index: number, historyID: number) {
        // Delete selected history row.  If current, move to first
        this.globalFunctionService.printToConsole(this.constructor.name, 'dblclickDeleteHistory', '@Start');

        this.history = this.history.filter(h => h.id != historyID);
        this.historyAll = this.historyAll.filter(h => h.id != historyID);

    }

    clickParentFilterClear() {
        // Clear the Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickFilterClear', '@Start');

        // Clear all
        this.parentNodeFilter = [];
        this.filteredParentNodes = [];

    }

    clickParentFilterSave() {
        // Add Parent Filter, and create list of parent nodes as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickParentFilterSave', '@Start');

        // TODO - for now, only one filter by choice.  In future, consider more than one as
        // data structurs allows it

        // Validation
        if (this.filterParentFieldName === '') {
                this.parentFilterErrorMessage = 'The field name is compulsory';
                return;
        };
        if (this.filterParentOperator) {
            this.parentFilterErrorMessage = 'The operator is compulsory';
            return;
        };
        if (this.filterParentValue) {
            this.parentFilterErrorMessage = 'The value is compulsory';
            return;
        };

        // Clear all
        this.clickParentFilterClear();

        // Save parent filter
        this.parentNodeFilter.push(
            {
                id: 1,
                field: this.filterParentFieldName,
                operator: this.filterParentOperator,
                value: this.filterParentValue
            });

        // Filter ParentNodes
        // TODO - do other operands than ==
        this.filteredParentNodes = this.nodeProperties
            .filter(x => x[this.filterParentFieldName] === this.filterParentValue)
            .map(y => y.node);

        // Make unique
        let filteredParentNodeSet = new Set(this.filteredParentNodes);
        this.filteredParentNodes = Array.from(filteredParentNodeSet);

    }

    clickParentFilterClose() {
        // Close Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickParentFilterClose', '@Start');

    }

    clickChildFilterSave() {
        // Add Parent Filter, and create list of parent nodes as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickChildFilterSave', '@Start');

        // TODO - for now, only one filter by choice.  In future, consider more than one as
        // data structurs allows it

        // Validation
        if (this.filterChildFieldName === '') {
            this.childFilterErrorMessage = 'The field name is compulsory';
            return;
        };
        if (this.filterChildOperator) {
            this.childFilterErrorMessage = 'The operator is compulsory';
            return;
        };
        if (this.filterChildValue) {
            this.childFilterErrorMessage = 'The value is compulsory';
            return;
        };

        // Clear all
        this.clickChildFilterClear();

        // Save parent filter
        this.childNodeFilter.push(
            {
                id: 1,
                field: this.filterChildFieldName,
                operator: this.filterChildOperator,
                value: this.filterChildValue
            });

        // Filter ParentNodes
        // TODO - do other operands than ==
        this.filteredChildNodes = this.nodeProperties
            .filter(x => x[this.filterChildFieldName] === this.filterChildValue)
            .map(y => y.node);

        // Make unique
        let filteredChildNodeSet = new Set(this.filteredChildNodes);
        this.filteredChildNodes = Array.from(filteredChildNodeSet);

    }

    clickChildFilterClear() {
        // Close Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickChildFilterClear', '@Start');

        // Clear all
        this.childNodeFilter = [];
        this.filteredChildNodes = [];
    }

    clickChildFilterClose() {
        // Close Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickChildFilterClose', '@Start');

    }

    changeParentFilterField() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentFilterField', '@Start');

    }

    changeParentFilterOperator() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentFilterOperator', '@Start');

    }

    clickDefaultView() {
        // Show the default view = tree with children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDefaultView', '@Start');

        // Refresh the graph
        this.selectedView = 'DefaultView'

        this.showGraph();
    }

    clickCommonParentView() {
        // Show the Common Node view = list of all nodes where 2 or more children have the 
        // same parent
        // Example: which directors of Absa are also direcytors of another company
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonParentView', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonParentView';

        this.graphData = [];
        this.graphData.push(
            { "id": 1,
             "name": "CommonParent"
            });
        this.graphData.push({
            id: 2,
            name: "Absa",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "Johnathon (Director)",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Martha (Director)",
            parent: 2
        });
        this.graphData.push({
            id: 5,
            name: "Bidvest",
            parent: 1
        });
        this.graphData.push({
            id: 6,
            name: "Johnathon (Shareholder)",
            parent: 5
        });
        this.graphData.push({
            id: 7,
            name: "Olivia (CFO)",
            parent: 5
        });

        this.graphTitle = 'Common parents for any Directors of Absa';

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
        view.addEventListener('click', function(event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK CommParnt', item, item.datum.text, datumClick.name);
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

    clickCommonNodeView() {
        // Show the Common Parent view = list of all nodes where any children has the 
        // same parent as a specified node
        // Example: which directors of Absa are children of the same node as Jannie Mouton
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonNodeView', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonNodeView'

        this.graphData = [];
        this.graphData.push(
            { "id": 1,
             "name": "CommonNode"
            });
        this.graphData.push({
            id: 2,
            name: "Steinhoff",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "Johnathon (Shareholder)",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Mandy (Shareholder)",
            parent: 2
        });
        this.graphData.push({
            id: 5,
            name: "Aspen",
            parent: 1
        });
        this.graphData.push({
            id: 6,
            name: "Johnathon (Shareholder)",
            parent: 5
        });
        this.graphData.push({
            id: 7,
            name: "Gareth (Director)",
            parent: 5
        });

        this.graphTitle = 'Common parents for Johnathon... & Directors of Absa';

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
        view.addEventListener('click', function(event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK CommNod', item, item.datum.text, datumClick.name);
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

    clickDistanceView() {
        // Show the Distance view = sub tree with all nodes between a given child and
        // a specified node
        // Example: how are directors of Absa related to Markus Jooste
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDistanceView', '@Start');

        // Refresh the graph
        this.selectedView = 'DistanceView'

        this.graphData = [];
        this.graphData.push(
            { "id": 1,
             "name": ""
            });
        this.graphData.push({
            id: 2,
            name: "Johnathan",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "BarlowWorld",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Meridith (Director)",
            parent: 3
        });
        this.graphData.push({
            id: 5,
            name: "Meridith (Shareholder)",
            parent: 3
        });
        this.graphData.push({
            id: 6,
            name: "Mandy",
            parent: 1
        });
        this.graphData.push({
            id: 7,
            name: "Bidvest",
            parent: 6
        });
        this.graphData.push({
            id: 8,
            name: "Plumblink (Subsidiary)",
            parent: 7
        });
        this.graphData.push({
            id: 9,
            name: "Meridith (CEO)",
            parent: 8
        });

        this.graphTitle = 'Distance: Meridith... to some Directors of Absa';

        // Dimension it
        this.graphHeight = 300; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 400; //this.localWidget.graphLayers[0].graphSpecification.width;

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
        view.addEventListener('click', function(event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK Dist', item, item.datum.text, datumClick.name);
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

    clickNodeTypeView() {
        // Show the Node Type View = full tree with all children of a given node type
        // Example: all beneficiary shareholders of company and subsidiaries
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNodeTypeView', '@Start');

        // Refresh the graph
        // this.selectedView = 'NodeTypeView'

        this.graphData = [];
        this.graphData.push(
            { "id": 1,
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
        view.addEventListener('click', function(event, item) {
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

    clickAdditionalLevel() {
        // Add an additional level to the default view, based on a property of the relationship
        // that has already been defined.
        // Example: if false, company  -> Directors
        //          if true,  company  ->  Ex/Non-Exec  ->  Directors
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalLevel', '@Start');

        this.showRoles = !this.showRoles;

        this.showGraph();
    }

    clickPageLeft() {
        // Move to the previous page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageLeft', '@Start');
    }

    clickPageRight() {
        // Move to the next page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageRight', '@Start');

        this.showNetwork = !this.showNetwork;
        this.nav2WalkInPath(null, "y", "rel", 0, [])
    }

    changeChildFilterOperator(ev: any) {
        // Change Child filter operator
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeChildFilterOperator', '@Start');

    }

    changeChildFilterField() {
        // Change Child Filter Field
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeChildFilterField', '@Start');

    }



    // Temp dummy data for demo - must be done via DB
    tempCreateDummyData() {

        // Populate networks - TODO make from DB

        let newParentRelatedChildren: NavigatorParentRelatedChildOLD =
            {
                id: 1,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Matlare, Peter Bambatha',
                role: 'Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 2,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Quinn, Jason Patrick',
                role: 'Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
        {
            id: 3,
            networkID: 1,
            parentNodeID: null,
            parentNodeType: 'Company',
            parentNode: 'Absa',
            relationship: 'Shareholders',
            childNodeType: 'Company',
            childNode: 'Nedbank',
            role: ''
        }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
        {
            id: 4,
            networkID: 1,
            parentNodeID: null,
            parentNodeType: 'Company',
            parentNode: 'Absa',
            relationship: 'Shareholders',
            childNodeType: 'Person',
            childNode: 'John',
            role: ''
        }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
        {
            id: 5,
            networkID: 1,
            parentNodeID: null,
            parentNodeType: 'Person',
            parentNode: 'Koos',
            relationship: 'Director-Of',
            childNodeType: 'Company',
            childNode: 'PSG',
            role: 'Listed'
        }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
        {
            id: 6,
            networkID: 1,
            parentNodeID: null,
            parentNodeType: 'Person',
            parentNode: 'Koos',
            relationship: 'Director-Of',
            childNodeType: 'Company',
            childNode: 'AECI',
            role: 'Non-Listed'
        }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
        {
            id: 7,
            networkID: 1,
            parentNodeID: null,
            parentNodeType: 'Person',
            parentNode: 'Koos',
            relationship: 'Manager-Of',
            childNodeType: 'Person',
            childNode: 'Chris',
            role: ''
        }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
        {
            id: 8,
            networkID: 1,
            parentNodeID: null,
            parentNodeType: 'Person',
            parentNode: 'Koos',
            relationship: 'Manager-Of',
            childNodeType: 'Person',
            childNode: 'Anna',
            role: ''
        }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 9,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr van Wyk, Rene',
                role: 'Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 10,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Ms Abdool-Samad, Tasneem',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 11,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Beggs, Colin',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 12,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Ms Cuba, Yolanda Zoleka',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 13,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Okomo-Okello, Francis',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 14,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Darko, Alex Boama',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 15,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Hodge, Daniel',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 16,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Husain, Mohamed Junaid',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 17,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Ms Lucas-Bull, Wendy Elizabeth',  // Elizabeth
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 18,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Mr Merson, Mark',
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);
        newParentRelatedChildren =
            {
                id: 19,
                networkID: 1,
                parentNodeID: null,
                parentNodeType: 'Company',
                parentNode: 'Absa',
                relationship: 'Directors',
                childNodeType: 'Person',
                childNode: 'Ms Naidoo, Dhanasagree',  //  (Daisy)
                role: 'Non-Executive'
            }
        this.parentRelatedChildren.push(newParentRelatedChildren);

        let newNodeTypeFields: NavigatorNodeTypeFieldsOLD =
        {
            id: 1,
            nodeType: 'Company',
            fields: ['Sector', 'Country', 'City']
        }
        this.nodeTypeFields.push(newNodeTypeFields);
        newNodeTypeFields =
        {
            id: 2,
            nodeType: 'Person',
            fields: ['Age', 'Gender']
        }
        this.nodeTypeFields.push(newNodeTypeFields);

        let newNodeProperties: NavigatorNodePropertiesOLD = {
            id: 1,
            sourceRecordID: 1,
            nodeType: 'Company',
            node: 'Absa',
            sector: 'Bank',
            country: 'South Africa',
            city: 'Cape Town',
            age: null,
            gender: null
        }
        this.nodeProperties.push(newNodeProperties);
        newNodeProperties = {
            id: 2,
            sourceRecordID: 2,
            nodeType: 'Company',
            node: 'Bidvest',
            sector: 'Industrial',
            country: 'South Africa',
            city: 'Durban',
            age: null,
            gender: null
        }
        this.nodeProperties.push(newNodeProperties);
        newNodeProperties = {
            id: 3,
            sourceRecordID: 3,
            nodeType: 'Company',
            node: 'AECI',
            sector: 'Industrial',
            country: 'Botswana',
            city: 'Gabarone',
            age: null,
            gender: null
        }
        this.nodeProperties.push(newNodeProperties);
        newNodeProperties = {
            id: 4,
            sourceRecordID: 12,
            nodeType: 'Company',
            node: 'Nedbank',
            sector: 'Bank',
            country: 'South Africa',
            city: 'Durban',
            age: null,
            gender: null
        }
        this.nodeProperties.push(newNodeProperties);
        newNodeProperties = {
            id: 5,
            sourceRecordID: 510,
            nodeType: 'Company',
            node: 'PSG',
            sector: 'Financial',
            country: 'South Africa',
            city: 'Johannesburg',
            age: null,
            gender: null
        }
        this.nodeProperties.push(newNodeProperties);
        newNodeProperties = {
            id: 6,
            sourceRecordID: 2,
            nodeType: 'Person',
            node: 'Koos',
            sector: null,
            country: null,
            city: null,
            age: 59,
            gender: 'Male'
        }
        this.nodeProperties.push(newNodeProperties);
        newNodeProperties = {
            id: 7,
            sourceRecordID: 2,
            nodeType: 'Person',
            node: 'Anna',
            sector: null,
            country: null,
            city: null,
            age: 44,
            gender: 'Female'
        }
        this.nodeProperties.push(newNodeProperties);
        newNodeProperties = {
            id: 8,
            sourceRecordID: 2,
            nodeType: 'Person',
            node: 'Chris',
            sector: null,
            country: null,
            city: null,
            age: 37,
            gender: 'Male'
        }
        this.nodeProperties.push(newNodeProperties);

        // Populate the watchList - TODO via DB
        let watchListNew: NavigatorWatchList =
            {
                id: 1,
                userID: 'JannieI',
                nodeType: 'Company',
                nodes: ['Absa', 'PSG']
            };
        this.watchList.push(watchListNew);

        
        // Build the Array for the network - Nodes, properties, proximity / relationships
        this.networkGraph = [];
        this.networkGraph.push(Array("",  "",        "",        "",       "",        "",       "",         "",       "",       "A", "B", "C", "D", "x", "y", "z"));
        this.networkGraph.push(Array("",  "",        "",        "",       "Company", "Person", "",         "",       "",       "",  "",  "",  "",  "",  "",  "" ));
        this.networkGraph.push(Array("",  "",        "",        "",       "",        "",        "Company", "Person", "Person", "",  "",  "",  "",  "",  "",  "" ));
        this.networkGraph.push(Array("",  "",        "",        "",       "",        "",        "Top 40",  "Male",   "Female", "",  "",  "",  "",  "",  "",  "" ));
        this.networkGraph.push(Array("",  "Company", "",        "",       "",        "",        "",        "",       "",       "1", "1", "1", "1", "",  "",  "" ));
        this.networkGraph.push(Array("",  "Person",  "",        "",       "",        "",        "",        "",       "",       "",  "",  "",  "",  "1", "1", "1"));
        this.networkGraph.push(Array("",  "",        "Company", "Top 40", "",        "",        "",        "",       "",       "1", "",  "1", "",  "",  "",  "" ));
        this.networkGraph.push(Array("",  "",        "Person",  "Male",   "",        "",        "",        "",       "",       "",  "",  "",  "",  "1", "1", "" ));
        this.networkGraph.push(Array("",  "",        "Person",  "Female", "",        "",        "",        "",       "",       "",  "",  "",  "",  "",  "",  "1"));
        this.networkGraph.push(Array("A", "",        "",        "",       "1",       "",        "1",       "",       "",       "",  "",  "1", "",  "1", "",  "" ));
        this.networkGraph.push(Array("B", "",        "",        "",       "1",       "",        "",        "",       "",       "",  "",  "",  "",  "",  "2", "2"));
        this.networkGraph.push(Array("C", "",        "",        "",       "1",       "",        "1",       "",       "",       "1", "",  "",  "1", "",  "",  "1"));
        this.networkGraph.push(Array("D", "",        "",        "",       "1",       "",        "",        "",       "",       "",  "",  "1", "",  "1", "1", "" ));
        this.networkGraph.push(Array("x", "",        "",        "",       "",        "1",       "",        "1",      "",       "1", "",  "",  "1", "",  "",  "" ));
        this.networkGraph.push(Array("y", "",        "",        "",       "",        "1",       "",        "1",      "",       "",  "2", "",  "1", "",  "",  "" ));
        this.networkGraph.push(Array("z", "",        "",        "",       "",        "1",       "",        "",       "1",      "",  "2", "1", "",  "",  "",  "" ));
        console.log('xx Row 5', this.networkGraph.filter(row => row[1] == 'Company') )
        console.log('xx networkGraph Cell [9,0] = A', this.networkGraph[9][0])

        // Build the Array for the network - Nodes, properties, proximity / relationships
        this.networkGraph2 = [];
        this.networkGraph2.push(
            {
                id: 1,
                networkID: 1,
                leftNodeID: 1,
                leftNodeType: "Company",
                leftNodeName: "A",
                relationshipLeftToRight: "Subsidiary",
                relationshipRightToLeft: "Owned By",
                rightNodeID: 3,
                rightNodeType: "Company",
                rightNodeName: "C",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 2,
                networkID: 1,
                leftNodeID: 1,
                leftNodeType: "Company",
                leftNodeName: "A",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 5,
                rightNodeType: "Person",
                rightNodeName: "x",
                relationshipProperty: "Executive"
            }
        );
        this.networkGraph2.push(
            {
                id: 3,
                networkID: 1,
                leftNodeID: 3,
                leftNodeType: "Company",
                leftNodeName: "C",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 7,
                rightNodeType: "Person",
                rightNodeName: "z",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 4,
                networkID: 1,
                leftNodeID: 3,
                leftNodeType: "Company",
                leftNodeName: "C",
                relationshipLeftToRight: "Subsidiary",
                relationshipRightToLeft: "Owned By",
                rightNodeID: 4,
                rightNodeType: "Company",
                rightNodeName: "D",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 5,
                networkID: 1,
                leftNodeID: 4,
                leftNodeType: "Company",
                leftNodeName: "D",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 8,
                rightNodeType: "Person",
                rightNodeName: "a",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 6,
                networkID: 1,
                leftNodeID: 4,
                leftNodeType: "Company",
                leftNodeName: "D",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 6,
                rightNodeType: "Person",
                rightNodeName: "y",
                relationshipProperty: ""
            }
        );
    };

}

