const BASE_URL = 'https://';

const responseCheck = (response) => response.ok
  ? response.json()
  : Promise.reject(`Ошибка ${response.status}`);

// GET reqests
export const getInfoUser = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(responseCheck)
}

export const getInitialCards = () => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(responseCheck)
}

// POST reqests
export const register = ({ password, email }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "password": password,
      "email": email,
    }),
  })
    .then(responseCheck)
};

export const authorize = ({ password, email }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "password": password,
      "email": email,
    }),
  })
    .then(responseCheck)
};

export const setCard = ({ name, link }) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "name": name,
      "link": link,
    }),
  })
    .then(responseCheck)
}

// PATCH reqests
export const setInfoUser = ({ name, about }) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "name": name,
      "about": about,
    }),
  })
    .then(responseCheck)
};

export const setUserAvatar = (src) => {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "avatar": src,
    }),
  })
    .then(responseCheck)
};

// PUT, DELETE reqests
export const changeLikeCardStatus = (id, isLiked) => {
  return fetch(`${BASE_URL}/cards/${id}/likes`, {
    method: isLiked ? 'DELETE' : 'PUT',
  })
    .then(responseCheck)
}

export const removeCard = (id) => {
  return fetch(`${BASE_URL}/cards/${id}`, {
    method: 'DELETE',
  })
    .then(this._checkResponse)
}