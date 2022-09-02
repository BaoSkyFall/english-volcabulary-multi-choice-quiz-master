import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import {
  CheckCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
function AnswerOptionResult(props) {
  return (
    <Radio
      className=""
      name="radioGroup"
      checked={props.answerType === props.answer}
      id={props.answerType}
      value={props.answerType}
      disabled={false}
      onChange={() => { }}
    >      <label className="" style={{ fontSize: '18px' }}>
        {props.answerContent}
        {props.correct && (<CheckCircleOutlined style={{ color: "#59CE8F", marginLeft: '10px' }} />)}
        {props.answerType === props.answer && !props.correct && (<CloseOutlined style={{ color: "#FF1E00", marginLeft: '10px' }} />
        )}




      </label></Radio>


  );
}

AnswerOptionResult.propTypes = {
  answerType: PropTypes.string.isRequired,
  answerContent: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default AnswerOptionResult;
