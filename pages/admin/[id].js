import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import QRCode from "react-qr-code";

const Event = () => {
  const router = useRouter();

  const { id } = router.query;

  const [codes, setCodes] = useState([]);

  const getList = useCallback(async () => {
    try {
      const res = await axios.get("/api/event/codes", {
        params: {
          id,
        },
      });
      if (res && res.data) {
        const { codes } = res.data;
        if (codes) {
          setCodes(codes.map(({ code }) => code));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [setCodes]);

  useEffect(() => {
    getList(id);
  }, []);

  return (
    <div className="container">
      {codes.map((code) => {
        const url = `http://192.168.100.3:3000/Ben?code=${code}`;

        return (
          <div key={url}>
            <p>{url}</p>
            <QRCode value={url} />
          </div>
        );
      })}
      <style jsx>{`
        .container {
          padding-left: 30px;
        }
      `}</style>
    </div>
  );
};

export default Event;
