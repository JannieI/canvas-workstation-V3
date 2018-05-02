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
import { Datasource }                from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'collaborate-taskadd',
    templateUrl: './collaborate.taskadd.component.html',
    styleUrls: ['./collaborate.taskadd.component.css']
})
export class CollaborateTaskAddComponent implements OnInit {

    @Output() formCollaborateTaskAddClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

  	clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formCollaborateTaskAddClosed.emit(action);
    }

    clickSave(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.formCollaborateTaskAddClosed.emit(action);
    }


}