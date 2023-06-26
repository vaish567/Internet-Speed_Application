import React, { useState } from 'react';
import Speedometer from 'react-d3-speedometer';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const SpeedTest = () => {
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(0);

  const measureSpeed = async () => {
    setLoading(true);
    try {
      const startTime = new Date().getTime();
      const response = await axios.get('https://source.unsplash.com/random/800x600', {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded;
          const total = progressEvent.total;
          const progress = Math.round((loaded * 100) / total);
          setSpeed(progress);
        },
      });
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // Duration in seconds

      const contentSize = response.headers['content-length'];
      const fileSize = contentSize / 1e6; // Convert to MB
      const speedMbps = (fileSize / duration).toFixed(2);

      setSpeed(parseFloat(speedMbps));
    } catch (error) {
      console.error('Error measuring speed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="speed-test-container">
      <Typography variant="h4" className="title">
        Internet Speed Test
      </Typography>
      <Button variant="contained" color="primary" onClick={measureSpeed} disabled={loading}>
        {loading ? 'Measuring...' : 'Start Test'}
      </Button>
      <div className="speedometer-container">
        <Speedometer
          minValue={0}
          maxValue={100}
          value={speed}
          needleColor="red"
          startColor="green"
          endColor="red"
          needleTransitionDuration={2000}
          height={300}
        />
        {speed > 0 && (
          <Typography variant="h5" className="speed">
            {speed} Mbps
          </Typography>
        )}
      </div>
    </div>
  );
};

export default SpeedTest;
