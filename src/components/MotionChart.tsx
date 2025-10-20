import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Label,
} from 'recharts';

interface MotionChartProps {
  data: Array<{ t: number; v: number; s: number }>;
  xKey: string;
  yKey: string;
  yLabel: string;
  lineColor: string;
}

const MotionChart = ({ data, xKey, yKey, yLabel, lineColor }: MotionChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300} minWidth={0}>
      <LineChart
        data={data}
        margin={{ 
          top: 5, 
          right: 10, 
          left: 0, 
          bottom: 20 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xKey}
          stroke="#6b7280"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => value.toFixed(2)}
          interval="preserveStartEnd"
        >
          <Label
            value="Time (s)"
            offset={-10}
            position="insideBottom"
            style={{ fill: '#374151', fontWeight: 500, fontSize: 14 }}
          />
        </XAxis>
        <YAxis
          stroke="#6b7280"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => value.toFixed(2)}
          width={60}
        >
          <Label
            value={yLabel}
            angle={-90}
            position="insideLeft"
            style={{ fill: '#374151', fontWeight: 500, textAnchor: 'middle', fontSize: 14 }}
          />
        </YAxis>
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px'
          }}
          labelStyle={{ color: '#374151', fontWeight: 600 }}
          itemStyle={{ color: lineColor }}
          formatter={(value: number) => value.toFixed(3)}
          labelFormatter={(label) => `Time: ${Number(label).toFixed(3)}s`}
        />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MotionChart;
