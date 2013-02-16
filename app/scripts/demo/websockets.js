/**
 * Web Sockets Demo
 * @author Matt Null - http://github.com/mattnull
 */
var WebSocketsDemo = (function(){

    var $count = $('#count');
    var $tweetList = $('#twitter-feed');
    var $tweetTemplate = $("#twitter-template");
    var tweetCount = 0;

    var Renderer = {
        addTweet : function(data){
            var source   = $tweetTemplate.html();
            var template = Handlebars.compile(source);
            var tweets = $tweetList;
            tweets.prepend(template(data))
        }
    };

    // http://thefutureisnow.nullempire.com
    // Connect to streaming server
    var socket = io.connect('http://thefutureisnow.nullempire.com',{
        port: 80
    });

    //This is the event when you recieve a tweet
    socket.on('tweets', function (data) {
        // append the tweet to the list
        Renderer.addTweet(data);
        console.log(data)
        //increment the tweet counter
        tweetCount++

        //update the count for the demo
        $count.text(tweetCount);

        //if desktop notifications were enabled then show them for each tweet
        if (window.webkitNotifications.checkPermission() === 0) {
           
            //create the notification
            var n = window.webkitNotifications.createNotification(
                false, 
                data.user.screen_name, 
                'Notification content...'
            );

            //show it
            n.show();
        }  
    });

    //When the user presses the enter key, emit an event to to tell the server to start streaming tweets
    $('#fetchTwitterData').on('keyup',function(e){
        if(e.keyCode === 13){
            var val = $(this).val();

            //new search, clear the tweet list
            $('#twitter-feed').html('');

            //some status text for demo
            $('#twitter-stream-status').text('Streaming Tweets...');

            //reset tweet count to zero for new search
            tweetCount = 0
            $count.show();

            //emit the event to the server telling it which value to search for
            socket.emit('fetchTweets', {search : val});
        }
    });

});