window.define(function (require, exports, module) {
	'use strict';

	var AppInit = brackets.getModule("utils/AppInit");

	/*
			Makes a web socket connection with the ninja tools
	*/
	function connectToNinjaTools(IDE) {
		var io = require('lib/io'),
			IBrackets = require('src/IBrackets'),
			socket;

		console.info('starting connection');

		//Make the connection
		socket = io(IDE.preference.connection_url);
		
		//Pass the socket to interface
		IBrackets.handle(socket);
	}

	//Initializes the extension
	function init() {
		var IDE = require('src/ide');

		try {
			//Initialize the IDE
			IDE.init(brackets);

			//Add the sidebar icon
			IDE.addSideBarMenuIcon();

			//When IDE is ready
			IDE.on('ready', function () {
				//Connect to ninja Tools
				connectToNinjaTools(IDE);
			});
		} catch (e) {
			console.warn(e);
		}
	}


	//Initialize when the app is ready
	AppInit.appReady(init);

});
