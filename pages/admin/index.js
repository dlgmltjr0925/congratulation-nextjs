import React, { useContext } from "react";

import Event from "../../components/event";
import UserContext from "../../contexts/userContext";
import axios from "axios";
import { useCallback } from "react";
import { useImmer } from "use-immer";

const Admin = () => {
  const {
    user: { isLoggedIn, accessToken },
    setUser,
  } = useContext(UserContext);

  const [loginInput, setLoginInput] = useImmer({
    id: "",
    password: "",
  });

  const _handleChangeId = useCallback(({ target: { value } }) => {
    setLoginInput((draft) => {
      draft.id = value;
    });
  }, []);

  const _handleChangePassword = useCallback(({ target: { value } }) => {
    setLoginInput((draft) => {
      draft.password = value;
    });
  }, []);

  const _handleClickLoginButton = useCallback(async () => {
    try {
      const res = await axios.get("/api/login", {
        params: loginInput,
      });
      if (res && res.data) {
        const { accessToken } = res.data;
        setUser((draft) => {
          draft.isLoggedIn = true;
          draft.accessToken = accessToken;
        });
        document.cookie = `accessToken=${accessToken}; path=/admin`;
      } else {
        alert("로그인에 실패하였습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error(error);
    }
  }, [loginInput]);

  return (
    <>
      <div className="container">
        {isLoggedIn ? (
          <Event />
        ) : (
          <div className="login-container">
            <div className="input-wrapper">
              <p>ID</p>
              <input
                type="text"
                value={loginInput.id}
                onChange={_handleChangeId}
              />
            </div>
            <div className="input-wrapper">
              <p>PW</p>
              <input
                type="password"
                value={loginInput.password}
                onChange={_handleChangePassword}
              />
            </div>
            <p
              className="login-button noselect"
              onClick={_handleClickLoginButton}
            >
              로그인
            </p>
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .login-container {
          width: 360px;
          height: 360px;
          box-shadow: 5px 5px 10px gray;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .input-wrapper {
          width: 80%;
          margin-bottom: 10px;
        }
        .input-wrapper input {
          width: 100%;
          height: 30px;
        }
        .login-button {
          width: 80%;
          height: 40px;
          background: green;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Admin;
