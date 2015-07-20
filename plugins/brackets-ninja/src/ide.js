window.define(function (require, exports, module) {
	'use strict';

	var IDE = {},
		STATE = {
			HIDDEN: 'is-hidden'
		},
		PREFERENCE_DEFAULTS = {
			connection_url: 'http://localhost:9595'
		},
		APP_NAME = 'brackets-ninja';

	//Private functions
	IDE._initView = function () {
		//Initialize
		this._views = {};
		this.preference = null;

		try {
			//Include the views
			this._insertSettings();

			//Generate the node findings
			this._initNodeFinding('settings');

			//Wireup event listeners
			this._wireSettings();

			//Sync preference
			this._syncPreference();

			//Trigger the ready event
			this.trigger(IDE.EVENTS.READY);
		} catch (e) {
			console.warn(e);
		}
	};

	IDE._insertSettings = function (name) {
		var view;

		//Initialize the settings template
		view = document.createElement('div');
		view.setAttribute('data-ninja-view', 'settings');

		view.innerHTML = require('text!templates/settings.html');
		document.body.appendChild(view);

		Object.defineProperty(this._views, 'settings', {
			get: function () {
				return document.querySelector('[data-ninja-view="settings"]');
			}
		});
	};

	IDE._getItemById = function (view, id) {
		return document.querySelector('[data-ninja-view="' + view + '"] [data-id="'+ id +'"]');
	};

	IDE._initNodeFinding = function (viewName) {
		var view = this._views[viewName];

		[].forEach.call(view.querySelectorAll('[data-id]'), function (item) {
			Object.defineProperty(view, '$' + item.dataset.id, {
				get: IDE._getItemById.bind(IDE, viewName, item.dataset.id)
			});
		}, this);
	};


	IDE._wireSettings = function () {
		var settings;

		settings = this._views.settings;

		//Add methods
		settings.show = function () {
			//Clear the inline style if present
			settings.$container.style.display = '';
			settings.$container.classList.remove(STATE.HIDDEN);
		};

		settings.hide = function () {
			settings.$container.classList.add(STATE.HIDDEN);
		};

		//Add listeners
		settings.$cancel.addEventListener('click', function (event) {
			//Restore the preference to the last saved value
			this._restore(this.preference);
			settings.hide();
			event.stopPropagation();
		}.bind(this));

		settings.$done.addEventListener('click', function (event) {
			this._syncPreference();
			settings.hide();
			event.stopPropagation();
		}.bind(this));

		settings.$restore.addEventListener('click', function (event) {
			this._restore(PREFERENCE_DEFAULTS);
			event.stopPropagation();
		}.bind(this));
	};

	IDE._syncPreference = function () {
		var PreferenceManager = IDE.load('preferences/PreferencesManager');

		//Get the preference if not yet fetched
		if (!this.preference) {
			this.preference = PreferenceManager.get(APP_NAME) || PREFERENCE_DEFAULTS;
			this._views.settings.$url.value = this.preference.connection_url;
		} else {
			//Save the preferences
			this.preference.connection_url = this._views.settings.$url.value;
			PreferenceManager.set(APP_NAME, this.preference);
		}
	};

	IDE._restore = function (pref) {
		//Set the view back to defaults
		this._views.settings.$url.value = pref.connection_url;
	};

	//The events which can be emitted from IDE
	IDE.EVENTS = {
		ICON_CLICK: 'iconclick',
		READY: 'ready'
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
			IDE._views.settings.show();
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


	return IDE;
});
