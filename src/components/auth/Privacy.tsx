'use client'

import Image from "next/image";
import LogoMain from "../../../public/LogoMain.svg";

const Privacy = () => {
    return (
        <div className="w-[90%] mx-auto mt-[4rem] mb-8 sm-700:max-w-[500px]">
            <Image src={LogoMain} alt="Logo" className="mx-auto" width={130} height={40} />
            <div className="w-full mx-auto items-center mt-16 mb-4">
                <div><span className="text-neutral-900 dark:text-white text-[32px] font-semibold font-['Pretendard']">개인정보 처리 방침<br/></span><span className="text-neutral-900 dark:text-white text-[20px] font-semibold font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">1. 개인정보의 수집 및 이용 목적<br/></span><span className="text-neutral-900 dark:text-white text-lg font-semibold font-['Pretendard']"><br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">트리피(이하 "회사")는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br/><br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">회원 관리<br/>서비스 제공<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">2. 개인정보의 보유 및 이용기간<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-zinc-800 text-lg font-semibold font-['Pretendard']">소비자의 불만 또는 분쟁처리에 관한 기록<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">보존 이유: 전자상거래 등에서의 소비자보호에 관한 법룔 제6조 및 시행령 제6조<br/>보존 기간: 3년<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-zinc-800 text-lg font-semibold font-['Pretendard']">본인확인에 관한 기록<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">보존 이유: 정보통신망 이용촉진 및 정보보호에 관한 법률 제 44조의5 및 시행령 제 29조<br/>보존 기간: 6개월<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-zinc-800 text-lg font-semibold font-['Pretendard']">접속에 관한 기록<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">보존 이유: 통신비밀보호법 제15조의2 및 시행령 제41조- 보존 기간: 3개월<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">3. 수집하는 개인정보의 항목<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"><br/>회사는 회원가입, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">수집항목 : <br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">      사용자 입력<br/><br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">이메일 또는 소셜 미디어 서비스 ID: 사용자의 구분<br/>이름: 콘텐츠에서 작성자의 정보를 보여주기 위함<br/>프로필 사진: 콘텐츠에서 작성자의 정보를 보여주기 위함<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"><br/>자동 수집항목 : IP 정보, 이용 기록, 접속 로그, 쿠키, 접속 기록 등<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">개인정보 수집방법: 홈페이지(회원 가입)<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">4. 개인정보의 파기절차 및 방법<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">이용자는 로그인 후 </span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard'] underline">설정</span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"> 페이지에서 계정을 탈퇴할 수 있습니다.<br/>또는, 가입한 계정의 이메일을 사용하여 개인정보 관리 책임자(7조 참고)에게 이메일을 발송하여 탈퇴 요청을 할 수 있습니다.<br/></span><span className="text-neutral-500 text-lg font-semibold font-['Pretendard']"><br/></span><span className="text-zinc-800 text-lg font-semibold font-['Pretendard']">파기절차<br/></span><span className="text-neutral-500 text-[15px] font-semibold font-['Pretendard']">탈퇴처리가 진행되면 DB에 있는 계정정보와, 해당 계정으로 작성된 모든 게시글과 댓글이 삭제됩니다.<br/></span><span className="text-neutral-500 text-lg font-semibold font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">5. 개인정보 제공<br/><br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">이용자들이 사전에 동의한 경우<br/>법령의 규정에 의거하거나, 수사 목적으로 사회사의 요구가 있는 경우<br/></span><span className="text-neutral-500 text-lg font-medium font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">6. 개인정보의 안정성 확보조치에 관한 사항<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"><br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']">개인정보 암호화<br/>해킹 등에 대비한 대책<br/>취급 직원의 최소화 및 교육<br/></span><span className="text-neutral-500 text-xl font-medium font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">7. 개인정보 관리 책임자 및 담당자<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"><br/>성명: 최진영<br/>이메일: </span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard'] underline">syawlaekawa@gmail.com<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"><br/>기타 개인정보침해에 대한 신고나 상담이 필요한 경우에는 아래 회사에 문의하시기 바랍니다.<br/>개인정보침해신고센터 (</span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard'] underline">www.118.or.kr</span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"> / 118)<br/></span><span className="text-neutral-900 dark:text-white text-[32px] font-semibold font-['Pretendard']"><br/></span><span className="text-neutral-900 dark:text-white text-xl font-semibold font-['Pretendard']">8. 개인정보 취급방침 변경에 관한 사항<br/></span><span className="text-neutral-500 text-[15px] font-medium font-['Pretendard']"><br/>이 개인정보 취급방침은 2024년 4월 30일부터 적용됩니다. <br/>변경이전의 “정보보안 처리방침”을 과거이력 기록</span></div>
            </div>
        </div>
    );
};

export default Privacy;