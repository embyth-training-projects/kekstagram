'use strict';

(function () {
  // Элементы для работы с фильтрами изображения
  var imageUploadNode = document.querySelector('.img-upload');
  var scaleEffectLevel = imageUploadNode.querySelector('.effect-level__line');
  var pinEffectLevel = scaleEffectLevel.querySelector('.effect-level__pin');
  var depthEffectLevel = scaleEffectLevel.querySelector('.effect-level__depth');
  var imageUploadPreview = imageUploadNode.querySelector('.img-upload__preview img');
  var depth = window.effect.DepthParams;

  // Активация перетаскивания
  function activate(downEvt) {
    downEvt.preventDefault();

    var startX = downEvt.clientX;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = startX - moveEvt.clientX;
      var sliderCoords = scaleEffectLevel.getBoundingClientRect();
      var persentOffset;
      var shiftedPosition = startX - sliderCoords.left;
      startX = moveEvt.clientX;

      if (startX < sliderCoords.left) {
        startX = sliderCoords.left;
        persentOffset = depth.MIN;
        pinEffectLevel.style.left = depth.MIN + '%';
      } else if (startX > sliderCoords.right) {
        startX = sliderCoords.right;
        persentOffset = depth.MAX;
        pinEffectLevel.style.left = depth.MAX + '%';
      } else {
        persentOffset = ((shiftedPosition * depth.MAX) / sliderCoords.width).toFixed(1);
        pinEffectLevel.style.left = (pinEffectLevel.offsetLeft - shift) + 'px';
      }

      depthEffectLevel.style.width = pinEffectLevel.style.left;

      window.effect.set(imageUploadPreview, persentOffset);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  window.dragndrop = {
    activate: activate
  };
})();
