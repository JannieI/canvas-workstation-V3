// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile, transform }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';


@Component({
    selector: 'widget-checkpoints',
    templateUrl: './widget.checkpoints.component.html',
    styleUrls: ['./widget.checkpoints.component.css']
})
export class WidgetCheckpointsComponent implements OnInit {

    @Input() selectedWidget: Widget;

    @Output() formWidgetCheckpointsClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    checkpointName: string;
    currentWidgetCheckpoints: WidgetCheckpoint[];
    datagridColumns: DatagridColumn[];
    nrCheckpoints: number = 1;
    selectedRow: number = 0;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        console.log('xx this.selectedWidget', this.selectedWidget)
        this.globalVariableService.getWidgetCheckpoints().then (ca => {
            // Set the data for the grid
            this.currentWidgetCheckpoints = ca.filter(wc =>
                wc.dashboardID == this.selectedWidget.dashboardID
                &&
                wc.widgetID == this.selectedWidget.id
            );

            this.nrCheckpoints = this.currentWidgetCheckpoints.length;

            if (this.currentWidgetCheckpoints != undefined) {
                if (this.currentWidgetCheckpoints.length > 0) {
                    let definition = this.globalVariableService.createVegaLiteSpec(
                        this.currentWidgetCheckpoints[0].widgetSpec);

                    // Render
                    this.renderGraph(definition)
                };
            };

            // Set the column object
            this.datagridColumns = this.globalVariableService.createDatagridColumns(
                ca[0], ["id", "name"]);

        })
    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
        this.nrCheckpoints = this.currentWidgetCheckpoints.length;

        // Refresh graph
        let idx: number = -1;
        for (var i = 0; i < this.currentWidgetCheckpoints.length; i++) {
            if (this.currentWidgetCheckpoints[i].id == id) { 
                idx = i;
            };
        };

        // Render
        if (this.currentWidgetCheckpoints.length > 0) {
            let definition = this.globalVariableService.createVegaLiteSpec(
                this.currentWidgetCheckpoints[idx].widgetSpec
            );
            this.renderGraph(definition)
        };

    }

    clickAddCheckpoint() {
        // Delete selected Checkpoint
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddCheckpoint', '@Start');

        let newCheckpoint: WidgetCheckpoint = {
            id: null,
            active: false,
            dashboardID: this.selectedWidget.dashboardID,
            widgetID: this.selectedWidget.id,
            name: this.checkpointName,
            widgetSpec: JSON.parse(JSON.stringify(this.selectedWidget)),
            creator: this.globalVariableService.currentUser.userID,
            createdOn: '217/01/01'
        };

        // Add locally, globally and to DB (with new ID)
        this.globalVariableService.addWidgetCheckpoint(newCheckpoint).then(res => {
            console.log('xx res', res)
            newCheckpoint.id = res.id;
            this.currentWidgetCheckpoints.splice(0, 0, newCheckpoint);
            this.nrCheckpoints = this.currentWidgetCheckpoints.length;

        // // Update W
        // if (this.currentWidgetCheckpoints.length > 0) {
        //     this.selectedWidget.showCheckpoints = false;
        //     if (this.selectedWidget.checkpointIDs.indexOf(id) < 0) {
        //         this.selectedWidget.checkpointIDs.push(id);
        //     };
        //     this.selectedWidget.currentCheckpoint = 0;
        //     this.selectedWidget.lastCheckpoint = -1;
        // } else {
        //     this.selectedWidget.showCheckpoints = false;
        //     this.selectedWidget.checkpointIDs = [];
        //     this.selectedWidget.currentCheckpoint = 0;
        //     this.selectedWidget.lastCheckpoint = -1;



            this.clickRow(0, res.id);
        });

        // Update W
        if (this.currentWidgetCheckpoints.length > 0) {
            this.selectedWidget.showCheckpoints = true;
        } else {
            this.selectedWidget.showCheckpoints = false;
        };
        
    }

    clickDeleteCheckpoint(id: number) {
        // Delete selected Checkpoint
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeleteCheckpoint', '@Start');

        let index: number = -1;
        for (var i = 0; i < this.currentWidgetCheckpoints.length; i++) {
            if (this.currentWidgetCheckpoints[i].id == id) { 
                index = i;
            };
        };

        // Remove locally, globally and from DB
        if (index >= 0) {
            this.currentWidgetCheckpoints.splice(index, 1);
        };
        this.globalVariableService.deleteWidgetCheckpoint(id);
        
        this.nrCheckpoints = this.currentWidgetCheckpoints.length;

        // Update W
        this.selectedWidget.showCheckpoints = false;
        index = -1;
        for (var i = 0; i < this.selectedWidget.checkpointIDs.length; i++) {
            if (this.selectedWidget.checkpointIDs[i] == id) {
                index = i;
            };
        };
        if (index > -1) {
            this.selectedWidget.checkpointIDs.splice(index, 1);
        };
        this.selectedWidget.currentCheckpoint = 0;
        this.selectedWidget.lastCheckpoint = this.currentWidgetCheckpoints.length - 1;
        console.log('xx W', this.selectedWidget)

    }

    renderGraph(definition: any) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'renderGraph', '@Start');

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .width(300)
            .height(240)
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'left', "200px");

    }

  	clickClose(action: string) {
	  	this.formWidgetCheckpointsClosed.emit(action);
        }

}