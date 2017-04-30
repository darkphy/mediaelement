'use strict';

import document from 'global/document';
import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';
import {isString} from '../utils/general';
import {addClass, removeClass} from '../utils/dom';

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
/**
 * Play/Pause button
 *
 * This feature enables the displaying of a Play button in the control bar, and also contains logic to toggle its state
 * between paused and playing.
 */


// Feature configuration
Object.assign(config, {
	/**
	 * @type {?String}
	 */
	playText: null,
	/**
	 * @type {?String}
	 */
	pauseText: null
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
	 * @public
	 */
	buildplaypause (player, controls, layers, media)  {

		const
			t = this,
			op = t.options,
			playTitle = isString(op.playText) ? op.playText : i18n.t('mejs.play'),
			pauseTitle = isString(op.pauseText) ? op.pauseText : i18n.t('mejs.pause'),
			play = document.createElement('div')
		;

		play.className = `${t.options.classPrefix}button ${t.options.classPrefix}playpause-button ${t.options.classPrefix}play`;
		play.innerHTML = `
			<button type="button" aria-controls="${t.id}" title="${playTitle}" aria-label="${pauseTitle}" tabindex="0" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect">
				<i class="material-icons">play_arrow</i>
			</button>`;
		play.addEventListener('click', () => {
			if (media.paused) {
				media.play();
			} else {
				media.pause();
			}
		});

		const playBtn = play.querySelector('button');
		t.addControlElement(play, 'playpause');

		/**
		 * @private
		 * @param {String} which - token to determine new state of button
		 */
		function togglePlayPause (which) {
			var mjs = layers.querySelector(`.${t.options.classPrefix}playpauseanimate`);
			var mjsc = closest(controls,`.${t.options.classPrefix}container`);
							mjsc.classList.remove('iopen');
			if ('play' === which) {
				removeClass(play, `${t.options.classPrefix}play`);
				removeClass(play, `${t.options.classPrefix}replay`);
				addClass(play, `${t.options.classPrefix}pause`);
				playBtn.setAttribute('title', pauseTitle);
				playBtn.setAttribute('aria-label', pauseTitle);
				play.querySelector(".material-icons").innerHTML = 'pause'

				if(!t.forcedHandlePause && mjs){
					mjs.querySelector(".playanimate").classList.add("beginanimate");
					mjs.querySelector(".pauseanimate").classList.remove('beginanimate');
				}
			} else {

				removeClass(play, `${t.options.classPrefix}pause`);
				removeClass(play, `${t.options.classPrefix}replay`);
				addClass(play, `${t.options.classPrefix}play`);
				playBtn.setAttribute('title', playTitle);
				playBtn.setAttribute('aria-label', playTitle);
				play.querySelector(".material-icons").innerHTML = 'play_arrow'

				if(!t.forcedHandlePause && mjs){
					mjs.querySelector(".playanimate").classList.remove("beginanimate");
					mjs.querySelector(".pauseanimate").classList.add('beginanimate');
				}

			}
		}

		togglePlayPause('pse');

		media.addEventListener('loadedmetadata', () => {
			// `loadedmetadata` in Flash is executed simultaneously with `play`, so avoid it
			if (media.rendererName.match(/flash/) === null) {
				togglePlayPause('pse');
			}
		});
		media.addEventListener('play', () => {
			togglePlayPause('play');
		});
		media.addEventListener('playing', () => {
			togglePlayPause('play');
		});
		media.addEventListener('pause', () => {
			togglePlayPause('pse');
		});
		media.addEventListener('ended', () => {

			if (!player.options.loop) {
				removeClass(play, `${t.options.classPrefix}pause`);
				removeClass(play, `${t.options.classPrefix}play`);
				addClass(play, `${t.options.classPrefix}replay`);
				playBtn.setAttribute('title', playTitle);
				playBtn.setAttribute('aria-label', playTitle);
			}

		});
	}
});
