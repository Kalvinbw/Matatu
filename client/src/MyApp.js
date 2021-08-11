import React from 'react';

import Begin from './components/Begin';
import NewApp from './NewApp';

import { BrowserRouter as Router, Route } from "react-router-dom";

const MyApp = () => {
  return (
    <Router>
      <Route path="/" exact component={Begin} />
      <Route path="/app" component={NewApp} />
    </Router>
  );
}

export default MyApp;