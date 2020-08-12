---
title: "Flutter 시작하기"
tags:
  - flutter
categories:
  - flutter
last_modified_at: 2020-08-12T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# Flutter 시작하기

### 설치
***
![이미지2](/assets/images/flutter-sdk-download.png)

[Flutter 홈페이지](https://flutter.dev/docs/get-started/install/windows) 접속 후
SDK를 특정 경로에 압축 해제한다. 작성자는 `C:\sdk\flutter`에 압축해제하였다.
<br> (이 때 `C:\Program Files\`과 같은 권한 상승이 필요한 `directory`에 저장하지 않는다.)
### 환경 변수 설정.
***

![이미지3](/assets/images/system-variable-serach.png)

시스템 환경 변수 설정을 위해 시작 탭에서 환경 변수를 검색한다.

![이미지4](/assets/images/system-variable-01.png)

아래 보이는 환경 변수를 클릭 후

![이미지5](/assets/images/system-variable-02.png)

시스템 변수의 Path 변수가 존재 시 더블 클릭한다.

없을 경우 새로 추가한다.

![이미지6](/assets/images/system-variable-03.png)

Flutter를 압축해제 했던 `directory`의 위치의 맞게 `/flutter/bin`를 추가해준다.

### flutter doctor 실행.
***
환경 변수가 제대로 설정 되어 있는지를 확인하기 위해 `console`에서 flutter가 설치된 경로에 이동 후
`fluuter doctor`를 입력한다. 아래와 같은 형식의 창이 뜬다면 성공이다.

```
[-] Android toolchain - develop for Android devices
    • Android SDK at D:\Android\sdk
    ✗ Android SDK is missing command line tools; download from https://goo.gl/XxQghQ
    • Try re-installing or updating your Android SDK,
      visit https://flutter.dev/setup/#android-setup for detailed instructions.
```

이후 추가로 설치할 Tool들을 설치 후 마무리한다.


><font size="6">Refernce</font><br>
https://flutter.dev/docs/get-started/install/windows
