import Head from 'next/head';
import Layout from '../components/layout';
import cookies from 'next-cookies';

const App = ({ Component, pageProps }) => {
  console.log('App');
  return (
    <div>
      <Head>
        <title>Congratulations!!</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
};

App.getInitialProps = (context) => {
  const { ctx, Component } = context;

  const { cookie } = ctx.req.headers;

  console.log(cookie);

  return {};
};

export default App;
