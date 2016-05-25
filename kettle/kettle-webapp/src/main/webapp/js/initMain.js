var activeGraph = null;
Ext.onReady(function() {
	var tabPanel = new Ext.TabPanel({
		id: 'TabPanel',
		region: 'center',
		margins: '5 5 5 0',
		plain: true
	});
	
	var guidePanel = new GuidePanel({
		id: 'GuidePanel',
		split: true,
		region: 'west',
		width: 300,
		margins: '5 0 5 5'
	});
	
	tabPanel.on('tabchange', function(me, item) {
		activeGraph = item;
		guidePanel.activeCom(item.iconCls);
	});
	

    new Ext.Viewport({
		layout: 'border',
		items: [guidePanel, tabPanel]
	});
    
//    guidePanel.openFile('variables.ktr');
//    guidePanel.openFile('insert or update.ktr');
//    guidePanel.openFile('Table Output - Tablename in field.ktr');
//    guidePanel.openFile('transformations/JSON - read nested fields.ktr');
//    guidePanel.openFile('transformations/SQL File Output - Basic example.ktr');
//    guidePanel.openFile('transformations/Table Output - Tablename in field.ktr');
//    guidePanel.openFile('transformations/Switch-Case - basic sample.ktr');
//    guidePanel.openFile('transformations/JsonInput - read a file.ktr');
//    guidePanel.openFile('transformations/Add a checksum - Basic CRC32 example.ktr');
//    guidePanel.openFile('transformations/Add a sequence - Basic example.ktr');
    
//    guidePanel.openFile('jobs/arguments/Set arguments on a transformation.kjb');
    
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
});

function syncCall(cfg) {
	var conn = null;
	try {
		conn = new XMLHttpRequest();
    } catch(e) {
        for (var i = Ext.isIE6 ? 1 : 0; i < activeX.length; ++i) {
            try {
            	conn = new ActiveXObject(activeX[i]);
                break;
            } catch(e) {
            	
            }
        }
    }
    var jsonData = cfg.params || {};
    var p = Ext.isObject(jsonData) ? Ext.urlEncode(jsonData) : jsonData;
    
    var url = cfg.url;
    url = Ext.urlAppend(url, p);
    
    conn.open(cfg.method || 'POST', url, false);
    conn.send(null);
    if (conn.status == "200") {  
    	return conn.responseText;  
    }  
    return null;
}

var loadCache = new Ext.util.MixedCollection();
function loadPluginScript(pluginId) {
	if(!pluginId) return;
	
	if(!loadCache.containsKey(pluginId)) {
		var oHead = document.getElementsByTagName('HEAD').item(0);
	    var oScript= document.createElement("script");
	    oScript.type = "text/javascript";
	    oScript.src = GetUrl(pluginId + '.js2');
	    oHead.appendChild( oScript ); 
		
		loadCache.add(pluginId, 1);
	}
}

function findItems(c, name, v) {
	var arrays = [];
	if(c.items) {
		c.items.each(function(t) {
			if(t[name] == v)
				arrays.push(t);
			Ext.each(findItems(t, name, v), function(e) {
				arrays.push(e);
			});
		});
	}
	return arrays;
}

function GetUrl(url) {
	var contextPath = Ext.fly('context-path').getValue();
	var newurl = contextPath + '/' + url;
	return newurl;
}

function getActiveGraph() {
	return activeGraph;
}

var cellLabelChanged = mxGraph.prototype.cellLabelChanged;
mxGraph.prototype.cellLabelChanged = function(cell, value, autoSize)
{
	var tmp = cell.value.cloneNode(true);
	tmp.setAttribute('label', value);
	value = tmp;
	
	cellLabelChanged.apply(this, arguments);
};
var convertValueToString = mxGraph.prototype.convertValueToString;
mxGraph.prototype.convertValueToString = function(cell)
{
	var label = cell.getAttribute('label');
	if(label)
		return decodeURIComponent(label);
	return label;
};
mxPopupMenu.prototype.zIndex = 100000;

mxGraph.prototype.isHtmlLabel = function(	cell	) {
	return true;
}

function NoteShape()
{
	mxCylinder.call(this);
};
mxUtils.extend(NoteShape, mxCylinder);
NoteShape.prototype.size = 10;
NoteShape.prototype.redrawPath = function(path, x, y, w, h, isForeground)
{
	var s = Math.min(w, Math.min(h, mxUtils.getValue(this.style, 'size', this.size)));

	if (isForeground)
	{
		path.moveTo(w - s, 0);
		path.lineTo(w - s, s);
		path.lineTo(w, s);
		path.end();
	}
	else
	{
		path.moveTo(0, 0);
		path.lineTo(w - s, 0);
		path.lineTo(w, s);
		path.lineTo(w, h);
		path.lineTo(0, h);
		path.lineTo(0, 0);
		path.close();
		path.end();
	}
};

mxCellRenderer.prototype.defaultShapes['note'] = NoteShape;

NoteShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
                                   new mxConnectionConstraint(new mxPoint(0.5, 0), true),
                                   new mxConnectionConstraint(new mxPoint(0.75, 0), true),
 	              		 new mxConnectionConstraint(new mxPoint(0, 0.25), true),
 	              		 new mxConnectionConstraint(new mxPoint(0, 0.5), true),
 	              		 new mxConnectionConstraint(new mxPoint(0, 0.75), true),
 	            		 new mxConnectionConstraint(new mxPoint(1, 0.25), true),
 	            		 new mxConnectionConstraint(new mxPoint(1, 0.5), true),
 	            		 new mxConnectionConstraint(new mxPoint(1, 0.75), true),
 	            		 new mxConnectionConstraint(new mxPoint(0.25, 1), true),
 	            		 new mxConnectionConstraint(new mxPoint(0.5, 1), true),
 	            		 new mxConnectionConstraint(new mxPoint(0.75, 1), true)];