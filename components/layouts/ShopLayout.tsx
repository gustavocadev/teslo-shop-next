import Head from "next/head"
import { ReactNode } from "react"
import Navbar from "../ui/Navbar"
import { SideMenu } from "../ui"

type Props = {
  children: ReactNode
  title: string
  pageDescription: string
  imageFullUrl?: string
}

const ShopLayout = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
        <meta name="og:image:alt" content={pageDescription} />
        <meta name="og:image:type" content="image/jpeg" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={`https://testo-shop.now.sh`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageFullUrl} />
        <meta name="twitter:image:alt" content={pageDescription} />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
      </Head>
      <nav>
        <Navbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        {children}
      </main>

      <footer>{/* todo: custom footer */}</footer>
    </>
  )
}

export default ShopLayout
