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

    clickRow(index: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.currentWidgetCheckpoints[index].widgetSpec
        );

        // Render
        this.renderGraph(definition)

    }

    clickAddCheckpoint() {
        // Delete selected Checkpoint
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeleteCheckpoint', '@Start');

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
        this.globalVariableService.addWidgetCheckpoints(newCheckpoint).then(res => {
            newCheckpoint.id = res.id;
            this.currentWidgetCheckpoints.push(newCheckpoint);
        });
    }

    clickDeleteCheckpoint(index: number, id: number) {
        // Delete selected Checkpoint
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeleteCheckpoint', '@Start');

        // Remove locally, globally and from DB
        this.currentWidgetCheckpoints.splice(index, 1)
        let x: number = 0;
        for (x = 0; x < this.globalVariableService.widgetCheckpoints.length; x++){
            if (this.globalVariableService.widgetCheckpoints[x].id == id){
                break;
            };
        };
        this.globalVariableService.widgetCheckpoints.splice(x, 1);
        this.globalVariableService.deleteWidgetCheckpoints(id);

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

    // createVegaLiteSpec(
    //     description: string = 'First bar chart.',
    //     mark: string = 'bar',
    //     xfield: string = 'Month',
    //     yfield: string = 'Trades',
    //     title: string = 'Average Trading'): dl.spec.TopLevelExtendedSpec {

    //     let vlSpecsNew: dl.spec.TopLevelExtendedSpec = this.globalVariableService.vlTemplate;

    //     vlSpecsNew['data']['values'] = [
    //         {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55},
    //         {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91},
    //         {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
    //         {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87},
    //         {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
    //         {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
    //     ];
    //     vlSpecsNew['description'] = description;
    //     vlSpecsNew['mark']['type'] = mark;
    //     vlSpecsNew['encoding']['x']['field'] = xfield;
    //     vlSpecsNew['encoding']['y']['field'] = yfield;
    //     vlSpecsNew['title']['text'] = title;
    //     console.log('createVegaLiteSpec', vlSpecsNew)

    //     return vlSpecsNew;

    // }

}