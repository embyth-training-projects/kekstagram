'use strict';

(function () {
  // Получаем элементы настроек эффекта
  var imageUploadNode = document.querySelector('.img-upload');
  var blockEffectLevel = imageUploadNode.querySelector('.effect-level');
  var inputEffectValue = blockEffectLevel.querySelector('.effect-level__value');
  var pinEffectLevel = blockEffectLevel.querySelector('.effect-level__pin');
  var depthEffectLevel = blockEffectLevel.querySelector('.effect-level__depth');
  var listEffect = imageUploadNode.querySelector('.effects__list');
  var imageUploadPreview = imageUploadNode.querySelector('.img-upload__preview img');

  var DepthParams = {
    MIN: 0,
    MAX: 100,
    DEFAULT: 75
  };

  // Устанавливаем фильтр
  function setEffect(image, value) {
    var effectValue = document.querySelector('.effect-level__value');
    effectValue.step = '0.1';
    effectValue.value = value;

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
  }

  // Обработчик изменения примененного эффекта
  function listEffectChangeHandler(evt) {
    var effectName = evt.target.value;

    depthEffectLevel.style.width = DepthParams.DEFAULT + '%';
    pinEffectLevel.style.left = DepthParams.DEFAULT + '%';
    inputEffectValue.value = DepthParams.DEFAULT;
    imageUploadPreview.className = '';
    imageUploadPreview.style = '';

    if (effectName === 'none') {
      reset();
    } else {
      window.util.showElement(blockEffectLevel);
      imageUploadPreview.classList.add('effects__preview--' + effectName);
      setEffect(imageUploadPreview, DepthParams.DEFAULT);
    }

    var inputScaleValue = imageUploadNode.querySelector('.scale__control--value');
    var currentScale = parseInt(inputScaleValue.value, 10);
    window.scale.resize(currentScale);
    window.scale.hideControls();
  }

  // Сбрасываем фильтры
  function reset() {
    window.util.hideElement(blockEffectLevel);
    imageUploadPreview.style.filter = 'none';
    imageUploadPreview.className = 'effects__preview--none';
  }

  // Активируем эффект на изображение
  function activate() {
    listEffect.addEventListener('change', listEffectChangeHandler);
    pinEffectLevel.addEventListener('mousedown', window.dragndrop.activate);
  }

  // Отключаем эффект на изображение
  function disable() {
    listEffect.removeEventListener('change', listEffectChangeHandler);
    pinEffectLevel.removeEventListener('mousedown', window.dragndrop.activate);
  }

  // Передаём функции в глобальную область видимости
  window.effect = {
    activate: activate,
    disable: disable,
    set: setEffect,
    reset: reset,
    DepthParams: DepthParams
  };
})();
