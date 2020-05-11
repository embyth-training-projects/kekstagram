'use strict';

// Задаем константы
var NUMBER_OF_PHOTOS = 25;
var NUMBER_OF_AVATARS = 6;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var PHOTO_FOLDER = 'photos/';
var PHOTO_EXT = '.jpg';
var AVATAR_FOLDER = 'img/avatar-';
var AVATER_EXT = '.svg';
var MIN_PHRASES = 1;
var MAX_PHRASES = 2;
var MAX_COMMENTS = 5;

// Массивы с данными для фото
var rawData = {
  comments: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессианально.',
    'Моя бабушка случайно  чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулась на банановой кожуре и уронила фотоапарат на кота и у меня получилась фотография лучше.',
    'Лица людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],

  description: [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами...',
    'Вот это тачка!'
  ],

  names: [
    'Алла',
    'Вадим',
    'Коля',
    'Саша',
    'Влад',
    'Дима',
    'Маша'
  ]
};

// Системные коды клавиатурных кнопок
var keyCode = {
  ESC: 27,
  ENTER: 13
};

// Минимальное и масксимальные параметры масштабирования изображения
var scaleParams = {
  MIN: 25,
  MAX: 100,
  DEFAULT: 100,
  STEP: 25
};

// Получаем элементы полноэкранного изображения
var bigPicture = document.querySelector('.big-picture');
var commentElements = bigPicture.querySelector('.social__comments');
var commentElement = commentElements.querySelector('.social__comment');
var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
var bigPictureTextInput = bigPicture.querySelector('.social__footer-text');

// Получаем элементы редактирования изображения
var imageUpload = document.querySelector('.img-upload');
var imageUploadForm = imageUpload.querySelector('#upload-select-image');
var imageUploadInput = imageUpload.querySelector('#upload-file');
var imageUploadOverlay = imageUpload.querySelector('.img-upload__overlay');
var imageUploadCloseButton = imageUpload.querySelector('.img-upload__cancel');
var imageUploadPreview = imageUpload.querySelector('.img-upload__preview img');

// Получаем элементы управления масштабом изображения
var buttonScaleDecrease = imageUpload.querySelector('.scale__control--smaller');
var buttonScaleIncrease = imageUpload.querySelector('.scale__control--bigger');
var inputScaleValue = imageUpload.querySelector('.scale__control--value');

// Получаем элементы настроек эффекта
var blockEffectLevel = imageUpload.querySelector('.effect-level');
var inputEffectValue = blockEffectLevel.querySelector('.effect-level__value');
var scaleEffectLevel = blockEffectLevel.querySelector('.effect-level__line');
var pinEffectLevel = blockEffectLevel.querySelector('.effect-level__pin');
var depthEffectLevel = blockEffectLevel.querySelector('.effect-level__pin');

// Получаем случайное число в диапозоне
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Получаем не повторяющийся URL для фото
var getPhotoUrl = function (arrLength) {
  var photoUrl = [];

  // Заносим в массив числа от 1 до заданного количества
  for (var i = 1; i < arrLength + 1; i++) {
    photoUrl.push(i);
  }

  // Перемешиваем массив в случайном порядке
  for (var j = 0; j < arrLength; j++) {
    var random = Math.floor(Math.random() * (j + 1)); // Получаем случайное число
    var temp = photoUrl[random]; // Присваиваем временно случайное число из массива

    photoUrl[random] = photoUrl[j]; // Присваиваем случайному индексу порядковый номер числа из массива
    photoUrl[j] = temp; // Порядковому номеру отдаем временное значение
  }

  return photoUrl;
};

// Генерируем массив данных с объектов для фото
var setPhotoElementData = function (arrLength) {
  var photos = [];
  var photoUrls = getPhotoUrl(arrLength);

  for (var i = 0; i < arrLength; i++) {
    photos.push({
      url: PHOTO_FOLDER + photoUrls[i] + PHOTO_EXT,
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES + 1),
      comments: setComments(),
      description: rawData.description[getRandomNumber(0, rawData.description.length)]
    });
  }

  return photos;
};

// Генерируем массив строк для комментария
var setComments = function () {
  var comments = [];
  var numberOfComments = getRandomNumber(1, MAX_COMMENTS + 1);
  var avatars = getPhotoUrl(NUMBER_OF_AVATARS);

  for (var j = 0; j < numberOfComments; j++) {
    var message = '';
    var numberOfPhrases = getRandomNumber(MIN_PHRASES, MAX_PHRASES + 1);
    var nameIndex = getRandomNumber(0, rawData.names.length);

    for (var i = 0; i < numberOfPhrases; i++) {
      var separator = i > 0 ? ' ' : '';

      message += separator + rawData.comments[getRandomNumber(0, rawData.comments.length)];
    }

    comments.push({
      message: message,
      avatar: AVATAR_FOLDER + avatars[j] + AVATER_EXT,
      name: rawData.names[nameIndex]
    });
  }

  return comments;
};

// Генирируем данные для фотографий и присваиваем их переменной
var photoGeneratedData = setPhotoElementData(NUMBER_OF_PHOTOS);

// Получаем шаблон
var pictureElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

// Создаем элемент из шаблона и присваиваем ему информацию из массива
var createPictureElement = function (picture) {
  var pictureElement = pictureElementTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

// Создаем DOM-элементы фотографий
var createPictureFragment = function (pictures) {
  var fragment = document.createDocumentFragment();

  pictures.forEach(function (item) {
    fragment.appendChild(createPictureElement(item));
  });

  return fragment;
};

// Отрисовка полноэкранного изображения
var initBigPicture = function () {
  setBigPicture(photoGeneratedData[0]);

  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden'); // Скрываем счётчик комментариев
  bigPicture.querySelector('.social__comments-loader').classList.add('visually-hidden'); // Скрываем кнопку "показать больше"
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

// Удаляем ненужные DOM элементы
var clearElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// Заполняем комментарии из массива
var setCommentData = function (comment) {
  var element = commentElement.cloneNode(true);

  element.querySelector('.social__picture').src = comment.avatar;
  element.querySelector('.social__picture').alt = comment.name;
  element.querySelector('.social__text').textContent = comment.message;

  return element;
};

// Показать элемент
var showElement = function (element) {
  element.classList.remove('hidden');
};

// Спрятать элемент
var hideElement = function (element) {
  element.classList.add('hidden');
};

// Обработчик кнопки ESC
var documentEscPressHandler = function (evt) {
  if (evt.keyCode === keyCode.ESC) {
    bigPictureCloseClickHandler();
    uploadFileCloseHandler();
  }
};

// Обработчик кнопки зарытия полноэкранного изображения
var bigPictureButtonCloseHandler = function () {
  bigPictureCloseClickHandler();
};

// Обработчик состояния фокуса в поле инпута комментария
var bigPictureInputFocusHandler = function () {
  document.removeEventListener('keydown', documentEscPressHandler);
};

// Обработчик выхода из фокуса поля инпута комментария
var bigPictureInputBlurHandler = function () {
  document.addEventListener('keydown', documentEscPressHandler);
};

// Открывает попап с полноэкранным изображением
var bigPictureOpenClickHandler = function () {
  initBigPicture();
  showElement(bigPicture);

  document.addEventListener('keydown', documentEscPressHandler);
  bigPictureCloseButton.addEventListener('click', bigPictureButtonCloseHandler);
  bigPictureTextInput.addEventListener('focus', bigPictureInputFocusHandler);
  bigPictureTextInput.addEventListener('blur', bigPictureInputBlurHandler);
};

// Закрывает попап с полноэкранным изображением
var bigPictureCloseClickHandler = function () {
  hideElement(bigPicture);

  document.removeEventListener('keydown', documentEscPressHandler);
  bigPictureCloseButton.removeEventListener('click', bigPictureButtonCloseHandler);
  bigPictureTextInput.removeEventListener('focus', bigPictureInputFocusHandler);
  bigPictureTextInput.removeEventListener('blur', bigPictureInputBlurHandler);
};

// Обработчик кнопки закрытия редактирования фотографии
var uploadImageCloseButtonClickHandler = function () {
  uploadFileCloseHandler();
};

// Меняем размер изображения
var resizeImage = function (scale) {
  inputScaleValue.value = scale + '%';
  imageUploadPreview.style.transform = ('scale(' + scale / 100 + ')');
};

// Блокируем кнопки увеличения и уменьшения изображения при максимальном и минимальном масштабе
var disableScaleButtons = function () {
  buttonScaleDecrease.disabled = parseInt(inputScaleValue.value, 10) === scaleParams.MIN;
  buttonScaleIncrease.disabled = parseInt(inputScaleValue.value, 10) === scaleParams.MAX;
};

// Обработчик нажатия по кнопке уменьшения масштаба фотографии
var buttonDecreaseClickHandler = function () {
  var currentScale = parseInt(inputScaleValue.value, 10);

  if (currentScale > scaleParams.MIN) {
    currentScale -= scaleParams.STEP;
  }

  resizeImage(currentScale);
  disableScaleButtons();
};

// Обработчик нажатия по кнопке увеличения масштаба фотографии
var buttonIncreaseClickHandler = function () {
  var currentScale = parseInt(inputScaleValue.value, 10);

  if (currentScale < scaleParams.MAX) {
    currentScale += scaleParams.STEP;
  }

  resizeImage(currentScale);
  disableScaleButtons();
};

// Открывает форму редактирования изображения
var uploadFileChangeHandler = function () {
  showElement(imageUploadOverlay);
  hideElement(blockEffectLevel);

  document.addEventListener('keydown', documentEscPressHandler);
  imageUploadCloseButton.addEventListener('click', uploadImageCloseButtonClickHandler);
  buttonScaleDecrease.addEventListener('click', buttonDecreaseClickHandler);
  buttonScaleIncrease.addEventListener('click', buttonIncreaseClickHandler);

  resizeImage(scaleParams.DEFAULT);
  disableScaleButtons();
};

// Закрывает форму редактирования изображения
var uploadFileCloseHandler = function () {
  hideElement(imageUploadOverlay);

  document.removeEventListener('keydown', documentEscPressHandler);
  imageUploadCloseButton.removeEventListener('click', uploadImageCloseButtonClickHandler);
  buttonScaleDecrease.removeEventListener('click', buttonDecreaseClickHandler);
  buttonScaleIncrease.removeEventListener('click', buttonIncreaseClickHandler);

  imageUploadForm.reset();
};

// Выполняем инициализацию страницы
var init = function () {
  var pictureListElements = document.querySelector('.pictures');

  pictureListElements.appendChild(createPictureFragment(photoGeneratedData));

  imageUploadInput.addEventListener('change', uploadFileChangeHandler);
  pictureListElements.addEventListener('click', function (evt) {
    var target = evt.target;

    if (target.classList.contains('picture__img')) {
      bigPictureOpenClickHandler();
    }
  });
};

// Инициализация
init();
