'use strict';

(function () {
  var scaleEffectLevel = window.imageUpload.querySelector('.effect-level__line');
  var pinEffectLevel = scaleEffectLevel.querySelector('.effect-level__pin');
  var depthEffectLevel = scaleEffectLevel.querySelector('.effect-level__depth');
  var imageUploadPreview = window.imageUpload.querySelector('.img-upload__preview img');
  var depth = window.CONSTANTS.IMAGE_UPLOAD.DEPTH_PARAMS;

  document.body.style.overflowX = 'hidden';

  window.moveEffectSlider = function (evt) {
    evt.preventDefault();

    var startX = evt.clientX;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = startX - moveEvt.clientX;
      var sliderCoords = scaleEffectLevel.getBoundingClientRect();
      var persentOffset;
      var lengthSegment = startX - sliderCoords.left;

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
        persentOffset = ((lengthSegment * depth.MAX) / sliderCoords.width).toFixed(1);
        pinEffectLevel.style.left = (pinEffectLevel.offsetLeft - shift) + 'px';
      }
      depthEffectLevel.style.width = pinEffectLevel.style.left;

      window.setFilter(imageUploadPreview, persentOffset);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  };
})();
