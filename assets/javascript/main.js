/**
 * Created with JetBrains PhpStorm.
 * User: User
 * Date: 19/03/13
 * Time: 22:03
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    $("#NeonMusic").neonMusic();
    var neonMusic = $("#NeonMusic").data('neonMusic');  //Get instance
    neonMusic.setDetailPane($("#DetailPane"));

    $("#Play").click(function(){
        neonMusic.animate();
    });
    $("#Stop").click(function(){
        neonMusic.stop();
        //location.reload();
    });
});