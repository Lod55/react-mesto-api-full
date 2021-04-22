import React, { useState, useEffect, useCallback } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext'

// popup components
import InfoTooltip from './InfoTooltip';

// pages components
import ProtectedRoute from "./ProtectedRoute"
import Register from './Register';
import Login from './Login';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

// api
import * as api from '../utils/api.js';

const App = () => {
  // Стейт переменные компонента
  // Данные
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  // Состояния
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const history = useHistory();

  // функция закрытия попапа
  const closePopup = () => {
    setIsInfoTooltipPopupOpen(false)
  }

  // ---------- Функции Api ----------
  // Проверка наличия ответа сервера
  const responseCheck = (res) => {
    if (!res) throw new Error(`Error: ${res.message}`);
  }

  // Обновление информации юзера
  const handleUpdateUser = (data) => {
    return api.setInfoUser(data)
      .then(res => {
        responseCheck(res);
        setCurrentUser({
          ...currentUser,
          name: res.name,
          about: res.about
        });
        return res;
      })
  }

  // Обновление аватара
  const handleUpdateAvatar = (src) => {
    return api.setUserAvatar(src)
      .then(res => {
        responseCheck(res);
        setCurrentUser({
          ...currentUser,
          avatar: res.avatar
        });
        return res;
      })
  }

  // Добавление новой карточки
  const handleAddPlaceSubmit = ({ name, link }) => {
    return api.setCard({ name, link })
      .then(res => {
        responseCheck(res);
        setCards([...cards, res]);
        return res;
      })
  }

  //  Обновление состояния лайка
  const handleCardLike = (card) => {
    const isLiked = card.likes.some(item => item._id === currentUser._id);

    return api.changeLikeCardStatus(card._id, isLiked)
      .then(res => {
        responseCheck(res);
        setCards(state => state.map(item => item._id === card._id ? res : item));
        return res;
      })
  }

  // Удаления карточки
  const handleCardDelete = (useCardId) => {
    return api.removeCard(useCardId)
      .then(res => {
        responseCheck(res);
        setCards(state => state.filter(item => item._id === useCardId ? null : item));
        return res;
      })
  }

  // Регистрация пользователя
  const handleRegister = ({ password, email }) => {
    return api.register({ password, email })
      .then(res => {
        responseCheck(res);
        if (!res || res.statusCode === 400) throw new Error(`Ошибка: ${res.message}`)
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(true);
        history.push('/sign-in');
        return res;
      })
      .catch(err => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        return err;
      })
  }

  // Успешное прохождение авторизации
  const successfulAuth = useCallback(() => {
    setIsLoading(true)
    api.getInfoUser()
      .then(data => {
        responseCheck(data);
        setCurrentUser(data);
      })
      .catch(err => console.log(`Error: ${err}`))

    api.getInitialCards()
      .then(data => {
        responseCheck(data)
        setCards(data)
      })
      .catch(err => console.log(`Error: ${err}`))

    setLoggedIn(true);
    history.push('/mesto');
  }, [history]);

  // Авторизация пользователя
  const handleLogin = ({ password, email }) => {
    return api.authorize({ password, email })
      .then(res => {
        responseCheck(res);
        if (!res || res.statusCode === 400 || res.statusCode === 401) throw new Error(`Ошибка: ${res.message}`)
        if (res.massege === "Авторизация прошла успешно!") {
          setIsInfoTooltipPopupOpen(true);
          setIsSuccess(true);

          successfulAuth();
          setIsLoading(false)
        };
      })
      .catch(err => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        return err;
      })
  }

  // Выход из системы
  const handleSignOut = () => {
    api.signOut()
      .then((res) => {
        responseCheck(res);
        setLoggedIn(false);
      })
      .catch((err) => console.log(`Error: ${err}`))
  }

  // Проверка авторизации пользователя
  useEffect(() => {
    setIsAuthChecking(true)

    api.checkAuth()
      .then(res => {
        if (res) {
          successfulAuth();
        }
      })
      .catch(() => {
        setIsAuthChecking(false)
        history.push('/sign-in')
      })
      .finally(() => {
        setIsLoading(false)
        setIsAuthChecking(false)
      });

  }, [history, successfulAuth]);

  return (
    <div className="page__container">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          loggedIn={loggedIn}
          onSignOut={handleSignOut}
          userEmail={currentUser.email}
        />

        <Switch>
          <ProtectedRoute
            path="/mesto"
            loggedIn={loggedIn}
            isChecking={isAuthChecking}
            exact>
            <Main
              onCardDelete={handleCardDelete}
              onCardLike={handleCardLike}
              onAddPlaceSubmit={handleAddPlaceSubmit}
              onUpdateAvatar={handleUpdateAvatar}
              onUpdateUser={handleUpdateUser}
              cards={cards}
              isLoading={isLoading}
            />
          </ProtectedRoute>

          <Route path='/sign-in' exact>
            <Login onLogin={handleLogin} />
          </Route>

          <Route path='/sign-up' exact>
            <Register onRegister={handleRegister} />
          </Route>

          <Route path="*">
            {loggedIn
              ? <Redirect to="/mesto" />
              : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        <Footer />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closePopup}
          isSuccess={isSuccess}
        />

      </CurrentUserContext.Provider>
    </div>
  )
}

export default App;