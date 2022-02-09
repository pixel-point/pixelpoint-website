import React from 'react';

const data = [
  {
    title: 'Professional team',
    description:
      'The team power-packed with talented web, graphic and motion designers and software engineers led by skilled project managers whose synergy and sum of experience bring stunning marketing websites to life on a regular basis.',
  },
  {
    title: 'Communication-oriented',
    description:
      'Communication is the key to any successful relationship. At Pixel Point we answer in a matter of hours, eagerly joining requirements discussions and deliver constant updates, making our work as transparent as it possible.',
  },
  {
    title: 'On the same page with you',
    description:
      'We align our expectations long before we sign the contract. Thanks to a strong tech base we gained working with k8s, Docker, Cloud Native technologies, we are able to truly get the purpose of your product and how it works from the first call.',
  },
];
const SeeDifference = () => (
  <section className="see-the-difference default">
    <div className="container">
      <h3>
        It doesn’t have to be like that.
        <br />
        Work with Pixel Point to see the difference:
      </h3>
      <ul className="grid list-decimal grid-cols-3 gap-8 marker:text-2xl marker:text-primary">
        {data.map(({ title, description }, index) => (
          <li key={index} className="ml-7">
            <h4>{title}</h4>
            <p className="text-lg font-light">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default SeeDifference;
