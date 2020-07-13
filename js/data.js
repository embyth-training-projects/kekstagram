'use strict';

(function () {
  // Задаем константы
  var NUMBER_OF_PHOTOS = 25;
  var NUMBER_OF_AVATARS = 6;

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
    MIN: 1,
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

  // Генерируем массив строк для комментария
  var setComments = function () {
    var comments = [];
    var numberOfComments = window.util.getRandomNumber(commentsNum.MIN, commentsNum.MAX + 1);
    var avatars = getPhotoUrl(NUMBER_OF_AVATARS);

    for (var j = 0; j < numberOfComments; j++) {
      var message = '';
      var numberOfPhrases = window.util.getRandomNumber(phrasesNum.MIN, phrasesNum.MAX + 1);
      var nameIndex = window.util.getRandomNumber(0, rawData.names.length);

      for (var i = 0; i < numberOfPhrases; i++) {
        var separator = i > 0 ? ' ' : '';

        message += separator + window.util.getRandomValue(rawData.comments);
      }

      comments.push({
        message: message,
        avatar: avatarProps.FOLDER + avatarProps.PREFIX + avatars[j] + avatarProps.EXT,
        name: rawData.names[nameIndex]
      });
    }

    return comments;
  };

  // Генерируем массив данных с объектов для фото
  var setPhotoElementData = function (arrLength) {
    var photos = [];
    var photoUrls = getPhotoUrl(arrLength);

    for (var i = 0; i < arrLength; i++) {
      photos.push({
        url: photoProps.FOLDER + photoUrls[i] + photoProps.EXT,
        likes: window.util.getRandomNumber(likesNum.MIN, likesNum.MAX + 1),
        comments: setComments(),
        description: window.util.getRandomValue(rawData.description)
      });
    }

    return photos;
  };

  // Генирируем данные для фотографий и присваиваем их глобальной переменной
  window.photoGeneratedData = setPhotoElementData(NUMBER_OF_PHOTOS);
})();
