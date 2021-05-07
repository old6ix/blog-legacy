---
title: 什么是停机问题？
date: 2019-1-18
author: jiabh
categories:
 - 高中
tags:
 - 计算理论
---

疲于学习，好久没有更了。海淀期末刚刚结束，多一点闲暇时间，就来写一写。这篇我来浅淡一个逻辑学的问题：**停机问题（Halting Problem）**。

第一次看到这个词，是我在高二时了解图灵机时偶然知道的，感觉很有趣，又不那么难懂，故在此分享一下。下面先来说下这个问题的内容。

<!-- more -->

# 什么是停机问题？
停机问题是指是否存在一个通用的程序H，输入一个程序P，H能够在有限的时间内输出给定的程序P是否会陷入死循环，即是否能在有限时间内运行结束。

# 证明过程
先说答案：不存在。

证明：

假设有一个程序H(Halting简写)能够解决停机问题。即输入一个程序P(Program简写)，H能在有限时间内返回程序P是否能停机，能停机返回True，不能返回False。伪代码如下：

```python
def H(P):
     if P能停机:
         return True
     else:
         return False
```

那么我们就也能编写出一个这样的程序，命名为A(Anti简写)：输入一个程序P，A先调用H，如果H返回True，则进入死循环；如果返回False，则退出程序。即A会做出与H的判定相反的做法。伪代码如下：

```python
def A(P):
     if H(P):
         while True:
             pass
     else:
         return
```

由于程序自身也是数据，所以我们可以将程序A输入程序A，即调用A(A)。程序A开始执行。首先程序A调用H(A)，如果H(A)返回True，那么A进入死循环，矛盾；如果H(A)返回False，那么A退出程序，依然矛盾。

这种情况下，H总是会给出与正确答案相反的答案，说明H不能总是返回正确答案。H不存在，停机问题无解。

-----

此问题由[Alan Turing](https://baike.baidu.com/item/%E8%89%BE%E4%BC%A6%C2%B7%E9%BA%A6%E5%B8%AD%E6%A3%AE%C2%B7%E5%9B%BE%E7%81%B5)在1963年证明，这个问题同时也指出了图灵机不是任何问题都能解决的。证明过程很精彩，用自己否定了自己，充满了哲学的意味。Paper链接如下（当然我没看过:flushed:）。

[On Computability Numbers, with an Application to the Entscheidungsproblem.](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)

这类不存在一个正确的算法来解决的问题被成为**不可解问题（Undecidable Decision Problem）**。同样的问题还有[**倍立方体问题**](https://baike.baidu.com/item/%E5%80%8D%E7%AB%8B%E6%96%B9%E4%BD%93%E9%97%AE%E9%A2%98)，此问题的证明方法感兴趣的可以点击前面的超链接看一看，在此不做赘述。

结尾懒得想，不写了:stuck_out_tongue:。Bye!

2018/1/18 14:13