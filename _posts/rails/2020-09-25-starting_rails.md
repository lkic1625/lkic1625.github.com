---
title: "starting rails"
tags:
  - rails
  - ruby
categories:
  - rails
last_modified_at: 2020-09-30T13:00:00+18:00
toc: true
---

# rails

rails guiding principles
- Don't Repeat Yourself: DRY is a principle of software development which states that "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." By not writing the same information over and over again, our code is more maintainable, more extensible, and less buggy.
- Convention Over Configuration: Rails has opinions about the best way to do many things in a web application, and defaults to this set of conventions, rather than require that you specify minutiae through endless configuration files.

# rails 프로젝트 만들기.

## installing rails

`Rails` 설치 전 준비되어야 할 리스트
- Ruby
- SQLite3
- Node.js
- Yarn

`Yarn`은 `npm`으로도 설치 가능하다.

## Blog application 만들기

레일즈는 기본 디자인 패턴 프로젝트를 생성할 수 있는 명령어를 가지고 있다.

```
$ rails new blog
```

위는 `blog` 디렉토리를 생성하며 `gem dependencies`를 가지고 있다.
자동생성된 디렉토리에는 아래와 같은 디렉토리 구조를 가지고 있다.

| File/Folder | Purpose     |
| :------------- | :------------- |
|    app/   |   Contains the controllers, models, views, helpers, mailers, channels, jobs, and assets for your application. You'll focus on this folder for the remainder of this guide.    |
|    bin/   |   	Contains the rails script that starts your app and can contain other scripts you use to setup, update, deploy, or run your application.    |
|    config/   |  	Configure your application's routes, database, and more. This is covered in more detail in Configuring Rails Applications.     |
|   config.ru    |    	Rack configuration for Rack based servers used to start the application. For more information about Rack, see the Rack website.   |
|   db/    |   Contains your current database schema, as well as the database migrations.     |
|    Gemfile
Gemfile.lock   |    These files allow you to specify what gem dependencies are needed for your Rails application. These files are used by the Bundler gem. For more information about Bundler, see the Bundler website.   |
|  lib/     |   	Extended modules for your application.    |
|    log/   |   Application log files.    |
|   package.json    |    This file allows you to specify what npm dependencies are needed for your Rails application. This file is used by Yarn. For more information about Yarn, see the Yarn website.   |
|    public/  |   The only folder seen by the world as-is. Contains static files and compiled assets.   |
|    Rakefile  |  This file locates and loads tasks that can be run from the command line. The task definitions are defined throughout the components of Rails. Rather than changing Rakefile, you should add your own tasks by adding files to the lib/tasks directory of your application.    |
|   README.md   |   This is a brief instruction manual for your application. You should edit this file to tell others what your application does, how to set it up, and so on.   |
|  storage/    |    Active Storage files for Disk Service. This is covered in Active Storage Overview.  |
|   test/   |    	Unit tests, fixtures, and other test apparatus. These are covered in Testing Rails Applications.  |
|   tmp/   |   Temporary files (like cache and pid files).   |
|   vendor/   |    A place for all third-party code. In a typical Rails application this includes vendored gems.  |
|  .ruby-version    |  	This file contains the default Ruby version.    |
