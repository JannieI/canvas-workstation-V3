// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Widget }                     from './models';


@Component({
    selector: 'widget-export',
    templateUrl: './widget.export.component.html',
    styleUrls: ['./widget.export.component.css']
})
export class WidgetExportComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetExportClosed: EventEmitter<string> = new EventEmitter();

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
            this.clickExport();
            return;
        };

    }

    errorMessage: string = 'asdfasdfasdfasdfasdf';
    fileName: string = '';


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private router: Router,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

  	clickClose(action: string) {
        // Close the form, no action taken
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

  	  	this.formWidgetExportClosed.emit(action);
    }

    clickExport() {
        // Export the image, and close the file
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport', '@Start');

        // Reset
        this.errorMessage = '';

        // Validate
        if (this.selectedWidget == null) {
            this.errorMessage = "The Widget selected is empty.  Close and try again.";
            return;
        };
        if (this.fileName == null  ||  this.fileName == '') {
            this.errorMessage = "The file name is compulsory";
            return;
        };
        
        // Export
        // let newW: Widget = Object.assign({}, this.selectedWidget);
        let newW: Widget = JSON.parse(JSON.stringify(this.selectedWidget));
        newW.data = [];
        newW.graphData = [];
        var obj = JSON.stringify(newW);  
        this.saveText(JSON.stringify(obj), this.fileName);

  	  	this.formWidgetExportClosed.emit('Exported');

    }

    saveText(text, filename){
        // Actual Export of selected DS to a file by creating <a> tag
        this.globalFunctionService.printToConsole(this.constructor.name,'saveText',           '@Start');

        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

}
