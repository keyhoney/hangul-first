import React from "react";

const About: React.FC = () => {
  return (
    <section aria-label="정보" style={{ display: "grid", gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>정보</h2>

      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>데이터/이미지 출처 및 라이선스</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            OpenMoji 아이콘: 라이선스 CC BY-SA 4.0
            (<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>)
          </li>
          <li>
            Twemoji 아이콘: 라이선스 CC BY 4.0
            (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>)
          </li>
        </ul>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>개인정보 및 저장</h3>
        <p style={{ margin: 0, fontSize: 14 }}>
          본 서비스는 개인정보를 수집하지 않습니다. 진행도/설정은 브라우저의 localStorage에만 저장되며,
          네임스페이스는 "hf/"를 사용합니다.
        </p>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>연락처</h3>
        <p style={{ margin: 0, fontSize: 14 }}>
          이메일: example@domain.com
        </p>
      </div>
    </section>
  );
};

export default About;


