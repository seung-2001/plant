import axios from 'axios';

const API_BASE_URL = 'http://192.168.202.59:5000';

export interface VolunteerMeal {
  progrmRegistNo: string;      // 프로그램 등록번호
  prgramSj: string;            // 프로그램 제목
  actBeginDe: string;          // 활동 시작일
  actEndDe: string;            // 활동 종료일
  actPlace: string;            // 활동 장소
  progrmCn: string;            // 프로그램 내용
  progrmSttusSe: string;       // 프로그램 상태
  rcritNmpr: string;           // 모집인원
  actWkdy: string;             // 활동 요일
  actTime: string;             // 활동 시간
  srvcClCode: string;          // 서비스 분류 코드
  nanmmbyNm: string;           // 봉사자명
  nanmmbyNmAdmn: string;       // 봉사자 관리자명
  telno: string;               // 전화번호
  email: string;               // 이메일
  postAdres: string;           // 우편주소
  nanmmbyNmAdmnTelno: string;  // 봉사자 관리자 연락처
}

export async function fetchVolunteerMeals(params: {
  start_date?: string;
  end_date?: string;
  keyword?: string;
}) {
  try {
    const response = await axios.get(`${API_BASE_URL}/volunteer/meals`, { params });
    return response.data;
  } catch (error) {
    console.error('봉사 정보 조회 실패:', error);
    throw error;
  }
} 