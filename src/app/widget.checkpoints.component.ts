/*
 * Shows form to manage Widget checkpoints
 */

 // Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';


@Component({
    selector: 'widget-checkpoints',
    templateUrl: './widget.checkpoints.component.html',
    styleUrls: ['./widget.checkpoints.component.css']
})
export class WidgetCheckpointsComponent implements OnInit {

    @Input() selectedWidget: Widget;

    @Output() formWidgetCheckpointsClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickAddCheckpoint();
            return;
        };

    }

    checkpointName: string;
    currentWidgetCheckpoints: WidgetCheckpoint[];
    errorMessage = '';
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

        this.globalVariableService.getResource('widgetCheckpoints')
            .then (ca => {
                // Set the data for the grid
                this.currentWidgetCheckpoints = ca.filter(wc =>
                    wc.dashboardID === this.selectedWidget.dashboardID
                    &&
                    wc.widgetID === this.selectedWidget.id
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

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.checkpoint reading widgetCheckpoints: ' + err);
            });
    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
        this.nrCheckpoints = this.currentWidgetCheckpoints.length;

        // Refresh graph
        let idx: number = -1;
        for (var i = 0; i < this.currentWidgetCheckpoints.length; i++) {
            if (this.currentWidgetCheckpoints[i].id === id) {
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
        // Add a new Checkpoint
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddCheckpoint', '@Start');

        var today = new Date();
        let newCheckpoint: WidgetCheckpoint = {
            id: null,
            originalID: null,
            parentWidgetIsDeleted: false,
            active: false,
            dashboardID: this.selectedWidget.dashboardID,
            widgetID: this.selectedWidget.id,
            name: this.checkpointName,
            widgetSpec: JSON.parse(JSON.stringify(this.selectedWidget)),
            creator: this.globalVariableService.currentUser.userID,
            createdOn: today
        };

        // Add locally, globally and to DB (with new ID)
        this.globalVariableService.addResource('widgetCheckpoints', newCheckpoint)
            .then(res => {

                newCheckpoint.id = res.id;
                this.currentWidgetCheckpoints.splice(0, 0, newCheckpoint);
                this.nrCheckpoints = this.currentWidgetCheckpoints.length;

                // Update W
                this.selectedWidget.showCheckpoints = false;
                if (this.selectedWidget.checkpointIDs.indexOf(res.id) < 0) {
                    this.selectedWidget.checkpointIDs.push(res.id);
                };
                this.selectedWidget.currentCheckpoint = 0;
                this.selectedWidget.lastCheckpoint = this.currentWidgetCheckpoints.length - 1;

                // Save to DB
                this.globalVariableService.saveWidget(this.selectedWidget);

                // Show the Graph
                this.clickRow(0, res.id);
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.checkpoint adding widgetCheckpoints: ' + err);
            });
    
    }

    dblclickDeleteCheckpoint(id: number) {
        // Delete selected Checkpoint
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDeleteCheckpoint', '@Start');

        let index: number = -1;
        for (var i = 0; i < this.currentWidgetCheckpoints.length; i++) {
            if (this.currentWidgetCheckpoints[i].id === id) {
                index = i;
            };
        };

        // Remove locally, globally and from DB
        if (index >= 0) {
            this.currentWidgetCheckpoints.splice(index, 1);
        };
        this.globalVariableService.deleteResource('widgetCheckpoints', id)
            .then(res => {

                this.nrCheckpoints = this.currentWidgetCheckpoints.length;

                // Update W
                this.selectedWidget.showCheckpoints = false;
                index = -1;
                for (var i = 0; i < this.selectedWidget.checkpointIDs.length; i++) {
                    if (this.selectedWidget.checkpointIDs[i] === id) {
                        index = i;
                    };
                };
                if (index > -1) {
                    this.selectedWidget.checkpointIDs.splice(index, 1);
                };
                this.selectedWidget.currentCheckpoint = 0;
                this.selectedWidget.lastCheckpoint = this.currentWidgetCheckpoints.length - 1;

                // Save to DB
                this.globalVariableService.saveWidget(this.selectedWidget);

                // Show the Graph
                if (this.currentWidgetCheckpoints.length > 0) {
                    this.clickRow(0, this.currentWidgetCheckpoints[0].id);
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.checkpoint deleting widgetCheckpoints: ' + err);
            });
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