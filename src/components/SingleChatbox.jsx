import { Avatar, Box, Typography } from "@mui/material";
import Typewriter from "./Typewriter";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const arrowSize = "10px";
const arrowStyles = {
  position: "absolute",
  width: "0",
  height: "3px",
  borderTop: `${arrowSize} solid transparent`,
  borderBottom: `${arrowSize} solid transparent`,
  top: "15px",
};

const SingleChatBox = ({ role, content, updateScroll }) => {
  let res = content;
  return (
    <Box
      display="flex"
      gap={3}
      justifyContent={role === "user" ? "flex-end" : "flex-start"}
    >
      <Box
        width={["35px", "35px", "50px"]}
        height={["35px", "35px", "50px"]}
        borderRadius="50%"
        overflow="hidden"
        order={role === "user" ? 2 : 1}
      >
        <Avatar sx={{ width: 46, height: 46 }} />
      </Box>
      <Box
        minWidth={["60%", "60%", "50%"]}
        maxWidth={["60%", "60%", "50%"]}
        order={role === "user" ? 1 : 2}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          style={{ "white-space-collapse": "break-spaces" }}
        >
          {
            <Box
              bgcolor="#7E839C40"
              borderRadius="10px"
              p={2}
              position="relative"
            >
              <Box
                sx={
                  role === "user"
                    ? {
                      ...arrowStyles,
                      right: "-14px",
                      borderLeft: `15px solid #7E839C40`,
                    }
                    : {
                      ...arrowStyles,
                      left: "-14px",
                      borderRight: `15px solid #7E839C40`,
                    }
                }
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: ["20px", "20px", "24px"],
                  color: "#FFF",
                }}
              >
                {role}
              </Typography>
              <Typography
                sx={{
                  fontSize: ["18px", "18px", "22px"],
                  color: "#FFF",
                }}
              >
                {role == 'user' || role == 'Recommend Result' ? <ReactMarkdown children={res} remarkPlugins={[remarkGfm]} /> : <ReactMarkdown children={res} remarkPlugins={[remarkGfm]} />}
              </Typography>
            </Box>
          }
        </Box>
      </Box>
    </Box>
  );
};

export default SingleChatBox;
