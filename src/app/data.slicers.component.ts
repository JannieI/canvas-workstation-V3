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

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'data-slicers',
    templateUrl: './data.slicers.component.html',
    styleUrls: ['./data.slicers.component.css']
  })
  export class DataSlicersComponent implements OnInit {

    @Output() formDataSlicersClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    currentDatasources: Datasource[] = [];
    dataFields: string[] = [];
    selectedDatasourceID: number = -1;
    dataValues: string[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.currentDatasources = this.globalVariableService.currentDatasources;
        this.dataFields = [];
        this.dataValues = [];
      }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

      }

    clickDatasource(id: number, index: number){
        // Clicked a DS, now load the Fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // Remember selected on 
        this.selectedDatasourceID = id;

        // Get fields in this DS
        this.dataFields = this.currentDatasources[index].dataFields;
        
    }

    clickDataFields(id: number, index: number){
        // Clicked a Field, now load the Values
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataFields', '@Start');

        // Get ID of latest dSet for the selected DS
        let newdSetID: number = 1;
        let dSetIDs: number[] = [];
        this.globalVariableService.currentDatasets.forEach(ds => {
            if (ds.datasourceID == this.selectedDatasourceID) {
                dSetIDs.push(ds.id);
            }; 
        });
        newdSetID = Math.max(...dSetIDs);

        // More into array
        this.dataValues = [];
        let tempData: any = this.globalVariableService.currentDatasets.filter(ds => 
            ds.id == newdSetID)[0].dataRaw //['Origin'];
        
        tempData.forEach(t => {
            if (this.dataValues.indexOf(t['Origin']) < 0) {
                this.dataValues.push(t['Origin']);
            };
        });
        console.log('xx ds', this.dataValues)
        
    }

    clickDataValue(id: number, index: number){
        // Clicked a Value, now ....
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDataValue', '@Start');

    }

  	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	this.formDataSlicersClosed.emit(action);
        }

    clickSave() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

	  	this.formDataSlicersClosed.emit('Saved');
    }
  }
