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

// Выполняем генерацию фотографий
var generatePictures = function () {
  var pictureListElements = document.querySelector('.pictures');

  pictureListElements.appendChild(createPictureFragment(photoGeneratedData));
};

// Получаем элементы полноэкранного изображения
var bigPicture = document.querySelector('.big-picture');
var commentElements = bigPicture.querySelector('.social__comments');
var commentElement = commentElements.querySelector('.social__comment');

// Отрисовка полноэкранного изображения
var initBigPicture = function () {
  setBigPicture(photoGeneratedData[0]);

  bigPicture.classList.remove('hidden'); // Убираем класс hidden
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

// Инициализация
generatePictures();
initBigPicture();


