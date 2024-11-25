import React, { useState, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { DatePicker, Button } from 'antd'; // For selecting dates
const { RangePicker } = DatePicker;

function Account() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [generateHeatmap, setGenerateHeatmap] = useState(false);

  // Modify getVirtualData to accept startDate and endDate
  const getVirtualData = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return []; // Return empty array if dates are not valid

    const startTimestamp = +echarts.time.parse(startDate.format('YYYY-MM-DD')); // Convert moment to timestamp
    const endTimestamp = +echarts.time.parse(endDate.format('YYYY-MM-DD')); // Convert moment to timestamp
    const dayTime = 3600 * 24 * 1000; // Milliseconds per day
    const data = [];
    // Loop through each day in the range and generate random data
    for (let time = startTimestamp; time <= endTimestamp; time += dayTime) {
      data.push([
        echarts.time.format(time, '{yyyy}-{MM}-{dd}', false), // Format the date
        Math.floor(Math.random() * 10000) // Generate random data
      ]);
    }
    return data;
  }, []);

  // Handler to update start and end dates from RangePicker
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Handle button click to generate heatmap
  const handleGenerateHeatmap = () => {
    if (startDate && endDate) {
      setGenerateHeatmap(true);
    } else {
      console.error('Invalid date range selected');
    }
  };

  // ECharts option for heatmap
  const option = {
    title: {
      top: 30,
      left: 'center',
      text: 'Daily Step Count'
    },
    tooltip: {},
    visualMap: {
      min: 0,
      max: 5000,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 65
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: startDate && endDate ? [startDate.format('YYYY-MM-DD'),endDate.format('YYYY-MM-DD')] : '2024', // Dynamically set range
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: generateHeatmap ? getVirtualData(startDate, endDate) : [] // Generate data on button click
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Heat Map</h2>

      {/* Date Range Picker */}
      <div className="mb-4">
        <RangePicker
          format="YYYY-MM-DD"
          onChange={handleDateChange}
        />
      </div>

      {/* Button to trigger heatmap generation */}
      <Button 
        onClick={handleGenerateHeatmap} 
        disabled={!startDate || !endDate}
      >
        Generate Heatmap
      </Button>

      {/* ECharts Component */}
      <div className="mt-6">
        <ReactECharts option={option} />
      </div>
    </div>
  );
}

export default Account;
