import { NextPage } from "next";
import Head from "next/head";

const AdminPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Admin Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        Admin
      </main>
    </>
  );
};

export default AdminPage;
