import { motion } from "framer-motion";
import { Bell, BellOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { fadeUp } from "@/lib/animations";

export default function NotificationsCard() {
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;
  const {
    supported: notifSupported,
    enabled: notifEnabled,
    permission,
    toggleNotifications,
  } = useNotifications();

  if (!notifSupported) return null;

  return (
    <motion.div
      initial="hidden" animate="visible" custom={4} variants={fadeUp}
      className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Bell className="w-4 h-4 text-saffron" />
        <h2 className="font-sans font-semibold text-foreground text-sm">
          {tx("Notifications", "सूचनाएं", "அறிவிப்புகள்")}
        </h2>
      </div>
      <div className="px-6 py-5">
        <p className="text-xs text-muted-foreground font-sans mb-4">
          {tx(
            "Receive your daily shloka every morning at 7am",
            "हर सुबह 7 बजे दैनिक श्लोक प्राप्त करें",
            "தினமும் காலை 7 மணிக்கு தினசரி ஸ்லோகம் பெறுங்கள்"
          )}
        </p>
        <button
          onClick={async () => {
            await toggleNotifications();
            toast.success(
              notifEnabled
                ? tx("Notifications disabled", "सूचनाएं बंद की गईं", "அறிவிப்புகள் நிறுத்தப்பட்டன")
                : tx("Notifications enabled 🔔", "सूचनाएं सक्षम की गईं 🔔", "அறிவிப்புகள் இயக்கப்பட்டன 🔔")
            );
          }}
          disabled={permission === "denied"}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            notifEnabled ? "border-saffron bg-saffron/10" : "border-border hover:border-saffron/40"
          } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                notifEnabled ? "bg-sacred-gradient shadow-sacred" : "bg-muted"
              }`}
            >
              &#x0950;
            </div>
            <div className="text-left">
              <p className={`text-sm font-sans font-semibold ${notifEnabled ? "text-saffron" : "text-foreground"}`}>
                {tx("Daily Shloka", "दैनिक श्लोक", "தினசரி ஸ்லோகம்")}
              </p>
              <p className="text-xs font-sans text-muted-foreground">
                {permission === "denied"
                  ? tx("Blocked by browser", "ब्राउज़र ने ब्लॉक किया", "உலாவியால் தடுக்கப்பட்டது")
                  : notifEnabled
                  ? tx("Enabled — every morning at 7am", "सक्षम — हर सुबह 7 बजे", "இயக்கப்பட்டது — தினமும் காலை 7 மணி")
                  : tx("Currently off", "बंद है", "தற்போது அணைக்கப்பட்டுள்ளது")}
              </p>
            </div>
          </div>
          {notifEnabled ? (
            <Bell className="w-5 h-5 text-saffron shrink-0" aria-hidden="true" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
          )}
        </button>
        {permission === "denied" && (
          <p className="text-[10px] text-muted-foreground font-sans mt-2 text-center">
            {tx(
              "Allow notifications in your browser settings to enable this",
              "नोटिफिकेशन के लिए ब्राउज़र सेटिंग में अनुमति दें",
              "இதை இயக்க உங்கள் உலாவி அமைப்புகளில் அறிவிப்புகளை அனுமதிக்கவும்"
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}
