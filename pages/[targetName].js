import { useCallback, useEffect, useMemo, useState } from "react";

import Layout from "../components/layout";
import { SketchPicker } from "react-color";
import axios from "axios";
import { useImmer } from "use-immer";
import { useRouter } from "next/router";

const Target = () => {
  const router = useRouter();

  const { targetName, code = "0" } = router.query;

  const [event, setEvent] = useImmer({
    isLoading: true,
    targetName,
    content: null,
    validCode: false,
    message: null,
  });

  const [message, setMessage] = useImmer({
    to: "",
    message: "",
    from: "",
    backgroundColor: "#ffffff",
    label: "메시지 등록",
  });

  const getEvent = useCallback(async () => {
    try {
      const res = await axios.get("/api/event/detail", {
        params: {
          targetName,
          code,
        },
      });

      console.log("res", res);
      if (res && res.data) {
        const { data } = res.data;
        console.log(res.data);
        if (data && data.event && data.event !== "Not registered event") {
          setEvent((draft) => {
            draft.isLoading = false;
            draft.content = data.event.content;
            if (data.message) {
              draft.validCode = true;
              draft.message = data.message;
            }
          });
          if (data.message) {
            console.log(data.message);
            setMessage((draft) => {
              const { to, message, from, background_color } = data.message;

              draft.to = to || "";
              draft.message = message || "";
              draft.from = from || "";
              draft.backgroundColor = background_color || "#ffffff";

              if (to || message || from || background_color !== "#ffffff") {
                draft.label = "메시지 수정";
              }
            });
          }
        } else {
          console.log("wrong access");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getEvent();
  }, []);

  const _handleChangeMessageTo = useCallback(
    ({ target: { value } }) => {
      setMessage((draft) => {
        draft.to = value;
      });
    },
    [message]
  );

  const _handleChangeMessage = useCallback(
    ({ target: { value } }) => {
      setMessage((draft) => {
        draft.message = value;
      });
    },
    [message]
  );

  const _handleChangeMessageFrom = useCallback(
    ({ target: { value } }) => {
      setMessage((draft) => {
        draft.from = value;
      });
    },
    [message]
  );

  const [color, setColor] = useImmer({
    visiblePicker: false,
  });

  const _handleClickColorPicker = useCallback(
    (e) => {
      setColor((draft) => {
        draft.visiblePicker = !draft.visiblePicker;
      });
    },
    [color]
  );

  const _handleChangeCompleteColor = useCallback(
    (newColor) => {
      setMessage((draft) => {
        draft.backgroundColor = newColor.hex;
        console.log(newColor);
      });
    },
    [message]
  );

  const _handleClickUpload = useCallback(async () => {
    try {
      console.log(event.message);
      const res = await axios.post("/api/event/upload", {
        ...message,
        id: event.message.id,
      });
      if (res && res.data) {
        const {
          data: { result },
        } = res.data;
        if (result) {
          alert("메시지가 등록 되었습니다.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [message, event]);

  return (
    <Layout>
      <div className="container">
        <div className="container">
          <div className="content-wrapper noselect">
            <img src="https://cdn.ftoday.co.kr/news/photo/201704/71763_76298_1251.jpg" />
            {targetName && event.content && (
              <div>
                <h1>{`"${targetName}"`}</h1>
                <h2>{event.content}</h2>
              </div>
            )}
          </div>
          {event.validCode && (
            <>
              <p className="message-comment">{`"${targetName}"에게 축하메시지를 남겨 주세요.`}</p>
              <div className="message-wrapper">
                <div
                  className="message-color-picker"
                  onClick={_handleClickColorPicker}
                >
                  <div />
                  <div />
                  <div />
                  {color.visiblePicker && <div>X</div>}
                </div>
                {color.visiblePicker && (
                  <div className="sketch-picker">
                    <SketchPicker
                      color={message.backgroundColor}
                      onChangeComplete={_handleChangeCompleteColor}
                    />
                  </div>
                )}
                <input
                  className="message-to"
                  type="text"
                  value={message.to}
                  onChange={_handleChangeMessageTo}
                  placeholder={`To. ${targetName}`}
                />
                <hr style={{ width: "100%" }} />
                <textarea
                  placeholder={event.content}
                  value={message.message}
                  onChange={_handleChangeMessage}
                />
                <p className="message-from">
                  <input
                    type="text"
                    value={message.from}
                    onChange={_handleChangeMessageFrom}
                    placeholder="From. 에디트홈"
                  />
                </p>
              </div>

              <div className="message-btn" onClick={_handleClickUpload}>
                {message.label}
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          .message-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 50px;
            margin-top: 20px;
            border: 1px solid grey;
            font-size: 20px;
            line-height: 30px;
            font-weight: bold;
          }

          .message-comment {
            font-size: 20px;
          }

          .message-to {
            width: 80%;
            padding-left: 10px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 24px;
            line-height: 30px;
            border: 0px;
            background: transparent;
          }

          .message-from {
            text-align: right;
            font-size: 16px;
            line-height: 26px;
          }

          .message-from input {
            width: 150px;
            border: 0px;
            background: transparent;
            font-size: 16px;
            line-height: 26px;
          }

          .message-wrapper {
            position: relative;
            width: 340px;
            height: 340px;
            display: flex;
            flex-direction: column;
            padding: 10px;
            box-shadow: 5px 5px 10px grey;
            background-color: ${message.backgroundColor};
          }

          .message-wrapper .message-color-picker {
            position: absolute;
            top: 25px;
            right: 25px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid ${color.visiblePicker ? "white" : "black"};
            background-color: ${message.backgroundColor};
            display: flex;
            flex-direction: row;
            overflow: hidden;
          }

          .message-color-picker div {
            display: flex;
          }

          .message-color-picker div:nth-child(1) {
            background-color: #ff6666;
            flex: 1.5;
          }

          .message-color-picker div:nth-child(2) {
            background-color: #66ff66;
            flex: 1;
          }

          .message-color-picker div:nth-child(3) {
            background-color: #6666ff;
            flex: 1.5;
          }

          .message-color-picker div:nth-child(4) {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
          }

          .sketch-picker {
            position: absolute;
            top: 25px;
            right: 60px;
          }

          .message-wrapper textarea {
            display: flex;
            flex: 1;
            border: 0px;
            background: transparent;
            font-size: 16px;
            line-height: 26px;
          }

          .container {
            padding: 20px 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .container .content-wrapper {
            width: 340px;
            box-shadow: 3px 3px 10px gray;
            margin-bottom: 50px;
          }

          .container .content-wrapper img {
            width: 100%;
          }

          .container .content-wrapper div {
            padding: 20px 30px;
          }

          .message main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer img {
            margin-left: 0.5rem;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .title a {
            color: #0070f3;
            text-decoration: none;
          }

          .title a:hover,
          .title a:focus,
          .title a:active {
            text-decoration: underline;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .grid {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            max-width: 800px;
            margin-top: 3rem;
          }

          .card {
            margin: 1rem;
            flex-basis: 45%;
            padding: 1.5rem;
            text-align: left;
            color: inherit;
            text-decoration: none;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            transition: color 0.15s ease, border-color 0.15s ease;
          }

          .card:hover,
          .card:focus,
          .card:active {
            color: #0070f3;
            border-color: #0070f3;
          }

          .card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }

          .card p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }

          .logo {
            height: 1em;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Target;
