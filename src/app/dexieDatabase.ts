// This class defines the tables and DB structure for Dexie DBs

import { Dashboard }                  from './models';
import { Datasource }                 from './models';

// Dexie
import Dexie from 'dexie';


// CanvasAppDatabase Database Definition STARTS ********************************************


// 1. Interfaces ***************************************************************************

    // Dexie Interface: Canvas User
    export interface ICurrentCanvasUser {
        canvasServerName: string,
        canvasServerURI: string,
        currentCompany: string,
        currentUserID: string,
        currentToken: string
    }

    // Dexie Interface: Contact
    export interface IContact {
        id?: number,
        first: string,
        last: string,
        dashboard: Dashboard
    }

    // Dexie Interface: Local Dashboards
    export interface ILocalDashboard {
        id: number,
        dashboard: Dashboard
    }

    // Dexie Interface: Local Datasources
    export interface ILocalDatasource {
        id: number,
        datasource: Datasource
    }


// 2. Tables / Classes *********************************************************************

    // Dexie Table: Canvas User-related information
    export class CurrentCanvasUser implements ICurrentCanvasUser {
        canvasServerName: string;
        canvasServerURI: string;
        currentCompany: string;
        currentUserID: string;
        currentToken: string;

        constructor(
            canvasServerName: string,
            canvasServerURI: string,
            currentCompany: string,
            currentUserID: string,
            currentToken: string
        ) {
            this.canvasServerName = canvasServerName;
            this.canvasServerURI = canvasServerURI;
            this.currentCompany = currentCompany;
            this.currentUserID = currentUserID;
            this.currentToken = currentToken;
        }
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

    // Dexie Table: Local Dashboards
    export class LocalDashboard implements ILocalDashboard {
        id: number;
        dashboard: Dashboard;

        constructor(id:number, dashboard: Dashboard) {
            this.id = id;
            this.dashboard = dashboard;
        }
    }

    // Dexie Table: Local Datasources
    export class LocalDatasource implements ILocalDatasource {
        id: number;
        datasource: Datasource;

        constructor(id:number, datasource: Datasource) {
            this.id = id;
            this.datasource = datasource;
        }
    }


// 3. Database Definition ******************************************************************

    // Dexie DB: Canvas App DB
    export class CanvasAppDatabase extends Dexie {
        // Declare implicit table properties.
        // (just to inform Typescript. Instanciated by Dexie in stores() method)
        contacts: Dexie.Table<IContact, number>; // number = type of the primkey
        localDashboards: Dexie.Table<ILocalDashboard, number>;
        localDatasources: Dexie.Table<ILocalDatasource, number>;
        currentCanvasUser: Dexie.Table<ICurrentCanvasUser, number>;
        //...other tables goes ABOVE here...

        constructor () {
            super("CanvasAppDatabase");
            this.version(1).stores({
                currentCanvasUser: 'canvasServerName, currentCompany, currentUserID',
                contacts: 'id, first, last',
                localDashboards: 'id',
                localDatasources: 'id'
                //...other tables goes here...
            });
        }
    }

// CanvasAppDatabase Database ENDS *********************************************************





// DataCachingTable Database Definition STARTS *********************************************


// 1. Interfaces ***************************************************************************

    // Dexie Interface: Local Caching Table
    export interface IDataCachingTable {
        _id?: string;                           // Mongo ID (read only)
        key: string;                            // Unique key
        objectID: number;                       // Optional record ID, ie for Data
        messageDateTime: Date;                  // DateTime message was sent
        localCacheableDisc: boolean;            // True if cached locally, ie IndexedDB on Disc (DB)
        localCacheableMemory: boolean;          // True if cached locally, ie IndexedDB in RAM
        localCurrentVariableName: string;       // Optional name of memory current variable
        localExpiryDateTime: Date;              // When local cache expries
        localLastUpdatedDateTime: Date;         // When local cache last refreshed
        localLifeSpan: number;                  // Period in seconds before Workstation cache must be refreshed
        localTableName: string;                 // Optional name of Table in IndexedDB
        localThresholdLines: number;            // Max Nr lines that may be cached on Workstation
        localVariableName: string;              // Optional name of memory variable
        serverCacheableDisc: boolean;           // True if cached on server on Disc (DB)
        serverCacheableMemory: boolean;         // True if cached on server in RAM
        serverExpiryDateTime: Date;             // When cache expires on server
        serverLastUpdatedDateTime: Date;        // When cached last refreshed on server
        serverLastWSsequenceNr: number;         // Last WSockets message nr sent for this
        serverLifeSpan: number;                 // Period in seconds before Server cache must be refreshed
        serverThresholdLines: number;           // Max Nr lines that may be cached on Server
        serverVariableName: string;             // VariableName for the data on the server
    }


// 2. Tables / Classes *********************************************************************
    // Dexie Table: Local Caching Table
    export class LocalDataCachingTable implements IDataCachingTable {
        _id?: string;                           // Mongo ID (read only)
        key: string;                            // Unique key
        objectID: number;                       // Optional record ID, ie for Data
        messageDateTime: Date;                  // DateTime message was sent
        localCacheableDisc: boolean;            // True if cached locally, ie IndexedDB on Disc (DB)
        localCacheableMemory: boolean;          // True if cached locally, ie IndexedDB in RAM
        localCurrentVariableName: string;       // Optional name of memory current variable
        localExpiryDateTime: Date;              // When local cache expries
        localLastUpdatedDateTime: Date;         // When local cache last refreshed
        localLifeSpan: number;                  // Period in seconds before Workstation cache must be refreshed
        localTableName: string;                 // Optional name of Table in IndexedDB
        localThresholdLines: number;            // Max Nr lines that may be cached on Workstation
        localVariableName: string;              // Optional name of memory variable
        serverCacheableDisc: boolean;           // True if cached on server on Disc (DB)
        serverCacheableMemory: boolean;         // True if cached on server in RAM
        serverExpiryDateTime: Date;             // When cache expires on server
        serverLastUpdatedDateTime: Date;        // When cached last refreshed on server
        serverLastWSsequenceNr: number;         // Last WSockets message nr sent for this
        serverLifeSpan: number;                 // Period in seconds before Server cache must be refreshed
        serverThresholdLines: number;           // Max Nr lines that may be cached on Server
        serverVariableName: string;             // VariableName for the data on the server

        constructor(key: string,
            objectID,
            messageDateTime,
            localCacheableDisc,
            localCacheableMemory,
            localCurrentVariableName,
            localExpiryDateTime,
            localLastUpdatedDateTime,
            localLifeSpan,
            localTableName,
            localThresholdLines,
            localVariableName,
            serverCacheableDisc,
            serverCacheableMemory,
            serverExpiryDateTime,
            serverLastUpdatedDateTime,
            serverLastWSsequenceNr,
            serverLifeSpan,
            serverThresholdLines,
            serverVariableName

        ) {

            this.key = key,
            this.objectID = objectID,
            this.messageDateTime = messageDateTime,
            this.localCacheableDisc = localCacheableDisc,
            this.localCacheableMemory = localCacheableMemory,
            this.localCurrentVariableName = localCurrentVariableName,
            this.localExpiryDateTime = localExpiryDateTime,
            this.localLastUpdatedDateTime = localLastUpdatedDateTime,
            this.localLifeSpan = localLifeSpan,
            this.localTableName = localTableName,
            this.localThresholdLines = localThresholdLines,
            this.localVariableName = localVariableName,
            this.serverCacheableDisc = serverCacheableDisc,
            this.serverCacheableMemory = serverCacheableMemory,
            this.serverExpiryDateTime = serverExpiryDateTime,
            this.serverLastUpdatedDateTime = serverLastUpdatedDateTime,
            this.serverLastWSsequenceNr = serverLastWSsequenceNr,
            this.serverLifeSpan = serverLifeSpan,
            this.serverThresholdLines = serverThresholdLines,
            this.serverVariableName = serverVariableName

        }
    }


// 3. Database Definition ******************************************************************

    // Dexie DB: Data Caching DB
    export class DataCachingDatabase extends Dexie {
        // Declare implicit table properties.
        // (just to inform Typescript. Instanciated by Dexie in stores() method)
        localDataCachingTable: Dexie.Table<IDataCachingTable, number>; // number = type of the primkey

        constructor () {
            super("DataCachingTable");
            this.version(1).stores({
                localDataCachingTable: 'key, localLastUpdatedDateTime, localExpiryDateTime'
            });
        }
    }

    // DataCachingTable Database ENDS ******************************************************
