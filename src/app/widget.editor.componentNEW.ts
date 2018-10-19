// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { CSScolor }                   from './models';
import { Datasource }                 from './models';
import { GraphTransformation }        from './models';
import { Widget }                     from './models';
import { WidgetLayout }               from './models';
import { WidgetCheckpoint }           from './models';
import { WidgetGraph }                from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile }                    from 'vega-lite';
import { parse, field }                      from 'vega';
import { View }                       from 'vega';
import { warn } from 'vega-lite/build/src/log';
// import { forEach } from 'vega-lite/build/src/encoding';

const graphHeight: number = 260;
const graphWidth: number = 372;
const dragFieldMessage: string = 'Drag a field here ...';

export interface dataSchemaInterface {
    name: string;                   // Name of Field (DB or Calculated)
    typeName: string;               // ie String
    type: string;                   // ie string
    length: number;                 // Optional field length
    isCalculated: boolean;          // True if calculated
    calculatedExpression: string;   // Formula for calculated fields
}

export interface graphHistory {
    layer: number,                  // Layer for which W specs are stored
    widgetSpec: Widget[]            // Array of Ws previously stored
}

@Component({
    selector: 'widget-editorNEW',
    templateUrl: './widget.editor.componentNEW.html',
    styleUrls: ['./widget.editor.componentNEW.css']
  })
  export class WidgetEditorComponentNEW implements OnInit {

    @Input() selectedWidgetLayout: WidgetLayout;
    @Input() newWidget: boolean;
    @Input() showDatasourcePopup: boolean;  // TODO - Depricate this once form ready
    @Input() selectedWidget: Widget;
    @Input() newWidgetContainerLeft: number;
    @Input() newWidgetContainerTop: number;
    @Input() canSave: boolean = true;

    @Output() formWidgetEditorClosed: EventEmitter<Widget> = new EventEmitter();
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

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

            if (this.showDatasourceMain) {
                this.clickContinue();
                return;
            } else {
                if (this.showCalculatedAreaProperties) {
                    this.clickCalculatedApply();
                    return;
                } else {
                    this.clickSave('Saved');
                    return;
                }
            }
        };

    }

    aggregations: { displayName: string; vegaLiteName: string; description: string}[] = [
        {
            displayName: '',
            vegaLiteName: '',
            description: 'None.'
        },
        {
            displayName: 'Average',
            vegaLiteName: 'average',
            description: 'The mean (average) field value. Identical to mean.'
        },
        {
            displayName: 'Count',
            vegaLiteName: 'count',
            description: 'The total count of data objects in the group.  Similar to SQL’s count(*), count can be specified with a field "*".'
        },
        {
            displayName: 'Distinct',
            vegaLiteName: 'distinct',
            description: 'The count of distinct field values.'
        },
        {
            displayName: 'Max',
            vegaLiteName: 'max',
            description: 'The maximum field value.'
        },
        {
            displayName: 'Mean',
            vegaLiteName: 'mean',
            description: 'The mean (average) field value.'
        },
        {
            displayName: 'Median',
            vegaLiteName: 'median',
            description: 'The median field value.'
        },
        {
            displayName: 'Min',
            vegaLiteName: 'min',
            description: 'The minimum field value.'
        },
        {
            displayName: 'Mising',
            vegaLiteName: 'missing',
            description: 'The count of null or undefined field values.'
        },
        {
            displayName: 'Lower quartile boundary',
            vegaLiteName: 'q1',
            description: 'The lower quartile boundary of field values.'
        },
        {
            displayName: 'Lower Confidence',
            vegaLiteName: 'ci0',
            description: 'The lower boundary of the bootstrapped 95% confidence interval of the mean field value.'
        },
        {
            displayName: 'Standard Deviation',
            vegaLiteName: 'stdev',
            description: 'The sample standard deviation of field values.'
        },
        {
            displayName: 'Standard Error',
            vegaLiteName: 'stderr',
            description: 'The standard error of field values.'
        },
        {
            displayName: 'Sum',
            vegaLiteName: 'sum',
            description: 'The sum of field values.'
        },
        {
            displayName: 'Upper Confidence',
            vegaLiteName: 'ci1',
            description: 'The upper boundary of the bootstrapped 95% confidence interval of the mean field value.'
        },
        {
            displayName: 'Upper quartile boundary',
            vegaLiteName: 'q3',
            description: 'The upper quartile boundary of field values.'
        },
        {
            displayName: 'Valid',
            vegaLiteName: 'valid',
            description: 'The count of field values that are not null, undefined or NaN.'
        },
        {
            displayName: 'Variance',
            vegaLiteName: 'variance',
            description: 'The sample variance of field values.'
        }
    ]
    backgroundcolors: CSScolor[];
    calculatedErrorMessage: string = '';
    calculatedAs: string = '';
    calculatedExpression: string = '';
    dataFieldType: string = '';
    dataFieldTypeName: string = '';
    colorField: string = dragFieldMessage;
    columnField: string = dragFieldMessage;
    containerHasContextMenus: boolean = true;
    containerHasTitle: boolean = true;
    currentData: any = [];
    currentGraphComposition: string = 'Single';
    currentGraphID: number = -1;
    currentGraphLayer: number = 1;
    dataSchema: dataSchemaInterface[] = [];
    detailField: string = dragFieldMessage;
    draggedField: string = '';
    dragoverColours: boolean = false;
    errorMessage: string = '';
    errorMessageEditor: string = '';
    filterErrorMessage: string = ' ';
    filterField: string = '';
    filterOperator: string = '';
    filterValue: string = '';
    graphColor: string[];
    graphLayers: number[] = [1, 2, 3,];  // TODO - fix hardcoding
    // graphXaggregateVegaLiteName: string = '';
    // graphYaggregateVegaLiteName: string = '';
    graphColorAggregateVegaLiteName: string = '';
    graphHeader: string = 'Graph';
    graphHistory: graphHistory[] = [];
    graphHistoryPosition: number = 0;
    isBusyRetrievingData: boolean = false;
    isDragoverXField: boolean = false;
    isDragoverYField: boolean = false;
    isDragoverSizes: boolean = false;
    isDragoverRow: boolean = false;
    isDragoverColumn: boolean = false;
    isDragoverDetail: boolean = false;
    isDragoverX2: boolean = false;
    isDragoverY2: boolean = false;
    localDatasources: Datasource[] = null;          // Current DS for the selected W
    localWidget: Widget;                            // W to modify, copied from selected
    nrRows: number;
    oldWidget: Widget = null;                       // W at start
    rowField: string = dragFieldMessage;
    // sampleNumberRows: number = 0;
    selectedDescription: string = '';
    selectedFieldIndex: number = -1;
    selectedDSName: string = '';
    selectedRowIndex: number = -1;
    selectedRowID: number;
    sizeField: string = dragFieldMessage;
    showCalculatedAreaProperties: boolean = false;
    showColourDeleteIcon: boolean = false;
    showColumnDeleteIcon: boolean = false;
    showDetailDeleteIcon: boolean = false;
    showDatasourceMain: boolean = true;
    showFieldTitleProperties: boolean = false;
    showFieldXAxis: boolean = false;
    showFieldXPropertiesInfo: boolean = false;
    showFieldXProperties: boolean = false;
    showFieldXPropertiesTitle: boolean = false;
    showFieldYAxis: boolean = false;
    showFieldYProperties: boolean = false;
    showFieldYPropertiesInfo: boolean = false;
    showFieldYPropertiesTitle: boolean = false;
    showFieldSizeProperties: boolean = false;
    showFieldRowProperties: boolean = false;
    showFieldColumnProperties: boolean = false;
    showFieldLegend: boolean = false;
    showFieldColorProperties: boolean = false;
    showFieldColorPropertiesInfo: boolean = false;
    showFieldColorPropertiesTitle: boolean = false;
    showFieldFilter: boolean = false;
    showFilterAreaProperties: boolean = false;
    showGraphAreaTitle: boolean = false;
    showSelectionFilter: boolean = false;
    showFieldMarkProperties: boolean = false;
    showFieldDetailProperties: boolean = false;
    showFieldX2Properties: boolean = false;
    showFieldY2Properties: boolean = false;
    showPreview: boolean = false;
    showRowDeleteIcon: boolean = false;
    showSizeDeleteIcon: boolean = false;
    showSpecification: boolean = false;
    showType: boolean = false;
    showXDeleteIcon: boolean = false;
    showX2DeleteIcon: boolean = false;
    showYDeleteIcon: boolean = false;
    showY2DeleteIcon: boolean = false;
    sortOrder: number = 1;
    specification: any;              // Vega-Lite, Vega, or other grammar
    specificationJSON: string = 'Graph Specification';
    vegaColorSchemes: string[] = [
        "None",
        "accent",
        "bluegreen",
        "bluegreen-3",
        "bluegreen-4",
        "bluegreen-5",
        "bluegreen-6",
        "bluegreen-7",
        "bluegreen-8",
        "bluegreen-9",
        "blueorange",
        "blueorange-10",
        "blueorange-11",
        "blueorange-3",
        "blueorange-4",
        "blueorange-5",
        "blueorange-6",
        "blueorange-7",
        "blueorange-8",
        "blueorange-9",
        "bluepurple",
        "bluepurple-3",
        "bluepurple-4",
        "bluepurple-5",
        "bluepurple-6",
        "bluepurple-7",
        "bluepurple-8",
        "bluepurple-9",
        "blues",
        "blues-3",
        "blues-4",
        "blues-5",
        "blues-6",
        "blues-7",
        "blues-8",
        "blues-9",
        "brownbluegreen",
        "brownbluegreen-10",
        "brownbluegreen-11",
        "brownbluegreen-3",
        "brownbluegreen-4",
        "brownbluegreen-5",
        "brownbluegreen-6",
        "brownbluegreen-7",
        "brownbluegreen-8",
        "brownbluegreen-9",
        "category10",
        "category20",
        "category20b",
        "category20c",
        "dark2",
        "greenblue",
        "greenblue-3",
        "greenblue-4",
        "greenblue-5",
        "greenblue-6",
        "greenblue-7",
        "greenblue-8",
        "greenblue-9",
        "greens",
        "greens-3",
        "greens-4",
        "greens-5",
        "greens-6",
        "greens-7",
        "greens-8",
        "greens-9",
        "greys",
        "greys-3",
        "greys-4",
        "greys-5",
        "greys-6",
        "greys-7",
        "greys-8",
        "greys-9",
        "inferno",
        "magma",
        "orangered",
        "orangered-3",
        "orangered-4",
        "orangered-5",
        "orangered-6",
        "orangered-7",
        "orangered-8",
        "orangered-9",
        "oranges",
        "oranges-3",
        "oranges-4",
        "oranges-5",
        "oranges-6",
        "oranges-7",
        "oranges-8",
        "oranges-9",
        "paired",
        "pastel1",
        "pastel2",
        "pinkyellowgreen",
        "pinkyellowgreen-10",
        "pinkyellowgreen-11",
        "pinkyellowgreen-3",
        "pinkyellowgreen-4",
        "pinkyellowgreen-5",
        "pinkyellowgreen-6",
        "pinkyellowgreen-7",
        "pinkyellowgreen-8",
        "pinkyellowgreen-9",
        "plasma",
        "purpleblue",
        "purpleblue-3",
        "purpleblue-4",
        "purpleblue-5",
        "purpleblue-6",
        "purpleblue-7",
        "purpleblue-8",
        "purpleblue-9",
        "purplebluegreen",
        "purplebluegreen-3",
        "purplebluegreen-4",
        "purplebluegreen-5",
        "purplebluegreen-6",
        "purplebluegreen-7",
        "purplebluegreen-8",
        "purplebluegreen-9",
        "purplegreen",
        "purplegreen-10",
        "purplegreen-11",
        "purplegreen-3",
        "purplegreen-4",
        "purplegreen-5",
        "purplegreen-6",
        "purplegreen-7",
        "purplegreen-8",
        "purplegreen-9",
        "purpleorange",
        "purpleorange-10",
        "purpleorange-11",
        "purpleorange-3",
        "purpleorange-4",
        "purpleorange-5",
        "purpleorange-6",
        "purpleorange-7",
        "purpleorange-8",
        "purpleorange-9",
        "purplered",
        "purplered-3",
        "purplered-4",
        "purplered-5",
        "purplered-6",
        "purplered-7",
        "purplered-8",
        "purplered-9",
        "purples",
        "purples-3",
        "purples-4",
        "purples-5",
        "purples-6",
        "purples-7",
        "purples-8",
        "purples-9",
        "rainbow",
        "redblue",
        "redblue-10",
        "redblue-11",
        "redblue-3",
        "redblue-4",
        "redblue-5",
        "redblue-6",
        "redblue-7",
        "redblue-8",
        "redblue-9",
        "redgrey",
        "redgrey-10",
        "redgrey-11",
        "redgrey-3",
        "redgrey-4",
        "redgrey-5",
        "redgrey-6",
        "redgrey-7",
        "redgrey-8",
        "redgrey-9",
        "redpurple",
        "redpurple-3",
        "redpurple-4",
        "redpurple-5",
        "redpurple-6",
        "redpurple-7",
        "redpurple-8",
        "redpurple-9",
        "reds",
        "reds-3",
        "reds-4",
        "reds-5",
        "reds-6",
        "reds-7",
        "reds-8",
        "reds-9",
        "redyellowblue",
        "redyellowblue-10",
        "redyellowblue-11",
        "redyellowblue-3",
        "redyellowblue-4",
        "redyellowblue-5",
        "redyellowblue-6",
        "redyellowblue-7",
        "redyellowblue-8",
        "redyellowblue-9",
        "redyellowgreen",
        "redyellowgreen-10",
        "redyellowgreen-11",
        "redyellowgreen-3",
        "redyellowgreen-4",
        "redyellowgreen-5",
        "redyellowgreen-6",
        "redyellowgreen-7",
        "redyellowgreen-8",
        "redyellowgreen-9",
        "set1",
        "set2",
        "set3",
        "sinebow",
        "spectral",
        "spectral-10",
        "spectral-11",
        "spectral-3",
        "spectral-4",
        "spectral-5",
        "spectral-6",
        "spectral-7",
        "spectral-8",
        "spectral-9",
        "tableau10",
        "tableau20",
        "viridis",
        "yellowgreen",
        "yellowgreen-3",
        "yellowgreen-4",
        "yellowgreen-5",
        "yellowgreen-6",
        "yellowgreen-7",
        "yellowgreen-8",
        "yellowgreen-9",
        "yellowgreenblue",
        "yellowgreenblue-3",
        "yellowgreenblue-4",
        "yellowgreenblue-5",
        "yellowgreenblue-6",
        "yellowgreenblue-7",
        "yellowgreenblue-8",
        "yellowgreenblue-9",
        "yelloworangebrown",
        "yelloworangebrown-3",
        "yelloworangebrown-4",
        "yelloworangebrown-5",
        "yelloworangebrown-6",
        "yelloworangebrown-7",
        "yelloworangebrown-8",
        "yelloworangebrown-9",
        "yelloworangered",
        "yelloworangered-3",
        "yelloworangered-4",
        "yelloworangered-5",
        "yelloworangered-6",
        "yelloworangered-7",
        "yelloworangered-8",
        "yelloworangered-9"

    ];
    widgetGraphs: WidgetGraph[] =[];
    xField: string = dragFieldMessage;
    x2Field: string = dragFieldMessage;
    yField: string = dragFieldMessage;
    y2Field: string = dragFieldMessage;

    timeUnits: string[] = [
        "",
        "Date",
        "Day",
        "Hours",
        "HoursMinutes",
        "HoursMinutesSeconds",
        "Milliseconds",
        "Minutes",
        "MinutesSeconds",
        "Month",
        "MonthDate",
        "Quarter",
        "QuarterMonth",
        "Seconds",
        "SecondsMilliseconds",
        "Year",
        "YearMonth",
        "YearMonthDate",
        "YearMonthDateHours",
        "YearMonthDateHoursMinutes",
        "YearMonthDateHoursMinutesSeconds",
        "YearQuarter",
        "YearQuarterMonth"
    ];

    // TODO - remove this later on when we dont use D3 time formats at all
    dateTimeFormats: {displayFormat: string; d3Format: string, description: string}[] =
    [
        {
            displayFormat: 'Short Weekday Name',
            d3Format: '%a',
            description: 'abbreviated weekday name.*'
        },
        {
            displayFormat: 'Full Weekday Name',
            d3Format: '%A',
            description: 'full weekday name.*'
        },
        {
            displayFormat: 'Abr Month Name',
            d3Format: '%b',
            description: 'abbreviated month name.*'
        },
        {
            displayFormat: 'Full Month Name',
            d3Format: '%B',
            description: 'full month name.*'
        },
        {
            displayFormat: 'Locale Datetime',
            d3Format: '%c',
            description: 'the locale’s date and time, such as %x, %X.*'
        },
        {
            displayFormat: 'Zero padded Day',
            d3Format: '%d',
            description: 'zero-padded day of the month as a decimal number [01,31].'
        },
        {
            displayFormat: 'Space padded Day',
            d3Format: '%e',
            description: 'space-padded day of the month as a decimal number [ 1,31]; equivalent to %_d.'
        },
        {
            displayFormat: 'Microseconds',
            d3Format: '%f',
            description: 'microseconds as a decimal number [000000, 999999].'
        },
        {
            displayFormat: 'Hour (24h)',
            d3Format: '%H',
            description: 'hour (24-hour clock) as a decimal number [00,23].'
        },
        {
            displayFormat: 'Hour (12h)',
            d3Format: '%I',
            description: 'hour (12-hour clock) as a decimal number [01,12].'
        },
        {
            displayFormat: 'Day number of year',
            d3Format: '%j',
            description: 'day of the year as a decimal number [001,366].'
        },
        {
            displayFormat: 'Month number',
            d3Format: '%m',
            description: 'month as a decimal number [01,12].'
        },
        {
            displayFormat: 'Minutes',
            d3Format: '%M',
            description: 'minute as a decimal number [00,59].'
        },
        {
            displayFormat: 'Millisecond',
            d3Format: '%L',
            description: 'milliseconds as a decimal number [000, 999].'
        },
        {
            displayFormat: 'AM or PM',
            d3Format: '%p',
            description: 'either AM or PM.*'
        },
        {
            displayFormat: 'Seconds',
            d3Format: '%S',
            description: 'second as a decimal number [00,61].'
        },
        {
            displayFormat: 'Weekday number (Monday)',
            d3Format: '%u',
            description: 'Monday-based (ISO 8601) weekday as a decimal number [1,7].'
        },
        {
            displayFormat: 'Week number (Sunday)',
            d3Format: '%U',
            description: 'Sunday-based week of the year as a decimal number [00,53].'
        },
        {
            displayFormat: 'Week number (ISO)',
            d3Format: '%V',
            description: 'ISO 8601 week of the year as a decimal number [01, 53].'
        },
        {
            displayFormat: 'Weekday (Sunday)',
            d3Format: '%w',
            description: 'Sunday-based weekday as a decimal number [0,6].'
        },
        {
            displayFormat: 'Week number (Monday)',
            d3Format: '%W',
            description: 'Monday-based week of the year as a decimal number [00,53].'
        },
        {
            displayFormat: 'Locale date',
            d3Format: '%x',
            description: 'the locale’s date, such as %-m/%-d/%Y.*'
        },
        {
            displayFormat: 'Locale time',
            d3Format: '%X',
            description: 'the locale’s time, such as %-I:%M:%S %p.*'
        },
        {
            displayFormat: 'Year as YY',
            d3Format: '%y',
            description: 'year without century as a decimal number [00,99].'
        },
        {
            displayFormat: 'Year as YYYY',
            d3Format: '%Y',
            description: 'year with century as a decimal number.'
        },
        {
            displayFormat: 'Date Time',
            d3Format: 'dateTime',
            description: 'The date and time (%c) format specifier (e.g., "%a %b %e %X %Y").'
        },
        {
            displayFormat: 'Full Weekday',
            d3Format: 'days',
            description: 'The full names of the weekdays, starting with Sunday.'
        },
        {
            displayFormat: 'Short Weekday',
            d3Format: 'shortDays',
            description: 'The abbreviated names of the weekdays, starting with Sunday.'
        },
        {
            displayFormat: 'full Months',
            d3Format: 'months',
            description: 'The full names of the months (starting with January).'
        },
        {
            displayFormat: 'Short Months',
            d3Format: 'shortMonths',
            description: 'The abbreviated names of the months (starting with January).'
        }
    ]

    // D3 formatting 101:
    // [[fill]align][sign][symbol][0][width][,][.precision][type]
    //
    // type:
    //   e = scientific
    //   d = integer (IGNORES non-integer values, no change to integers)
    //   % = This multiplies the number times 100 and appends a "%" symbol at the end of the string.
    //   s = Converts numbers to SI units.
    //
    // precision
    //   g = General - A precision type provides precision total length numerical output.
    //   f = Fixed - A fixed type provides precision length after the decimal point.
    //       d3.format(".4f")(3.14159); //"3.1416"
    //   r = Rounded - An general type will round the number to a fixed number.
    //
    // , Thousands Seperator
    //   ie format(".2f")(10101);    //"10,101.00"
    //
    // width = pads to same widht,
    //   ie format("8")(1);      //"       1"
    //   NOTE - this is the TOTAL length of the string, so 12.34 count as 4 digits
    //
    // 0 = zero padding, use with width
    //   ie format("08")(1234);         //"00001234"
    //      format("09,")(123456);      //"0,123,456"
    //
    // Symbols - seems you can only use $ here, which should automatically pick up your locale
    //   ie format("$,")(1250);         //"$1,250"
    //   ie  format("$,.2f")(1250);     //"$1,250.00"
    //
    // Sign - determines how to view negative/postive values
    //   ie format("+")(125);           //"+125"
    //   ie format("+")(-125);          //"-125"
    //   ie format("-")(125);           //"125"
    //   ie format("-")(-125);          //"-125"
    //   ie format(" ")(125);           //" 125"
    //   ie format(" ")(-125);          //"-125"
    //
    // Alignment and Fill - You can also align the formatter output string with any
    //   character you want as long as it isn't { or }. You will need to tell the formatter
    //   how you want to align characters and what character to use as the fill. The fill
    //   character would need to preseed an alignment indicator:
    //      "<" - left alignment
    //      ">" - right alignment
    //      "^" - center alignment
    //   format("4>8")(1);              //"44444441"
    //   format("4^8")(1);              //"44441444"
    //   format("4<8")(1);              //"14444444"
    //
    numberFormats: {displayFormat: string; d3Format: string; description: string}[] =
    [
        {
            displayFormat: 'Exponent',
            d3Format: 'e',
            description: 'exponent notation.'
        },
        {
            displayFormat: 'Fixed point',
            d3Format: 'f',
            description: 'fixed point notation.'
        },
        {
            displayFormat: 'Rounded',
            d3Format: 'r',
            description: 'decimal notation, rounded to significant digits.'
        },
        {
            displayFormat: 'SI Prefix',
            d3Format: 's',
            description: 'decimal notation with an SI prefix, rounded to significant digits.'
        },
        {
            displayFormat: 'Percentage',
            d3Format: '%',
            description: 'multiply by 100, and then decimal notation with a percent sign.'
        },
        {
            displayFormat: 'Percentage rounded',
            d3Format: 'p',
            description: 'multiply by 100, round to significant digits, and then decimal notation with a percent sign.'
        }
    ]

    siPrefix: {displayFormat: string; d3Format: string; description: string}[] =
    [
        {
            displayFormat: 'yocto',
            d3Format: 'y',
            description: '10⁻²⁴'
        },
        {
            displayFormat: 'zepto',
            d3Format: 'z',
            description: '10⁻²¹'
        },
        {
            displayFormat: 'atto',
            d3Format: 'a',
            description: '10⁻¹⁸'
        },
        {
            displayFormat: 'femto',
            d3Format: 'f',
            description: '10⁻¹⁵'
        },
        {
            displayFormat: 'pico',
            d3Format: 'p',
            description: '10⁻¹²'
        },
        {
            displayFormat: 'nano',
            d3Format: 'n',
            description: '10⁻⁹'
        },
        {
            displayFormat: 'micro',
            d3Format: 'µ',
            description: '10⁻⁶'
        },
        {
            displayFormat: 'milli',
            d3Format: 'm',
            description: '10⁻³'
        },
        {
            displayFormat: ' (none)',
            d3Format: '​',
            description: '10⁰'
        },
        {
            displayFormat: 'kilo',
            d3Format: 'k',
            description: '10³'
        },
        {
            displayFormat: 'mega',
            d3Format: 'M',
            description: '10⁶'
        },
        {
            displayFormat: 'giga',
            d3Format: 'G',
            description: '10⁹'
        },
        {
            displayFormat: 'tera',
            d3Format: 'T',
            description: '10¹²'
        },
        {
            displayFormat: 'peta',
            d3Format: 'P',
            description: '10¹⁵'
        },
        {
            displayFormat: 'exa',
            d3Format: 'E',
            description: '10¹⁸'
        },
        {
            displayFormat: 'zetta',
            d3Format: 'Z',
            description: '10²¹'
        },
        {
            displayFormat: 'yotta',
            d3Format: 'Y',
            description: '10²⁴'
        }
    ]
    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // ngOnInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();
        this.backgroundcolors = [
            {id: null, name: 'Open Picker ...', cssCode: '', shortList: false}, ...this.backgroundcolors
        ];

        // Get DS to which user has permissions
        this.localDatasources = this.globalVariableService.datasources
            .slice()
            .filter(ds =>
                this.globalVariableService.datasourcePermissionsCheck(ds.id, 'CanView')
            )
            .sort( (obj1, obj2) => {
                if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                    return 1;
                };
                if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                    return -1;
                };
                return 0;
            });

        // Start afresh for new W~
        if (this.newWidget) {
console.warn('xx this.selectedWidgetLayout', this.selectedWidgetLayout);

            // Get Widget Graph Specs
            this.globalVariableService.getWidgetGraphs().then(res => {
                this.widgetGraphs = res
            });

            // Count the Ws
            let widgets: Widget[];
            this.localDatasources.forEach(ds => {
                widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
                ds.nrWidgets = widgets.length;
            });

            // Create new W
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Graph';

            // Populate predefined dimensions, considering layouts
            if (this.localWidget.graphColorScheme == ''  ||  this.localWidget.graphColorScheme == null) {
                this.localWidget.graphColorScheme = 'None';
            };
            if (this.newWidgetContainerLeft > 0) {
                this.localWidget.containerLeft = this.newWidgetContainerLeft;
            };
            if (this.newWidgetContainerTop > 0) {
                this.localWidget.containerTop = this.newWidgetContainerTop;
            };
            if (this.selectedWidgetLayout != null) {

                if (this.selectedWidgetLayout.id != null
                    &&
                    this.selectedWidgetLayout.id != undefined) {
                        this.localWidget.containerLeft = this.selectedWidgetLayout.left;
                        this.localWidget.containerHeight = this.selectedWidgetLayout.height;
                        this.localWidget.containerTop = this.selectedWidgetLayout.top;
                        this.localWidget.containerWidth = this.selectedWidgetLayout.width;
                };
            };

            // Select previously used DS, and then click it to load relevant info
            // NB: AFTER the localWidget has been initialised
            if (this.globalVariableService.previousGraphEditDSID != -1) {

                let datasourceIndex: number = this.localDatasources.findIndex(ds =>
                    ds.id == this.globalVariableService.previousGraphEditDSID
                );
                if (datasourceIndex >= 0) {
                    this.selectedRowID = this.globalVariableService.previousGraphEditDSID;
                    this.selectedRowIndex = datasourceIndex;

                    this.clickDSrow(this.selectedRowIndex, this.selectedRowID)
                }
            };

        } else {

            // Deep copy original W
            this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Deep copy Local W
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            if (this.localWidget.graphColorScheme == ''  ||  this.localWidget.graphColorScheme == null) {
                this.localWidget.graphColorScheme = 'None';
            };

            // TODO - handle properly and close form
            if (this.localWidget.datasourceID == 0) {
                alert('No Widget was selected, or could not find it in glob vars.  In: ngOnInit, ELSE +- line 170 inside WidgetEditor.ts')
            };

            // Fill in defaults
            if (this.localWidget.graphHeight == null) {
                this.localWidget.graphHeight = 240;
            };
            if (this.localWidget.graphLeft == null) {
                this.localWidget.graphLeft = 1;
            };
            if (this.localWidget.graphTop == null) {
                this.localWidget.graphTop = 1;
            };
            if (this.localWidget.graphWidth == null) {
                this.localWidget.graphWidth = 240;
            };
            if (this.localWidget.graphDimensionTop == null) {
                this.localWidget.graphDimensionTop = 35;
            };
            if (this.localWidget.graphDimensionRight == null) {
                this.localWidget.graphDimensionRight = 140;
            };
            if (this.localWidget.graphDimensionLeft == null) {
                this.localWidget.graphDimensionLeft = 80;
            };
            if (this.localWidget.graphDimensionBottom == null) {
                this.localWidget.graphDimensionBottom = 70;
            };
    
            // Add Fields to selection areas
            if (this.localWidget.graphXfield != ''   &&   this.localWidget.graphXfield != null) {
                this.showXDeleteIcon = true;
                this.showFieldXPropertiesTitle = true;
                this.xField = this.localWidget.graphXfield;

            } else {
                this.showXDeleteIcon = false;
                this.showFieldXPropertiesTitle = false;
                this.xField = dragFieldMessage;
            };

            if (this.localWidget.graphYfield != ''   &&   this.localWidget.graphYfield != null) {
                this.showYDeleteIcon = true;
                this.showFieldYPropertiesTitle = true;
                this.yField = this.localWidget.graphYfield;
            } else {
                this.showYDeleteIcon = false;
                this.showFieldYPropertiesTitle = false;
                this.yField = dragFieldMessage;
            };

            if (this.localWidget.graphColorField != ''   &&   this.localWidget.graphColorField != null) {
                this.showColourDeleteIcon = true;
                this.showFieldColorPropertiesTitle = true;
                this.colorField = this.localWidget.graphColorField;
            } else {
                this.showColourDeleteIcon = false;
                this.showFieldColorPropertiesTitle = false;
                this.colorField = dragFieldMessage;
            };

            if (this.localWidget.graphSizeField != ''   &&   this.localWidget.graphSizeField != null) {
                this.showSizeDeleteIcon = true;
                this.sizeField = this.localWidget.graphSizeField;
            } else {
                this.showSizeDeleteIcon = false;
                this.sizeField = dragFieldMessage;
            };

            if (this.localWidget.graphRowField != ''   &&   this.localWidget.graphRowField != null) {
                this.showRowDeleteIcon = true;
                this.rowField = this.localWidget.graphRowField;
            } else {
                this.showRowDeleteIcon = false;
                this.rowField = dragFieldMessage;
            };

            if (this.localWidget.graphColumnField != ''   &&   this.localWidget.graphColumnField != null) {
                this.showColumnDeleteIcon = true;
                this.columnField = this.localWidget.graphColumnField;
            } else {
                this.showColumnDeleteIcon = false;
                this.columnField = dragFieldMessage;
            };

            if (this.localWidget.graphDetailField != ''   &&   this.localWidget.graphDetailField != null) {
                this.showDetailDeleteIcon = true;
                this.detailField = this.localWidget.graphDetailField;
            } else {
                this.showDetailDeleteIcon = false;
                this.detailField = dragFieldMessage;
            };

            if (this.localWidget.graphX2Field != ''   &&   this.localWidget.graphX2Field != null) {
                this.showX2DeleteIcon = true;
                this.x2Field = this.localWidget.graphX2Field;

            } else {
                this.showX2DeleteIcon = false;
                this.x2Field = dragFieldMessage;
            };

            if (this.localWidget.graphY2Field != ''   &&   this.localWidget.graphY2Field != null) {
                this.showY2DeleteIcon = true;
                this.y2Field = this.localWidget.graphY2Field;

            } else {
                this.showY2DeleteIcon = false;
                this.y2Field = dragFieldMessage;
            };

            // Get local vars - easier for ngFor
            this.containerHasContextMenus = this.localWidget.containerHasContextMenus;
            this.containerHasTitle = this.localWidget.containerHasTitle;

            let arrayIndex: number = this.localDatasources.findIndex(
                ds => ds.id == this.localWidget.datasourceID
            );
            if (arrayIndex < 0) {
                alert('Datasource for current Dashboard not found in global currentDatasources')
            };

            this.constructDataSchema(arrayIndex);

            // Reset, Highlight selected row
            this.selectedRowIndex = arrayIndex;
            this.selectedRowID = this.localDatasources[arrayIndex].id;
            this.selectedDSName = this.localDatasources[arrayIndex].name.slice(0,22) + 
                (this.localDatasources[arrayIndex].name.length > 22?  '...'  :  '');
            this.selectedDescription = this.localDatasources[arrayIndex].description;
            this.errorMessage = '';
            this.currentData = null;

            // Determine if data in Glob Var
            let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
                ds => ds.datasourceID == this.selectedRowID
            );
            if (dataSetIndex >= 0) {

                // Load first few rows into preview
                this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                    .data.slice(0,5);

                // Switch on the preview after the first row was clicked
                this.showPreview = true;
            };
            
            // Remember ID for next time
            this.globalVariableService.previousGraphEditDSID = this.selectedRowID;

            // Show the Editor form
            this.showDatasourceMain = false;

            // Get Widget Graph Specs
            this.globalVariableService.getWidgetGraphs().then(res => {
                this.widgetGraphs = res

                // Show graph
                let graphIndex: number = this.widgetGraphs.findIndex(
                    wgr => wgr.mark == this.localWidget.graphMark
                );
                this.showGraph(this.widgetGraphs[graphIndex].id);
            });

        }

    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        // Render if Editing an existing one
        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        // if (!this.newWidget) {
        //     this.renderGraph(definition);
        // }
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    showGraph(graphID: number, createNewHistory: boolean = true) {
        // Render the graph on the form.  NOTE: each graph has its own spec and rendering
        // rules.
        this.globalFunctionService.printToConsole(this.constructor.name,'showGraph', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Keep graphID
        this.currentGraphID = graphID;

        // Switch off initial display
        this.showGraphAreaTitle = true;

        // Get the Vega-Lite aggregation
        this.localWidget.graphXaggregate = '';
        if (this.localWidget.graphXaggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(
                agg => agg.displayName == this.localWidget.graphXaggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphXaggregate = this.aggregations[aggregationIndex]
                    .vegaLiteName;
            };
        }
        this.localWidget.graphYaggregate = '';
        if (this.localWidget.graphYaggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(
                agg => agg.displayName == this.localWidget.graphYaggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphYaggregate = this.aggregations[aggregationIndex]
                    .vegaLiteName;
            };
        }
        this.localWidget.graphColorAggregate = '';
        if (this.localWidget.graphColorAggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(
                agg => agg.displayName == this.localWidget.graphColorAggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphColorAggregate = this.aggregations[aggregationIndex]
                    .vegaLiteName;
            };
        }
        this.localWidget.graphSizeAggregate = '';
        if (this.localWidget.graphSizeAggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(
                agg => agg.displayName == this.localWidget.graphSizeAggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphSizeAggregate = this.aggregations[aggregationIndex]
                    .vegaLiteName;
            };
        }

        // Fields and data schema
        this.localWidget.dataschema = this.dataSchema;

        // Get the widgetGraph
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.id == graphID);
        if (widgetGraphIndex < 0) {
            this.errorMessageEditor = 'Graph type id = ' + graphID + ' does not exist in the DB';
            return;
        } else {
            this.localWidget.graphMark = this.widgetGraphs[widgetGraphIndex]['mark'];
        };

        // Startup
        let width: number = 372;
        let height: number = 260;
        let graphVisualGrammar: string = this.widgetGraphs[widgetGraphIndex].visualGrammar;
        let graphShortName: string = this.widgetGraphs[widgetGraphIndex].shortName;


        // Set fields
        this.localWidget.graphXfield = '';
        if (this.xField != dragFieldMessage) {
            this.localWidget.graphXfield = this.xField;
        };
        this.localWidget.graphYfield = '';
        if (this.yField != dragFieldMessage) {
            this.localWidget.graphYfield = this.yField;
        };
        this.localWidget.graphColorField = '';
        if (this.colorField != dragFieldMessage) {
            this.localWidget.graphColorField = this.colorField;
        };
        this.localWidget.graphSizeField = '';
        if (this.sizeField != dragFieldMessage) {
            this.localWidget.graphSizeField = this.sizeField;
        };
        this.localWidget.graphRowField = '';
        if (this.rowField != dragFieldMessage) {
            this.localWidget.graphRowField = this.rowField;
        };
        this.localWidget.graphColumnField = '';
        if (this.columnField != dragFieldMessage) {
            this.localWidget.graphColumnField = this.columnField;
        };
        this.localWidget.graphDetailField = '';
        if (this.detailField != dragFieldMessage) {
            this.localWidget.graphDetailField = this.detailField;
        };
        this.localWidget.graphX2Field = '';
        if (this.x2Field != dragFieldMessage) {
            this.localWidget.graphX2Field = this.x2Field;
        };
        this.localWidget.graphY2Field = '';
        if (this.y2Field != dragFieldMessage) {
            this.localWidget.graphY2Field = this.y2Field;
        };

        // Validation and Warnings - AFTER default settings
        if (this.sizeField != dragFieldMessage
            &&
            this.widgetGraphs[widgetGraphIndex]['mark'] == 'rect') {
            this.errorMessageEditor = "'size' is incompatible with Rectangle graph.";
        };

        // Defaults
        if (this.localWidget.graphXtype == ''  ||  this.localWidget.graphXtype == null) {
            this.localWidget.graphXtype = 'ordinal';
        };
        if (this.localWidget.graphYtype == ''  ||  this.localWidget.graphYtype == null) {
            this.localWidget.graphYtype = 'ordinal';
        };
        if (this.localWidget.graphColorType == ''  ||  this.localWidget.graphColorType == null) {
            this.localWidget.graphColorType = 'ordinal';
        };

        if (this.graphColorAggregateVegaLiteName == null) {this.graphColorAggregateVegaLiteName = ""};
        if (this.localWidget.graphColorFormat == null) {this.localWidget.graphColorFormat = ""};
        if (this.localWidget.graphColorSort == null) {this.localWidget.graphColorSort = ""};
        if (this.localWidget.graphColorStack == null) {this.localWidget.graphColorStack = ""};
        if (this.localWidget.graphColorTimeUnit == null) {this.localWidget.graphColorTimeUnit = ""};
        if (this.localWidget.graphTitleAnchor == null) {this.localWidget.graphTitleAnchor = ""}
        if (this.localWidget.graphTitleBaseline == null) {this.localWidget.graphTitleBaseline = ""}
        if (this.localWidget.graphTitleOrientation == null) {this.localWidget.graphTitleOrientation = ""}
        // if (this.graphXaggregateVegaLiteName == null) {this.graphXaggregateVegaLiteName = ""}
        if (this.localWidget.graphXformat == null) {this.localWidget.graphXformat = ""}
        if (this.localWidget.graphXsort == null) {this.localWidget.graphXsort = ""}
        if (this.localWidget.graphXtimeUnit == null) {this.localWidget.graphXtimeUnit = ""}
        // if (this.graphYaggregateVegaLiteName == null) {this.graphYaggregateVegaLiteName = ""}
        if (this.localWidget.graphYformat == null) {this.localWidget.graphYformat = ""}
        if (this.localWidget.graphYsort == null) {this.localWidget.graphYsort = ""}
        if (this.localWidget.graphYtimeUnit == null) {this.localWidget.graphYtimeUnit = ""}
        if (this.localWidget.graphLegendTitle == null) {this.localWidget.graphLegendTitle = ""}

        // Define Specification
        if (this.widgetGraphs[widgetGraphIndex].specificationType.toLowerCase() ==
            'custom') {

            this.specification = this.widgetGraphs[widgetGraphIndex].specification;

            // Replace the data in the spec - each custom one is different
            if (this.widgetGraphs[widgetGraphIndex].shortName == 'Donut with Sliders') {
                let xDataValues: any = this.localWidget.graphData.map(x => {
                    let obj: any = {
                        "id": x[this.xField],
                        "field": x[this.yField]
                    };
                    return obj;
                });

                this.specification['data'][0]['values'] = xDataValues;
            };
            if (this.widgetGraphs[widgetGraphIndex].shortName == 'Word Cloud') {
                let xColumnValues: any = this.localWidget.graphData.map(x => x[this.xField]);
                this.specification['data'][0]['values'] = xColumnValues;
            };

            // Render graph for Vega-Lite
            if (graphVisualGrammar == 'Vega-Lite') {
                if (this.specification != undefined) {
                    let vegaSpecification = compile(this.specification).spec;
                    let view = new View(parse(vegaSpecification));

                    view.renderer('svg')
                        .initialize(this.dragWidget.nativeElement)
                        .width(372)
                        .hover()
                        .run()
                        .finalize();
                };
            };

            // Render graph for Veg
            if (graphVisualGrammar == 'Vega') {

                if (this.specification != undefined) {

                    let view = new View(parse(this.specification));

                    view.renderer('svg')
                        .initialize(this.dragWidget.nativeElement)
                        .width(372)
                        .hover()
                        .run()
                        .finalize();
                };
            };

        } else {

            // // Tooltip setting
            // // specification['mark']['tooltip']['content'] = "";

            // Create Spec
            this.specification = this.globalVariableService.createVegaLiteSpec(
                this.localWidget, this.localWidget.graphHeight, this.localWidget.graphWidth
            );

            console.warn('xx @END of ShowGraph specification', this.specification);

            // Render graph for Vega-Lite
            if (graphVisualGrammar == 'Vega-Lite') {
                if (this.specification != undefined) {
                    let vegaSpecification = compile(this.specification).spec;
                    let view = new View(parse(vegaSpecification));

                    view.renderer('svg')
                        .initialize(this.dragWidget.nativeElement)
                        .hover()
                        .run()
                        .finalize();
                };
            };
        };

        // Append to history
        let layerIndex: number = this.graphHistory.findIndex(gh => gh.layer == this.currentGraphLayer);
        if (layerIndex < 0) {
            this.graphHistory.push({
                layer: this.currentGraphLayer,
                widgetSpec: []
            });

            // Set position
            layerIndex = 0;
        };

        // Append if requested
        if (createNewHistory) {
            this.graphHistory[layerIndex].widgetSpec.push({
                ...this.localWidget, ...{ graphData: [] } 
            });
            this.graphHistoryPosition = this.graphHistory[layerIndex].widgetSpec.length - 1;
        };
        
        // Calc position
        this.graphHeader = 'History: showing ' + 
            (this.graphHistoryPosition + 1).toString() + ' of ' +
            this.graphHistory[layerIndex].widgetSpec.length.toString();
        
    }

    clickBrowsePreviousGraph() {
        // Browse to previous graph in history
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBrowsePreviousGraph', '@Start');

        // Decrease position, if not at beginning
        if (this.graphHistoryPosition == 0) {
            return;
        };
        this.graphHistoryPosition = this.graphHistoryPosition - 1;
     
        // Recreate a new W spec
        let layerIndex: number = this.graphHistory.findIndex(gh => gh.layer == this.currentGraphLayer);
        let newWidgetSpec: Widget = {
            ...this.graphHistory[layerIndex].widgetSpec[this.graphHistoryPosition],
             ...{ graphData: this.localWidget.graphData } 
        };
        this.localWidget = { ... newWidgetSpec };
        
        // Get the graphID
        let graphID: number = -1;
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.mark == this.localWidget.graphMark);
        if (widgetGraphIndex < 0) {
            this.errorMessageEditor = 'Graph type mark = ' + this.localWidget.graphMark + ' does not exist in the DB';
            return;
        } else {
            graphID = this.widgetGraphs[widgetGraphIndex]['id'];
        };

        console.warn('xx newWidgetSpec', newWidgetSpec, graphID)

        // Show graph
        this.showGraph(graphID, false);
    }

    clickBrowseNextGraph() {
        // Browse to next graph in history
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBrowseNextGraph', '@Start');

        // Increase position, if not at beginning
        let layerIndex: number = this.graphHistory.findIndex(gh => gh.layer == this.currentGraphLayer);
        if (this.graphHistoryPosition >= (this.graphHistory[layerIndex].widgetSpec.length - 1) ) {
            return;
        };
        this.graphHistoryPosition = this.graphHistoryPosition + 1;
     
        // Recreate a new W spec
        let newWidgetSpec: Widget = {
            ...this.graphHistory[layerIndex].widgetSpec[this.graphHistoryPosition],
             ...{ graphData: this.localWidget.graphData } 
        };
        this.localWidget = { ... newWidgetSpec };
        
        // Get the graphID
        let graphID: number = -1;
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.mark == this.localWidget.graphMark);
        if (widgetGraphIndex < 0) {
            this.errorMessageEditor = 'Graph type mark = ' + this.localWidget.graphMark + ' does not exist in the DB';
            return;
        } else {
            graphID = this.widgetGraphs[widgetGraphIndex]['id'];
        };

        console.warn('xx newWidgetSpec', newWidgetSpec, graphID)

        // Show graph
        this.showGraph(graphID, false);
    }

  	clickClose(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(null);
    }

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validate
        if (this.localWidget.graphMark == ''  ||  this.localWidget.graphMark == null) {
            this.errorMessage = 'Please select a type of graph';
            return;
        };

        this.localWidget.containerHasContextMenus = this.containerHasContextMenus;
        this.localWidget.containerHasTitle = this.containerHasTitle;

        // Calc the graph dimensions
        // this.localWidget.graphHeight = this.globalVariableService.calcGraphHeight(this.localWidget);
        // this.localWidget.graphWidth = this.globalVariableService.calcGraphWidth(this.localWidget);

        // Update new/edit
        if (this.newWidget) {

            let tempChk: WidgetCheckpoint[] = this.globalVariableService.widgetCheckpoints
                .filter(wc =>
                    wc.dashboardID == this.localWidget.dashboardID
                    &&
                    wc.widgetID == this.localWidget.id
            );

            if (tempChk.length > 0) {
                this.localWidget.showCheckpoints = false;
                this.localWidget.checkpointIDs = [];
                this.localWidget.currentCheckpoint = 0;
                this.localWidget.lastCheckpoint = tempChk.length - 1;

                for (var x = 0; x < tempChk.length; x++) {
                    this.localWidget.checkpointIDs.push(tempChk[x].id);
                };

            } else {
                this.localWidget.showCheckpoints = false;
                this.localWidget.checkpointIDs = [];
                this.localWidget.currentCheckpoint = 0;
                this.localWidget.lastCheckpoint = -1;
            };

            // Update local and global vars
            this.localWidget.dashboardTabIDs.push(this.globalVariableService.
                currentDashboardInfo.value.currentDashboardTabID);

            this.globalVariableService.addWidget(this.localWidget).then(res => {
                this.localWidget.id = res.id;

                // Action
                // TODO - cater for errors + make more generic
                let actID: number = this.globalVariableService.actionUpsert(
                    null,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    this.localWidget.id,
                    'Widget',
                    'Edit',
                    'Update Title',
                    'W Title clickSave',
                    null,
                    null,
                    null,
                    this.localWidget,
                    false               // Dont log to DB yet
                );

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Graph Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                // Return to main menu
                this.formWidgetEditorClosed.emit(this.localWidget);

            });

        } else {

            // Update global W and DB
            this.globalVariableService.saveWidget(this.localWidget).then(res => {

                // Action
                // TODO - cater for errors + make more generic
                let actID: number = this.globalVariableService.actionUpsert(
                    null,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    this.localWidget.id,
                    'Widget',
                    'Edit',
                    'Update Title',
                    'W Title clickSave',
                    null,
                    null,
                    this.oldWidget,
                    this.localWidget,
                    false               // Dont log to DB yet
                );

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Graph Saved',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formWidgetEditorClosed.emit(this.localWidget);

            });

        };
    }

    dragstartXField(ev) {
        // Event trigger when start Dragging X Field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartXField', '@Start');
        
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = this.xField;
    }

    dragstartYField(ev) {
        // Event trigger when start Dragging Y Field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartYField', '@Start');
        
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = this.yField;
    }

    dragstartColorField(ev) {
        // Event trigger when start Dragging Color Field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartColorField', '@Start');
        
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = this.colorField;
    }

    clickFillXfield(fieldName: string) {
        // Click icon to fill this field into X field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillXfield', '@Start');
        
        this.dropXField(null, fieldName);

    }

    clickFillYfield(fieldName: string) {
        // Click icon to fill this field into X field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillYfield', '@Start');
        
        this.dropYField(null, fieldName);

    }

    clickFillColorField(fieldName: string) {
        // Click icon to fill this field into X field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillColorField', '@Start');
        
        this.dropColour(null, fieldName);

    }

    dragstartField(ev) {
        // Event trigger when start Dragging a Field in the list
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText.trim();
    }

    dragoverXField(ev, actionName: string) {
        // Event trigger when a field is dragged over X Field element
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverXField', '@Start');

        ev.preventDefault();
    }

    dragoverYField(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverYField', '@Start');

        ev.preventDefault();
    }

    dragoverColour(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Color field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColour', '@Start');

        ev.preventDefault();
    }

    dragoverSize(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverSize', '@Start');

        ev.preventDefault();
    }

    dragoverRow(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverRow', '@Start');

        ev.preventDefault();
    }

    dragoverColumn(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColumn', '@Start');

        ev.preventDefault();
    }

    dragoverDetail(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Detail field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverDetail', '@Start');

        ev.preventDefault();
    }

    dragoverX2(ev, actionName: string) {
        // Event trigger when the dragged Field is over the X2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverX2', '@Start');

        ev.preventDefault();
    }

    dragoverY2(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Y2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverY2', '@Start');

        ev.preventDefault();
    }

    switchXandY() {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'switchXandY', '@Start');

        let newXField: string = this.xField;
        let newYField: string = this.yField;
        if (newXField == dragFieldMessage) {
            this.clickClearYField();
        } else {
            this.dropYField(null, newXField);
        };
        if (newYField == dragFieldMessage) {
            this.clickClearXFieldField();
        } else {
            this.dropXField(null, newYField);
        };
    }

    dropXField(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropXField', '@Start');

        // Set
        if (fieldName == '') {
            fieldName = this.draggedField;
        };
        if (ev != null) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            var data = ev.dataTransfer.getData("text");
        };

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = fieldName.indexOf(' X Y C');
        fieldName = fieldName.substring(0, postion != -1 ? postion : fieldName.length)

        let dataSchemaIndex: number = this.dataSchema.findIndex(
            dsc => dsc.name == fieldName
        );

        // Show X icon
        this.showXDeleteIcon = true;

        // Show the panel with X properties
        this.showFieldXPropertiesTitle = true;

        this.xField = fieldName;

        let fieldType:string = this.getFieldType(fieldName);
        this.localWidget.graphXtype = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphXtypeName = this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphXtimeUnit ='';

    }

    dropYField(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped in Y field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropYField', '@Start');

        // Set
        if (fieldName == '') {
            fieldName = this.draggedField;
        };
        if (ev != null) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            var data = ev.dataTransfer.getData("text");
        };

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = fieldName.indexOf(' X Y C');
        fieldName = fieldName.substring(0, postion != -1 ? postion : fieldName.length)

        // Show X icon
        this.showYDeleteIcon = true;

        // Show the panel with Y properties
        this.showFieldYPropertiesTitle = true;

        this.yField = fieldName;
        // this.localWidget.graphYfield = fieldName;
        this.localWidget.graphYaxisTitle = fieldName;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(fieldName);
        this.localWidget.graphYtype = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphYtypeName = this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphYtimeUnit ='';
    }

    dropColour(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColour', '@Start');

        // Set
        if (fieldName == '') {
            fieldName = this.draggedField;
        };
        if (ev != null) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            var data = ev.dataTransfer.getData("text");
        };

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = fieldName.indexOf(' X Y C');
        fieldName = fieldName.substring(0, postion != -1 ? postion : fieldName.length)

        // Show X icon
        this.showColourDeleteIcon = true;

        // Show the panel with X properties
        this.showFieldColorPropertiesTitle = true;

        // ev.preventDefault();
        // ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM
        // var data = ev.dataTransfer.getData("text");
        this.colorField = fieldName;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(fieldName);
        this.localWidget.graphColorType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphColorTypeName = this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphColorTimeUnit ='';
        this.localWidget.graphDimensionRight = 140;
    }

    dropSize(ev) {
        // Event trigger when the dragged Field is dropped the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropSize', '@Start');

        // Show X icon
        this.showSizeDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.sizeField = this.draggedField;
        this.isDragoverSizes = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = this.sizeField.indexOf(' X Y C');
        this.sizeField = this.sizeField.substring(0, postion != -1 ? postion : this.sizeField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphSizeType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphSizeTypeName = this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphDimensionRight = 140;
    }

    dropRow(ev) {
        // Event trigger when the dragged Field is dropped the Row channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropRow', '@Start');

        // Show X icon
        this.showRowDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.rowField = this.draggedField;
        this.isDragoverRow = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = this.rowField.indexOf(' X Y C');
        this.rowField = this.rowField.substring(0, postion != -1 ? postion : this.rowField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphRowType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphRowTypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    dropColumn(ev) {
        // Event trigger when the dragged Field is dropped the Column channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');

        // Show X icon
        this.showColumnDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.columnField = this.draggedField;
        this.isDragoverColumn = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = this.columnField.indexOf(' X Y C');
        this.columnField = this.columnField.substring(0, postion != -1 ? postion : this.columnField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphColumnType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphColumnTypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    dropDetail(ev) {
        // Event trigger when the dragged Field is dropped the Detail channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropDetail', '@Start');

        // Show X icon
        this.showDetailDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.detailField = this.draggedField;
        this.isDragoverDetail = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = this.detailField.indexOf(' X Y C');
        this.detailField = this.detailField.substring(0, postion != -1 ? postion : this.detailField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphDetailType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphDetailTypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    dropX2(ev) {
        // Event trigger when the dragged Field is dropped the X2 channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropX2', '@Start');

        // Show X icon
        this.showX2DeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.x2Field = this.draggedField;
        this.isDragoverX2 = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = this.x2Field.indexOf(' X Y C');
        this.x2Field = this.x2Field.substring(0, postion != -1 ? postion : this.x2Field.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphX2Type = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphX2TypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    dropY2(ev) {
        // Event trigger when the dragged Field is dropped the Y2 channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropY2', '@Start');

        // Show X icon
        this.showY2DeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.y2Field = this.draggedField;
        this.isDragoverY2 = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let postion: number = this.y2Field.indexOf(' X Y C');
        this.y2Field = this.y2Field.substring(0, postion != -1 ? postion : this.y2Field.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphY2Type = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphY2TypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    clickClearXFieldField() {
        // Clear the X Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearXFieldField', '@Start');

        // Reset fields
        this.showXDeleteIcon = false;
        this.xField = dragFieldMessage;
        this.localWidget.graphXfield = '';

        this.localWidget.graphXaggregateName = '';
        this.localWidget.graphXaggregate = '';
        this.localWidget.graphXbin = false;
        this.localWidget.graphXMaxBins = 0;
        this.localWidget.graphXformat = '';
        this.localWidget.graphXimpute = '';
        this.localWidget.graphXimputeValue = '';
        this.localWidget.graphXstack = '';
        this.localWidget.graphXsort = '';
        this.localWidget.graphXtypeName = '';
        this.localWidget.graphXtimeUnit = '';

        // Hide the panel with properties
        this.showFieldXPropertiesTitle = false;
        this.showFieldXProperties = false;
        this.showFieldXAxis = false;
    }

    clickClearYField() {
        // Clear the Y Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearYField', '@Start');

        this.showYDeleteIcon = false;
        this.yField = dragFieldMessage;
        this.localWidget.graphYfield = '';

        this.localWidget.graphYaggregateName = '';
        this.localWidget.graphYaggregate = '';
        this.localWidget.graphYbin = false;
        this.localWidget.graphYMaxBins = 0;
        this.localWidget.graphYformat = '';
        this.localWidget.graphYimpute = '';
        this.localWidget.graphYimputeValue = '';
        this.localWidget.graphYstack = '';
        this.localWidget.graphYsort = '';
        this.localWidget.graphYtypeName = '';
        this.localWidget.graphYtimeUnit = '';

        // Hide the panel with properties
        this.showFieldYPropertiesTitle = false;
        this.showFieldYProperties = false;
        this.showFieldYAxis = false;
    }

    clickClearColourField() {
        // Clear the Colour Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColourField', '@Start');

        this.localWidget.graphColorAggregateName = '';
        this.localWidget.graphColorAggregate = '';
        this.localWidget.graphColorBin = false;
        this.localWidget.graphColorMaxBins = 0;
        this.localWidget.graphColorFormat = '';
        this.localWidget.graphColorImpute = '';
        this.localWidget.graphColorImputeValue = '';
        this.localWidget.graphColorStack = '';
        this.localWidget.graphColorSort = '';
        this.localWidget.graphColorTypeName = '';
        this.localWidget.graphColorTimeUnit = '';

        this.showColourDeleteIcon = false;
        this.colorField = dragFieldMessage;
        this.localWidget.graphColorField = '';

        
        // Hide the panel with properties
        this.showFieldColorPropertiesTitle = false;
        this.showFieldColorProperties = false;
        this.showFieldLegend = false;

        if (this.localWidget.graphColorField == ''  &&  this.localWidget.graphSizeField == '') {
            this.localWidget.graphDimensionRight = 0;
        };

    }

    clickClearSizeField() {
        // Clear the Size Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearSizeField', '@Start');

        this.showSizeDeleteIcon = false;
        this.sizeField = dragFieldMessage;
        this.localWidget.graphSizeField = '';

        this.localWidget.graphSizeAggregateName = '';
        this.localWidget.graphSizeAggregate = '';
        this.localWidget.graphSizeBin = false;
        this.localWidget.graphSizeMaxBins = 0;

        // Hide the panel with properties
        this.showFieldSizeProperties = false;

    }

    clickClearRowField() {
        // Clear the Row Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearRowField', '@Start');

        this.showRowDeleteIcon = false;
        this.rowField = dragFieldMessage;
        this.localWidget.graphRowField = '';

        // Hide the panel with properties
        this.showFieldRowProperties = false;

    }

    clickClearColumnField() {
        // Clear the Column Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColumnField', '@Start');

        this.showColumnDeleteIcon = false;
        this.columnField = dragFieldMessage;
        this.localWidget.graphColumnField = '';

        // Hide the panel with properties
        this.showFieldColumnProperties = false;

    }

    clickClearDetailField() {
        // Clear the Detail Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearDetailField', '@Start');

        this.showDetailDeleteIcon = false;
        this.detailField = dragFieldMessage;
        this.localWidget.graphDetailField = '';

        // Hide the panel with properties
        this.showFieldDetailProperties = false;

    }

    clickClearX2Field() {
        // Clear the X2 Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearX2Field', '@Start');

        this.showX2DeleteIcon = false;
        this.x2Field = dragFieldMessage;
        this.localWidget.graphX2Field = '';

        // Hide the panel with properties
        this.showFieldX2Properties = false;

    }

    clickClearY2Field() {
        // Clear the Y2 Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearY2Field', '@Start');

        this.showY2DeleteIcon = false;
        this.y2Field = dragFieldMessage;
        this.localWidget.graphY2Field = '';

        // Hide the panel with properties
        this.showFieldY2Properties = false;

    }

    dragenterXField(ev, actionName: string) {
        // Event trigger when dragged field enters XField
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterXField', '@Start');

        ev.preventDefault();
        this.isDragoverXField = true;
        this.isDragoverYField = false;
        this.dragoverColours = false;
    }

    dragenterYField(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterYField', '@Start');

        ev.preventDefault();
        this.isDragoverXField = false;
        this.isDragoverYField = true;
        this.dragoverColours = false;
    }

    dragenterColour(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColour', '@Start');

        ev.preventDefault();
        this.isDragoverXField = false;
        this.isDragoverYField = false;
        this.dragoverColours = true;
    }

    dragenterSize(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterSize', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverSizes = true;
        // this.dragoverColours = false;
    }

    dragenterRow(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterRow', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverRow = true;
        // this.dragoverColours = false;
    }

    dragenterColumn(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColumn', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverColumn = true;
        // this.dragoverColours = false;
    }

    dragenterDetail(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Detail field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterDetail', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverDetail = true;
        // this.dragoverColours = false;
    }

    dragenterX2(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the X2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterX2', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverX2 = true;
        // this.dragoverColours = false;
    }

    dragenterY2(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Y2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterY2', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverY2 = true;
        // this.dragoverColours = false;
    }

    dragleaveXField(ev, actionName: string) {
        // Event trigger when dragged field leave XField
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveXField', '@Start');

        ev.preventDefault();
        this.isDragoverXField = false;
    }

    dragleaveYField(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveYField', '@Start');

        ev.preventDefault();
        this.isDragoverYField = false;
    }

    dragleaveColour(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColour', '@Start');

        ev.preventDefault();
        this.dragoverColours = false;
    }

    dragleaveSize(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveSize', '@Start');

        ev.preventDefault();
        this.isDragoverSizes = false;
    }

    dragleaveRow(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveRow', '@Start');

        ev.preventDefault();
        this.isDragoverRow = false;
    }

    dragleaveColumn(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColumn', '@Start');

        ev.preventDefault();
        this.isDragoverColumn = false;
    }

    dragleaveDetail(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Detail field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveDetail', '@Start');

        ev.preventDefault();
        this.isDragoverDetail = false;
    }

    dragleaveX2(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the X2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveX2', '@Start');

        ev.preventDefault();
        this.isDragoverX2 = false;
    }

    dragleaveY2(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Y2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveY2', '@Start');

        ev.preventDefault();
        this.isDragoverY2 = false;
    }

    clickDatasource(index: number, name: string) {
        // Show dropdown of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // TODO - remove later if not used any longer
    }

    clickDSrow(index, datasourceID: number) {
        // Set the selected datasourceID
        // NOTE: this array can be filtered on front-end, thus DON'T use index
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        // Reset, Highlight selected row
        this.selectedRowIndex = index;
        let arrayIndex: number = this.localDatasources.findIndex(ds => ds.id == datasourceID);
        this.selectedRowID = datasourceID;
        this.selectedDSName = this.localDatasources[arrayIndex].name.slice(0,22) + 
            (this.localDatasources[arrayIndex].name.length > 22?  '...'  :  '');
        this.selectedDescription = this.localDatasources[arrayIndex].description;
        this.errorMessage = '';
        this.currentData = null;

        // Clear previous selected fields
        this.showXDeleteIcon = false;
        this.xField = dragFieldMessage;

        this.showYDeleteIcon = false;
        this.yField = dragFieldMessage;

        this.showColourDeleteIcon = false;
        this.colorField = dragFieldMessage;

        this.showSizeDeleteIcon = false;
        this.sizeField = dragFieldMessage;

        this.showRowDeleteIcon = false;
        this.rowField = dragFieldMessage;

        this.showColumnDeleteIcon = false;
        this.columnField = dragFieldMessage;

        this.showDetailDeleteIcon = false;
        this.detailField = dragFieldMessage;

        // Determine if data already in Glob Var
        let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
            ds => ds.datasourceID == datasourceID
        );
        if (dataSetIndex >= 0) {

            // Load local arrays for ngFor
            this.constructDataSchema(arrayIndex);

            // Load first few rows into preview
            this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                .data.slice(0,5);

            // Switch on the preview after the first row was clicked
            this.showPreview = true;

            return;
        };

        // Add DS to current DS (no action if already there)
        this.globalVariableService.addCurrentDatasource(datasourceID).then(res => {

            // Load local arrays for ngFor
            this.constructDataSchema(arrayIndex);

            // Determine if data obtains in Glob Var
            dataSetIndex = this.globalVariableService.currentDatasets.findIndex(
                ds => ds.datasourceID == datasourceID
            );
            if (dataSetIndex < 0) {
                this.errorMessage = 'Error! The Data does not exist in currentDatasets array';
                return;
            };

            // Nr rows
            this.nrRows = this.globalVariableService.currentDatasets[dataSetIndex].data.length;

            // Load first few rows into preview
            this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                .data.slice(0,5);

            // Switch on the preview after the first row was clicked
            this.showPreview = true;

        });
    }

    clickContinue(){
        // Continue to design / edit the W, and close the form for the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

        // Determine if data obtains in Glob Var
        let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
            ds => ds.datasourceID == this.selectedRowID
        );
        if (dataSetIndex < 0) {
            this.errorMessage = 'Error! The Data does not exist in currentDatasets array';
            return;
        };

        // Remember ID for next time
        this.globalVariableService.previousGraphEditDSID = this.selectedRowID;

        // Fill in data info
        this.localWidget.datasourceID = this.selectedRowID;
        this.localWidget.datasetID = this.globalVariableService.
            currentDatasets[dataSetIndex].id;
        this.localWidget.graphData = this.globalVariableService
            .currentDatasets[dataSetIndex].data;

        // Show the Editor form
        this.showDatasourceMain = false;

    }

    setGraphTypeFieldY(graphYtype: string) {
        // Set the Vega field type of the Y axis
        // TODO - fix event in HTML so that it is triggered here
        this.globalFunctionService.printToConsole(this.constructor.name,'setGraphTypeFieldY', '@Start');

        this.localWidget.graphYtype = graphYtype;
    }

    defaultGraphTypeField(fieldType: string, typeOrName: string): string {
        // Returns the default Vega field type depending a given field types
        this.globalFunctionService.printToConsole(this.constructor.name,'defaultGraphTypeField', '@Start');

        if (fieldType == 'string') {
            if (typeOrName == 'name') {
                return 'Ordinal';
            } else {
                return 'ordinal';
            };
        };
        if (fieldType.toLowerCase() == 'number') {
            if (typeOrName == 'name') {
                return 'Quantitative';
            } else {
                return 'quantitative';
            };
        };
        if (fieldType.toLowerCase() == 'boolean') {
            if (typeOrName == 'name') {
                return 'Nominal';
            } else {
                return 'nominal';
            };
        };
        if (fieldType.toLowerCase() == 'date') {
            if (typeOrName == 'name') {
                return 'Temporal';
            } else {
                return 'temporal';
            };
        };
    }

    getFieldType(fieldName: string): string {
        // Returns the field type of a given field name
        this.globalFunctionService.printToConsole(this.constructor.name,'getFieldType', '@Start');

        for (var i = 0; i < this.dataSchema.length; i++) {
            if (this.dataSchema[i].name == fieldName) {
                return this.dataSchema[i].type;
            }
        };

        // Was not found, defaults
        return 'string';
    }

    // TODO - do one or the other: 3 vars, or 1 combined object
    constructDataSchema(arrayIndex: number) {
        // Construct combined object for fields
        this.globalFunctionService.printToConsole(this.constructor.name,'constructDataSchema', '@Start');

        // Fill dataSchema
        this.dataSchema = [];

        if (arrayIndex >= 0) {
            for (let i = 0; i < this.localDatasources[arrayIndex].dataFields.length; i++) {
                let newDataSchema: dataSchemaInterface = {
                    name: this.localDatasources[arrayIndex].dataFields[i],
                    type: this.localDatasources[arrayIndex].dataFieldTypes[i],
                    typeName: this.localDatasources[arrayIndex].dataFieldTypes[i],
                    length: this.localDatasources[arrayIndex].dataFieldLengths[i],
                    isCalculated: false,
                    calculatedExpression: ''
                };
                this.dataSchema.push(newDataSchema);
            };
        };

    }

    clickShowDatasources() {
        // Show Datasources
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowDatasources', '@Start');

        this.showDatasourceMain = true;
    }

    clickShowXProperties() {
        // Show X Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowXProperties', '@Start');

        // Toggle
        this.showFieldXProperties = !this.showFieldXProperties;
    }

    clickShowColorProperties() {
        // Show Color Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColorProperties', '@Start');

        // Toggle
        this.showFieldColorProperties = !this.showFieldColorProperties;
    }

    clickShowMarkProperties() {
        // Show Mark Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowMarkProperties', '@Start');

        // Toggle
        this.showFieldMarkProperties = !this.showFieldMarkProperties;
    }

    clickShowDetailProperties() {
        // Show Detail Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowDetailProperties', '@Start');

        // Toggle
        this.showFieldDetailProperties = !this.showFieldDetailProperties;
    }

    clickShowX2Properties() {
        // Show X2 Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowX2Properties', '@Start');

        // Toggle
        this.showFieldX2Properties = !this.showFieldX2Properties;
    }

    clickShowY2Properties() {
        // Show Y2 Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowY2Properties', '@Start');

        // Toggle
        this.showFieldY2Properties = !this.showFieldY2Properties;
    }

    clickShowTitleProperties() {
        // Show Title Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowTitleProperties', '@Start');

        // Toggle
        this.showFieldTitleProperties = !this.showFieldTitleProperties;
    }

    clickShowYProperties() {
        // Show Y Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowYProperties', '@Start');

        // Toggle
        this.showFieldYProperties = !this.showFieldYProperties;
    }

    clickShowFilter() {
        // Show Filter Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFilter', '@Start');

        // Toggle
        this.showFieldFilter = !this.showFieldFilter;
    }

    clickShowSelection() {
        // Show Selection Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowSelection', '@Start');

        // Toggle
        this.showSelectionFilter = !this.showSelectionFilter;
    }

    clickShowXAxisProperties() {
        // Show X Axis Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowXAxisProperties', '@Start');

        // Toggle
        this.showFieldXAxis = !this.showFieldXAxis;
    }

    clickShowYAxisProperties() {
        // Show X Axis Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowYAxisProperties', '@Start');

        // Toggle
        this.showFieldYAxis = !this.showFieldYAxis;
    }

    clickShowLegendProperties() {
        // Show Legend Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowLegendProperties', '@Start');

        // Toggle
        this.showFieldLegend = !this.showFieldLegend;
    }

    clickShowSizeProperties() {
        // Show Size Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowSizeProperties', '@Start');

        // Toggle
        this.showFieldSizeProperties = !this.showFieldSizeProperties;
    }

    clickShowRowProperties() {
        // Show Row Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowRowProperties', '@Start');

        // Toggle
        this.showFieldRowProperties = !this.showFieldRowProperties;
    }

    clickShowColumnProperties() {
        // Show Column Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColumnProperties', '@Start');

        // Toggle
        this.showFieldColumnProperties = !this.showFieldColumnProperties;
    }

    clickSelectXGridColor(ev: any) {
        // Select Colour for X gridlines
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectXGridColor', '@Start');

        this.localWidget.graphXaxisGridColorName = ev.target.value;
        this.localWidget.graphXaxisGridColor = this.localWidget.graphXaxisGridColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphXaxisGridColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphXaxisGridColor = this.backgroundcolors[localIndex].cssCode;
        };
    }
    
    clickSelectXLabelColor(ev: any) {
        // Select Colour for X labels
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectXLabelColor', '@Start');

        this.localWidget.graphXaxisLabelColorName = ev.target.value;
        this.localWidget.graphXaxisLabelColor = this.localWidget.graphXaxisLabelColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphXaxisLabelColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphXaxisLabelColor = this.backgroundcolors[localIndex].cssCode;
        };
    }
    
    clickSelectYGridColor(ev: any) {
        // Select Colour for Y gridlines
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectYGridColor', '@Start');

        this.localWidget.graphYaxisGridColorName = ev.target.value;
        this.localWidget.graphYaxisGridColor = this.localWidget.graphYaxisGridColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphYaxisGridColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphYaxisGridColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectYLabelColor(ev: any) {
        // Select Colour for Y labels
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectYLabelColor', '@Start');

        this.localWidget.graphYaxisLabelColorName = ev.target.value;
        this.localWidget.graphYaxisLabelColor = this.localWidget.graphYaxisLabelColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphYaxisLabelColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphYaxisLabelColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectBackgroundColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBackgroundColor', '@Start');

        this.localWidget.graphBackgroundColorName = ev.target.value;
        this.localWidget.graphBackgroundColor = this.localWidget.graphBackgroundColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphBackgroundColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphBackgroundColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectTitleColor(ev: any) {
        // Select Title Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTitleColor', '@Start');

        this.localWidget.graphTitleColorName = ev.target.value;
        this.localWidget.graphTitleColor = this.localWidget.graphTitleColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphTitleColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphTitleColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectMarkColour(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTitleColor', '@Start');

        this.localWidget.graphMarkColourName = ev.target.value;
        this.localWidget.graphMarkColour = this.localWidget.graphMarkColourName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphMarkColourName
        );
        if (localIndex >= 0) {
            this.localWidget.graphMarkColour = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickXBin() {
        // Reset Size X Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickXBin', '@Start');

        if (this.localWidget.graphXbin) {
            this.localWidget.graphXMaxBins = 0;
        };
    }

    clickYBin() {
        // Reset Size Y Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickYBin', '@Start');

        if (this.localWidget.graphYbin) {
            this.localWidget.graphYMaxBins = 0;
        };
    }

    clickColorBin() {
        // Reset Size Color Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColorBin', '@Start');

        if (this.localWidget.graphColorBin) {
            this.localWidget.graphColorMaxBins = 0;
        };
    }

    clickSizeBin() {
        // Reset Size Bin Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSizeBin', '@Start');

        if (this.localWidget.graphSizeBin) {
            this.localWidget.graphSizeMaxBins = 0;
        };
    }

    clickXfield() {
        // Show the X field properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickXfield', '@Start');

        if (this.xField == dragFieldMessage  ||  this.xField == null) {
            return;
        };

        this.showFieldXProperties = !this.showFieldXProperties;
        this.showFieldYProperties = false;
        this.showFieldColorProperties = false;
    }

    clickYfield() {
        // Show the Y field properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickYfield', '@Start');

        if (this.yField == dragFieldMessage  ||  this.yField == null) {
            return;
        };

        this.showFieldXProperties = false;
        this.showFieldYProperties = !this.showFieldYProperties;
        this.showFieldColorProperties = false;
    }

    clickColorfield() {
        // Show the Color field properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColorfield', '@Start');

        if (this.colorField == dragFieldMessage  ||  this.colorField == null) {
            return;
        };

        this.showFieldXProperties = false;
        this.showFieldYProperties = false;
        this.showFieldColorProperties = !this.showFieldColorProperties;
    }

    changeXTimeUnit() {
        // Remove timeUnit if Type is not Temporal
        this.globalFunctionService.printToConsole(this.constructor.name,'changeXTimeUnit', '@Start');

        if (this.localWidget.graphXtype != 'Temporal') {
            this.localWidget.graphXtimeUnit = '';
        };
    }

    changeYTimeUnit() {
        // Remove timeUnit if Type is not Temporal
        this.globalFunctionService.printToConsole(this.constructor.name,'changeYTimeUnit', '@Start');

        if (this.localWidget.graphYtype != 'Temporal') {
            this.localWidget.graphYtimeUnit = '';
        };
    }

    changeColorTimeUnit() {
        // Remove timeUnit if Type is not Temporal
        this.globalFunctionService.printToConsole(this.constructor.name,'changeColorTimeUnit', '@Start');

        if (this.localWidget.graphColorType != 'Temporal') {
            this.localWidget.graphColorTimeUnit = '';
        };
    }

    clickShowFilterArea() {
        // Show Filter Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFilterArea', '@Start');

        // Reset
        this.filterErrorMessage = '';

        this.showFilterAreaProperties = !this.showFilterAreaProperties;
    }

    clickShowCalculatedArea() {
        // Show Calculated Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowCalculatedArea', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        this.showCalculatedAreaProperties = !this.showCalculatedAreaProperties;
    }

    calculatedFieldTypeSelected(ev) {
        // Register Calculated Field Type
        this.globalFunctionService.printToConsole(this.constructor.name,'calculatedFieldTypeSelected', '@Start');

        this.dataFieldTypeName = ev.target.value;
        this.dataFieldType = this.dataFieldTypeName.toLowerCase();
    }

    clickShowSpecificationArea() {
        // Toggle between Graph and Specification
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowSpecificationArea', '@Start');

        this.showSpecification = !this.showSpecification
        this.specificationJSON = JSON.stringify(this.specification);

        // Re-show current graph
        if (!this.showSpecification) {
            // this.showGraph(this.currentGraphID);
        };

    }

    clickFilterClose() {
        // Close the Filter Area, with no changes to the filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterClose', '@Start');

        // Reset
        this.filterErrorMessage = '';

        this.showFilterAreaProperties = false;
    }

    clickFilterClear() {
        // Clear the Filter Area, and reset filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterClear', '@Start');

        // Reset
        this.filterErrorMessage = '';

        // Remove from localWidget
        let transformationIndex: number = this.localWidget.graphTransformations.findIndex(ftr =>
            ftr.transformationType == 'filter'  &&  ftr.underlyingFieldName == this.filterField);
        if (transformationIndex >= 0) {
            this.localWidget.graphTransformations.splice(transformationIndex, 1);
        };

        this.filterField = '';
        this.filterOperator = '';
        this.filterValue = '';

        this.showFilterAreaProperties = false;
    }

    clickFilterApply() {
        // Close the Filter Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterApply', '@Start');

        // Reset
        this.filterErrorMessage = '';

        // Validation
        if (this.filterField == ''  ||  this.filterField == undefined) {
            this.filterErrorMessage = 'Filter field is required.';
            return;
        };
        if (this.filterOperator == ''  ||  this.filterOperator == undefined) {
            this.filterErrorMessage = 'Filter Operator is required.';
            return;
        };
        if (this.filterOperator != 'Valid') {
            if (this.filterValue == ''  ||  this.filterValue == undefined) {
                this.filterErrorMessage = 'Filter Value is required.';
                return;
            };
        };

        // TODO - make 2 drop down fields where 2 parameters
        if (this.filterOperator == 'Range') {
            this.filterValue.replace(', ', ',');
            console.warn('xx this.filterValue', this.filterValue);
            
        };

        // Update the localWidget
        let graphTransformationSpec: GraphTransformation = {
            transformationType: "filter",
            underlyingFieldName: this.filterField,
            filterOperator: this.filterOperator,
            filterValue: this.filterValue,
            sampleRows: 0,
            calculatedExpression: "",
            calculateAs: "",
            selectionName: ""
        };

        // Add / Update to localWidget
        let transformationIndex: number = this.localWidget.graphTransformations.findIndex(ftr =>
            ftr.transformationType == 'filter'  &&  ftr.underlyingFieldName == this.filterField);
        if (transformationIndex >= 0) {
            this.localWidget.graphTransformations[transformationIndex].filterOperator = 
                this.filterOperator;
            this.localWidget.graphTransformations[transformationIndex].filterValue = 
                this.filterValue;
        } else {
            this.localWidget.graphTransformations.push(graphTransformationSpec);
        };

        // Hide filter form
        this.showFilterAreaProperties = false;
    }

    filterFieldSelected(ev) {
        // Selected a Filter Field
        this.globalFunctionService.printToConsole(this.constructor.name,'filterFieldSelected', '@Start');

        this.filterField = ev.target.value;
    }

    filterOperatorSelected(ev) {
        // Selected a Filter Operator
        this.globalFunctionService.printToConsole(this.constructor.name,'filterOperatorSelected', '@Start');

        this.filterOperator = ev.target.value;
    }

    clickCalculatedClose() {
        // Close the Calculated Area, and reset calculation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCalculatedClose', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        this.showCalculatedAreaProperties = false;
    }

    clickCalculatedClear() {
        // Close the Calculated Area, and reset calculation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCalculatedClear', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        // Remove from other places
        if (this.xField == this.calculatedAs) {
            this.clickClearXFieldField();
        };
        if (this.yField == this.calculatedAs) {
            this.clickClearYField();
        };
        if (this.colorField == this.calculatedAs) {
            this.clickClearColourField();
        };
        if (this.detailField == this.calculatedAs) {
            this.clickClearDetailField;
        };
        if (this.rowField == this.calculatedAs) {
            this.clickClearRowField();
        };
        if (this.columnField == this.calculatedAs) {
            this.clickClearColumnField();
        };
        if (this.x2Field == this.calculatedAs) {
            this.clickClearX2Field;
        };
        if (this.y2Field == this.calculatedAs) {
            this.clickClearY2Field();
        };

        // Remove from localWidget
        let transformationIndex: number = this.localWidget.graphTransformations.findIndex(ftr =>
            ftr.transformationType == 'calculate'  &&  ftr.calculateAs == this.calculatedAs);
        if (transformationIndex >= 0) {
            this.localWidget.graphTransformations.splice(transformationIndex, 1);
        };

        // Remove from local var
        let schemaIndex: number = this.dataSchema.findIndex(ds => ds.name == this.calculatedAs);
        if (schemaIndex >= 0) {
            this.dataSchema.splice(schemaIndex, 1);
        };

        // Reset values
        this.calculatedExpression = '';
        this.calculatedAs = '';
        this.dataFieldType = '';
        this.dataFieldTypeName = '';

        this.showCalculatedAreaProperties = false;
    }

    clickCalculatedApply() {
        // Close the Calculated Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCalculatedApply', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        // Validation
        if (this.calculatedExpression == ''  ||  this.calculatedExpression == undefined) {
            this.calculatedErrorMessage = 'Expression is required.';
            return;
        };
        if (this.calculatedAs == ''  ||  this.calculatedAs == undefined) {
            this.calculatedErrorMessage = 'New field name (As) is required.';
            return;
        };
        if (this.dataFieldType == ''  ||  this.dataFieldType == undefined) {
            this.calculatedErrorMessage = 'Field data type is required.';
            return;
        };

        // Add Calculated field to Field List
        let schemaIndex: number = this.dataSchema.findIndex(ds => ds.name == this.calculatedAs);
        if (schemaIndex >= 0) {
            this.dataSchema[schemaIndex].type = this.dataFieldType;
            this.dataSchema[schemaIndex].typeName = this.dataFieldTypeName;
            this.dataSchema[schemaIndex].calculatedExpression = this.calculatedExpression;
        } else {
            let newDataSchema: dataSchemaInterface = {
                name: this.calculatedAs,
                type: this.dataFieldType.toLowerCase(),
                typeName: this.dataFieldTypeName,
                length: 12,
                isCalculated: true,
                calculatedExpression: this.calculatedExpression
            };
            this.dataSchema.push(newDataSchema);
        };

        // Update the localWidget
        let graphTransformationSpec: GraphTransformation = {
            transformationType: "calculate",
            underlyingFieldName: "",
            filterOperator: "",
            filterValue: "",
            sampleRows: 0,
            calculatedExpression: this.calculatedExpression,
            calculateAs: this.calculatedAs,
            selectionName: ""
        };

        // Add / Update to localWidget
        let transformationIndex: number = this.localWidget.graphTransformations.findIndex(ftr =>
            ftr.transformationType == 'calculate'  &&  ftr.calculateAs == this.calculatedAs);
        if (transformationIndex >= 0) {
            this.localWidget.graphTransformations[transformationIndex].calculatedExpression = 
                this.calculatedExpression;
            this.localWidget.graphTransformations[transformationIndex].calculateAs = 
                this.calculatedAs;
        } else {
            this.localWidget.graphTransformations.push(graphTransformationSpec);
        };

        this.showCalculatedAreaProperties = false;

    }

    dblClickFieldRow(formCalculatedFieldName: string) {
        // Double clicked a field row: show info for calculated field
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickFieldRow', '@Start');

        let schemaIndex: number = this.dataSchema.findIndex(ds => ds.name == formCalculatedFieldName);
        if (schemaIndex >= 0) {
            if (this.dataSchema[schemaIndex].isCalculated) {
                this.calculatedExpression = this.dataSchema[schemaIndex].calculatedExpression;
                this.calculatedAs = this.dataSchema[schemaIndex].name;
                this.dataFieldType = this.dataSchema[schemaIndex].type;
                this.dataFieldTypeName = this.dataSchema[schemaIndex].typeName;
                this.showCalculatedAreaProperties = true;
            };
        };
    }

}