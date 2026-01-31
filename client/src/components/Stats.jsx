import React from 'react';

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '5000+', label: 'Students Trained' },
  { value: '98%', label: 'Success Rate' },
  { value: '50+', label: 'Faculty Experts' },
];

const Stats = () => (
  <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
    <div className="container mx-auto px-4 grid gap-8 grid-cols-2 md:grid-cols-4 text-center">
      {stats.map((s, i) => (
        <div key={i}>
          <h3 className="text-4xl font-bold mb-2">{s.value}</h3>
          <p>{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;
