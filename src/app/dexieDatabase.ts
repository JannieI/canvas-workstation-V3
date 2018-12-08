// This class defines the tables and DB structure for Dexie DBs

import { Dashboard }                  from './models';
import { DashboardLayout }            from './models';
import { DashboardPermission }        from './models';
import { DashboardRecent}             from './models';
import { DashboardSnapshot }          from './models';
import { DashboardSchedule }          from './models';
import { DashboardScheduleLog }       from './models';
import { DashboardSubscription }      from './models';
import { DashboardTab }               from './models';
import { DashboardTag }               from './models';
import { DashboardTheme }             from './models';
import { DataCachingTable }           from './models';
import { DataConnection }             from './models';
import { DatasourceTransformation }   from './models';
import { DatasourceSchedule }         from './models';
import { DatasourceScheduleLog }      from './models';
import { DataField }                  from './models';
import { DatagridColumn }             from './models';
import { Dataset }                    from './models';
import { DataTable }                  from './models';
import { Datasource }                 from './models';
import { DataQualityIssue}            from './models';
import { DataOwnership}               from './models';
import { DatasourcePermission}        from './models';
import { GraphCalculation }        from './models';
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';
import { StatusBarMessage }           from './models';
import { StatusBarMessageLog }        from './models';
import { Transformation }             from './models';
import { TributaryServerType }        from './models';
import { TributarySource }            from './models';
import { WebSocketMessage }           from './models';
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';
import { WidgetLayout }               from './models';
import { WidgetGraph }                from './models';
import { WidgetStoredTemplate }       from './models';

// Dexie
import Dexie from 'dexie';

// Dexie Interface: Contact
export interface IContact {
    id?: number,
    first: string,
    last: string,
    dashboard: Dashboard
}

// Dexie Table: Contact
export class Contact implements IContact {
    id: number;
    first: string;
    last: string;
    dashboard: Dashboard;

    constructor(first: string, last: string, dashboard: Dashboard, id?:number) {
      this.first = first;
      this.last = last;
      this.dashboard = dashboard;
      if (id) this.id = id;
    }
}

// Dexie Interface: Local Dashboards
export interface ILocalDashboard {
    id: number,
    dashboard: Dashboard
}

// Dexie Table: Local Dashboards
export class LocalDashboard implements ILocalDashboard {
    id: number;
    dashboard: Dashboard;

    constructor(id:number, dashboard: Dashboard) {
        this.id = id;
        this.dashboard = dashboard;
    }
}

// Dexie Interface: Canvas User
export interface ICurrentCanvasUser {
    id: number,
    canvasServerName: string,
    canvasServerURI: string,
    currentCompany: string,
    currentUserName: string,
    currentToken: string
}

// Dexie Table: Canvas User
export class CurrentCanvasUser implements ICurrentCanvasUser {
    id: number;
    canvasServerName: string;
    canvasServerURI: string;
    currentCompany: string;
    currentUserName: string;
    currentToken: string;

    constructor(id: number,
        canvasServerName: string,
        canvasServerURI: string,
        currentCompany: string,
        currentUserName: string,
        currentToken: string
    ) {
        this.id = id;
        this.canvasServerName = canvasServerName;
        this.canvasServerURI = canvasServerURI;
        this.currentCompany = currentCompany;
        this.currentUserName = currentUserName;
        this.currentToken = currentToken;
    }
}

// Dexie DB: Canvas App DB
export class CanvasAppDatabase extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    contacts: Dexie.Table<IContact, number>; // number = type of the primkey
    localDashboards: Dexie.Table<ILocalDashboard, number>;
    currentCanvasUser: Dexie.Table<ICurrentCanvasUser, number>;
    //...other tables goes ABOVE here...

    constructor () {
        super("CanvasAppDatabase");
        this.version(1).stores({
            contacts: 'id, first, last',
            localDashboards: 'id',
            currentCanvasUser: 'id, canvasServerName, currentCompany, currentUserName'
            //...other tables goes here...
        });
    }
}

// Local App info DB
export const dbCanvasAppDatabase = new Dexie("CanvasAppDatabase").version(1).stores(
    {
        contacts: 'id, first, last',
        localDashboards: 'id',
        currentCanvasUser: 'id, canvasServerName, currentCompany, currentUserName'
    }
);
// this.dbCanvasAppDatabase.open();

    // // Local App info DB
    // this.dbCanvasAppDatabase = new Dexie("CanvasAppDatabase");
    // this.dbCanvasAppDatabase.version(1).stores(
    //     {
    //         contacts: 'id, first, last',
    //         localDashboards: 'id',
    //         currentCanvasUser: 'id, canvasServerName, currentCompany, currentUserName'
    //     }
    // );
    // this.dbCanvasAppDatabase.open();

    // // Local CachingTable DB
    // this.dbDataCachingTableDatabase = new Dexie("DataCachingTable");
    // this.dbDataCachingTableDatabase.version(1).stores(
    //     {
    //         localDataCachingTable: 'key, localCacheable, localExpiryDateTime',
    //     }
    // );
    // this.dbDataCachingTableDatabase.open();

    // console.warn('xx local DBs created');
