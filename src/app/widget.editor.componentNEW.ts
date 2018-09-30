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
import { Widget }                     from './models';
import { WidgetLayout }               from './models';
import { WidgetCheckpoint }           from './models';
import { WidgetGraph }                from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

const graphHeight: number = 260;
const graphWidth: number = 420;

export interface dataSchemaInterface {
    name: string;
    type: string;
    length: number
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
                this.clickSave('Saved');
                return;
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
    colField: string = 'Drag a field here ...';
    containerHasContextMenus: boolean = true;
    containerHasTitle: boolean = true;
    currentData: any = [];
    currentGraphComposition: string = 'Single';
    currentGraphLayer: number = 1;
    dataSchema: dataSchemaInterface[] = [];
    dataFieldNames: string[] = [];
    dataFieldLengths: number[] = [];
    dataFieldTypes: string[] = [];
    draggedField: string = '';
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverColours: boolean = false;
    dragoverSizes: boolean = false;
    errorMessage: string = '';
    graphColorField: string = 'Drag a field here ...';
    graphSizeField: string = 'Drag a field here ...';
    graphColor: string[];
    graphLayers: number[] = [1, 2, 3,];  // TODO - fix hardcoding
    graphTypeFieldY: string[] =[];
    graphTypeFieldX: string[] =[];
    graphTypeFieldColor: string[] =[];
    isBusyRetrievingData: boolean = false;
    localDatasources: Datasource[] = null;          // Current DS for the selected W
    localWidget: Widget;                            // W to modify, copied from selected
    oldWidget: Widget = null;                       // W at start
    rowField: string = 'Drag a field here ...';
    selectedDescription: string = '';
    selectedFieldIndex: number = -1;
    selectedRowIndex: number = -1;
    selectedRowID: number;

    sizeType: string = '';
    sizeAggregate: string = '';
    sizeBin: string = 'False';

    showColourDeleteIcon: boolean = false;
    showColumnDeleteIcon: boolean = false;
    showSizeDeleteIcon: boolean = false;
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

    // showFieldSizePropertiesTitle: boolean = false;
    showFieldSize: boolean = false;

    showFieldLegend: boolean = false;
    showFieldColorProperties: boolean = false;
    showFieldColorPropertiesInfo: boolean = false;
    showFieldColorPropertiesTitle: boolean = false;

    showFieldFilter: boolean = false;
    showSelectionFilter: boolean = false;

    showPreview: boolean = false;
    showRowDeleteIcon: boolean = false;
    showType: boolean = false;
    sortOrder: number = 1;
    titleText: string = '';
    titleAnchor: string = 'Middle';
    titleAngle: number = 0;
    titleBaseline: string = 'Bottom';
    titleColorName: string = 'Gray';
    titleColor: string = 'gray';
    titleFont: string = '';
    titleFontSize: number = 10;
    titleFontWeight: number = 400;
    titleLength: number = 0;
    titleOrientation: string = 'Top';

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

    xPropertiesAggregate: string = '';
    xPropertiesAggregateVegaLiteName: string = '';
    xPropertiesBin: string = 'False';
    xPropertiesFormat: string = '';
    xPropertiesImpute: string = '';
    xPropertiesImputeValue: number = 0;
    xPropertiesStack: string = '';
    xPropertiesSort: string = '';
    xPropertiesType: string = '';
    xPropertiesTimeUnit: string = '';

    xAxisTitle: string = '';
    xAxisTitleCheckbox: boolean = true;
    xAxisGrid: boolean = true;
    xAxisFormat: string = '';
    xAxisLabels: boolean = true;
    xAxisLabelAngle: number = 0;

    yPropertiesAggregate: string = '';
    yPropertiesAggregateVegaLiteName: string = '';
    yPropertiesBin: string = 'False';
    yPropertiesFormat: string = '';
    yPropertiesImpute: string = '';
    yPropertiesImputeValue: number = 0;
    yPropertiesSort: string = '';
    yPropertiesStack: string = '';
    yPropertiesType: string = '';
    yPropertiesTimeUnit: string = '';

    yAxisScaleType: string = 'Default';

    yAxisTitle: string = '';
    yAxisTitleCheckbox: boolean = true;
    yAxisGrid: boolean = true;
    yAxisFormat: string = '';
    yAxisLabels: boolean = true;
    yAxisLabelAngle: number = 0;

    colorPropertiesAggregate: string = '';
    colorPropertiesAggregateVegaLiteName: string = '';
    colorPropertiesBin: string = 'False';
    colorPropertiesFormat: string = '';
    colorPropertiesImpute: string = '';
    colorPropertiesImputeValue: number = 0;
    colorPropertiesScheme: string = '';
    colorPropertiesSort: string = 'Default';
    colorPropertiesStack: string = '';
    colorPropertiesType: string = '';
    colorPropertiesTimeUnit: string = '';

    legendTitle: string = '';
    legendTitleCheckbox: boolean = true;
    legendFormat: string = '';

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

        // Get Widget Graph Specs
        this.globalVariableService.getWidgetGraphs().then(res => {
            this.widgetGraphs = res
        });

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

            // Start afresh for new W
        if (this.newWidget) {

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
        } else {

            // Deep copy original W
            this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Deep copy Local W
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // TODO - handle properly and close form
            if (this.localWidget.datasourceID == 0) {
                alert('No Widget was selected, or could not find it in glob vars.  In: ngOnInit, ELSE +- line 170 inside WidgetEditor.ts')
            };

            // Add Fields to selection areas
            if (this.localWidget.graphXfield != ''   &&   this.localWidget.graphXfield != null) {
                this.showColumnDeleteIcon = true;
                this.colField = this.localWidget.graphXfield;

            } else {
                this.showColumnDeleteIcon = false;
                this.colField = 'Drag a field here ...';
            };

            if (this.localWidget.graphYfield != ''   &&   this.localWidget.graphYfield != null) {
                this.showRowDeleteIcon = true;
                this.rowField = this.localWidget.graphYfield;
            } else {
                this.showRowDeleteIcon = false;
                this.rowField = 'Drag a field here ...';
            };

            if (this.localWidget.graphColorField != ''   &&   this.localWidget.graphColorField != null) {
                this.showColourDeleteIcon = true;
                this.graphColorField = this.localWidget.graphColorField;
            } else {
                this.showColourDeleteIcon = false;
                this.graphColorField = 'Drag a field here ...';
            };

            // TODO - load from DB
            this.graphSizeField = 'Drag a field here ...';
            this.showSizeDeleteIcon = false;

            // Get local vars - easier for ngFor
            this.containerHasContextMenus = this.localWidget.containerHasContextMenus;
            this.containerHasTitle = this.localWidget.containerHasTitle;

            let arrayIndex: number = this.localDatasources.findIndex(
                ds => ds.id == this.localWidget.datasourceID);
            if (arrayIndex < 0) {
                alert('Datasource for current Dashboard not found in global currentDatasources')
            };
            this.dataFieldNames = this.localDatasources[arrayIndex].dataFields;
            this.dataFieldLengths = this.localDatasources[arrayIndex].dataFieldLengths;
            this.dataFieldTypes = this.localDatasources[arrayIndex].dataFieldTypes;

            this.constructDataSchema();
        }

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

    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        // Render if Editing an existing one
        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        if (!this.newWidget) {
            this.renderGraph(definition);
        }
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    showGraph(graphID: number) {
        // Render the graph on the form.  NOTE: each graph has its own spec and rendering
        // rules.
        this.globalFunctionService.printToConsole(this.constructor.name,'showGraph', '@Start');

        // Get the Vega-Lite aggregation
        this.xPropertiesAggregateVegaLiteName = '';
        if (this.xPropertiesAggregate != '') {
            let aggregationIndex: number = this.aggregations.findIndex(
                agg => agg.displayName == this.xPropertiesAggregate);
            if (aggregationIndex >= 0) {
                this.xPropertiesAggregateVegaLiteName = this.aggregations[aggregationIndex]
                    .vegaLiteName;
            };
        }
        this.yPropertiesAggregateVegaLiteName = '';
        if (this.yPropertiesAggregate != '') {
            let aggregationIndex: number = this.aggregations.findIndex(
                agg => agg.displayName == this.yPropertiesAggregate);
            if (aggregationIndex >= 0) {
                this.yPropertiesAggregateVegaLiteName = this.aggregations[aggregationIndex]
                    .vegaLiteName;
            };
        }

        // Get the widgetGraph
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.id == graphID);
        if (widgetGraphIndex < 0) {
            this.errorMessage = 'Graph type id = ' + graphID + ' does not exist in the DB';
            return;
        }

        console.warn('xx this.localWidget', this.localWidget);

        // Startup
        let width: number = 400;
        let height: number = 260;
        let specification;              // Vega-Lite, Vega, or other grammar
        let graphVisualGrammar: string = this.widgetGraphs[widgetGraphIndex].visualGrammar;
        let graphShortName: string = this.widgetGraphs[widgetGraphIndex].shortName;

        // Create and parameter fill each defintion
        if (graphID == 1  &&  graphShortName =='Simple Bar Chart') {

            // Enhance W properties
            this.localWidget.graphMark = 'bar';
            this.localWidget.graphTitle = this.titleText;

            // Defaults
            if (this.xPropertiesType == '') {
                this.xPropertiesType = 'ordinal';
            };

            // Define Specification
            specification = this.widgetGraphs[widgetGraphIndex].specification;
            specification['title']['text'] = this.titleText;
            specification['title']['anchor'] = this.titleAnchor.toLowerCase();
            specification['title']['angle'] = this.titleAngle;
            specification['title']['baseline'] = this.titleBaseline.toLowerCase();
            specification['title']['color'] = this.titleColor;
            specification['title']['font'] = this.titleFont;
            specification['title']['fontSize'] = this.titleFontSize;
            specification['title']['fontWeight'] = this.titleFontWeight;
            specification['title']['limit'] = this.titleLength;
            specification['title']['orient'] = this.titleOrientation.toLowerCase();

            if (this.localWidget.graphUrl != ""  &&  this.localWidget.graphUrl != null) {
                specification['data'] = {"url": this.localWidget.graphUrl};
            } else {
                specification['data'] = {"values": this.localWidget.graphData};
            }
            specification['description'] = this.localWidget.graphDescription;
            specification['width'] = width;
            specification['height'] = height;

            // Mark
            // specification['mark']['type'] = this.localWidget.graphMark;

            // X field
            specification['encoding']['x']['field'] = this.localWidget.graphXfield;
            specification['encoding']['x']['aggregate'] = this.xPropertiesAggregateVegaLiteName.toLowerCase();
            if (this.xPropertiesBin == 'True') {
                specification['encoding']['x']['bin'] = true;
            } else {
                specification['encoding']['x']['bin'] = false;
            };
            specification['encoding']['x']['format'] = this.xPropertiesFormat.toLowerCase();
            if (this.xPropertiesImpute != '') {
                if (this.xPropertiesImpute == 'Value') {
                    specification['encoding']['x']['impute'] =
                        {"value": this.xPropertiesImputeValue };
                } else {
                    specification['encoding']['x']['impute'] =
                        {"method": " this.xPropertiesImpute "};
                };
            };
            specification['encoding']['x']['stack'] = this.xPropertiesStack;
            specification['encoding']['x']['sort'] = this.xPropertiesSort.toLowerCase();
            // specification['encoding']['x']['type'] = this.localWidget.graphXtype;
            specification['encoding']['x']['type'] = this.xPropertiesType.toLowerCase();
            specification['encoding']['x']['timeUnit'] = this.xPropertiesTimeUnit.toLowerCase();

            specification['encoding']['x']['axis'] = {"grid": this.xAxisGrid };
            specification['encoding']['x']['axis']['labels'] = this.xAxisLabels;
            if (this.xAxisLabelAngle != 0){
                specification['encoding']['x']['axis']['labelAngle'] = this.xAxisLabelAngle;
            };

            if (!this.xAxisTitleCheckbox) {
                specification['encoding']['x']['axis']['title'] = null;
            } else {
                if (this.xAxisTitle != ''  &&  this.xAxisTitle != undefined) {
                    specification['encoding']['x']['axis']['title'] = this.xAxisTitle;
                };
            };

            if (this.xAxisFormat != '') {
                specification['encoding']['x']['axis']['format'] =  this.xAxisFormat;
            };


            // Y field
            specification['encoding']['y']['field'] = this.localWidget.graphYfield;
            specification['encoding']['y']['aggregate'] = this.yPropertiesAggregateVegaLiteName.toLowerCase();
            if (this.yPropertiesBin == 'True') {
                specification['encoding']['y']['bin'] = true;
            } else {
                specification['encoding']['y']['bin'] = false;
            };
            specification['encoding']['y']['format'] = this.yPropertiesFormat.toLowerCase();
            if (this.yPropertiesImpute != '') {
                if (this.yPropertiesImpute == 'Value') {
                    specification['encoding']['y']['impute'] =
                        {"value": this.yPropertiesImputeValue };
                } else {
                    specification['encoding']['y']['impute'] =
                        {"method": this.yPropertiesImpute };
                };
            };
            specification['encoding']['y']['stack'] = this.yPropertiesStack;
            specification['encoding']['y']['sort'] = this.yPropertiesSort.toLowerCase();
            // specification['encoding']['y']['type'] = this.localWidget.graphYtype;
            specification['encoding']['y']['type'] = this.yPropertiesType.toLowerCase();
            specification['encoding']['y']['timeUnit'] = this.yPropertiesTimeUnit.toLowerCase();

            if (this.yAxisScaleType != 'Default') {
                specification['encoding']['y']['scale'] =
                {"type": this.yAxisScaleType.toLowerCase() };
            };

            specification['encoding']['y']['axis'] = {"grid": this.yAxisGrid };
            specification['encoding']['y']['axis']['labels'] = this.yAxisLabels;
            if (this.yAxisLabelAngle != 0){
                specification['encoding']['y']['axis']['labelAngle'] = this.yAxisLabelAngle;
            };

            if (!this.yAxisTitleCheckbox) {
                specification['encoding']['y']['axis']['title'] = null;
            } else {
                if (this.yAxisTitle != ''  &&  this.yAxisTitle != undefined) {
                    specification['encoding']['y']['axis']['title'] = this.yAxisTitle;
                };
            };

            if (this.yAxisFormat != '') {
                specification['encoding']['y']['axis']['format'] =  this.yAxisFormat;
            };


            // Color field
            specification['encoding']['color']['field'] = this.localWidget.graphYfield;
            specification['encoding']['color']['aggregate'] = this.colorPropertiesAggregateVegaLiteName.toLowerCase();
            if (this.colorPropertiesBin == 'True') {
                specification['encoding']['color']['bin'] = true;
            } else {
                specification['encoding']['color']['bin'] = false;
            };
            specification['encoding']['color']['format'] = this.colorPropertiesFormat.toLowerCase();
            if (this.colorPropertiesImpute != '') {
                if (this.colorPropertiesImpute == 'Value') {
                    specification['encoding']['color']['impute'] =
                        {"value":' + this.colorPropertiesImputeValue + '};
                } else {
                    specification['encoding']['color']['impute'] =
                        {"method": "' + this.colorPropertiesImpute + '"};
                };
            };
            specification['encoding']['color']['stack'] = this.colorPropertiesStack;
            specification['encoding']['color']['sort'] = this.colorPropertiesSort.toLowerCase();
            // specification['encoding']['color']['type'] = this.localWidget.graphYtype;
            specification['encoding']['color']['type'] = this.colorPropertiesType.toLowerCase();
            specification['encoding']['color']['timeUnit'] = this.colorPropertiesTimeUnit.toLowerCase();

            if (this.colorPropertiesScheme != '') {
                if (this.colorPropertiesScheme == 'None') {
                    specification['encoding']['color']['scale'] = null;
                } else {
                    specification['encoding']['color']['scale'] =
                    {"scheme": this.colorPropertiesScheme.toLowerCase() };
                };
            };


            if (!this.legendTitleCheckbox) {
                // specification['encoding']['color']['legend']['title'] = null;
                    // specification['encoding']['color'] = {"legend" : null };
                    specification['encoding']['color'] = {
                        "field": "",
                        "type": "",
                        "scale": "",
                        "legend": ""
                      };
                } else {
                if (this.legendTitle != ''  &&  this.legendTitle != undefined) {
                    // specification['encoding']['color']['legend']['title'] = this.legendTitle;
                    specification['encoding']['color'] =
                        {"legend" : {"title": this.legendTitle} };
                } else {
                    specification['encoding']['color'] =
                        {"legend" : "" };

                };
            };

            // specification['encoding']['color']['legend'] = {"title": this.legendTitle };
            // specification['encoding']['color']['legend']['format'] = this.legendFormat;


            // Color field
            specification['encoding']['color']['field'] = this.localWidget.graphColorField;

            // Size field
            if (this.graphSizeField != ''
                &&  this.graphSizeField.toLowerCase() != 'drag a field here ...'
                &&  this.graphSizeField != undefined) {
                console.warn('xx sizeFiled', this.graphSizeField);

                specification['encoding']['size']['field'] = this.graphSizeField;
                specification['encoding']['size']['type'] = this.sizeType.toLowerCase();
                specification['encoding']['size']['aggregate'] = this.sizeAggregate.toLowerCase();
                if (this.sizeBin == 'True') {
                    specification['encoding']['size']['bin'] = true;
                } else {
                    specification['encoding']['size']['bin'] = false;
                };


            } else {
            specification['encoding']['size'] = {
                "field": ""
              };
            };

            // Tooltip setting
            // specification['mark']['tooltip']['content'] = "";
            // specification['mark']['type'] = "point";

        };
        if (graphID == 2  &&  graphShortName =='Area Chart') {

            // Enhance W properties
            this.localWidget.graphMark = 'area';

            // Define Specification
            specification = this.widgetGraphs[widgetGraphIndex].specification;
            if (this.localWidget.graphUrl != ""  &&  this.localWidget.graphUrl != null) {
                specification['data'] = {"url": this.localWidget.graphUrl};
            } else {
                specification['data'] = {"values": this.localWidget.graphData};
            };
            specification['description'] = this.localWidget.graphDescription;
            specification['width'] = width;
            specification['height'] = height;
            // specification['mark']['type'] = this.localWidget.graphMark;
            // specification['mark']['color'] = this.localWidget.graphMarkColor;

            specification['encoding']['x']['field'] = this.localWidget.graphXfield;
            specification['encoding']['x']['type'] = this.localWidget.graphXtype;
            // specification['encoding']['x']['axis']['title'] = this.localWidget.graphXaxisTitle;
            // specification['encoding']['x']['timeUnit'] = this.localWidget.graphXtimeUnit;
            // specification['encoding']['x']['aggregate'] = this.localWidget.graphXaggregate;

            specification['encoding']['y']['field'] = this.localWidget.graphYfield;
            specification['encoding']['y']['type'] = this.localWidget.graphYtype;
            // specification['encoding']['y']['axis']['title'] = this.localWidget.graphYaxisTitle;
            // specification['encoding']['y']['timeUnit'] = this.localWidget.graphYtimeUnit;
            // specification['encoding']['y']['aggregate'] = this.localWidget.graphYaggregate;

            // Tooltip setting
            // specification['mark']['tooltip']['content'] = "";

        };

        console.warn('xx graphVisualGrammar', graphVisualGrammar);
console.warn('xx specification', specification, specification == undefined);

        // Render graph for Vega-Lite
        if (graphVisualGrammar == 'Vega-Lite') {
            if (specification != undefined) {
                let vegaSpecification = compile(specification).spec;
                let view = new View(parse(vegaSpecification));

                view.renderer('svg')
                .initialize(this.dragWidget.nativeElement)
                    .hover()
                    .run()
                    .finalize();
            };
        };
    }
    renderGraph(definition: any) {
        // Render the graph on the form
        this.globalFunctionService.printToConsole(this.constructor.name,'renderGraph', '@Start');
console.warn('xx definition', definition);

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        let width: number = 400;
        let height: number = 260;
        let reduceX: number = 0;
        let reduceY: number = 0;
        let reduceColour: number = 0;

        // Get X max width
        let maxLengthX: number = 0;
        if (this.localWidget.graphXfield != ''  &&  this.localWidget.graphXfield != null) {

            const arrayColumn = (arr, n) => arr.map(x => x[n]) ;
            const singleColumn = arrayColumn(this.localWidget.graphData, this.localWidget.graphXfield);
            const arrayMaxLength = (arr) => arr.map(x => {
                if ( (typeof x) != 'string') {
                    maxLengthX = 4;
                } else {

                    if (x.length > maxLengthX) {
                        maxLengthX = x.length
                    };
                };
            });
            let temp = arrayMaxLength(singleColumn);
            reduceX = maxLengthX * 8;
            console.warn('xx X maxLength', maxLengthX, reduceX)
        };

        // Get Y max width
        let maxLengthY: number = 0;
        if (this.localWidget.graphYfield != ''  &&  this.localWidget.graphYfield != null) {

            const arrayColumn = (arr, n) => arr.map(x => x[n]) ;
            const singleColumn = arrayColumn(this.localWidget.graphData, this.localWidget.graphYfield);
            const arrayMaxLength = (arr) => arr.map(x => {
                if ( (typeof x) != 'string') {
                    maxLengthY = 4;
                } else {

                    if (x.length > maxLengthY) {
                        maxLengthY = x.length
                    };
                };
            });
            let temp = arrayMaxLength(singleColumn);
            reduceY = maxLengthY * 8;
            console.warn('xx X maxLength', maxLengthY, reduceY)
        };

        // Get colour max width
        let maxLengthColour: number = 0;
        if (this.localWidget.graphColorField != ''  &&  this.localWidget.graphColorField != null) {

            maxLengthColour = 0;        // Color blokkie
            const arrayColumn = (arr, n) => arr.map(x => x[n]) ;
            const singleColumn = arrayColumn(this.localWidget.graphData, this.localWidget.graphColorField);
            const arrayMaxLength = (arr) => arr.map(x => {
                if ( (typeof x) != 'string') {
                    maxLengthColour = 4;
                } else {

                    if (x.length > maxLengthColour) {
                        maxLengthColour = x.length
                    };
                };
            });
            let temp = arrayMaxLength(singleColumn);
            reduceColour = (maxLengthColour * 8) + 25;
            console.warn('xx X maxLength', maxLengthColour, reduceColour)
        };

        // Reduce width of legend by length of selected field
        // if (this.localWidget.graphColorField != ''  &&  this.localWidget.graphColorField != null) {
        //     let reduce: number = 30;

        //     // Find the length, then say 8px per character + colour blockie displayed
        //     // TODO - do this better !
        //     for (var i = 0; i < this.dataFieldNames.length; i++) {
        //         if (this.localWidget.graphColorField == this.dataFieldNames[i]) {
        //             reduce = (8 * this.dataFieldLengths[i]) + 35;
        //         }
        //     };
        //     width = width - reduce;
        // };

        console.warn('xx w ', width, width - reduceX - reduceColour )
        console.warn('xx h', height, height - reduceY )

        width =  width - reduceX - reduceColour;
        height =  height - reduceY;

        // Note: trick to set .width and .height explicitly, thus W.graphWidth not used
        // .width(width)
        // .height(height)

        view.renderer('svg')
        .initialize(this.dragWidget.nativeElement)
            .width(width)
            .height(height)
            .hover()
            .run()
            .finalize();
            // this.renderer.setElementStyle(this.dragWidget.nativeElement,
            //     'left', "200px");
    }

  	clickClose(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(null);
    }

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.localWidget.containerHasContextMenus = this.containerHasContextMenus;
        this.localWidget.containerHasTitle = this.containerHasTitle;

        // Calc the graph dimensions
        this.localWidget.graphHeight =
        this.globalVariableService.calcGraphHeight(this.localWidget);

        this.localWidget.graphWidth =
        this.globalVariableService.calcGraphWidth(this.localWidget);

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

    dragstartField(ev) {
        // Event trigger when start Dragging a Field in the list
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText.trim();
    }

    dragoverColumn(ev, actionName: string) {
        // Event trigger when a field is dragged over Column element
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColumn', '@Start');

        ev.preventDefault();
    }

    dragoverRows(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverRows', '@Start');

        ev.preventDefault();
    }

    dragoverColour(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Color field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColour', '@Start');

        ev.preventDefault();
    }

    dragoverSize(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Color field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverSize', '@Start');

        ev.preventDefault();
    }

    switchXandY() {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');

    }

    dropColumn(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');

        // Set
        if (fieldName = '') {
            fieldName = this.draggedField;
        };
        ev.preventDefault();

        let dataSchemaIndex: number = this.dataSchema.findIndex(
            dsc => dsc.name == fieldName
        );

        // Show X icon
        this.showColumnDeleteIcon = true;

        // Show the panel with X properties
        this.showFieldXPropertiesTitle = true;

        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        this.colField = fieldName;
        this.localWidget.graphXfield = fieldName;
        this.localWidget.graphXaxisTitle = fieldName;

        let fieldType:string = this.getFieldType(fieldName);
        this.graphTypeFieldX = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphXtype = this.defaultGraphTypeField(fieldType);

        // let definition = this.globalVariableService.createVegaLiteSpec(
        //     this.localWidget, graphHeight, graphWidth
        // );
        // this.renderGraph(definition);

    }

    dropRow(ev, fieldName: string) {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropRow', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        // Show X icon
        this.showRowDeleteIcon = true;

        // Show the panel with X properties
        this.showFieldYPropertiesTitle = true;

        var data = ev.dataTransfer.getData("text");
        this.rowField = fieldName;
        this.localWidget.graphYfield = fieldName;
        this.localWidget.graphYaxisTitle = fieldName;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(fieldName);
        this.graphTypeFieldY = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphYtype = this.defaultGraphTypeField(fieldType);
console.warn('xx big 3', fieldType,
this.graphTypeFieldY,
this.localWidget.graphYtype);

        // TODO - REMOVE when this is done via forms !!!
        // if (this.localWidget.graphYtype == 'quantitative') {
        //     this.localWidget.graphYtype = 'ordinal';
        // };

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        // this.renderGraph(definition);
    }

    dropColour(ev) {
        // Event trigger when the dragged Field is dropped the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColour', '@Start');

        // Show X icon
        this.showColourDeleteIcon = true;

        // Show the panel with X properties
        this.showFieldColorPropertiesTitle = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.graphColorField = this.draggedField;
        this.localWidget.graphColorField = this.draggedField

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldColor = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphColorType = this.defaultGraphTypeField(fieldType);

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    dropSize(ev) {
        // Event trigger when the dragged Field is dropped the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropSize', '@Start');

        // Show X icon
        this.showSizeDeleteIcon = true;

        // // Show the panel with X properties
        // this.showFieldSizePropertiesTitle = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        // TODO Add Size field
        this.graphSizeField = this.draggedField;
        // this.localWidget.graphColorField = this.draggedField

        this.dragoverSizes = false;

        // Fill the default and allowed types of Vega field types
        // let fieldType:string = this.getFieldType(this.draggedField);
        // this.graphTypeFieldColor = this.allowedGraphTypeField(fieldType);
        // this.localWidget.graphColorType = this.defaultGraphTypeField(fieldType);

        // let definition = this.globalVariableService.createVegaLiteSpec(
        //     this.localWidget, graphHeight, graphWidth
        // );
        // this.renderGraph(definition);
    }

    clickClearColumnField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColumnField', '@Start');

        // Show X icon
        this.showColumnDeleteIcon = false;
        this.colField = 'Drag a field here ...';
        this.localWidget.graphXfield = null;
        this.localWidget.graphXaxisTitle = null;
        this.localWidget.graphXaggregate = null;
        this.localWidget.graphXtimeUnit = null;
        this.localWidget.graphXtype = null;

        // Hide the panel with X properties
        this.showFieldXPropertiesTitle = false;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearRowField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearRowField', '@Start');

        // Hide the panel with Y properties
        this.showFieldYPropertiesTitle = false;

        // Show X icon
        this.showRowDeleteIcon = false;
        this.rowField = 'Drag a field here ...';
        this.localWidget.graphYfield = null;
        this.localWidget.graphYaxisTitle = null;
        this.localWidget.graphYaggregate = null;
        this.localWidget.graphYtimeUnit = null;
        this.localWidget.graphYtype = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearColourField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColourField', '@Start');

        // Show X icon
        this.showColourDeleteIcon = false;
        this.graphColorField = 'Drag a field here ...';
        this.localWidget.graphColorField = null;
        this.localWidget.graphColorType = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearSizeField() {
        // Clear the Size Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearSizeField', '@Start');

        // Show X icon
        this.showSizeDeleteIcon = false;
        this.graphSizeField = 'Drag a field here ...';
        // this.localWidget.graphColorField = null;
        // this.localWidget.graphColorType = null;

        // let definition = this.globalVariableService.createVegaLiteSpec(
        //     this.localWidget, graphHeight, graphWidth
        // );
        // this.renderGraph(definition);
    }

    dragenterColumn(ev, actionName: string) {
        // Event trigger when dragged field enters Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverColours = false;
    }

    dragleaveColumn(ev, actionName: string) {
        // Event trigger when dragged field leave Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
    }

    dragenterRow(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterRow', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = true;
        this.dragoverColours = false;
    }

    dragleaveRow(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveRow', '@Start');

        ev.preventDefault();
        this.dragoverRow = false;
    }

    dragenterColour(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColour', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = false;
        this.dragoverColours = true;
    }

    dragleaveColour(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColour', '@Start');

        ev.preventDefault();
        this.dragoverColours = false;
    }

    dragenterSize(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterSize', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.dragoverSizes = true;
        // this.dragoverColours = false;
    }

    dragleaveSize(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveSize', '@Start');

        ev.preventDefault();
        this.dragoverSizes = false;
    }

    clickDatasource(index: number, name: string) {
        // Show dropdown of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // TODO - remove later if not used any longer
    }

    clickGraphType(graph: string) {
        // Click a type of graph icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGraphType', '@Start');

        this.showType = false;

        this.localWidget.graphMark = graph;
        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);

    }

    clickDSrow(index, datasourceID: number) {
        // Set the selected datasourceID
        // NOTE: this array can be filtered on front-end, thus DON'T use index
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');
        console.warn('xx this.selectedRowIndex this.selectedRowID', this.selectedRowIndex, this.selectedRowID);

        // Reset, Highlight selected row
        this.selectedRowIndex = index;
        let arrayIndex: number = this.localDatasources.findIndex(ds => ds.id == datasourceID);
        this.selectedRowID = datasourceID;
        this.selectedDescription = this.localDatasources[arrayIndex].description;
        this.errorMessage = '';
        this.currentData = null;

        // Clear previous selected fields
        this.showColumnDeleteIcon = false;
        this.colField = 'Drag a field here ...';
        this.localWidget.graphXfield = '';
        this.localWidget.graphXaxisTitle = '';

        this.showRowDeleteIcon = false;
        this.rowField = 'Drag a field here ...';
        this.localWidget.graphYfield = '';
        this.localWidget.graphYaxisTitle = '';

        this.showColourDeleteIcon = false;
        this.graphColorField = 'Drag a field here ...';
        this.localWidget.graphColorField = ''
        this.localWidget.graphColorType = '';

        this.showSizeDeleteIcon = false;
        this.graphSizeField = 'Drag a field here ...';

        // Determine if data already in Glob Var
        let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
            ds => ds.datasourceID == datasourceID
        );
        if (dataSetIndex >= 0) {

            // Load local arrays for ngFor
            this.dataFieldNames = this.localDatasources[arrayIndex].dataFields;
            this.dataFieldLengths = this.localDatasources[arrayIndex].dataFieldLengths;
            this.dataFieldTypes = this.localDatasources[arrayIndex].dataFieldTypes;
            this.constructDataSchema();
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
            this.dataFieldNames = this.localDatasources[arrayIndex].dataFields;
            this.dataFieldLengths = this.localDatasources[arrayIndex].dataFieldLengths;
            this.dataFieldTypes = this.localDatasources[arrayIndex].dataFieldTypes;
            this.constructDataSchema();

            // Determine if data obtains in Glob Var
            dataSetIndex = this.globalVariableService.currentDatasets.findIndex(
                ds => ds.datasourceID == datasourceID
            );
            if (dataSetIndex < 0) {
                this.errorMessage = 'Error! The Data does not exist in currentDatasets array';
                return;
            };

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
console.warn('xx this.selectedRowIndex this.selectedRowID', this.selectedRowIndex, this.selectedRowID);

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

    allowedGraphTypeField(fieldType: string): string[] {
        // Returns a string array of allowed Vega types depending on a given field type
        this.globalFunctionService.printToConsole(this.constructor.name,'allowedGraphTypeField', '@Start');

        if (fieldType == 'string') {
            return ['ordinal'];
        };
        if (fieldType == 'number') {
            return ['ordinal','quantitative'];
        };
    }

    defaultGraphTypeField(fieldType: string): string {
        // Returns the default Vega field type depending a given field types
        this.globalFunctionService.printToConsole(this.constructor.name,'defaultGraphTypeField', '@Start');

        if (fieldType == 'string') {
            return 'ordinal';
        };
        if (fieldType == 'number') {
            return 'quantitative';
        };
    }

    getFieldType(fieldName: string): string {
        // Returns the field type of a given field name
        this.globalFunctionService.printToConsole(this.constructor.name,'getFieldType', '@Start');

        for (var i = 0; i < this.dataFieldNames.length; i++) {
            if (this.dataFieldNames[i] == fieldName) {
                return this.dataFieldTypes[i]
            }
        };
    }

    // TODO - do one or the other: 3 vars, or 1 combined object
    constructDataSchema() {
        // Construct combined object for fields
        this.globalFunctionService.printToConsole(this.constructor.name,'constructDataSchema', '@Start');

        // TODO - do one or the other: 3 vars, or 1 combined object
        // Fill dataSchema
        this.dataSchema = [];
        for (let i = 0; i < this.dataFieldNames.length; i++) {
            let newDataSchema: dataSchemaInterface = {
                name: this.dataFieldNames[i],
                type: this.dataFieldTypes[i],
                length: this.dataFieldLengths[i]
            };
            this.dataSchema.push(newDataSchema);
        };
        console.warn('xx this.dataSchema', this.dataSchema);

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

        // Show / Hide indicator
        this.changeXProperty();
    }

    clickShowColorProperties() {
        // Show Color Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColorProperties', '@Start');

        // Toggle
        this.showFieldColorProperties = !this.showFieldColorProperties;

        // Show / Hide indicator
        this.changeXProperty();
    }

    changeXProperty() {
        // Show info icon if any ONE of the properties are filled in
        this.globalFunctionService.printToConsole(this.constructor.name,'changeXProperty', '@Start');

        this.showFieldXPropertiesInfo = false;

        if (this.xPropertiesAggregate != ''
            ||  this.xPropertiesBin != 'False'
            ||  this.xPropertiesFormat != ''
            ||  this.xPropertiesImpute != ''
            ||  this.xPropertiesStack != ''
            ||  this.xPropertiesSort != ''
            ||  this.xPropertiesType != ''
            ||  this.xPropertiesImpute != '') {
            this.showFieldXPropertiesInfo = true;
        };
    }

    changYProperty() {
        // Show info icon if any ONE of the properties are filled in
        this.globalFunctionService.printToConsole(this.constructor.name,'changeXProperty', '@Start');

        this.showFieldYPropertiesInfo = false;

        if (this.yPropertiesAggregate != ''
            ||  this.yPropertiesBin != 'False'
            ||  this.yPropertiesFormat != ''
            ||  this.yPropertiesImpute != ''
            ||  this.yPropertiesStack != ''
            ||  this.yPropertiesSort != ''
            ||  this.yPropertiesType != ''
            ||  this.yPropertiesImpute != '') {
            this.showFieldYPropertiesInfo = true;
        };
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

    clickShowXAxis() {
        // Show X Axis Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowXAxis', '@Start');

        // Toggle
        this.showFieldXAxis = !this.showFieldXAxis;
    }

    clickShowYAxis() {
        // Show X Axis Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowYAxis', '@Start');

        // Toggle
        this.showFieldYAxis = !this.showFieldYAxis;
    }

    clickShowLegend() {
        // Show Legend Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowLegend', '@Start');

        // Toggle
        this.showFieldLegend = !this.showFieldLegend;
    }

    clickShowSize() {
        // Show Size Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowSize', '@Start');

        // Toggle
        this.showFieldSize = !this.showFieldSize;
    }

    clickSelectTitleColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColor', '@Start');

        this.titleColorName = ev.target.value;
        this.titleColor = this.titleColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.titleColorName
        );
        if (localIndex >= 0) {
            this.titleColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

}