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
import { DatasourcePermission }       from './models';

@Component({
    selector: 'data-share',
    templateUrl: './data.share.component.html',
    styleUrls: ['./data.share.component.css']
})
export class DatasourceShareComponent implements OnInit {

    @Output() formDataShareClosed: EventEmitter<string> = new EventEmitter();

    showTypeDatasource: boolean = false;
    datasourcePermissions: DatasourcePermission[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.datasourcePermissions = this.globalVariableService.datasourcePermissions;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDataShareClosed.emit(action);
    }
}
