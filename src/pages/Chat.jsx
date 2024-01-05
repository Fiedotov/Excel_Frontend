import { Box, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

import { chats } from "../utils/constants";
import SingleChatBox from "../components/SingleChatbox";
import { sendRequest, getFullUrl } from "../utils/Request";
import { ConstructionOutlined } from "@mui/icons-material";

const bot_name = "Lucullus Bot";
const recommend = "Lucullus Bot";
const Chat = () => {
  const [request, setRequest] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(0);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    setMessages([...messages, { content: "Hello, How can I assist you today?", role: bot_name }]);
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

  const sendMessage = async (msg) => {
    setMessages([...messages, { content: msg, role: "user" }]);

    const formdata = new FormData();
    formdata.append("msg", msg);
    const response = await fetch(getFullUrl("user-question"), {
      method: "POST",
      headers: {
        Authorization: `Bearer `,
      },
      body: formdata,
    });

    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let chunks = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks += decoder.decode(value);
      setMessages([
        ...messages,
        { content: msg, role: "user" },
        {
          content: chunks,
          role: recommend,
        },
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
