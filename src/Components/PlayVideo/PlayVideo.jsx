import React, { useState, useEffect } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
    const { videoId } = useParams();
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);

    // Fetch video data from YouTube API
    const fetchVideoData = async () => {
        try {
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
            const response = await fetch(videoDetails_url);
            const data = await response.json();
            setApiData(data.items[0]);
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
    };

    const fetchOtherData = async () => {
        if (!apiData || !apiData.snippet) return;

        try {
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const channelResponse = await fetch(channelData_url);
            const channelData = await channelResponse.json();
            setChannelData(channelData.items[0]);

            const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
            const commentResponse = await fetch(comment_url);
            const commentData = await commentResponse.json();
            setCommentData(commentData.items);
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        fetchOtherData();
    }, [apiData]);

    // Check if apiData is available
    const isDataAvailable = apiData !== null;

    return (
        <div className='play-video'>
            {/* Display video using iframe */}
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>

            {/* Display video title */}
            <h3>{isDataAvailable ? apiData.snippet.title : "Title Here"}</h3>

            <div className='play-video-info'>
                {/* Display views and publish date */}
                <p>
                    {isDataAvailable
                        ? `${value_converter(apiData.statistics.viewCount)} Views • ${moment(apiData.snippet.publishedAt).fromNow()}`
                        : "16k Views • 2 days ago"}
                </p>

                <div>
                    <span><img src={like} alt="Like" />{apiData ? value_converter(apiData.statistics.likeCount) : 155}</span>
                    <span><img src={dislike} alt="Dislike" />20</span>
                    <span><img src={share} alt="Share" />share</span>
                    <span><img src={save} alt="Save" />save</span>
                </div>
            </div>
            <hr />
            <div className='publisher'>
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="Publisher" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description here"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>
                {commentData.map((item, index) => (
                    <div className='comment' key={index}>
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="User" />
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span> {moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                            <p>{item.snippet.topLevelComment.snippet.textOriginal}</p>
                            <div className="comment-action">
                                <img src={like} alt="Like" />
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="Dislike" />
                                <span>{value_converter(item.snippet.totalReplyCount)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayVideo;
