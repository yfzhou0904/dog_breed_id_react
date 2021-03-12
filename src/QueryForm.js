import React, { useState, useEffect } from "react";
import { Spinner } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import s from './QueryForm.module.css';

const API = 'https://cors-everywhere-me.herokuapp.com/http://54.86.222.135:5000';

const QueryForm = () => {
  const [url, setUrl] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [best, setBest] = useState('');
  const [waiting, setWaiting] = useState(false);

  const query = (queryUrl) => {
    if (queryUrl === '') { alert("URL is empty"); return; }  

    setWaiting(true);
    queryUrl = encodeURI(queryUrl);
    fetch(`${API}/predict?url=${queryUrl}`, {
      method: "POST"
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(res => {
        setPredictions(res.predictions);
        decide(res.predictions);
        setWaiting(false);
      })
      .catch(err => {
        console.log(err);
        alert("Oops! Server can't process this particular image.");
        setWaiting(false);
      })
  }

  const decide = (decidePreds) => {
    if (decidePreds.length === 0) return
    decidePreds.sort((a, b) => b.probability - a.probability);
    setBest(decidePreds[0].label.replaceAll("_", " "));
  }
  

  return (
    <div id={s.root}>
      <div id={s.title}>
        <h1>Welcome to dog breed identifier!</h1>
      </div>

      <div id={s.input}>

        <input type='text' onChange={e => setUrl(e.target.value)} />

      </div>

      <div id={s.control}>

        <button onClick={ () => query(url) }>Check</button>

      </div>

      <div id={s.preview}>
        <img src={url === '' ? `${process.env.PUBLIC_URL}/dog.png` : url} />
      </div>

      <div id={s.result}>

        {
          waiting?
          <>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </>
          :
          <>
          {best !== '' && <h1>We think it's a <span className={s.breed}>{best}</span> with {Math.round(predictions[0].probability * 100)}% confidence</h1>}
          {
            predictions?
              
            predictions.map((d, i) => <span key={i}>{d.label} : {d.probability}</span>)
            :
            "No prediction availale"
          }
          </>

        }
      </div>

    </div>
  )
}

export default QueryForm;