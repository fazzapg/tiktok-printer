const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 🔥🔥🔥 غير هذا الاسم لاسم حسابك في تيك توك (بدون @) 🔥🔥🔥
const tiktokUsername = "t8qee"; 

let tiktokConnection = new WebcastPushConnection(tiktokUsername);

tiktokConnection.connect().then(state => {
    console.log(`✅ متصل بغرفة تيك توك: ${state.roomId}`);
}).catch(err => console.error('❌ فشل الاتصال:', err));

tiktokConnection.on('member', data => {
    io.emit('tiktok_event', { name: data.uniqueId, pic: data.profilePictureUrl, action: "متابعة جديدة 💙" });
});

tiktokConnection.on('gift', data => {
    if (data.giftType === 1 && !data.repeatEnd) return;
    io.emit('tiktok_event', { name: data.uniqueId, pic: data.profilePictureUrl, action: `أرسل ${data.giftName} (x${data.repeatCount}) 🎁` });
});

tiktokConnection.on('chat', data => {
    io.emit('tiktok_event', { name: data.uniqueId, pic: data.profilePictureUrl, action: `علق: ${data.comment} 💬` });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('🚀 Server running'));
