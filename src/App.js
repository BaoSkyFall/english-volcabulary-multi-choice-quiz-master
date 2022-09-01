import React, { Component } from 'react';
import quizQuestions from './api/1_100_QuizQuestions';
import Quiz from './components/Quiz';
import Result from './components/Result';
import logo from './svg/logo.svg';
import * as ENUM from './constant/enum';
import * as _ from 'lodash';
import "antd/dist/antd.css";
import { Modal, Form, Button, Slider } from 'antd';
import {
  SettingOutlined
} from '@ant-design/icons';
import './App.css';
import { set } from 'lodash';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const marks = {
  0: '0',
  10: '100',
  20: '200',
  30: '300',
  40: '400',
  50: '500',
  60: '600',
  70: '700',
  80: '800',
  90: '900',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>1000</strong>,
  },
};
class App extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {},
      totalAnswersUser: [],
      result: null,
      isModalVisible: false,
      totalQuestions: 10,
      range: [0, 10],
      totalAnswer: 5,
    };
    this.quizQuestionsCore = _.cloneDeep(quizQuestions);
    this.quizQuestionsGenerate = [];
    this.quizQuestionsGenerateRaw = [];
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.randomWrongAnswer = this.randomWrongAnswer.bind(this);
    this.generateWrongAnswer = this.generateWrongAnswer.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChangeSlideTotalQuestions = this.onChangeSlideTotalQuestions.bind(this);
    this.onChangeSlideRangeQuestions = this.onChangeSlideRangeQuestions.bind(this);



  }

  componentDidMount() {
    const setting = (localStorage.getItem('settings'))
    let totalQuestions = this.state.totalQuestions;
    let range = this.state.range;

    if (setting) {
      const value = JSON.parse(setting);
      this.setState({
        totalQuestions: value.totalQuestions,
        range: value.range,
        isModalVisible: false
      })
      totalQuestions = value.totalQuestions;
      if (this.formRef.current) {
        this.formRef.current.setFieldsValue({
          totalQuestions: value.totalQuestions,
          range: value.range
        })
      }

    }
    else {
      if (this.formRef.current) {
        this.formRef.current.setFieldsValue({
          totalQuestions: this.state.totalQuestions,
          range: this.state.range
        })
      }
    }


    this.generateWrongAnswer()
    this.quizQuestionsGenerateRaw = _.cloneDeep(this.quizQuestionsGenerate)
    this.quizQuestionsGenerate = _.slice(this.quizQuestionsGenerate, 0, totalQuestions)
    this.setState({
      question: this.quizQuestionsGenerate[0].question,
      answerOptions: this.quizQuestionsGenerate[0].answers
    });
  }
  generateWrongAnswer() {
    if (quizQuestions) {
      this.quizQuestionsGenerate = quizQuestions.map(question => {
        for (let i = 0; i < ENUM.TOTAL_WRONG_ANSWER - 1; i++) {
          const answerWrong = this.randomWrongAnswer(question);
          question.answers.push(answerWrong)
        }
        question.answers = _.shuffle(question.answers)
        return question
      })
      this.quizQuestionsGenerate = this.shuffleArray(this.quizQuestionsGenerate)
    }

  }
  onFinish = (values) => {
    console.log(values);
  };
  randomWrongAnswer(questionItem) {
    const answerWrong = _.sample(_.filter(this.quizQuestionsCore, item => {
      return !questionItem.answers.map(item => item.id).includes(item.id)
    }))
    answerWrong.answers[0].correct = false;
    answerWrong.answers[0].id = answerWrong.id;

    return answerWrong.answers[0]
  }
  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event);

    if (this.state.questionId < this.quizQuestionsGenerate.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer.content]: (state.answersCount[answer.content] || 0) + 1
      },
      totalAnswersUser: [...state.totalAnswersUser, answer],
      answer: answer.content
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      ...this.state,
      counter: counter,
      questionId: questionId,
      question: this.quizQuestionsGenerate[counter].question,
      answerOptions: this.quizQuestionsGenerate[counter].answers,
      answer: ''
    });
  }

  getResults() {
    const answersCount = Object.keys(this.state.answersCount).length;
    const totalAnswerCorrect = this.state.totalAnswersUser.filter(item => item.correct).length;
    const percentCorrect = parseFloat((totalAnswerCorrect / answersCount) * 100).toFixed(2);;
    const result = {
      answersCount,
      totalAnswerCorrect,
      percentCorrect,
      totalAnswersUser: this.state.totalAnswersUser
    }
    return result
  }

  setResults(result) {
    if (result) {
      console.log('result:', result)
      this.setState({ result: result });
    } else {
      this.setState({ result: 'Cannot generate your result' });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={this.quizQuestionsGenerate.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }
  handleOk() {
    const value = this.formRef.current.getFieldsValue();
    this.quizQuestionsGenerate = _.slice(this.quizQuestionsGenerateRaw, 0, value.totalQuestions)
    localStorage.setItem('settings', JSON.stringify(value))
    this.setState({
      range: value.range,
      totalQuestions: value.totalQuestions,
      isModalVisible: false,
      question: this.quizQuestionsGenerate[0].question,
      answerOptions: this.quizQuestionsGenerate[0].answers
    });
  }
  handleCancel() {
    this.setState({ isModalVisible: false })
  }
  onChangeSlideTotalQuestions = (value) => {
    this.formRef.current.setFieldsValue({
      totalQuestions: value
    })
  };
  onChangeSlideRangeQuestions = (value) => {
    this.formRef.current.setFieldsValue({
      range: value
    })
  };
  openSetting() {

    this.setState({
      isModalVisible: true
    })
    setTimeout(() => this.formRef.current.setFieldsValue({
      totalQuestions: this.state.totalQuestions,
      range: this.state.range
    }), 100)
  }
  render() {
    return (
      <div className="App">
        <div className="App-header-questions">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Vocalbulary Multiple Choice</h2>
          <SettingOutlined onClick={() => this.openSetting()} />
        </div>
        {this.state.result ? this.renderResult() : this.renderQuiz()}

        <Modal title="Setting Vocalbulary" visible={this.state.isModalVisible} onOk={() => this.handleOk()} onCancel={() => this.handleCancel()}>
          <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
            <Form.Item
              name="totalQuestions"
              label="Total Questions"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Slider defaultValue={10} step={10}
                onChange={this.onChangeSlideTotalQuestions}
              />

            </Form.Item>
            <Form.Item
              name="range"
              label="Range Questions"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Slider range marks={marks} step={10}
                onChange={this.onChangeSlideRangeQuestions}
                defaultValue={[0, 10]} />
            </Form.Item>


          </Form>
        </Modal>
      </div>
    );
  }
}

export default App;
