// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our models
import { Datasource }                 from './models';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions

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
    records: number = 8;
    datasources: Datasource[] = [];
    // TODO - remove hardcoding
    dataFieldNames: string[] = ['symbol',
        'Acceleration', 'Cylinders', 'Displacement', 'Horsepower', 'Miles_per_Gallon', 'Name', 'Origin', 'Weight_in_lbs', 'Year'
    ];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.filePath = './assets/data.dataset' + 
            this.selectDatasetID.toString() + '.json';
        // "../assets/vega-datasets/cars.json";

        this.globalVariableService.get('').then(i =>
            {
                this.dataset = i;
                this.currentDatasetLength = i.length;
                console.log('xx2', i)
            }
            // this.globalVariableService.currentWidgets  this.widgetIndex)
            // i =>
            //     {
            //         if (i.datasourceID == 3) {
            //             this.currentDataset = i.data;
            //             this.currentDatasetLength = this.currentDataset.length
            //             this.dataFieldNames = Object.getOwnPropertyNames(i.data[0])
            //         }
            //     }
        );
        console.log('xx2', this.selectWidgetIndex, this.selectDatasetID, this.globalVariableService.filePath)
    }

  	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetExpandClosed.emit(action);
    }

}
