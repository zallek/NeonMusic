/**
 * Created with JetBrains PhpStorm.
 * User: User
 * Date: 03/04/13
 * Time: 00:03
 * To change this template use File | Settings | File Templates.
 */

$.fn.zoomDom = function(params)
{
    return this.each(function()
    {
        var element = $(this);
        var scale = 100;

        //Params
        var step = 20;
        var minScale = 20;
        var maxScale = 200;
        var zoomX = true;
        var zoomY = true;

        element.mousewheel(function(event, delta, deltaX, deltaY) {
            var newScale = scale;
            if(delta == -1){ //DOWN
                newScale = scale - step;
            }
            else if(delta == 1){ //UP
               newScale = scale + step;
            }

            if(minScale <= newScale && newScale <= maxScale){
                var fact = newScale / scale;
                var func = function( index, value ) {
                    return parseFloat( value ) * fact;
                };
                var found = element.find("*");
                if(zoomX){
                    found.css({
                        left: func,
                        right: func,
                        width: func,
                        "margin-left": func,
                        "margin-right" : func
                    });
                }
                if(zoomY){
                    found.css({
                        top: func,
                        bottom: func,
                        height: func,
                        "margin-top": func,
                        "margin-bottom" : func
                    });
                }

                scale = newScale;
            }
            return false; //Prevent default wheel action
        });
    });

};