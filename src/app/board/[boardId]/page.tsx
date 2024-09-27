"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import uploadImages from "@/dummy/uploadfile.svg";
import air from "@/dummy/air.svg";
import dummys from "@/dummy/dummys.svg";
import plused from "@/dummy/plus.svg";
import dummysed from "@/dummy/dummysed.svg";
import {
  useRouter,
  useSearchParams,
  useServerInsertedHTML,
} from "next/navigation";
import Header from "@/components/shared/header/Header";
import { useQuery } from "react-query";
import { getPost } from "@/services/board/get/getBoard";
import heartImg from "@/dummy/heart.svg";
import bottomimg from "@/dummy/sebu.svg";
import nonheartImg from "@/dummy/heartbin.svg";
import moment from "@/dummy/moment.svg";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import postComments from "@/services/board/post/postComment";
import getBoardComment from "@/services/board/get/getBoardComment";
import { useUserStore } from "@/store/useUserStore";
import postBoardLike from "@/services/board/post/postBoardLike";
import getBoardLike from "@/services/board/get/getBoardLike";
import deleteLike from "@/services/board/delete/deleteLike";
import upup from "@/dummy/upup.svg";
import commentPink from "@/dummy/comentpink.svg";
import { useFollowingStore } from "@/store/useFollowingStore";
import { doFollow, unfollow } from "@/services/follow";
import FollowButton from "@/components/followControl/followButton";
import { colorTicket } from "@/types/board";
import deleteBoard from "@/services/board/delete/deleteBoard";
import Swal from "sweetalert2";
import menubars from "@/dummy/menubars.svg"
import deleteReply from "@/services/board/delete/deleteReply";
import { PostAirSVG, PostBusSVG, PostBycicleSVG, PostCarSVG, PostTrainSVG } from "@/components/transportsvg/post";
import backbutton from "@/dummy/backbutton.svg"

export default function BoardPage({ params }: { params: { boardId: number } }) {
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [comment, setComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const { userInfo, loading, fetchUserInfo } = useUserStore();
  const [replyId, setReplyId] = useState(0);
  const [replymemId, setReplyMemId] = useState('');
  const [replyNickname, setReplyNickname] = useState('');
  const [isReplyOpen, setIsReplyOpen] = useState(true);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [parentIds, setParentIds] = useState(0);
  const [soloReply, setSoloReply] = useState(false);
  const [replyStates, setReplyStates] = useState<boolean[]>([]);

  const { data: postData, refetch: postRefetch } = useQuery({
    queryKey: ["postData"],
    queryFn: () => getPost(Number(params.boardId)),
  });

  const { data: postCommentData, refetch: commentRefetch } = useQuery({
    queryKey: ["postCommentData"],
    queryFn: () => getBoardComment(Number(params.boardId)),
  });

  const [replyOpen, setReplyOpen] = useState(
    Array(postCommentData?.result.length).fill(false)
  );
  const [rreplyOpen, setRreplyOpen] = useState(
    Array(postCommentData?.result.length).fill(false)
  );
  console.log(replyOpen, postCommentData)

  const { data: postLikeData, refetch: LikeRefetch } = useQuery({
    queryKey: ["postLikeData"],
    queryFn: () => getBoardLike(Number(params.boardId)),
  });

  const {
    data: memberDatas,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["member"],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      // 에러 처리 로직
      console.error(error);
    },
  });

  console.log(postData);

  console.log(postData?.result.member.memberId);
  console.log(memberDatas);
  const postMemberId = postData?.result.member.memberId;
  const userMemberId = memberDatas?.result.memberId;

  const { following, fetchFollowing } = useFollowingStore();

  useEffect(() => {
    if (postData) {
      fetchFollowing(userMemberId);
    }
  }, [postData]);
  console.log(following);

  const isFollowing =
    Array.isArray(following.followings) &&
    following.followings.some(
      (follow) => follow.memberId === postData?.result.member.memberId
    );

  console.log("Post Member ID:", postMemberId);
  console.log("Is Following:", following);
  console.log(isFollowing);

  const followHandler = async (memberId: string | undefined) => {
    if (!memberId) return; // memberId가 undefined인 경우 함수를 종료
    if (!isFollowing) {
      try {
        const response = await doFollow(memberId);
        console.log("Follow response:", response);
        if (accessToken) {
          fetchFollowing(postMemberId);
        }
      } catch (error) {
        console.error("Error following member:", error);
      }
    } else {
      try {
        await unfollow(memberId);
        if (accessToken) {
          fetchFollowing(postMemberId);
        }
      } catch (error) {
        console.error("Error unfollowing member:", error);
      }
    }
  };

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  }
  const createdAt = postData?.result.post.createDateTime;
  const formattedDate = formatDate(createdAt);

  const handleProfileClick = () => {
    console.log("click");
    if (postData.result.member.memberId == userInfo.memberId) {
      router.push("/mypage");
    } else {
      router.push(`/user/${postData.result.member.memberId}`);
    }
  };

  console.log(postData, userInfo)

  const LikeHandler = async () => {
    try {
      await postBoardLike(Number(params.boardId));
      LikeRefetch();
      postRefetch();
    } catch (e) { }
  };

  const LikeDeleteHandler = async () => {
    try {
      await deleteLike(Number(params.boardId));
      LikeRefetch();
      postRefetch();
    } catch (e) { }
  };

  const commentHandler = async () => {
    const commentData = {
      postId: Number(params.boardId),
      content: comment,
      status: "PUBLIC",
    };
    try {
      console.log(commentData);
      await postComments(commentData);
      setComment("");
      commentRefetch();
      postRefetch();
    } catch (e) { }
  };
  const commentReplyHandler = async (replymemIds: string, replyNicknames: string, mentionCommentIds: number) => {
    const commentData = {
      postId: Number(params.boardId),
      content: replyComment,
      status: "PUBLIC",
      parentId: parentIds,
      mentionMemberId: replymemIds,
      mentionMemberNickName: replyNicknames,
      mentionCommentId: mentionCommentIds
    };

    try {
      console.log(commentData);
      await postComments(commentData);
      setReplyComment("");
      setReplyOpen(Array(postCommentData?.result.length).fill(false));
      setReplyStates(Array(postCommentData?.result.length).fill(false));
      commentRefetch();
      postRefetch();
    } catch (e) { }
  };

  const toggleReply = (index: number) => {
    const updatedReplyOpen = [...replyOpen];
    updatedReplyOpen[index] = !updatedReplyOpen[index]; // 해당 인덱스의 상태 토글
    setReplyOpen(updatedReplyOpen);
  };

  const toggleRreply = (index: number) => {
    const updatedRreplyOpen = [...rreplyOpen];
    updatedRreplyOpen[index] = !updatedRreplyOpen[index]; // 해당 인덱스의 상태 토글
    setRreplyOpen(updatedRreplyOpen);
  };

  if (!postData) {
    return <div>Loading...</div>; // 데이터가 로딩 중일 때
  }

  const replaceImagesInBody = (body: any, images: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    imgTags.forEach((imgTag, index) => {
      if (images[index]) {
        const newImage = document.createElement('div'); // 새로운 div로 대체
        newImage.innerHTML = `<Image class="max-w-[60rem] max-h-[60rem]" src="${images[index].accessUri}" alt="" width="900" height="900" />`;
        imgTag.replaceWith(newImage);
      }
    });

    return doc.body.innerHTML; // 변환된 HTML 반환
  };

  const deleteBoardHandler = async () => {
    await deleteBoard(params.boardId)
    Swal.fire({
      icon: 'success',
      title: '정상적으로 삭제되었습니다.',
      confirmButtonText: '확인',
      confirmButtonColor: '#FB3463',
      customClass: {
        popup: 'swal-custom-popup',
        icon: 'swal-custom-icon'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/');
      }
    });
  }
  console.log(userInfo)
  const deleteReplyHandler = async (replyIdx: number) => {
    await deleteReply(replyIdx)
    Swal.fire({
      icon: 'success',
      title: '정상적으로 삭제되었습니다.',
      confirmButtonText: '확인',
      confirmButtonColor: '#FB3463',
      customClass: {
        popup: 'swal-custom-popup',
        icon: 'swal-custom-icon'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        commentRefetch();
      }
    });
  }

  const editBoardEdit = () => {
    router.push(`/edits/${params.boardId}`)
  }

  const loginEdit = () => {
    router.push(`/login`)
  }

  const images = postData?.result.post.images || [];
  const bodyWithImages = replaceImagesInBody(postData?.result.post.body, images);


  const handleReplyToggle = (index: number, id: number, nickName: string, memberId: string) => {
    // 해당 인덱스의 답글 입력란 상태를 토글
    setReplyStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index]; // 현재 상태를 반전
      return newStates;
    });
    setParentIds(id)
    setReplyNickname(nickName);
    setReplyMemId(memberId);
  };
  console.log(replyId);

  const getTransportImage = (transport: string, ticketColor: any) => {
    switch (transport) {
      case 'Airplane':
        return <PostAirSVG fillColor={colorTicket[ticketColor]} />;
      case 'Car':
        return <PostCarSVG fillColor={colorTicket[ticketColor]} />;
      case 'Bus':
        return <PostBusSVG fillColor={colorTicket[ticketColor]} />;
      case 'Bicycle':
        return <PostBycicleSVG fillColor={colorTicket[ticketColor]} />;
      case 'Train':
        return <PostTrainSVG fillColor={colorTicket[ticketColor]} />;
      default:
        return null; // 기본값 또는 대체 이미지
    }
  };

  // const router = useRouter();

  const handleBackButtonClick = () => {
    router.back(); // 이전 페이지로 이동
  };

  return (
    <div>
      <Header />
      <div className="w-[90%] sm-700:w-[50%] mx-auto">
        <div className="flex text-[#6B6B6B] font-semibold text-[2rem]">
          {window.innerWidth > 600 ? (
            <span className="mt-[8rem]">{postData?.result.member.blogName}의 블로그</span>
          ) : (
            <div className="flex w-full items-center justify-center">
              <button onClick={handleBackButtonClick}>
                <Image src={backbutton} alt="" />
              </button>
              <span className="text-[#171717] flex mx-auto">{postData?.result.member.blogName}의 블로그</span>
            </div>
          )
          }
          {memberDatas?.result.blogName === postData?.result.member.blogName && (
            <div className="flex ml-auto gap-[1rem]">
              <Image className="cursor-pointer" src={menubars} alt="" onClick={() => { setIsOpenMenu(!isOpenMenu) }} />
              {isOpenMenu && (
                <div className="absolute bg-white shadow-md rounded-md mt-[3rem] -ml-[10rem] px-[1.5rem] py-[2rem] animate-dropdown z-20 rounded-[0.8rem]" style={{ opacity: 0, transform: 'translateY(-10px)' }}> {/* 스타일 추가 */}
                  <span className="cursor-pointer bg-[#F5F5F5] text-[#292929] hover:bg-[#F5F5F5d] block p-[0.8rem] rounded-[0.8rem]" onClick={editBoardEdit}>수정하기</span>
                  <span className="cursor-pointer bg-[#292929] text-white hover:bg-[#292929cc] block mt-[0.8rem] p-[0.8rem] rounded-[0.8rem]" onClick={deleteBoardHandler}>삭제하기</span>
                </div>
              )}

            </div>
          )}
        </div>
        <div className="flex items-center mt-[2rem]">
          <h1 className="text-[2.4rem] xl:text-[3.6rem] sm-700:text-[2.4rem] font-bold">
            {postData?.result.post.title}
          </h1>
        </div>
        <div className="mt-[4rem] py-[2rem] ">
          <div className="flex mb-[3rem] items-center">
            <div className="flex w-full h-[9rem] border-b border-[#CFCFCF] items-center]">
              <Image
                src={postData?.result.member.profileUrl}
                className="w-[6rem] h-[6rem] rounded-[6rem]"
                alt=""
                width={60}
                height={60}
                onClick={handleProfileClick}
              />
              <div className="flex flex-col text-[2rem] ml-[2rem]">
                <span className="font-medium text-black">
                  {postData?.result.member.nickName}
                </span>
                <span className="text-[#9D9D9D] font-normal">
                  {formattedDate}
                </span>
              </div>
              <div className="ml-auto flex items-center">
                <FollowButton
                  postMemberId={postMemberId}
                  userMemberId={userMemberId}
                />
                <div className="ml-[4rem] flex">
                  <Image src={plused} alt="" />
                  <span className="text-[#9D9D9D] text-[1.6rem]">136</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mt-[5rem]">
            <div
              className={`w-[5rem] h-full ${colorTicket[postData.result.ticket.ticketColor] ? `bg-[${colorTicket[postData.result.ticket.ticketColor]}]` : ''} rounded-l-[1rem]`}
            ></div>
            <div className="w-full mt-[5rem] relative">
              <div className="flex justify-center">
                <div>
                  <h1 className="text-[6rem] font-extrabold font-akira">{postData?.result.ticket.departureCode}</h1>
                  <div className="w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex">
                    <span className="text-[#9D9D9D] text-[2.4rem] font-semibold">
                      {postData?.result.ticket.departure}
                    </span>
                  </div>
                </div>
                <div className="relative flex bg-white mt-[3rem] z-10 mx-[3%]">
                  {getTransportImage(postData?.result.ticket.transport, postData?.result.ticket.ticketColor)}
                </div>
                <div className="">
                  <h1 className="text-[6rem] font-extrabold font-akira">{postData?.result.ticket.destinationCode}</h1>
                  <div className="w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex">
                    <span className="text-[#9D9D9D] text-[2.4rem] font-semibold">
                      {postData?.result.ticket.destination}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-[95%] border-2 border-dashed border-[#CFCFCF] my-[4rem] mx-auto relative z-0" />
              <div
                className={`flex justify-center text-[1.4rem] font-extrabold text-[#55FBAF] font-akira`}
                style={{ color: colorTicket[postData?.result.ticket.ticketColor] || 'inherit' }}
              >
                <span className="w-[16rem]">PASSENGER</span>
                <span className="w-[25rem]">DATE</span>
                <span className="w-[8rem]">GROUP</span>
              </div>
              <div
                className={`flex justify-center text-[1.4rem] font-extrabold text-[#6B6B6B]`}
              >
                <span className="w-[16rem]">USERID</span>
                <span className="w-[25rem]">
                  {postData?.result.ticket.startDate} ~{" "}
                  {postData?.result.ticket.endDate}
                </span>
                <span className="w-[8rem]">
                  {postData?.result.ticket.memberNum}
                </span>
              </div>
            </div>
            <div
              className={`w-[28.5rem] h-full ${colorTicket[postData.result.ticket.ticketColor] ? `bg-[${colorTicket[postData.result.ticket.ticketColor]}]` : ''}  rounded-r-[1rem] ml-auto`}
            >
              <div className="absolute">
                <div className="relative bg-white w-[4rem] h-[4rem] rounded-full -mt-[2rem] -ml-[2rem]"></div>
                <div className="relative bg-white w-[4rem] h-[4rem] rounded-full mt-[28rem] -ml-[2rem]"></div>
              </div>
              <label className="w-full h-full flex" htmlFor="input-file">
                <div className="flex flex-col m-auto">
                  <Image
                    className="w-[18rem] h-[26rem] rounded-[1rem] object-cover"
                    src={postData?.result.ticket.image.accessUri}
                    alt=""
                    width={230}
                    height={260}
                  />
                </div>
              </label>
            </div>
          </div>

        </div>
        <div className="py-[5rem] min-h-[100rem] ">
          {/* {images.map((image, index) => (
                        <Image
                            className="max-w-[60rem] max-h-[60rem]"
                            src={image.accessUri}
                            alt=""
                            key={index}
                            width={900}
                            height={900}
                        />
                    ))} */}
          <span className="text-[1.6rem] font-medium" dangerouslySetInnerHTML={{ __html: bodyWithImages }} />
        </div>
        <div className="flex flex-wrap">
          {postData?.result.post.tags.map((tagData: string, index: number) => (
            <span
              key={index}
              className="w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] mr-[0.5rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem]"
            >
              {tagData}
            </span>
          ))}
        </div>
        {/* 댓글기능 */}
        <div className="w-full h-[7.5rem] mt-[8rem] flex items-center">
          {postLikeData?.result ? (
            <Image
              className="cursor-pointer"
              src={heartImg}
              alt=""
              width={24}
              height={24}
              onClick={LikeDeleteHandler}
            />
          ) : (
            <Image
              className="cursor-pointer"
              src={nonheartImg}
              alt=""
              width={24}
              height={24}
              onClick={LikeHandler}
            />
          )}
          <span className="text-[1.6rem] font-normal text-[#6B6B6B]">
            {postData?.result.post.likeCount}
          </span>
          <Image src={bottomimg} alt="" width={24} height={24} />
          {isReplyOpen ? (
            <Image
              className="ml-[2rem]"
              src={commentPink}
              alt=""
              width={24}
              height={24}
            />
          ) : (
            <Image
              className="ml-[2rem]"
              src={moment}
              alt=""
              width={24}
              height={24}
            />
          )}
          <span
            className={`text-[1.6rem] font-normal ${isReplyOpen ? "text-[#FB3463]" : "text-[#6B6B6B]"} `}
          >
            {postData?.result.post.commentCount}
          </span>
          {isReplyOpen ? (
            <Image
              className="cursor-pointer"
              src={upup}
              alt=""
              width={24}
              height={24}
              onClick={() => setIsReplyOpen(false)}
            />
          ) : (
            <Image
              className="cursor-pointer"
              src={bottomimg}
              alt=""
              width={24}
              height={24}
              onClick={() => setIsReplyOpen(true)}
            />
          )}
        </div>
        {accessToken ? (
          <div className="mb-[10rem]">
            {isReplyOpen && (
              <div>
                {userInfo && (
                  <div className="w-full h-[9.3rem] shadowall pl-[1.7rem] pt-[1.4rem] flex rounded-[0.8rem]">
                    <div className="w-full">
                      <div className="flex items-center">
                        <Image
                          className="w-[2.8rem] h-[2.8rem] flex items-center rounded-[4.5rem]"
                          src={memberDatas?.result.profileImageUrl}
                          alt=""
                          width={28}
                          height={28}
                        />
                        <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                          {memberDatas?.result.nickName}
                        </span>
                      </div>
                      <input
                        className="w-full outline-none ml-[4.5rem] text-[1.4rem] font-normal"
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="블로그가 훈훈해지는 댓글 부탁드립니다."
                      />
                    </div>
                    <button
                      className="hover:bg-[#292929] hover:text-white bg-[#F5F5F5] text-[#292929] rounded-[0.8rem] text-[1.6rem] font-semibold w-[8.6rem] h-[3.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                      onClick={commentHandler}
                    >
                      입력
                    </button>
                  </div>
                )}

                <div
                  className={`w-full h-full shadowall px-[4.7rem] py-[1.4rem] my-[3.5rem] flex flex-col rounded-[0.8rem]`}
                >
                  {postCommentData?.result &&
                    Object.entries(postCommentData.result).map(
                      ([key, coData]: [string, any], index: number) => {
                        const createDateTime = new Date(coData.createDateTime);
                        const formattedDateTime = `${createDateTime.getFullYear()}.${String(createDateTime.getMonth() + 1).padStart(2, '0')}.${String(createDateTime.getDate()).padStart(2, '0')} ${String(createDateTime.getHours()).padStart(2, '0')}:${String(createDateTime.getMinutes()).padStart(2, '0')}`;

                        return (
                          <div className="mb-[2.5rem]" key={key}>
                            <div className={`py-[2rem] mr-[2rem]`}>
                              <div className="flex items-center">
                                <Image
                                  className="w-[2.8rem] h-[2.8rem] flex items-center rounded-full"
                                  src={coData.member.profileUrl}
                                  alt=""
                                  width={28}
                                  height={28}
                                />
                                <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                  {coData.member.nickName}
                                </span>
                              </div>
                              <span className="text-[1.4rem] font-normal ml-[4.4rem] text-[#292929]">
                                {coData.content}
                              </span>
                              <div className="flex ml-[4.5rem] text-[1.2rem] text-[#9D9D9D] items-center">
                                <span>{formattedDateTime}</span>
                                <hr className="mx-[1rem] h-[1rem] w-[0.1rem] bg-[#9D9D9D]" />
                                <span
                                  className="cursor-pointer"
                                  onClick={() => handleReplyToggle(index, coData.id, coData.member.nickName, coData.member.memberId)}
                                >
                                  {replyStates[index] ? '답글취소' : '답글달기'}
                                </span>
                                {userInfo?.memberId === coData.member.memberId && (
                                  <span className="ml-[1rem] cursor-pointer" onClick={() => deleteReplyHandler(coData.id)}>삭제</span>
                                )}

                              </div>
                              {replyStates[index] && (
                                <div className="w-[95%] h-[9.3rem] shadowall mt-[2rem] ml-[4rem] pl-[1.7rem] pt-[1.4rem] flex border border-[#CFCFCF] rounded-[0.8rem] relative">
                                  <div className="w-full">
                                    <div className="flex items-center">
                                      <Image
                                        className="w-[2.8rem] h-[2.8rem] flex items-center rounded-full"
                                        src={memberDatas?.result.profileImageUrl}
                                        alt=""
                                        width={28}
                                        height={28}
                                      />
                                      <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                        {memberDatas?.result.nickName}
                                      </span>
                                    </div>
                                    <div className="relative">
                                      <span className="absolute text-[#FFBACA] text-[1.4rem] ml-[4.5rem]">
                                        @{coData.member.nickName}
                                      </span>
                                      <input
                                        className="w-[70%] outline-none ml-[10rem] text-[1.4rem] font-normal pl-[1.5rem]"
                                        type="text"
                                        placeholder="에게 답글쓰기"
                                        value={replyComment}
                                        onChange={(e) => setReplyComment(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <button
                                    className="hover:bg-[#292929] hover:text-white bg-[#F5F5F5] text-[#292929] rounded-[0.8rem] text-[1.6rem] font-semibold w-[8.6rem] h-[3.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                                    onClick={() => commentReplyHandler(replymemId, replyNickname, replyId)}
                                  >
                                    입력
                                  </button>
                                </div>
                              )}
                            </div>
                            {coData?.children.map((childData: any, childIndex: number) => {
                              const createDateTime = new Date(childData.createDateTime);
                              const formattedDateTimes = `${createDateTime.getFullYear()}.${String(createDateTime.getMonth() + 1).padStart(2, "0")}.${String(createDateTime.getDate()).padStart(2, "0")} ${String(createDateTime.getHours()).padStart(2, "0")}:${String(createDateTime.getMinutes()).padStart(2, "0")}`;
                              console.log(childData);
                              return (
                                <div className={`bg-[#F5F5F5] w-[95%] py-[2rem] px-[1.6rem] mx-[4rem] rounded-[0.8rem]`} key={childIndex}>
                                  <div className="flex items-center">
                                    <Image
                                      className="w-[2.8rem] h-[2.8rem] flex items-center rounded-full"
                                      src={childData.member.profileUrl}
                                      alt=""
                                      width={28}
                                      height={28}
                                    />
                                    <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                      {childData.member.nickName}
                                    </span>
                                  </div>
                                  <span className="text-[1.4rem] font-normal ml-[4.4rem] text-[#292929] mt-[1rem]">
                                    <span className="text-[#FFBACA] text-[1.4rem] mr-[1rem]">
                                      @{childData.mentionMemberNickName}
                                    </span>
                                    {childData.content}
                                  </span>
                                  <div className="flex ml-[4.5rem] text-[1.2rem] text-[#9D9D9D] items-center">
                                    <span>{formattedDateTimes}</span>
                                    <hr className="mx-[1rem] h-[1rem] w-[0.1rem] bg-[#9D9D9D]" />
                                    <div>
                                      {replyOpen[index] && rreplyOpen[childData.id] ? (
                                        <span
                                          className="cursor-pointer"
                                          onClick={() => {
                                            toggleReply(index);
                                            toggleRreply(childData.id);
                                          }}
                                        >
                                          답글취소
                                        </span>
                                      ) : (
                                        <span
                                          className="cursor-pointer"
                                          onClick={() => {
                                            toggleReply(index);
                                            toggleRreply(childData.id);
                                            setParentIds(childData.parentId)
                                            setReplyId(childData.id);
                                            setReplyNickname(childData.member.nickName);
                                            setReplyMemId(childData.member.memberId);
                                          }}
                                        >
                                          답글달기
                                        </span>
                                      )}
                                      {userInfo?.memberId === childData.member.memberId && (
                                        <span className="ml-[1rem] cursor-pointer" onClick={() => deleteReplyHandler(childData.id)}>삭제</span>
                                      )}
                                      {/* 답글이 열렸을 때 추가적인 요소를 보여줄 수 있습니다 */}
                                      {replyOpen[index] && (
                                        <div className="reply-input">
                                          {/* 답글 입력 폼이나 추가적인 내용을 여기에 추가할 수 있습니다 */}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {replyOpen[index] && userInfo && (
                              <div className="w-[95%] h-[9.3rem] shadowall mt-[2rem] ml-[4rem] pl-[1.7rem] pt-[1.4rem] flex border border-[#CFCFCF] rounded-[0.8rem] relative">
                                <div className="w-full">
                                  <div className="flex items-center">
                                    <Image
                                      className="flex items-center"
                                      src={memberDatas?.result.profileImageUrl}
                                      alt=""
                                      width={28}
                                      height={28}
                                    />
                                    <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                      {memberDatas?.result.nickName}
                                    </span>
                                  </div>
                                  <div className="relative">
                                    <span className="absolute text-[#FFBACA] text-[1.4rem]  ml-[4.5rem]">
                                      @{replyNickname}
                                    </span>
                                    <input
                                      className="w-[70%] outline-none ml-[10rem] text-[1.4rem] font-normal pl-[1.5rem]" // padding-left 추가
                                      type="text"
                                      value={replyComment}
                                      onChange={(e) => setReplyComment(e.target.value)}
                                      placeholder="에게 답글쓰기"
                                    />
                                  </div>
                                </div>
                                <button
                                  className="hover:bg-[#292929] hover:text-white bg-[#F5F5F5] text-[#292929] rounded-[0.8rem] text-[1.6rem] font-semibold w-[8.6rem] h-[3.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                                  onClick={() => commentReplyHandler(replymemId, replyNickname, replyId)}
                                >
                                  입력
                                </button>
                              </div>
                            )}


                          </div>
                        );
                      }
                    )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-[75rem] bg-[#F5F5F5]">
            <div className="flex flex-col pt-[25rem]">
              <span className="flex text-center mx-auto text-[3.2rem] font-medium">트리피 회원이면 댓글을 달 수 있어요</span>
              <button className="flex text-center mx-auto bg-[#FB3463] text-[2.4rem] py-[1.5rem] px-[3rem] rounded-[0.8rem] text-white mt-[3rem]" onClick={loginEdit}>로그인 하러가기</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
