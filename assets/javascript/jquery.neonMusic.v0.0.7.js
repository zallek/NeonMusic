/**
 * Created with JetBrains PhpStorm.
 * User: Nicolas Fortin
 * Date: 19/03/13
 * Time: 21:58
 */

(function($) {

    /******************************************/
    /*            NeonMusic Class             */
    /*                                        */
    /******************************************/

    var NeonMusic = function(element, option)
    {
        /** Constructor **/
        if(isset(element)){
            var frame = $(element);
            var grid = new Grid({
                'container' : frame
            });
            var node1 = new Node({
                'grid' : grid,
                'parent' : grid,
                'x' : 0,
                'y' : 0,
                'isStart' : true
            });
            new SampleManager(null);
        }


        /******************************************/
        /*              API Functions             */
        /******************************************/

        this.setDetailPane = function(_selector){
            new DetailPanel({
                'selector' : _selector
            });
        };

        this.animate = function(){
            if(SampleManager.instance != null){
                var tempo = SampleManager.instance.tempo();

                var parcours = function(_node){
                    setTimeout(function(){
                        //Action on himself
                        _node.type(Node.TypeEnum.ANIMATION_IDLE);
                        //Action on parent

                        var childArrows = _node.childArrows();
                        childArrows.forEach(function(el){
                            if(el != null){
                                parcours(el.nextNode());
                            }
                        });
                    }, tempo);
                    _node.type(Node.TypeEnum.ANIMATION_ACTIVE);
                    var sample = _node.sample();
                    if(sample != null)
                        sample.play();
                };

                grid.type(Grid.TypeEnum.ANIMATION);
                parcours(node1);
            }
        };

        this.stop = function(){

        };
    };


    /**
     * Detail Pane Class Singleton
     * @param param : Object {selector}
     * @constructor
     */
    function DetailPanel(param){
        var that = this;

        var selector;
        this.selector = function(){
            return selector;
        };

        var elementPanel;
        this.elementPanel = function(){
            return elementPanel;
        };

        var generalPanel;
        this.genPan = function(){
            return generalPanel;
        };

        /** Constructor **/
        if(isset(param) && DetailPanel.instance == null){
            selector = param.selector;
            selector.addClass(DetailPanel.el.className);
            elementPanel = new ElementPanel(this);
            generalPanel = new GeneralPanel(this);
            DetailPanel.instance = this;
        }

        /**
         * ElementPanel Class
         * @param parent
         * @constructor
         */
        function ElementPanel(parent){
            var that = this;
            var param = DetailPanel.el.elementPanel;

            var selector;
            this.selector = function(){
                return selector;
            };

            var titleField;
            var sampleField;

            var currentDetailObject;
            this.currentDetailObject = function(_object){
                if(!isset(_object)){
                    return currentDetailObject;
                }
                else{
                    if(isset(currentDetailObject)){
                        currentDetailObject.blur();
                    }
                    currentDetailObject = _object;
                    currentDetailObject.focus();

                    //Node
                    if(_object instanceof Node){
                        titleField.setContent(currentDetailObject);
                        sampleField.setContent(currentDetailObject);
                    }

                    return true;
                }
            };

            /** Constructor **/
            if(isset(parent)){
                //Create DOM elements
                parent.selector().append("<div class='"+param.className+"'>"+"</div>");
                selector = parent.selector().children("."+param.className);
                titleField = new TitleField(this);
                sampleField = new SampleField(this);
            }

            function TitleField(parent){
                var that = this;
                var param = DetailPanel.el.elementPanel.Title;
                var selector;

                /** Constructor **/
                if(isset(parent)){
                    parent.selector().append("<div class='"+param.className+"'></div>");
                    selector = parent.selector().children("."+param.className);
                }

                this.setContent = function(_object){
                    var title = "Node : "+_object.domId();
                    selector.empty().append(title);
                }
            }

            function SampleField(parent){
                var that = this;
                var param = DetailPanel.el.elementPanel.Sample;
                var selector;

                /** Constructor **/
                if(isset(parent)){
                    parent.selector().append("<div class='"+param.className+"'></div>");
                    selector = parent.selector().children("."+param.className);
                }

                this.setContent = function(_object){
                    /** Create sampleSelect **/
                    var sampleSelect = "Sample : ";
                    var selectedOption = null;
                    if(_object.sample() != null){
                        selectedOption = _object.sample().url();
                    }
                    sampleSelect += "<select id='"+ param.Select.id + "'>";
                    sampleSelect += "<option value='null'>None</option>";
                    SampleManager.instance.availableSampleList().forEach(function(el){
                        var selected = (el == selectedOption) ? "selected" : "";
                        sampleSelect += "<option value='"+el+"' "+selected+">"+el+"</option>";
                    });
                    sampleSelect += "</select>";

                    selector.empty().append(sampleSelect);
                    $('#'+param.Select.id).change(function() {
                        currentDetailObject.sample(this.value);
                    });

                    /** Create sampleListen **/
                    var sampleListen = "<div id='"+ param.Listen.id +"' class='"+ param.Listen.className + "'></div>";

                    selector.append(sampleListen);
                    $('#'+param.Listen.id).click(function() {
                        currentDetailObject.sample().play();
                    });
                }
            }
        }

        /**
         * GeneralPanel Class
         * @constructor
         */
        function GeneralPanel(parent){
            var that = this;
            var param = DetailPanel.el.generalPanel;

            var tempoField;

            var selector;
            this.selector = function(){
                return selector;
            };

            /** Constructor **/
            if(isset(parent)){
                //Create DOM elements
                parent.selector().append("<div class='"+param.className+"'>"+"</div>");
                selector = parent.selector().children("."+param.className);
                tempoField = new TempoField(this);
            }

            function TempoField(parent){
                var that = this;
                var tempo;
                var param = DetailPanel.el.generalPanel.Tempo;
                var selector;

                /** Constructor **/
                if(isset(parent)){
                    parent.selector().append("<div class='"+param.className+"'></div>");
                    selector = parent.selector().children("."+param.className);
                    if(SampleManager.instance != null){
                        tempo = SampleManager.instance.tempo();
                    }

                    var tempoField = "Tempo (millisecondes) : ";
                    tempoField += "<input type='text' id='"+ param.Input.id + "' value='"+tempo+"'/>";

                    selector.append(tempoField);
                    $('#'+param.Input.id).change(function(){
                        if(SampleManager.instance != null){
                            SampleManager.instance.tempo(parseInt(this.value));
                            this.value = SampleManager.instance.tempo();
                        }
                    });
                }
            }
        }
    }
    DetailPanel.instance = null;
    DetailPanel.el = {
        className : 'detailPanel',
        elementPanel : {
            className : 'elementPanel',
            Title :     {className : 'title'},
            Sample :    {className : 'sample',
                Select :    {id : 'SampleSelect'},
                Listen :    {id : 'SampleListen', className : 'listen'}
            }
        },
        generalPanel : {
            className : 'generalPanel',
            Tempo :     {
                className : 'tempo',
                Input : {id : 'TempoInput'}
            }
        }
    };


    /**
     * Grid Class
     * @param param : Object {container, (scale)}
     * @constructor
     */
    function Grid(param){
        var container;
        var domId;

        var scale;
        this.scale = function(){
            return scale;
        };

        var selector;
        this.selector = function(){
            return selector;
        };

        var width;
        this.width = function(){
            return width;
        };

        var height;
        this.height = function(){
            return height;
        };

        var type;
        this.type = function(_type){
            if(!isset(_type)){
                return type;
            }
            else{
                if(typeof type !== "undefined")
                    selector.removeClass(type.className);
                if(isset(_type)){
                    type = _type;
                    selector.addClass(type.className);
                    width = selector.width();
                    height = selector.height();
                    return true;
                }
                return false;
            }
        };

        var nodes = new Array();
        this.nodes = function(_x, _y, _newNode){
            if(!isset(_newNode)){
                if(isset(nodes[_x])){
                    return nodes[_x][_y];
                }
                return null;
            }
            else{
                if(!isset(nodes[_x]))
                    nodes[_x] = new Array();
                nodes[_x][_y] = _newNode;
                return true;
            }
        };


        /** Constructor **/
        if(isset(param)){
            container  = param.container;
            scale = valueOrDefault(param.scale, Grid.Param.defaultScale);
            domId = Grid.Param.id;
            container.append("<div class='"+Grid.Param.className+"' id='"+domId+"'/>");
            selector = $("#"+domId);
            this.type(Grid.TypeEnum.DESIGN);
        }
    }
    Grid.Param = {
        'className' : 'grid',
        'id' : 'Grid',
        'defaultScale' : 60
    };
    Grid.TypeEnum = {
        'DESIGN' :   { className : 'design'   },
        'ANIMATION': { className : 'animation'}
    };


    /**
     * Abstract class NeonMusicComponent
     * @param param : Object {grid, parent, x, y, type, genre}
     * @constructor
     */
    function NeonMusicComponent(param) {
        var that = this;

        var grid;
        this.grid = function(){
            return grid;
        };

        var parent;
        this.parent = function(){
            return parent;
        };

        var container;
        this.container = function(){
            return container;
        };

        var genre;
        this.genre = function(){
            return genre;
        };

        var domId;
        this.domId = function(){
            return domId;
        };

        var selector;
        this.selector = function(){
            return selector;
        };

        var width;
        this.width = function(){
            return width;
        };

        var height;
        this.height = function(){
            return height;
        };

        var x;
        this.x = function(_x){
            if(!isset(_x)){
                return x;
            }
            else{
                x = _x;
                that.move();
                return true;
            }
        };

        var y;
        this.y = function(_y){
            if(!isset(_y)){
                return y;
            }
            else{
                y = _y;
                that.move();
                return true;
            }
        };

        var type;
        this.type = function(_type){
            if(!isset(_type)){
                return type;
            }
            else{
                if(typeof type !== "undefined")
                    selector.removeClass(type.className);
                if(isset(_type)){
                    type = _type;
                    selector.addClass(type.className);
                    width = selector.width();
                    height = selector.height();
                    return true;
                }
                return false;
            }
        };

        /** Constructor **/
        if(isset(param)){
            grid = param.grid;
            parent = param.parent;
            container = parent.selector();
            genre = param.genre;
            domId = genre.abg + genre.lastId;
            container.append("<div class='"+genre.className+"' id='"+domId+"'/>");
            genre.lastId++;
            selector = $("#"+domId);
            width = selector.width();
            height = selector.height();
            this.type(param.type);
            this.x(param.x);
            this.y(param.y);
        }
    }
    NeonMusicComponent.prototype.move = function(){
        var px = this.x()*this.grid().scale() - this.width()/2 + this.parent().width()/2;
        var py = this.y()*this.grid().scale() - this.height()/2 + this.parent().height()/2;
        this.selector().css({
            'left' : px + 'px',
            'bottom' : py + 'px'
        });
    };
    NeonMusicComponent.prototype.setXY = function(_x, _y) {
        this.x(_x);
        this.y(_y);
    };
    NeonMusicComponent.GenreEnum = {
        Node :          { abg : 'N',  className : 'node',           lastId : 0 },
        Arrow :         { abg : 'A',  className : 'arrow',          lastId : 0 },
        DetectionArea : { abg : 'DA', className : 'detectionArea',  lastId : 0 }
    };
    NeonMusicComponent.prototype.fireDetailObjectChange = function(){
        if(DetailPanel.instance != null){
            DetailPanel.instance.elementPanel().currentDetailObject(this);
        }
    };


    /**
     * Node Class
     * @param param : Object {grid, parent, x, y, (type), (isStart)}
     * @constructor
     */
    function Node(param){
        var that = this;

        var detectionArea;
        this.detectionArea = function(){
            return detectionArea;
        };

        var isStart;
        this.isStart = function(){
            return isStart;
        };

        var sample;
        this.sample = function(_sampleUrl){
            if(!isset(_sampleUrl)){
                return sample;
            }
            else {
                //Destroy current sample
                if(sample != null){
                    sample.destroy();
                }
                //Create a new one if needed
                if(_sampleUrl == null || _sampleUrl == 'null'){
                    sample = null;
                }
                else{
                    sample = new Sample({ 'url' : _sampleUrl });
                }
                return true;
            }
        };

        this.focus = function(){
            this.type(Node.TypeEnum.DESIGN_FOCUS);
        };

        this.blur = function(){
            this.type(isStart ? Node.TypeEnum.DESIGN_START : Node.TypeEnum.DESIGN_STD);
        };


        this.childArrows = function(){
            var arrows = new Array();
            detectionArea.arrows.forEach(function(el){
                if(el.isSet()){
                    arrows.push(el);
                }
            });
            return arrows;
        };

        /** Constructor **/
        if(isset(param)){
            isStart = valueOrDefault(param.isStart, false);
            NeonMusicComponent.call(this, {
                'grid' : param.grid,
                'parent' : param.parent,
                'x' : param.x,
                'y' : param.y,
                'genre' : NeonMusicComponent.GenreEnum.Node,
                'type' : valueOrDefault(param.type, (isStart) ? Node.TypeEnum.DESIGN_START : Node.TypeEnum.DESIGN_STD)
            });

            detectionArea = new DetectionArea(this);
            sample = null;
            this.grid().nodes(param.x, param.y, this);
        }

        /** Event binding **/
        this.selector().click(function(){
            that.fireDetailObjectChange();
        });
    }
    Node.prototype = new NeonMusicComponent();
    Node.TypeEnum = {
        DESIGN_START :      { className : "filled"  },
        DESIGN_STD :        { className : "empty"   },
        DESIGN_FOCUS :      { className : "red"     },
        ANIMATION_ACTIVE :  { className : "red"     },
        ANIMATION_IDLE :    { className : "filled"  }
    };


    /**
     * Arrow Class
     * @param param : Object {grid, parent, x, y, (type), orientation}
     * @constructor
     */
    function Arrow(param) {
        var that = this;

        var nextNode;
        this.nextNode = function(_nextNode){
            if(!isset(_nextNode)){
                return nextNode;
            }
            else{
                nextNode = _nextNode;
                return true;
            }
        };

        var orientation;
        this.orientation = function(){
            return orientation;
        };

        this.isSet = function(){
            return isset(nextNode);
        };

        /** Constructor **/
        if(isset(param)){
            NeonMusicComponent.call(this, {
                'grid' : param.grid,
                'parent' : param.parent,  //DetectionArea  -> Node
                'x' : param.x,
                'y' : param.y,
                'genre' : NeonMusicComponent.GenreEnum.Arrow,
                'type' : valueOrDefault(param.type, Arrow.TypeEnum.DESIGN)
            });
            orientation = param.orientation;
            //Rotate
            this.selector().rotate(orientation.angle);
        }

        /** Event bindind **/
        this.selector().click(function(){
            if(!that.isSet())
            {
                var params = {
                    'grid' : that.grid(),
                    'parent' : that.grid(),
                    'x' : that.parent().parent().x(),
                    'y' : that.parent().parent().y()
                };

                $.each(Arrow.Orientation, function(i, p){
                    if(that.orientation() == p){
                        params.x += p.x;
                        params.y += p.y;
                    }
                });

                var hypNode = that.grid().nodes(params.x, params.y);
                if(hypNode == null)  //If node does not already exist
                    that.nextNode(new Node(params));
                else
                    that.nextNode(hypNode);
            }
            else{
                that.fireDetailObjectChange();
            }
        });
    }
    Arrow.prototype = new NeonMusicComponent();
    Arrow.TypeEnum = {
        DESIGN : { className : "design" }
    };
    Arrow.Orientation = {
        NORTH :       { angle :   0 , x:  0, y: +1},
        NORTH_EAST :  { angle :  45 , x: +1, y: +1},
        EAST :        { angle :  90 , x: +1, y:  0},
        SOUTH_EAST :  { angle : 135 , x: +1, y: -1},
        SOUTH :       { angle : 180 , x:  0, y: -1},
        SOUTH_WEST :  { angle : 225 , x: -1, y: -1},
        WEST :        { angle : 270 , x: -1, y:  0},
        NORTH_WEST :  { angle : 315 , x: -1, y: +1}
    };


    /**
     * Detection Area
     * @param parent Object
     * @constructor
     */
    function DetectionArea(parent) {
        var that = this;
        this.arrows = new Array();
        this.enabled = false;

        /** Constructor **/
        if(isset(parent)){
            NeonMusicComponent.call(this, {
                'grid' : parent.grid(),
                'parent' : parent,
                'x' : 0,
                'y' : 0,
                'genre' : NeonMusicComponent.GenreEnum.DetectionArea
            });
            //Init arrows
            $.each(Arrow.Orientation, function(i, p) {
                that.arrows.push(new Arrow({'grid':that.grid(), 'parent':that, 'x':p.x/2, 'y':p.y/2, 'type':Arrow.TypeEnum.DESIGN, 'orientation':p}));
            });
            this.arrows.forEach(function(el){
                el.selector().hide();
            });
        }

        /** Event bindind **/
        this.selector().hover(
            function(){
                that.enable();
            },
            function(){
                that.disable();
            }
        );
    }
    DetectionArea.prototype = new NeonMusicComponent();
    DetectionArea.prototype.enable = function(){
        if(!this.enabled){
            this.arrows.forEach(function(el){
                if(!el.isSet()){
                    el.selector().show();
                }
            });
            this.enabled = true;
        }
    };
    DetectionArea.prototype.disable = function(){
        this.arrows.forEach(function(el){
            if(!el.isSet()){
                el.selector().hide();
            }
        });
        this.enabled = false;
    };


    /**
     * SampleManager
     * @param param
     * @constructor
     */
    function SampleManager(param){
        var that = this;

        var ready = false;
        this.ready = function(){
            return ready;
        };

        var availableSampleList = new Array();
        this.availableSampleList = function(){
            return availableSampleList;
        };

        /**
         * Tempo in millisecondes
         */
        var tempo;
        this.tempo = function(_tempo){
            if(!isset(_tempo)){
                return tempo;
            }
            else{
                if(is_int(_tempo)){
                    tempo = _tempo;
                    return true;
                }
                return false;
            }
        };

        /** Constructor **/
        if(SampleManager.instance == null){
            soundManager.setup({
                url: SampleManager.soundManagerSwf,
                useFlashBlock: true, // optionally, enable when you're ready to dive in
                onready: function() {
                    ready = true;
                }
            });
            //Init availableSampleList
            SampleManager.defaultSamples.forEach(function(el){
                availableSampleList.push(el);
            });
            tempo = SampleManager.defaultTempo;
            SampleManager.instance = this;
        }
    }
    SampleManager.instance = null;
    SampleManager.soundManagerSwf = 'assets/javascript/soundmanager2/swf/';
    SampleManager.defaultTempo = 500;
    SampleManager.defaultSamples = [
        /*'assets/samples/PacMan/PacMan_Start.wav',
        'assets/samples/PacMan/PacMan_EatFruit.wav',
        'assets/samples/PacMan/PacMan_Ghosts.wav',
        'assets/samples/PacMan/PacMan_Tone01.wav',
        'assets/samples/PacMan/PacMan_Tone02.wav',         */
        'assets/samples/Piano/piano_A.mp3',
        'assets/samples/Piano/piano_B.mp3',
        'assets/samples/Piano/piano_C.mp3',
        'assets/samples/Piano/piano_D.mp3',
        'assets/samples/Piano/piano_E.mp3',
        'assets/samples/Piano/piano_F.mp3',
        'assets/samples/Piano/piano_G.mp3'
    ];

    /**
     * Sample Class
     * @param param : Object {url}
     * @constructor
     */
    function Sample(param)
    {
        var that = this;

        var instanceSM;

        var id;
        this.id = function(){
            return id;
        };

        var url;
        this.url = function(){
            return url;
        };

        this.loaded = function(){
            return instanceSM.loaded;
        };

        var duration;
        this.duration = function(){
            return duration;
        };

        /**
         * Retourne l'avancement du son en millisecondes
         */
        this.position = function(){
            return instanceSM.position;
        };

        this.volume = function(_volume){
            if(!isset(_volume)){
                return instanceSM.volume;
            }
            else{
                _volume = (_volume > 100) ? 100 : _volume;
                _volume = (_volume < 0) ? 0 : _volume;
                instanceSM.volume =  _volume;
                return true;
            }
        };

        /** Constructor **/
        if(isset(param)){
            if(SampleManager.instance.ready()){
                instanceSM = soundManager.createSound({
                        id : "S" + Sample.lastId,
                        url : param.url
                    });
                Sample.lastId++;
                id = instanceSM.sID;
                this.load();
                url = instanceSM.url;
                duration = instanceSM.duration;
            }
        }
    }
    Sample.lastId = 0;
    Sample.prototype.load = function(){
        soundManager.load(this.id());
    };
    Sample.prototype.unload = function(){
        soundManager.unload(this.id());
    };
    Sample.prototype.destroy = function(){
        soundManager.destroySound(this.id());
    };
    Sample.prototype.play = function(){
        soundManager.play(this.id());
    };


    /******************************************/
    /*                 Factory                */
    /*                                        */
    /******************************************/

    /**
     * Factory
     * @param options
     * @return {*}
     */
    $.fn.neonMusic = function(options)
    {
        return this.each(function()
        {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('neonMusic')) return;

            // Pass options to plugin constructor
            var instance = new NeonMusic(this, options);
            // Save instance
            element.data('neonMusic', instance);
        });
    };
})(jQuery);