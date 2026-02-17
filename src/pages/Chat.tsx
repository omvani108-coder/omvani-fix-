import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-gradient-sacred">OmVani</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-sans">{user?.email}</span>
          <button onClick={signOut} className="text-sm text-saffron hover:underline font-sans">
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-4">🙏</p>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Namaste, {user?.user_metadata?.full_name || "Seeker"}</h2>
          <p className="text-muted-foreground font-sans">
            Your AI spiritual companion is coming soon. Voice and text chat will be available here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Chat;
