// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our models

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

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    currentDatasetLength: number;
    datagridColumns: string[];
    datagridData: any[];
    datagridPaginationSize: number = 10;
    errorMessage: string = '';
    records: number = 6;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // let tempData: any[] = this.globalVariableService.currentDatasets.filter(ds =>
        //     ds.id == this.selectDatasetID)[0].dataRaw //['Origin'];

        this.globalVariableService.currentDatasets.forEach(ds => {
            if (ds.id == this.selectDatasetID) {
                this.datagridData = ds.dataRaw;
            };
        })
        this.globalVariableService.currentDatasources.forEach(ds => {
            if (ds.id == this.selectDatasourceID) {
                // TODO - remove this, currently datalib reads array as string a,b,c
                let x: string = ds.dataFields.toString();
                this.datagridColumns = ds.dataFields;
            }
        });

        // Get length
        this.currentDatasetLength = this.datagridData.length;

    }

  	clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetExpandClosed.emit(action);
    }

}
