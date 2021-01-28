import React from 'react';
import Head from 'next/head';

import db from '../db.json';
import Widget from '../src/Components/Widget';
import QuizBackground from '../src/Components/QuizBackground';
import QuizLogo from '../src/Components/QuizLogo';
import Button from '../src/Components/Button';
import QuizContainer from '../src/Components/QuizContainer';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, totalQuestion, questionIndex, onSubmit }) {
  const questionId = `question_${questionIndex}`

  return (
    <Widget>
      <Widget.Header>
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestion}`}
        </h3>
      </Widget.Header>
      <img
        alt="Descrição"
        src={question.image}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover'
        }}
      />
      <Widget.Content>
        <h1>{question.title}</h1>

        <p>{question.description}</p>

        <form onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}>
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative_${alternativeIndex}`;

            return (
              <Widget.Topic
                as="label"
                htmlFor={alternative}
              >
                <input
                  // style={{display: 'none'}}
                  id={alternativeId}
                  name={questionId}
                  type="radio" />
                {alternative}
              </Widget.Topic>
            )
          })}

          {/* <pre>
          {JSON.stringify(questions, null, 4)}
        </pre> */}

          <Button type="submit">Confirmar</Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
}

export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const totalQuestion = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ)
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>AluraQuiz</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestion={totalQuestion}
            onSubmit={handleSubmitQuiz}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <div>Você acertou X questões, parabéns!</div>}
      </QuizContainer>
    </QuizBackground>
  );
}
