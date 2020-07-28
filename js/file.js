'use strict';

(function () {
  // Допустимые разрешения фотографий
  var FILE_TYPES = ['gif', 'jpeg', 'jpg', 'png'];

  // Обработчик отображения локальной фотографии
  function upload(fileChooser, imageSource, onError) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    var reader = new FileReader();

    if (matches) {
      reader.addEventListener('load', function () {
        imageSource.src = reader.result;
      });

      reader.readAsDataURL(file);
    } else {
      window.util.showError('Ошибка при чтении файла: ' + fileName);
      setTimeout(function () {
        document.querySelector('.error-alert').remove();
      }, 5000);
      onError();
    }
  }

  // Передаём функцию в лобальную область видимости
  window.file = {
    upload: upload
  };
})();
