import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import db from '../db.json';
import Widget from '../src/Components/Widget';
import QuizBackground from '../src/Components/QuizBackground';
import QuizLogo from '../src/Components/QuizLogo';
import Footer from '../src/Components/Footer';
import GitHubCorner from '../src/Components/GitHubCorner';
import Input from '../src/Components/Input';
import Button from '../src/Components/Button';
import QuizContainer from '../src/Components/QuizContainer';
import Link from '../src/Components/Link';

// const Title = styled.h1`
//   font-size: 50px;
//   color: ${({ theme }) => theme.colors.primary};
// `

// const BackgroundImage = styled.div `
//   background-image: url(${db.bg});
//   flex: 1;
//   background-size: cover;
//   background-position: center;
// `;

export default function Home() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>AluraQuiz</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        <Widget
          as={motion.section}
          transition={{delay: 0, duration: 0.5}}
          variants={{
            show: {opacity: 1, y: '0'},
            hidden: { opacity: 0, y: '100%' }
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>

            <p>{db.description}</p>

            <form onSubmit={function (event) {
              event.preventDefault();
              router.push(`/quiz?name=${name}`);
              console.log('funcionando')
            }}>

              <Input
                name="nomeUsuario"
                onChange={(infoEvento) => { setName(infoEvento.target.value) }}
                placeholder="Diz ai seu nome"
                value={name}
              />

              <Button type="submit" disabled={name.length === 0}>
                {`Jogar ${name}`}
              </Button>  
            </form>
          </Widget.Content>
        </Widget>
        
        <Widget
          as={motion.section}
          transition={{delay: 0.5, duration: 0.5}}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 }
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Content>
            <h1>Quizes da galera</h1>
            <ul>
              {db.external.map((linkExterno) => {
                const [projectName, githubUser] = linkExterno
                .replace(/\//g, '')
                .replace('https:', '')
                .replace('.vercel.app', '')
                .split('.');

                return (
                  <li key={linkExterno }>
                    <Widget.Topic as={Link} href={`/quiz/${projectName}___${githubUser}`}>
                      {`${githubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                )
              })}
            </ul>
          </Widget.Content>
        </Widget>
        <Footer 
        as={motion.footer}
        transition={{delay: 0.5, duration: 0.5}}
        variants={{
          show: { opacity: 1 },
          hidden: { opacity: 0 }
        }}
        initial="hidden"
        animate="show"
        />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/matheusjos3" />
    </QuizBackground>
  );
}
