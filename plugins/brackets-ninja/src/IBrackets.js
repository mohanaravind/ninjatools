//Interface for brackets with the ninja tools
window.define(function (require, exports, module) {
	'use strict';

	var IBrackets = {};

  IBrackets.handle = function (socket) {
    this.socket = socket;
		console.log(this.socket);

		socket.on('discover', function (data) {
			console.log(data);

			socket.emit('from', {name: 'ara'});
		});

  };


	return IBrackets;
});
