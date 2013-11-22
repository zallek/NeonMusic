/**
 * Created with JetBrains PhpStorm.
 * User: Nicolas Fortin
 * Date: 19/03/13
 * Time: 21:58
 */

(function($) {
    $.fn.neonMusic = function() {
        //params = $.extend( {length: 0}, params);
        var gridScale = 60;

        this.each(function() {
            var frame = $(this);
            var grid = new Grid({
                'container' : frame,
                'scale' : gridScale
            });
            var node1 = new Node({
                'grid' : grid,
                'parent' : grid,
                'x' : 0,
                'y' : 0
            });
            /*var node2 = new Node({
                'grid' : grid,
                'parent' : grid,
                'x' : 0,
                'y' : 0,
                'type' : Node.TypeEnum.FILLED
            });   */

            $("#Action").click(function(){
                grid.selector().addClass("dark");
                parcours(node1);
            });

            var parcours = function(_node){
                setTimeout(function(){
                    //Action on himself
                    _node.type(Node.TypeEnum.FILLED);
                    //Action on parent

                    var childArrows = _node.childArrows();
                    childArrows.forEach(function(el){
                        if(el != null){
                            parcours(el.nextNode());
                        }
                    });
                }, 500);
                _node.type(Node.TypeEnum.RED);
            };

            // Allow Jquery chaining
            return this;
        });
    };

    /**
     * Grid class
     * @param param : Object {container, scale}
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

        var nodes = Array();
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
            scale = param.scale;
            domId = Grid.Param.id;
            container.append("<div class='"+Grid.Param.className+"' id='"+domId+"'/>");
            selector = $("#"+domId);
            width = selector.width();
            height = selector.height();
        }
    }
    Grid.Param = {
        'className' : 'grid',
        'id' : 'Grid'
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
        Node :  { abg : 'N', className : 'node', lastId : 0 },
        Arrow : { abg : 'A', className: 'arrow', lastId : 0 },
        DetectionArea : { abg : 'DA', className: 'detectionArea', lastId : 0 }
    };


    /**
     * Node Class
     * @param param : Object {grid, parent, x, y, (type)}
     * @constructor
     */
    function Node(param){
        var that = this;
        var detectionArea;
        this.detectionArea = function(){
            return detectionArea;
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
        NeonMusicComponent.call(this, {
            'grid' : param.grid,
            'parent' : param.parent,
            'x' : param.x,
            'y' : param.y,
            'genre' : NeonMusicComponent.GenreEnum.Node,
            'type' : !isset(param.type) ? Node.TypeEnum.EMPTY : param.type
        });
        this.grid().nodes(param.x, param.y, this);
        detectionArea = new DetectionArea(this);
    }
    Node.prototype = new NeonMusicComponent();
    Node.TypeEnum = {
        EMPTY : { className : "empty" },
        FILLED : { className : "filled" },
        RED : { className : "red" }
    };


    /**
     * Arrow Class
     * @param param : Object {grid, parent, x, y, type}
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

        this.isSet = function(){
            return isset(nextNode);
        };

        /** Constructor **/
        NeonMusicComponent.call(this, {
            'grid' : param.grid,
            'parent' : param.parent,  //DetectionArea  -> Node
            'x' : param.x,
            'y' : param.y,
            'genre' : NeonMusicComponent.GenreEnum.Arrow,
            'type' : param.type
        });

        this.selector().click(function(){
            if(!that.isSet())
            {
                var params = {
                    'grid' : that.grid(),
                    'parent' : that.grid(),
                    'x' : that.parent().parent().x(),
                    'y' : that.parent().parent().y()
                };

                $.each(Arrow.TypeEnum, function(i, p){
                    if(that.type() == p){
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
        });
    }
    Arrow.prototype = new NeonMusicComponent();
    Arrow.TypeEnum = {
        UP :    { className : "up" ,    x:  0, y:+1},
        DOWN :  { className : "down" ,  x:  0, y:-1},
        LEFT :  { className : "left" ,  x: -1, y: 0},
        RIGHT : { className : "right" , x: +1, y: 0}
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

        NeonMusicComponent.call(this, {
            'grid' : parent.grid(),
            'parent' : parent,
            'x' : 0,
            'y' : 0,
            'genre' : NeonMusicComponent.GenreEnum.DetectionArea
        });
        //Init arrows
        $.each(Arrow.TypeEnum, function(i, p) {
            that.arrows.push(new Arrow({'grid':that.grid(), 'parent':that, 'x':p.x/2, 'y':p.y/2, 'type':p}));
        });
        this.arrows.forEach(function(el){
            el.selector().hide();
        });

        //Bind Events
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


})(jQuery);