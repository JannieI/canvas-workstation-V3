/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Models
import { Widget }                     from './models';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'widget-container',
    templateUrl: './widget.container.component.html',
    styleUrls: ['./widget.container.component.css']
})
export class WidgetContainerComponent implements OnInit {

    @Output() formWidgetContainerClosed: EventEmitter<Widget> = new EventEmitter();
    @Input() selectedWidget: Widget;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }

    localWidget: Widget;                            // W to modify, copied from selected


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Deep copy
        this.localWidget = Object.assign({}, this.selectedWidget);

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        console.log('clickClose')

		this.formWidgetContainerClosed.emit(null);
    }

    clickSave() {
        // Close form and save all
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Replace the W
        this.globalVariableService.widgetReplace(this.localWidget);
        
        // Tell user
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Container updated',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );

	  	this.formWidgetContainerClosed.emit(this.localWidget);
    }





}
