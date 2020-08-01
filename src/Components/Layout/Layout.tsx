import * as React from "react";
import { Helmet } from "react-helmet";
import State from "../State/State";

interface LayoutProps {
  children: any;
  title: string;
}
const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  return (
    <>
      <Helmet>
        <title> {props.title} - Screen Controller </title>

      </Helmet>
      {/* <State /> */}
      <div>
          {props.children}
      </div>
    </>
  );
};

export default Layout;
