/*
 * Help page, including Recently opened Dashboards
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource } 				  from './models';
import { Dashboard } 				  from './models';
import { DashboardRecent } 			  from './models';
import { DashboardTab } 			  from './models';

// Functions
import { nSQL } from "nano-sql";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	@Output() formLandingClosed: EventEmitter<string> = new EventEmitter();

	// sampleDashboards: Dashboard[] = this.globalVariableService.dashboardsSamples;
	recentDashboards: DashboardRecent[];
	sampleDashboards: Dashboard[];
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
		private router: Router
	) {


		// Example 0
		nSQL('widgets') //  "users" is our table name.
        .model([ // Declare data model
            {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
            {key:'name',type:'string'},
            {key:'age', type:'int'}
		])
		nSQL('users') //  "users" is our table name.
        .model([ // Declare data model
            // {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
            // {key:'name',type:'string'},
            // {key:'age', type:'int'}
		// ])

			{key:'widgetType', type: 'string'},
			{key:'widgetSubType', type: 'string'},
			{key:'isTrashed', type: 'bool'},
			{key:'dashboardID', type: 'int'},
			{key:'dashboardTabID', type: 'int'},
			{key:'id', type: 'int',props:['pk','ai']},
			{key:'name', type: 'string'},
			{key:'description', type: 'string'},
			{key:'visualGrammar', type: 'string'},
			{key:'version', type: 'int'},
			{key:'isLiked', type: 'bool'},
			{key:'isSelected', type: 'bool'},
			{key:'nrDataQualityIssues', type: 'int'},
			{key:'nrComments', type: 'int'},
			{key:'nrButtonsToShow', type: 'int'},
			{key:'hyperlinkDashboardID', type: 'int'},
			{key:'hyperlinkDashboardTabID', type: 'int'},
			{key:'datasourceID', type: 'int'},
			{key:'slicerFieldName', type: 'string'},
			{key:'slicerSelection', type: 'array'},
			{key:'datasetID', type: 'int'},
			{key:'dataParameters', type:'array'},
			{key:'reportID', type: 'int'},
			{key:'reportName', type: 'string'},
			{key:'rowLimit', type: 'int'},
			{key:'addRestRow', type: 'bool'},
			{key:'size', type: 'string'},
			{key:'containerBackgroundcolor', type: 'string'},
			{key:'containerBorder', type: 'string'},
			{key:'containerBoxshadow', type: 'string'},
			{key:'containerColor', type: 'string'},
			{key:'containerFontsize', type: 'int'},
			{key:'containerHeight', type: 'int'},
			{key:'containerLeft', type: 'int'},
			{key:'containerWidgetTitle', type: 'string'},
			{key:'containerTop', type: 'int'},
			{key:'containerWidth', type: 'int'},
			{key:'containerZindex', type: 'int'},
			{key:'titleText', type: 'string'},
			{key:'titleBackgroundColor', type: 'string'},
			{key:'titleBorder', type: 'string'},
			{key:'titleColor', type: 'string'},
			{key:'titleFontsize', type: 'int'},
			{key:'titleFontWeight', type: 'string'},
			{key:'titleHeight', type: 'int'},
			{key:'titleLeft', type: 'int'},
			{key:'titleMargin', type: 'string'},
			{key:'titlePadding', type: 'string'},
			{key:'titlePosition', type: 'string'},
			{key:'titleTextAlign', type: 'string'},
			{key:'titleTop', type: 'int'},
			{key:'titleWidth', type: 'int'},
			{key:'graphType', type: 'string'},
			{key:'graphHeight', type: 'int'},
			{key:'graphLeft', type: 'int'},
			{key:'graphTop', type: 'int'},
			{key:'graphWidth', type: 'int'},
			{key:'graphGraphPadding', type: 'int'},
			{key:'graphHasSignals', type: 'bool'},
			{key:'graphFillColor', type: 'string'},
			{key:'graphHoverColor', type: 'string'},
			{key:'graphSpecification', type: 'any'},
			{key:'graphDescription', type: 'string'},
			{key:'graphXaggregate', type: 'string'},
			{key:'graphXtimeUnit', type: 'string'},
			{key:'graphXfield', type: 'string'},
			{key:'graphXtype', type: 'string'},
			{key:'graphXaxisTitle', type: 'string'},
			{key:'graphYaggregate', type: 'string'},
			{key:'graphYtimeUnit', type: 'string'},
			{key:'graphYfield', type: 'string'},
			{key:'graphYtype', type: 'string'},
			{key:'graphYaxisTitle', type: 'string'},
			{key:'graphTitle', type: 'string'},
			{key:'graphMark', type: 'string'},
			{key:'graphMarkColor', type: 'string'},
			{key:'graphUrl', type: 'string'},
			{key:'graphData', type: 'any'},
			{key:'graphColorField', type: 'string'},
			{key:'graphColorType', type: 'string'},
			{key:'tableColor', type: 'string'},
			{key:'tableCols', type: 'int'},
			{key:'tableHeight', type: 'int'},
			{key:'tableHideHeader', type: 'bool'},
			{key:'tableLeft', type: 'int'},
			{key:'tableRows', type: 'int'},
			{key:'tableTop', type: 'int'},
			{key:'tableWidth', type: 'int'},
			{key:'shapeCx', type: 'string'},
			{key:'shapeCy', type: 'string'},
			{key:'shapeR', type: 'string'},
			{key:'shapeStroke', type: 'string'},
			{key:'shapeStrokeWidth', type: 'string'},
			{key:'shapeFill', type: 'string'},
			{key:'refreshMode', type: 'string'},
			{key:'refreshFrequency', type: 'int'},
			{key:'widgetRefreshedOn', type: 'string'},
			{key:'widgetRefreshedBy', type: 'string'},
			{key:'widgetCreatedOn', type: 'string'},
			{key:'widgetCreatedBy', type: 'string'},
			{key:'widgetUpdatedOn', type: 'string'},
			{key:'widgetUpdatedBy', type: 'string'}
		])
		


		nSQL().connect()
		.then( dbinfo => console.log('xx2', dbinfo))

		// Example 1
        // nSQL('widgets') //  "users" is our table name.
        // .model([ // Declare data model
        //     {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
        //     {key:'name',type:'string'},
        //     {key:'age', type:'int'}
        // ])
        // .connect() // Init the data store for usage. (only need to do this once)
        // .then(function(result) {
        //     return nSQL().query('upsert',{ // Add a record
        //         id: null, name:"boy", age: 54
        //     }).exec();
        // })
        // .then(function(result) {
        //     return nSQL().query('select').exec(); // select all rows from the current active table
        // })
        // .then(function(result) {
        //     console.log('xx2 W', result) // <= arrayid:1, name:"bill", age: 20}]
        // })

		// Example 2
		// nSQL('users')// Table/Store Name, required to declare model and attach it to this store.
		// .model([ // Data Model, required
        //     {key:'id',type:'int',props:['pk', 'ai']}, // pk == primary key, ai == auto incriment
        //     {key:'name',type:'string'},
        //     {key:'age', type:'int'}
		// ])
		// .config({
		// 	mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
		// 	history: true // allow the database to undo/redo changes on the fly. 
		// }) 
		// .actions([ // Optional
		// 	{
		// 		name:'add_new_user',
		// 		args:['user:map'],
		// 		call:function(args, db) {
		// 			return db.query('upsert',args.user).exec();
		// 		}
		// 	}
		// ])
		// .views([ // Optional
		// 	{
		// 		name: 'get_user_by_name',
		// 		args: ['name:string'],
		// 		call: function(args, db) {
		// 			return db.query('select').where(['name','=',args.name]).exec();
		// 		}
		// 	},
		// 	{
		// 		name: 'list_all_users',
		// 		args: ['page:int'],
		// 		call: function(args, db) {
		// 			return db.query('select',['id','name']).exec();
		// 		}
		// 	}                       
		// ])
		// .connect()
			// .then( conn =>
			// 	nSQL().doAction('add_new_user', { user: { id: null, name:"bill", age: 20 } } )
			// 	.then(first =>
			// 		nSQL().doAction('add_new_user', { user: { id: 4, name:"bambie", age: 21 } } )
			// 		// nSQL().query('upsert',{ // Add a record
			// 		// 	name:"bill", age: 20
			// 		// }).exec()
			// 			.then(second => {
			// 				console.log('xx21', conn, first, second) //  <- "1 Row(s) upserted"
			// 				return nSQL().getView('list_all_users');
			// 			}).then(result => {
			// 				console.log('xx22', result) //  <- single object array containing the row we inserted.
			// 			})
			// 		)
			// )
		

		// Load Startup info:

		// All Datasources
		this.globalVariableService.getDatasources();

		// Load D
		this.globalVariableService.getDashboards().then(i => {
			// Sample Dashboards
			this.globalVariableService.getDashboardSamples().then(j => {
				this.sampleDashboards = j;

				// Recent D
				this.globalVariableService.getDashboardsRecent(this.globalVariableService.currentUser.userID).then(k => {
					for (var x = 0; x < k.length; x++) {
						k[x].stateAtRunTime = 'Deleted';
						for (var y = 0; y < this.globalVariableService.dashboards.length; y++) {
							if (this.globalVariableService.dashboards[y].id ==
							k[x].dashboardID) {
								k[x].stateAtRunTime = this.globalVariableService.dashboards[y].state;
								k[x].nameAtRunTime = this.globalVariableService.dashboards[y].name;
							}
						}
					}
					this.recentDashboards = k;
				})
			})
		})
	}

	ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
	}

	ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
	}

	clickOpenSampleDashboard(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenSampleDashboard', '@Start');

		this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, -1, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenSample');
	}

	clickOpenRecentDashboard(dashboardID: number, dashboardTabID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenRecentDashboard', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, dashboardTabID, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenRecent');
	}

	deleteRecent(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteRecent', '@Start');

		// Delete from temp array, refresh
		this.globalVariableService.deleteDashboardRecent(index).then(
			i => {
				// this.recentDashboards = this.globalVariableService.getDashboardsRecentlyUsed(
			// 	this.globalVariableService.userID
			// );
		})
	}

	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formLandingClosed.emit(action);
	}

	clickOpenExisting() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenExisting', '@Start');

		this.globalVariableService.openDashboardFormOnStartup = true;

		this.formLandingClosed.emit('OpenExisting');
	}

	clickOpenNewDashboard() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenNewDashboard', '@Start');

		this.globalVariableService.openNewDashboardFormOnStartup = true;

		this.formLandingClosed.emit('New');
	}

}
