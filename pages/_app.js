import Head from "next/head";
import Layout from "../components/layout";
import cookies from "next-cookies";
import { checkValidToken } from "../utils/sessions";

const App = ({ Component, pageProps, accessToken }) => {
  return (
    <div>
      <Head>
        <title>Congratulations!!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout accessToken={accessToken}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
};

App.getInitialProps = (context) => {
  const { ctx, Component } = context;

  const cookies = {};

  const { cookie } = ctx.req.headers;
  if (cookie) {
    const [key, value] = cookie.split("=");
    cookies[key] = value;
  }

  if (cookies.accessToken) {
    console.log(cookies.accessToken);
    if (!checkValidToken(cookies.accessToken)) {
      delete cookies.accessToken;
    }
  }

  return {
    accessToken: cookies.accessToken,
  };
};

export default App;
