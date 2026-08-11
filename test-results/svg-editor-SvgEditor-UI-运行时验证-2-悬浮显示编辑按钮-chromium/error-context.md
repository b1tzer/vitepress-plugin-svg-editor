# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: svg-editor.spec.ts >> SvgEditor UI 运行时验证 >> 2. 悬浮显示编辑按钮
- Location: tests/svg-editor.spec.ts:31:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.svg-container').nth(1).locator('.svg-edit-btn')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.svg-container').nth(1).locator('.svg-edit-btn')

```

```yaml
- link "Skip to content":
  - /url: "#VPContent"
- banner:
  - link "Java World":
    - /url: /java-world/
  - button "搜索": 搜索文档 Ctrl K
  - navigation "Main Navigation":
    - text: Main Navigation
    - link "首页":
      - /url: /java-world/
    - button "目录"
    - link "GitHub":
      - /url: https://github.com/b1tzer/java-world
  - switch "Switch to dark theme"
  - link "github":
    - /url: https://github.com/b1tzer/java-world
- complementary:
  - navigation "Sidebar Navigation":
    - text: Sidebar Navigation
    - button "第一卷 Java 语言 toggle section":
      - heading "第一卷 Java 语言" [level=2]
      - button "toggle section"
    - link "类型系统":
      - /url: /java-world/01-java-language/chapter-01-type-system.html
      - paragraph: 类型系统
    - link "面向对象":
      - /url: /java-world/01-java-language/chapter-02-oop.html
      - paragraph: 面向对象
    - link "泛型":
      - /url: /java-world/01-java-language/chapter-03-generics.html
      - paragraph: 泛型
    - link "注解与 Lambda":
      - /url: /java-world/01-java-language/chapter-04-annotation-lambda.html
      - paragraph: 注解与 Lambda
    - button "第二卷 JVM Runtime toggle section":
      - heading "第二卷 JVM Runtime" [level=2]
      - button "toggle section"
    - link "字节码与类加载":
      - /url: /java-world/02-jvm-runtime/chapter-01-bytecode-classloading.html
      - paragraph: 字节码与类加载
    - link "JVM 运行时数据区":
      - /url: /java-world/02-jvm-runtime/chapter-02-memory-model.html
      - paragraph: JVM 运行时数据区
    - link "对象模型":
      - /url: /java-world/02-jvm-runtime/chapter-03-object-model.html
      - paragraph: 对象模型
    - link "垃圾回收":
      - /url: /java-world/02-jvm-runtime/chapter-04-gc.html
      - paragraph: 垃圾回收
    - link "JIT 编译":
      - /url: /java-world/02-jvm-runtime/chapter-05-jit.html
      - paragraph: JIT 编译
    - link "线上排查与诊断":
      - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics.html
      - paragraph: 线上排查与诊断
    - link "案例集（一）：CPU 飙升与内存泄漏":
      - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part1.html
      - paragraph: 案例集（一）：CPU 飙升与内存泄漏
    - link "案例集（二）：GC 调优与综合诊断":
      - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part2.html
      - paragraph: 案例集（二）：GC 调优与综合诊断
    - link "案例集（三）：低内存低 CPU 下的 GC 疑难杂症":
      - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part3.html
      - paragraph: 案例集（三）：低内存低 CPU 下的 GC 疑难杂症
    - link "案例集（四）：堆正常但服务崩了——TCP 层与堆外内存":
      - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part4.html
      - paragraph: 案例集（四）：堆正常但服务崩了——TCP 层与堆外内存
    - button "第三卷 Java 并发 toggle section":
      - heading "第三卷 Java 并发" [level=2]
      - button "toggle section"
    - link "并发的本质":
      - /url: /java-world/03-java-concurrency/chapter-01-why-concurrency.html
      - paragraph: 并发的本质
    - link "线程：Java 的执行单元":
      - /url: /java-world/03-java-concurrency/chapter-02-thread-model.html
      - paragraph: 线程：Java 的执行单元
    - link "线程封闭：ThreadLocal":
      - /url: /java-world/03-java-concurrency/chapter-03-threadlocal.html
      - paragraph: 线程封闭：ThreadLocal
    - link "Java 内存模型（JMM）":
      - /url: /java-world/03-java-concurrency/chapter-04-jmm.html
      - paragraph: Java 内存模型（JMM）
    - link "volatile":
      - /url: /java-world/03-java-concurrency/chapter-05-volatile.html
      - paragraph: volatile
    - link "synchronized":
      - /url: /java-world/03-java-concurrency/chapter-06-synchronized.html
      - paragraph: synchronized
    - link "CAS 与原子类":
      - /url: /java-world/03-java-concurrency/chapter-07-cas-atomic.html
      - paragraph: CAS 与原子类
    - link "LockSupport 与 AQS":
      - /url: /java-world/03-java-concurrency/chapter-08-locksupport-aqs.html
      - paragraph: LockSupport 与 AQS
    - link "并发集合":
      - /url: /java-world/03-java-concurrency/chapter-09-concurrent-collections.html
      - paragraph: 并发集合
    - link "线程池":
      - /url: /java-world/03-java-concurrency/chapter-10-thread-pool.html
      - paragraph: 线程池
    - link "异步编程":
      - /url: /java-world/03-java-concurrency/chapter-11-async-model.html
      - paragraph: 异步编程
    - link "虚拟线程与结构化并发":
      - /url: /java-world/03-java-concurrency/chapter-12-virtual-thread.html
      - paragraph: 虚拟线程与结构化并发
    - link "诊断与优化":
      - /url: /java-world/03-java-concurrency/chapter-13-diagnostics.html
      - paragraph: 诊断与优化
    - link "案例集（一）：死锁、线程池与并发集合":
      - /url: /java-world/03-java-concurrency/chapter-13-diagnostics-cases-part1.html
      - paragraph: 案例集（一）：死锁、线程池与并发集合
    - link "案例集（二）：虚拟线程与综合诊断":
      - /url: /java-world/03-java-concurrency/chapter-13-diagnostics-cases-part2.html
      - paragraph: 案例集（二）：虚拟线程与综合诊断
    - link "案例集（三）：静默死锁与无超时雪崩":
      - /url: /java-world/03-java-concurrency/chapter-13-diagnostics-cases-part3.html
      - paragraph: 案例集（三）：静默死锁与无超时雪崩
    - button "第四卷 网络与通信 toggle section":
      - heading "第四卷 网络与通信" [level=2]
      - button "toggle section"
    - link "网络通信基础":
      - /url: /java-world/04-java-network/chapter-01-network-basics.html
      - paragraph: 网络通信基础
    - link "TCP/IP":
      - /url: /java-world/04-java-network/chapter-02-tcp-ip.html
      - paragraph: TCP/IP
    - link "Socket 编程":
      - /url: /java-world/04-java-network/chapter-03-socket.html
      - paragraph: Socket 编程
    - link "Java NIO":
      - /url: /java-world/04-java-network/chapter-04-nio.html
      - paragraph: Java NIO
    - link "Netty":
      - /url: /java-world/04-java-network/chapter-05-netty.html
      - paragraph: Netty
    - link "HTTP 协议":
      - /url: /java-world/04-java-network/chapter-06-http.html
      - paragraph: HTTP 协议
    - link "Servlet 到 Spring MVC":
      - /url: /java-world/04-java-network/chapter-07-servlet-springmvc.html
      - paragraph: Servlet 到 Spring MVC
    - link "RPC 与微服务":
      - /url: /java-world/04-java-network/chapter-08-rpc.html
      - paragraph: RPC 与微服务
    - link "长连接与实时通信":
      - /url: /java-world/04-java-network/chapter-09-long-connection.html
      - paragraph: 长连接与实时通信
    - link "网络诊断":
      - /url: /java-world/04-java-network/chapter-10-network-diagnostics.html
      - paragraph: 网络诊断
    - button "第五卷 数据访问与持久化 toggle section":
      - heading "第五卷 数据访问与持久化" [level=2]
      - button "toggle section"
    - link "持久化思想":
      - /url: /java-world/05-java-data-access/chapter-01-persistence-thought.html
      - paragraph: 持久化思想
    - link "JDBC":
      - /url: /java-world/05-java-data-access/chapter-02-jdbc.html
      - paragraph: JDBC
    - link "MyBatis":
      - /url: /java-world/05-java-data-access/chapter-03-mybatis.html
      - paragraph: MyBatis
    - link "ORM 深入":
      - /url: /java-world/05-java-data-access/chapter-04-orm-deep.html
      - paragraph: ORM 深入
    - link "数据库核心原理":
      - /url: /java-world/05-java-data-access/chapter-05-db-principles.html
      - paragraph: 数据库核心原理
    - link "Spring 事务":
      - /url: /java-world/05-java-data-access/chapter-06-spring-transaction.html
      - paragraph: Spring 事务
    - link "性能优化":
      - /url: /java-world/05-java-data-access/chapter-07-performance.html
      - paragraph: 性能优化
    - button "第六卷 企业架构 toggle section":
      - heading "第六卷 企业架构" [level=2]
      - button "toggle section"
    - link "Spring 核心思想":
      - /url: /java-world/06-java-enterprise/chapter-01-spring-core.html
      - paragraph: Spring 核心思想
    - link "容器与 AOP":
      - /url: /java-world/06-java-enterprise/chapter-02-container-aop.html
      - paragraph: 容器与 AOP
    - link "Spring MVC":
      - /url: /java-world/06-java-enterprise/chapter-03-spring-mvc.html
      - paragraph: Spring MVC
    - link "Spring Boot":
      - /url: /java-world/06-java-enterprise/chapter-04-spring-boot.html
      - paragraph: Spring Boot
    - link "数据访问整合":
      - /url: /java-world/06-java-enterprise/chapter-05-data-integration.html
      - paragraph: 数据访问整合
    - link "微服务架构":
      - /url: /java-world/06-java-enterprise/chapter-06-microservices.html
      - paragraph: 微服务架构
    - link "分布式治理":
      - /url: /java-world/06-java-enterprise/chapter-07-governance.html
      - paragraph: 分布式治理
    - link "安全与部署":
      - /url: /java-world/06-java-enterprise/chapter-08-security-deploy.html
      - paragraph: 安全与部署
    - link "可观测性":
      - /url: /java-world/06-java-enterprise/chapter-09-observability.html
      - paragraph: 可观测性
    - button "第七卷 性能与架构 toggle section":
      - heading "第七卷 性能与架构" [level=2]
      - button "toggle section"
    - link "架构思想":
      - /url: /java-world/07-performance-architecture/chapter-01-architecture.html
      - paragraph: 架构思想
    - link "领域驱动设计":
      - /url: /java-world/07-performance-architecture/chapter-02-ddd.html
      - paragraph: 领域驱动设计
    - link "高并发设计":
      - /url: /java-world/07-performance-architecture/chapter-03-high-concurrency.html
      - paragraph: 高并发设计
    - link "高可用设计":
      - /url: /java-world/07-performance-architecture/chapter-04-high-availability.html
      - paragraph: 高可用设计
    - link "分布式系统":
      - /url: /java-world/07-performance-architecture/chapter-05-distributed.html
      - paragraph: 分布式系统
    - link "数据架构":
      - /url: /java-world/07-performance-architecture/chapter-06-data-architecture.html
      - paragraph: 数据架构
    - link "消息驱动":
      - /url: /java-world/07-performance-architecture/chapter-07-messaging.html
      - paragraph: 消息驱动
    - link "性能工程":
      - /url: /java-world/07-performance-architecture/chapter-08-performance.html
      - paragraph: 性能工程
    - link "架构案例":
      - /url: /java-world/07-performance-architecture/chapter-09-case-studies.html
      - paragraph: 架构案例
- navigation "本章目录":
  - heading "本章目录" [level=2]
  - list:
    - listitem:
      - link "1.1 Java 的设计目标":
        - /url: "#_1-1-java-的设计目标"
      - list:
        - listitem:
          - link "软件世界为什么需要 Java":
            - /url: "#软件世界为什么需要-java"
        - listitem:
          - link "Java 的核心设计目标":
            - /url: "#java-的核心设计目标"
        - listitem:
          - link "Java 不是为了追求最快":
            - /url: "#java-不是为了追求最快"
        - listitem:
          - link "一段 Java 代码是如何运行起来的":
            - /url: "#一段-java-代码是如何运行起来的"
        - listitem:
          - link "Java 世界的组成":
            - /url: "#java-世界的组成"
    - listitem:
      - link "1.2 基本类型与引用类型":
        - /url: "#_1-2-基本类型与引用类型"
      - list:
        - listitem:
          - link "类型体系总览":
            - /url: "#类型体系总览"
        - listitem:
          - link "Enum：编译器魔法加持的引用类型":
            - /url: "#enum-编译器魔法加持的引用类型"
        - listitem:
          - link "ordinal() 的陷阱":
            - /url: "#ordinal-的陷阱"
        - listitem:
          - link "EnumSet 与 EnumMap":
            - /url: "#enumset-与-enummap"
        - listitem:
          - link "基本类型：性能与抽象之间的取舍":
            - /url: "#基本类型-性能与抽象之间的取舍"
        - listitem:
          - link "引用类型：变量、引用与对象":
            - /url: "#引用类型-变量、引用与对象"
        - listitem:
          - link "自动装箱与拆箱":
            - /url: "#自动装箱与拆箱"
    - listitem:
      - link "1.3 对象模型：引用 vs 对象":
        - /url: "#_1-3-对象模型-引用-vs-对象"
      - list:
        - listitem:
          - link "对象在哪里":
            - /url: "#对象在哪里"
        - listitem:
          - link "null 的含义":
            - /url: "#null-的含义"
        - listitem:
          - link "对象的创建过程":
            - /url: "#对象的创建过程"
        - listitem:
          - link "对象的内存布局":
            - /url: "#对象的内存布局"
    - listitem:
      - link "1.4 equals / hashCode / identity":
        - /url: "#_1-4-equals-hashcode-identity"
      - list:
        - listitem:
          - link "三个层次":
            - /url: "#三个层次"
        - listitem:
          - link "== 运算符":
            - /url: "#运算符"
        - listitem:
          - link "equals() 方法":
            - /url: "#equals-方法"
        - listitem:
          - link "hashCode() 的契约":
            - /url: "#hashcode-的契约"
        - listitem:
          - link "Objects 工具类":
            - /url: "#objects-工具类"
    - listitem:
      - link "1.5 String 与不可变对象":
        - /url: "#_1-5-string-与不可变对象"
      - list:
        - listitem:
          - link "String 为什么是不可变的":
            - /url: "#string-为什么是不可变的"
        - listitem:
          - link "字符串拼接的陷阱":
            - /url: "#字符串拼接的陷阱"
        - listitem:
          - link "String.intern()":
            - /url: "#string-intern"
        - listitem:
          - link "其他不可变对象":
            - /url: "#其他不可变对象"
    - listitem:
      - link "1.6 类型转换与编译期检查":
        - /url: "#_1-6-类型转换与编译期检查"
      - list:
        - listitem:
          - link "基本类型转换":
            - /url: "#基本类型转换"
        - listitem:
          - link "引用类型转换":
            - /url: "#引用类型转换"
        - listitem:
          - link "编译器如何利用类型":
            - /url: "#编译器如何利用类型"
- main:
  - heading "第一章 Java 基础与类型系统 Permalink to \"第一章 Java 基础与类型系统\"" [level=1]:
    - text: 第一章 Java 基础与类型系统
    - link "Permalink to \"第一章 Java 基础与类型系统\"":
      - /url: "#第一章-java-基础与类型系统"
      - text: "#"
  - blockquote:
    - paragraph:
      - text: Java 为什么要分基本类型和引用类型？这不是语法问题——是性能和安全在打架。
      - code: int
      - text: 在栈上，4 字节，直接存值，一次 CPU 指令搞定加减乘除；
      - code: Integer
      - text: 在堆上，16 字节对象头 + 4 字节 value，多一次内存解引用。差的不只是能不能传
      - code: "null"
      - text: ——差的是一个数量级的访问开销和 GC 压力。选了
      - code: int
      - text: 还是
      - code: Integer
      - text: ，不只是"能不能存 null"的选择——是 CPU 周期和 GC 压力的选择。
  - separator
  - heading "1.1 Java 的设计目标 Permalink to \"1.1 Java 的设计目标\"" [level=2]:
    - text: 1.1 Java 的设计目标
    - link "Permalink to \"1.1 Java 的设计目标\"":
      - /url: "#_1-1-java-的设计目标"
      - text: "#"
  - paragraph: 每一种编程语言的诞生都是为了解决特定的问题。理解 Java，首先要理解它想解决什么。
  - heading "软件世界为什么需要 Java Permalink to \"软件世界为什么需要 Java\"" [level=3]:
    - text: 软件世界为什么需要 Java
    - link "Permalink to \"软件世界为什么需要 Java\"":
      - /url: "#软件世界为什么需要-java"
      - text: "#"
  - paragraph: 20 世纪 90 年代，C 和 C++ 统治着系统编程和应用开发。它们强大，但也带来了巨大的痛苦：
  - paragraph:
    - strong: C 的问题：
    - text: 手动管理内存。
    - code: malloc
    - text: 分配，
    - code: free
    - text: 释放，忘了就内存泄漏，释放两次就程序崩溃。指针可以指向任意内存地址，一个越界写入可能破坏整个程序的状态，而且错误往往在运行很久之后才暴露——调试成本极高。
  - paragraph:
    - strong: C++ 的问题：
    - text: 试图用面向对象来管理复杂性，但引入了新的复杂性。多重继承导致菱形继承问题，模板编译错误信息晦涩难懂，内存管理依然是手动的。C++ 给了开发者太多自由，也给了太多犯错的机会。
  - paragraph:
    - text: 更根本的问题是
    - strong: 跨平台
    - text: 。同一份 C/C++ 代码，在 Windows 上编译一次，在 Linux 上要重新编译，在 macOS 上又要编译一次。每个平台有不同的系统调用、不同的库、不同的二进制格式。对于需要在多种设备上运行的软件（想想 90 年代的机顶盒、嵌入式设备），这意味着巨大的移植成本。
  - paragraph: Java 的出现就是为了解决这些问题。
  - heading "Java 的核心设计目标 Permalink to \"Java 的核心设计目标\"" [level=3]:
    - text: Java 的核心设计目标
    - link "Permalink to \"Java 的核心设计目标\"":
      - /url: "#java-的核心设计目标"
      - text: "#"
  - paragraph: Java 的设计者 James Gosling 和他的团队在设计 Java（最初叫 Oak）时，确立了几个核心目标：
  - paragraph:
    - strong: 1. Write Once, Run Anywhere（一次编写，到处运行）
  - paragraph: 这是 Java 最重要的设计目标。解决方案是在源码和机器码之间插入一层抽象——字节码（Bytecode）和虚拟机（JVM）。源码编译成字节码，字节码在 JVM 上运行，JVM 屏蔽了底层操作系统的差异。
  - button "Copy Code"
  - text: text
  - code: C/C++：Source → Machine Code → 只能在特定平台运行 Java： Source → Bytecode → JVM → 任何平台都能运行
  - paragraph:
    - strong: 2. 自动内存管理（GC）
  - paragraph:
    - text: Java 不让开发者手动
    - code: free
    - text: 内存，而是由垃圾回收器（Garbage Collector）自动识别和回收不再使用的对象。这消除了一整类 bug：内存泄漏、野指针、Use-After-Free、Double Free。
  - paragraph: 代价是什么？GC 需要消耗 CPU 时间，偶尔会产生 Stop-The-World 停顿。但对于绝大多数应用来说，这个代价远小于手动内存管理带来的 bug 和调试成本。
  - paragraph:
    - strong: 3. 强类型系统
  - paragraph:
    - text: Java 是静态强类型语言——每个变量在编译期就有确定的类型，编译器会在代码运行之前就检查类型错误。这意味着
    - code: String s = 123;
    - text: 这样的错误在编译时就会被发现，而不是等到运行时才崩溃。
  - paragraph:
    - strong: 4. 安全沙箱
  - paragraph: Java 的字节码在执行前要经过验证器（Verifier）检查，确保不会执行非法操作（如访问越界内存、绕过访问控制）。这使得 Java 可以安全地运行不受信任的代码——比如浏览器中的 Applet（虽然 Applet 已经被淘汰，但安全沙箱的思想延续到了 Android 等平台）。
  - paragraph:
    - strong: 5. 面向对象
  - paragraph: Java 强制使用面向对象范式——所有代码都必须写在类里面。这不是限制，而是一种工程约束：面向对象提供了封装、继承、多态三种机制来管理软件复杂性。
  - paragraph:
    - strong: 6. 向后兼容
  - paragraph: Java 非常重视向后兼容——用 Java 5 编译的代码，在 Java 21 的 JVM 上通常还能运行。这对企业级应用至关重要：没人愿意每次 JDK 升级都重写所有代码。
  - heading "Java 不是为了追求最快 Permalink to \"Java 不是为了追求最快\"" [level=3]:
    - text: Java 不是为了追求最快
    - link "Permalink to \"Java 不是为了追求最快\"":
      - /url: "#java-不是为了追求最快"
      - text: "#"
  - paragraph:
    - text: 这是一个重要的认知。Java 的设计哲学从来不是"追求极致性能"，而是
    - strong: 在性能、安全性、可维护性和开发效率之间寻找平衡
    - text: 。
  - paragraph: C/C++ 可以比 Java 更快，因为它们可以直接操作内存、使用内联汇编。但这种"更快"的代价是更高的 bug 风险和更长的开发周期。
  - paragraph: Java 选择了"足够快"——通过 JVM 的即时编译（JIT），Java 在长期运行的服务端场景下，性能可以接近甚至超过手写的 C++ 代码（因为 JIT 可以根据运行时信息做激进优化，这是 AOT 编译做不到的）。
  - paragraph: 这个设计选择决定了 Java 的命运：它没有成为游戏引擎或操作系统内核的首选语言，但它成为了企业级应用、Web 后端、大数据处理、Android 开发的主流语言。在这些领域，开发效率和可维护性比极致性能更重要。
  - heading "一段 Java 代码是如何运行起来的 Permalink to \"一段 Java 代码是如何运行起来的\"" [level=3]:
    - text: 一段 Java 代码是如何运行起来的
    - link "Permalink to \"一段 Java 代码是如何运行起来的\"":
      - /url: "#一段-java-代码是如何运行起来的"
      - text: "#"
  - paragraph: 在深入细节之前，先建立全局视角：
  - button "Copy Code"
  - text: java
  - code: "public class Hello { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }"
  - paragraph: 这段代码从源码到 CPU 执行，经历了这些步骤：
  - img: Java 程序的执行流程 Hello.java（源码） javac 编译 Hello.class（字节码） JVM 加载 ClassLoader 加载字节码 JVM 验证、准备、初始化 解释执行 / JIT 编译 CPU 执行机器码
  - paragraph: 后面的每一章，都是在解释这条链路中的某一个环节。现在只需要建立这个整体认知，知道"Java 代码不是直接在 CPU 上跑的"就够了。
  - heading "Java 世界的组成 Permalink to \"Java 世界的组成\"" [level=3]:
    - text: Java 世界的组成
    - link "Permalink to \"Java 世界的组成\"":
      - /url: "#java-世界的组成"
      - text: "#"
  - paragraph: 整本书，就是沿着以下维度一步一步拆解 Java：
  - list:
    - listitem:
      - strong: Java Language
      - text: ：语言规范，定义了语法和语义
    - listitem:
      - strong: Compiler（javac）
      - text: ：将源码编译成字节码
    - listitem:
      - strong: Class File
      - text: ：字节码的载体，跨平台的核心契约
    - listitem:
      - strong: ClassLoader
      - text: ：将 class 文件加载进 JVM
    - listitem:
      - strong: JVM Runtime
      - text: ：执行字节码的引擎，包含内存管理、GC、JIT
    - listitem:
      - strong: JDK 标准库
      - text: ：集合、IO、并发、网络等基础能力
    - listitem:
      - strong: 生态框架
      - text: ：Spring、MyBatis、Netty 等
  - paragraph: 你现在读的第一卷，覆盖的是 Java Language。第二卷覆盖 JVM Runtime。后面每一卷，都在填充这张地图中的一块。
  - separator
  - heading "1.2 基本类型与引用类型 Permalink to \"1.2 基本类型与引用类型\"" [level=2]:
    - text: 1.2 基本类型与引用类型
    - link "Permalink to \"1.2 基本类型与引用类型\"":
      - /url: "#_1-2-基本类型与引用类型"
      - text: "#"
  - paragraph: Java 的类型世界分为两大阵营：基本类型（Primitive）和引用类型（Reference）。理解这个划分，是理解 JVM 运行时内存结构、对象模型、泛型的前提。
  - heading "类型体系总览 Permalink to \"类型体系总览\"" [level=3]:
    - text: 类型体系总览
    - link "Permalink to \"类型体系总览\"":
      - /url: "#类型体系总览"
      - text: "#"
  - img: Java 类型体系 Type Primitive Reference int long double boolean char ... Class Interface Array Enum Record ... 8 种基本类型是值类型，其余一切皆对象（引用类型）
  - heading "Enum：编译器魔法加持的引用类型 Permalink to \"Enum：编译器魔法加持的引用类型\"" [level=3]:
    - text: Enum：编译器魔法加持的引用类型
    - link "Permalink to \"Enum：编译器魔法加持的引用类型\"":
      - /url: "#enum-编译器魔法加持的引用类型"
      - text: "#"
  - paragraph: Enum 是引用类型家族中一个特殊的存在。说它是类，它确实有字段、有方法、可以实现接口；说它不是类，它的实例在类加载时就固定了，不能 new，不能继承。编译器对 Enum 有一整套特殊支持，理解这些“魔法”才能用好它。
  - button "Copy Code"
  - text: java
  - code: "public enum Color { RED, GREEN, BLUE }"
  - paragraph: 编译器将这段代码生成为：
  - button "Copy Code"
  - text: java
  - code: "public final class Color extends Enum<Color> { public static final Color RED = new Color(\"RED\", 0); public static final Color GREEN = new Color(\"GREEN\", 1); public static final Color BLUE = new Color(\"BLUE\", 2); private Color(String name, int ordinal) { ... } public static Color[] values() { ... } // 编译器生成 public static Color valueOf(String name) { ... } // 编译器生成 }"
  - paragraph: 几个关键特性：
  - paragraph:
    - strong: 1. 天然单例。
    - text: 枚举常量在类加载时创建，JVM 保证唯一。这就是为什么 Effective Java 推荐用 Enum 实现单例模式——比
    - code: private static final
    - text: 更安全，且天然防反射和序列化攻击。
  - paragraph:
    - strong: 2. 可以有字段和方法。
    - text: Enum 本质是类，可以有构造方法、字段、方法：
  - button "Copy Code"
  - text: java
  - code: "public enum HttpStatus { OK(200, \"Success\"), NOT_FOUND(404, \"Not Found\"), INTERNAL_ERROR(500, \"Server Error\"); private final int code; private final String message; HttpStatus(int code, String message) { this.code = code; this.message = message; } public int getCode() { return code; } }"
  - paragraph:
    - strong: 3. 可以实现接口。
    - code: "enum Color implements Serializable { ... }"
  - paragraph:
    - strong: 4. 天然线程安全。
    - text: 枚举常量是
    - code: static final
    - text: 的，不可变，不需要同步。
  - paragraph:
    - strong: 5. 可以用于 switch。
    - text: 这是 Enum 最常见的使用场景之一。
  - heading "ordinal() 的陷阱 Permalink to \"ordinal() 的陷阱\"" [level=3]:
    - text: ordinal() 的陷阱
    - link "Permalink to \"ordinal() 的陷阱\"":
      - /url: "#ordinal-的陷阱"
      - text: "#"
  - paragraph:
    - text: 每个枚举常量有一个
    - code: ordinal()
    - text: 方法，返回它在声明中的位置（从 0 开始）。
    - strong: 不要用 ordinal 做业务逻辑
    - text: ：
  - button "Copy Code"
  - text: java
  - code: "public enum Size { SMALL, MEDIUM, LARGE } Size.SMALL.ordinal() // 0 Size.MEDIUM.ordinal() // 1 Size.LARGE.ordinal() // 2"
  - paragraph:
    - text: 如果在
    - code: MEDIUM
    - text: 和
    - code: LARGE
    - text: 之间插入一个
    - code: EXTRA_LARGE
    - text: ，所有后续的 ordinal 都变了——依赖 ordinal 的代码会出 bug。用枚举常量本身或自定义字段来表示业务值。
  - heading "EnumSet 与 EnumMap Permalink to \"EnumSet 与 EnumMap\"" [level=3]:
    - text: EnumSet 与 EnumMap
    - link "Permalink to \"EnumSet 与 EnumMap\"":
      - /url: "#enumset-与-enummap"
      - text: "#"
  - paragraph: Java 提供了两个专门针对 Enum 优化的集合：
  - list:
    - listitem:
      - strong:
        - code: EnumSet
      - text: ：用位向量实现的 Set，比
      - code: HashSet
      - text: 更高效（每个枚举常量对应一个 bit）
    - listitem:
      - strong:
        - code: EnumMap
      - text: ：用数组实现的 Map，key 是枚举常量，比
      - code: HashMap
      - text: 更高效
  - button "Copy Code"
  - text: java
  - code: EnumSet<Color> warmColors = EnumSet.of(Color.RED, Color.ORANGE, Color.YELLOW); EnumMap<Color, String> colorNames = new EnumMap<>(Color.class);
  - paragraph:
    - text: 如果 key 是枚举类型，优先用
    - code: EnumMap
    - text: 而非
    - code: HashMap
    - text: 。
  - heading "基本类型：性能与抽象之间的取舍 Permalink to \"基本类型：性能与抽象之间的取舍\"" [level=3]:
    - text: 基本类型：性能与抽象之间的取舍
    - link "Permalink to \"基本类型：性能与抽象之间的取舍\"":
      - /url: "#基本类型-性能与抽象之间的取舍"
      - text: "#"
  - paragraph: Java 有 8 种基本类型：
  - table:
    - rowgroup:
      - row "类型 大小 范围 默认值":
        - columnheader "类型"
        - columnheader "大小"
        - columnheader "范围"
        - columnheader "默认值"
    - rowgroup:
      - row "byte 1 字节 -128 ~ 127 0":
        - cell "byte":
          - code: byte
        - cell "1 字节"
        - cell "-128 ~ 127"
        - cell "0"
      - row "short 2 字节 -32768 ~ 32767 0":
        - cell "short":
          - code: short
        - cell "2 字节"
        - cell "-32768 ~ 32767"
        - cell "0"
      - row "int 4 字节 -2^31 ~ 2^31-1 0":
        - cell "int":
          - code: int
        - cell "4 字节"
        - cell "-2^31 ~ 2^31-1"
        - cell "0"
      - row "long 8 字节 -2^63 ~ 2^63-1 0L":
        - cell "long":
          - code: long
        - cell "8 字节"
        - cell "-2^63 ~ 2^63-1"
        - cell "0L"
      - row "float 4 字节 IEEE 754 单精度 0.0f":
        - cell "float":
          - code: float
        - cell "4 字节"
        - cell "IEEE 754 单精度"
        - cell "0.0f"
      - row "double 8 字节 IEEE 754 双精度 0.0d":
        - cell "double":
          - code: double
        - cell "8 字节"
        - cell "IEEE 754 双精度"
        - cell "0.0d"
      - row "char 2 字节 0 ~ 65535 '\\u0000'":
        - cell "char":
          - code: char
        - cell "2 字节"
        - cell "0 ~ 65535"
        - cell "'\\u0000'"
      - row "boolean 1 位/1 字节 true / false false":
        - cell "boolean":
          - code: boolean
        - cell "1 位/1 字节"
        - cell "true / false"
        - cell "false"
  - paragraph:
    - strong: 为什么 Java 要有基本类型？
    - text: 两个字：
    - strong: 性能
    - text: 。
  - paragraph: 如果所有东西都是对象：
  - button "Copy Code"
  - text: java
  - code: Integer i = new Integer(10);
  - paragraph: 每次创建一个整数，都需要：
  - list:
    - listitem: 在堆上分配内存（对象头 + 实例数据 + 对齐填充）
    - listitem: 创建对象引用
    - listitem: GC 最终需要回收这个对象
  - paragraph:
    - text: 对于一个简单的循环计数器
    - code: for (int i = 0; i < 1000000; i++)
    - text: ，如果每次都创建一个 Integer 对象，会产生巨大的内存分配压力和 GC 负担。
  - paragraph: 基本类型直接在栈上存储值，没有对象头，没有 GC 开销，CPU 缓存友好。这是 Java 在"纯面向对象"和"实际性能"之间做出的务实妥协。
  - heading "引用类型：变量、引用与对象 Permalink to \"引用类型：变量、引用与对象\"" [level=3]:
    - text: 引用类型：变量、引用与对象
    - link "Permalink to \"引用类型：变量、引用与对象\"":
      - /url: "#引用类型-变量、引用与对象"
      - text: "#"
  - paragraph: 这是很多开发者理解不清的地方。看这行代码：
  - button "Copy Code"
  - text: java
  - code: User user = new User();
  - paragraph:
    - text: 很多人认为"变量
    - code: user
    - text: 就是对象"。实际上：
  - img: "栈与堆的协作关系 栈（Stack） user 引用地址 → 0x7f8b 堆（Heap） User 对象 ├─ 对象头 ├─ name: null └─ age: 0 局部变量（基本类型 + 引用） 对象实例（new 出来的）"
  - list:
    - listitem:
      - strong:
        - text: 变量
        - code: user
      - text: 存在栈上，保存的是一个
      - strong: 引用
      - text: （本质上是一个内存地址）
    - listitem:
      - strong: 对象本身
      - text: 存在堆上，包含对象头和实例数据
    - listitem:
      - code: user
      - text: 不是对象，它是
      - strong: 指向对象的引用
  - paragraph: 这个区分非常重要，因为它直接影响你对赋值、传参、相等性判断的理解：
  - button "Copy Code"
  - text: java
  - code: User a = new User(); User b = a; // b 和 a 指向同一个对象 b.name = "Tom"; System.out.println(a.name); // 输出 "Tom"——因为 a 和 b 是同一个对象
  - paragraph:
    - text: 赋值
    - code: b = a
    - text: 不是复制对象，而是复制引用。两个引用指向堆上的同一个对象。
  - heading "自动装箱与拆箱 Permalink to \"自动装箱与拆箱\"" [level=3]:
    - text: 自动装箱与拆箱
    - link "Permalink to \"自动装箱与拆箱\"":
      - /url: "#自动装箱与拆箱"
      - text: "#"
  - paragraph: Java 5 引入了自动装箱（Autoboxing），让基本类型和包装类型之间可以自动转换：
  - button "Copy Code"
  - text: java
  - code: int a = 10; Integer b = a; // 自动装箱：int → Integer int c = b; // 自动拆箱：Integer → int
  - paragraph:
    - text: 装箱的本质是调用
    - code: Integer.valueOf(a)
    - text: ，拆箱的本质是调用
    - code: b.intValue()
    - text: 。
  - paragraph: 自动装箱带来了一些隐蔽的性能问题：
  - button "Copy Code"
  - text: java
  - code: "// ❌ 性能陷阱：每次循环都创建一个新的 Integer 对象 Long sum = 0L; for (long i = 0; i < 10000000L; i++) { sum += i; // 每次 += 都涉及拆箱 → 加法 → 装箱 } // ✅ 正确做法：使用基本类型 long sum = 0L; for (long i = 0; i < 10000000L; i++) { sum += i; }"
  - paragraph: 还有一个经典的面试坑：
  - button "Copy Code"
  - text: java
  - code: Integer a = 127; Integer b = 127; System.out.println(a == b); // true（IntegerCache 缓存了 -128 ~ 127） Integer c = 128; Integer d = 128; System.out.println(c == d); // false（超出缓存范围，创建了两个不同对象）
  - paragraph:
    - code: Integer.valueOf()
    - text: 对 -128 到 127 之间的值做了缓存。这是 JDK 的实现细节，但面试经常考。记住：
    - strong:
      - text: 比较包装类型永远用
      - code: equals()
      - text: ，不要用
      - code: ==
    - text: 。
  - separator
  - heading "1.3 对象模型：引用 vs 对象 Permalink to \"1.3 对象模型：引用 vs 对象\"" [level=2]:
    - text: 1.3 对象模型：引用 vs 对象
    - link "Permalink to \"1.3 对象模型：引用 vs 对象\"":
      - /url: "#_1-3-对象模型-引用-vs-对象"
      - text: "#"
  - paragraph: 深入理解 Java 的对象模型，是理解 JVM 内存布局、GC、并发锁机制的前提。
  - heading "对象在哪里 Permalink to \"对象在哪里\"" [level=3]:
    - text: 对象在哪里
    - link "Permalink to \"对象在哪里\"":
      - /url: "#对象在哪里"
      - text: "#"
  - paragraph:
    - text: Java 中，对象实例存储在**堆（Heap）
    - strong: 上，局部变量和对象引用存储在
    - text: 栈（Stack）**上。
  - button "Copy Code"
  - text: java
  - code: "public void process() { int count = 10; // count 在栈上 User user = new User(); // user 引用在栈上，User 对象在堆上 user.name = \"Tom\"; // 通过引用操作堆上的对象 }"
  - paragraph:
    - text: 当方法
    - code: process()
    - text: 执行完毕：
  - list:
    - listitem:
      - text: 栈帧被弹出，
      - code: count
      - text: 和
      - code: user
      - text: 引用消失
    - listitem: 堆上的 User 对象变成"不可达"（没有引用指向它了）
    - listitem: GC 在某个时刻回收这个对象
  - heading "null 的含义 Permalink to \"null 的含义\"" [level=3]:
    - text: null 的含义
    - link "Permalink to \"null 的含义\"":
      - /url: "#null-的含义"
      - text: "#"
  - button "Copy Code"
  - text: java
  - code: User user = null;
  - paragraph:
    - code: "null"
    - text: 表示"这个引用不指向任何对象"。它不是对象，不是空字符串，不是零——它是一个
    - strong: 空引用
    - text: 。
  - paragraph:
    - text: 对
    - code: "null"
    - text: 调用任何方法都会抛出
    - code: NullPointerException
    - text: （NPE）：
  - button "Copy Code"
  - text: java
  - code: User user = null; user.getName(); // NPE!
  - paragraph:
    - text: NPE 是 Java 中最常见的运行时异常之一。后面的 Lambda 章节会讲
    - code: Optional
    - text: 如何用类型系统来表达"值可能不存在"，从而减少 NPE。
  - heading "对象的创建过程 Permalink to \"对象的创建过程\"" [level=3]:
    - text: 对象的创建过程
    - link "Permalink to \"对象的创建过程\"":
      - /url: "#对象的创建过程"
      - text: "#"
  - paragraph:
    - text: 当你写
    - code: new User()
    - text: 时，JVM 做了什么？
  - img: 对象创建流程（new User("Tom")） 1. 类加载检查 User 类是否已加载？没有 → 先执行类加载 2. 分配内存 堆内存是否规整？ 由 GC 算法决定 是 指针碰撞 否 空闲列表 线程安全？ TLAB：每个线程在 Eden 有私有缓冲区，无需 CAS TLAB 用完 → Eden 共享区分配，需要 CAS 同步 3. 初始化零值 int=0, boolean=false, 引用=null JVM 保证零值初始化，字段使用前必有确定值 4. 设置对象头 Mark Word（hashCode、GC 年龄、锁状态） Klass Pointer（指向方法区中的类元数据） 5. 执行 <init> 构造方法 你写的构造方法代码 TLAB 是关键优化 没有 TLAB，多线程同时在 Eden 分配对象需要加锁（CAS） TLAB 让每个线程有自己的"私人领地"，分配只需移动指针 -XX:+UseTLAB 默认开启，大部分对象分配无需真正同步 超过 -XX:PretenureSizeThreshold 的大对象直接分配在老年代 共 5 步：类加载 → 分配内存 → 零值初始化 → 设置对象头 → 执行构造方法
  - paragraph: 现在只需要知道：对象创建不是一瞬间的事，JVM 做了很多幕后工作。第二卷"对象模型"一章会详细展开。
  - heading "对象的内存布局 Permalink to \"对象的内存布局\"" [level=3]:
    - text: 对象的内存布局
    - link "Permalink to \"对象的内存布局\"":
      - /url: "#对象的内存布局"
      - text: "#"
  - paragraph: HotSpot JVM 中，一个 Java 对象在堆中的结构：
  - img: HotSpot 对象内存布局（64 位 JVM） 对象头（Object Header） Mark Word 8 字节（64 bit） hashCode / GC 年龄 锁状态标志 Klass Pointer 4 或 8 字节 指向方法区中 该类的元数据 实例数据（Instance Data） 父类字段在前 子类字段在后 int id / String name / boolean active ... 对齐填充（Padding） 保证对象总大小是 8 字节的整数倍 12~16 字节 大小不固定 压缩指针（-XX:+UseCompressedOops） 64 位 JVM 默认开启 → Klass Pointer 占 4 字节 关闭时 → Klass Pointer 占 8 字节 Mark Word 与锁状态 加锁后 Mark Word 内容被覆盖，存储锁信息而非 hashCode 对象头 | 实例数据 | 对齐填充 → 8 字节对齐
  - paragraph:
    - text: 对象头中的
    - strong: Mark Word
    - text: 非常重要——它不仅存储 hashCode 和 GC 年龄，还存储锁状态信息。当对象被
    - code: synchronized
    - text: 锁住时，Mark Word 的内容会发生变化（偏向锁 → 轻量级锁 → 重量级锁）。这是第三卷
    - code: synchronized
    - text: 的关键前置知识。
  - separator
  - heading "1.4 equals / hashCode / identity Permalink to \"1.4 equals / hashCode / identity\"" [level=2]:
    - text: 1.4 equals / hashCode / identity
    - link "Permalink to \"1.4 equals / hashCode / identity\"":
      - /url: "#_1-4-equals-hashcode-identity"
      - text: "#"
  - paragraph:
    - text: 对象相等性是 Java 中最容易出错的概念之一。很多 bug 的根源就是对
    - code: ==
    - text: 和
    - code: equals()
    - text: 的混淆。
  - heading "三个层次 Permalink to \"三个层次\"" [level=3]:
    - text: 三个层次
    - link "Permalink to \"三个层次\"":
      - /url: "#三个层次"
      - text: "#"
  - table:
    - rowgroup:
      - row "层次 含义 运算符/方法":
        - columnheader "层次"
        - columnheader "含义"
        - columnheader "运算符/方法"
    - rowgroup:
      - row "identity 是否同一个对象（内存地址相同） ==":
        - cell "identity":
          - strong: identity
        - cell "是否同一个对象（内存地址相同）"
        - cell "==":
          - code: ==
      - row "equality 逻辑上是否相等 equals()":
        - cell "equality":
          - strong: equality
        - cell "逻辑上是否相等"
        - cell "equals()":
          - code: equals()
      - row "hash 对象的哈希指纹 hashCode()":
        - cell "hash":
          - strong: hash
        - cell "对象的哈希指纹"
        - cell "hashCode()":
          - code: hashCode()
  - button "Copy Code"
  - text: java
  - code: String a = new String("hello"); String b = new String("hello"); a == b // false——两个不同的对象 a.equals(b) // true——逻辑上相等
  - heading "== 运算符 Permalink to \"== 运算符\"" [level=3]:
    - text: == 运算符
    - link "Permalink to \"== 运算符\"":
      - /url: "#运算符"
      - text: "#"
  - paragraph:
    - text: 对于基本类型，
    - code: ==
    - text: 比较的是
    - strong: 值
    - text: ：
  - button "Copy Code"
  - text: java
  - code: int x = 10; int y = 10; x == y // true
  - paragraph:
    - text: 对于引用类型，
    - code: ==
    - text: 比较的是
    - strong: 引用地址
    - text: （是否同一个对象）：
  - button "Copy Code"
  - text: java
  - code: User u1 = new User("Tom"); User u2 = new User("Tom"); u1 == u2 // false——两个不同的对象，虽然内容相同
  - heading "equals() 方法 Permalink to \"equals() 方法\"" [level=3]:
    - text: equals() 方法
    - link "Permalink to \"equals() 方法\"":
      - /url: "#equals-方法"
      - text: "#"
  - paragraph:
    - code: equals()
    - text: 是
    - code: Object
    - text: 类定义的方法，默认实现就是
    - code: ==
    - text: ：
  - button "Copy Code"
  - text: java
  - code: "// Object 类的默认实现 public boolean equals(Object obj) { return (this == obj); }"
  - paragraph:
    - text: 如果想让"内容相同"的对象被视为相等，就需要
    - strong: 重写
    - code: equals()
    - text: ：
  - button "Copy Code"
  - text: java
  - code: "public class User { private String name; private int age; @Override public boolean equals(Object o) { if (this == o) return true; if (o == null || getClass() != o.getClass()) return false; User user = (User) o; return age == user.age && Objects.equals(name, user.name); } }"
  - heading "hashCode() 的契约 Permalink to \"hashCode() 的契约\"" [level=3]:
    - text: hashCode() 的契约
    - link "Permalink to \"hashCode() 的契约\"":
      - /url: "#hashcode-的契约"
      - text: "#"
  - paragraph: Java 规范要求：
  - list:
    - listitem:
      - strong:
        - text: 如果
        - code: a.equals(b)
        - text: 为 true，那么
        - code: a.hashCode()
        - text: 必须等于
        - code: b.hashCode()
    - listitem:
      - text: 如果
      - code: a.hashCode()
      - text: 等于
      - code: b.hashCode()
      - text: ，
      - code: a.equals(b)
      - text: 不一定为 true（哈希碰撞）
  - paragraph:
    - text: 为什么？因为
    - code: HashMap
    - text: 、
    - code: HashSet
    - text: 等哈希容器先用
    - code: hashCode()
    - text: 定位桶，再用
    - code: equals()
    - text: 判断是否是同一个 key。如果两个
    - code: equals()
    - text: 相等的对象有不同的
    - code: hashCode()
    - text: ，
    - code: HashMap
    - text: 会把它们放到不同的桶里——你
    - code: put
    - text: 了一个，
    - code: get
    - text: 另一个却找不到。
  - button "Copy Code"
  - text: java
  - code: // ❌ 经典 bug：重写了 equals 但没重写 hashCode User u1 = new User("Tom", 25); User u2 = new User("Tom", 25); Map<User, String> map = new HashMap<>(); map.put(u1, "value"); map.get(u2); // 可能返回 null！因为 u1 和 u2 的 hashCode 不同
  - paragraph:
    - strong:
      - text: 规则：重写
      - code: equals()
      - text: 必须同时重写
      - code: hashCode()
      - text: 。
    - text: 现代 IDE 可以一键生成这两个方法，没有理由手写犯错。
  - heading "Objects 工具类 Permalink to \"Objects 工具类\"" [level=3]:
    - text: Objects 工具类
    - link "Permalink to \"Objects 工具类\"":
      - /url: "#objects-工具类"
      - text: "#"
  - paragraph:
    - text: Java 7 引入的
    - code: Objects
    - text: 工具类简化了
    - code: equals()
    - text: 和
    - code: hashCode()
    - text: 的实现：
  - button "Copy Code"
  - text: java
  - code: "@Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof User)) return false; User user = (User) o; return age == user.age && Objects.equals(name, user.name); } @Override public int hashCode() { return Objects.hash(name, age); }"
  - separator
  - heading "1.5 String 与不可变对象 Permalink to \"1.5 String 与不可变对象\"" [level=2]:
    - text: 1.5 String 与不可变对象
    - link "Permalink to \"1.5 String 与不可变对象\"":
      - /url: "#_1-5-string-与不可变对象"
      - text: "#"
  - paragraph:
    - code: String
    - text: 是 Java 中使用最频繁的类，也是理解不可变对象（Immutable Object）的最佳案例。
  - heading "String 为什么是不可变的 Permalink to \"String 为什么是不可变的\"" [level=3]:
    - text: String 为什么是不可变的
    - link "Permalink to \"String 为什么是不可变的\"":
      - /url: "#string-为什么是不可变的"
      - text: "#"
  - button "Copy Code"
  - text: java
  - code: "public final class String { private final char[] value; // JDK 8 及之前 // JDK 9+ 改为 byte[] + coder，节省内存 }"
  - paragraph:
    - code: String
    - text: 类是
    - code: final
    - text: 的（不能被继承），内部的
    - code: value
    - text: 数组也是
    - code: final
    - text: 的（不能被重新赋值），而且没有提供任何修改
    - code: value
    - text: 内容的方法。
  - paragraph:
    - strong: 为什么要设计成不可变？
  - paragraph:
    - strong: 1. 字符串常量池共享
  - button "Copy Code"
  - text: java
  - code: String a = "hello"; String b = "hello"; // a 和 b 指向常量池中同一个 "hello" 对象
  - paragraph:
    - text: 如果 String 是可变的，
    - code: a.append("!")
    - text: 就会把
    - code: b
    - text: 的值也改了——因为它们是同一个对象。不可变保证了共享是安全的。
  - paragraph:
    - strong: 2. 线程安全
  - paragraph: 不可变对象天然线程安全——没有任何线程可以修改它的状态，所以不需要同步。这是第三卷并发编程的重要基础。
  - paragraph:
    - strong: 3. 哈希缓存
  - paragraph:
    - text: String 的
    - code: hashCode()
    - text: 只需要计算一次，之后缓存起来。因为值不会变，hashCode 也不会变。这让 String 作为
    - code: HashMap
    - text: 的 key 非常高效。
  - heading "字符串拼接的陷阱 Permalink to \"字符串拼接的陷阱\"" [level=3]:
    - text: 字符串拼接的陷阱
    - link "Permalink to \"字符串拼接的陷阱\"":
      - /url: "#字符串拼接的陷阱"
      - text: "#"
  - button "Copy Code"
  - text: java
  - code: "String result = \"\"; for (int i = 0; i < 10000; i++) { result += i; // 每次 += 都创建一个新的 String 对象 }"
  - paragraph:
    - text: 每次
    - code: +=
    - text: 都会：
  - list:
    - listitem:
      - text: 创建一个
      - code: StringBuilder
    - listitem: append 当前字符串和新值
    - listitem:
      - text: 调用
      - code: toString()
      - text: 创建一个新的 String 对象
  - paragraph: 10000 次循环 = 10000 个临时 StringBuilder + 10000 个临时 String。
  - button "Copy Code"
  - text: java
  - code: "// ✅ 正确做法 StringBuilder sb = new StringBuilder(); for (int i = 0; i < 10000; i++) { sb.append(i); } String result = sb.toString();"
  - heading "String.intern() Permalink to \"String.intern()\"" [level=3]:
    - text: String.intern()
    - link "Permalink to \"String.intern()\"":
      - /url: "#string-intern"
      - text: "#"
  - button "Copy Code"
  - text: java
  - code: String a = new String("hello"); // 堆上新对象 String b = a.intern(); // 放入常量池，返回常量池中的引用 String c = "hello"; // 直接引用常量池 b == c // true
  - paragraph:
    - code: intern()
    - text: 将字符串放入 JVM 的字符串常量池（StringTable）。JDK 7 之后，StringTable 从永久代移到了堆中，由 GC 管理。适度使用
    - code: intern()
    - text: 可以节省内存（重复字符串只存一份），但过度使用会导致 StringTable 膨胀，反而增加 GC 压力。
  - heading "其他不可变对象 Permalink to \"其他不可变对象\"" [level=3]:
    - text: 其他不可变对象
    - link "Permalink to \"其他不可变对象\"":
      - /url: "#其他不可变对象"
      - text: "#"
  - paragraph:
    - text: String 不是 Java 中唯一的不可变对象。
    - code: Integer
    - text: 、
    - code: Long
    - text: 、
    - code: Double
    - text: 等包装类型也是不可变的。
    - code: LocalDate
    - text: 、
    - code: BigDecimal
    - text: 等也是。
  - paragraph: 设计不可变对象的原则：
  - list:
    - listitem:
      - text: 类声明为
      - code: final
      - text: （或所有方法为
      - code: final
      - text: ）
    - listitem:
      - text: 所有字段为
      - code: private final
    - listitem: 不提供修改状态的方法
    - listitem: 构造时深拷贝可变参数，返回时深拷贝可变字段
  - separator
  - heading "1.6 类型转换与编译期检查 Permalink to \"1.6 类型转换与编译期检查\"" [level=2]:
    - text: 1.6 类型转换与编译期检查
    - link "Permalink to \"1.6 类型转换与编译期检查\"":
      - /url: "#_1-6-类型转换与编译期检查"
      - text: "#"
  - paragraph: Java 的类型系统在编译期和运行期都有检查机制，这使得很多错误在代码运行之前就被发现。
  - heading "基本类型转换 Permalink to \"基本类型转换\"" [level=3]:
    - text: 基本类型转换
    - link "Permalink to \"基本类型转换\"":
      - /url: "#基本类型转换"
      - text: "#"
  - paragraph:
    - strong: 自动扩大（Widening）
    - text: ——安全，编译器自动完成：
  - button "Copy Code"
  - text: text
  - code: byte → short → int → long → float → double char →
  - button "Copy Code"
  - text: java
  - code: int a = 10; long b = a; // OK，int 自动扩大为 long double c = b; // OK，long 自动扩大为 double
  - paragraph:
    - strong: 强制缩小（Narrowing）
    - text: ——可能丢失精度，需要显式转换：
  - button "Copy Code"
  - text: java
  - code: double d = 3.14; int i = (int) d; // i = 3，小数部分丢失 long big = 130L; byte b = (byte) big; // b = -126，溢出（byte 范围是 -128~127）
  - heading "引用类型转换 Permalink to \"引用类型转换\"" [level=3]:
    - text: 引用类型转换
    - link "Permalink to \"引用类型转换\"":
      - /url: "#引用类型转换"
      - text: "#"
  - paragraph:
    - strong: 向上转型（Upcasting）
    - text: ——安全，自动完成：
  - button "Copy Code"
  - text: java
  - code: String s = "hello"; Object o = s; // String 是 Object 的子类，自动向上转型
  - paragraph:
    - strong: 向下转型（Downcasting）
    - text: ——需要运行时检查：
  - button "Copy Code"
  - text: java
  - code: Object o = "hello"; String s = (String) o; // OK，运行时 o 确实是 String Object o2 = 123; String s2 = (String) o2; // ClassCastException！运行时 o2 是 Integer
  - paragraph:
    - text: 向下转型在字节码层面对应
    - code: checkcast
    - text: 指令——JVM 在运行时检查对象的实际类型，如果不匹配就抛出
    - code: ClassCastException
    - text: 。
  - heading "编译器如何利用类型 Permalink to \"编译器如何利用类型\"" [level=3]:
    - text: 编译器如何利用类型
    - link "Permalink to \"编译器如何利用类型\"":
      - /url: "#编译器如何利用类型"
      - text: "#"
  - paragraph: Java 编译器利用类型信息做三件事：
  - paragraph:
    - strong: 1. 类型检查
    - text: ——在编译期拒绝非法操作：
  - button "Copy Code"
  - text: java
  - code: String s = 123; // 编译错误：int 不能赋值给 String "hello" - 1; // 编译错误：String 不支持减法
  - paragraph:
    - strong: 2. 方法重载解析
    - text: ——根据参数类型选择正确的方法：
  - button "Copy Code"
  - text: java
  - code: "void print(String s) { ... } void print(int i) { ... } print(\"hello\"); // 编译器选择 print(String) print(42); // 编译器选择 print(int)"
  - paragraph:
    - strong: 3. 泛型检查
    - text: ——在编译期保证类型安全（第三章详细展开）
  - paragraph: 编译器在字节码生成之前就阻止了错误。这是静态类型语言的核心优势：错误发现得越早，修复成本越低。
  - separator
  - blockquote:
    - paragraph: 本章建立了 Java 的世界观和类型系统的完整认知。下一章《面向对象》将回答：Java 如何利用这套类型系统来组织复杂的软件世界——封装、继承、多态、接口，这些不是语法概念，而是解决软件复杂性的工程方法。
- contentinfo:
  - link "在编辑器中打开源文件":
    - /url: http://__vscode__/01-java-language/chapter-01-type-system.md
  - paragraph:
    - text: "Last updated:"
    - time: 8/7/26, 11:06 AM
  - navigation "Pager":
    - text: Pager
    - link "下一章 面向对象":
      - /url: /java-world/01-java-language/chapter-02-oop.html
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | async function waitForSvg(page: any) {
  4   |   await page.waitForSelector('.VPContent', { timeout: 15000 })
  5   |   await page.waitForSelector('.svg-container', { timeout: 15000 })
  6   |   await page.waitForSelector('.svg-container svg', { timeout: 15000 })
  7   |   // 滚动到第二个 SVG 容器，避免被顶部导航栏遮挡
  8   |   await page.evaluate(() => {
  9   |     const containers = document.querySelectorAll('.svg-container')
  10  |     if (containers[1]) containers[1].scrollIntoView({ block: 'center' })
  11  |   })
  12  |   await page.waitForTimeout(500)
  13  | }
  14  | 
  15  | test.describe('SvgEditor UI 运行时验证', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await page.goto('/java-world/01-java-language/chapter-01-type-system')
  18  |     await waitForSvg(page)
  19  |   })
  20  | 
  21  |   test('1. SVG 图表正确渲染（尺寸不为 0）', async ({ page }) => {
  22  |     const svg = page.locator('.svg-container svg').first()
  23  |     await expect(svg).toBeVisible()
  24  |     const box = await svg.boundingBox()
  25  |     console.log(`[SVG 尺寸] width=${box?.width}, height=${box?.height}`)
  26  |     expect(box).not.toBeNull()
  27  |     expect(box!.width).toBeGreaterThan(0)
  28  |     expect(box!.height).toBeGreaterThan(0)
  29  |   })
  30  | 
  31  |   test('2. 悬浮显示编辑按钮', async ({ page }) => {
  32  |     const container = page.locator('.svg-container').nth(1)
  33  |     await container.hover()
  34  |     const btn = container.locator('.svg-edit-btn')
> 35  |     await expect(btn).toBeVisible({ timeout: 5000 })
      |                       ^ Error: expect(locator).toBeVisible() failed
  36  |     const text = await btn.textContent()
  37  |     console.log(`[编辑按钮] text="${text}"`)
  38  |     expect(text).toContain('编辑 SVG')
  39  |   })
  40  | 
  41  |   test('3. 点击编辑按钮打开编辑器弹窗', async ({ page }) => {
  42  |     const container = page.locator('.svg-container').nth(1)
  43  |     await container.hover()
  44  |     await container.locator('.svg-edit-btn').click({ force: true })
  45  |     const editor = page.locator('.editor-overlay')
  46  |     await expect(editor).toBeVisible({ timeout: 10000 })
  47  |     console.log('[编辑器] 弹窗已打开')
  48  |   })
  49  | 
  50  |   test('4. 编辑器工具栏按钮完整', async ({ page }) => {
  51  |     const container = page.locator('.svg-container').nth(1)
  52  |     await container.hover()
  53  |     await container.locator('.svg-edit-btn').click({ force: true })
  54  |     await page.waitForSelector('.editor-overlay')
  55  | 
  56  |     const toolbar = page.locator('.editor-toolbar')
  57  |     await expect(toolbar).toBeVisible()
  58  | 
  59  |     const buttons = toolbar.locator('button')
  60  |     const count = await buttons.count()
  61  |     console.log(`[工具栏] 按钮总数: ${count}`)
  62  | 
  63  |     for (let i = 0; i < count; i++) {
  64  |       const btn = buttons.nth(i)
  65  |       const title = await btn.getAttribute('title') || ''
  66  |       const text = await btn.textContent()
  67  |       console.log(`  按钮 ${i}: title="${title}", text="${text?.trim()}"`)
  68  |     }
  69  | 
  70  |     // 按钮检查：data-tip 属性的按钮
  71  |     const expectedTips = ['撤销', '重做', '复制', '粘贴', '删除', '适应画布']
  72  |     for (const t of expectedTips) {
  73  |       const btn = toolbar.locator(`button[data-tip="${t}"]`)
  74  |       const exists = await btn.count()
  75  |       console.log(`[按钮检查] "${t}": ${exists > 0 ? '✅' : '❌'}`)
  76  |       expect(exists).toBeGreaterThan(0)
  77  |     }
  78  |     // 保存按钮 data-tip 为 "保存 (Ctrl+S)"
  79  |     const saveBtn = toolbar.locator('button[data-tip*="保存"]')
  80  |     expect(await saveBtn.count()).toBeGreaterThan(0)
  81  |     console.log(`[按钮检查] "保存": ✅ (partial match)`)
  82  |   })
  83  | 
  84  |   test('5. 画布正确初始化', async ({ page }) => {
  85  |     const container = page.locator('.svg-container').nth(1)
  86  |     await container.hover()
  87  |     await container.locator('.svg-edit-btn').click({ force: true })
  88  |     await page.waitForSelector('.editor-overlay')
  89  | 
  90  |     await page.waitForFunction(() => {
  91  |       const loading = document.querySelector('.loading')
  92  |       return !loading || loading.offsetParent === null
  93  |     }, { timeout: 15000 })
  94  | 
  95  |     // Fabric.js 创建 upper-canvas 和 lower-canvas，取第一个
  96  |     const canvas = page.locator('.editor-canvas canvas').first()
  97  |     await expect(canvas).toBeVisible()
  98  | 
  99  |     const box = await canvas.boundingBox()
  100 |     console.log(`[画布] width=${box?.width}, height=${box?.height}`)
  101 |     expect(box).not.toBeNull()
  102 |     expect(box!.width).toBeGreaterThan(0)
  103 |     expect(box!.height).toBeGreaterThan(0)
  104 |   })
  105 | 
  106 |   test('6. 缩放级别显示', async ({ page }) => {
  107 |     const container = page.locator('.svg-container').nth(1)
  108 |     await container.hover()
  109 |     await container.locator('.svg-edit-btn').click({ force: true })
  110 |     await page.waitForSelector('.editor-overlay')
  111 | 
  112 |     await page.waitForFunction(() => !document.querySelector('.loading'), { timeout: 15000 })
  113 | 
  114 |     const zoomInfo = page.locator('.editor-toolbar .info').first()
  115 |     const text = await zoomInfo.textContent()
  116 |     console.log(`[缩放] 当前级别: ${text}`)
  117 |     expect(text).toMatch(/\d+%/)
  118 |   })
  119 | 
  120 |   test('7. 关闭编辑器', async ({ page }) => {
  121 |     const container = page.locator('.svg-container').nth(1)
  122 |     await container.hover()
  123 |     await container.locator('.svg-edit-btn').click({ force: true })
  124 |     await page.waitForSelector('.editor-overlay')
  125 | 
  126 |     const closeBtn = page.locator('.editor-toolbar button').last()
  127 |     await closeBtn.click()
  128 | 
  129 |     const editor = page.locator('.editor-overlay')
  130 |     await expect(editor).not.toBeVisible({ timeout: 5000 })
  131 |     console.log('[关闭] 编辑器已关闭')
  132 |   })
  133 | 
  134 |   test('8. Escape 键关闭编辑器', async ({ page }) => {
  135 |     const container = page.locator('.svg-container').nth(1)
```