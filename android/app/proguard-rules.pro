# OmVani ProGuard Rules
# Capacitor uses WebView — keep JS bridge intact

# Keep Capacitor bridge
-keep class com.getcapacitor.** { *; }
-keep class com.omvani.app.** { *; }

# Keep WebView JS interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep line numbers for Sentry stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep Google Services / Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Don't warn about missing optional dependencies
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
-dontwarn org.apache.http.**
