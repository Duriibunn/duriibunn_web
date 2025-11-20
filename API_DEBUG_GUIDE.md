# 🔍 공공데이터 API 디버깅 가이드

## ❌ 현재 문제
- 모든 버전의 API 엔드포인트에서 `"api not found"` 또는 `"unexpected errors"` 반환
- KorService1, KorService2, KorService 모두 동일한 에러
- 이것은 **API 키 권한 문제**일 가능성이 높습니다

## ✅ 공공데이터포털 확인 체크리스트

### 1. 마이페이지 → 오픈API → 개발계정 상세보기
```
https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15101578
```

### 2. 확인사항
- [ ] **한국관광공사_국문 관광정보 서비스_GW** API 활용신청 승인 여부
- [ ] 인증키 상태: "정상" 표시 확인
- [ ] 트래픽 제한: 일일 허용 트래픽 확인
- [ ] 서비스 상태: "서비스 중" 확인

### 3. 활용신청이 안 되어있다면
1. API 상세페이지 접속
2. "활용신청" 버튼 클릭
3. 약관 동의 후 신청
4. ⚠️ **승인까지 1~2시간 소요** (즉시 승인 아님)

## 🧪 수동 테스트 방법

### 방법 1: 웹브라우저에서 직접 테스트
아래 URL을 브라우저 주소창에 붙여넣기:

```
https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=b5e4c53836c78af4f7a628dc96a21af84b7d72aaf051ad37678c5ce6a7939ec9&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=Dooribun&_type=json&listYN=Y&arrange=A&areaCode=1&contentTypeId=12
```

**예상 결과:**
- ✅ 성공: JSON 데이터 (response.header.resultCode === "0000")
- ❌ 실패: 
  - `"api not found"` → API 버전 또는 엔드포인트 오류
  - `"SERVICE_KEY_IS_NOT_REGISTERED_ERROR"` → 활용신청 안 됨
  - `"UNREGISTERED_SERVICE_KEY"` → API 키 잘못됨
  - `"LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR"` → 트래픽 초과

### 방법 2: 터미널에서 테스트
```bash
curl "https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=b5e4c53836c78af4f7a628dc96a21af84b7d72aaf051ad37678c5ce6a7939ec9&numOfRows=1&pageNo=1&MobileOS=ETC&MobileApp=Dooribun&_type=json&listYN=Y&arrange=A&areaCode=1&contentTypeId=12"
```

## 📋 사용 가능한 API 버전

### KorService1 (구버전)
- Base URL: `https://apis.data.go.kr/B551011/KorService1`
- 엔드포인트: `areaBasedList1`, `searchKeyword1`, `locationBasedList1` (숫자 1 붙음)

### KorService2 (신버전 - 문서상)
- Base URL: `https://apis.data.go.kr/B551011/KorService2`
- 엔드포인트: `areaBasedList`, `searchKeyword`, `locationBasedList` (숫자 없음)
- ⚠️ 실제로는 작동 안 함 (api not found)

## 🔧 해결 방법

### 옵션 1: 활용신청 후 대기 (권장)
1. 공공데이터포털에서 API 활용신청
2. 승인 대기 (1~2시간)
3. 승인 후 다시 테스트

### 옵션 2: 다른 API 사용
공공데이터포털에서 다른 관광 API 검색:
- 지역별 관광정보 서비스
- 관광사진 정보 서비스
- 숙박 정보 서비스

### 옵션 3: Mock 데이터로 개발 진행
현재 이미 구현된 Mock 데이터 폴백 시스템 사용:
- `src/data/mockPlaces.ts` - 관광지 데이터
- `src/data/mockHotels.ts` - 숙박 데이터
- API 승인 후 자동으로 실제 데이터로 전환됨

## 📞 추가 확인사항

### API 키 확인
현재 사용 중인 키:
```
b5e4c53836c78af4f7a628dc96a21af84b7d72aaf051ad37678c5ce6a7939ec9
```

### 인코딩 키 확인
공공데이터포털 마이페이지에서:
- "일반 인증키 (Encoding)" 탭의 키를 복사
- "일반 인증키 (Decoding)" 탭의 키와 다를 수 있음
- URL에 사용할 때는 Encoding 키 사용

## 🎯 다음 단계

1. **지금 바로:** 공공데이터포털 로그인 → 마이페이지 → API 활용신청 확인
2. **활용신청 안 됨:** 활용신청 후 1~2시간 대기
3. **활용신청 됨:** 브라우저에서 위 URL 직접 테스트하여 실제 응답 확인
4. **여전히 안 됨:** 공공데이터포털 고객센터 문의 (1577-0902)

---

**현재 상태:** Mock 데이터로 정상 작동 중 ✅  
**목표:** 실제 API 데이터로 전환 (API 승인 필요) 🎯
