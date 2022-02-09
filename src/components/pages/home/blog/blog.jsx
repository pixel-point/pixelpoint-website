import { Link } from 'gatsby';
import React from 'react';

const data = [
  {
    title: 'Kubernetes port forwarding simple like never before',
    description:
      'Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.',
    url: '#',
  },
  {
    title: 'Kubernetes port forwarding simple like never before',
    description:
      'Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.',
    url: '#',
  },
  {
    title: 'Kubernetes port forwarding simple like never before',
    description:
      'Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.',
    url: '#',
  },
  {
    title: 'Kubernetes port forwarding simple like never before',
    description:
      'Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.',
    url: '#',
  },
  {
    title: 'Kubernetes port forwarding simple like never before',
    description:
      'Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.',
    url: '#',
  },
  {
    title: 'Kubernetes port forwarding simple like never before',
    description:
      'Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.',
    url: '#',
  },
];

const Blog = () => (
  <section className="blog default">
    <div className="container">
      <h3>
        <strong>Blog.</strong> Team experience gone public
      </h3>
      <div className="mb-8 grid grid-cols-3 gap-8">
        {data.map(({ title, description, url }, index) => (
          <Link
            to={url}
            key={index}
            className="group flex flex aspect-[384/268] flex-col rounded-2xl bg-gray-0 p-5"
          >
            <div className="mb-4 text-xl">{title}</div>
            <p className="flex-grow font-light">{description}</p>
            <div href={url} className="link link-secondary link-group">
              Read more
            </div>
          </Link>
        ))}
      </div>
      <div className="text-right">
        <a href="#" className="link link-primary">
          All articles
        </a>
      </div>
    </div>
  </section>
);

export default Blog;
