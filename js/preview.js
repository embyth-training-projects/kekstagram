'use strict';

(function () {
  // Получаем элементы полноэкранного изображения
  var bigPicture = document.querySelector('.big-picture');
  var commentElements = bigPicture.querySelector('.social__comments');
  var commentElement = commentElements.querySelector('.social__comment');
  var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
  var bigPictureTextInput = bigPicture.querySelector('.social__footer-text');
  var pictureListElements = document.querySelector('.pictures');

  // Удаляем ненужные DOM элементы
  var clearElements = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  // Задаем информацию полноэкранному изображению
  var setBigPicture = function (picture) {
    var fragment = document.createDocumentFragment();

    bigPicture.querySelector('img').src = picture.url; // Указываем путь к фото
    bigPicture.querySelector('.likes-count').textContent = picture.likes; // Показываем количество лайков
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length; // Показываем количество комментариев
    bigPicture.querySelector('.social__caption').textContent = picture.description; // Показываем описание к фото

    picture.comments.forEach(function (item) { // Для каждого комментария создаем фрагмент и заполняем его информацией из массива
      fragment.appendChild(setCommentData(item));
    });

    clearElements(commentElements); // Очищаем ненужные комментарии
    commentElements.appendChild(fragment); // Вставляем в разметку новые комментарии
  };

  // Отрисовка полноэкранного изображения
  var initBigPicture = function (index) {
    setBigPicture(window.photoData[index]);

    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden'); // Скрываем счётчик комментариев
    bigPicture.querySelector('.social__comments-loader').classList.add('visually-hidden'); // Скрываем кнопку "показать больше"
  };

  // Заполняем комментарии из массива
  var setCommentData = function (comment) {
    var element = commentElement.cloneNode(true);

    element.querySelector('.social__picture').src = comment.avatar;
    element.querySelector('.social__picture').alt = comment.name;
    element.querySelector('.social__text').textContent = comment.message;

    return element;
  };

  // Открыть окно при клике
  var openBigPictureOnClickHandler = function (evt) {
    var generetedPictures = document.querySelectorAll('.picture');
    var target = evt.target;

    for (var i = 0; i < generetedPictures.length; i++) {
      if (target.parentNode === generetedPictures[i]) {
        initBigPicture(i);
        bigPictureOpenClickHandler();
      }
    }
  };

  // Закрыть окно при нажатии кнопки Enter
  var closeBigPictureOnKeyDown = function (evt) {
    window.util.isEnterKey(evt, bigPictureCloseClickHandler);
  };

  // Закрыть окно при нажатии кнопки Esc
  var closeBigPictureOnPressEsc = function (evt) {
    window.util.isEscKey(evt, bigPictureCloseClickHandler);
  };

  // Обработчик кнопки зарытия полноэкранного изображения
  var bigPictureButtonCloseHandler = function () {
    bigPictureCloseClickHandler();
  };

  // Обработчик состояния фокуса в поле инпута комментария
  var bigPictureInputFocusHandler = function () {
    document.removeEventListener('keydown', closeBigPictureOnPressEsc);
  };

  // Обработчик выхода из фокуса поля инпута комментария
  var bigPictureInputBlurHandler = function () {
    document.addEventListener('keydown', closeBigPictureOnPressEsc);
  };

  // Открыть окно при нажатии кнопки Enter
  var openBigPictureOnKeyDown = function (evt) {
    window.util.isEnterKey(evt, bigPictureOpenClickHandler);
  };

  // Открывает попап с полноэкранным изображением
  var bigPictureOpenClickHandler = function () {
    window.util.showElement(bigPicture);
    window.util.hideBodyScroll();

    pictureListElements.removeEventListener('click', openBigPictureOnClickHandler);
    pictureListElements.removeEventListener('keydown', openBigPictureOnKeyDown);

    document.addEventListener('keydown', closeBigPictureOnPressEsc);
    bigPictureCloseButton.addEventListener('click', bigPictureButtonCloseHandler);
    bigPictureCloseButton.addEventListener('keydown', closeBigPictureOnKeyDown);
    bigPictureTextInput.addEventListener('focus', bigPictureInputFocusHandler);
    bigPictureTextInput.addEventListener('blur', bigPictureInputBlurHandler);
  };

  // Закрывает попап с полноэкранным изображением
  var bigPictureCloseClickHandler = function () {
    window.util.hideElement(bigPicture);
    window.util.showBodyScroll();

    pictureListElements.addEventListener('keydown', openBigPictureOnKeyDown);
    pictureListElements.addEventListener('click', openBigPictureOnClickHandler);

    document.removeEventListener('keydown', closeBigPictureOnPressEsc);
    bigPictureCloseButton.removeEventListener('click', bigPictureButtonCloseHandler);
    bigPictureCloseButton.removeEventListener('keydown', closeBigPictureOnKeyDown);
    bigPictureTextInput.removeEventListener('focus', bigPictureInputFocusHandler);
    bigPictureTextInput.removeEventListener('blur', bigPictureInputBlurHandler);
  };

  pictureListElements.addEventListener('keydown', openBigPictureOnKeyDown);
  pictureListElements.addEventListener('click', openBigPictureOnClickHandler);
})();
