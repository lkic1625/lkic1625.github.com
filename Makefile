.PHONY: serve build clean draft

# 로컬 개발 서버 실행
serve:
	hugo server

# 드래프트 포함 로컬 서버 실행
draft:
	hugo server -D

# 프로덕션 빌드
build:
	hugo --minify

# 빌드 결과물 삭제
clean:
	rm -rf public/
