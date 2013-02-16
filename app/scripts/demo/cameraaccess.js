/**
 * Camera / Microphone Access Demo
 * @author Matt Null - http://github.com/mattnull
 */

var CameraAccessDemo = (function(){
    // Put video listeners into place
    $('#camera').on('click', function(){
        var stream;
        var video = document.getElementById('video');

        //request camera acces 
        navigator.webkitGetUserMedia(
            {video: true, audio: true}, // Options
            function(localMediaStream) { // Success
                console.log('success')
                stream = localMediaStream;
                // create an object URL and assign it to the source of our video element
                video.src = window.webkitURL.createObjectURL(stream);
            },
            function(err) { // Failure
                console.log('success')
                alert('getUserMedia failed: Code ' + err.code);
            }
        );
    });

});