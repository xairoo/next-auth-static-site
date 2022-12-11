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
