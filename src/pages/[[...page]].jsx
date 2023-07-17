import React from 'react'
import { useRouter } from 'next/router'
import { BuilderComponent, builder, useIsPreviewing,Builder } from '@builder.io/react'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'

// put your Public API Key you copied from Builder.io here
const BUILDER_API_KEY = process.env.BUILDER_IO_KEY;
builder.init(BUILDER_API_KEY)




export async function getStaticProps({
  params,
}) {
  const page = await builder.get('page', {
    userAttributes: {
      urlPath: '/' + (params?.page?.join('/') || ''),
    }
  })
  .toPromise() || null

  return {
    props: {
      page,
    },
    revalidate: 5,
  }
}

export async function getStaticPaths() {
  const pages = await builder.getAll('page', {
    options: { noTargeting: true }
  })

  return {
    paths: pages.map((page) => `${page.data?.url}`),
    fallback: true,
  }
}

export default function Page({
  page,
}) {
  const router = useRouter()
  const isPreviewing = useIsPreviewing();

  React.useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
    ;(function(o,l,a,r,k,y){if(o.olark)return;
    r="script";y=l.createElement(r);r=l.getElementsByTagName(r)[0];
    y.async=1;y.src="//"+a;r.parentNode.insertBefore(y,r);
    y=o.olark=function(){k.s.push(arguments);k.t.push(+new Date)};
    y.extend=function(i,j){y("extend",i,j)};
    y.identify=function(i){y("identify",k.i=i)};
    y.configure=function(i,j){y("configure",i,j);k.c[i]=j};
    k=y._={s:[],t:[+new Date],c:{},l:a};
    })(window,document,"static.olark.com/jsclient/loader.js");
    /* Add configuration calls below this comment */
    olark.identify('4502-983-10-6796');
    `;
    document.body.appendChild(script);
    
    // remove the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  if (router.isFallback) {
    return <h1>Loading...</h1>
  }
  if (!page && !isPreviewing) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
          <meta name="title"></meta>
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    )
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <BuilderComponent model="page" content={page} />
    </>
  )
}