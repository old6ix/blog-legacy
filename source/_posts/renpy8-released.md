---
title: Ren'Py 8.0.0 发布
date: 2022-07-03
categories:
 - VN Engine
tags:
 - Ren'Py
 - News
 - Python
---

{% asset_img renpy8_lores.png Ren'Py 8 Release Logo %}

2022年6月26日，知名视觉小说引擎[Ren'Py](https://www.renpy.org/)发布大版本更新8.0.0。在发布之前，我很期待这个版本，其中最吸引我的更改是Python版本由2升3，终于抛弃早已停止更新的2.x版本。下面对几个重大更新进行整理，全部更改可见官方[Changelog](https://www.renpy.org/doc/html/changelog.html#renpy-8-0-0)。

<!-- more -->

# Python 3支持

Ren'Py 7.x及之前均运行在Python 2上；自8.0.0开始，[Ren'Py转至Python 3](https://www.renpy.org/doc/html/changelog.html#python-3-support-ren-py-8-0)。特别地，Ren'Py 8.0使用Python 3.9.10。这意味着Ren'Py项目将可以使用标注（annotation）、格式化字符串常量（f-string）等重要功能，为视觉小说的实现带来很多便利。

# 支持的平台更改

- 新增64-bit ARM Linux支持

- 不再支持32-bit x86 Windows和Linux

官方称这一更新是由于32-bit x86已经过时。对此我有相同的感觉，但没有发现数据做支持，也就无从探究这一变更对VN开发的影响。

# 暂时移除Web平台的支持

Ren'Py 8.0暂时移除对Web平台的支持，将在近几个版本恢复。

# 7.x、8.x并存

Ren'Py 8是一个大版本更新，因此Ren'Py将采用8.0和7.5并行开发的方式进行过渡。Tom称这是为了等待已有游戏完成开发，新项目全部建议基于Ren'Py 8开发。

# 8.x版本号与Python版本号的关系

Ren'Py 8.0.0开始，Python版本将随Ren'Py子版本号的更新而更新，不过似乎没有明确表示子版本号和python版本的关系。但可以肯定的是，Ren'Py底层的Python将不再像以前那样一成不变，而将跟随Python更新的脚步。（这一部分是几天前从Lemma Soft Forums上看到的，但找不到出处了）

# 参考链接

[Ren'Py 8.0.0 "Heck Freezes Over"](https://www.renpy.org/release/8.0.0)

[Ren'Py 8.0.0 Changelog](https://www.renpy.org/doc/html/changelog.html#renpy-8-0-0)
