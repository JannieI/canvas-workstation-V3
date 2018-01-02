// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our models
import { Datasource }                 from './models';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions

@Component({
    templateUrl: './widget.expand.component.html',
    styleUrls: ['./widget.expand.component.css']
})
export class WidgetExpandComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    currentDataset;
    // @Output() formWidgetExpandClosed: EventEmitter<string> = new EventEmitter();
    // currentData = this.globalVariableService.currentDataset.forEach(
    //     i => {
    //             if (i.datasourceID == 1) { return i.data }
    //          }
    // );

    datasources: Datasource[] = [];

    dataFieldNames: string[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private router: Router,
    ) {}

    ngOnInit() {
        this.globalVariableService.datasources.subscribe(
            i => this.datasources = i
        );
        this.globalVariableService.datasets.forEach(
            i => {
                    if (i.datasourceID == 2) { 
                        this.currentDataset = i.data;
                        this.dataFieldNames = Object.getOwnPropertyNames(i.data[0])
                    }
                }
        );
            console.log('currentData', this.currentDataset)
    }

  	clickClose(action: string) {
        // this.formWidgetExpandClosed.emit(action);
        this.router.navigate(['explore'])
    }

}
