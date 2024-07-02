import React from 'react';
import './Video.css';
import PlayVideo from '../../Components/PlayVideo/PlayVideo';
import Recommended from '../../Components/Recommended/Recommended';
import { useParams } from 'react-router-dom';

const Video = () => {
  const { videoId,categoryId } = useParams();

  return (
    <div className='play-container'>
      <PlayVideo videoId={videoId} className='playvideo'/>
      <Recommended categoryId={categoryId} className='recommend'/>
    </div>
  );
};

export default Video;

