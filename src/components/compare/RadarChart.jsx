import React from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const RadarChartComponent = ({ scoresA, scoresB, nameA, nameB, height = 400, compact = false }) => {
  const data = [
    { subject: 'Price', A: scoresA.price, B: scoresB.price, fullMark: 100 },
    { subject: 'Battery', A: scoresA.battery, B: scoresB.battery, fullMark: 100 },
    { subject: 'Camera', A: scoresA.camera, B: scoresB.camera, fullMark: 100 },
    { subject: 'Storage', A: scoresA.storage, B: scoresB.storage, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="48%" outerRadius={compact ? '65%' : '80%'} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name={nameA} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name={nameB} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartComponent;
