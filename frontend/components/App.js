import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { axiosWithAuth } from '../axios';
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

const initialCreds = {
  username: '',
  password: ''
}

export default function App() {
  // ✨ MVP can be achieved with these states
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState('');
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [credentials, setCredentials] = useState(initialCreds);
  const [formValues, setFormValues] = useState('');

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    setMessage('Goodbye!');
    navigate("/loginScreen");

  }
  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    const loginVal = {
      username: username,
      password: password
    }
    axios.post('http://localhost:9000/api/login', loginVal)
      .then(res=>{
        localStorage.setItem('token', res.data.token);
        setSpinnerOn(false);
        setCredentials(loginVal);
        navigate('/articles');
      })
      .catch(err=>console.log(err))
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().get(`http://localhost:9000/api/articles`)
      .then(res=>{
        //console.log(res);
         setArticles(res.data.articles);
         setMessage(res.data.message);
         setSpinnerOn(false);
      })
      .catch(err=>console.log(err.response.status));
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axiosWithAuth().post(`http://localhost:9000/api/articles`,article)
      .then(res=>{
        console.log(res);
        setArticles([...articles,article]);
        setMessage(res.data.message);
      })
      .catch(err=>console.log(err));
  }

  const updateArticle = ( article_id, article ) => {
    // ✨ implement
    // You got this!
    console.log(article);
    axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then(res=>{
        const updatedIndex = articles.findIndex(art => art.article_id === article_id);
      if (updatedIndex !== -1) {
        // Create a new array with the updated article
        const updatedArticles = [...articles];
        updatedArticles[updatedIndex] = res.data.article; // Assuming res.data is the updated article
        setArticles(updatedArticles);
      }
      setMessage(res.data.message);
    })
    .catch(err => console.log(err));
};

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
      .then(res=>{
        setArticles(articles.filter(article=>(article.article_id !== Number(article_id))));
        setMessage(res.data.message);
      })
      .catch(err=>console.log(err));
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/loginScreen" replace />} />
          <Route  path="/loginScreen" element={<LoginForm login={login}/>}/>
          <Route path="/articles" element={ token ? 
            <>
              <ArticleForm setCurrentArticleId={setCurrentArticleId} articles={articles} setArticles={setArticles} formValues={formValues} updateArticle={updateArticle} currentArticleId={currentArticleId} postArticle={postArticle}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle}  setCurrentArticleId={setCurrentArticleId}/>
            </>
          : <Navigate to="/loginScreen" replace/>} />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
