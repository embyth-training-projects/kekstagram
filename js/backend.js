'use strict';

(function () {
  var URL_SAVE = 'https://javascript.pages.academy/kekstagram';
  var URL_LOAD = URL_SAVE + '/data';

  function addXHR(timeout, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.timeout = timeout || 10000;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          onError('Неверный запрос');
          break;
        case 401:
          onError('Пользователь не авторизован');
          break;
        case 404:
          onError('Ничего не найдено');
          break;
        default:
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соеденения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  }

  function load(onLoad, onError) {
    var xhr = addXHR(10000, onLoad, onError);

    xhr.open('GET', URL_LOAD);
    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = addXHR(10000, onLoad, onError);

    xhr.open('POST', URL_SAVE);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };
})();
