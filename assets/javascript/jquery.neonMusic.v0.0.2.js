/**
 * Created with JetBrains PhpStorm.
 * User: Nicolas Fortin
 * Date: 19/03/13
 * Time: 21:58
 */

(function($) {
    $.fn.neonMusic = function() {
        //params = $.extend( {length: 0}, params);

        this.each(function() {
            var frame = $(this);
            var node1 = new Node(frame, 250, 250);
            var node2 = new Node(frame, 300, 250);
            node1.setXY(500,20);
            node1.type.set(Node.TypeEnum.FILLED);
        });

        // Allow Jquery chaining
        return this;
    };

    /**
     * Abstract class NeonMusicComponent
     * @param _container
     * @param _genre
     * @constructor
     */
    function NeonMusicComponent(_container, _genre) {
        var that = this;

        var container;
        this.container = {
            get : function(){
                return container;
            }
        };

        var genre;
        this.genre = {
            get : function(){
                return genre;
            }
        };

        var domId;
        this.domId = {
            get : function(){
                return domId;
            }
        };

        var selector;
        this.selector = {
            get : function(){
                return selector;
            }
        };

        var width;
        this.width = {
            get : function(){
                return width;
            }
        };

        var height;
        this.height = {
            get : function(){
                return height;
            }
        };

        var x;
        this.x = {
            get : function(){
                return x;
            },
            set : function(_x){
                x = _x - width/2;
                that.move();
            }
        };

        var y;
        this.y = {
            get : function(){
                return y;
            },
            set : function(_y){
                y = _y - width/2;
                that.move();
            }
        };

        var type;
        this.type = {
            get : function(){
                return type;
            },
            set : function(_type){
                if(typeof type !== "undefined")
                    selector.removeClass(type.className);
                type = _type;
                selector.addClass(type.className);
                width = selector.width();
                height = selector.height();
            }
        };

        /** Constructor **/
        if(typeof _container !== "undefined" && typeof _genre !== "undefined"){
            container = _container;
            genre = _genre;
            domId = genre.abg + genre.lastId;
            container.append("<div class='"+genre.className+"' id='"+domId+"'/>");
            genre.lastId++;
            selector = $("#"+domId);
        }
    }
    NeonMusicComponent.prototype.move = function(){
        this.selector.get().css({
            'left' : this.x.get() + 'px',
            'bottom' : this.y.get() + 'px'
        });
    };
    NeonMusicComponent.prototype.setXY = function(_x, _y) {
        this.x.set(_x);
        this.y.set(_y);
    };
    NeonMusicComponent.GenreEnum = {
        Node : {
            abg : 'N',
            className : 'node',
            lastId : 0
        },
        Arrow : {
            abg : 'A',
            className: 'arrow',
            lastId : 0
        }
    };


    /**
     * Node Class
     * @param _container
     * @param _x
     * @param _y
     * @param _type
     * @constructor
     */
    Node.TypeEnum = {
        EMPTY : { className : "empty" },
        FILLED : { className : "filled" }
    };
    function Node(_container, _x, _y, _type) {
        NeonMusicComponent.call(this, _container, NeonMusicComponent.GenreEnum.Node);

        //Create DomNode
        /*this.domId = "N"+Node.lastId;
        Node.lastId++;
        this.container.append("<div class='node' id='"+this.domId+"'/>");
        this.selector = $("#"+this.domId); */
        this.type.set((typeof _type === "undefined") ? Node.TypeEnum.EMPTY : _type);
        //this.setXY(_x, _y);


        //Bind events
        this.selector.get().click(function () {
            this.type.set(Node.TypeEnum.FILLED);
        });

        /*this.selector.get().hover(function () {
            new Arrow(this.container.get(), this.x.get(), this.y.get()+20, Arrow.TypeEnum.UP);
            new Arrow(this.container.get(), this.x.get(), this.y.get()-40, Arrow.TypeEnum.DOWN);
            new Arrow(this.container.get(), this.x.get()-40, this.y.get(), Arrow.TypeEnum.LEFT);
            new Arrow(this.container.get(), this.x.get()+20, this.y.get(), Arrow.TypeEnum.RIGHT);
        });           */
    }
    Node.prototype = new NeonMusicComponent();


    function Arrow(_container, _x, _y, _type) {
        var that = this;  //used to make the object available to the private methods
        var container = _container;
        var domId;
        var selector;
        var width;
        var height;
        var x = _x;
        var y = _y;
        var type = _type;

        /** Private Methods **/
        var construct = function() {
            //Create DomNode
            domId = "N"+Arrow.lastId;
            Arrow.lastId++;
            container.append("<div class='arrow' id='"+domId+"'/>");
            selector = $("#"+domId);
            selector.addClass(type.className);

            //Init instance variables
            width = selector.width();
            height = selector.height();

            //Bind events
            selector.click($.proxy(function () {
                this.setType(Node.TypeEnum.FILLED);
            },that));

            //Place
            move();
        };

        var move = function(){
            selector.css({
                'left' : x + 'px',
                'bottom' : y + 'px'
            })
        };

        var setX = function(_x){
            x = _x - width/2;
        };

        var setY = function(_y){
            y = _y - height/2;
        };

        /** Privilege Methods **/
        this.setType = function(_type){
            selector.removeClass(type.className);
            type = _type;
            selector.addClass(type.className);
        };

        this.setXY = function (_x, _y) {
            setX(_x);
            setY(_y);
            move();
        };

        construct();
    }
    Arrow.lastId = 0;
    Arrow.TypeEnum = {
        UP : { className : "up" },
        DOWN : { className : "down" },
        LEFT : { className : "left" },
        RIGHT : { className : "right" }
    }
})(jQuery);