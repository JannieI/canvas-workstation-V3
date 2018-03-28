// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our models
import { Datasource }                 from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'widget-expand',
    templateUrl: './widget.expand.component.html',
    styleUrls: ['./widget.expand.component.css']
})
export class WidgetExpandComponent implements OnInit {

    dataset;
    @Input() selectWidgetIndex: number;
    @Input() selectDatasetID: number;
    @Input() selectDatasourceID: number;
    @Output() formWidgetExpandClosed: EventEmitter<string> = new EventEmitter();

    currentDatasetLength: number;
    datasources: Datasource[] = [];
    dataFieldNames: string[] = [];
    datagridColumns: DatagridColumn[] = [];
    datagridInput: DatagridInput =
    {
        datagridColumns: this.datagridColumns,
        datagridData: null,
        datagridPagination: false,
        datagridPaginationSize: 7,
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
        datagridEmptyMessage: 'No records to export',
        datagridVisibleFields: []
        
    };
    records: number = 6;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // this.globalVariableService.filePath = './assets/data.dataset' +
        //     this.selectDatasetID.toString() + '.json';
        // // "../assets/vega-datasets/cars.json";

        // this.globalVariableService.get('').then(i =>
        //     {

        //         // Get fields
        //         this.globalVariableService.currentDatasources.forEach(ds => {
        //             if (ds.id == this.selectDatasetID) {
        //                 // TODO - remove this, currently datalib reads array as string a,b,c
        //                 let x: string = ds.dataFields.toString();
        //                 this.dataFieldNames = x.split(',');
        //             }
        //         });
        //         this.dataset = i;
        //         this.currentDatasetLength = i.length;
        //     }
        // );
        // console.log('xx23', this.selectWidgetIndex, this.selectDatasetID, this.globalVariableService.filePath)
        this.globalVariableService.getCurrentDataset(
            this.selectDatasourceID, this.selectDatasetID).then (ca => {
            this.datagridInput.datagridData = ca.data;
            if (ca.data.length > 0) {
                const columns = Object.keys(ca.data[0]);
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
        });
    }

  	clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetExpandClosed.emit(action);
    }

}
