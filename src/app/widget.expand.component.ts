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
import { nSQL } from "nano-sql";

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
    dataFieldNames: string[] = [];

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

                // Get fields
                this.globalVariableService.currentDatasources.forEach(ds => {
                    if (ds.id = this.selectDatasetID) {
                        // TODO - remove this, currently datalib reads array as string a,b,c
                        let x: string = ds.dataFields.toString();
                        this.dataFieldNames = x.split(',');
                    }
                });
                this.dataset = i;
                this.currentDatasetLength = i.length;
            }
        );
        console.log('xx23', this.selectWidgetIndex, this.selectDatasetID, this.globalVariableService.filePath)
    }

  	clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        

        nSQL('users') //  "users" is our table name.
        .model([ // Declare data model
            {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
            {key:'name',type:'string'},
            {key:'age', type:'int'}
        ])
        .connect() // Init the data store for usage. (only need to do this once)
        .then(function(result) {
            return nSQL().query('upsert',{ // Add a record
                name:"bill", age: 20
            }).exec();
        })
        .then(function(result) {
            return nSQL().query('select').exec(); // select all rows from the current active table
        })
        .then(function(result) {
            console.log('xx', result) // <= [{id:1, name:"bill", age: 20}]
        })


        this.formWidgetExpandClosed.emit(action);
    }

}
