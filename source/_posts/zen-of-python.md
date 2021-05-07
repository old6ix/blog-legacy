---
title: 什么是“Python之禅”？
date: 2018-09-16 21:08
author: jiabh
categories:
 - 高中
tags:
 - Python
---

第一次写博客，还没想好写点儿什么，就来讲讲这个吧。

<!--more-->

****
# 什么是“Python之禅”？

Python之禅（The Zen of Python）是由Tim Peters提出的20行Python设计哲学，其中的19行在PEP20被加入到Python中。打开Python解释器，输入：

```python
>>> import this
```

就会输出如下的文字：
>Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than \*right\* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!

翻译如下（来源找不到了）：

>优美胜于丑陋（Python 以编写优美的代码为目标）
明了胜于晦涩（优美的代码应当是明了的，命名规范，风格相似）
简洁胜于复杂（优美的代码应当是简洁的，不要有复杂的内部实现）
复杂胜于凌乱（如果复杂不可避免，那代码间也不能有难懂的关系，要保持接口简洁）
扁平胜于嵌套（优美的代码应当是扁平的，不能有太多的嵌套）
间隔胜于紧凑（优美的代码有适当的间隔，不要奢望一行代码解决问题）
可读性很重要（优美的代码是可读的）
即便假借特例的实用性之名，也不可违背这些规则（这些规则至高无上）
不要包容所有错误，除非你确定需要这样做（精准地捕获异常，不写 except:pass 风格的代码）
当存在多种可能，不要尝试去猜测
而是尽量找一种，最好是唯一一种明显的解决方案（如果不确定，就用穷举法）
虽然这并不容易，因为你不是 Python 之父（这里的 Dutch 是指 Guido ）
做也许好过不做，但不假思索就动手还不如不做（动手之前要细思量）
如果你无法向人描述你的方案，那肯定不是一个好方案；反之亦然（方案测评标准）
命名空间是一种绝妙的理念，我们应当多加利用（倡导与号召）

让我们再来看看它的源代码：

```python
s = """Gur Mra bs Clguba, ol Gvz Crgref

Ornhgvshy vf orggre guna htyl.
Rkcyvpvg vf orggre guna vzcyvpvg.
Fvzcyr vf orggre guna pbzcyrk.
Pbzcyrk vf orggre guna pbzcyvpngrq.
Syng vf orggre guna arfgrq.
Fcnefr vf orggre guna qrafr.
Ernqnovyvgl pbhagf.
Fcrpvny pnfrf nera'g fcrpvny rabhtu gb oernx gur ehyrf.
Nygubhtu cenpgvpnyvgl orngf chevgl.
Reebef fubhyq arire cnff fvyragyl.
Hayrff rkcyvpvgyl fvyraprq.
Va gur snpr bs nzovthvgl, ershfr gur grzcgngvba gb thrff.
Gurer fubhyq or bar-- naq cersrenoyl bayl bar --boivbhf jnl gb qb vg.
Nygubhtu gung jnl znl abg or boivbhf ng svefg hayrff lbh'er Qhgpu.
Abj vf orggre guna arire.
Nygubhtu arire vf bsgra orggre guna *evtug* abj.
Vs gur vzcyrzragngvba vf uneq gb rkcynva, vg'f n onq vqrn.
Vs gur vzcyrzragngvba vf rnfl gb rkcynva, vg znl or n tbbq vqrn.
Anzrfcnprf ner bar ubaxvat terng vqrn -- yrg'f qb zber bs gubfr!"""

d = {}
for c in (65, 97):
    for i in range(26):
        d[chr(i+c)] = chr((i+13) % 26 + c)

print("".join([d.get(c, c) for c in s]))
```

我想所有人看了都会说，**这是什么玩意儿啊！**
这似乎是Tim Peters向我们举出的典型反例……

那么，这坨东西是怎么变成这19句经典的Python哲学的呢？

其实，这背后用的是恺撒加密的一种：ROT-13加密。

****
# 什么是恺撒加密？

凯撒加密是密码学中最为简单的加密技术，其原理如下：

![](/img/1/1.1.png)

如图，在加密过程中，对于明文中的每一个字符，都转换成它偏移4个单位后对应的字符，例如A会转换成E。对于后面的XYZ等字符，则从A开始继续转换，例如Z会转换成D。对明文中所有字符进行转换，即可得到密文。其中“4”被称为偏移量。对于任意一段密文，只需要得到对应的偏移量，即可得到明文。

至于ROT-13，其实就是偏移量取13时的恺撒加密。可是，为什么它这么特殊，要单拿出来？

其实，ROT-13最初被1980年代早期的net.jokes新闻群组所使用，它用于隐藏某些可能侮辱到特定读者的笑话、隐晦某个谜题的答案或八卦性的内容。因为这个算法两次加密即可得到明文，加密与解密算法相同，比较方便，他们就选择了这个。正因为这个特性，出现了如“2ROT-13”、“ROT-26”这样调侃的术语。

我们可以看出，这种加密方式非常容易被破解，因此如今它已经退出密码的舞台，只能作为最经典的加密方式之一供我们学习。

****
# 结语

正是Python这样优雅的设计理念，使得Python代码能够如此简洁，使得Python程序的编写效率远高于大多数语言，同时也使得Python成为最适合入门学习的编程语言之一。这19条理念，是每一个Pythoner都应该遵守的设计原则。


2018/9/16 22:44