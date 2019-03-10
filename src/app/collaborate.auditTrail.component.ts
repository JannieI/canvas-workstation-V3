/*
 * Shows form with auditTrail records
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasAuditTrail }           from './models';

@Component({
    selector: 'collaborate-audittrail',
    templateUrl: './collaborate.auditTrail.component.html',
    styleUrls: ['./collaborate.auditTrail.component.css']
})
export class CollaborateAuditTrailComponent implements OnInit {

    @Output() formCollaborateAuditTrailClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('widgetDOM') widgetDOM: ElementRef;

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

    canvasAuditTrail: CanvasAuditTrail[];
    errorMessage: string = '';
    selectedRow: number = 0;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('canvasAuditTrails')
            .then (cau => this.canvasAuditTrail = cau)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Collaborate.auditTrail reading auditTrails: ' + err);
            });
    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
    }

    clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateAuditTrailClosed.emit(action);
    }
}
