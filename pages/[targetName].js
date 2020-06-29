import { useRouter } from "next/router";
import Layout from "../components/layout";
import axios from "axios";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useImmer } from "use-immer";
import { SketchPicker } from "react-color";

const getRandomBackgroundColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
};

const Target = () => {
  const router = useRouter();

  const { targetName, code = "0" } = router.query;

  const [event, setEvent] = useImmer({
    isLoading: true,
    targetName,
    content: null,
    validCode: true,
  });

  const getEvent = useCallback(async () => {
    try {
      const res = await axios.get("/api/event/detail", {
        params: {
          targetName,
          code,
        },
      });
      if (res && res.data) {
        const { data } = res.data;
        if (data && data.event && data.event !== "Not registered event") {
          setEvent((draft) => {
            draft.isLoading = false;
            draft.content = data.event.content;
          });
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

  const [message, setMessage] = useImmer({
    title: "",
    body: "",
  });

  const _handleChangeMessageTitle = useCallback(
    ({ target: { value } }) => {
      setMessage((draft) => {
        draft.title = value;
      });
    },
    [message]
  );

  const _handleChangeMessage = useCallback(
    ({ target: { value } }) => {
      setMessage((draft) => {
        draft.body = value;
      });
    },
    [message]
  );

  const [color, setColor] = useImmer({
    backgroundColor: "#ffffff",
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
      setColor((draft) => {
        draft.backgroundColor = newColor.hex;
      });
    },
    [color]
  );

  const colorPickerBg = useMemo(() => {
    return getRandomBackgroundColor();
  }, []);

  console.log(colorPickerBg);

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
                />
                {color.visiblePicker && (
                  <div className="sketch-picker">
                    <SketchPicker
                      color={color.backgroundColor}
                      onChangeComplete={_handleChangeCompleteColor}
                    />
                  </div>
                )}
                <input
                  className="message-to"
                  type="text"
                  value={message.title}
                  onChange={_handleChangeMessageTitle}
                  placeholder={`To. ${targetName}`}
                />
                <hr style={{ width: "100%" }} />
                <textarea
                  placeholder={event.content}
                  value={message.body}
                  onChange={_handleChangeMessage}
                />
              </div>

              <div className="message-btn">메세지 전송</div>
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

          .message-wrapper {
            position: relative;
            width: 340px;
            height: 340px;
            display: flex;
            flex-direction: column;
            padding: 10px;
            box-shadow: 5px 5px 10px grey;
            background-color: ${color.backgroundColor};
          }

          .message-wrapper .message-color-picker {
            position: absolute;
            top: 25px;
            right: 25px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid ${color.visiblePicker ? "white" : "black"};
            background-color: ${color.backgroundColor};
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
