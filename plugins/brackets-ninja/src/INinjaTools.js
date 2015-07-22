//Interface for Ninja tools
window.define(function (require, exports, module) {
	'use strict';

	var INinjaTools = {};

  INinjaTools.handle = function (socket, IIDE) {
		this.socket = socket;
		this.IIDE = IIDE;

		this.socket.on('invoke', INinjaTools.onInvoke);
  };

	//Returns the path of the currently active document
	//From the tools
	INinjaTools.onInvoke  = function (data) {
		INinjaTools.IIDE[data.name].call(INinjaTools, data.args).then(function (response) {
			//Set the response
			data.response = response;

			//Send back the reply
			INinjaTools.reply(data);
		}).catch(function (error) {
			INinjaTools.report(error);
		});
	};

	//To the tools
	INinjaTools.reply = function (data) {
		this.socket.emit('reply', data);
	};

	INinjaTools.report = function (error) {
		this.socket.emit('report', error);
	};


	return INinjaTools;
});
