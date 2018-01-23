const socket=io('http://localhost:3000');
$('#div-chat').hide();
socket.on('Danh_Sach_Online',arrUserInfo=>{

    $('#div-chat').show();
    $('#div-dang-ky').hide();

    console.log(arrUserInfo);
    arrUserInfo.forEach(username => {
        const{ten,peerId}=username;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('Co_Nguoi_Moi',username =>{
        console.log(username);
        const {ten,peerId}=username;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('Ai_Do_off',peerId=>{
        $(`#${peerId}`).remove();
    });

});

socket.on('DANG_KY_THAT_BAT',()=>alert('Vui long chon ten khac'));

function openStream(){
    const config={audio:false,video:true};
   return navigator.mediaDevices.getUserMedia(config);

}
function playStream(idVideoTag,stream){
    const video=document.getElementById(idVideoTag);
    video.srcObject=stream;
    video.play();
}
// openStream()
// .then(stream=>playStream('localStream',stream));
const peer = new Peer({key: 'peerjs',host:'web-rtc-vinh.herokuapp.com',secure:true,port:443});
peer.on('open',id=>{
 $('#my-peer').append(id);
 $('#btnSignUp').click(()=>{
    const username=$('#txtUserName').val();
    socket.emit('NGUOI_DUNG',{ten:username,peerId:id});
    
});
});

//caller
$('#btnCall').click(()=>{
    const id=$('#remoteId').val();
    openStream()
    .then(stream=>{
        playStream('localStream',stream);
        const call=peer.call(id,stream);
        call.on('stream',remoteStream=>playStream('remoteStream',remoteStream));
    });
}); 
// callee
peer.on('call',call=>{
    openStream()
    .then(stream=>{
        call.answer(stream);
        playStream('localStream',stream)
        call.on('stream',remoteStream=>playStream('remoteStream',remoteStream));
    })
});

$('#ulUser').on('click','li',function(){
    const id= $(this).attr('id');
    openStream()
    .then(stream=>{
        playStream('localStream',stream);
        const call=peer.call(id,stream);
        call.on('stream',remoteStream=>playStream('remoteStream',remoteStream));
    });
});
