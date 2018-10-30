// Fader

/*
 * @author Craig Lumley/craig@craiglumley.co.uk
 */

(function( $ ){
	var fader = {
		defaults : {
			// prev/next buttons
			usePrevious :				true,
			previousId :				'#fader-previous',
			useNext : 					true,
			nextId : 					'#fader-next',

			// film strip navigation
			autoGenerateNavigation :	false,
			filmStripWrap : 			'#fader-filmstrip-wrap',

			// buttons
			autoGenerateButtons : 		false,
			buttonsWrap :				'#fader-buttons-wrap',
			buttonSelectedClass :		'fader-button-selected',

			// titles
			autoUpdateTitle :			false,
			title :						'#fader-title',

			// links
			linkClass :					'fader-link',

			// general
			cycle :						false,
			cycleDelay :				5000,

			swapTime :					1500,
			swapType :					'fade',
			faderWrap :					'#fader-wrap'
		},

		/**
		 * What're we currently displaying
		 * @var Null|Integer
		 */
		_currentKey : null,

		/**
		 * Slides Store
		 *
		 * List of the slides stored in order
		 *
		 * @var Element[]
		 */
		_slides : [],

		/**
		 * Initialize
		 * @param options
		 * @uses swapSlide()
		 * @uses getNextKey()
		 * @uses setButtonSelected()
		 * @uses disableCycle()
		 * @uses getPreviousKey()
		 * @uses updateTitle()
		 * @uses getTitle()
		 * @uses getSlides()
		 * @uses cycleSlides()
		 * @returns this
		 */
		init : function( options ) {
			// if we pass in some options update the default ones
			if (options) {
				$.extend(fader.defaults, options);
			}

			// should we use a next button
			if (true === fader.defaults.useNext) {
				$(fader.defaults.nextId).bind('click', function(e) {
					fader.swapSlide(fader.getNextKey());
					fader.disableCycle();
					e.preventDefault();
				}) ;
			}
			// should we use a previous button
			if (true === fader.defaults.usePrevious) {
				$(fader.defaults.previousId).bind('click', function(e) {
					fader.swapSlide(fader.getPreviousKey());
					fader.disableCycle();
					e.preventDefault();
				}) ;
			}

			// should we update the title on first load
			if (true === fader.defaults.autoUpdateTitle) {
				fader.updateTitle();
			}

			// should we generate buttons automatically
			if (true === fader.defaults.autoGenerateButtons) {
				buttonsWrapper = $(fader.defaults.buttonsWrap + ' ul');

				$(fader.getSlides()).each(function(slideKey, slide) {
					// create the button
					var button = $('<li>').html( // save the title
						$('<a>')
					).bind('click', function(e) { // add a click event
						e.preventDefault();
						fader.disableCycle(); // stop cycling
						fader.swapSlide(slideKey); // swap the slides over
					});

					// add the button to the wrapper
					$(buttonsWrapper).append(button);

					// update the buttons to have a selected one
					fader.setButtonSelected();
				});
			}

			// should we start the slidides cycling
			if (true === fader.defaults.cycle) {
				fader.cycleSlides();
			}

			return this;
		},

		/**
		 * Get Button List
		 *
		 * @returns String
		 */
		getButtonList: function() {
			return fader.defaults.buttonsWrap + ' ul';
		},

		/**
		 * Set Button selected
		 *
		 * @param Integer key
		 * @uses getCurrentKey()
		 * @uses getButtonList()
		 * @return this
		 */
		setButtonSelected : function(key) {
			if (undefined === key) {
				key = fader.getCurrentKey();
			}
			// unselect existing ones
			$(fader.getButtonList()).children().each(function(buttonKey, button) {
				$(button).removeClass(fader.defaults.buttonSelectedClass);
				if (key === buttonKey) {
					$(button).addClass(fader.defaults.buttonSelectedClass);
				}
			});
			return this;
		},

		/**
		 * Get the current key
		 *
		 * @returns Integer
		 */
		getCurrentKey : function() {
			if (null === fader._currentKey) {
				fader._currentKey = 0;
			}
			return fader._currentKey;
		},

		/**
		 * Get the current element
		 *
		 * @uses getCurrentKey()
		 * @returns Element
		 */
		getCurrentElement : function() {
			return fader.getSlide(fader.getCurrentKey());
		},

		/**
		 * Get the next key
		 *
		 * @uses getCurrentKey()
		 * @uses getSlidesCount()
		 * @returns Integer
		 */
		getNextKey : function() {
			var nextKey = fader.getCurrentKey() + 1;
			if (nextKey > fader.getSlidesCount() - 1) {
				nextKey = 0;
			}
			return nextKey;
		},

		/**
		 * Get the next element
		 *
		 * @param key (optional) Integer
		 * @uses getNextKey()
		 * @uses getSlide()
		 * @returns Element
		 */
		getNextElement : function(key) {
			if (!key) {
				key = fader.getNextKey();
			}
			return fader.getSlide(key);
		},

		/**
		 * Get previous Key
		 *
		 * @uses getCurrentKey()
		 * @uses getSlidesCount()
		 * @returns Integer
		 */
		getPreviousKey : function() {
			var previousKey = fader.getCurrentKey() - 1;
			if (previousKey < 0) {
				previousKey = fader.getSlidesCount()-1;
			}
			return previousKey;
		},

		/**
		 * Get previous element
		 *
		 * @param Integer key
		 * @uses getPreviousKey()
		 * @uses getSlide()
		 * @returns Element
		 */
		getPreviousElement : function(key) {
			if (!key) {
				key = fader.getPreviousKey();
			}
			return fader.getSlide(key);
		},

		/**
		 * Swap Slide
		 *
		 * @param Integer to
		 * @param Integer from
		 * @uses getCurrentKey()
		 * @uses getSlideFromDOM()
		 * @uses getSlide()
		 * @uses getFaderList()
		 * @returns this
		 */
		swapSlide : function(to, from) {
			// if we haven't passed in a slide to move from get one automatically
			if (!from) {
				from = fader.getCurrentKey();
			}

			// if we're attempting to slide from and to
			if (from === to) {
				return;
			}

			// the element to slide form
			var fromElement = $(fader.getSlideFromDOM(from));
			// the element to slide to
			var toElement = $(fader.getSlide(to)).clone();

			// switch
			switch (fader.defaults.swapType) {
				// fade!
				case 'fade':
					$(fader.getFaderList()).prepend(toElement);
					if (true === fader.defaults.autoUpdateTitle) {
						$(fader.getTitle()).fadeOut(fader.defaults.swapTime/2);
					}
					fromElement.fadeOut(fader.defaults.swapTime, function() {
						fromElement.remove();
						if (true === fader.defaults.autoUpdateTitle) {
							fader.updateTitle(toElement);
						}
					});

					fader.setButtonSelected(to);

					fader._currentKey = to;

					break;

				// scroll
				case 'scroll':
					/**
					 * @todo build in scroll functionality
					 */
					break;

			}

			return this;
		},

		/**
		 * Get Title
		 * @returns String
		 */
		getTitle : function() {
			return fader.defaults.title;
		},

		/**
		 * Update Title
		 *
		 * @param Element slide
		 * @uses getCurrentElement()
		 * @returns Element
		 */
		updateTitle : function(slide) {
			if (true === fader.defaults.autoUpdateTitle) {
				if (!slide) {
					slide = fader.getCurrentElement();
				}

				$(fader.getTitle()).html('');

				if (undefined !== slide) {
					var title = slide.attr('title');
					var link = slide.children('a.' + fader.defaults.linkClass).first();

					if (1 == link.length) {
						title = link.clone().removeClass(
							fader.defaults.linkClass
						).html(title);
					}
					$(fader.getTitle()).html(title).fadeIn(fader.defaults.swapTime/2);
				}
			}
			return this;
		},

		/**
		 * Get Slides
		 *
		 * @uses getFaderList()
		 * @returns Element[]
		 */
		getSlides : function() {
			if (0 === fader._slides.length) {
				$(fader.getFaderList() + ' li').each(function(slideKey, slide) {
					fader._slides.push($(slide).clone());
					if (0 !== slideKey) {
						$(slide).remove();
					}
				});
			}
			return fader._slides;
		},

		/**
		 * Cycle Slides
		 *
		 * If the options have been set to cycle the slides set a timer and do
		 * cycle to the next item.
		 *
		 * @uses getNextKey()
		 * @uses getCurrentKey()
		 * @uses swapSlides()
		 * @uses cycleSlides()
		 * @return this
		 */
		cycleSlides : function() {
			if (true === fader.defaults.cycle) {
				var to = fader.getNextKey();
				var from = fader.getCurrentKey();
				setTimeout(function() {
					if (true === fader.defaults.cycle) {
						fader.swapSlide(to, from);
						fader.cycleSlides();
					}
				}, fader.defaults.cycleDelay);
			}
			return this;
		},

		/**
		 * Get Slide
		 *
		 * @param Integer key
		 * @uses getSlides()
		 * @returns Element
		 */
		getSlide : function(key) {
			return fader.getSlides()[key];
		},

		/**
		 * Get Slide Count
		 *
		 * @uses getSlides()
		 * @returns Integer
		 */
		getSlidesCount : function() {
			return fader.getSlides().length;
		},

		/**
		 * Get Fader Wrap
		 *
		 * @returns String
		 */
		getFaderWrap : function() {
			return fader.defaults.faderWrap;
		},

		/**
		 * Get Fader List
		 *
		 * @uses getFaderWrap()
		 * @returns String
		 */
		getFaderList : function() {
			return fader.getFaderWrap() + ' ul';
		},

		/**
		 * Get slide from DOM
		 *
		 * @param Integer key
		 * @uses getCurrentKey()
		 * @uses getFaderList()
		 * @returns String
		 */
		getSlideFromDOM : function(key) {
			if (!key) {
				key = fader.getCurrentKey();
			}

			return fader.getFaderList() + ' li';
		},

		/**
		 * Disable Cycle
		 *
		 * @return this
		 */
		disableCycle : function() {
			fader.defaults.cycle = false;
			return this;
		}
	};

	$.fn.fader = function( method ) {
		// Method calling logic
		if ( fader[method] ) {
			return fader[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return fader.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.fader' );
		}
	};
})( jQuery );