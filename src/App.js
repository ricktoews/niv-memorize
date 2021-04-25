import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
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
      <Switch>
        <Route exact path="/" component={withNav(Home, 'Bible Passage Memorization')} />
        <Route exact path="/text-to-verse" component={withNav(TextToVerse, 'Bible Passage Quiz By Text')} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
