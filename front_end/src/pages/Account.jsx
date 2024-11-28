import React, { useState, useCallback, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { DatePicker, Button } from 'antd'; // For selecting dates
import { getTotalEvents } from '../api/index'; // Assuming this is your API call
const { RangePicker } = DatePicker;

function formatDate(timestamp) {
  const date = new Date(timestamp); // Convert the timestamp into a Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, '0'); // Pad single digit days with a leading zero
  return `${year}-${month}-${day}`;
}


function Account() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [generateHeatmap, setGenerateHeatmap] = useState(false);

  
  const [heatmapData, setHeatmapData] = useState([]); // State to store the heatmap data

  // Fetch the event data from the API and set it to state
  const fetchData = useCallback(async (startDate, endDate) => {
    const local_user = localStorage.getItem('user');
    const obj = JSON.parse(local_user);
    try {
      const result = await getTotalEvents(`/events/count?host_id=${obj.id}&since=${startDate.format("YYYY-MM-DD")}&until=${endDate.format("YYYY-MM-DD")}`);
      const startTimestamp = +echarts.time.parse(startDate.format('YYYY-MM-DD'));
      const endTimestamp = +echarts.time.parse(endDate.format('YYYY-MM-DD'));
      const dayTime = 3600 * 24 * 1000; // Milliseconds per day
      const data = [];

      for (let time = startTimestamp; time <= endTimestamp; time += dayTime) {
        const formattedDate = formatDate(time);
        const val = result[formattedDate] || 0; // Default to 0 if no data is found for this date
        data.push([echarts.time.format(time, '{yyyy}-{MM}-{dd}', false), val]);
      }

      setHeatmapData(data); // Set the data to state
    } catch (error) {
      console.error('Error fetching data:', error);
    }


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

      fetchData(startDate, endDate); // Fetch the data when the button is clicked
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

      text: 'Daily Event Count'

    },
    tooltip: {},
    visualMap: {
      min: 0,
      max: 15,
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
      range: startDate && endDate ? [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')] : '2024', // Dynamically set range
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: heatmapData // Use the fetched data for the heatmap
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
