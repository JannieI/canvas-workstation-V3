{
	"properties": {
		"name": "Widgy",
		"description": "Good descriptive name",
		"default_export_file_type": "png",
		"refresh_mode": "manual",
		"refresh_timer": null,
		"system_message": null,
		"is_locked": false,
		"z_index": null,
		"size": "small",
		"type": "bar",
		"row_limit": 10,
		"hyperlinked_tab": null,
		"hyperlinked_widget": null
	},
	"container": {
	    "color": "testing",
	    "background_color": "testing",
	    "font_size": 10,
	    "border": "testing",
	    "box_shadow": "testing",
	    "title": "testing",
	    "top": 10,
	    "left": 10,
	    "width": 10,
	    "height": 10,
	    "show_text": false,
	    "show_graph": false,
	    "show_table": false,
	    "show_image": false
	},
	"text": {
		"text": "Testing string text",
		"color": null,
		"font_size": 10,
		"font_weight": 2,
		"background_color": null,
		"border": "",
		"margin": 1,
		"position": null,
		"text_align": "center",
		"padding": 5,
		"height": 10,
		"width": 10,
		"top": 12,
		"left": 20
	},
	"table": {
	    "color": null,
	    "rows": null,
	    "columns": null,
	    "hide_header": false,
	    "top": 10,
	    "left": 5,
	    "width": 100,
	    "height": 25
	},
	"image": {
	    "alt": null,
	    "source": "",
	    "top": 10,
	    "left": 10,
	    "width": 20,
	    "height": 20
	},
	"graph": {
	    "uuid": "7475bbff-cfdc-4aea-84c7-8c70673e1e87",
	    "left": 10,
	    "top": 10,
	    "parameters": {
	        "x": "X Field",
	        "y": "X Field",
	        "width": 10,
	        "height": 15,
	        "padding": 5,
	        "has_signals": false,
	        "fill_color": "blue",
	        "hover_color": "red"
	    },
	    "specification": {
			"width": 400,
			"height": 200,
			"padding": 5,
			"data": [
				{
					"name": "table",
					"values": [
						{"category": "A", "amount": 28},
						{"category": "B", "amount": 55},
						{"category": "C", "amount": 43},
						{"category": "D", "amount": 91},
						{"category": "E", "amount": 81},
						{"category": "F", "amount": 53},
						{"category": "G", "amount": 19},
						{"category": "H", "amount": 87}
						]
				}
			],

			"signals": [
				{
					"name": "tooltip",
					"value": {},
					"on": [
						{"events": "rect:mouseover", "update": "datum"},
						{"events": "rect:mouseout",  "update": "{}"}
					]
				}
			],
			"scales": [
				{
					"name": "xscale",
					"type": "band",
					"domain": {"data": "table", "field": "category"},
					"range": "width",
					"padding": 0.05,
					"round": true
				},
				{
					"name": "yscale",
					"domain": {"data": "table", "field": "amount"},
					"nice": true,
					"range": "height"
				}
			],

			"axes": [
				{ "orient": "bottom", "scale": "xscale" },
				{ "orient": "left", "scale": "yscale" }
			],
			"marks": [
				{
					"type": "rect",
					"from": {"data":"table"},
					"encode": {
						"enter": {
						  "x": {"scale": "xscale", "field": "category"},
						  "width": {"scale": "xscale", "band": 1},
						  "y": {"scale": "yscale", "field": "amount"},
						  "y2": {"scale": "yscale", "value": 0}
						},
						"update": {
						  "fill": {"value": "steelblue"}
						},
						"hover": {
						  "fill": {"value": "red"}
						}
					}
				},
				{
					"type": "text",
					"encode": {
						"enter": {
						  "align": {"value": "center"},
						  "baseline": {"value": "bottom"},
						  "fill": {"value": "#333"}
						},
					"update": {
						  "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
						  "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
						  "text": {"signal": "tooltip.amount"},
						  "fillOpacity": [
						    {"test": "datum === tooltip", "value": 0},
						    {"value": 1}
			  			]
					}
				}
				}
			]
		}
	}
}