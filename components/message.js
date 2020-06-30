import { memo, useState, useCallback } from "react";
import axios from "axios";

const Message = (props) => {
  const {
    background_color: backgroundColor,
    code,
    created_at: createdAt,
    event_id: eventId,
    from,
    id,
    message,
    opened_at: openedAt,
    to,
    updatedAt,
  } = props.message;
  const { setOpenedAt, rank } = props;

  console.log(rank);

  const openMemo = useCallback(async () => {
    try {
      if (openedAt) return;
      const res = await axios.get("/api/event/open", { params: { id } });
      if (res && res.data) {
        const { data } = res.data;
        setOpenedAt(data.openedAt);
      }
    } catch (error) {
      console.log(error);
    }
  }, [openedAt, setOpenedAt]);

  return (
    <>
      <div className="message-wrapper" onClick={openMemo}>
        {openedAt && (
          <>
            {rank !== 0 && <p className="rank">RANK : {rank}</p>}
            <p className="message-to">{to}</p>
            <hr style={{ width: "100%" }} />
            <p className="message-body">{message}</p>
            <p className="message-from">{from}</p>
          </>
        )}
      </div>
      <style jsx>{`
        .message-wrapper {
          position: relative;
          display: inline-block;
          width: 340px;
          height: 340px;
          display: flex;
          flex-direction: column;
          padding: 10px;
          box-shadow: 5px 5px 10px grey;
          background-color: ${backgroundColor};
          margin: 10px;
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
        .message-body {
          display: flex;
          flex: 1;
          border: 0px;
          background: transparent;
          font-size: 16px;
          line-height: 26px;
          margin: 10px;
        }
        .message-from {
          text-align: right;
          font-size: 16px;
          line-height: 26px;
          padding-right: 20px;
        }
        .rank {
          position: absolute;
          top: 0;
          right: 20px;
          color: red;
        }
      `}</style>
    </>
  );
};

export default memo(Message);
