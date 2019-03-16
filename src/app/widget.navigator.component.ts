/*
 * Manage a single Graph component
 */

// From Angular
import { Component }                  from '@angular/core';
import { Input }                      from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { OnInit }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Widget }                     from './models'
import { NavigatorNetwork }           from './models'
import { NavigatorParentRelatedChild }      from './models'
import { NavigatorNodeTypeFields }    from './models'
import { NavigatorNodeProperties }    from './models'
import { NavigatorWatchList }         from './models'

// Functions, 3rd Party
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

interface watchList 
    {
        id: number; 
        userID: string; 
        nodeType: string;	
        nodes: string[];
    }[];

@Component({
    selector: 'widget-navigator',
    templateUrl: './widget.navigator.component.html',
    styleUrls: ['./widget.navigator.component.css']
})
export class WidgetNavigatorComponent {
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    @Input() selectedWidget: Widget;

    // Input
    networks: NavigatorNetwork[] = [];
    parentRelatedChildren: NavigatorParentRelatedChild[];  // Parents and related children
    nodeTypeFields: NavigatorNodeTypeFields[] = [];     // Property Fields per NodeType
    nodeProperties: NavigatorNodeProperties[] = [];     // Properties per node for fields above
    watchList: NavigatorWatchList[] = [];               // Watchlist per user and per NodeType

    // Selected


    // Working

    graphAreaWidth: number = 900;
    graphTitle: string = 'Directors for Absa, filtered by age (9/24)';
    graphNote: string = 'Optional Additional information';
    history: 
    {
        id: number; 
        text: string; 
        nodeType: string;
        node: string;
        filter: string;
        relationship: string;
        childFilter: string;
        equal: boolean;
        isSelected: boolean;
    }[] = [];
    historyAreaWidth: number = 170;
    localWidget: Widget;                            // W to modify, copied from selected
    navigatorWidth: number = 1360;
    networkAreaWidth: number = 170;
    filterID: number = -1;
    selectedNode: string = 'Absa';
    selectedNodeType: string = 'Company';
    selectedRelationship: string = 'Directors';
    showNodeFilters: boolean = false;
    showSpecificGraphLayer: boolean = false;
    showHistoryMax: boolean = true;
    showNetworkMax: boolean = true;
    specification: any;             // Full spec for Vega, or other grammar
    graphHeight: number = 400;        // TODO - fill this into Spec
    graphHeightOriginal: number = 400;        // TODO - fill this into Spec
    graphWidth: number = 400;         // TODO - fill this into Spec
    graphWidthOriginal: number = 400;         // TODO - fill this into Spec
    selectedNetworkID: number;
    totalNavigatorWidth: number = 1000;
    watchListFiltered: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'constructor', '@Start');

    }

    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // The Total width is that of the two panels, plus the svg, plus some scrolling space
        this.totalNavigatorWidth = this.networkAreaWidth + this.historyAreaWidth + 22
            + (this.graphWidth * 1.2);

        // Populate networks - TODO make from DB
        let networksNew: NavigatorNetwork = {id: 1, name: "WOWEB", description: "WOWEB", userPermissions: null, groupPermissions: null, isSelected: true};
        this.networks.push(networksNew);
        networksNew = {id: 2, name: "Facebook", description: "Facebook", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 3, name: "Family", description: "Family", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 4, name: "Industries", description: "Industries", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 5, name: "Companies", description: "Companies", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 6, name: "Contacts", description: "Contacts", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 7, name: "Friends", description: "Friends", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 8, name: "Shopping", description: "Shopping", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 9, name: "Restaurants", description: "Restaurants", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 10, name: "UN structure", description: "UN structure", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 11, name: "Government structure", description: "Government structure", userPermissions: null, groupPermissions: null, isSelected: false}
        this.networks.push(networksNew);

        let historyNew: 
            {
                id: number; 
                text: string; 
                nodeType: string;
                node: string;
                filter: string;
                relationship: string;
                childFilter: string;
                equal: boolean;
                isSelected: boolean;
            } = 
            {
                id: 1,
                text: 'Directors for Absa',
                nodeType: 'Company',
                node: 'Absa',
                filter: '',
                relationship: 'Directors',
                childFilter: '',
                equal: true,
                isSelected: false,
            };
        this.history.push(historyNew);
        historyNew =
            {
                id: 2,
                text: 'Managers for Maria Ramos',
                nodeType: 'Person',
                node: 'Maria Ramos',
                filter: '',
                relationship: 'Managers',
                childFilter: '',
                equal: true,
                isSelected: true,
            };
        this.history.push(historyNew);
        historyNew =
            {
                id: 2,
                text: 'Subsidiaries of Bidvest',
                nodeType: 'Companies',
                node: 'Bidvest',
                filter: '',
                relationship: 'Subsidiaries',
                childFilter: '',
                equal: true,
                isSelected: false,
            };
        this.history.push(historyNew);


        // Populate the watchList
        let watchListNew: watchList =
            {
                id: 1,
                userID: 'JannieI',
                nodeType: 'Company',	
                nodes: ['Absa','PSG']
            };


        // Deep copy Local W
        this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));
        
        // Display graph
        this.showGraph();
    }


    clickSingleWidget() {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSingleWidget', '@Start');

        // // TODO - fix index..
        // this.currentWidgets[index].isSelected = !this.currentWidgets[index].isSelected;
        // this.globalVariableService.currentWidgets.forEach(w => {
        //     if (w.id == id) {
        //         w.isSelected = this.currentWidgets[index].isSelected;
        //     };
        // });

    }

    clickShowParentFilter() {
        // Open Filter for Parent Nodes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowParentFilter', '@Start');

        this.showNodeFilters = true;
    }

    clickHistoryMinMax() {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHistoryMinMax', '@Start');

        this.showHistoryMax = !this.showHistoryMax;

        // Refresh graph - take margin into account
        this.graphWidth = this.graphWidthOriginal + 
            (this.showHistoryMax?  0  : 138) +  (this.showNetworkMax?  0  :  130);
        console.log('xx this.graphWidth', this.graphWidth)
        this.showGraph(0, this.graphWidth)
    }

    clickNetworkMinMax() {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNetworkMinMax', '@Start');

        this.showNetworkMax = !this.showNetworkMax;

        // Refresh graph
        this.graphWidth = this.graphWidthOriginal + 
            (this.showHistoryMax?  0  : 130) +  (this.showNetworkMax?  0  :  130)
        console.log('xx this.graphWidth', this.graphWidth)
        this.showGraph(0, this.graphWidth)
    }

    showGraph(inputHeight: number = 0, inputWidth: number = 0) {
        // Re-create the Vega spec, and show the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'showGraph', '@Start');

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
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight,
            this.graphWidth,
            this.showSpecificGraphLayer,
            0
        );

        console.log('xx this.specification', this.specification)

        // Render in DOM
        let view = new View(parse(this.specification));
        view.addEventListener('click', function(event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.  
            let datumClick: any = item.datum;
            console.log('CLICK', item, item.datum.text, datumClick.name);
            this.selectedNodeType = 'Person';
            this.selectedNode = 'Bidvest';
            this.selectedRelationship = 'Shareholders';
        });
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();

    }

    clickDeleteHistory() {
        // Delete selected history row.  If current, move to first
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeleteHistory', '@Start');

    }

    clickFilterOnWatchList() {
        // Filter the parent node dropdown on the watchlist as well.  This action happens
        // only when clicked - the next navigation does not automatically filter the 
        // this dropdown.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterOnWatchList', '@Start');

        this.watchListFiltered = !this.watchListFiltered;
    }

    clickNetwork(index: number, networkID: number) {
        // Clicked a network
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNetwork', '@Start');

        this.selectedNetworkID = networkID;
    }

    clickParentFilterClear() {
        // Clear the Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterClear', '@Start');

    }

    clickParentFilterAdd() {
        // Add Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickParentFilterAdd', '@Start');

    }

    clickParentFilterClose() {
        // Close Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickParentFilterClose', '@Start');

    }

    clickMenuGraphHeight() {
        // Menu option to adjust graph height
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuGraphHeight', '@Start');

    }

    clickMenuGraphWidth() {
        // Menu option to adjust graph width
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuGraphWidth', '@Start');

    }

    clickMenuClearHistory() {
        // Clear history for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuClearHistory', '@Start');

    }

    clickMenuExportGraph() {
        // Export the current graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuExportGraph', '@Start');

    }

    dblClickFilterMakeInActive() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickFilterMakeInActive', '@Start');

    }

    changeParentNodeType() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name,'changeParentNodeType', '@Start');

    }

    changeParentNode() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name,'changeParentNode', '@Start');

    }

    changeParentFilterField() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name,'changeParentFilterField', '@Start');

    }

    changeParentFilterOperator() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name,'changeParentFilterOperator', '@Start');

    }

    changeRelationship() {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name,'changeRelationship', '@Start');

    }

}