import React, { useEffect, useState, useRef } from 'react';
import './PlayVideo.css';
import video1 from '../../assets/video.mp4';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import save from '../../assets/save.png';
import zin from '../../assets/zin.jpg';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from './../../data';
import moment from 'moment';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

const PlayVideo = ({ videoId }) => {
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [loadingComments, setLoadingComments] = useState(false);
    const [sortOption, setSortOption] = useState('relevance'); // 'relevance' for Top Comments, 'time' for Newest First
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});
    const [user, setUser] = useState(null);

    const sentinelRef = useRef(null);

    const fetchVideoData = async () => {
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url)
            .then(res => res.json())
            .then(data => setApiData(data.items[0]));
    };

    const fetchChannelData = async () => {
        if (apiData) {
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            await fetch(channelData_url)
                .then(res => res.json())
                .then(data => setChannelData(data.items[0]));
        }
    };

    const fetchCommentData = async (pageToken = '') => {
        if (loadingComments) return;
        setLoadingComments(true);

        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}&pageToken=${pageToken}&order=${sortOption}`;
        await fetch(comment_url)
            .then(res => res.json())
            .then(data => {
                setCommentData(prevComments => [...prevComments, ...data.items]);
                setNextPageToken(data.nextPageToken);
                setLoadingComments(false);
            });
    };

    const postReply = async (parentId) => {
        if (!user) {
            alert('You need to be logged in to reply to comments.');
            return;
        }

        const reply_url = `https://youtube.googleapis.com/youtube/v3/comments?part=snippet&key=${API_KEY}`;
        const requestBody = {
            snippet: {
                parentId: parentId,
                textOriginal: replyText
            }
        };
        await fetch(reply_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(res => res.json())
        .then(data => {
            setReplyingTo(null);
            setReplyText('');
            fetchCommentData(); // Refresh comments
        });
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCommentData([]);
        fetchCommentData();
    };

    const handleReplyChange = (event) => {
        setReplyText(event.target.value);
    };

    const handleReplySubmit = (parentId) => {
        postReply(parentId);
    };

    const handleViewReplies = (commentId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const handleLogin = (response) => {
        const profile = response.profileObj;
        setUser(profile);
    };

    const handleLogout = () => {
        googleLogout();
        setUser(null);
    };

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        fetchChannelData();
    }, [apiData]);

    useEffect(() => {
        fetchCommentData();
    }, [sortOption]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchCommentData(nextPageToken);
                }
            },
            { threshold: 1 }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, [nextPageToken]);

    return (
        <div className='play-video'>
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <h3>{apiData ? apiData.snippet.title : 'Title Here'}</h3>
            <div className="play-video-info">
                <p>{apiData ? value_converter(apiData.statistics.viewCount) : '16K'} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ''}</p>
                <div>
                    <span><img src={like} alt="" />{apiData ? value_converter(apiData.statistics.likeCount) : '16K'}</span>
                    <span><img src={dislike} alt="" />2</span>
                    <span><img src={save} alt="" />Save</span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ''} alt="" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ''}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : '1K'} Subscribers</span>
                </div>
                <button>Subscriber</button>
            </div>
            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : 'Description Here'}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>
                <div className="sort-comments">
                    <label htmlFor="sort-comments">Sort by:</label>
                    <select id="sort-comments" value={sortOption} onChange={handleSortChange}>
                        <option value="relevance">Top Comments</option>
                        <option value="time">Newest First</option>
                    </select>
                </div>
                {/* {user ? (
                    <div className="comment-form">
                        <img src={user_profile} alt="User Profile" />
                        <textarea value={replyText} onChange={handleReplyChange} placeholder="Write your reply..."></textarea>
                        <button onClick={() => handleReplySubmit(null)}>Post Reply</button>
                    </div>
                ) : (
                    <div className="sign-in">
                        <GoogleLogin onSuccess={handleLogin} onFailure={(error) => console.error('Login failed:', error)} />
                    </div>
                )} */}
                {commentData.map((item, index) => (
                    <div key={index} className="comment">
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className="comment-action">
                                <img src={like} alt="" />
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="" />
                                {user && <button onClick={() => setReplyingTo(item.id)}>Reply</button>}
                            </div>
                            {replyingTo === item.id && (
                                <div className="reply-section">
                                    <textarea value={replyText} onChange={handleReplyChange} placeholder="Write your reply..."></textarea>
                                    <button onClick={() => handleReplySubmit(item.id)}>Post Reply</button>
                                </div>
                            )}
                            {item.replies && item.replies.comments && (
                                <div>
                                    <button className="view-replies" onClick={() => handleViewReplies(item.id)}>
                                        {expandedReplies[item.id] ? 'Hide Replies' : `View ${item.replies.comments.length} Replies`}
                                    </button>
                                    {expandedReplies[item.id] && (
                                        <div className="replies">
                                            {item.replies.comments.map((reply, index) => (
                                                <div key={index} className="comment reply">
                                                    <img src={reply.snippet.authorProfileImageUrl} alt="" />
                                                    <div>
                                                        <h3>{reply.snippet.authorDisplayName} <span>{moment(reply.snippet.publishedAt).fromNow()}</span></h3>
                                                        <p>{reply.snippet.textDisplay}</p>
                                                        <div className="comment-action">
                                                            <img src={like} alt="" />
                                                            <span>{value_converter(reply.snippet.likeCount)}</span>
                                                            <img src={dislike} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {nextPageToken && <div ref={sentinelRef} style={{ height: '1px' }}></div>}
            </div>
        </div>
    );
};

export default PlayVideo;
