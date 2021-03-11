import React, { useState, useEffect } from "react";
import s from './QueryForm.module.css';

const API = 'http://54.86.222.135:5000';

const QueryForm = () => {
  const [url, setUrl] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [best, setBest] = useState('');

  const query = (queryUrl) => {
    fetch(`${API}/predict?url=${queryUrl}`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(res => {
        setPredictions(res.predictions);
        decide(res.predictions);
      })
      .catch(err => console.log(err))
  }

  const decide = (decidePreds) => {
    if (decidePreds.length === 0) return
    decidePreds.sort((a, b) => b.probability - a.probability);
    setBest(decidePreds[0].label.replaceAll("_", " "));
  }
  

  return (
    <div id={s.root}>
      <div id={s.title}>
        Welcome to dog breed identifier!
      </div>

      <div id={s.input}>

        <input type='text' onChange={e => setUrl(e.target.value)} />

      </div>

      <div id={s.control}>

        <button onClick={ () => query(url) }>Check</button>

      </div>

      <div id={s.result}>
        {best !== '' && <h2>We think it's a [{best}]</h2>}
        {
          predictions?
            
          predictions.map((d, i) => <span key={i}>{d.label} : {d.probability}</span>)
          :
          "No prediction availale"
        }
      </div>

    </div>
  )
}

export default QueryForm;