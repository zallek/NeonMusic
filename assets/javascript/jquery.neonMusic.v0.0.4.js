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
                    _node.type(Node.TypeEnum.RED)
                    var childArrows = _node.childArrows();
                    childArrows.forEach(function(el){
                        if(el != null){
                            parcours(el.nextNode());
                        }
                    });
                }, 500);
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
        detectionArea = new DetectionArea(this);

        /*this.selector().click(function () {
            that.type(Node.TypeEnum.FILLED);
        });  */
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
            'parent' : param.parent,  //Node
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
                    'x' : that.parent().x(),
                    'y' : that.parent().y()
                };

                switch(that.type()){
                    case Arrow.TypeEnum.UP:
                        params.y++;
                        that.nextNode(new Node(params));
                        break;
                    case Arrow.TypeEnum.DOWN :
                        params.y--;
                        that.nextNode(new Node(params));
                        break;
                    case Arrow.TypeEnum.LEFT :
                        params.x--;
                        that.nextNode(new Node(params));
                        break;
                    case Arrow.TypeEnum.RIGHT :
                        params.x++;
                        that.nextNode(new Node(params));
                        break;
                }
            }
        });
    }
    Arrow.prototype = new NeonMusicComponent();
    Arrow.TypeEnum = {
        UP : { className : "up" },
        DOWN : { className : "down" },
        LEFT : { className : "left" },
        RIGHT : { className : "right" }
    };


    /**
     * Detection Area
     * @param parent Object
     * @constructor
     */
    function DetectionArea(parent) {
        var that = this;
        this.arrows = null;
        this.enabled = false;

        NeonMusicComponent.call(this, {
            'grid' : parent.grid(),
            'parent' : parent, //parent.grid(),
            'x' : 0, //parent.x(),
            'y' : 0, //parent.y(),
            'genre' : NeonMusicComponent.GenreEnum.DetectionArea
        });
        this.arrows = [
            new Arrow({'grid':this.grid(), 'parent':this.parent(), 'x':0, 'y':+0.5, 'type':Arrow.TypeEnum.UP}),
            new Arrow({'grid':this.grid(), 'parent':this.parent(), 'x':0, 'y':-0.5, 'type':Arrow.TypeEnum.DOWN}),
            new Arrow({'grid':this.grid(), 'parent':this.parent(), 'x':-0.5, 'y':0, 'type':Arrow.TypeEnum.LEFT}),
            new Arrow({'grid':this.grid(), 'parent':this.parent(), 'x':+0.5, 'y':0, 'type':Arrow.TypeEnum.RIGHT})
        ];
        this.arrows.forEach(function(el){
            el.selector().hide();
        });


        this.selector().mouseenter(function(){
            that.enable();
        });
        this.selector().mouseout(function(){
            that.disable();
        });
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