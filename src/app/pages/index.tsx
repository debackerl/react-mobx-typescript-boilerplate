import * as styles from './style.css'
import * as React from 'react';
import { Layout } from 'app/containers/Layout';
import About from './About.mdx';

function buildPage(page: (props: any) => JSX.Element) : (props: any) => JSX.Element {
  return (props: any) => <Layout><div className={styles.page}>{page(props)}</div></Layout>;
}

export const AboutPage = buildPage(About);