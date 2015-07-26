'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {
	const win = new BrowserWindow({
		width: 1000,
		height: 1000,
		resizable: true
	});

	win.loadUrl(`file://${__dirname}/UI/dist/index.html`);
	win.on('closed', onClosed);

	return win;
}

function onClosed() {
	// deref the window
	// for multiple windows store them in an array
	mainWindow = null;
}

// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function () {
	mainWindow = createMainWindow();
});

////Socket IO


var io = require('socket.io')(1415);

io.on('connection', function (socket) {
	console.log('Connected');

	// In main process.
	var ipc = require('ipc');

	//Listen for invoke calls
	ipc.on('invoke', function (event, data) {
		socket.emit('invoke', data);

		//Listen for reply from clients
		socket.on('reply', function (data) {
			event.sender.send('reply', data);
		});
	});



	// ipc.on('asynchronous-message', function(event, arg) {
	// 	console.log(arg);  // prints "ping"
	// 	socket.emit('invoke', arg);
	//
	// 	socket.on('reply', function (data) {
	// 		console.log(data);
	// 		event.sender.send('asynchronous-reply', data);
	// 	});
	// });

// 	ipc.on('synchronous-message', function(event, arg) {
// //		console.log(arg);  // prints "ping"
// //		event.returnValue = 'pong';
// 		console.log('Sending message to client2!');
// 		socket.emit('invoke', { name: 'getActivePath' });
// 	});
//
//
//
//
// //	console.log('on connection');
//  	// 	socket.emit('news', { hello: 'world' });
// 	 socket.on('reply', function (data) {
// 	   console.log(data);
// 	 });
});
