import React from 'react';
import Head from 'next/head';

import db from '../db.json';
import Widget from '../src/Components/Widget';
import QuizBackground from '../src/Components/QuizBackground';
import QuizLogo from '../src/Components/QuizLogo';
import Button from '../src/Components/Button';
import QuizContainer from '../src/Components/QuizContainer';
import AlternativesForm from '../src/Components/AlternativesForm';

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Tela de Resultado
      </Widget.Header>

      <Widget.Content>
        <p>Você acertou {' '}
          {/* {results.reduce((somaAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if(isAcerto) {
              return somaAtual + 1;
            }

            return somaAtual;
          }, 0)}  */}
          {results.filter((x) => x).length}
          {' '} perguntas</p>
        <ul>
          {results.map((result, index) => (
            <li key={`result_${result}`}>
              #{index + 1} {' '} Resultado: 
              {result === true ? 'Acertou' : 'Errou'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
      <img
        src="https://rifa.milaautomoveis.com.br/assets/img/loading.gif"
        alt="Carregando"
        style={{
          width: '100%',
          height: '50px',
          objectFit: 'cover',
        }}
      />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, totalQuestion, questionIndex, onSubmit , addResult}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question_${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

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

        <AlternativesForm onSubmit={(event) => {
          event.preventDefault();
          setIsQuestionSubmited(true);
          setTimeout(() => {
            addResult(isCorrect)
            onSubmit();
            setIsQuestionSubmited(false);
            setSelectedAlternative(undefined)
          }, 3 * 1000);
        }}>
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative_${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;

            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            )
          })} 

          {/* <pre> {JSON.stringify(question, null, 4)} </pre> */}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          
          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
          
        </AlternativesForm>
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
  const [results, setResults] = React.useState([]);
  const totalQuestion = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  function addResult(result) {
    setResults([
      ...results,
      result
    ])
  }

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
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} /> }
      </QuizContainer>
    </QuizBackground>
  );
}
