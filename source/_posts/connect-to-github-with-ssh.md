---
title: 利用SSH连接GitHub及JetBrains IDE的相应配置
date: 2021-05-06
categories:
 - Git
tags:
 - GitHub
 - JetBrains
 - Git
 - SSH
 - 软件构造
---

本文首先配置Git以在Git Bash上实现通过SSH连接GitHub，然后配置IntelliJ IDEA使其内置的优秀Git工具可以通过SSH连接并操作Git仓库。

环境为Windows 10；Git版本2.31.1.windows.1；JetBrains IDE以IntelliJ IDEA为例，版本2021.1.1。

<!-- more -->

# 通过SSH连接GitHub

[GitHub Docs上的这一节](https://docs.github.com/cn/github/authenticating-to-github/connecting-to-github-with-ssh)已经说得比较详尽了，这里我结合个人的理解赘述一下。有部分可能遇到而我没有遇到的问题没有记录，如遇到可查阅官方文档。

## 为何不用用户名+密码？

使用ssh无需输入和传输用户名和密码，更加方便而且安全。

## 生成新的SSH秘钥

1. 打开Git Bash或其它任何命令行；

2. 输入以下命令（将引号中的邮箱替换为的GitHub邮箱）：

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

   `-t ed25519`表示使用Ed25519算法生成秘钥；`-C`表示注释。事实上这里的邮箱换成任意内容均可生成ssh密钥对，但GitHub会根据注释判断秘钥的拥有者，所以在此场景下需要以邮箱作为注释。

3. 提示“Enter a file in which to save the key（输入要保存密钥的文件）”，输入你期望的文件名；

4. 提示“Enter passphrase (empty for no passphrase)”输入两次安全密码（passphrase）。这个密码的作用就是加上额外一层验证，只有同时拥有私钥和密码才能与公钥配对。不设置也可以通过。如果设置了安全密码，则在Git Bash中的每次操作都需要输入密码；在JetBrains IDE中经过后续配置，只需要再输入一次密码即可，无需每次都输入。

5. 在命令行所在目录下生成公钥（.pub后缀）和私钥（无后缀）文件。

## 部署SSH 密钥

得到密钥对后，需要将公钥上传至GitHub，本地Git配置好私钥，即可在每次push和pull时验证。

### 将公钥添加到GitHub

进入[GitHub主页](https://github.com)，单击右上角头像——Settings进入[设置页](https://github.com/settings)；在左侧列表中找到“SSH and GPG keys”并[进入](https://github.com/settings/keys)，单击右上角绿色的“New SSH key”按钮，进入下图所示[页面](https://github.com/settings/ssh/new)；Title处给公钥起个你喜欢的名字，用文本编辑器打开公钥文件并将内容粘贴至Key处。公钥应该是一个以“ssh-ed25519”开头、你的邮箱为结尾的一段文本，注意不要粘错。完成后单击“Add SSH key”添加公钥，完成。

{% asset_img add-new-ssh-key.png 新增SSH key页面 %}

### 将私钥添加到 ssh-agent

首先设置[在Git for Windows上自动启动ssh-agent](https://docs.github.com/cn/github/authenticating-to-github/working-with-ssh-key-passphrases#)，复制以下代码并将其粘贴到`~/.profile`文件中：

```bash
env=~/.ssh/agent.env

agent_load_env () { test -f "$env" && . "$env" >| /dev/null ; }

agent_start () {
    (umask 077; ssh-agent >| "$env")
    . env=~/.ssh/agent.env

agent_load_env () { test -f "$env" && . "$env" >| /dev/null ; }

agent_start () {
    (umask 077; ssh-agent >| "$env")
    . "$env" >| /dev/null ; }

agent_load_env

# agent_run_state: 0=agent running w/ key; 1=agent w/o key; 2= agent not running
agent_run_state=$(ssh-add -l >| /dev/null 2>&1; echo $?)

if [ ! "$SSH_AUTH_SOCK" ] || [ $agent_run_state = 2 ]; then
    agent_start
    ssh-add
elif [ "$SSH_AUTH_SOCK" ] && [ $agent_run_state = 1 ]; then
    ssh-add
fi

unset env

if [ ! "$SSH_AUTH_SOCK" ] || [ $agent_run_state = 2 ]; then
    agent_start
    ssh-add
elif [ "$SSH_AUTH_SOCK" ] && [ $agent_run_state = 1 ]; then
    ssh-add
fi

unset env
```

再次启动Git Bash，ssh-agent将会自动启动。如果遇到报错“unexpected end of file”，则是因为文件格式不同，需要把格式改为unix。在vim下输入命令`set ff=unix`，保存，再次启动运行正常。

接下来将密钥添加到ssh-agent，输入`ssh-add ~/path/to/my_key`（填上私钥的路径），私钥也配置完成。

## 测试SSH连接

1. 打开Git Bash；
2. 输入`ssh -T git@github.com`；
3. 如设置了passphrase会提示输入；
4. 若验证成功，则会返回类似的欢迎信息：

> Hi jiabh! You've successfully authenticated, but GitHub does not provide shell access.

至此，通过SSH连接GitHub的配置已经大功告成了。

# 配置IntelliJ IDEA通过SSH操作GitHub仓库

尽管在Git Bash中已经可以正常使用，但我打开IntelliJ IDEA，发现在push时依然返回“Permission denied”的错误信息。在设置中反复寻找也没有发现设置项。经过查阅资料，我找到了不能直接使用的原因和一个可行的方法。原因将在文末给出。

## 解决方法

1. 用具有管理员权限的编辑器打开`C:\Program Files\Git\etc\ssh\ssh_config`文件；

2.  在文件底部加入如下配置：

   ```
   Host *your-gitlab-or-github-or-bitbucket-hostname*
   IdentityFile *your-ssh-rsa-privatekey-file-with-absolute-path*
   ```

例如：

```
Host github.com                          # GitHub域名
IdentityFile C:\Users\jiabh\.ssh\id_rsa  # 私钥文件的绝对路径
```

再次在IntelliJ IDEA中执行push动作，要求输入passphrase（还是那个密码），push成功。

## 产生原因

IntelliJ IDEA中的Git依赖于操作系统默认的命令行程序，而起初配置好的Git Bash并非Windows下的默认命令行，cmd才是。从这个角度看，解决方法有两种：一是在cmd下设置好ssh-agent，二是在Git Bash下启动IntelliJ IDEA。前者比较繁琐，后者日常使用不太方便，因此我没有考虑。

文中的方法是在[Stack Overflow的一个问答](https://stackoverflow.com/questions/38105563/intellij-idea-git-permission-denied-publickey)中找到的，其原理我不是很理解，设置多个Host和多个秘钥的方法我也没有进一步探索。如果日后有需要再做尝试。

不过相比继续探索，我更希望JetBrains早日解决这个问题。在官方IDEs Support中有几个人提问了这个问题，但官方的人员也只给出了原因，而没有给出解决方法。这种问题与JetBrains公司的产品实在不搭。

# 参考链接

## 通过SSH连接GitHub

[使用 SSH 连接到 GitHub](https://docs.github.com/cn/github/authenticating-to-github/connecting-to-github-with-ssh)

## 自启动ssh-agent时报错“unexpected end of file”

[syntax error: unexpected end of file完美解决方案](https://blog.csdn.net/weixin_44297303/article/details/102956879)

## IntelliJ IDEA无法使用SSH连接Git

[IntelliJ 2019.1.3 - Can't access git using SSH keys](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360004124959-IntelliJ-2019-1-3-Can-t-access-git-using-SSH-keys)

[IntelliJ IDEA git Permission denied (publickey)](https://stackoverflow.com/questions/38105563/intellij-idea-git-permission-denied-publickey)

[How to add SSH Private Key to Intellij for Git](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360007679880-How-to-add-SSH-Private-Key-to-Intellij-for-Git)

对本文没有帮助，但颇有意思的链接：

[如何配置cmd的“启动前执行”](https://stackoverflow.com/questions/17404165/how-to-run-a-command-on-command-prompt-startup-in-windows)