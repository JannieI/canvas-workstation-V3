/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

@Component({
    selector: 'shape-edit',
    templateUrl: './shape.edit.component.html',
    styleUrls: ['./shape.edit.component.css']
})
export class ShapeEditComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formShapeEditClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  

    ngOnInit() {

    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formShapeEditClosed.emit(action);
    }
}
