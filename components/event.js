import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { useCallback } from "react";
import UserContext from "../contexts/userContext";

import axios from "axios";

const Event = () => {
  const {
    user: { accessToken },
  } = useContext(UserContext);
  const [events, setEvents] = useImmer({
    list: [],
  });

  const [newEvent, setNewEvent] = useImmer({
    targetName: "",
    content: "",
  });

  const _handleChangeNewEvent = useCallback(
    (key) => {
      return ({ target: { value } }) => {
        setNewEvent((draft) => {
          draft[key] = value;
        });
      };
    },
    [newEvent]
  );

  const _enrollNewEvent = useCallback(async () => {
    try {
      const { targetName, content } = newEvent;
      if (targetName.trim() === "" || content.trim() === "")
        return alert("입력값을 확인하세요");
      console.log("accessToken", accessToken);
      const res = await axios.post("/api/event/enroll", newEvent, {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      if (res && res.data) {
        const { data } = res.data;
        if (data) {
          setEvents((draft) => {
            draft.list.push(data);
            console.log(draft);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [newEvent, accessToken]);

  const _getEvents = useCallback(async ({ offset, limit }) => {
    try {
      const res = await axios.get("/api/event/list", {
        params: {
          offset,
          limit,
        },
      });
      if (res && res.data) {
        const {
          data: { list },
        } = res.data;
        setEvents((draft) => {
          draft.list = list;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    _getEvents({ offset: 0, limit: 10 });
  }, []);

  const _deleteEvent = useCallback(
    async (id) => {
      try {
        const res = await axios.post("/api/event/delete", { id });
        if (res && res.data) {
          const { data } = res.data;
          setEvents((draft) => {
            draft.list = draft.list.filter(({ id }) => id !== data);
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [events]
  );

  return (
    <div className="container">
      <h1 className="title noselect">이벤트 관리</h1>
      <table className="event-list">
        <th>ID</th>
        <th>대 상</th>
        <th>내 용</th>
        <th></th>
        {events.list.map((event) => {
          const { id, targetName, content } = event;
          return (
            <tr key={id}>
              <td className="event-id">{id}</td>
              <td className="event-target">{targetName}</td>
              <td className="event-content">{content}</td>
              <td>
                <button>수정</button>
                <button onClick={() => _deleteEvent(id)}>삭제</button>
              </td>
            </tr>
          );
        })}
        <tr>
          <td className="event-id"></td>
          <td className="event-target">
            <input
              type="text"
              value={newEvent.targetName}
              onChange={_handleChangeNewEvent("targetName")}
            />
          </td>
          <td className="event-content">
            <input
              type="text"
              value={newEvent.content}
              onChange={_handleChangeNewEvent("content")}
            />
          </td>
          <td>
            <button onClick={_enrollNewEvent}>등 록</button>
          </td>
        </tr>
      </table>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          width: 1000px;
          min-height: 100vh;
          padding: 50px;
          border: 1px solid grey;
        }
        .title {
          margin-bottom: 50px;
        }
        .event-list * {
          height: 30px;
        }
        .event-list th {
          border: 1px solid grey;
        }
        .event-list td {
          backgroud: ;
        }
        .event-list input {
          width: 100%;
        }
        .event-list .event-id {
          width: 100px;
        }
        .event-list .event-target {
          width: 200px;
        }
      `}</style>
    </div>
  );
};

export default Event;
