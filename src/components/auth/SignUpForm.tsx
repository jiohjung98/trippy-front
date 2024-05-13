'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { checkEmailDuplicate } from "@/services/auth";
import LogoMain from "../../../public/LogoMain.svg";
import { useRouter } from "next/navigation";
import { signUp, emailSend } from "@/services/auth";
import Link from "next/link";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [verificationClicked, setVerificationClicked] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(180);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const router = useRouter();

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(isValid);
    setEmailErrorMessage(isValid ? "" : "이메일 형식이 올바르지 않습니다.");

    if (isValid) {
      try {
        const { isSuccess, duplicated } = await checkEmailDuplicate(value);
        if (isSuccess) {
          if (duplicated) {
            setDuplicateMessage("해당 이메일이 이미 존재합니다.");
          } else {
            setDuplicateMessage("사용 가능한 이메일입니다.");
          }
        } else {
          console.error("이메일 중복 확인 오류:", isSuccess);
          setDuplicateMessage("이메일 중복 확인에 실패했습니다.");
        }
      } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        setDuplicateMessage("이메일 중복 확인에 실패했습니다.");
      }
    } else {
      setDuplicateMessage("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const isValid =
      /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/.test(value);
    setPasswordValid(isValid);
    setPasswordErrorMessage(isValid ? "" : "비밀번호 형식이 맞지 않습니다.");
    setPasswordMatch(false);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUp({ memberId: email, email, password });
      router.push("/blogRegister");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleAgreementChange = () => {
    setAgreementChecked(!agreementChecked);
  };

  const handleTimerExpired = () => {
    setVerificationCode("");
    setTimer(180);
    setVerificationClicked(false);
  };

  const handleEmailVerification = async () => {
    if (duplicateMessage === "사용 가능한 이메일입니다.") {
      setVerificationClicked(true);
      setTimer(180);
      try {
        const response = await emailSend(email);
        if (response.isSuccess) {
          console.log('success');
        } else {
          console.error("Failed to send email.");
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  };

  const handleResendVerification = async () => {
    if (duplicateMessage === "사용 가능한 이메일입니다.") {
      setVerificationClicked(true);
      setTimer(180);
      try {
        const response = await emailSend(email);
        if (response.isSuccess) {
          console.log('Resend success');
        } else {
          console.error("Failed to resend email.");
        }
      } catch (error) {
        console.error("Error resending email:", error);
      }
    }
  };


  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      handleTimerExpired();
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer]);

  return (
    <form onSubmit={handleSubmit} className="w-[80%] mx-auto mt-[15rem]">
      <Image src={LogoMain} alt="Logo" className="mx-auto" />
      <div className="sign-up-info mt-[8rem]">로그인 정보를 설정해주세요</div>
      <label htmlFor="email" className="sign-up-info block mt-[6.9rem]">
        이메일
      </label>
      <div
        className={`flex w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border ${isInputFocused ? "border-[#FB3463]" : "border-gray-300"
          } focus:border-[#FB3463] focus:outline-none`}
        style={{ background: "var(--4, #F5F5F5)" }}
      >
        <input
          type="email"
          id="email"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleEmailChange}
          placeholder="Trippy@trip.com"
          className="flex-1 border-gray-300 focus:border-[#FB3463] focus:outline-none"
          style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
        />
        <button
          type="button"
          onClick={verificationClicked ? handleResendVerification : handleEmailVerification}
          disabled={
            !emailValid || duplicateMessage !== "사용 가능한 이메일입니다."
          }
          className={`${duplicateMessage === "사용 가능한 이메일입니다."
            ? "bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
            : "bg-gray-400 text-white cursor-not-allowed"
            } w-[8.6rem] h-[3.5rem] my-auto rounded-lg`}
          style={{ fontSize: "1.6rem" }}
        >
          {verificationClicked ? "재전송" : "인증하기"}
        </button>

      </div>
      <div className="h-[1.7rem]">
        {emailErrorMessage && (
          <p className="text-red-500">{emailErrorMessage}</p>
        )}
        {duplicateMessage && (
          <p className={`text-${duplicateMessage.includes("존재합니다") ? "red" : "green"}-500`}>
            {duplicateMessage}
          </p>
        )}
      </div>
      {verificationClicked && (
        <div>
          <label htmlFor="verificationCode" className="sign-up-info block mt-[6rem]">
            인증 코드
          </label>
          <div
            className={`flex w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border ${isInputFocused ? "border-[#FB3463]" : "border-gray-300"
              } focus:border-[#FB3463] focus:outline-none`}
            style={{ background: "var(--4, #F5F5F5)" }}
          >
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증 코드를 입력하세요"
              className="flex-1 border-gray-300 focus:border-[#FB3463] focus:outline-none"
              style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
            />
            <div className="text-[1.5rem] my-auto mr-[1rem]">
              {timer > 0 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}` : "인증 코드가 만료되었습니다."}
            </div>
          </div>
        </div>
      )}
      <div className="mt-[6rem]">
        <label htmlFor="password" className="sign-up-info block">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="영어, 숫자, 특수 기호를 포함한 8~14자리"
          className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
          style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
        />
        <div className="h-[1.7rem]">
          {passwordErrorMessage && (
            <p className="text-red-500">{passwordErrorMessage}</p>
          )}
          {passwordValid && (
            <p className="text-green-500">사용 가능한 비밀번호입니다.</p>
          )}
        </div>
      </div>
      <div className="mt-[6rem]">
        <label htmlFor="confirmPassword" className="sign-up-info block">
          비밀번호 확인
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="영어, 숫자, 특수 기호를 포함한 8~14자리"
          className="w-full px-4 py-2  mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
          style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
        />
        <div className="h-[1.7rem]">
          {confirmPassword && !passwordMatch && (
            <p className={`text-red-500`}>비밀번호가 일치하지 않습니다.</p>
          )}
          {passwordMatch && confirmPassword && (
            <p className={`text-green-500`}>비밀번호가 일치합니다.</p>
          )}
        </div>
      </div>
      <div
        className="mt-[5.8rem] flex items-center"
        style={{ fontSize: "1.5rem" }}
      >
        <input
          type="checkbox"
          id="agreement"
          checked={agreementChecked}
          onChange={handleAgreementChange}
          className="mr-2"
        />
        <label htmlFor="agreement" className="text-black">
          <span>
            <Link href="/serviceInfo">
              <span
                style={{
                  color: "gray",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                서비스 이용약관
              </span>
            </Link>
          </span>
          과{" "}
          <Link href="/privacy">
            <span

              style={{
                color: "gray",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              개인정보 처리 방침
            </span>
          </Link>
          에 동의합니다.
        </label>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className={`mx-auto mt-32 mb-32 w-[22rem] h-[6rem] bg-btn-color text-white py-2 rounded-lg focus:outline-none ${!verificationClicked ||
            !passwordValid ||
            !passwordMatch ||
            !agreementChecked
            ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
            : ""
            }`}
          style={{ fontSize: "2rem" }}
          disabled={
            !verificationClicked ||
            !passwordValid ||
            !passwordMatch ||
            !agreementChecked
          }
        >
          다음
        </button>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>이메일을 보냈습니다. 확인해주세요.</p>
            <button onClick={() => setModalOpen(false)}>확인</button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;