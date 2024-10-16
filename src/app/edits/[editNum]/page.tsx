"use client"
import Header from '@/components/shared/header/Header'
import React, { ChangeEvent, useEffect, useState } from 'react'
import air from '@/dummy/air.svg'
import train from '@/dummy/train.svg'
import bus from '@/dummy/bus.svg'
import bicycle from '@/dummy/bicycle.svg'
import car from '@/dummy/car.svg'
import air1 from '@/dummy/air1.svg'
import train1 from '@/dummy/train1.svg'
import bus1 from '@/dummy/bus1.svg'
import bicycle1 from '@/dummy/bicycle1.svg'
import car1 from '@/dummy/car1.svg'
import Image from 'next/image'
import searchicon from '@/dummy/search.svg'
import uploadImages from "@/dummy/uploadfile.svg"
import date from "@/dummy/date.svg"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import postBoard from '@/services/board/post/postBoard'
import { uploadImage } from '@/services/blog'
import { UploadedImage } from '@/types/ootd'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { colorTicket } from '@/types/board'
import MyTinyMCEEditor from '@/components/testEditor/textEditor2'
import { useQuery } from 'react-query'
import { getPost } from '@/services/board/get/getBoard'
import { getCountry, getCountry1 } from '@/services/board/get/getCountry'
import editPost from '@/services/board/patch/editPost'
import editTicket from '@/services/board/patch/editTicket'
import { PostAirSVG, PostBusSVG, PostBycicleSVG, PostCarSVG, PostTrainSVG } from '@/components/transportsvg/post'
import DateInput2 from '@/components/board/DateInput2'
import TextEditorEdits from '@/components/testEditor/textEditorEdits'

interface CountryResult {
    countryIsoAlp2: string;
    // 다른 필요한 필드 추가
}

interface ApiResponse {
    result: CountryResult;
}

interface CountryResult {
    // 기존 프로퍼티들...
    isoAlp3?: string; // isoAlp3 프로퍼티 추가 (선택적)
}


function PostEdit({ params }: { params: { editNum: number } }) {
    const { data: postData, refetch: postRefetch } = useQuery({
        queryKey: ["postData"],
        queryFn: () => getPost(Number(params.editNum)),
    });

    const [bgColor, setBgColor] = useState(colorTicket[postData?.result.ticket.ticketColor]);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isTransport, setIsTransport] = useState(false);
    const [passengerCount, setPassengerCount] = useState(postData?.result.ticket.memberNum);
    const [startDate, setStartDate] = useState<Date | null>(postData?.result.ticket.startDate);
    const [endDate, setEndDate] = useState<Date | null>(postData?.result.ticket.endDate);
    const [startDates, setStartDates] = useState<Date | null>(null);
    const [endDates, setEndDates] = useState<Date | null>(null);
    const [dateOpen, setDateOpen] = useState(false);
    const [title, setTitle] = useState(postData?.result.post.title);
    const [body, setBody] = useState('');
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isImages, setIsImages] = useState<UploadedImage[]>([]);
    const router = useRouter();
    const [inputValue1, setInputValue1] = useState(postData?.result.ticket.destination);
    const [inputValue2, setInputValue2] = useState(postData?.result.ticket.departure);
    const [tags, setTags] = useState<string[]>(postData?.result.post.tags);
    const [inputValue, setInputValue] = useState<string>('');
    const [ticketColor, setTicketColor] = useState(colorTicket[postData?.result.ticket.ticketColor]);
    const [postRequests, setPostRequests] = useState({
        body: postData?.result.post.body || '',
        images: postData?.result.post.images as string[], // 이미지 URL을 저장할 배열
    });
    const [transportStr, setTransportStr] = useState(postData?.result.ticket.transport);
    const [date, setDate] = useState<string>('');

    // postData가 변경될 때마다 ticketColor와 postRequests를 업데이트하는 useEffect 추가
    useEffect(() => {
        setTimeout(() => {
            if (postData) {
                setTicketColor(colorTicket[postData.result.ticket.ticketColor]);

                setTransportStr(postData?.result.ticket.transport);

                // transportStr에 따라 이미지 설정
                const transportValue = postData.result.ticket.transport;

                const updatedImages = [
                    { imgsrc: <PostAirSVG fillColor={colorTicket[postData.result.ticket.ticketColor]} /> },
                    { imgsrc: <PostTrainSVG fillColor={colorTicket[postData.result.ticket.ticketColor]} /> },
                    { imgsrc: <PostBusSVG fillColor={colorTicket[postData.result.ticket.ticketColor]} /> },
                    { imgsrc: <PostBycicleSVG fillColor={colorTicket[postData.result.ticket.ticketColor]} /> },
                    { imgsrc: <PostCarSVG fillColor={colorTicket[postData.result.ticket.ticketColor]} /> },
                ];

                const selectedImage = updatedImages.find(image => {
                    const transportName = image.imgsrc.type.name; // SVG 컴포넌트의 이름
                    return (transportName === 'PostAirSVG' && transportValue === 'Airplane') ||
                        (transportName === 'PostTrainSVG' && transportValue === 'Train') ||
                        (transportName === 'PostBusSVG' && transportValue === 'Bus') ||
                        (transportName === 'PostBicycleSVG' && transportValue === 'Bicycle') ||
                        (transportName === 'PostCarSVG' && transportValue === 'Car');
                });

                if (selectedImage) {
                    setIsImageIdx([selectedImage]); // 선택된 이미지로 업데이트
                } else {
                    // console.warn('No matching transport image found'); // 디버깅: 일치하는 이미지가 없을 경우 경고
                }
            }
        }, 1000);
    }, [postData]);

    const [result, setResult] = useState<ApiResponse | null>(null);
    const [result1, setResult1] = useState<ApiResponse | null>(null);
    const [transport, setTransport] = useState(postData?.result.ticket.transport);
    const [isImageIdx, setIsImageIdx] = useState<any[]>([]);


    useEffect(() => {
        setIsImageIdx([
            { imgsrc: <PostAirSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostTrainSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostBusSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostBycicleSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostCarSVG fillColor={colorTicket[ticketColor]} /> },
        ]);
    }, [ticketColor]);

    // const formatDate = (date: Date | null) => {
    //     if (!date) return '';
    //     return date.toLocaleDateString('ko-KR', {
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //     });
    // };

    // function formatDates(date: any) {
    //     const year = date?.getFullYear();
    //     const month = String(date?.getMonth() + 1).padStart(2, '0');
    //     const day = String(date?.getDate()).padStart(2, '0');

    //     return `${year}-${month}-${day}`;
    // }

    // const formatDateRange = () => {
    //     if (!startDates || !endDates) return '';
    //     return `${formatDates(startDates)} ~ ${formatDates(endDates)}`;
    // };



    const handleIncrease = () => {
        setPassengerCount(passengerCount + 1);
    };

    const handleDecrease = () => {
        if (passengerCount > 1) {
            setPassengerCount(passengerCount - 1);
        }
    };


    const handleButtonClick = (color: string, index: number) => {
        setBgColor(color);
        const selectedColor = Object.keys(colorTicket)[index]; // 인덱스를 사용하여 색상 가져오기
        setTicketColor(selectedColor);
    };

    // console.log(ticketColor, bgColor)

    const handleDateChange = (date: string) => {
        setDate(date);
    };
    const selectTransport = (imgSrc: JSX.Element) => {
        setIsImageIdx((prevState) => {
            // 클릭한 항목의 인덱스를 찾기
            const selectedIndex = prevState.findIndex((item) => item.imgsrc.type === imgSrc.type && item.imgsrc.props.fillColor === imgSrc.props.fillColor);

            // 새로운 배열 생성
            const updatedState: any = [...prevState];

            // 클릭한 항목을 맨 앞으로 옮기기
            if (selectedIndex !== -1) {
                const selectedItem = updatedState.splice(selectedIndex, 1)[0];
                updatedState.unshift(selectedItem);

                // 첫 번째 항목의 src에 따라 setTransportStr 설정
                if (updatedState.length > 0) {
                    const transportValue = updatedState[0].imgsrc.type.name; // SVG 컴포넌트의 이름 사용

                    if (transportValue === 'PostBicycleSVG') {
                        setTransportStr('Bicycle');
                    } else if (transportValue === 'PostAirSVG') {
                        setTransportStr('Airplane');
                    } else if (transportValue === 'PostTrainSVG') {
                        setTransportStr('Train');
                    } else if (transportValue === 'PostBusSVG') {
                        setTransportStr('Bus');
                    } else if (transportValue === 'PostCarSVG') {
                        setTransportStr('Car');
                    }
                } else {
                    // console.warn('No valid src found in updatedState[0]'); // 디버깅: src가 없을 경우 경고
                }
            }
            setIsTransport(false); // transport 상태를 false로 설정

            return updatedState;
        });
    };


    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setThumbnailPreview(URL.createObjectURL(file));
        }
        if (!file) return;

        try {
            const uploadedImage = await uploadImage(file);
            // console.log(uploadedImage.result);
            setImages([...images, uploadedImage.result]);
            // console.log(images);
            setIsImages([...images, uploadedImage.result]);
        } catch (error) {
            // console.error('Error uploading image:', error);
        }
    };

    // console.log(postData)

    const displayImages = images.map(image => image.accessUri);

    // console.log(postData?.result.post.id)
    const addPost = async () => {

        if (inputValue1 === '' || inputValue2 === '') {
            Swal.fire({
                icon: 'error',
                title: '입력 오류',
                text: '출발지 또는 도착지를 작성해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
            });
            return;
        }

        if (!postData?.result?.ticket?.image) {
            Swal.fire({
                icon: 'error',
                title: '이미지 오류',
                text: '티켓 이미지를 업로드해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
            });
            // console.log(postRequests)
            return;
        }

        if (postRequests.body.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: '문구 작성 오류',
                text: 'POST 문구를 작성해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
            });
            return;
        }

        if (tags.length < 3) {
            Swal.fire({
                icon: 'error',
                title: '태그 오류',
                text: '태그를 3개 이상 등록해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
            });
            return;
        }

        if (!startDate || !endDate) {
            Swal.fire({
                icon: 'error',
                title: '날짜 오류',
                text: '날짜 정보를 입력해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
            });
            return;
        }

        if (Number(passengerCount) < 1) {
            Swal.fire({
                icon: 'error',
                title: '인원 오류',
                text: '인원 수를 입력해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
            });
            return;
        }

        const postRequest = {
            id: postData?.result.post.id,
            title: title,
            body: postRequests.body,
            postType: 'POST',
            location: '24.12342,12.12344',
            images: postRequests.images || postData?.result.post.images,
            tags: tags,
        }
        const ticketRequest = {
            id: postData?.result?.ticket?.id,
            departure: inputValue1,
            departureCode: postData?.result?.ticket?.departureCode || (result?.result?.isoAlp3 || ''),
            destination: inputValue2,
            destinationCode: postData?.result?.ticket?.destinationCode || (result1?.result?.isoAlp3 || ''),
            image: images[0] || postData?.result?.ticket?.image,
            memberNum: Number(passengerCount),
            startDate: startDates || startDate,
            endDate: endDates || endDate,
            ticketColor: ticketColor,
            transport: transportStr
        };

        try {
            // 로딩 시작
            Swal.fire({
                title: '로딩 중...',
                html: '게시글을 올리는 중입니다.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // console.log(postRequest, ticketRequest)
            await editPost(postRequest);
            await editTicket(ticketRequest)

            // 로딩 완료 후 성공 메시지
            Swal.fire({
                icon: 'success',
                title: 'TICKET 게시글 수정되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
                customClass: {
                    popup: 'swal-custom-popup',
                    icon: 'swal-custom-icon'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push(`/`);
                }
            });
        } catch (e: any) {
            // 에러 처리 (예: 에러 메시지 표시)
            Swal.fire({
                icon: 'error',
                title: '게시글 업로드에 실패했습니다.',
                text: e.message || '알 수 없는 오류가 발생했습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
            });
        }
    }

    // console.log(postData)

    // URL 객체 해제
    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);
    // console.log(formatDates(startDate), formatDates(endDate))


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            // 중복 태그 체크
            if (!tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()]);
                setInputValue(''); // 입력 필드 초기화
            }
        }
    };

    const handleTagRemove = (index: number) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index)); // 해당 인덱스의 태그를 삭제
    };

    const { getLocationData } = getCountry({ setResult });
    const { getLocationData1 } = getCountry1({ setResult1 });

    const searchCountry = async (locations: string) => {
        await getLocationData(locations);
    }

    const searchCountry1 = async (locationss: string) => {
        await getLocationData1(locationss);
    }


    // console.log(result)
    return (
        <div>
            {/* <Header /> */}
            <div className='w-[90%] sm-700:w-[50%] mx-auto'>
                <div className='flex items-center mt-[5rem]'>
                    <button
                        onClick={() => handleButtonClick('#55FBAF', 0)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FF4F4F', 1)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FF4F4F] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#4FDBFF', 2)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#4FDBFF] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FFD350', 3)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FFD350] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#A84FFF', 4)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#A84FFF] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FB3463', 5)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FB3463] rounded-full ml-[1rem]'
                    ></button>
                    <button className='ml-auto flex bg-[#FB3463] text-white text-[1.6rem] font-semibold rounded-[1rem] px-[2.5rem] py-[0.5rem]' onClick={addPost}>올리기</button>
                </div>
                {typeof window !== 'undefined' && window.innerWidth > 600 ? (
                    <div className='w-full h-[11rem] 2xl-1600:h-[32rem] 2xl:h-[24rem] xl-1300:h-[11rem] shadowall rounded-[1rem] flex mx-auto mt-[2rem]'>
                        <div className={`w-full max-w-[4.7rem] min-w-[1.7rem] h-full shadowall bg-[${bgColor}] rounded-l-[1rem]`}
                            style={{ color: colorTicket[postData?.result.ticket.ticketColor] || 'inherit' }}></div>
                        <div className='w-full mt-0 2xl-1600:mt-[5rem] 2xl:mt-0 2xl: relative'>
                            <div className='flex justify-center'>
                                <div className=''>
                                    <h1 className='h-[4rem] 2xl:h-[9rem] xl-1300:h-[3rem] text-[2rem] 2xl-1600:text-[6rem] 2xl:text-[3rem] xl-1300:text-[2rem] flex justify-center items-center font-extrabold font-akira'>{result1?.result?.isoAlp3 || postData?.result?.ticket?.departureCode}</h1>
                                    <div className='w-[10rem] 2xl-1600:w-[18rem] 2xl:w-[10rem] h-[1.6rem] 2xl:h-[3.6rem] xl-1400:h-[1.6rem] px-[1rem] shadowall rounded-[0.8rem] flex mt-0'>
                                        <input
                                            className='w-[4rem] 2xl-1600:w-[12rem] 2xl:w-[4rem] text-[1rem] 2xl-1600:text-[1.6rem] xl-1400:text-[1rem] outline-none'
                                            type='text'
                                            placeholder='검색 1'
                                            value={inputValue2} // 두 번째 입력 값 상태
                                            onChange={(e) => setInputValue2(e.target.value)} // 입력 값 변경 시 핸들러
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    searchCountry1(inputValue2); // 엔터 키가 눌리면 함수 호출
                                                }
                                            }}
                                        />
                                        <button className='ml-auto w-[1.5rem] h-[1.6rem] 2xl:w-[3rem] 2xl:h-[3.1rem] xl-1400:w-[1.5rem] xl-1400:h-[1.6rem]' onClick={() => searchCountry1(inputValue2)} >
                                            <Image src={searchicon} alt='' />
                                        </button>
                                    </div>
                                </div>
                                <div className='relative bg-white z-10 ml-full ml-[6%] mr-[16%]'>
                                    {
                                        isTransport ? (
                                            <div className='w-[4rem] 2xl:w-[6rem] xl-1400:w-[4rem] h-[13rem] 2xl:h-[32rem] xl-1400:h-[13rem] absolute z-10 bg-white shadowall rounded-[3rem] flex items-center justify-center mt-[1.5rem] flex-col'>
                                                {isImageIdx.slice(0, 5).map((item: any, index) => (
                                                    <div key={index} onClick={() => selectTransport(item.imgsrc)} className='w-[4rem] h-[4rem] 2xl:w-[6rem] xl-1400:w-[3rem] 2xl:h-[6rem] xl-1400:h-[4rem] px-[1rem] mt-[0.7rem]'>
                                                        {item.imgsrc}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div
                                                className='w-[4rem] h-[4rem] 2xl:w-[6rem] xl-1400:w-[4rem] 2xl:h-[6rem] xl-1400:h-[4rem] absolute shadowall rounded-full flex items-center justify-center mt-[1.5rem] p-[1rem]'
                                                onClick={() => setIsTransport(true)}
                                            >
                                                {isImageIdx[0]?.imgsrc}
                                            </div>
                                        )
                                    }
                                </div>
                                <div>
                                    <h1 className='h-[4rem] 2xl:h-[9rem] xl-1300:h-[4rem] text-[2rem] 2xl-1600:text-[6rem] 2xl:text-[3rem] xl-1300:text-[2rem] flex justify-center items-center font-extrabold font-akira'>{result?.result?.isoAlp3 || postData?.result?.ticket?.departureCode}</h1>
                                    <div className='w-[10rem] 2xl-1600:w-[18rem] 2xl:w-[10rem] h-[1.6rem] 2xl:h-[3.6rem] xl-1400:h-[1.6rem] px-[1rem] shadowall rounded-[0.8rem] flex mt-0'>
                                        <input
                                            className='w-[4rem] 2xl-1600:w-[12rem] 2xl:w-[4rem] text-[1rem] 2xl-1600:text-[1.6rem] xl-1400:text-[1rem] outline-none'
                                            type='text'
                                            placeholder='검색 2'
                                            value={inputValue1} // 첫 번째 입력 값 상태
                                            onChange={(e) => setInputValue1(e.target.value)} // 입력 값 변경 시 핸들러
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    searchCountry(inputValue1); // 엔터 키가 눌리면 함수 호출
                                                }
                                            }}
                                        />
                                        <button className='ml-auto w-[1.5rem] h-[1.6rem] 2xl:w-[3rem] 2xl:h-[3.1rem] xl-1400:w-[1.5rem] xl-1400:h-[1.6rem]' onClick={() => searchCountry(inputValue1)} >
                                            <Image src={searchicon} alt='' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='w-[95%] border border-dashed border-[#CFCFCF] my-[1rem] 2xl-1600:my-[3rem] 2xl:my-[1.5rem] xl-1400:my-[1rem] mx-auto relative z-0' />
                            <div className={`flex ml-[2rem] 2xl:ml-[7rem] lg:ml-[2rem] text-[0.8rem] 2xl:text-[1.4rem] xl-1400:text-[0.8rem] font-extrabold font-akira`}
                                style={{ color: bgColor || 'inherit' }}
                            >
                                <span className='w-[8rem] 2xl:w-[16rem] xl-1400:w-[8rem]'>PASSENGER</span>
                                <span className='w-[12rem] 2xl:w-[20rem] xl-1400:w-[12rem] ml-[1rem]'>DATE</span>
                                <span className='w-[4rem] 2xl:w-[8rem] xl-1400:w-[4rem] ml-[1rem]'>GROUP</span>
                            </div>
                            <div className={`flex ml-[2rem] 2xl:ml-[7rem] lg:ml-[2rem] text-[1rem] 2xl:text-[1.4rem] xl-1400:text-[1rem] font-extrabold text-[#6B6B6B] relative`}>
                                <span className='w-[8rem] 2xl:w-[16rem] xl-1400:w-[8rem] flex mt-[0.3rem]'>{postData?.result.member.nickName}</span>
                                <DateInput2 onDateChange={handleDateChange} startDate={String(startDate)} endDate={String(endDate)} setEndDate={setEndDate} setStartDate={setStartDate} />

                                <div className='w-[4rem] 2xl:w-[8rem] xl-1400:w-[4rem] flex text-[1rem] 2xl:text-[1.4rem] xl-1400:text-[1rem] ml-[2rem] 2xl:ml-[4rem] xl-1400:ml-[2rem]'>
                                    <button className='text-[#FB3463] flex text-[1.4rem] 2xl:text-[2rem] xl-1400:text-[1.4rem]' onClick={handleDecrease}>-</button>
                                    <span className='mx-[1rem] 2xl:mt-[0.5rem] xl-1400:mt-[0.3rem]'>{passengerCount || postData?.result.ticket.memberNum}</span>
                                    <button className='text-[#FB3463] flex text-[1.4rem] 2xl:text-[2rem] xl-1400:text-[1.4rem]' onClick={handleIncrease}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className={`w-full max-w-[15.5rem] 2xl:max-w-[23.5rem] xl-1400:max-w-[15.5rem] min-w-[14rem] h-full bg-[${bgColor}] rounded-r-[1rem] flex ml-auto`}>
                            <div className='absolute'>
                                <div className='relative bg-white w-[4rem] h-[4rem] rounded-full -mt-[2rem] -ml-[2rem]'></div>
                                <div className='relative bg-white w-[4rem] h-[4rem] rounded-full mt-[28rem] -ml-[2rem]'></div>
                            </div>
                            <label className='w-full h-full flex cursor-pointer' htmlFor='input-file'>
                                {thumbnailPreview === null ? (
                                    <div className="flex flex-col m-auto">
                                        <Image
                                            className="w-full max-w-[18.8rem] min-w-[8rem] h-[10rem] 2xl-1600:h-[26rem] 2xl:h-[20rem] xl-1400:h-[10rem] rounded-[1rem] object-cover"
                                            src={postData?.result.ticket.image.accessUri}
                                            alt=""
                                            width={230}
                                            height={260}
                                        />
                                    </div>
                                ) : (
                                    <div className='flex flex-col m-auto'>
                                        <Image className=' w-full max-w-[18.8rem] min-w-[10rem] h-[25rem] rounded-[1rem] object-cover' src={thumbnailPreview} width={400} height={250} alt='' />
                                    </div>
                                )}

                            </label>
                            <input className='hidden' id='input-file' type='file' accept='image/*' onChange={handleImageUpload} />
                        </div>
                    </div>
                ) : (
                    <div className='w-full h-[11rem] border border-[#D9D9D9] rounded-[1rem] flex mx-auto mt-[2rem]'>
                        <div className={`w-[1.4rem] h-full bg-[${bgColor}] rounded-l-[1rem]`}></div>
                        <div className='w-fit relative'>
                            <div className='flex justify-center'>
                                <div>
                                    <h1 className='h-[3rem] mt-[1.3rem] text-[2rem] text-[#292929] font-extrabold font-akira'>{result?.result?.isoAlp3 || postData?.result?.ticket?.departureCode}</h1>
                                    <div className='w-[5rem] h-[1.6rem] px-[0.3rem] shadowall rounded-[0.8rem] flex'>
                                        <input
                                            className='w-[3rem] text-[0.8rem] pl-[0.5rem] outline-none'
                                            type='text'
                                            placeholder='출발지'
                                            value={inputValue2} // 첫 번째 입력 값 상태
                                            onChange={(e) => setInputValue1(e.target.value)} // 입력 값 변경 시 핸들러
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    searchCountry(inputValue2); // 엔터 키가 눌리면 함수 호출
                                                }
                                            }}
                                        />
                                        <button className='ml-auto' onClick={() => searchCountry(inputValue2)} >
                                            <Image src={searchicon} alt='' width={10} height={10} />
                                        </button>
                                    </div>

                                </div>
                                <div className='relative bg-white z-10 ml-[7%] mr-[15%]'>
                                    {
                                        isTransport ? (
                                            <div className='w-[1.7rem] h-[10.7rem] absolute z-10 bg-white shadowall rounded-[3rem] flex items-center justify-center mt-[2rem] flex-col space-y-2'>
                                                {isImageIdx.slice(0, 5).map((item: any, index) => (
                                                    <div key={index} onClick={() => selectTransport(item.imgsrc)} className="flex items-center justify-center">
                                                        {/* SVG 이미지에 크기 조정 */}
                                                        <div style={{ width: '2rem', height: '2rem' }}>
                                                            {React.cloneElement(item.imgsrc, { width: '2rem', height: '2rem' })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div
                                                className='w-[1.7rem] h-[1.7rem] absolute shadowall rounded-full flex items-center justify-center mt-[2rem]'
                                                onClick={() => setIsTransport(true)}
                                            >
                                                {isImageIdx[0]?.imgsrc}
                                            </div>
                                        )
                                    }
                                </div>
                                <div className=''>
                                    <h1 className='h-[3rem] mt-[1.3rem] text-[2rem] text-[#292929] font-extrabold font-akira'>{result?.result?.isoAlp3 || postData?.result?.ticket?.destinationCode}</h1>
                                    <div className='w-[5rem] h-[1.6rem] px-[0.3rem] shadowall rounded-[0.8rem] flex'>
                                        <input
                                            className='w-[3rem] text-[0.8rem] pl-[0.5rem] outline-none'
                                            type='text'
                                            placeholder='도착지'
                                            value={inputValue1} // 두 번째 입력 값 상태
                                            onChange={(e) => setInputValue1(e.target.value)} // 입력 값 변경 시 핸들러
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    searchCountry1(inputValue1); // 엔터 키가 눌리면 함수 호출
                                                }
                                            }}
                                        />
                                        <button className='ml-auto' onClick={() => searchCountry1(inputValue1)} >
                                            <Image src={searchicon} alt='' width={10} height={10} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='w-[95%] border border-dashed border-[#CFCFCF] my-[1rem] mx-auto relative z-0' />
                            <div className={`flex text-[0.5rem] ml-[1rem] font-extrabold font-akira`}
                                style={{ color: bgColor || 'inherit' }}
                            >
                                <span className='w-[5rem]'>PASSENGER</span>
                                <span className='w-[9rem] ml-[2rem]'>DATE</span>
                                <span className='w-[2rem] ml-[5.5rem]'>GROUP</span>
                            </div>
                            <div className={`flex text-[0.5rem] ml-[1rem] items-center font-extrabold text-[#6B6B6B] relative`}>
                                <span className='w-[5rem] flex mt-[0.3rem]'>{postData?.result.member.nickName}</span>
                                <DateInput2 onDateChange={handleDateChange} startDate={String(startDate)} endDate={String(endDate)} setEndDate={setEndDate} setStartDate={setStartDate} />
                                <div className='w-[5rem] flex text-[0.8rem] items-center ml-[4.5rem]'>
                                    <button className='text-[#FB3463] flex text-[1.2rem] items-center -mt-[0.2rem]' onClick={handleDecrease}>-</button>
                                    <span className='mx-[0.5rem]'>{passengerCount}</span>
                                    <button className='text-[#FB3463] flex text-[1.2rem] items-center -mt-[0.2rem]' onClick={handleIncrease}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className={`w-[10rem] h-full shadowall bg-[${bgColor}] rounded-r-[1rem] flex ml-auto`}>
                            <div className='absolute'>
                                <div className='relative bg-white w-[1.3rem] sm:w-[1.3rem] h-[1.3rem] rounded-full -mt-[0.6rem] -ml-[0.8rem]'></div>
                                <div className='relative bg-white w-[1.3rem] h-[1.3rem] rounded-full mt-[9.4rem] -ml-[0.8rem]'></div>
                            </div>
                            <label className='w-fit h-full flex cursor-pointer p-[0.7rem]' htmlFor='input-file'>
                                {thumbnailPreview === null ? (
                                    <div className='flex flex-col justify-center items-center m-auto w-[8.5rem] h-[9.5rem] rounded-[1rem] overflow-hidden'>
                                        <Image
                                            className='w-full h-full object-cover'
                                            src={postData?.result.ticket.image.accessUri}
                                            alt=''
                                            width={85}
                                            height={95}
                                        />
                                    </div>
                                ) : (
                                    <div className='flex flex-col justify-center items-center m-auto w-[8.5rem] h-[9.5rem] rounded-[1rem] overflow-hidden'>
                                        <Image
                                            className='w-full h-full object-cover'
                                            src={thumbnailPreview}
                                            alt=''
                                            width={85}
                                            height={95}
                                        />
                                    </div>
                                )}
                            </label>
                            <input className='hidden' id='input-file' type='file' accept='image/*' onChange={handleImageUpload} />
                        </div>
                    </div>
                )}
                <>
                    <div className="h-screen w-full overflow-hidden shadowall mt-[2rem] rounded-[0.8rem]">
                        <form
                            className="h-screen w-full"
                        >

                            <div className="shadow-lg w-full h-screen">
                                <div className='h-[13rem] border-b border-[#CFCFCF] flex'>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="제목"
                                        className="w-full outline-none text-[3.6rem] font-medium flex items-end px-[6rem]"
                                    />
                                </div>
                                {/* <TextEditor /> */}
                                <TextEditorEdits
                                    postRequest={postRequests}
                                    setPostRequest={setPostRequests}

                                />
                                <textarea
                                    className='w-full h-screen outline-none text-[2rem] px-[6rem] py-[2.5rem]'
                                    placeholder='여러분의 경험을 자유롭게 적어주세요.'
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                ></textarea>
                            </div>

                        </form>
                    </div>
                    <div className='w-full h-[18rem] shadowall mt-[0.5rem] mb-[10rem]'>
                        <input className={`text-[1.6rem] font-medium w-[50rem] outline-none ${typeof window !== 'undefined' && window.innerWidth > 600 ? "ml-[6rem]" : "ml-[2rem]"} mt-[3.4rem]`}
                            type='text'
                            placeholder='태그를 3개 이상 입력해주세요.'
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown} />
                        <div className={`flex flex-wrap ${typeof window !== 'undefined' && window.innerWidth > 600 ? "ml-[6rem]" : "ml-[2rem]"}`}>
                            {tags?.map((tag, index) => (
                                <span key={index} className='flex items-center mt-[1rem] bg-[#fa3463] text-white rounded-[1.6rem] text-[1.6rem] px-[0.8rem] py-[0.4rem] mr-2'>
                                    {tag}
                                    <button
                                        className='ml-2 text-white cursor-pointer pb-[0.3rem] text-[1.4rem]' // X 버튼 스타일
                                        onClick={() => handleTagRemove(index)} // 클릭 시 해당 태그 삭제
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </>
            </div>
        </div>
    )
}

export default PostEdit;
