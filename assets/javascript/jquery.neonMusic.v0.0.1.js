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
        });

        // Allow Jquery chaining
        return this;
    };

    function Node(_container, _x, _y, _type) {
        var that = this;  //used to make the object available to the private methods
        var container = _container;
        var domId;
        var selector;
        var width;
        var height;
        var x = _x;
        var y = _y;
        var type = (typeof _type === "undefined") ? Node.TypeEnum.EMPTY : _type;

        /** Private Methods **/
        var construct = function() {
            //Create DomNode
            domId = "A"+Node.lastId;
            Node.lastId++;
            container.append("<div class='node' id='"+domId+"'/>");
            selector = $("#"+domId);
            selector.addClass(type.className);

            //Init instance variables
            width = selector.width();
            height = selector.height();

            //Bind events
            selector.click($.proxy(function () {
                this.setType(Node.TypeEnum.FILLED);
            },that));

            selector.hover($.proxy(function () {
                new Arrow(that.getContainer(), that.getX(), that.getY()+20, Arrow.TypeEnum.UP);
                new Arrow(that.getContainer(), that.getX(), that.getY()-40, Arrow.TypeEnum.DOWN);
                new Arrow(that.getContainer(), that.getX()-40, that.getY(), Arrow.TypeEnum.LEFT);
                new Arrow(that.getContainer(), that.getX()+20, that.getY(), Arrow.TypeEnum.RIGHT);
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

        this.getContainer = function(){
            return container;
        };

        this.getX = function(){
            return x;
        };

        this.getY = function(){
            return y;
        };

        construct();
    }
    Node.lastId = 0;
    /*Node.TypeEnum = {
        EMPTY : { className : "empty" },
        FILLED : { className : "filled" }
    }     */

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