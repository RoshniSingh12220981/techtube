import React, { useEffect, useState } from 'react';
import './Recommended.css';

import { API_KEY, value_converter } from '../../data';
import { Link } from 'react-router-dom';

const Recommended = ({ categoryId }) => {
    const [apiData, setApiData] = useState([]);

    const fetchData = async () => {
        try {
            console.log(`Fetching data for categoryId: ${categoryId}`);
            const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
            const response = await fetch(relatedVideo_url);
            const data = await response.json();
            console.log('Fetched data:', data);
            setApiData(data.items);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    return (
        <div className='recommended'>
            {apiData.length > 0 ? (
                apiData.map((item, index) => (
                    <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className='side-video-list'>
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                        <div className="vid-info">
                            <h4>{item.snippet.title}</h4>
                            <p>{item.snippet.channelTitle}</p>
                            <p>{value_converter(item.statistics.viewCount)}</p>
                        </div>
                    </Link>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Recommended;
