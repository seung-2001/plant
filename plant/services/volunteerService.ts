import axios from 'axios';

const API_BASE_URL = 'http://192.168.200.181:5000';

export interface VolunteerMeal {
  progrmRegistNo: string;      // 프로그램 등록번호
  prgramSj: string;            // 프로그램 제목 (봉사 활동명)
  actBeginDe: string;          // 활동 시작일 (YYYYMMDD 형식)
  actEndDe: string;            // 활동 종료일 (YYYYMMDD 형식)
  actPlace: string;            // 활동 장소
  progrmCn: string;            // 프로그램 내용 (상세 내용)
  progrmSttusSe: string;       // 프로그램 상태 ('자원봉사자 모집중', '접수마감', '완료' 등)
  rcritNmpr: string;           // 모집인원
  actWkdy: string;             // 활동 요일 (예: '월,화,수' 또는 '매주 토요일')
  actTime: string;             // 활동 시간 (예: '09:00~18:00')
  srvcClCode: string;          // 서비스 분류 코드
  nanmmbyNm: string;           // 기관명 (주최기관)
  nanmmbyNmAdmn: string;       // 담당자 이름
  telno: string;               // 기관 연락처
  email: string;               // 이메일
  postAdres: string;           // 우편주소
  nanmmbyNmAdmnTelno: string;  // 담당자 연락처
}

export interface VolunteerDetail extends VolunteerMeal {
  participants: Array<{
    id: string;
    name: string;
    status: 'approved' | 'rejected' | 'pending';
  }>;
}

export interface VolunteerResponse {
  items: VolunteerMeal[];
  numOfRows: number;
  pageNo: number;
  totalCount: number;
  status?: string;
}

export async function fetchVolunteerMeals(params: {
  start_date?: string;
  end_date?: string;
  keyword?: string;
}): Promise<VolunteerResponse> {
  try {
    console.log('API 호출 시작:', `${API_BASE_URL}/volunteer/meals`, params);
    
    // 날짜 형식 변환 (YYYY-MM-DD -> YYYYMMDD)
    const formattedParams = {
      ...params,
      start_date: params.start_date?.replace(/-/g, ''),
      end_date: params.end_date?.replace(/-/g, '')
    };
    
    console.log('변환된 파라미터:', formattedParams);
    
    const response = await axios.get(`${API_BASE_URL}/volunteer/meals`, { 
      params: formattedParams,
      timeout: 15000 // 15초 타임아웃 설정
    });
    
    console.log('API 응답 상태:', response.status);
    console.log('API 응답 데이터:', JSON.stringify(response.data).substring(0, 500) + '...');
    
    if (!response.data) {
      throw new Error('응답 데이터가 없습니다.');
    }
    
    // 누락된 필드가 있는 항목에 대해 기본값 제공
    if (response.data.items) {
      response.data.items = response.data.items.map((item: VolunteerMeal) => ({
        ...item,
        actPlace: item.actPlace || '',
        actBeginDe: item.actBeginDe || '',
        actEndDe: item.actEndDe || '',
        actTime: item.actTime || '',
        actWkdy: item.actWkdy || '',
        telno: item.telno || '',
        progrmSttusSe: item.progrmSttusSe || '상태 미정',
        prgramSj: item.prgramSj || '제목 없음',
        nanmmbyNm: item.nanmmbyNm || '',
        nanmmbyNmAdmn: item.nanmmbyNmAdmn || '',
        nanmmbyNmAdmnTelno: item.nanmmbyNmAdmnTelno || '',
        rcritNmpr: item.rcritNmpr || ''
      }));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('봉사 정보 조회 실패:', error.message);
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    } else if (error.request) {
      // 요청은 보냈으나 응답이 없는 경우
      console.error('응답 없음. 네트워크 또는 서버 문제일 수 있습니다.');
    }
    
    // 서버 연결 실패 시 사용자 친화적인 에러 메시지 제공
    if (error.code === 'ECONNABORTED') {
      throw new Error('서버 응답 시간이 초과되었습니다. 네트워크 연결을 확인해 주세요.');
    } else if (!error.response) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.');
    }
    
    throw error;
  }
}

export async function fetchVolunteerDetail(id: string): Promise<VolunteerDetail> {
  try {
    console.log('상세 정보 API 호출:', `${API_BASE_URL}/volunteer/detail`, { progrmRegistNo: id });
    
    const response = await axios.get(`${API_BASE_URL}/volunteer/detail`, {
      params: { progrmRegistNo: id },
      timeout: 15000 // 15초 타임아웃으로 증가
    });
    
    console.log('상세 정보 응답 상태:', response.status);
    console.log('봉사 상세 정보 원본 데이터:', JSON.stringify(response.data, null, 2));
    
    if (!response.data) {
      throw new Error('상세 정보 응답 데이터가 없습니다.');
    }
    
    // 주소 관련 필드 특별 처리
    const actPlace = response.data.actPlace || '';
    const postAdres = response.data.postAdres || '';
    
    console.log('API 응답 주소 정보:', {
      actPlace: actPlace,
      postAdres: postAdres,
      actPlaceType: typeof actPlace,
      postAdresType: typeof postAdres
    });
    
    // 누락된 필드에 대해 기본값 제공
    const detailData = {
      ...response.data,
      actPlace: actPlace,
      postAdres: postAdres,
      actBeginDe: response.data.actBeginDe || '',
      actEndDe: response.data.actEndDe || '',
      actTime: response.data.actTime || '',
      actWkdy: response.data.actWkdy || '',
      telno: response.data.telno || '',
      progrmSttusSe: response.data.progrmSttusSe || '상태 미정',
      prgramSj: response.data.prgramSj || '제목 없음',
      progrmCn: response.data.progrmCn || '',
      nanmmbyNm: response.data.nanmmbyNm || '',
      nanmmbyNmAdmn: response.data.nanmmbyNmAdmn || '',
      nanmmbyNmAdmnTelno: response.data.nanmmbyNmAdmnTelno || '',
      rcritNmpr: response.data.rcritNmpr || '',
      participants: response.data.participants || []
    };
    
    console.log('가공된 봉사 상세 정보:', {
      actPlace: detailData.actPlace,
      postAdres: detailData.postAdres,
      prgramSj: detailData.prgramSj
    });
    
    return detailData;
  } catch (error: any) {
    console.error('봉사 상세 정보 조회 실패:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    // 서버 연결 실패 시 사용자 친화적인 에러 메시지 제공
    if (error.code === 'ECONNABORTED') {
      throw new Error('서버 응답 시간이 초과되었습니다. 네트워크 연결을 확인해 주세요.');
    } else if (!error.response) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.');
    }
    throw error;
  }
} 