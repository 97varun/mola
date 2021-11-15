import './App.css';

import React from "react";

import Navbar from './Navbar.js';
import Tweets from './Tweets';

function App() {
  return (
    [<Navbar key="nav" />,
    <Tweets key="tweets" />
    ]
  );
}

export default App;
