---
title: 可变性与不可变性
date: 2021-06-29
tags:
 - 软件构造
---

可变类型的对象：提供了可改变其内部数据的值的操作。

不变数据类型： 其操作不改变内部值，而是构造新的对象。

<!-- more -->

抽象数据类型的操作可以分为如下4种：

- 构造器 Creator
- 生产器 Producer
- 观察器 Observer
- 变值器 Mutator

没有Mutator的类即被称为不可变类。

在这4类操作中，构造器除了可以实现为构造方法，还能实现为静态函数，这一类构造器也被称为工厂方法。

变值器通常返回void。如果返回值为void，则必然意味着它改变了对象的某些内部状态。同时，变值器也可能返回非空类型。比如Java中的Set.add方法和Map.put方法。

以Java中的List为例，它包括如下方法：

{% asset_img 1.png List的方法 %}

其中add、addAll为有返回值的Mutator方法，clear为没有返回值的Mutator方法，contains与containsAll为Observer方法。

需要注意，可变与不可变是相对于客户端而言的，并不是类内部。因此如果需要，Immutable类内部也可以发送改变。这种改变被称为“有益的可变性”。例如如下类：

{% asset_img 2.png 有益的可变性 %}
