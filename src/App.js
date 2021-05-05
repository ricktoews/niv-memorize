import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import MediaQuery from 'react-responsive';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';
import Masthead from './Masthead';
import SubMenuBar from './SubMenuBar';

import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import TextToVerse from './components/quiz/TextToVerse';

function withNav(MyComponent, title) {

  return function(...props) {

    return (
    <>
      <Masthead title={title} />
      <main>
        <MyComponent {...props} />
      </main>
    </>
    );
  }
};

function App() {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <MediaQuery query="(min-width:481px) and (max-width:4096px)">
        <Switch>
          <Route exact path="/" component={withNav(Home, 'Bible Passage Memorization')} />
          <Route exact path="/text-to-verse" component={withNav(TextToVerse, 'Bible Passage Quiz By Text')} />
        </Switch>
      </MediaQuery>

      <MediaQuery query="(max-width: 480px)">
        <Switch>
          <Route exact path="/text-to-verse" component={withNav(TextToVerse, 'Bible Passage Quiz By Text')} />
        </Switch>
      </MediaQuery>

    </ThemeProvider>
  );
}

export default App;
