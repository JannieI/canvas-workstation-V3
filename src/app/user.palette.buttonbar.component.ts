/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DashboardTag }               from './models';
import { ButtonBarAvailable}          from './models'
import { ButtonBarSelected }          from './models';
import { WidgetCheckpointsComponent } from 'app/widget.checkpoints.component';

const paletteButtons = [
    {
        id: 1,
        mainmenuItem: "Edit",
        menuText: "Undo",
        shape: "pencil",
        size: "20",
        class: "buttonBarIcon",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditUndo",
        params: "",
        tooltipContent: "Undo a previous action"
    },
    {
        id: 2,
        mainmenuItem: "Dashboard",
        menuText: "Edit All",
        shape: "times",
        size: "20",
        class: "buttonBarIcon",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
]

@Component({
    selector: 'palette-buttonbar',
    templateUrl: './user.palette.buttonbar.component.html',
    styleUrls: ['./user.palette.buttonbar.component.css']
})
export class UserPaletteButtonBarComponent implements OnInit {

    @Output() formUserWidgetButtonBarClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    dashboardTags: DashboardTag[];
    paletteButtons = paletteButtons;
    widgetButtonsAvailable: ButtonBarAvailable[];
    widgetButtonsSelected: ButtonBarSelected[];
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
        this.widgetButtonsAvailable = this. globalVariableService.widgetButtonsAvailable;
        this.widgetButtonsSelected = this. globalVariableService.widgetButtonsSelected;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formUserWidgetButtonBarClosed.emit(action);
    }

    clickAdd() {
        let x: ButtonBarSelected = {
            id: 12,
            buttonText: 'new one Added',
            description: '',
            sortOrder: 12
        }
        this.widgetButtonsSelected.push(x)
    }

    clickDelete() {
        this.widgetButtonsSelected.splice(this.widgetButtonsSelected.length-1,1)
    }

    clickItem(index: number) {
        console.log(index, this.widgetButtonsAvailable[index])
    }
}
