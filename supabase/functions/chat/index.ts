diff --git a/supabase/functions/chat/index.ts b/supabase/functions/chat/index.ts
index f0047d06103a798262fc78ec2da784fc87e442e3..197ae5d539b104a47d6a0bba41e38ebbc65d878f 100644
--- a/supabase/functions/chat/index.ts
+++ b/supabase/functions/chat/index.ts
@@ -14,94 +14,119 @@ serve(async (req) => {
     const { messages, system } = await req.json();
 
     if (!messages || !Array.isArray(messages)) {
       return new Response(
         JSON.stringify({ error: "messages array is required" }),
         { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
       );
     }
 
     const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
     if (!anthropicKey) {
       return new Response(
         JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
         { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
       );
     }
 
     const response = await fetch("https://api.anthropic.com/v1/messages", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "x-api-key": anthropicKey,
         "anthropic-version": "2023-06-01",
       },
       body: JSON.stringify({
-        model: "claude-haiku-4-5",
+        model: "claude-3-5-haiku-latest",
         max_tokens: 1024,
         ...(system ? { system } : {}),
         stream: true,
         messages: messages.slice(-10),
       }),
     });
 
     if (!response.ok) {
       const err = await response.text();
       return new Response(
         JSON.stringify({ error: `Anthropic error: ${err}` }),
         { status: response.status, headers: { ...CORS, "Content-Type": "application/json" } }
       );
     }
 
+    if (!response.body) {
+      throw new Error("Anthropic response did not include a stream body");
+    }
+
     const stream = new ReadableStream({
       async start(controller) {
-        const reader = response.body!.getReader();
+        const reader = response.body.getReader();
         const decoder = new TextDecoder();
+        const encoder = new TextEncoder();
+        let buffer = "";
 
         try {
           while (true) {
             const { done, value } = await reader.read();
             if (done) break;
 
-            const chunk = decoder.decode(value, { stream: true });
-            const lines = chunk.split("\n");
+            buffer += decoder.decode(value, { stream: true });
+            const lines = buffer.split("\n");
+            buffer = lines.pop() ?? "";
 
             for (const line of lines) {
               if (!line.startsWith("data: ")) continue;
               const data = line.slice(6).trim();
               if (data === "[DONE]") continue;
 
               try {
                 const parsed = JSON.parse(data);
                 if (
                   parsed.type === "content_block_delta" &&
                   parsed.delta?.type === "text_delta" &&
                   parsed.delta?.text
                 ) {
-                  controller.enqueue(new TextEncoder().encode(parsed.delta.text));
+                  controller.enqueue(encoder.encode(parsed.delta.text));
                 }
               } catch {
                 // Skip malformed SSE lines
               }
             }
           }
+
+          if (buffer.startsWith("data: ")) {
+            const data = buffer.slice(6).trim();
+            if (data && data !== "[DONE]") {
+              try {
+                const parsed = JSON.parse(data);
+                if (
+                  parsed.type === "content_block_delta" &&
+                  parsed.delta?.type === "text_delta" &&
+                  parsed.delta?.text
+                ) {
+                  controller.enqueue(encoder.encode(parsed.delta.text));
+                }
+              } catch {
+                // Skip malformed trailing line
+              }
+            }
+          }
         } finally {
-          controller.close();
           reader.releaseLock();
+          controller.close();
         }
       },
     });
 
     return new Response(stream, {
       headers: {
         ...CORS,
         "Content-Type": "text/plain; charset=utf-8",
         "X-Content-Type-Options": "nosniff",
       },
     });
   } catch (err) {
     return new Response(
       JSON.stringify({ error: String(err) }),
       { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
     );
   }
 });
