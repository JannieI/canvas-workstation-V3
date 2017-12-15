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

    showLine: boolean = false;  
    showCircle: boolean = false;  
    showText: boolean = true;  
    showImage: boolean = false;  
    showTypeDashboard: boolean = false;  
    showRectangle: boolean = false;  
    showArrow: boolean = false;  

    ngOnInit() {

    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formShapeEditClosed.emit(action);
    }

    clickSelectShape(ev) {
        console.log(ev, ev.srcElement.value)
        let shape: string = ev.srcElement.value;

        if (shape == 'TextBox') {
            this.showLine = false;
            this.showCircle = false;
            this.showText = true;
            this.showImage = false;
            this.showRectangle = false;
            this.showArrow = false;
        }
        if (shape == 'Circle') {
            this.showLine = false;
            this.showCircle = true;
            this.showText = false;
            this.showImage = false;
            this.showRectangle = false;
            this.showArrow = false;
        }
        if (shape == 'Rectangle') {
            this.showLine = false;
            this.showCircle = false;
            this.showText = false;
            this.showImage = false;
            this.showRectangle = true;
            this.showArrow = false;
        }
        if (shape == 'Line') {
            this.showLine = true;
            this.showCircle = false;
            this.showText = false;
            this.showImage = false;
            this.showRectangle = false;
            this.showArrow = false;
        }
        if (shape == 'Arrow') {
            this.showLine = false;
            this.showCircle = false;
            this.showText = false;
            this.showImage = false;
            this.showRectangle = false;
            this.showArrow = true;
        }
        if (shape == 'Image') {
            this.showLine = false;
            this.showCircle = false;
            this.showText = false;
            this.showImage = false;
            this.showRectangle = false;
            this.showArrow = false;
        }

    }
}
