"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoHeader from "../../../../public/LogoHeader.svg";
import AlertImg from "../../../../public/AlertImg.png";
import Profile from "../../../../public/Profile.png";
import UserModal from "@/components/userInfo/userModal";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import postwriteImg from "@/dummy/postwrite.svg";
import Cookies from "js-cookie";
import SearchBar from "@/components/search/searchBar";

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { userInfo, loading, fetchUserInfo } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const onClickLogin = () => {
    router.push("/login");
  };

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 lg:px-12 py-4">
      <div className="flex items-center">
        <div className="mr-4">
          <Link href="/">
            <Image src={LogoHeader} alt="Logo" />
          </Link>
        </div>
        <div className="flex space-x-4 text-lg">
          <Link href="/">
            <div
              className="text-gray-800 px-4 md:px-6"
              style={{ fontSize: "1.4rem" }}
            >
              홈
            </div>
          </Link>
          <Link href="/ootd">
            <div className="text-gray-800" style={{ fontSize: "1.4rem" }}>
              OOTD
            </div>
          </Link>
        </div>
      </div>

      <div className="flex items-center flex-grow justify-end space-x-4">
        <div className="flex-grow max-w-[627px]">
          <SearchBar />
        </div>
        {!loading && userInfo ? (
          <div className="flex items-center space-x-4">
            <button
              className="w-[8.6rem] h-[3.5rem] bg-btn-color text-white px-6 py-2 rounded-lg"
              style={{ fontSize: "1.6rem" }}
              onClick={handleDropdownToggle}
            >
              글쓰기
            </button>
            {isDropdownOpen && (
              <div
                className="absolute w-[36rem] -ml-[13rem] top-[3.6rem] rounded-[0.8rem] shadow-lg rounded-lg animate-dropdown"
                style={{ opacity: 0, transform: "translateY(-10px)" }}
              >
                <Link href="/post">
                  <div className="px-[1.3rem] pt-[1.2rem] rounded-lg border-b border-white">
                    <div className="hover:bg-gray-200 px-[1.3rem] py-[1.2rem]">
                      <div className="flex items-start">
                        <Image
                          className="mr-[1.7rem] mt-[0.5rem]"
                          src={postwriteImg}
                          width={24}
                          height={24}
                          alt=""
                        />
                        <div>
                          <h1 className="text-[2rem] font-medium text-black">
                            블로그 티켓 글쓰기
                          </h1>
                          <span className="text-[1.3rem] font-medium text-[#9D9D9D]">
                            여행에서 겪었던 이야기를 기록해 보세요.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/write">
                  <div className="px-[1.3rem] pb-[1.2rem] rounded-lg border-b border-white">
                    <div className="hover:bg-gray-200 px-[1.3rem] py-[1.2rem]">
                      <div className="flex items-start">
                        <Image
                          className="mr-[1.7rem] mt-[0.5rem]"
                          src={postwriteImg}
                          width={24}
                          height={24}
                          alt=""
                        />
                        <div>
                          <h1 className="text-[2rem] font-medium text-black">
                            OOTD 글쓰기
                          </h1>
                          <span className="text-[1.3rem] font-medium text-[#9D9D9D]">
                            여행 중 나의 특별한 OOTD를 공유해보세요.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            <div className="mr-4">
              <Image src={AlertImg} alt="alert" width={24} height={24} />
            </div>
            <div className="w-[32px] h-[32px] relative">
              <div onClick={handleModalToggle} className="cursor-pointer">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    className="my-auto"
                    src={userInfo.profileImageUrl || Profile}
                    alt="profile"
                    width={32}
                    height={32}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <UserModal
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                userInfo={userInfo}
                style={{
                  position: "absolute",
                  bottom: "-260px",
                  left: "-290px",
                }}
                handleLogout={async () => {
                  Cookies.remove("accessToken");
                  Cookies.remove("refreshToken");
                  await router.push("/login");
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <Link href="/login">
              <button
                className="w-[8.6rem] h-[3.5rem] bg-btn-color text-white px-6 py-2 rounded-lg"
                style={{ fontSize: "1.6rem" }}
              >
                로그인
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
