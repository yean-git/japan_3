# 일본어 단어 퀴즈

## 메일 보내기

### 1) 기본 (설정 불필요)

별도 설정 없이 **메일로 보내기**를 누르면 기본 메일 앱(Gmail, Outlook 등)이 열립니다.  
전송 버튼만 누르면 해당 이메일로 결과가 발송됩니다.

### 2) EmailJS (선택 — 메일 앱 없이 바로 발송)

1. [emailjs.com](https://www.emailjs.com) 가입 (무료)
2. **Email Services** → Add Service → Gmail 또는 원하는 서비스 연결
3. **Email Templates** → Create Template
   - **To Email**: `{{to_email}}`
   - **Subject**: `{{subject}}`
   - **Content**: `{{message}}`
4. **Account** → API Keys에서 **Public Key** 확인
5. `config.js`에 값 입력:

```javascript
window.EMAILJS_CONFIG = {
  serviceId: "service_xxxxxx",
  templateId: "template_xxxxxx",
  publicKey: "xxxxxxxxxxxx",
};
```

이후에는 메일 앱 없이 바로 발송됩니다.
