/**
 * Camera / Microphone Access Demo
 * @author Matt Null - http://github.com/mattnull
 */

var CameraAccessDemo = (function(){
    // Put video listeners into place
    $('#camera').on('click', function(){
        var video = document.getElementById('video');

        //request camera acces 
        navigator.webkitGetUserMedia(
            {video: true, audio: true}, // Options
            function(localMediaStream) { // Success
                // create an object URL and assign it to the source of our video element
                video.src = window.webkitURL.createObjectURL(localMediaStream);
            },
            function(err) { // Failure
                console.log('getUserMedia failed: Code ' + err.code);
            }
        );
    });
});