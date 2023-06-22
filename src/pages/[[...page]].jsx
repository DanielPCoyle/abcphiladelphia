import { useRouter } from 'next/router'
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'

// put your Public API Key you copied from Builder.io here
const BUILDER_API_KEY = '8d83f5b405ca40b98d1296cf135e14e8'
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
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }
  const isPreviewing = useIsPreviewing();
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