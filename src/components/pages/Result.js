import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Analysis from "../Analysis";
import useAnswers from "../hooks/useAnswers";
import Summary from "../Summary";
import _ from 'lodash';

export default function Result() {
  const { id } = useParams();
  const { location } = useHistory();
  const { state } = location;
  const { qna } = state;

  const { loading, error, answers } = useAnswers(id);
  
  function calculate() {
    let score = 0;

    answers.forEach((question, index1) => {
      let correctIndexs = [],
        checkedIndexes = [];
      
      question.options.forEach((option, index2) => {
        if (option.correct)
          correctIndexs.push(index2)

        if (qna[index1].options[index2].checked) {
          checkedIndexes.push(index2)
          option.checked = true;
        }
      })
      // console.log(correctIndexs, checkedIndexes)
      if (_.isEqual(correctIndexs, checkedIndexes)) {
        score = score + 5;
      }
    })

    return score;
  }

  const userScore = calculate();

  return (
    <>
      {loading && <div>loading...</div>}
      {error && <div>There was an an error!</div>}

      {answers && answers.length > 0 && (
        <>
          <Summary score={userScore} noq={answers.length}/>
          <Analysis answers={answers}/>
        </>
      )}
        </>
  );
}
