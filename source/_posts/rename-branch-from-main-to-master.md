---
title: 将GitHub默认分支名由main更换回master
date: 2021-05-19
categories:
 - Git
tags:
 - GitHub
 - Git
 - 软件构造
---

完成软件构造课程的实验时，我在指导手册中看到如下的一段话：

>提交到 GitHub 仓库后，TA 会读取你的 master 分支。如果你在其他分支上开发，提交前请务必将最新修改合并至 master 分支。如果实验要求你设置其他分支，也请务必将各分支指向正确的 commit，TA 根据分支名来获取你的代码。

然而，GitHub在2020年宣布开始逐步将默认分支名由 `master` 更改为 `main`，该项目的官方仓库如下：[Renaming the default branch from master](https://github.com/github/renaming)。现在，在GitHub上创建的新仓库的默认分支名称为 `main`。遂向老师确认是否需要将默认分支修改回 `master`，得到了肯定的答案（[Piazza问题链接](https://piazza.com/class/kk0jwlevju3nd?cid=9)）。

本文记录将默认分支由 `main` 分支修改为 `master` 的全过程。

<!--more-->

首先展示一下我当前仓库的分支，执行命令：

```bash
git branch -a  # -a表示列出所有分支，包括本地分支和远程分支
```

{% asset_img original-branches.png 列出所有分支 %}

即本地和远程仓库都只有一个main分支。此时我已经进行了部分commit和push，故不能简单地在GitHub页面上更改。总地来说，需要进行以下几步：

1. 将本地的 `main` 分支更名为 `master`

2. 将本地的 `master` 分支push到远程仓库

3. 在GitHub上将默认分支修改为 `master`

4. 删除远程的 `main` 分支

# 将本地的 `main` 分支更名为 `master`

在Git命令中，修改分支名的操作为：

```bash
git branch -m old_name new_name
```

因此，执行一条Git命令即可：

```bash
git branch -m main master
```

{% asset_img rename-local-branch.png 更名本地分支 %}

# 将本地的 `master` 分支push到远程仓库

```bash
git push origin master
```

push结束后，再次查看分支，可以看到远程仓库已经有两个分支：`main` 和 `master`：

{% asset_img two-remote-branches.png 远程仓库的两个分支 %}

打开GitHub仓库页，从红框所示部分也可以看到：

{% asset_img two-remote-branches-on-web.png 远程仓库的两个分支 %}

# 在GitHub上将默认分支修改为 `master`

在仓库页单击Settings -> Branches，在Default branch一栏将会看到当前的默认分支，即 `main` 分支。如下图所示，单击右侧的 ⇌ 按钮，选择默认分支为 `master` 分支后单击Update，就在GitHub上完成了默认分支的修改。

{% asset_img switch-default-branch-on-gh.png 在GitHub上修改仓库的默认分支 %}

# 删除远程的 `main` 分支

此时 `master` 分支已经设置完毕，但远程还有一个没用的 `main` 分支需要删除。执行push操作，删除远程的 `main` 分支：

```bash
git push --delete origin main
```

再次列出分支，发现远程的 `main` 分支已消失，同样在GitHub上也可以看到只剩下了一个 `master` 分支。

{% asset_img rename-finished.png 远程仓库只剩下了一个master分支 %}

{% asset_img only-master-on-gh.png 远程仓库只剩下了一个master分支 %}

至此，本地和远程仓库的默认分支均由 `main` 更换为  `master` 。

# 参考链接

[git修改分支名称 - 简书](https://www.jianshu.com/p/cc740394faf5)