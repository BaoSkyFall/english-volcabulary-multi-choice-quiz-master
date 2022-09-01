import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

function Result(props) {
  return (
    <CSSTransitionGroup
      className="container-questions result"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        <p>You have completed: <strong>{props.quizResult.answersCount}</strong> questions</p>
        <p>You have  correct: <strong>{props.quizResult.totalAnswerCorrect}</strong> answers</p>
        <p>Complete correct word: <strong>{props.quizResult.percentCorrect}</strong> %</p>
        <a href="/"><button>Do it again</button></a>
      </div>
    </CSSTransitionGroup>
  );
}

Result.propTypes = {
  quizResult: PropTypes.object.isRequired
};

export default Result;
