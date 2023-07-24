NOVEMBERIZING STORAGE
=====================

[ENGLISH](https://novemberizing.github.io/iam/README.en.html) |
[한국어](https://novemberizing.github.io/iam/README.ko.html)

![Node js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

![Github issues](https://img.shields.io/github/issues/novemberizing/iam)
![GitHub license](https://img.shields.io/github/license/novemberizing/iam)
![GitHub release](https://img.shields.io/github/v/release/novemberizing/iam)
![Npm version](https://img.shields.io/npm/v/@novemberizing/iam)

----

> "Novemberizing iam" is an application that implements the Identity Access Management System.

The goal of "Novemberizing iam" is to help you easily build user management and account management with just installation when building applications.

![Class Diagram Log](https://novemberizing.github.io/iam/assets/images/ClassDiagramIdentityAccessManager.jpg)

## INSTALL

...

## USAGE

## DEVELOPMENT ENVIRONMENT

로컬 개발환경에서 도커를 실행시키는 방법

```
docker run -itd --name iam -p 40001:40001 -p 50001:50001 -v ${PWD}:/usr/src/app novemberizing/iam
```

TODO: 아래의 것들은 다시 작성하자. START /////////////////////////////////////////////
IAM 서버를 동작시키는 방법

```
docker run -itd --rm --name iam -p 40001:40001 -p 50001:50001 --mount type=bind,source=.\configure.json,target=/usr/src/app/configure.json novemberizing/iam
```

로컬 폴더에서 IAM 페이지 실행시키는 방법

```
docker run -itd --name nginx -p 8090:80 -v $PWD\default.conf:/etc/nginx/conf.d/default.conf:ro -v ${PWD}\docs:/usr/share/nginx/html:ro nginx
```

도커를 빌드하는 방법

```
docker build --tag novemberizing/iam:[version tag] --tag novemberizing/iam:latest .
```

TODO: 아래의 것들은 다시 작성하자. END /////////////////////////////////////////////

### DOCUMENT

[Novemberizing iam api](https://novemberizing.github.io/iam/api)
