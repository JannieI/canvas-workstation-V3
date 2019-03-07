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

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Widget }                     from './models';

@Component({
    selector: 'widget-annotations',
    templateUrl: './widget.annotations.component.html',
    styleUrls: ['./widget.annotations.component.css']
})
export class WidgetAnnotationsComponent implements OnInit {

    @Output() formWidgetAnnotationsClosed: EventEmitter<string> = new EventEmitter();
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
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSave();
            return;
        };

    }

    annotation: string;
    errorMessage = '';

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set startup info
        this.annotation = this.selectedWidget.annotation;
    }

    clickClose() {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetAnnotationsClosed.emit();
    }

    clickSave() {
        // Save changes to the last Comment
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        let today = new Date();
        this.selectedWidget.annotation = this.annotation;
        this.selectedWidget.annotationLastUserID = this.globalVariableService.currentUser.userID;
        this.selectedWidget.annotationLastUpdated = today;
        this.globalVariableService.saveWidget(this.selectedWidget)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.annotation saveWidget: ' + err);
            });

		this.formWidgetAnnotationsClosed.emit();

    }

}