import { getDatabase, ref, set } from 'firebase/database';
import _ from 'lodash';
import { useEffect, useReducer, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from '../../contexts/AuthContext';
import Answers from "../Answers";
import useQuestions from "../hooks/useQuestions";
import MiniPlayer from "../MiniPlayer";
import ProgressBar from "../ProgressBar";

const initialSate = null;
const reducer = (state, action) => {
    switch (action.type) {
      case "questions":
            action.value.forEach(question => {
                question.options.forEach(option => {
                    option.checked = false;
                })
            })
            return action.value;
      case "answer":
        const questions = _.cloneDeep(state)
        questions[action.questionID].options[action.optionIndex].checked = action.value;
        return questions;
      
      default:
            return state;
    }
}

export default function Quiz() {
  const { id } = useParams();
  const {loading, error, questions} = useQuestions(id)
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [qna, dispatch] = useReducer(reducer, initialSate);
  const { currentUser } = useAuth();
  const history = useHistory();
  const { location } = history;
  const { state} = location;
  const { videoTitle } = state;

  useEffect(() => {
    dispatch({
      type: 'questions',
      value: questions,
    })
  }, [questions])

  
  function handleAnswerChange(e, index) {
    dispatch({
      type: "answer",
      questionID: currentQuestion,
      optionIndex: index,
      value: e.target.checked
    })
  }

  
  function nextQuestion() {
    if (currentQuestion <= questions.length) {
      setCurrentQuestion((prevCurrent) => prevCurrent + 1)
    }
  }

  function prevQuestion() {
    if (currentQuestion >= 1 ) {
      setCurrentQuestion((prevCurrent) => prevCurrent - 1)
    }
  }

  
  async function submit() {
    const { uid } = currentUser;
    const db = getDatabase();
    const resultRef = ref(db, `result/${uid}`)

    await set(resultRef, {
      [id]: qna,
    })

    history.push({
      pathname: `/result/${id}`,
      state: {
        qna,
      }
    })
  }

  const percentage = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <>
      {loading && <div>loading....</div>}
      {error && <div>There was an error!</div>}
      {!loading && !error && qna && qna.length > 0 && (
        <>
         <h1>{ qna[currentQuestion].title }</h1>
         <h4>Question can have multiple answers</h4>
         <Answers input options={qna[currentQuestion].options} handleChange={ handleAnswerChange }/>
          <ProgressBar next={nextQuestion} prev={prevQuestion} progress={percentage} submit={ submit}/>
          <MiniPlayer id={id} title={ videoTitle }/>
         </>
      )}
     
      </>
  );
}
