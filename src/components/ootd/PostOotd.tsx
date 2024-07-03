'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import PostInput from './PostInput';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import { useMutation } from 'react-query';
import { fetchWeather } from '@/services/ootd.ts/weather';
import { createPost } from '@/services/ootd.ts/ootdPost';
import { PostRequest, OotdRequest } from '@/types/ootd';
import { LOCATIONS, LocationKey } from '@/constants/locations';
import { UploadedImage } from '@/types/ootd';

const PostOotd: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [post, setPost] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationKey | ''>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);

  const weatherMutation = useMutation(
    (variables: { latitude: number; longitude: number; date: string }) =>
      fetchWeather(variables.latitude, variables.longitude, variables.date),
    {
      onSuccess: (data) => {
        setWeather(data.result);
      },
    }
  );

  const postMutation = useMutation(
    (variables: { postRequest: PostRequest; ootdRequest: OotdRequest }) =>
      createPost(variables.postRequest, variables.ootdRequest),
    {
      onSuccess: (data) => {
        console.log('Post created:', data);
      },
    }
  );

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0 && date !== '') {
      weatherMutation.mutate({ latitude, longitude, date });
    }
  }, [latitude, longitude, date]);

  const handleFetchWeather = () => {
    if (location === '') {
      alert('위치를 선택해주세요.');
      return;
    }
    if (date === '') {
      alert('날짜를 입력해주세요.');
      return;
    }

    const selectedLocation = LOCATIONS[location];
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
  };

  const formatDateString = (dateString: string) => {
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    return dateString;
  };

  const handleCreatePost = () => {
    const formattedDate = formatDateString(date);

    const postRequest: PostRequest = {
      title: 'ootd 게시물',
      body: post,
      postType: 'OOTD',
      location,
      images: images.map(image => ({
        imgUrl: image.imgUrl,
        accessUri: image.accessUri,
        authenticateId: image.authenticateId,
      })),
      tags,
    };

    const ootdRequest: OotdRequest = {
      area: weather?.area || '',
      weatherStatus: weather?.status || '',
      weatherTemp: weather?.avgTemp || '',
      detailLocation: location,
      date: formattedDate,
    };

    console.log('Sending postRequest:', JSON.stringify(postRequest, null, 2));
    console.log('Sending ootdRequest:', JSON.stringify(ootdRequest, null, 2));

    postMutation.mutate({ postRequest, ootdRequest });
  };

  const handleLocationChange = (location: LocationKey | '') => {
    setLocation(location);
    setWeather(null);
  };

  const handleDateChange = (date: string) => {
    setDate(date);
    setWeather(null);
  };

  return (
    <div className="w-[80%] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploader onImagesChange={setImages} />
        <div className="space-y-4">
          <PostInput onPostChange={setPost} onTagsChange={setTags} />
          <LocationInput onLocationChange={handleLocationChange} />
          <DateInput onDateChange={handleDateChange} />
          {weather ? (
            <div className="w-full bg-neutral-100 rounded justify-center items-center inline-flex py-4 text-neutral-500 text-xl">
              <div>지역: {weather.area}, 평균 온도: {weather.avgTemp}°C</div>
            </div>
          ) : (
            <button
              onClick={handleFetchWeather}
              className="w-full bg-neutral-100 rounded-lg justify-center items-center inline-flex py-4 text-neutral-500 text-xl"
            >
              날씨 불러오기
            </button>
          )}
          <div className='w-full'>
          <button
            onClick={handleCreatePost}
            className="w-[100px] ml-auto p-2 bg-rose-500 rounded-lg justify-center items-center inline-flex px-4 py-2 text-white text-xl"
          >
            올리기
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PostOotd;
