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
import { Datasource }                 from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

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

    @Output() formWidgetCheckpointsClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    datagridColumns: DatagridColumn[] = [];
    datagridInput: DatagridInput =
    {
        datagridColumns: this.datagridColumns,
        datagridData: null,
        datagridPagination: false,
        datagridPaginationSize: 10,
        datagridShowHeader: false,
        datagridShowRowActionMenu: false,
        datagridShowData: true,
        datagridShowFooter: true,
        datagridRowHeight: 12,
        datagriduserCanChangeProperties: false,
        datagridShowTotalsRow: false,
        datagridShowTotalsCol: false,
        datagridCanEditInCell: false,
        datagridCanExportData: false,
        datagridEmptyMessage: 'No Alerts created so far'
    };

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        this.globalVariableService.getCanvasActivities().then (ca => {
            this.datagridInput.datagridData = ca;
            if (ca.length > 0) {
                const columns = Object.keys(ca[0]);
                for (var i = 0; i < columns.length; i++) {
                    this.datagridColumns.push(
                    {
                        id: i,
                        displayName: columns[i],
                        fieldName: columns[i],
                        databaseDBTableName: '',
                        databaseDBFieldName: '',
                        tooltip: '',
                        datatype: 'string',
                        prefix: '',
                        divideBy: 0,
                        displayLength: 12,
                        maxLength: 0,
                        sortOrder: '',
                        filter: '',
                        backgroundColor: '',
                        color: '',
                        conditionalFormatColor: '',
                        nrDataQualityIssues: 0,
                        maxValue: 0,
                        minValue: 0,
                        average: 0,
                        linkedDashboardID: 0,
                        linkedDashboardTabID: 0,
                        isFrozen: false,
                    });
                };
            };
        })
    }

    ngAfterViewInit() {

        let definition = this.createVegaLiteSpec(undefined,'bar',undefined,undefined,undefined);

        // Render
        this.renderGraph(definition)

    }

    clickSelectStep() {
        let definition = this.createVegaLiteSpec(undefined,'line',undefined,undefined,undefined);

        // Render
        this.renderGraph(definition)

    }

    renderGraph(definition: any) {
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

    createVegaLiteSpec(
        description: string = 'First bar chart.',
        mark: string = 'bar',
        xfield: string = 'Month',
        yfield: string = 'Trades',
        title: string = 'Average Trading'): dl.spec.TopLevelExtendedSpec {

        let vlSpecsNew: dl.spec.TopLevelExtendedSpec = this.globalVariableService.vlTemplate;

        vlSpecsNew['data']['values'] = [
            {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55},
            {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91},
            {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
            {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87},
            {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
            {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
        ];
        vlSpecsNew['description'] = description;
        vlSpecsNew['mark']['type'] = mark;
        vlSpecsNew['encoding']['x']['field'] = xfield;
        vlSpecsNew['encoding']['y']['field'] = yfield;
        vlSpecsNew['title']['text'] = title;
        console.log('createVegaLiteSpec', vlSpecsNew)

        return vlSpecsNew;

    }

  }