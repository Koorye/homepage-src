---
title: C语言在控制台上实现鼠标操作的方法
date: 2020.04.20
tags: [C]
categories: 其他
description: 在制作面向用户系统时，我们往往需要设置除输入参数外更为灵活的操作方式，例如鼠标点击、按键按下（无阻塞输入）等；同时，我们需要制作更为精美的UI而不是简陋的黑白界面。然而，纯C语言本身并不提供这些函数，为实现这些操作，我们需要调用windows.h库中的函数（当然大前提是用户使用windows系统）。
---

在制作面向用户系统时，我们往往需要设置除输入参数外更为灵活的操作方式，例如鼠标点击、按键按下（无阻塞输入）等；同时，我们需要制作更为精美的`UI`而不是简陋的黑白界面。然而，纯C语言本身并不提供这些函数，为实现这些操作，我们需要调用` windows.h `库中的函数（当然大前提是用户使用` windows `系统）。

为实现鼠标操作，我们所涉及到的有关函数有：
# 了解windows库函数
1. ` GetCursorPos(POINT* point); ` 获得鼠标在桌面中的坐标（左上角为原点），其中` POINT `是一个结构体类，包含x和y两个成员以表示横坐标和纵坐标。
2. ` GetWindowRect(HWND hwnd,LPRECT* lprect); `获得指定窗口的坐标信息（包括顶部和底部的横坐标，左端和右端的纵坐标），其中` HWND `是一个句柄类（句柄概念在后文中再说明），` LPRECT `是一个结构体类，包含` top `,` bottom `,` left `,` right `分别表示顶部、底部、左端、右端的坐标。
3. ` GetAsyncKeyState(int vKey); `判断指定按键是否按下，` vKey `为按键对应的` ASCII `值，如图所示。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d6db2ac9858a4d470b2ecfb17345e533.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6b28887d4740f5ccf1560b4dfab111e8.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a60c2b66aa66ca25c056ecef2d8013da.png)
4. ` FindWindow(LPCSTR lpClassName,LPCSTR lpWindowName); `返回指定窗口的句柄，` lpClassName `指向一个用于指定类名的字符串，若为NULL则查找所有窗口；` lpWindowName `指定一个用于查找窗口名。

接下来还有一些`windows.h`库中的特殊函数：

1. ` SetConsoleTitle(LPCSTR lpcstr); `为程序设定标题。
2. ` Sleep(int int); `休眠，即暂停程序` int `秒后继续运行。

# 了解句柄
接下来说明句柄的概念：句柄是一种特殊指针（另一种说法为一种整型），用于标识应用程序中的对象（如窗口，按钮，图标等）。当前系统中每一个进程，每一个控件，都根据其虚拟内存地址拥有其对应的唯一句柄。于是，我们可以通过一个句柄找到对应的对象来指定操作。

知道以上函数后，我们就可以正式编写程序了。

# 实现思路与代码
思路：通过一个循环反复检测鼠标是否按下，如果按下，则检测当前鼠标光标在控制台中所对应的坐标，通过对控制台中` UI `的坐标进行对应来判断操作。值得一提的是，`windows.h `库中没有直接返回鼠标光标在控制台窗口中坐标的函数，于是我们通过得到鼠标光标在桌面中的坐标和控制台窗口在桌面中的坐标，来计算鼠标光标与控制台窗口的相对位置。

```c
#include<stdio.h>
#include<windows.h>

void MouseOpreate(int *x,int *y);
int main(){
    ...
	SetConsoleTitle("憨憨");//设定窗口标题
    ...
    int x,y;
    MouseOpreate(&x,&y);
    if((0<=x && x<=100)&&(0<=y && y<=20)){//通过UI在程序中对应的坐标指定操作
        ...
    }else if(...){
        ...
    }
}
```



```c
void MouseOpreate(int *x,int *y){
    POINT *ptrpos;//声明POINT结构体类存储鼠标坐标
    LPRECT rect;//声明LPRECT结构体指针存储窗口坐标信息
    HWND hwnd=FindWindow(NULL,"憨憨");//根据上述设定的标题查找句柄，第一个形参设为NULL意味着查找系统中所有句柄
    ptrpos=(POINT*)malloc(sizeof(POINT)+64);
    rect=(LPRECT*)malloc(sizeof(LPRECT)+64);//为结构体指针分配内存空间
    for(;;){
        Sleep(500);//通过休眠指定循环周期为500毫秒
        if(GetAsyncKeyState(VK_LBUTTON)){//如果鼠标左键按下，其中VK_LBUTTON是windows.h库中定义的宏，对应鼠标左键对应的ASCII值
            GetWindowRect(hwnd,rect);//根据查找标题"憨憨"得到的句柄返回对于窗口的坐标并存储在rect中
            GetCursorPos(ptrpos);//返回鼠标对应的坐标并存储在ptrpos中
            *x=ptrpos->x-rect->left;//鼠标横坐标-控制台窗口左端横坐标得到鼠标相对控制台窗口的横坐标
            *y=ptrpos->y-rect->top;//同理得到鼠标相对的纵坐标
            break;//得到坐标后跳出循环
        }
    }

```

接下来，我们只需要在检测位置画上对应的`UI`，就可以完成判定了。