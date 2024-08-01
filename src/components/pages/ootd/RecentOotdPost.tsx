'use client';

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { OotdGetResponse } from '@/types/ootd';
import { fetchAllOotdPostCount, fetchAllOotdPosts } from '@/services/ootd.ts/ootdGet';
import { MemberInfo } from '@/services/auth';
import EmptyHeartIcon from '../../../../public/empty_heart_default.svg';
import CommentIcon1 from '../../../../public/empty_comment_default.svg';

const PAGE_SIZE = 8;

const RecentOotdPost: React.FC = () => {
  const accessToken = Cookies.get('accessToken');
  const [page, setPage] = useState(0);
  const [orderType, setOrderType] = useState('LATEST'); 
  const router = useRouter();

  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['member', accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      console.error('Error fetching member data:', error);
    }
  });

  const { data: totalCount, isLoading: isCountLoading, isError: isCountError } = useQuery<number>(
    'ootdPostCount',
    fetchAllOotdPostCount
  );

  const { data, isLoading, isError } = useQuery<OotdGetResponse>(
    ['ootdPosts', page, orderType], 
    () => fetchAllOotdPosts(page, PAGE_SIZE, orderType), 
    { enabled: totalCount !== undefined }
  );

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

  if (isCountLoading || isLoading) {
    return null;
  }

  if (isCountError || isError || !data) {
    return <div>Error fetching data</div>;
  }

  const ootdList = data.result;

  return (
    <div className='w-[80%] mx-auto py-[5rem]'>
      <div>
        {accessToken ? (
          <h1 className='font-bold text-[2rem]'>
            {memberData?.result.nickName}님, 최근 업로드 된 OOTD를 만나보세요
          </h1>
        ) : (
          <h1 className='font-bold text-[2rem]'>트리피인들의 다양한 스타일을 만나보세요</h1>
        )}
      </div>
      <div className='flex text-[1.6rem] pt-[5rem] px-[1rem]'>
        <span className='pr-[1rem]'>전체글</span>
        <span className='px-[1rem]'>팔로잉</span>
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
            <div className="relative w-full h-0 pt-[100%] overflow-hidden">
              <Image 
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl" 
                src={item.post.images[0].accessUri} 
                alt="OOTD" 
                width={200} 
                height={200} 
              />
            </div>
          )}
            <div className="py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image className="rounded-full" src={item.member.profileUrl} width={24} height={24} alt="Profile" />
                  <span className="text-[#6B6B6B] ml-[5px]">{item.member.nickName}</span>
                </div>
                <div className="flex items-center mt-2">
                <Image
                  src={EmptyHeartIcon}
                  alt="좋아요"
                  width={20}
                  height={18}
                />
                <span className="mx-2 text-[#cfcfcf]"> {item.post.likeCount}</span>
                <Image
                  src={CommentIcon1}
                  alt="좋아요"
                  width={18}
                  height={18}
                />
                  <span className="mx-2 text-[#cfcfcf]"> {item.post.commentCount}</span>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-[1.2rem] font-medium text-[#6B6B6B]">{item.post.body}</h2>
                <div className="flex flex-wrap mt-4 gap-2">
                  {item.post.tags.map((tag, index) => (
                    <span key={index} className="px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className='flex justify-center mt-4'>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`mx-2 py-16 px-3  ${
                page === index ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'
              }`}
              onClick={() => handlePageClick(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOotdPost;
