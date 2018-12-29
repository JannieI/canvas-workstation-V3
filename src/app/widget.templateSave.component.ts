/*
 * Save the selected Widget as a Widget Template, for later use
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Input }                      from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Widget }                     from './models';
import { WidgetStoredTemplate }             from './models';


@Component({
    selector: 'widget-templateSave',
    templateUrl: './widget.templateSave.component.html',
    styleUrls: ['./widget.templateSave.component.css']
})
export class WidgetTemplateSaveComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetTemplateSavedClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
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

    errorMessage: string = '';
    isEditing: boolean = false;
    widgetStoredTemplates: WidgetStoredTemplate[] = [];
    widgetStoreTemplateDescription: string = '';
    widgetStoreTemplateName: string = '';


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initials
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getWidgetStoredTemplates()
            .then(res => {
                this.widgetStoredTemplates = res.filter(wst => 
                    wst.widgetID == this.selectedWidget.id
                );
                 
                if (this.widgetStoredTemplates.length > 0) {
                    this.isEditing = true;
                    this.widgetStoreTemplateName = this.widgetStoredTemplates[0].name;
                    this.widgetStoreTemplateDescription = 
                        this.widgetStoredTemplates[0].description;
                    this.errorMessage = 'This template was saved before';
                };
            }
        );
    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetTemplateSavedClosed.emit(action);
    }

    clickSave() {
        // Save the D (replace the original as Completed and delete the Draft)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        this.errorMessage = '';
        if (this.widgetStoreTemplateName == '') {
            this.errorMessage = 'The name is compulsory.'
            return;
        };
        if (this.widgetStoreTemplateDescription == '') {
            this.errorMessage = 'The description is compulsory.'
            return;
        };

        // Create new W template
        if (!this.isEditing) {

            let dt = new Date();

            let newWidgetStoredTemplate: WidgetStoredTemplate = {
                id: null,
                widgetID: this.selectedWidget.id,
                name: this.widgetStoreTemplateName,
                description: this.widgetStoreTemplateDescription,
                datasourceName: '',
                createdOn: dt,
                createdBy: this.globalVariableService.currentUser.userID,
                updatedOn: null,
                updatedBy: '',
            };

            this.globalVariableService.addWidgetStoredTemplate(newWidgetStoredTemplate)
                .then(res => {this.formWidgetTemplateSavedClosed.emit('Saved')})
                .catch(err => {this.errorMessage = 'Adding failed ...'});
        } else {
            let dt = new Date();

            let newWidgetStoredTemplate: WidgetStoredTemplate = {
                id: this.widgetStoredTemplates[0].id,
                widgetID: this.widgetStoredTemplates[0].widgetID,
                name: this.widgetStoreTemplateName,
                description: this.widgetStoreTemplateDescription,
                datasourceName: this.widgetStoredTemplates[0].datasourceName,
                createdOn: this.widgetStoredTemplates[0].createdOn,
                createdBy: this.widgetStoredTemplates[0].createdBy,
                updatedOn: dt,
                updatedBy: this.globalVariableService.currentUser.userID,
            };

            this.globalVariableService.saveWidgetStoredTemplate(newWidgetStoredTemplate)
                .then(res => {this.formWidgetTemplateSavedClosed.emit('Saved')})
                .catch(err => {this.errorMessage = 'Saving failed ...'});

        };

    }
}
