import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getBoard() {
    try {
        const res = await axios.get(`${backendUrl}/api/post/all?type=POST`)
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function getPost(postId: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/info/${postId}`);
        return res.data;
    } catch (e) {
        return null
    }
}

export const getTotalBoardCount = async (): Promise<number> => {
    try {
        const response = await axios.get<{ result: number }>(
            `${backendUrl}/api/post/count/my?type=POST`
        );
        return response.data.result;
    } catch (error) {
        console.error(`전체 POST 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
        throw error;
    }
};

export async function getBoardMyTotal(size: number, page: number, orderType: string) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/my?size=${size}&page=${page}&orderType=${orderType}`);
        return res.data;
    } catch (e) {
        return null;
    }
}

export const getUserTotalBoardCount = async (memberId: string): Promise<number> => {
    try {
        const response = await axios.get<{ result: number }>(
            `${backendUrl}/api/post/count/by-member?type=POST&memberId=${memberId}`
        );
        return response.data.result;
    } catch (error) {
        console.error(`전체 POST 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
        throw error;
    }
};

export async function getUserBoard(size: number, page: number, orderType: string, memberId: string) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/by-member?size=${size}&page=${page}&orderType=${orderType}&memberId=${memberId}`)
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function getFollowBoard(memberId: string) {
    try {
        const res = await axios.get(`${backendUrl}/api/member/following?memberId=${memberId}`);
        return res.data;
    } catch (e) {
        return null;
    }
}