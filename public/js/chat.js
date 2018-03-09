var socket= io();
function scrollToBottom(){
//selectors
//heights
var messages = jQuery('#messages');
var newMessage = messages.children('li:last-child');
var clientHeight = messages.prop('clientHeight');
var scrollTop = messages.prop('scrollTop');
var scrollHeight = messages.prop('scrollHeight');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight= newMessage.prev().innerHeight();
if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
    messages.scrollTop(scrollHeight);
}
}
socket.on('connect',function () {
    console.log('connected to server');   
});
socket.on('disconnect',function () {
    console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
    let formattedTime = moment(message.createdAt).format('h:mm a'); 
    let template = jQuery('#message-template').html();
    let html=Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    
// 
// var li =jQuery('<li></li>');
// li.text(`${message.from} ${formattedTime}:${message.text}`);
// jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
let formattedTime = moment(message.createdAt).format('h:mm a'); 
let template = jQuery('#location-message-template').html();
    let html=Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
// var li = jQuery('<li></li>');
// var a = jQuery('<a target ="_blank">My Current location</a>');
// li.text(`${message.from}${formattedTime}:`);
// a.attr('href',message.url);
// li.append(a);
// jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
//     from:'spoorthy',
//     text:'I am mental'
// },function(data){
//     console.log('got it',data);
// });

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from:'User',
        text:messageTextbox.val()
    },function(){
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
      return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled','disabled').text('Sending location');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');
       socket.emit('createLocation',{
           latitude:position.coords.latitude,
           longitude:position.coords.longitude
       });
    },function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('unable to fetch location');
    })
})

