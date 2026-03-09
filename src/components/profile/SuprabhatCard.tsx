import { motion } from "framer-motion";
import { Sunrise, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useSuprabhat } from "@/hooks/useSuprabhat";
import { toast } from "sonner";
import { fadeUp } from "@/lib/animations";

export default function SuprabhatCard() {
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;
  const { permission } = useNotifications();
  const {
    enabled: suprabhatEnabled,
    time: suprabhatTime,
    supported: suprabhatSupported,
    toggleSuprabhat,
    setTime: setSuprabhatTime,
    sendTestCard,
  } = useSuprabhat();

  if (!suprabhatSupported) return null;

  return (
    <motion.div
      initial="hidden" animate="visible" custom={5} variants={fadeUp}
      className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Sunrise className="w-4 h-4 text-saffron" />
        <h2 className="font-sans font-semibold text-foreground text-sm">
          {tx("Suprabhat / सुप्रभात", "सुप्रभात / Good Morning", "சுப்ரபாதம்")}
        </h2>
      </div>
      <div className="px-6 py-5 space-y-4">
        <p className="text-xs text-muted-foreground font-sans">
          {tx(
            "Get a divine morning blessing card at your chosen time each day — ready to share on WhatsApp Status.",
            "हर दिन अपने चुने समय पर दिव्य सुप्रभात कार्ड पाएं — WhatsApp Status पर शेयर करने के लिए तैयार।",
            "ஒவ்வொரு நாளும் தேர்ந்த நேரத்தில் தெய்வீக காலை வாழ்த்து அட்டை பெறுங்கள் — WhatsApp Status-ல் பகிர தயார்."
          )}
        </p>

        {/* Enable / Disable toggle */}
        <button
          onClick={async () => {
            await toggleSuprabhat();
            toast.success(
              suprabhatEnabled
                ? tx("Suprabhat disabled", "सुप्रभात बंद किया गया", "சுப்ரபாதம் நிறுத்தப்பட்டது")
                : tx("Suprabhat enabled 🌅", "सुप्रभात सक्षम हुआ 🌅", "சுப்ரபாதம் இயக்கப்பட்டது 🌅")
            );
          }}
          disabled={permission === "denied"}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            suprabhatEnabled ? "border-saffron bg-saffron/10" : "border-border hover:border-saffron/40"
          } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                suprabhatEnabled ? "bg-sacred-gradient shadow-sacred" : "bg-muted"
              }`}
            >
              🌅
            </div>
            <div className="text-left">
              <p className={`text-sm font-sans font-semibold ${suprabhatEnabled ? "text-saffron" : "text-foreground"}`}>
                {tx("Morning Blessing Card", "प्रातः आशीर्वाद कार्ड", "காலை ஆசீர்வாத அட்டை")}
              </p>
              <p className="text-xs font-sans text-muted-foreground">
                {permission === "denied"
                  ? tx("Blocked by browser", "ब्राउज़र ने ब्लॉक किया", "உலாவியால் தடுக்கப்பட்டது")
                  : suprabhatEnabled
                  ? tx(
                      `Enabled — sends at ${suprabhatTime}`,
                      `सक्षम — ${suprabhatTime} बजे`,
                      `இயக்கப்பட்டது — ${suprabhatTime}`
                    )
                  : tx("Currently off", "बंद है", "தற்போது அணைக்கப்பட்டுள்ளது")}
              </p>
            </div>
          </div>
          {suprabhatEnabled ? (
            <Sunrise className="w-5 h-5 text-saffron shrink-0" aria-hidden="true" />
          ) : (
            <Sunrise className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
          )}
        </button>

        {/* Time picker — only shown when enabled */}
        {suprabhatEnabled && (
          <div className="flex items-center gap-3 px-1">
            <Clock className="w-4 h-4 text-saffron shrink-0" />
            <div className="flex-1">
              <label className="text-xs text-muted-foreground font-sans block mb-1">
                {tx("Send at time", "किस समय भेजें", "எந்த நேரத்தில் அனுப்பு")}
              </label>
              <input
                type="time"
                value={suprabhatTime}
                onChange={(e) => {
                  setSuprabhatTime(e.target.value);
                  toast.info(
                    tx(
                      `Morning card set for ${e.target.value}`,
                      `सुप्रभात समय: ${e.target.value}`,
                      `நேரம் அமைக்கப்பட்டது: ${e.target.value}`
                    )
                  );
                }}
                className="font-sans text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-saffron/40 w-36"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sendTestCard();
                toast.success(
                  tx(
                    "Test card sent! Check your notifications.",
                    "टेस्ट कार्ड भेजा गया! नोटिफिकेशन देखें।",
                    "சோதனை அட்டை அனுப்பப்பட்டது!"
                  )
                );
              }}
              className="shrink-0 border-saffron/40 text-saffron hover:bg-saffron/10 font-sans text-xs"
            >
              {tx("Send Test", "टेस्ट करें", "சோதனை")}
            </Button>
          </div>
        )}

        {permission === "denied" && (
          <p className="text-[10px] text-muted-foreground font-sans text-center">
            {tx(
              "Allow notifications in your browser settings to enable Suprabhat",
              "सुप्रभात के लिए ब्राउज़र सेटिंग में नोटिफिकेशन की अनुमति दें",
              "சுப்ரபாதம் இயக்க உலாவி அமைப்புகளில் அறிவிப்புகளை அனுமதிக்கவும்"
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}
