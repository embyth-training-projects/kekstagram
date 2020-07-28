'use strict';

(function () {
  // Обработчик загрузки данных для фото с сервера
  function onLoad(data) {
    for (var i = 0; i < data.length; i++) {
      data[i].id = i;
    }
    window.photoData = data;
    // Выполняем отрисовку фотографий
    window.gallery.render(window.photoData);
    window.filter.activate();
    window.preview.activate();
    window.form.activate();
  }

  // Генирируем данные для фотографий из ответа сервера
  window.backend.load(onLoad, window.util.showError);
})();
