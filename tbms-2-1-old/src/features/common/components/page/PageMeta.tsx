import { HelmetProvider, Helmet } from "react-helmet-async";

const DEFAULT_SITE_NAME = "TBMS";

const PageMeta = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <Helmet>
    <title>{title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME}</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
