import * as React from "react";
import { Helmet } from "react-helmet";
import State from "../State/State";
import Communication from "../Communication/Communication";

interface LayoutProps {
  children: any;
  title: string;
}
const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  return (
    <>
      <State />
      <Communication />
      <Helmet>
        <title> {props.title} - Screen Controller </title>

      </Helmet>
      <div>
          {props.children}
      </div>
    </>
  );
};

export default Layout;
