import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { Collapse, Button, Space, Typography } from 'antd';
import AnswerOptionResult from '../components/AnswerOptionResult';
import {
  AntDesignOutlined
} from '@ant-design/icons';
const { Panel } = Collapse;
const { Title } = Typography;

class Result extends React.Component {

  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }





  renderAnswerOptions(key, dataItem) {
    const answer = dataItem.anserSelected.id === key.id ? key.content : '';
    return (
      <AnswerOptionResult
        key={key.content}
        answerContent={key.content}
        answerType={key.type}
        answer={answer}
        correct={key.correct}
      />
    );
  }

  renderAnswerQuestions(dataItem, index) {
    return (
      <Panel
        forceRender={true}
        key={dataItem.question.questionId}
        header={`${index + 1}. ${dataItem.question.question}`}
        accordion={true}
      >
        <ul className="answerOptions">
          <Space direction="vertical">
            {dataItem.question.answerOptions.map(item => this.renderAnswerOptions(item, dataItem))}
          </Space>
        </ul>
      </Panel>
    );
  }

  render() {
    const { totalAnswersUser } = this.props.quizResult;
    console.log('totalAnswersUser:', totalAnswersUser)
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
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Title level={4}>Your Result</Title>
            <p>You have completed: <strong>{this.props.quizResult.answersCount}</strong> questions</p>
            <p>You have  correct: <strong>{this.props.quizResult.totalAnswerCorrect}</strong> answers</p>
            <p>Complete correct word: <strong>{this.props.quizResult.percentCorrect}</strong> %</p>
            <a href="/" ><Button type="primary" icon={<AntDesignOutlined />}>Do it again</Button></a>
            <Title level={4}>Your Answers</Title>
            <Collapse expandIconPosition={'end'} activeKey={totalAnswersUser.map(dataItem => dataItem.question.questionId)} >
              {totalAnswersUser.map((item, index) => this.renderAnswerQuestions(item, index))}
            </Collapse>
          </Space>

        </div>
      </CSSTransitionGroup>
    );
  }
}

Result.propTypes = {
  quizResult: PropTypes.object.isRequired
};

export default Result;
