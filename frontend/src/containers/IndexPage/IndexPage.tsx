import React from 'react';
import Link from 'next/link';

export default function IndexPage() {
  return (
    <>
      <div className="index__wrapper">
        <h1 data-animation="paragraph" className="index__title">
          Index page
        </h1>

        <Link passHref href="/details">
          <a className="index__button">Go to index</a>
        </Link>
        <div className="index__spacer" />
        <p data-animation="paragraph" className="index__p">
          Index page Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Quaerat, dolores excepturi repellendus voluptate nemo, fugiat, a sint
        </p>

        <p data-animation="paragraph" className="index__p">
          Index page Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Quaerat, dolores excepturi repellendus voluptate nemo, fugiat, a sint
          cumque.
        </p>

        <p data-animation="paragraph" className="index__p">
          consectetur, adipisicing elit. Quaerat, dolores excepturi repellendus
          voluptate nemo, fugiat, a sint cumque quos minima numquam quam
          recusandae odio facilis optio impedit vero et dolorem?
        </p>

        <p data-animation="paragraph" className="index__p">
          Dlor sit amet consectetur, adipisicing elit. Quaerat, dolores
          excepturi repellendus voluptate nemo, fugiat, a sint cumque quos
          minima numquam quam recusandae odio facilis optio impedit vero et
          dolorem?
        </p>

        <p data-animation="paragraph" className="index__p">
          Dlor sit amet consectetur, adipisicing elit. Quaerat, dolores
          excepturi repellendus voluptate nemo, fugiat, a sint cumque quos
          minima numquam quam recusandae odio facilis optio impedit vero et
          dolorem?
        </p>
      </div>
    </>
  );
}
