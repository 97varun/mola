import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { saveAs } from 'file-saver';

import React, { useState, useEffect } from "react";

function Tweets(props) {
  const [tweetsHeading, setTweetsHeading] = useState({});

  const [tweets, setTweets] = useState([]);
  const [invalidUser, setInvalidUser] = useState(undefined);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setTweetsHeading({ heading: "No tweets to show now!", btn: "disabled" });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let form = event.target
    let username = form.elements.username.value;

    let resp = await fetch(`http://localhost:5000/api/recenttweets/${username}`);

    if (resp.ok) {
      let respJson = await resp.json();
      let tweets = respJson.data;
      
      setTweets(tweets);
      window.twttr.widgets.load(document.getElementById('tweet-container'));

      setUsername(username);
      setTweetsHeading({ heading: `${username}'s recent tweets`, btn: "active" });
      setInvalidUser(false);
    }
    else {
      setInvalidUser(true);
    }
  }

  const saveTweets = () => {
    var blob = new Blob([JSON.stringify(tweets)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${username}_recent_tweets.json`);
  }

  return (
    <Container id="tweet-container" className="mt-5 pt-5">
      <Row className="justify-content-center">
        <Col sm={6} md={6} lg={6} xl={5} xxl={5}>
          <Form onSubmit={handleSubmit}>
            <Row className="align-items-center text-center">
              <Col sm={8} md={8} lg={8} xl={8} xxl={8}>
                <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
                  Username
                </Form.Label>
                <InputGroup className="mb-2">
                  <InputGroup.Text>@</InputGroup.Text>
                  <FormControl name="username"placeholder="username" isInvalid={invalidUser} isValid={invalidUser===false} />
                </InputGroup>
              </Col>
              <Col sm={4} md={4} lg={4} xl={4} xxl={4}>
                <Button type="submit" className="mb-2 w-100 btn-dark">
                  Get tweets
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mt-5">
        <Col sm={6} md={6} lg={6} xl={5} xxl={5}>
          <Form>
            <Row className="align-items-center">
              <Col sm={8} md={8} lg={8} xl={8} xxl={8}>
                <Form.Text><h5>{tweetsHeading.heading}</h5></Form.Text>
              </Col>
              <Col sm={4} md={4} lg={4} xl={4} xxl={4}>
                <Button onClick={saveTweets} className={`mb-2 w-100 btn-success ${tweetsHeading.btn}`}>
                  Download tweets
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {
        tweets.map(tweet =>
          <Row key={tweet.id} className="justify-content-center mt-2">
            <Col sm={6} md={6} lg={6} xl={5} xxl={5}>
              <blockquote className="twitter-tweet" data-lang="en"><a href={`https://twitter.com/jack/status/${tweet.id}`}></a></blockquote>
            </Col>
          </Row>
        )
      }
    </Container>
  );
}

export default Tweets;
