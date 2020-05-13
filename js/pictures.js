'use strict';

// Задаем константы
var NUMBER_OF_PHOTOS = 25;
var NUMBER_OF_AVATARS = 6;
var DEPTH_EFFECT_MAX = 100;

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

// Количество лайков
var likesNum = {
  MIN: 15,
  MAX: 200
};

// Количество фраз
var phrasesNum = {
  MIN: 1,
  MAX: 2
};

// Количество комментариев
var commentsNum = {
  MIN: 0,
  MAX: 5
};

// Параметры фотографий
var photoProps = {
  FOLDER: 'photos/',
  EXT: '.jpg'
};

// Параметры аватарок
var avatarProps = {
  FOLDER: 'img/',
  PREFIX: 'avatar-',
  EXT: '.svg'
};

// Параметры хэштегов
var hashtagsProps = {
  MAX: 5,
  MAX_LENGTH: 20
};

// Параметры комментариев
var commentProps = {
  MAX_LENGTH: 140
};

// Минимальное и масксимальные параметры масштабирования изображения
var scaleParams = {
  MIN: 25,
  MAX: 100,
  DEFAULT: 100,
  STEP: 25
};

// Сообщения о ошибке
var errorMessages = {
  OVER_MAX: 'Количество хэш-тегов не должно быть больше ' + hashtagsProps.MAX,
  UNIQUE: 'Хэш-тег не может быть использован дважды',
  TOO_LONG: 'Максимальная длина одно хэш-тега не должна превышать ' + hashtagsProps.MAX_LENGTH + ' символов',
  TOO_SHORT: 'Хэш-тег не может состоять только из символа # (решётка)',
  HASH_SYMBOL: 'Хэш-тег должен начинаться с символа # (решётка)',
  SPACE_DELIMITER: 'Хэш-теги должны разделяться пробелами',
  COMMENT_TOO_LONG: 'Комментарий не может составлять больше ' + commentProps.MAX_LENGTH + ' символов'
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
var depthEffectLevel = blockEffectLevel.querySelector('.effect-level__depth');
var listEffect = imageUpload.querySelector('.effects__list');

// Получаем элементы ввода текста
var inputHashtags = imageUpload.querySelector('.text__hashtags');
var commentTextarea = imageUpload.querySelector('.text__description');

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
      url: photoProps.FOLDER + photoUrls[i] + photoProps.EXT,
      likes: getRandomNumber(likesNum.MIN, likesNum.MAX + 1),
      comments: setComments(),
      description: rawData.description[getRandomNumber(0, rawData.description.length)]
    });
  }

  return photos;
};

// Генерируем массив строк для комментария
var setComments = function () {
  var comments = [];
  var numberOfComments = getRandomNumber(commentsNum.MIN, commentsNum.MAX + 1);
  var avatars = getPhotoUrl(NUMBER_OF_AVATARS);

  for (var j = 0; j < numberOfComments; j++) {
    var message = '';
    var numberOfPhrases = getRandomNumber(phrasesNum.MIN, phrasesNum.MAX + 1);
    var nameIndex = getRandomNumber(0, rawData.names.length);

    for (var i = 0; i < numberOfPhrases; i++) {
      var separator = i > 0 ? ' ' : '';

      message += separator + rawData.comments[getRandomNumber(0, rawData.comments.length)];
    }

    comments.push({
      message: message,
      avatar: avatarProps.FOLDER + avatarProps.PREFIX + avatars[j] + avatarProps.EXT,
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

// Обработчик изменения примененного эффекта
var listEffectChangeHandler = function (evt) {
  var effectName = evt.target.value;

  depthEffectLevel.style.width = DEPTH_EFFECT_MAX + '%';
  pinEffectLevel.style.left = DEPTH_EFFECT_MAX + '%';
  inputEffectValue.value = DEPTH_EFFECT_MAX;
  imageUploadPreview.className = '';
  imageUploadPreview.style = '';

  if (effectName === 'none') {
    hideElement(blockEffectLevel);
  } else {
    showElement(blockEffectLevel);
    imageUploadPreview.classList.add('effects__preview--' + effectName);
  }

  var currentScale = parseInt(inputScaleValue.value, 10);
  resizeImage(currentScale);
  disableScaleButtons();
};

// Получение насищености эффекта
var getDepthValue = function () {
  var rect = scaleEffectLevel.getBoundingClientRect();

  return pinEffectLevel.offsetLeft / rect.width;
};

// Установка фильтров
var setFilters = function (value) {
  return {
    'chrome': 'greyscale(' + value + ')',
    'sepia': 'sepia(' + value + ')',
    'marvin': 'invert(' + value * 100 + '%)',
    'phobos': 'blur(' + value * 3 + 'px)',
    'heat': 'brightness(' + (value * 2 + 1) + ')'
  };
};

// Обработчик поднятия кнопки мыши вверх для ползунка
var pinEffectLevelMouseUpHandler = function (evt) {
  var filter = listEffect.querySelector('.effects__radio:checked').value;

  evt.preventDefault();
  imageUploadPreview.style.filter = setFilters(getDepthValue())[filter];
};

// Проверяет на уникальность хэштег
var isHashtagUnique = function (item, index, items) {
  return items.indexOf(item) === index;
};

// Обработчик ввода хэштегов
var inputHashtagsInputHandler = function () {
  var hashtags = inputHashtags.value.trim().toLowerCase().split(' ');

  if (!hashtags.length) {
    return;
  }

  if (hashtags.length > hashtagsProps.MAX) {
    inputHashtags.setCustomValidity(errorMessages.OVER_MAX);
    return;
  }

  if (!hashtags.every(isHashtagUnique)) {
    inputHashtags.setCustomValidity(errorMessages.UNIQUE);
    return;
  }

  hashtags.forEach(function (hashtag) {
    if (hashtag.length > hashtagsProps.MAX_LENGTH) {
      inputHashtags.setCustomValidity(errorMessages.TOO_LONG);
    } else if (hashtag === '#') {
      inputHashtags.setCustomValidity(errorMessages.TOO_SHORT);
    } else if (hashtag.charAt(0) !== '#') {
      inputHashtags.setCustomValidity(errorMessages.HASH_SYMBOL);
    } else if (hashtag.includes('#', 1)) {
      inputHashtags.setCustomValidity(errorMessages.SPACE_DELIMITER);
    } else {
      inputHashtags.setCustomValidity('');
    }
  });
};

// Обработчик фокуса ввода хэштегов
var inputHashtagsFocusHandler = function () {
  document.removeEventListener('keydown', documentEscPressHandler);
};

// Обработчик выхода из фокуса ввода хэштегов
var inputHashtagsBlurHandler = function () {
  document.addEventListener('keydown', documentEscPressHandler);
};

// Обработчик ввода текста для комментария
var commentTextareaInputHandler = function () {
  var text = commentTextarea.value;

  if (!text.length) {
    return;
  }

  if (text.length > commentProps.MAX_LENGTH) {
    commentTextarea.setCustomValidity(errorMessages.COMMENT_TOO_LONG);
  } else {
    commentTextarea.setCustomValidity('');
  }
};

// Обработчик фокуса ввода комментария
var commentTextareaFocusHandler = function () {
  document.removeEventListener('keydown', documentEscPressHandler);
};

// Обработчик выхода из фокуса ввода комментария
var commentTextareaBlurHandler = function () {
  document.addEventListener('keydown', documentEscPressHandler);
};

// Открывает форму редактирования изображения
var uploadFileChangeHandler = function () {
  showElement(imageUploadOverlay);
  hideElement(blockEffectLevel);

  document.addEventListener('keydown', documentEscPressHandler);
  imageUploadCloseButton.addEventListener('click', uploadImageCloseButtonClickHandler);
  buttonScaleDecrease.addEventListener('click', buttonDecreaseClickHandler);
  buttonScaleIncrease.addEventListener('click', buttonIncreaseClickHandler);
  listEffect.addEventListener('change', listEffectChangeHandler);
  pinEffectLevel.addEventListener('mouseup', pinEffectLevelMouseUpHandler);
  inputHashtags.addEventListener('input', inputHashtagsInputHandler);
  inputHashtags.addEventListener('focus', inputHashtagsFocusHandler);
  inputHashtags.addEventListener('blur', inputHashtagsBlurHandler);
  commentTextarea.addEventListener('input', commentTextareaInputHandler);
  commentTextarea.addEventListener('focus', commentTextareaFocusHandler);
  commentTextarea.addEventListener('blur', commentTextareaBlurHandler);

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
  listEffect.removeEventListener('change', listEffectChangeHandler);
  pinEffectLevel.removeEventListener('mouseup', pinEffectLevelMouseUpHandler);
  inputHashtags.removeEventListener('input', inputHashtagsInputHandler);
  inputHashtags.removeEventListener('focus', inputHashtagsFocusHandler);
  inputHashtags.removeEventListener('blur', inputHashtagsBlurHandler);
  commentTextarea.removeEventListener('input', commentTextareaInputHandler);
  commentTextarea.removeEventListener('focus', commentTextareaFocusHandler);
  commentTextarea.removeEventListener('blur', commentTextareaBlurHandler);

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
