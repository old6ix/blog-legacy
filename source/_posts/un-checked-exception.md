---
title: Java中的checked与unchecked异常
date: 2021-07-02
tags:
 - 软件构造
 - Java
---

在Java中，有些异常需要被catch或throws，否则编译不通过；有些异常即使不管也能通过编译，却会在运行时被抛出。前者被称为Checked Exception，后者被称为Unchecked Exception。

<!-- more -->

错误分为两类：内部错误与外部错误。对于内部错误，程序员通常无能为力，一旦发生，想办法让程序优雅的结束；异常则是由程序自身导致的问题，可以捕获、可以处理。

在Java中，异常类的继承关系如下：

{% asset_img exceptions.png 异常类继承树 %}

图中红圈标出的都是Unchecked Exception，即无法处理的内部错误；其余的都是需要被显式处理的异常。

异常：程 序执行中的非正常事件，程序无法再按预想的流程执行。出错的方法将错误信息传递给上层调用者，并报告“案发现场”的信息，它是return之外的第二种退出途径。若找不到异常处理程序，整个系统完全退出。

二者的详细对比如下：

{% asset_img vs.png Checked vs Unchecked %}
