'use strict';

/**
 * Source chooser button
 *
 * This feature creates a button to speed media in different levels.
 */

// Translations (English required)
mejs.i18n.en["mejs.source-chooser"] = "Source Chooser";

// Feature configuration
Object.assign(mejs.MepDefaults, {
	/**
	 * @type {?String}
	 */
	sourcechooserText: null
});

Object.assign(MediaElementPlayer.prototype, {

	/**
	 * Feature constructor.
	 *
	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 * @param {$} controls
	 * @param {$} layers
	 * @param {HTMLElement} media
	 */
	buildsourcechooser (player, controls, layers, media)  {

		const
			t = this,
			sourceTitle = mejs.Utils.isString(t.options.sourcechooserText) ? t.options.sourcechooserText : mejs.i18n.t('mejs.source-chooser'),
			defaultSpeedText = "Normal",
			sources = [],
			children = t.mediaFiles ? t.mediaFiles : t.node.childNodes
		;

		// add to list
		let hoverTimeout;

		for (let i = 0, total = children.length; i < total; i++) {
			const s = children[i];

			if (t.mediaFiles) {
				sources.push(s);
			} else if (s.nodeName === 'SOURCE') {
				sources.push(s);
			}
		}
/*
		if (sources.length <= 1) {
			return;
		}
*/

var speeds = [
		{name : '0.25',value : 0.25}
		,{name : '0.5',value : 0.5}
		,{name : 'Normal',value : 1}
		,{name : '1.5',value : 1.5}
		,{name : '2.0',value : 2.0}
];
var speedsHTML = "";
for(let i=0;i<speeds.length;i++){
	let selected = "";
	if(speeds[i].value == 1){
		selected = "selected";
	}
	speedsHTML += `
		<li class="${t.options.classPrefix}settings-li toBeSelected ${selected}" data-value="${speeds[i].value}">
			<i class="material-icons">check</i>
			${speeds[i].name}
		</li>
	`;
}

		player.sourcechooserButton = document.createElement('div');
		player.sourcechooserButton.className = `${t.options.classPrefix}button ${t.options.classPrefix}sourcechooser-button`;
		player.sourcechooserButton.innerHTML =
			`<button type="button" role="button" aria-haspopup="true" aria-owns="${t.id}" title="${sourceTitle}" aria-label="${sourceTitle}" tabindex="0" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect ${t.options.classPrefix}settings-button">
				<i class="material-icons">settings</i>
		</button>` +
			`
	<div class="${t.options.classPrefix}settings-button-menu invisible">

				<ul class="${t.options.classPrefix}main-menu">
				  <li class="${t.options.classPrefix}settings-li flexbox-container switchtoggle">
						<span class="${t.options.classPrefix}settings-title flexbox-adjust">Autoplay</span>
						<span class="flexbox-spread">
							<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-autoplay">
						  	<input id="switch-autoplay" type="checkbox" class="mdl-switch__input" checked>
						  	<span class="mdl-switch__label"></span>
							</label>
						</span>
					</li>
					<li class="${t.options.classPrefix}settings-li flexbox-container switchtoggle">
						<span class="${t.options.classPrefix}settings-title flexbox-adjust">Annotation</span>
						<span class="flexbox-spread">
							<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-annotation">
						  	<input id="switch-annotation" type="checkbox" class="mdl-switch__input" checked>
						  	<span class="mdl-switch__label"></span>
							</label>
					</span>
					</li>
					<li class="${t.options.classPrefix}settings-li flexbox-container ${t.options.classPrefix}speed-menu-button">
							<span class="${t.options.classPrefix}settings-title flexbox-adjust">Speed</span>
							<span class="flexbox-spread">
								<span class="display_content">
									${defaultSpeedText}
								</span>
								<i class="material-icons">keyboard_arrow_right</i>
							</span>
					</li>
				  <li class="${t.options.classPrefix}settings-li flexbox-container">
							<span class="${t.options.classPrefix}settings-title flexbox-adjust">Subtitles</span>
					</li>
					<li class="${t.options.classPrefix}settings-li flexbox-container">
							<span class="${t.options.classPrefix}settings-title flexbox-adjust">Quality</span>
					</li>
			</ul>`+
`
		<ul class="${t.options.classPrefix}other-menu ${t.options.classPrefix}speed-menu not-visible">
			<li class="${t.options.classPrefix}back-menu flexbox-container">
				<span class="flexbox-adjust">
					<i class="material-icons">keyboard_arrow_left</i>
				</span>
				<span class="flexbox-spread">
					Back
				</span>
			</li>
			${speedsHTML}
		</ul>
  </div> `
			;
		t.addControlElement(player.sourcechooserButton, 'sourcechooser');

		var classname = player.sourcechooserButton.getElementsByClassName("switchtoggle");
		Array.from(classname).forEach(function(element) {
      element.addEventListener('click', (e) => {
				if(e.target == element || e.target.classList.contains("mejs__settings-title")){
					element.querySelector(".mdl-switch").click();
				}
			});
     });
		//componentHandler.upgradeElement(button);


/*
		for (let i = 0, total = sources.length; i < total; i++) {
			const src = sources[i];
			if (src.type !== undefined && typeof media.canPlayType === 'function') {
				player.addSourceButton(src.src, src.title, src.type, media.src === src.src);
			}
		}
*/
function closest(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    var parent;

    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}
		player.sourcechooserButton.querySelector(`.${t.options.classPrefix}back-menu`).addEventListener('click', (e) => {
					var back_menu = closest(e.target,`.${t.options.classPrefix}back-menu`);
					var settings_menu = closest(back_menu,`.${t.options.classPrefix}settings-button-menu`);
					settings_menu.querySelector(`.${t.options.classPrefix}main-menu`).classList.remove("not-visible");
					settings_menu.querySelector(`.${t.options.classPrefix}other-menu:not(.not-visible)`).classList.add("not-visible");
		});
		player.sourcechooserButton.querySelector(`.${t.options.classPrefix}speed-menu-button`).addEventListener('click', () => {
			let menu = player.sourcechooserButton.querySelector(`.${t.options.classPrefix}speed-menu`);
			let main_menu = player.sourcechooserButton.querySelector(`.${t.options.classPrefix}main-menu`);
				if(menu.classList.contains("not-visible")){
					menu.classList.remove("not-visible");
					main_menu.classList.add("not-visible");
				}else{
					menu.classList.add("not-visible");
					main_menu.classList.remove("not-visible");
				}

		});
		player.sourcechooserButton.addEventListener('click', (e) => {
				if(closest(e.target,`.${t.options.classPrefix}settings-button-menu`)){
					return false;
				}
				player.sourcechooserButton.querySelector(`.${t.options.classPrefix}settings-button-menu`).classList.toggle("invisible");
		});
		// hover
		player.sourcechooserButton.addEventListener('mouseover', () => {
			clearTimeout(hoverTimeout);
			player.showSourcechooserSelector();
		});
		player.sourcechooserButton.addEventListener('mouseout', () => {
			hoverTimeout = setTimeout(() => {
				player.hideSourcechooserSelector();
			}, 500);
		});

			// keyboard menu activation
		player.sourcechooserButton.addEventListener('keydown', (e) => {

			if (t.options.keyActions.length) {
				const keyCode = e.which || e.keyCode || 0;

				switch (keyCode) {
					case 32: // space
						if (!mejs.MediaFeatures.isFirefox) { // space sends the click event in Firefox
							player.showSourcechooserSelector();
						}
						player.sourcechooserButton.querySelector('input[type=radio]:checked').focus();
						break;
					case 13: // enter
						player.showSourcechooserSelector();
						player.sourcechooserButton.querySelector('input[type=radio]:checked').focus();
						break;
					case 27: // esc
						player.hideSourcechooserSelector();
						player.sourcechooserButton.querySelector('button').focus();
						break;
					default:
						return true;
				}

				e.preventDefault();
				e.stopPropagation();
			}
		});

		// close menu when tabbing away
		player.sourcechooserButton.addEventListener('focusout', mejs.Utils.debounce(() => {
			// Safari triggers focusout multiple times
			// Firefox does NOT support e.relatedTarget to see which element
			// just lost focus, so wait to find the next focused element
			setTimeout(() => {
				const parent = document.activeElement.closest(`.${t.options.classPrefix}sourcechooser-selector`);
				if (!parent) {
					// focus is outside the control; close menu
					player.hideSourcechooserSelector();
				}
			}, 0);
		}, 100));

		const radios = player.sourcechooserButton.querySelectorAll('input[type=radio]');

		for (let i = 0, total = radios.length; i < total; i++) {
			// handle clicks to the source radio buttons
			radios[i].addEventListener('click', function() {
				// set aria states
				this.setAttribute('aria-selected', true);
				this.checked = true;

				const otherRadios = this.closest(`.${t.options.classPrefix}sourcechooser-selector`).querySelectorAll('input[type=radio]');

				for (let j = 0, radioTotal = otherRadios.length; j < radioTotal; j++) {
					if (otherRadios[j] !== this) {
						otherRadios[j].setAttribute('aria-selected', 'false');
						otherRadios[j].removeAttribute('checked');
					}
				}

				const src = this.value;

				if (media.getSrc() !== src) {
					let currentTime = media.currentTime;

					const
						paused = media.paused,
						canPlayAfterSourceSwitchHandler = () => {
							if (!paused) {
								media.setCurrentTime(currentTime);
								media.play();
							}
							media.removeEventListener('canplay', canPlayAfterSourceSwitchHandler);
						}
					;

					media.pause();
					media.setSrc(src);
					media.load();
					media.addEventListener('canplay', canPlayAfterSourceSwitchHandler);
				}
			});
		}

		// Handle click so that screen readers can toggle the menu
		player.sourcechooserButton.querySelector('button').addEventListener('click', function() {
			if (mejs.Utils.hasClass(mejs.Utils.siblings(this, `.${t.options.classPrefix}sourcechooser-selector`), `${t.options.classPrefix}offscreen`)) {
				player.showSourcechooserSelector();
				player.sourcechooserButton.querySelector('input[type=radio]:checked').focus();
			} else {
				player.hideSourcechooserSelector();
			}
		});

	},

	/**
	 *
	 * @param {String} src
	 * @param {String} label
	 * @param {String} type
	 * @param {Boolean} isCurrent
	 */
	addSourceButton (src, label, type, isCurrent)  {
		const t = this;
		if (label === '' || label === undefined) {
			label = src;
		}
		type = type.split('/')[1];

		t.sourcechooserButton.querySelector('ul').innerHTML += `<li>` +
			`<input type="radio" name="${t.id}_sourcechooser" id="${t.id}_sourcechooser_${label}${type}"` +
				`role="menuitemradio" value="${src}" ${(isCurrent ? 'checked="checked"' : '')} aria-selected="${isCurrent}"/>` +
			`<label for="${t.id}_sourcechooser_${label}${type}" aria-hidden="true">${label} (${type})</label>` +
		`</li>`;

		t.adjustSourcechooserBox();
	},

	/**
	 *
	 */
	adjustSourcechooserBox ()  {
		const t = this;
		// adjust the size of the outer box
		t.sourcechooserButton.querySelector(`.${t.options.classPrefix}sourcechooser-selector`).style.height =
			`${parseFloat(t.sourcechooserButton.querySelector(`.${t.options.classPrefix}sourcechooser-selector ul`).offsetHeight)}px`;
	},

	/**
	 *
	 */
	hideSourcechooserSelector ()  {

		const t = this;

		if (t.sourcechooserButton === undefined || !t.sourcechooserButton.querySelector('input[type=radio]')) {
			return;
		}

		const
			selector = t.sourcechooserButton.querySelector(`.${t.options.classPrefix}sourcechooser-selector`),
			radios = selector.querySelectorAll('input[type=radio]')
		;
		selector.setAttribute('aria-expanded', 'false');
		selector.setAttribute('aria-hidden', 'true');
		mejs.Utils.addClass(selector, `${t.options.classPrefix}offscreen`);

		// make radios not focusable
		for (let i = 0, total = radios.length; i < total; i++) {
			radios[i].setAttribute('tabindex', '-1');
		}
	},

	/**
	 *
	 */
	showSourcechooserSelector ()  {

		const t = this;

		if (t.sourcechooserButton === undefined || !t.sourcechooserButton.querySelector('input[type=radio]')) {
			return;
		}

		const
			selector = t.sourcechooserButton.querySelector(`.${t.options.classPrefix}sourcechooser-selector`),
			radios = selector.querySelectorAll('input[type=radio]')
		;
		selector.setAttribute('aria-expanded', 'true');
		selector.setAttribute('aria-hidden', 'false');
		mejs.Utils.removeClass(selector, `${t.options.classPrefix}offscreen`);

		// make radios not focusable
		for (let i = 0, total = radios.length; i < total; i++) {
			radios[i].setAttribute('tabindex', '0');
		}
	}
});
