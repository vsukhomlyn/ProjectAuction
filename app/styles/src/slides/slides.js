(function() {

  /**
   * Class constructor for Slides component.
   * Implements MDL component design pattern.
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
  class Slides {

    constructor (element) {
      this.element_ = element;

      /**
       * Store constants in one place so they can be updated easily.
       *
       * @enum {string | number}
       * @private
       */
      this.Constant_ = {
        MIN_WIDTH: '(min-width: 840px)',
        SLIDES_QUANTITY: 3
      };

      /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */
      this.CssClasses_ = {
        SLIDES_CONTAINER: 'slides__container',
        SLIDES: 'slides__img',
        PREV: 'slides__prev',
        NEXT: 'slides__next',
        SHOWING: 'slides__img--showing'
      };

      // Initialize instance.
      this.init();
    }

    /**
     * Appends/removes slides according to a screen size.
     *
     * @private
     */
    screenSizeHandler_() {
      if (this.screenSizeMediaQuery_.matches) {
        // set up slides on desktop screen
        const slidesContainer = document.createElement('div');
        slidesContainer.classList.add(this.CssClasses_.SLIDES_CONTAINER);
        const slide = document.createElement('div');
        slide.classList.add(this.CssClasses_.SLIDES);

        for (let i = 0; i < this.Constant_.SLIDES_QUANTITY; i+=1) slidesContainer.appendChild(slide.cloneNode(false));
        // Make first slide visible
        slidesContainer.firstElementChild.classList.add(this.CssClasses_.SHOWING);

        this.element_.appendChild(slidesContainer);

        // Start slideshow
        this.slideShow_();

      } else {
        // Does nothing when we starts on small screen or deletes all slides on resizing window from desktop to small
        if (this.element_.lastElementChild.classList.contains(this.CssClasses_.SLIDES_CONTAINER)) {
          this.element_.removeChild(this.element_.lastElementChild);
        }
      }
    }

    /**
     * Start slideshow
     *
     * @private
     */
    slideShow_ () {
      const slides = this.element_.querySelectorAll('.' + this.CssClasses_.SLIDES);
      const previous = this.element_.querySelector('.' + this.CssClasses_.PREV);
      const next = this.element_.querySelector('.' + this.CssClasses_.NEXT);

      let currentSlide = 0;

      const addSlide = () => slides[currentSlide].classList.add(this.CssClasses_.SHOWING);
      const removeSlide = () => slides[currentSlide].classList.remove(this.CssClasses_.SHOWING);

      const goToSlide = function (newSlide) {
        removeSlide();
        currentSlide = (newSlide+slides.length)%slides.length;
        addSlide();
      };

      let slideInterval;

      const slideIntervalSetting = function() {
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), 2000);
      };
      slideIntervalSetting();

      previous.addEventListener('click', () => goToSlide(currentSlide - 1));
      next.addEventListener('click', () => goToSlide(currentSlide + 1));

      this.element_.addEventListener('mouseover', () => {
        if (slideInterval) {
          clearInterval(slideInterval);
          slideInterval = undefined;
        }
      });

      this.element_.addEventListener('mouseout', (event) => {
        if (!slideInterval && event.target.classList.contains(this.CssClasses_.SLIDES)) {
          slideIntervalSetting();
        }
      });
    }

    /**
     * Initialize element.
     */
    init () {
      if (this.element_) {
        // Keep an eye on screen size, and add slides for styling
        // of desktop (MIN_WIDTH) screens.
        this.screenSizeMediaQuery_ = window.matchMedia((this.Constant_.MIN_WIDTH));
        this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));

        //Add slides on desktop screens
        this.screenSizeHandler_();
      }
    }
  }

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: Slides,
    classAsString: 'Slides',
    cssClass: 'js-slides',
    widget: true
  });
})();
