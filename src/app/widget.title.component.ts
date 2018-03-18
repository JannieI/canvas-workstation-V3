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
import { Widget }                     from './models'

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions


@Component({
    selector: 'widget-title',
    templateUrl: './widget.title.component.html',
    styleUrls: ['./widget.title.component.css']
})
export class WidgetTitleComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetTitleClosed: EventEmitter<Widget> = new EventEmitter();

    localWidget: Widget;                            // W to modify, copied from selected

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.localWidget = Object.assign({}, this.selectedWidget);
    }

  	clickClose() {
        // Close the form, no action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

  	  	this.formWidgetTitleClosed.emit(null);
    }

    clickSave() {
        // Save and close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Tell user
        this.globalVariableService.statusBarMessage.next(
            {
                message: 'Slicer Saved',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );

        this.formWidgetTitleClosed.emit(this.localWidget);
    }
  }