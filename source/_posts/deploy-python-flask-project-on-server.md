---
title: 在云服务器上部署python项目
date: 2020-3-25 17:06
author: jiabh
top: true
categories:
 - Python
tags:
 - Python
---

前不久，我开发了一个python web项目，一直在自己的电脑上跑。这样本没有什么问题，但由于电脑需要24小时开启并联网，它或多或少在生活中还是给我带来了一些不便。于是我购买了一台云服务器，把它部署在上边。

<!--more-->

项目依赖：python3.7，MySQL 8.0

操作系统：本地win10，云服务器Ubuntu Server 18 LTS



# 部署过程

部署主要分为三步：首先把本地的项目文件发送到服务器上，然后在服务器配置好运行环境，最后在服务器运行起服务。

## 发送项目相关文件到服务器

首先简要介绍`scp`命令：

cp —— 在同一台电脑上、不同的目录之间copy文件。不能跨机拷贝。

scp —— secure copy的简写，用于远程拷贝文件。基于ssh登录进行加密传输。



复制**本地**文件到**远程机器**指定目录（如果复制目录，加上参数 -r ）：

```bash
scp -rp /path/filename username@remoteIP:/path
```
复制**远程机器**文件到**本地**指定目录：

```shell
scp -rp username@remoteIP:/path/filename /path
```



通过scp命令，便可以在本地与服务器之间自由地传输文件。将项目相关的文件全部发送至云服务器即可。



## 在服务器配置python环境

为了方便管理项目，需要先在服务器创建一个独立的python环境。我这里使用`virtualenv`。

### 安装virtualenv

直接使用`pip`工具安装即可。

```shell
pip install virtualenv
```



### 创建新的python环境

通过virtualenv创建的环境将独立地存在于指定的一个文件夹中。

我需要新建一个python3.7的环境，因此，cd到目标目录下，执行如下命令：


```shell
virtualenv TEST --python=python3.7
```

执行完毕，就会在当前目录下出现一个TEST文件夹，里面存放着这整个环境。



### 安装项目依赖的包

由于我的项目依赖的包全部可以从pip安装，因此只需要先在本地生成requirements.txt，然后在服务器上导入，安装十分方便。



生成本地包环境至requirements.txt文件：

```shell
pip freeze > requirements.txt
```

根据requirements.txt文件进行包安装：

```shell
pip install -r requirements.txt
```



先在本地环境中运行生成requirements.txt文件，然后将requirements.txt上传至服务器，最后在刚刚使用virtualenv创建的python环境下进行包安装，即可自动下载安装项目所依赖的包。如此，完美迁移项目运行环境。



## 在服务器上配置MySQL

### 安装MySQL

我这里直接使用 `apt install mysql-server` 在服务器上安装MySQL。注意这个命令默认安装的是MySQL 5.7，而我本地使用的是MySQL 8.0。我在服务器上配置好后才发现这个问题，不过由于程序仍然可以运行，就没有再改。之后会考虑重新安装并配置MySQL 8.0。



### 设置密码

MySQL 5.7的安装过程中没有要求输入root密码，但安装后登录mysql时又要求输入密码，这是MySQL 5.7的一个坑点。在第一次登录前需要使用 `mysqladmin` 命令设置root密码（例如设置密码为123456）：

```sh
mysqladmin -u root password 123456
```



### 迁移本地MySQL数据库至服务器

迁移数据库需要三个步骤：

1、使用 `mysqldump` 命令导出本地数据库的全部数据至一个.sql文件。

```shell
mysqldump -u root -p db_name > C:\path\filename.sql
```

执行命令，输入密码后即可在相应路径下找到filename.sql文件。



2、创建一个新的数据库。

登录到服务器上的MySQL数据库root账户，用 `CREATE DATABASE db_name;` 创建名为db_name的数据库。



3、将.sql文件发送到服务器上并导入db_name数据库。

仍然使用scp命令发送至服务器。导入数据库的命令如下：

```shell
mysql -u root -p db_name < C:\path\filename.sql
```

输入密码后，数据库导入成功。



## 在服务器上长时间运行程序

为了让程序不会在我们与服务器断开连接后自动停止，需要让程序在后台运行。可以选择nohup，不过我这里使用Linux上强大的终端复用工具tmux。

### tmux 简介

tmux 这一名字来源于终端（terminal）复用器（muxer），它可以将一个终端会话分成多个会话。与nohup不同，tmux不仅仅在后台创造一个进程来运行指定命令，而是创造了一个进程来运行终端会话，并让命令在此终端中运行。这个会话可以被接入和断开，并且在断开后仍然保持运行，直到会话被终止。

### tmux 简单使用

使用下面的命令即可创造一个名为session-name的会话：

```shell
tmux new -s session-name
```

管理终端会话的相关命令如下：

```shell
tmux ls  # 显示当前所有的会话

tmux a  # 接入第一个可用的会话
tmux a -t session-name  # 接入名为session-name的会话

tmux detach  # 断开当前接入的会话（会话仍然运行）

tmux kill-session -t session-name  # 杀死名为session-name的会话（会话终止）
```

如果想要在会话进程阻塞的情况下断开会话，可以先按下 Ctrl+b，然后按 d 即可断开连接。



使用 tmux 创建一个新的会话，并在这个会话中运行需要部署的python程序，然后断开连接，服务便可以一直运行下去。



# 后续配置

至此，项目已经成功部署到云服务器上。为了后续维护方便，我又进行了一些配置。

## MySQL开启远程访问

默认情况下，MySQL数据库至可以在本地访问，无法远程访问。为了便于管理服务器上的数据，我开启了远程访问的功能。

### 打开3306端口

首先打开位于/etc/mysql/mysql.conf.d/目录下的mysqld.cnf，然后用#号注释掉bind-address = 127.0.0.1那一行，从而关闭127.0.0.1对3306端口的占用。

![](/img/8/1.png)

在使用 `service mysql restart` 重启mysql服务后，3306就不再被占用。



### 给MySQL添加授权远程访问的账户

登录mysql，然后执行如下命令即可添加一个可以由所有IP（'%'代表所有IP，也可以指定）远程访问的root账户：

```mysql
grant all privileges on *.* TO 'root'@'%' identified by '密码' with grant option;
flush privileges;
```

执行过后，可以打开mysql数据库下的user表中确认：

```mysql
use mysql;
select host, user from user;
```

如果有host值为%、user值为root的一行，则说明添加成功。如此便可以远程登录mysql。



# 参考资料



[pycharm安装了很多第三方库能不能直接导出到第二台电脑,不然换台电脑又是下载半天必用的库? - 程序员小贤的回答 - 知乎](https://www.zhihu.com/question/351415307/answer/862575956)

[Linux下使用tmux打造更强大的终端](https://yq.aliyun.com/articles/187420)

[在服务器上长时间运行程序的一些基本命令](https://blog.csdn.net/MAOJG/article/details/79018764)

[mysql远程登陆](https://www.cnblogs.com/young233/p/10829000.html)

[MySQL在腾讯云中设置开启3306端口](https://blog.csdn.net/ding_312/article/details/81023483)

[如何使用DataGrip导出整个数据库到一个.sql文件](https://blog.csdn.net/Session_XQQ/article/details/78998798)