import React, { Fragment, useEffect, useState } from "react";
import styles from "../componentsStyles/Question.module.css";
import TestNav from "./TestNav.component";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
// import { config } from "dotenv/types";
import $ from 'jquery'; 
import "../componentsStyles/Question.module.css";
function Question(props) {
  let history = useHistory();
  let location = useLocation();
  const res = location.state.res;
  const mins = res.time.split(":")[0];
  const secs = (res.time.split(":")[1])? res.time.split(":")[1] : 0 ;
  const length = res.results.length;
  const [ques, setques] = useState(0);
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState({});
  const [quizData, setQuizData] = useState([])
  useEffect(()=>{},[props.user, props.role])

  let name = props.user?.name;
  let email = props.user?.email;
  
  const submithandler = async () => {
    
    // let name = localStorage.getItem("name");
    // let email = localStorage.getItem("email");
    
    let pin = localStorage.getItem("pin");
    
    let score = 0;
    for (let i = 0; i < length; i++) {
      if (answers[i] == res.results[i].correct_answer) {      
        score += 1;
      }
    }

    score = (score / length) * 100;
    // const options = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };
    // try {
    //   const res = await axios.post('/user/submittest', {
    //     pin,
    //     email,
    //     name,
    //     score,
    //   })
    //   console.log("success")
    // } catch (err) {
    //     console.log(err)
    // }
    console.log("score is", score)
    await axios
      .post(
        "/user/submittest",
        {
          pin,
          email,
          name,
          quizData,
          objlength : length,
          score,
        }
      )
      .then((res) => {
        console.log("this is response",res);
        history.push('/')
      })
      .catch((err) => console.log("error",err));
        console.log("error has occured");
  };

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  useEffect(() => {
    for (let i = 0; i < length; i++) {
      res.results[i].question = res.results[i].question.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[i].correct_answer = res.results[i].correct_answer.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[ques].incorrect_answers = res.results[
        ques
      ].incorrect_answers.map((x) =>
        x.replace(/&#?\w+;/g, (match) => entities[match])
      );
    }
  }, [res]);

  useEffect(() => {
    setquestion(res.results[ques].question);
    setoptions([
      res.results[ques].correct_answer,
      ...res.results[ques].incorrect_answers,
    ]);
    shuffleArray(options);
  }, [ques]);

  useEffect(()=>{
    console.log("Quiz Data",quizData)
  },[quizData])
  const entities = {
    "&#039;": "'",
    "&quot;": '"',
    "&lt;": "<",
    "&gt;": ">",
    "&#39;": "'",
    "&#34;": "'",
    "&#034;": '"',
    "&#60;": "<",
    "&#060;": "<",
    "&#62;": ">",
    "&#062;": ">",
    "&amp;": "&",
    "&#38;": "&",
    "&#038;": "&",
  };

  const changeclass = (e) => {
    const domele = e.nativeEvent.path;
    domele.reverse();
    let ans = "";
    for (let ele of domele) {
      if (ele.id === "options") {
        for (let ans of ele.childNodes) {
          // console.log("answer is", ans)
          // ans.className = styles.container;
        }
      } else if (ele.localName === "div" && ele.id === "") {
        // ele.className = styles.containeractive;
        // console.log("answer in if else", ans)
        ans = ele.childNodes[0].value;
      }
    }
    setanswers({ ...answers, [ques]: ans });
    let question = res.results[ques].question.replace(
      /&#?\w+;/g,
      (match) => entities[match]
    );
    let answer = res.results[ques].correct_answer.replace(
      /&#?\w+;/g,
      (match) => entities[match]
    );
    const dataToMutate = { 
      question : question, 
      correct_answer : answer,
      selected_answer: ans
    }
    setQuizData ({...quizData, ["obj_" + ques] :dataToMutate})

    // setQuizData(...quizData , dataToMutate)
    // console.log("answer after loops", ans)
    // console.log("Question : ", res.results[ques].question)
    // console.log("Correct Anaswer : ", res.results[ques].correct_answer)
    // console.log("Answers array is ",answers)
  };
const choices = options.map((option, index) => (
  <div className="options__container">


  </div>
 )
)
  return (
    <Fragment>
    <TestNav mins={mins} secs={secs} submithandler={submithandler} />
    <div className={styles.qcontainer}>
      {ques + 1}. {question}
    </div>
    <div id="options">
      {options.map((option, index) => (
        <div key={index} className= {styles.container} onClick={changeclass}>
          <input
            className={styles.radios}
            type="radio"
            value={option}
            name="options"
            id={index.toString()}
          />
          <label htmlFor={index.toString()}>
            {String.fromCharCode("A".charCodeAt(0) + index)}. {option}
          </label>
        </div>
      ))}
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <a
        onClick={(e) => {
          if (ques == 0) {
          } else {
            setques(ques - 1);
            let answeropt = e.nativeEvent.path[2].childNodes[2].childNodes;
            for (let opt of answeropt) {
              opt.className = styles.container;
            }
          }
        }}
        className={styles.buttons1}
      >
        &#8249;
      </a>
      <a
        onClick={(e) => {
          if (ques == length - 1) {
          } else {
            setques(ques + 1);
            let answeropt = e.nativeEvent.path[2].childNodes[2].childNodes;
            for (let opt of answeropt) {
              opt.className = styles.container;
            }
          }
        }}
        className={styles.buttons2}
      >
        &#8250;
      </a>
    </div>
  </Fragment>
  );
}

export default Question;
