window.define(function (require, exports, module) {
	'use strict';

	var SOCKET_IO_SRC = 'https://cdn.socket.io/socket.io-1.2.0.js',
		AppInit = brackets.getModule("utils/AppInit");

	/*
			Adds the Socket IO reference to brackets
			@param src {string} The source path to the socket io script
	*/
	function addIOScript (src) {
		var ioScript = document.createElement('script'),
			promise;


			var socket = document.createElement('link');

			socket.setAttribute('rel', 'import');
			socket.setAttribute('href', 'http://localhost:8080/socket.html');

			document.body.appendChild(socket);

			//Add the source
			ioScript.setAttribute('src', src);

			//Create a promise
			promise = new Promise(function(resolve, reject) {
				//Once the io script is added
				ioScript.addEventListener('load', function (event) {
					console.log(event);
					resolve();
				});
			});

		//Append the io script to the DOM
		//document.body.appendChild(ioScript);

		//Return a promise
		return promise;
	}

	/*
			Adds the Socket IO reference to brackets
			@param src {string} The source path to the socket io script
	*/
	function connectToNinjaTools() {
		console.log('starting connection');
		console.log(io);
		// var socket = io('http://localhost:1415');
		// socket.on('news', function (data) {
		// 	console.log(data);
		// 	alert(data);
		// 	socket.emit('my other event', { my: 'datasss' });
		// });
	}

	//Initializes the extension
	function init() {
		var IDE = require('helpers/ide');

		//Initialize the IDE
		IDE.init(brackets);

		IDE.on(IDE.EVENTS.ICON_CLICK, function () {
			IDE.showSettings();
		});

		//Add the sidebar icon
		IDE.addSideBarMenuIcon();

		// var io = require("lib/io");
		//
		// var socket = io('http://localhost:1415');
		// socket.on('news', function (data) {
		// 	console.log(data);
		// 	//alert(data);
		// 	socket.emit('my other event', { my: 'datasss' });
		// });

	}


	//Initialize when the app is ready
	AppInit.appReady(init);



});
