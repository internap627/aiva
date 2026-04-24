import React from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const RadarChartComponent = ({ scoresA, scoresB, nameA, nameB, height = 400, compact = false }) => {
  const toVisualScore = (score) => 16 + (score * 0.84);

  const data = [
    { subject: 'Price', A: toVisualScore(scoresA.price), B: toVisualScore(scoresB.price), fullMark: 100 },
    { subject: 'Battery', A: toVisualScore(scoresA.battery), B: toVisualScore(scoresB.battery), fullMark: 100 },
    { subject: 'Camera', A: toVisualScore(scoresA.camera), B: toVisualScore(scoresB.camera), fullMark: 100 },
    { subject: 'Storage', A: toVisualScore(scoresA.storage), B: toVisualScore(scoresB.storage), fullMark: 100 },
  ];

  return (
    <div className={`radar-chart-shell${compact ? ' compact' : ''}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart
          data={data}
          cx="50%"
          cy={compact ? '47%' : '50%'}
          outerRadius={compact ? '60%' : '72%'}
          margin={{ top: compact ? 18 : 12, right: compact ? 40 : 32, bottom: compact ? 28 : 18, left: compact ? 40 : 32 }}
        >
          <PolarGrid gridType="circle" stroke="#c7d5e6" />
          <PolarAngleAxis
            dataKey="subject"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#14325c', fontSize: compact ? 11 : 12, fontWeight: 700 }}
          />
          <PolarRadiusAxis
            angle={90}
            axisLine={false}
            tickCount={4}
            domain={[0, 100]}
            tick={{ fill: '#4e617b', fontSize: compact ? 10 : 11 }}
          />
          <Radar
            name={nameA}
            dataKey="A"
            stroke="#14325c"
            fill="#14325c"
            fillOpacity={0.3}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Radar
            name={nameB}
            dataKey="B"
            stroke="#69b6ff"
            fill="#69b6ff"
            fillOpacity={0.38}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: compact ? 10 : 14 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
