/*
 * Manage a single Graph component
 */

// From Angular
import { Component }                  from '@angular/core';
import { Input }                      from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Widget }                     from './models'

// Functions, 3rd Party
import { compile }                    from 'vega-lite';
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

    graphAreaWidth: number = 900;
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
    navigatorWidth: number = 1360;
    networkAreaWidth: number = 170;
    selectedNode: string = 'Absa';
    selectedNodeType: string = 'Company';
    showSpecificGraphLayer: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
    networks: 
        {
            id: number; 
            name: string; 
            description: string;
            equal: boolean;
            isSelected: boolean;
        }[] = []
    specification: any;              // Full spec for Vega, or other grammar
    totalNavigatorWidth: number = 1000;

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

        this.totalNavigatorWidth = this.networkAreaWidth + this.historyAreaWidth 
            + this.graphAreaWidth;
            
        // Populate networks
        let networksNew: 
            {
                id: number; 
                name: string; 
                description: string;
                equal: boolean;
                isSelected: boolean;
            } = 
            {id: 1, name: "WOWEB", description: "WOWEB", equal: true, isSelected: true};
        this.networks.push(networksNew);
        networksNew = {id: 2, name: "Facebook", description: "Facebook", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 3, name: "Family", description: "Family", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 4, name: "Industries", description: "Industries", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 5, name: "Companies", description: "Companies", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 6, name: "Contacts", description: "Contacts", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 7, name: "Friends", description: "Friends", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 8, name: "Shopping", description: "Shopping", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 9, name: "Restaurants", description: "Restaurants", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 10, name: "UN structure", description: "UN structure", equal: false, isSelected: false}
        this.networks.push(networksNew);
        networksNew = {id: 11, name: "Government structure", description: "Government structure", equal: false, isSelected: false}
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

        // Deep copy Local W
        this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.localWidget.graphHeight,
            this.localWidget.graphWidth,
            this.showSpecificGraphLayer,
            0
        );
console.log('xx this.specification', this.specification)

            // // Render in DOM - VegaLite testing
            // let vegaSpecification = compile(this.specification).spec;
            // let view = new View(parse(vegaSpecification));

            // view.renderer('svg')
            //     .initialize(this.dragWidget.nativeElement)
            //     // .width(372)
            //     .hover()
            //     .run()
            //     .finalize();
        
        // Render in DOM
        let view = new View(parse(this.specification));
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();
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
}