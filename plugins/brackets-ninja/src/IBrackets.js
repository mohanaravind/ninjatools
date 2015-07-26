//Interface for brackets
window.define(function (require, exports, module) {
	'use strict';

	var IBrackets = {};

	//Returns the path of the currently active document
	IBrackets.getActivePath  = function () {
		return new Promise(function(resolve, reject) {
			var DocumentManager = brackets.getModule('document/DocumentManager'),
				path;

			path = DocumentManager.getCurrentDocument().file.fullPath;
			resolve(path);
		});
	};

	//Returns the project root path
	IBrackets.getRootPath  = function () {
		return new Promise(function(resolve, reject) {
			var ProjectManager = brackets.getModule('project/ProjectManager'),
				path;

			path = ProjectManager.getProjectRoot().fullPath;

			resolve(path);
		});
	};

	IBrackets.getSelectedItem = function () {
		return new Promise(function(resolve, reject) {
			var ProjectManager = brackets.getModule('project/ProjectManager'),
				path;

			path = ProjectManager.getSelectedItem().fullPath;

			resolve(path);
		});
	};


	return IBrackets;
});
