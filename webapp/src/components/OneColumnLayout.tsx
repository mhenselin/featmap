import { Container } from "./Container";
import { Footer } from "./Footer";
import { Header } from "./NewHeader";

type OneColumnLayoutProps = React.PropsWithChildren;

export const OneColumnLayout: React.FunctionComponent<
  Readonly<OneColumnLayoutProps>
> = (props) => {
  const { children } = props;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <Container className="grow" as="main">
        {children}
      </Container>
      <Footer />
    </div>
  );
};
