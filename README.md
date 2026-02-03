# 일본어 단어 퀴즈

## 사용 흐름

1. **이름 입력** → 시험 전에 이름 작성
2. **모드 선택** → 퀴즈 또는 플래시카드
3. **시험 진행** → 퀴즈 모드일 때만
4. **이메일 입력** → 시험 후 받을 메일 주소 입력
5. **성적 메일 받기** → 실제로 해당 주소로 발송

## 이메일 발송 설정 (EmailJS)

실제 메일 발송을 위해 [emailjs.com](https://www.emailjs.com) 무료 가입 후 설정하세요.

1. Email Services → Gmail 등 연결
2. Email Templates → 새 템플릿 생성
   - **To Email**: `{{to_email}}`
   - **Subject**: `{{subject}}`
   - **Content**: `{{message}}`
3. Account → Public Key 확인
4. `config.js`에 입력:

```javascript
window.EMAILJS_CONFIG = {
  serviceId: "service_xxxxxx",
  templateId: "template_xxxxxx",
  publicKey: "xxxxxxxxxxxx",
};
```
