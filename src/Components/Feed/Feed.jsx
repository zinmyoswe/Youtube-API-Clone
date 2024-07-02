import React, { useEffect, useState } from 'react';
import './Feed.css';
import { Link, useLocation } from 'react-router-dom';
import { API_KEY, value_converter } from './../../data';
import moment from 'moment';

const Feed = ({ searchResults, searchTerm, setSearchResults, setSearchTerm, category }) => {
  const [data, setData] = useState([]);
  const [videoStats, setVideoStats] = useState({});
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentSearchTerm = searchParams.get('searchTerm') || searchTerm;

  // Fetch video data (statistics) for a specific video
  const fetchVideoData = async (videoId) => {
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.items.length) {
      return data.items[0];
    }
  };

  // Fetch data based on the current search term or selected category
  const fetchData = async () => {
    let url;
    if (currentSearchTerm) {
      // Fetch search results
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(currentSearchTerm)}&type=video&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.items);

      // Fetch video statistics for search results
      const videoIds = data.items.map(item => item.id.videoId);
      const statsPromises = videoIds.map(videoId => fetchVideoData(videoId));
      const statsData = await Promise.all(statsPromises);
      const statsMap = statsData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setVideoStats(statsMap);

    } else {
      // Fetch popular videos based on category
      url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setData(data.items);

      // Fetch video statistics for popular videos
      const videoIds = data.items.map(item => item.id);
      const statsPromises = videoIds.map(videoId => fetchVideoData(videoId));
      const statsData = await Promise.all(statsPromises);
      const statsMap = statsData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setVideoStats(statsMap);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentSearchTerm, category]);  // Add category as a dependency

  // Determine which videos to display
  const videosToDisplay = currentSearchTerm ? searchResults : data;

  return (
    <div className='feed'>
      {videosToDisplay.map((item) => {
        const videoId = item.id.videoId || item.id; // Extract video ID from search results or video list
        const videoDetails = videoStats[videoId] || {};
        const viewCount = videoDetails.statistics?.viewCount || 0;
        return (
          <Link to={`/video/${videoId}`} key={videoId} className="card">
            <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
            <div className="card-content">
              <h2>{item.snippet.title}</h2>
              <h3>{item.snippet.channelTitle}</h3>
              <p>{value_converter(viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
