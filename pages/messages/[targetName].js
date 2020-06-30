import { useRouter } from "next/router";
import { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import Message from "../../components/message";

const MessageList = () => {
  const router = useRouter();

  const { targetName } = router.query;

  const [messages, setMessages] = useState([]);
  // const message = {
  //   background_color: "#dad6f6",
  //   code: "69ms39yxs2y",
  //   created_at: 1593449947561,
  //   event_id: 32,
  //   from: "Bright",
  //   id: 51,
  //   message: "축하드립니다!!!aa",
  //   opened_at: null,
  //   to: "To. Ben!!",
  //   updated_at: 1593535042013,
  // };

  const getMessages = useCallback(async () => {
    try {
      const res = await axios.get("/api/event/messages", {
        params: {
          targetName,
        },
      });
      if (res && res.data) {
        const { data } = res.data;
        if (data) {
          setMessages(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getMessages();
    // let interval = setInterval(() => {
    //   getMessages();
    // }, 30000);
    // return () => {
    //   clearInterval(interval);
    //   interval = null;
    // };
  }, []);

  const mixedMessages = useMemo(() => {
    const writtenMessages = messages.filter(
      ({ created_at, updated_at, to, message, from, background_color }) =>
        to !== null ||
        message !== null ||
        from !== null ||
        background_color !== "#ffffff"
    );

    const length = writtenMessages.length;

    for (let i = 0; i < length; i++) {
      const target = Math.floor(Math.random() * (length - 1));
      const temp = writtenMessages[target];
      writtenMessages[target] = writtenMessages[i];
      writtenMessages[i] = temp;
    }
    return writtenMessages;
  }, [messages]);

  const rank = useMemo(() => {
    const openedAts = mixedMessages
      .filter(({ opened_at }) => opened_at !== null)
      .map(({ opened_at }) => opened_at);
    return openedAts.sort().slice(0, 3);
  }, [mixedMessages]);

  console.log(rank);

  return (
    <div className="container">
      {mixedMessages.map((message) => {
        const setOpenedAt = (openedAt) => {
          setMessages(
            messages.map((item) => {
              if (item.id === message.id) {
                return {
                  ...message,
                  opened_at: openedAt,
                };
              } else {
                return item;
              }
            })
          );
        };

        return (
          <Message
            key={message.id}
            message={message}
            setOpenedAt={setOpenedAt}
            rank={
              rank.findIndex((openedAt) => message.opened_at === openedAt) + 1
            }
          />
        );
      })}
      <style jsx>{`
        .container {
          display: flex;
          flex: 1;
          flex-direction: row;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};

export default MessageList;
