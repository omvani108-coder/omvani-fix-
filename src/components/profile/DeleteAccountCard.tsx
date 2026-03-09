import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fadeUp } from "@/lib/animations";

export default function DeleteAccountCard() {
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;
  const navigate = useNavigate();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete account");
      }
      await supabase.auth.signOut();
      navigate("/");
      toast.success(
        tx(
          "Account deleted. We're sorry to see you go.",
          "खाता हटा दिया गया।",
          "கணக்கு நீக்கப்பட்டது."
        )
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" custom={10} variants={fadeUp}>
      {!deleteConfirmOpen ? (
        <button
          onClick={() => setDeleteConfirmOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-red-200 dark:border-red-900/40 bg-card text-red-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200 font-sans text-xs font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {tx("Delete Account", "खाता हटाएं", "கணக்கை நீக்கு")}
        </button>
      ) : (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-sans font-semibold text-red-700 dark:text-red-400">
                {tx("This action cannot be undone", "यह क्रिया पूर्ववत नहीं हो सकती", "இந்த செயலை மீட்க முடியாது")}
              </p>
              <p className="text-xs font-sans text-red-600/70 dark:text-red-400/70 mt-1">
                {tx(
                  "All your data including conversations, puja history, and subscription will be permanently deleted.",
                  "आपकी सभी बातचीत, पूजा इतिहास और सदस्यता स्थायी रूप से हटा दी जाएगी।",
                  "உரையாடல்கள், பூஜை வரலாறு மற்றும் சந்தா உள்ளிட்ட அனைத்து தரவும் நிரந்தரமாக நீக்கப்படும்."
                )}
              </p>
            </div>
          </div>
          <div>
            <Label className="font-sans text-xs text-red-600 dark:text-red-400">
              {tx('Type "DELETE" to confirm', '"DELETE" टाइप करें', '"DELETE" என்று தட்டச்சு செய்யவும்')}
            </Label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-1 border-red-200 dark:border-red-800 focus:ring-red-400"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 font-sans text-xs"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeleteConfirmText("");
              }}
            >
              {tx("Cancel", "रद्द करें", "ரத்து")}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-sans text-xs"
              disabled={deleteConfirmText !== "DELETE" || deleteLoading}
              onClick={handleDeleteAccount}
            >
              {deleteLoading
                ? tx("Deleting...", "हटा रहे हैं...", "நீக்குகிறோம்...")
                : tx("Permanently Delete", "स्थायी रूप से हटाएं", "நிரந்தரமாக நீக்கு")}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
