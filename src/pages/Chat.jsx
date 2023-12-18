import { Box, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

import { chats } from "../utils/constants";
import SingleChatBox from "../components/SingleChatbox";
import { sendRequest } from "../utils/Request";
import { ConstructionOutlined } from "@mui/icons-material";

const questions = [
  "Please tell us what your professional or career goals in healthcare are?",
  "Are you looking into any programs/schools?",
  "Recommend programs/schools",
  "Do you have any college courses credits in the last 7 years?",
  "What college courses have you taken?",
  "Recommend an academic plan using prerequisite courses",
  "Do you have any experience working in healthcare?",
  "Recommend and See if the work experience can meet program requirements",
];

const answer = [
  "Name of Program",
  "Name of Training Institution",
  "Name of Program",
  "Name of Program",
  "Name of Program",
];

function isFirstWordRecommend(sentence) {
  // Split the sentence into an array of words
  const words = sentence.split(" ");

  // Check if the first word is 'Recommend', case-insensitive
  if (words.length > 0 && words[0].toLowerCase() === "recommend") {
    return true;
  } else {
    return false;
  }
}

const bot_name = "Excel Health Bot";
const recommend = "Recommend Result";
const Chat = () => {
  const [request, setRequest] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(0);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    setMessages([...messages, { content: questions[0], role: bot_name }]);
    setIndex(1);
  }, []);

  useEffect(() => {
    updateScroll();
  }, [messages]);

  const updateScroll = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const handleChangeText = (e) => {
    const value = e.target.value;
    if (value.length <= 512) {
      setText(e.target.value);
    }
  };

  const sendMessage = (msg) => {
    let requestString = `${request}"${answer[index - 1]}" : "${msg}", `;
    setRequest(requestString);
    if (isFirstWordRecommend(questions[index])) {
      setMessages([...messages, { content: msg, role: "user" }]);
      setIndex(index + 2);
      const formdata = new FormData();
      formdata.append("message", requestString);
      sendRequest("send-message", {
        body: formdata,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const nextQuestion = questions[index + 1]
            ? `\n${questions[index + 1]}`
            : "";
          setMessages([
            ...messages,
            { content: msg, role: "user" },
            { content: `${result}${nextQuestion}`, role: recommend },
          ]);
        });
    } else {
      setIndex(index + 1);
      setMessages([
        ...messages,
        { content: msg, role: "user" },
        { content: questions[index], role: bot_name },
      ]);
    }
  };

  const handleClickSendButton = (e) => {
    sendMessage(text);
    setText("");
  };

  const handleInput = useCallback(
    (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        sendMessage(ev.target.value);
        setText("");
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    // Create New Thread
    // sendRequest("create-new-thread").then((response) => response.json());
  }, []);

  return (
    <>
      <Box
        style={{
          maxHeight: "calc(100vh - 70px)",
          overflowY: "auto",
        }}
        ref={chatBoxRef}
      >
        <Box
          px={[1, 1, 2]}
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor="rgb(21, 28, 44)"
          pt={4}
          pb={4}
          minHeight="calc(100vh - 134px)"
        >
          {messages.map((item) => {
            return (
              <SingleChatBox
                updateScroll={updateScroll}
                key={item.id}
                {...item}
              />
            );
          })}
        </Box>
      </Box>

      <Box
        bgcolor="#190821"
        display="flex"
        py={2}
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        <Box ml={2} width="100%">
          <TextField
            size="small"
            sx={{
              background: "#7E839C40",
              border: "none",
              borderRadius: "25px",
              width: "100%",
              "& fieldset": { border: "none" },
              input: { color: "#FFF", fontWeight: 600 },
            }}
            value={text}
            onChange={handleChangeText}
            onKeyUp={handleInput}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" mx={3}>
          <Box sx={{ cursor: "pointer" }} onClick={handleClickSendButton}>
            <SendIcon sx={{ color: "white", fontSize: "35px" }} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Chat;
