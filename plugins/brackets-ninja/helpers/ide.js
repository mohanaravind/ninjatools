window.define(function (require, exports, module) {
	'use strict';

	var IDE = {},
		STATE = {
			HIDDEN: 'is-hidden'
		};

	//Private functions
	IDE._initView = function () {
		//Initialize the settings template
		this._view = document.createElement('div');
		this._view.setAttribute('id', 'ninja_tools_view');
		this._view.innerHTML = require('text!templates/settings.html');
		document.body.appendChild(this._view);

		this._settings = document.getElementById('ninja_tools_settings');
	};

	//The events which can be emitted from IDE
	IDE.EVENTS = {
		ICON_CLICK: 'iconclick'
	};

	//Initialize the IDE helper
	IDE.init = function (brackets) {
		this.brackets = brackets;

		//Add event dispatching capability to IDE
		IDE.load('utils/EventDispatcher').makeEventDispatcher(IDE);

		//Load the style sheet
		IDE.load('utils/ExtensionUtils').loadStyleSheet(module, '../styles/style.css');

		//Initialize the view
		//Add it to the event queue
		window.setTimeout(function () {
			IDE._initView();
		}, 0);
	};

	//Wraper to easily load brackets modules
	IDE.load = function (moduleName) {
		var module;

		try {
			module = this.brackets.getModule(moduleName);
		} catch (ex) {
			console.warn('Unable to find the module ' + moduleName);
		}

		return module;
	};

	//Adds the sidebar menu icon
	IDE.addSideBarMenuIcon = function () {
		var APP_ICON = 'ninja_icon',
			onClick;

		//Delegate the event
		onClick = function () {
			IDE.trigger(IDE.EVENTS.ICON_CLICK);
		};

		//Add toolbar icon
		$('<a>')
			.attr({
				id: APP_ICON,
				href: '#',
				class: APP_ICON + ' is-disconnected',
				title: 'Ninja Tools'
			})
			.click(onClick)
			.appendTo($('#main-toolbar .buttons'));
	};

	//Shows the settings
	IDE.showSettings = function () {
		this._settings.classList.remove(STATE.HIDDEN);
	};

	return IDE;
});
