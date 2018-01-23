const io = require('socket.io')(3000);
const arrUserInfo=[];


io.on('connection',socket =>{
    socket.on('NGUOI_DUNG',username=>{
        const isExist=arrUserInfo.some(e=>e.ten===username.ten);
        socket.peerId=username.peerId;
        if(isExist){
            return socket.emit('DANG_KY_THAT_BAT');
        }
        arrUserInfo.push(username);
        socket.emit('Danh_Sach_Online',arrUserInfo);
        socket.broadcast.emit('Co_Nguoi_Moi',username);
    });
    socket.on('disconnect',()=>{
        const index= arrUserInfo.findIndex(username=>username.peerId===socket.peerId);
        arrUserInfo.slice(index,1);
        io.emit('Ai_Do_off',socket.peerId);
    });
});