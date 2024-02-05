import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import axiosMethod from '../service/AxiosConfig'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

    if (Component.getLayout) {
        {axiosMethod({router})}
        return (<>
                {axiosMethod({router})}
                <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>
            </>)
    } else {
        return (
            <LayoutProvider>
                {axiosMethod({router})}
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}
