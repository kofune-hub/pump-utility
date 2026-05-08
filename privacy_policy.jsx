export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#0a0a0a", color: "#e8e4dc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        a { color: #aaa; text-decoration: underline; }
        a:hover { color: #e8e4dc; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #141414", padding: "13px 18px", background: "#0d0d0d" }}>
        <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.15em", fontFamily: "'DM Mono', monospace" }}>
          PUMP — プライバシーポリシー
        </span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>

        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#e8e4dc", marginBottom: 6, letterSpacing: "0.02em" }}>
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: 11, color: "#333", marginBottom: 40, fontFamily: "'DM Mono', monospace" }}>
          最終更新日：2026年5月8日
        </p>

        <Section title="1. 事業者情報">
          <p>
            株式会社PUMP（以下「当社」）は、お客様の個人情報の保護を重要な責務と認識し、
            個人情報の保護に関する法律（個人情報保護法）および関連法令を遵守します。
          </p>
          <p>
            <strong>事業者名：</strong>株式会社PUMP<br />
            <strong>所在地：</strong>東京都<br />
            <strong>ウェブサイト：</strong><a href="https://www.pump.tokyo/" target="_blank" rel="noreferrer">https://www.pump.tokyo/</a>
          </p>
        </Section>

        <Section title="2. 収集する個人情報">
          <p>当社は以下の場合に個人情報を取得することがあります。</p>
          <ul>
            <li>お問い合わせフォームからのご連絡（氏名、メールアドレス、会社名、お問い合わせ内容）</li>
            <li>お見積もり・ご依頼時のやり取り（上記に加え、住所・電話番号・案件内容等）</li>
            <li>採用応募時（氏名、連絡先、経歴情報等）</li>
            <li>ウェブサイトへのアクセス時に収集されるアクセスログ・Cookie情報</li>
          </ul>
        </Section>

        <Section title="3. 個人情報の利用目的">
          <p>取得した個人情報は以下の目的に限り利用します。</p>
          <ul>
            <li>お問い合わせへの回答および業務上の連絡</li>
            <li>ご依頼いただいた制作・撮影・編集業務の遂行</li>
            <li>採用選考および採用後の連絡</li>
            <li>サービス改善・統計分析（個人を特定しない形式）</li>
            <li>法令に基づく対応</li>
          </ul>
        </Section>

        <Section title="4. 第三者への提供">
          <p>
            当社は、以下のいずれかに該当する場合を除き、お客様の個人情報を第三者に提供しません。
          </p>
          <ul>
            <li>お客様本人の同意がある場合</li>
            <li>法令に基づく場合（裁判所・警察等からの適法な要請等）</li>
            <li>人の生命・身体・財産の保護に必要な場合</li>
            <li>業務委託先に対して、利用目的の達成に必要な範囲で提供する場合（秘密保持契約を締結した上で委託します）</li>
          </ul>
        </Section>

        <Section title="5. Cookie・アクセス解析">
          <p>
            当社ウェブサイトでは、サービス改善を目的としてGoogle Analytics等のアクセス解析ツールを使用する場合があります。
            これらのツールはCookieを使用してアクセス情報を収集しますが、個人を特定する情報は含まれません。
            ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。
          </p>
        </Section>

        <Section title="6. 個人情報の管理・安全対策">
          <p>
            当社は取得した個人情報への不正アクセス・紛失・漏洩・改ざん等を防止するため、
            適切な技術的・組織的安全管理措置を講じます。
            業務委託先に個人情報を提供する場合は、適切な管理を求め、監督します。
          </p>
        </Section>

        <Section title="7. 個人情報の保存期間">
          <p>
            個人情報は利用目的の達成に必要な期間のみ保存し、不要となった情報は適切な方法で廃棄します。
            なお、法令により保存が義務付けられている場合はその期間に従います。
          </p>
        </Section>

        <Section title="8. 開示・訂正・削除のご請求">
          <p>
            ご本人から保有する個人情報の開示・訂正・利用停止・削除をご請求いただける場合があります。
            以下の窓口までご連絡ください。ご本人確認を行った上で、法令の定めに従い合理的な期間内に対応します。
          </p>
        </Section>

        <Section title="9. お問い合わせ窓口">
          <p>
            個人情報の取扱いに関するお問い合わせは、下記の窓口までご連絡ください。
          </p>
          <p>
            <strong>株式会社PUMP　個人情報担当</strong><br />
            Email：<a href="mailto:info@pump.tokyo">info@pump.tokyo</a><br />
            受付時間：平日 10:00〜18:00（祝日・年末年始を除く）
          </p>
        </Section>

        <Section title="10. ポリシーの変更">
          <p>
            当社は本プライバシーポリシーを予告なく改定することがあります。
            重要な変更がある場合はウェブサイト上でお知らせします。
            最新のポリシーは常に本ページに掲載します。
          </p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 20, borderTop: "1px solid #181818", fontSize: 11, color: "#2a2a2a", textAlign: "right", fontFamily: "'DM Mono', monospace" }}>
          株式会社PUMP
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: "#888", letterSpacing: "0.04em", marginBottom: 12, borderBottom: "1px solid #181818", paddingBottom: 8 }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: "#666", lineHeight: 1.9 }}>
        {children}
      </div>
      <style>{`
        div[style*="margin-bottom: 32"] ul {
          padding-left: 20px;
          margin: 8px 0;
        }
        div[style*="margin-bottom: 32"] li {
          margin-bottom: 6px;
          color: #666;
        }
        div[style*="margin-bottom: 32"] p {
          margin: 0 0 10px;
        }
        div[style*="margin-bottom: 32"] strong {
          color: #888;
        }
      `}</style>
    </div>
  );
}
