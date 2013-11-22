/**
 * Created with JetBrains PhpStorm.
 * User: Nicolas Fortin
 * Date: 19/03/13
 * Time: 21:58
 */

(function($) {
    $.fn.neonMusic = function() {
        //params = $.extend( {length: 0}, params);
        var gridScale = 30;

        this.each(function() {
            var frame = $(this);
            var grid = new Grid(frame, gridScale);
            var node1 = new Node(grid, 2, 1);
            var node2 = new Node(grid, 10, 4);
            node1.type(Node.TypeEnum.FILLED);
        });

        // Allow Jquery chaining
        return this;
    };

    /**
     * Grid class
     * @param _container
     * @param _scale
     * @constructor
     */
    function Grid(_container, _scale){
        var container;
        var domId;

        var scale;
        this.scale = function(){
            return scale;
        }

        var selector;
        this.selector = function(){
            return selector;
        };

        /** Constructor **/
        if(isset(_container) && isset(_scale)){
            container  = _container;
            scale = _scale;
            domId = Grid.Param.id;
            container.append("<div class='"+Grid.className+"' id='"+domId+"'/>");
            selector = $("#"+domId);
        }
    }
    Grid.Param = {
        'className' : 'Grid',
        'id' : 'Grid'
    };
    /**
     * Abstract class NeonMusicComponent
     * @param _grid
     * @param _genre
     * @constructor
     */
    function NeonMusicComponent(_grid, _genre) {
        var that = this;

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

        var grid;
        this.grid = function(){
            return grid;
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
                type = _type;
                selector.addClass(type.className);
                width = selector.width();
                height = selector.height();
                return true;
            }
        };

        /** Constructor **/
        if(isset(_grid) && isset(_genre)){
            grid = _grid;
            container = _grid.selector();
            genre = _genre;
            domId = genre.abg + genre.lastId;
            container.append("<div class='"+genre.className+"' id='"+domId+"'/>");
            genre.lastId++;
            selector = $("#"+domId);
        }
    }
    NeonMusicComponent.prototype.move = function(){
        var px = this.x()*this.grid().scale() - this.width()/2;
        var py = this.y()*this.grid().scale() - this.height()/2;
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
     * @param _container
     * @param _x
     * @param _y
     * @param _type
     * @constructor
     */
    function Node(_container, _x, _y, _type) {
        var that = this;
        /*var detectionArea;
        this.detectionArea = function(){
            return detectionArea;
        }     */

        /** Constructor **/
        NeonMusicComponent.call(this, _container, NeonMusicComponent.GenreEnum.Node);
        this.type(!isset(_type) ? Node.TypeEnum.EMPTY : _type);
        this.setXY(_x, _y);
        //detectionArea = new DetectionArea(this);

        this.selector().click(function () {
            that.type(Node.TypeEnum.FILLED);
        });

        /*this.selector().hover(function () {
            that.detectionArea.disable();
        });  */
        this.selector().hover(function () {
            new Arrow(that.grid(), that.x(), that.y()+1, Arrow.TypeEnum.UP);
            new Arrow(that.grid(), that.x(), that.y()-1, Arrow.TypeEnum.DOWN);
            new Arrow(that.grid(), that.x()-1, that.y(), Arrow.TypeEnum.LEFT);
            new Arrow(that.grid(), that.x()+1, that.y(), Arrow.TypeEnum.RIGHT);
        });
    }
    Node.prototype = new NeonMusicComponent();
    Node.TypeEnum = {
        EMPTY : { className : "empty" },
        FILLED : { className : "filled" }
    };


    /**
     * Arrow Class
     * @param _container
     * @param _x
     * @param _y
     * @param _type
     * @constructor
     */
    function Arrow(_container, _x, _y, _type) {
        var that = this;

        /** Constructor **/
        NeonMusicComponent.call(this, _container, NeonMusicComponent.GenreEnum.Arrow);
        this.type(_type);
        this.setXY(_x, _y);

        this.selector().click(function(){
            if(that.type() == Arrow.TypeEnum.UP)
                new Node(that.grid(), that.x(), that.y()+1);
            else if(that.type() == Arrow.TypeEnum.DOWN)
                new Node(that.grid(), that.x(), that.y()-1);
            else if(that.type() == Arrow.TypeEnum.LEFT)
                new Node(that.grid(), that.x()-1, that.y());
            else if(that.type() == Arrow.TypeEnum.RIGHT)
                new Node(that.grid(), that.x()+1, that.y());
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
     * @param _container
     * @constructor
     */
    /*function DetectionArea(_container) {
        var that = this;
        this.arrows = null;

        NeonMusicComponent.call(this, _container, NeonMusicComponent.GenreEnum.DetectionArea);
        this.setXY(this.container().x(), this.container.y());

        this.selector().mouseout(function(){
            that.disable();
        });
    }
    DetectionArea.prototype = new NeonMusicComponent();
    DetectionArea.prototype.enable = function(){
        this.arrows = {
            '1' : new Arrow(this.grid(), this.x(), this.y()+1, Arrow.TypeEnum.UP),
            '2' : new Arrow(this.grid(), this.x(), this.y()-1, Arrow.TypeEnum.DOWN),
            '3' : new Arrow(this.grid(), this.x()-1, this.y(), Arrow.TypeEnum.LEFT),
            '4' : new Arrow(this.grid(), this.x()+1, this.y(), Arrow.TypeEnum.RIGHT)
        }
    }
    DetectionArea.prototype.disable = function(){
        this.arrows.forEach(function(el){
            el.selector().remove();
        });
    }  */

})(jQuery);