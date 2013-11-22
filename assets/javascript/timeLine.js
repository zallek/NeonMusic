/**
 * Created with JetBrains PhpStorm.
 * User: User
 * Date: 02/04/13
 * Time: 21:48
 * To change this template use File | Settings | File Templates.
 */


TimeLine = (function() {
    function TimeLine(param) {
        this.tracks = new Array();
        this.color = param.color;

        /*****/
        $("TimeLine").css("position", "relative");

        this.addTrack({name : "N1", color : "#FF0000"});
        this.addTrack({name : "N2", color : "#00FF00"});
    }

    TimeLine.prototype.addTrack = function(node){
        this.tracks.push(new Track(node));
    };

    return TimeLine;

})();

Track = (function() {
    function Track(param) {
        var name = param.name;
        var color = param.color;
        var height = 30;

        var instance = Track.instanceNb;
        Track.instanceNb ++;

        /*****/
        $("TimeLine").append("<div id='T"+instance+"' class='track'></div>");
        var selector = $("T"+instance);
        selector.css({"position":"relative" , "top":instance*(height+10), "left":40, "height":height});
    }
    Track.instanceNb = 0;

    return Track;

})();