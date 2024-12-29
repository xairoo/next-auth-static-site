import {
  getAllLanguageSlugs,
  getLanguage,
  useTranslation,
} from "next-i18next-static-site";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("Home")}</h1>
      <div>{t("Public page")}.</div>
      <pre>
        Example name: {process.env.NEXT_PUBLIC_EXAMPLE_NAME}
        {"\n"}
        Example version: {process.env.NEXT_PUBLIC_EXAMPLE_VERSION}
        {"\n"}
        Next.js version: {process.env.NEXT_PUBLIC_NEXT_VERSION}
        {"\n"}
      </pre>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllLanguageSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const language = getLanguage(params.lang);
  return {
    props: {
      language,
    },
  };
}
