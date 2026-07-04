# Vyapar AI: Mobile se GitHub Actions APK build

Is package ko GitHub-compatible bana diya gaya hai. Repository root me `.github/workflows/build-android.yml` present hai.

## GitHub repo me upload karne ka correct structure

Repo ke root me ye files/folders directly dikhne chahiye:

```text
.github/
android-app/
backend-firebase-functions/
web/
docs/
branding/
sample-imports/
README.md
.gitignore
```

Agar GitHub me sirf `VyaparAI_Production_Starter` folder dikh raha hai aur uske andar ye sab hai, to build fail hoga. Us folder ke andar wali files ko root me upload karo.

## Mobile steps

1. ZIP extract karo.
2. GitHub par new repository banao.
3. Extracted `VyaparAI_Production_Starter` folder ke andar wali files upload karo.
4. Repository me `Actions` tab open karo.
5. `Build Vyapar AI Android APK` workflow select karo.
6. `Run workflow` dabao.
7. Build complete hone ke baad run open karo.
8. `Artifacts` section se `VyaparAI-debug-apk` download karo.
9. Artifact ZIP extract karo. APK file usually `app-debug.apk` hogi.

## Build output

- Debug APK: `VyaparAI-debug-apk`
- Debug AAB: `VyaparAI-debug-aab`

Debug APK testing ke liye hai. Play Store ke liye final signed release AAB alag se banana padega.

## Common errors

### 1. Workflow nahi dikh raha
`.github/workflows/build-android.yml` repo root me nahi hai. Folder structure sahi karo.

### 2. settings.gradle not found
Tumne wrong folder upload kiya hai. Repo root me `android-app/settings.gradle` hona chahiye.

### 3. SDK/Gradle error
Workflow Java 17, Gradle 8.7, Android SDK 35 install karta hai. Fir bhi error aaye to Actions log ka screenshot bhejo.

### 4. APK install nahi ho raha
Mobile settings me `Install unknown apps` allow karo. Debug APK Play Protect warning dikha sakta hai because ye Play Store signed nahi hai.

## Compatibility notes

Workflow uses Java 17, Gradle 8.7, Android SDK 35, `gradle/actions/setup-gradle@v6`, and `actions/upload-artifact@v7`.
