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

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { dashboard }                  from './models';
import { dashboardTag }               from './models';
import { buttonBarAvailable}          from './models'
import { buttonBarSelected }          from './models';

@Component({
    selector: 'shape-buttonbar',
    templateUrl: './user.shape.buttonbar.component.html',
    styleUrls: ['./user.shape.buttonbar.component.css']
})
export class UserShapeButtonBarComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formUserShapeButtonBarClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  
    dashboards: Partial<dashboard>[];
    dashboardTags: dashboardTag[];
    shapeButtonsAvailable: buttonBarAvailable[];
    shapeButtonsSelected: buttonBarSelected[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
        this.shapeButtonsAvailable = this. globalVariableService.shapeButtonsAvailable;
        this.shapeButtonsSelected = this. globalVariableService.shapeButtonsSelected;
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formUserShapeButtonBarClosed.emit(action);
    }

    clickAdd() {
        let x: buttonBarSelected = {
            id: 12,
            buttonText: 'new one Added',
            description: '',
            sortOrder: 12
        }
        this.shapeButtonsSelected.push(x)
    }

    clickDelete() {
        this.shapeButtonsSelected.splice(this.shapeButtonsSelected.length-1,1)
    }

    clickItem(index: number) {
        console.log(index, this.shapeButtonsAvailable[index])
    }

}
