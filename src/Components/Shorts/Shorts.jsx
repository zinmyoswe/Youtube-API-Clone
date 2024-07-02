import React, { useEffect, useState } from 'react';
import './Shorts.css';
import { API_KEY } from './../../data';

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  
  const fetchShorts = async () => {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=shorts&type=video&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    setShorts(data.items);
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  useEffect(() => {
    const playVideo = (index) => {
      if (index >= 0 && index < shorts.length) {
        const videoId = shorts[index].id.videoId || shorts[index].id;
        const player = window.YT.get(`player-${videoId}`);
        if (player && player.playVideo) {
          player.playVideo();
        }
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      shorts.forEach((item, index) => {
        const videoId = item.id.videoId || item.id;
        new window.YT.Player(`player-${videoId}`, {
          videoId,
          events: {
            'onReady': (event) => {
              if (index === 0) {
                event.target.playVideo();
              }
            },
            'onStateChange': (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                playVideo(index + 1);
              }
            },
          },
        });
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      window.onYouTubeIframeAPIReady();
    }
  }, [shorts]);

  return (
    <div className="shorts-container">
      {shorts.map((item) => {
        const videoId = item.id.videoId || item.id;
        return (
          <div key={videoId} className="shorts-video">
            <div id={`player-${videoId}`} />
            <div className="shorts-video-info">
              <h2>{item.snippet.title}</h2>
              <h3>{item.snippet.channelTitle}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Shorts;
