const BASE_URL = 'https://api.app-mesto.lod55.nomoredomains.club';

const responseCheck = (response) => response.ok
  ? response.json()
  : Promise.reject(`Ошибка ${response.status}`);

// GET reqests
export const checkAuth = () => {
  return fetch(`${BASE_URL}/check-auth`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(responseCheck)
}

export const getInfoUser = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(responseCheck)
}

export const getInitialCards = () => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(responseCheck)
}

// POST reqests
export const register = ({ password, email }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
  })
    .then(responseCheck)
}

export const removeCard = (id) => {
  return fetch(`${BASE_URL}/cards/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then(responseCheck)
}

export const signOut = () => {
  return fetch(`${BASE_URL}/signout`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then(responseCheck)
}