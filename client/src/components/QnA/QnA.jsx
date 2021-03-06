import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Question from './Questions.jsx';
import Modal from 'react-modal';

export default function QnA(){
  const [questions, setQuestions] = useState([]);
  const [questionsToShow, setQuestionsToShow] = useState(2);
  const [loaded, setLoaded] = useState(false);
  const [modalState, setModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    body: '',
    name: '',
    email: '',
    product_id: 0
  });
  const [search, setSearch] = useState('');
  questions.sort((a, b) => a.helpfulness > b.helpfulness ? -1 : 1)

  useEffect(() => {
    axios.get(`/api/qa/questions/16392`)
      .then((results) => {
        setQuestions(results.data.results)})
      .then((axios.get(`/api/qa/questions/16392`)
        .then((results) => setNewQuestion({
          product_id: results.data.product_id
        }))
        ))
      .catch((err) => console.error(err));
  }, []);

  const showMoreQuestions = () => {
    setQuestionsToShow(questions.length)
    setLoaded(true)
  }

  const showLess = () => {
    setQuestionsToShow(2)
    setLoaded(false)
  }

  const captureText = (e) => {
    setNewQuestion({
      ...newQuestion,
      [e.target.name]: e.target.value
    })
  }

  const updateSearch = (e) => {
    setSearch(e.target.value)
  }

  {console.log(newQuestion)}
  const submitQuestion = () => {
    if (newQuestion.email.indexOf('@') === -1 || newQuestion.email.indexOf('.') === -1) {
      alert('Invalid Email')
    } else if (newQuestion.body === '' || newQuestion.name === '') {
      alert('Invalid Entry')
    } else {

      axios.post(`/api/qa/questions/${newQuestion.product_id}`, {
        "body" : newQuestion.body,
        "name" : newQuestion.name,
        "email" : newQuestion.email,
        "product_id" : Number(newQuestion.product_id)
      })
      .then((results) => {
        alert('Question Submitted!')
      })
      .then(() => {
        axios.get(`/api/qa/questions/${newQuestion.product_id}`)
        .then((results) => {
          setQuestions(results.data.results)
        })
        .catch((err) => {
          console.error(err)
        })
      })
      .then(() => {
        setNewQuestion({
        "body" : '',
        "name" : '',
        "email" : '',
        "product_id" : 0
        })
      })
      .then(() => {
        document.getElementById('name-input').value = ''
        document.getElementById('email-input').value = ''
        document.getElementById('body-input').value = ''
      })
      .catch((err) => {
        console.error(err)
      })
    }
  }

  let filteredQuestion = questions.filter(
    (question) => {
      return question.question_body.toLowerCase().indexOf(search) !== -1;
    }
  )

  if (loaded === false) {
    return (
      <div>
        <div>
          <input type="text" className="search-bar" placeholder="Search Questions" value={search} onChange={updateSearch}/>
        </div>
        <div>
        {filteredQuestion.slice(0, questionsToShow).map((question, index) => {
          return (
          <div key={index}>
            <Question question={question}/>
          </div>
          )}
        )}
          <button onClick={showMoreQuestions}>Load More Questions</button>
          <button onClick={()=>{setModal(true)}}>Add A Question +</button>
          <Modal isOpen={modalState} onRequestClose={()=>{setModal(false)}} appElement={document.getElementById('app')}>
            <h2>
              Question
            </h2>
            <h5>Username</h5>
              <input id="name-input" placeholder="Example: jackson11!" name="name" onChange={captureText}></input>
              <br></br>
              <h5>Email</h5>
              <input id="email-input" placeholder="Email" name="email" onChange={captureText}></input>
              <br></br>
              <h5>Your Question</h5>
              <p>
                <textarea id="body-input" placeholder="Your Question Here" name="body" onChange={captureText}>
                </textarea>
              </p>
            <button onClick={submitQuestion}>Submit</button>
            <button onClick={()=>setModal(false)}>Close</button>
          </Modal>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
        <input type="text" className="search-bar" placeholder="Search Questions" value={search} onChange={updateSearch}/>
        </div>
        <div>
        {filteredQuestion.slice(0, questionsToShow).map((question, index) => {
          return (
          <div key={index}>
            <Question question={question} render={useEffect}/>
          </div>
          )}
        )}
          <button onClick={showLess}>Collapse Questions</button>
          <button onClick={()=>{setModal(true)}}>Add A Question +</button>
          <Modal isOpen={modalState} onRequestClose={()=>{setModal(false)}} appElement={document.getElementById('app')}>
            <h2>
              Question
            </h2>
            <h5>Username</h5>
              <input id="name-input" placeholder="Example: jackson11!" name="name" onChange={captureText}></input>
              <br></br>
              <h5>Email</h5>
              <input id="email-input" placeholder="Email" name="email" onChange={captureText}></input>
              <br></br>
              <h5>Your Question</h5>
              <p>
                <textarea id="body-input" placeholder="Your Question Here" name="body" onChange={captureText}>
                </textarea>
              </p>
            <button onClick={submitQuestion}>Submit</button>
            <button onClick={()=>setModal(false)}>Close</button>
          </Modal>
        </div>
      </div>
    );
  }
};
