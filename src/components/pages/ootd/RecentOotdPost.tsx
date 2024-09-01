'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { OotdGetResponse } from '@/types/ootd';
import { fetchAllOotdPostCount, fetchAllOotdPosts, fetchFollowOotdPosts, fetchOotdFollowPostCount } from '@/services/ootd.ts/ootdGet';
import { MemberInfo } from '@/services/auth';
import EmptyHeartIcon from '../../../../public/empty_heart_default.svg';
import CommentIcon1 from '../../../../public/empty_comment_default.svg';
import { fetchLikedPosts } from '@/services/ootd.ts/ootdComments';
import HeartIcon from '../../../../public/icon_heart.svg';

const PAGE_SIZE = 12;

interface TagContainerProps {
  item: {
    post: {
      id: number;
      body: string;
      tags: string[];
      images: { accessUri: string }[];
      likeCount: number;
      commentCount: number;
    };
    member: {
      profileUrl: string;
      nickName: string;
    };
  };
}

const TagContainer: React.FC<TagContainerProps> = ({ item }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>(item.post.tags);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tags = Array.from(container.children) as HTMLElement[];
    let totalWidth = 0;
    let visibleCount = 0;

    tags.forEach((tag, index) => {
      totalWidth += tag.offsetWidth + parseInt(getComputedStyle(tag).marginRight);

      if (totalWidth <= container.offsetWidth) {
        visibleCount = index + 1;
      }
    });

    setVisibleTags(item.post.tags.slice(0, visibleCount));
  }, [item.post.tags]);

  return (
    <div className="mt-4">
      <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard'] text-ellipsis overflow-hidden whitespace-nowrap">
        {item.post.body}
      </div>
      <div className="tag-container mt-2" ref={containerRef}>
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className="tag-item px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const RecentOotdPost: React.FC = () => {
  const accessToken = Cookies.get('accessToken');
  const [page, setPage] = useState(0);
  const [orderType, setOrderType] = useState('LATEST');
  const [tab, setTab] = useState<'ALL' | 'FOLLOWING' | null>(null); 
  const [isPending, startTransition] = useTransition();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);  
  const router = useRouter();

  useEffect(() => {
    const savedTab = sessionStorage.getItem('tab');
    if (savedTab) {
      setTab(savedTab as 'ALL' | 'FOLLOWING');
    } else {
      setTab(accessToken ? 'FOLLOWING' : 'ALL');
    }
  }, [accessToken]);

  useEffect(() => {
    if (tab) {
      sessionStorage.setItem('tab', tab);
    }
  }, [tab]);

  useEffect(() => {
    if (accessToken) {
      fetchLikedPosts().then(setLikedPosts);  
    }
  }, [accessToken]);

  const isTabInitialized = tab !== null;

  const { data: memberData } = useQuery({
    queryKey: ['member', accessToken],
    queryFn: () => MemberInfo(accessToken),
    enabled: !!accessToken,
  });

  const { data: totalCount, isLoading: isCountLoading } = useQuery<number>(
    ['ootdPostCount', tab],
    () => (tab === 'ALL' ? fetchAllOotdPostCount() : fetchOotdFollowPostCount()),
    {
      enabled: isTabInitialized,
    }
  );

  const { data: allPostsData, isLoading: isAllPostsLoading } = useQuery<OotdGetResponse>(
    ['ootdPosts', page, orderType],
    () => fetchAllOotdPosts(page, PAGE_SIZE, orderType),
    {
      enabled: tab === 'ALL' && isTabInitialized,
    }
  );

  const { data: followingPostsData, isLoading: isFollowingPostsLoading } = useQuery<OotdGetResponse>(
    ['followingOotdPosts', page, orderType],
    () => fetchFollowOotdPosts(page, PAGE_SIZE, orderType),
    {
      enabled: tab === 'FOLLOWING' && isTabInitialized,
    }
  );

  const ootdList = tab === 'ALL' ? allPostsData?.result || [] : followingPostsData?.result || [];
  const isLoading = isCountLoading || (tab === 'ALL' ? isAllPostsLoading : isFollowingPostsLoading);

  const totalPages = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const handlePageClick = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const handleOotdItemClick = (id: number) => {
    router.push(`/ootd/${id}`);
  };

  const handleOrderTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderType(event.target.value);
    setPage(0);
  };

  const handleTabChange = (newTab: 'ALL' | 'FOLLOWING') => {
    startTransition(() => {
      setTab(newTab);
      setPage(0);
    });
  };

  if (!isTabInitialized) {
    return <div></div>;
  }

  return (
    <div className='w-[66%] mx-auto py-[5rem]'>
      <div>
        {accessToken ? (
          <h1 className='font-bold text-[2rem]'>
            {memberData?.result.nickName}님, 최근 업로드 된 OOTD를 만나보세요
          </h1>
        ) : (
          <h1 className='font-bold text-[2rem]'>트리피인들의 다양한 스타일을 만나보세요</h1>
        )}
      </div>
      <div className='flex text-[1.6rem] py-16'>
        <span
          className={`pr-[1rem] cursor-pointer ${tab === 'ALL' ? 'font-bold text-[#fa3463]' : ''}`}
          onClick={() => handleTabChange('ALL')}
        >
          전체글
        </span>
        <span
          className={`px-[1rem] cursor-pointer ${tab === 'FOLLOWING' ? 'font-bold text-[#fa3463]' : ''}`}
          onClick={() => handleTabChange('FOLLOWING')}
        >
          팔로잉
        </span>
        <select
          className='flex w-[8rem] h-[3rem] ml-auto font-medium selectshadow'
          value={orderType}
          onChange={handleOrderTypeChange}
        >
          <option value="LATEST">최신순</option>
          <option value="LIKE">인기순</option>
          <option value="VIEW">조회순</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {ootdList.map((item) => (
          <div key={item.post.id} className="flex flex-col overflow-hidden cursor-pointer" onClick={() => handleOotdItemClick(item.post.id)}>
            {item.post.images.length > 0 && (
              <div className="relative w-full" style={{ aspectRatio: '303 / 381' }}>
                <Image
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                  src={item.post.images[0].accessUri}
                  alt="OOTD"
                  layout="fill"
                />
              </div>
            )}
            <div className="py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative w-[24px] h-[24px]">
                    <Image
                      src={item.member.profileUrl}
                      alt="Profile"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full" />
                  </div>
                  <span className="text-[#6B6B6B] ml-[5px]">{item.member.nickName}</span>
                </div>
                <div className="flex items-center mt-2">
                <Image
                    src={likedPosts.includes(item.post.id) ? HeartIcon : EmptyHeartIcon} 
                    alt="좋아요"
                    width={20}
                    height={18}
                  />
                  <span className="mx-2 text-[#cfcfcf]"> {item.post.likeCount}</span>
                  <Image
                    src={CommentIcon1}
                    alt="댓글"
                    width={18}
                    height={18}
                  />
                  <span className="mx-2 text-[#cfcfcf]"> {item.post.commentCount}</span>
                </div>
              </div>
              <TagContainer item={item} />
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-center mt-4'>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`mx-2 py-16 px-3  ${
              page === index ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentOotdPost;
