import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";

const LAST_UPDATED = "March 11, 2026";

function PrivacyContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none font-sans">
      <p className="text-muted-foreground text-xs mb-6">Last updated: {LAST_UPDATED}</p>

      <h2 className="font-serif">1. Information We Collect</h2>
      <p>When you create an account, we collect your name, email address, and authentication provider (email or Google/Apple). When you use the app, we store your chat conversations, puja tracking data, kundli analyses, and subscription details in our secure database.</p>

      <h2 className="font-serif">2. How We Use Your Information</h2>
      <p>We use your data to provide and improve OmVani's services, including AI spiritual guidance, deity identification, scripture browsing, and daily notifications. We do not sell your personal information to third parties.</p>

      <h2 className="font-serif">3. Third-Party Services</h2>
      <p>OmVani uses the following third-party services to deliver its features:</p>
      <ul>
        <li><strong>Supabase</strong> — Authentication and database hosting</li>
        <li><strong>Anthropic (Claude AI)</strong> — Spiritual guidance chat responses</li>
        <li><strong>Google (Gemini AI)</strong> — Deity and sacred object identification</li>
        <li><strong>ElevenLabs</strong> — Text-to-speech for shloka audio</li>
        <li><strong>Razorpay</strong> — Payment processing for subscriptions</li>
        <li><strong>Resend</strong> — Transactional email delivery</li>
        <li><strong>Twilio</strong> — WhatsApp reminder delivery</li>
        <li><strong>Sentry</strong> — Error monitoring and crash reporting (production only)</li>
        <li><strong>Firebase Cloud Messaging</strong> — Push notification delivery on Android</li>
      </ul>
      <p>Each service processes only the minimum data needed to provide its function.</p>

      <h2 className="font-serif">4. Data Storage & Security</h2>
      <p>Your data is stored in Supabase (PostgreSQL) with Row Level Security (RLS) enabled, ensuring you can only access your own data. All connections use HTTPS encryption. We do not store your payment card details — Razorpay handles all payment data directly.</p>

      <h2 className="font-serif">5. AI-Generated Content</h2>
      <p>OmVani uses artificial intelligence to generate spiritual guidance responses. These responses are based on Hindu scriptures (Bhagavad Gita, Upanishads, Vedas, Puranas) but are AI-generated interpretations and should not be considered authoritative religious rulings. Always consult qualified spiritual teachers for important matters.</p>

      <h2 className="font-serif">6. Cookies & Local Storage</h2>
      <p>We use browser localStorage to save your preferences (language, theme, notification settings). We use Sentry for error monitoring in production — it collects anonymous error data and device context to help us fix crashes. We do not use third-party tracking cookies or advertising analytics services.</p>

      <h2 className="font-serif">7. Data Retention</h2>
      <p>We retain your data for as long as your account is active. Chat conversations, puja records, and kundli analyses are kept to provide a continuous experience. When you delete your account, all associated data is permanently removed within 30 days.</p>

      <h2 className="font-serif">8. Children's Privacy</h2>
      <p>OmVani requires users to confirm they are at least 14 years old during sign-up. We do not knowingly collect personal information from children under 14.</p>

      <h2 className="font-serif">9. Account Deletion</h2>
      <p>You can delete your account and all associated data at any time from your Profile page. Once deleted, your data cannot be recovered.</p>

      <h2 className="font-serif">10. Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal data. You can delete your account and all associated data from the Profile settings page.</p>

      <h2 className="font-serif">11. Contact</h2>
      <p>For privacy questions, contact us at <a href="mailto:privacy@omvani.app" className="text-saffron hover:underline">privacy@omvani.app</a>.</p>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none font-sans">
      <p className="text-muted-foreground text-xs mb-6">Last updated: {LAST_UPDATED}</p>

      <h2 className="font-serif">1. Acceptance of Terms</h2>
      <p>By using OmVani, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>

      <h2 className="font-serif">2. Description of Service</h2>
      <p>OmVani is an AI-powered spiritual companion that provides scripture-based guidance, bhajan/mantra library, temple directory, deity identification, puja tracking, and kundli analysis based on Hindu dharma traditions.</p>

      <h2 className="font-serif">3. AI Disclaimer</h2>
      <p>OmVani's chat responses are generated by artificial intelligence (Anthropic Claude) and are AI interpretations of Hindu scriptures. They are provided for educational and spiritual exploration purposes only. OmVani is not a substitute for qualified spiritual teachers, priests, or religious authorities. We make no warranty regarding the accuracy of AI-generated content.</p>

      <h2 className="font-serif">4. Subscription Plans</h2>
      <p>OmVani offers Free, Basic (Sadhak), Pro (Guru), and Family subscription tiers. Paid plans include a 7-day free trial. After the trial, your selected plan will be charged via the platform's payment system (Razorpay on web, Google Play Billing on Android). Subscriptions auto-renew unless cancelled. You can manage or cancel your subscription through your payment provider's account settings.</p>

      <h2 className="font-serif">5. Refund Policy</h2>
      <p>If you cancel within the 7-day trial period, you will not be charged. For paid subscriptions, refunds are handled according to Razorpay's policies. Contact us at <a href="mailto:support@omvani.app" className="text-saffron hover:underline">support@omvani.app</a> for refund requests.</p>

      <h2 className="font-serif">6. User Conduct</h2>
      <p>You agree not to misuse OmVani's AI features, attempt to extract harmful content, reverse-engineer the service, or use the app for any unlawful purpose.</p>

      <h2 className="font-serif">7. Content Ownership</h2>
      <p>Scripture texts (Bhagavad Gita, Upanishads, Yoga Sutras) are ancient public domain works. AI-generated responses are provided as-is. The OmVani app design, branding, and curated content remain the property of OmVani.</p>

      <h2 className="font-serif">8. Account Termination</h2>
      <p>You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms.</p>

      <h2 className="font-serif">9. Limitation of Liability</h2>
      <p>OmVani is provided "as is" without warranties. We are not liable for any decisions made based on AI-generated spiritual guidance.</p>

      <h2 className="font-serif">10. Changes to Terms</h2>
      <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

      <h2 className="font-serif">11. Contact</h2>
      <p>For questions about these terms, contact <a href="mailto:support@omvani.app" className="text-saffron hover:underline">support@omvani.app</a>.</p>
    </div>
  );
}

export default function Legal() {
  const { pathname } = useLocation();
  const isPrivacy = pathname === "/privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={title}
        description={isPrivacy ? "OmVani privacy policy — how we collect, use, and protect your data." : "OmVani terms of service — rules for using the app."}
        canonicalPath={pathname}
      />
      <Navbar />

      <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-secondary/60 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{title}</h1>
          <div className="flex justify-center gap-4 text-sm font-sans">
            <Link to="/privacy" className={`hover:underline ${isPrivacy ? "text-saffron font-semibold" : "text-muted-foreground"}`}>Privacy Policy</Link>
            <span className="text-border">|</span>
            <Link to="/terms" className={`hover:underline ${!isPrivacy ? "text-saffron font-semibold" : "text-muted-foreground"}`}>Terms of Service</Link>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        {isPrivacy ? <PrivacyContent /> : <TermsContent />}
      </div>

      <footer className="py-6 px-4 border-t border-border text-center">
        <Link to="/" className="inline-flex items-center gap-1 font-serif text-lg font-bold text-gradient-sacred">
          <span>ॐ</span><span>Vani</span>
        </Link>
        <p className="text-xs text-muted-foreground/60 font-sans mt-1">© 2026 ॐVani</p>
      </footer>
    </div>
  );
}
