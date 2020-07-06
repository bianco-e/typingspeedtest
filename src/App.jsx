import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useInterval from "./hooks/useInterval";

function App() {
  const [chosenQuote, setChosenQuote] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [timerTrigger, setTimerTrigger] = useState(false);
  const [time, setTime] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");

  const getQuote = () => {
    fetch("https://favqs.com/api/qotd")
      .then((response) => response.json())
      .then((data) => {
        setChosenQuote(data.quote.body);
        setQuoteAuthor(data.quote.author);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getQuoteLength = () => {
    return chosenQuote.split("").length;
  };

  const onKeyDownFn = (e) => {
    const answerLen = answer.length;
    const quoteLen = chosenQuote.length;

    if (e.keyCode === 13) {
      if (answerLen === quoteLen) {
        setResult(
          `Time: ${time}/ Mistakes: ${compareAnswer()}/ Average: ${(
            time / quoteLen
          ).toFixed(1)} seconds per character`.split("/")
        );
        setTimerTrigger(false);
      } else {
        setResult(
          `Answer is ${
            answerLen < quoteLen ? "shorter" : "longer"
          } than quote, fix it`.split("/")
        );
      }
    }
  };

  const compareAnswer = () => {
    const answerChars = answer.split("");
    const quoteChars = chosenQuote.split("");
    var mistakesCounter = 0;
    answerChars.forEach((char, idx) => {
      if (char !== quoteChars[idx]) {
        mistakesCounter += 1;
      }
    });
    return mistakesCounter;
  };

  useInterval(
    () => {
      const currentTime = time + 0.1;
      setTime(parseFloat(currentTime.toFixed(1)));
    },
    100,
    timerTrigger
  );

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <Wrapper>
      <Text size="22px">{time}</Text>
      {chosenQuote && <Text>{`Length: ${getQuoteLength()} chars`}</Text>}
      {chosenQuote && <Text>{`Author: ${quoteAuthor}`}</Text>}
      <Text size="20px">{chosenQuote || "Loading quote..."}</Text>
      <TextArea
        placeholder="Write the quote here and press enter"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => onKeyDownFn(e)}
        onFocus={() => setTimerTrigger(true)}
      />
      {result && (
        <>
          {result.map((element) => (
            <Text mbot="3px">{element}</Text>
          ))}
          <Button
            onClick={() => {
              getQuote();
              setTime(0);
              setAnswer("");
              setResult("");
            }}
          >
            🔄
          </Button>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  padding: "0 2% 0 2%",
});
const Text = styled.p({
  fontSize: (props) => props.size || "15px",
  textAlign: "center",
  marginBottom: (props) => props.mbot,
});
const TextArea = styled.input({
  fontSize: "16px",
  width: "80%",
  minHeight: "10vh",
  padding: "1%",
});
const Button = styled.button({
  border: "none",
  cursor: "pointer",
  fontSize: "30px",
  background: "none",
});

export default App;
