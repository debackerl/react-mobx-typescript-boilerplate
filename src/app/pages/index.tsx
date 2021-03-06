import * as style from './style.css'
import * as React from 'react';
import { Helmet } from "react-helmet";
import Layout from 'app/components/Layout';
import About from './About.mdx';

function buildPage(title: string, page: (props: any) => JSX.Element) : (props: any) => JSX.Element {
  return (props: any) =>
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={style.page}>{page(props)}</div>
    </Layout>;
}

export const AboutPage = buildPage("About", About);