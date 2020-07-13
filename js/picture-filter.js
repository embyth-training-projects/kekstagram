'use strict';

(function () {
  window.setFilter = function (image, value) {
    var denominatorForChromeAndSepia = 100;
    var denominatorForPhobosAndHeat = 33.3;

    var FILTERS = {
      VALUES: {
        none: '',
        chrome: 'grayscale(' + value / denominatorForChromeAndSepia + ')',
        sepia: 'sepia(' + value / denominatorForChromeAndSepia + ')',
        marvin: 'invert(' + value + '%)',
        phobos: 'blur(' + (value / denominatorForPhobosAndHeat).toFixed(1) + 'px)',
        heat: 'brightness(' + (value / denominatorForPhobosAndHeat).toFixed(1) + ')'
      },
      CLASSES: {
        none: 'effects__preview--none',
        chrome: 'effects__preview--chrome',
        sepia: 'effects__preview--sepia',
        marvin: 'effects__preview--marvin',
        phobos: 'effects__preview--phobos',
        heat: 'effects__preview--heat'
      }
    };

    switch (image.className) {
      case FILTERS.CLASSES.none:
        image.style.filter = FILTERS.VALUES.none;
        break;
      case FILTERS.CLASSES.chrome:
        image.style.filter = FILTERS.VALUES.chrome;
        break;
      case FILTERS.CLASSES.sepia:
        image.style.filter = FILTERS.VALUES.sepia;
        break;
      case FILTERS.CLASSES.marvin:
        image.style.filter = FILTERS.VALUES.marvin;
        break;
      case FILTERS.CLASSES.phobos:
        image.style.filter = FILTERS.VALUES.phobos;
        break;
      case FILTERS.CLASSES.heat:
        image.style.filter = FILTERS.VALUES.heat;
        break;
    }
  };
})();
