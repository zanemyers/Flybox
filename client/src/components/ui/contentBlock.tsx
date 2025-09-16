import React from "react";
import Image from "./image";
import type { Props as ImageProps } from "./image";

interface Props extends ImageProps {
  heading: string;
  children: React.ReactNode;
  reverse?: boolean; // defaults to false
}

export default function ContentBlock({
  heading,
  children,
  reverse = false,
  ...imageProps
}: Props) {
  return (
    <section
      className={`row align-items-center ${reverse ? "flex-md-row-reverse" : ""}`}
    >
      <div className="col-md-6">
        <Image {...imageProps} />
      </div>
      <div className="col-md-6">
        <h2 className="h4 mb-3">{heading}</h2>
        {children}
      </div>
    </section>
  );
}
