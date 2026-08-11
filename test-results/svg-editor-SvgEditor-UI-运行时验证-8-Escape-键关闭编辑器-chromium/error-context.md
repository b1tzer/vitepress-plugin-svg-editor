# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: svg-editor.spec.ts >> SvgEditor UI 运行时验证 >> 8. Escape 键关闭编辑器
- Location: tests/svg-editor.spec.ts:134:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.svg-container').nth(1).locator('.svg-edit-btn')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#VPContent"
  - banner:
    - generic:
      - generic:
        - generic:
          - link "Java World" [ref=e6] [cursor=pointer]:
            - /url: /java-world/
          - generic [ref=e8]:
            - button "搜索" [ref=e11] [cursor=pointer]:
              - generic [ref=e12]: 搜索文档
              - generic [ref=e15]:
                - generic [ref=e16]: Ctrl
                - generic [ref=e17]: K
            - navigation "Main Navigation" [ref=e18]:
              - link "首页" [ref=e20] [cursor=pointer]:
                - /url: /java-world/
              - button "目录" [ref=e23] [cursor=pointer]
              - link "GitHub" [ref=e27] [cursor=pointer]:
                - /url: https://github.com/b1tzer/java-world
            - switch "Switch to dark theme" [ref=e30] [cursor=pointer]
            - link "github" [ref=e36] [cursor=pointer]:
              - /url: https://github.com/b1tzer/java-world
  - complementary [ref=e38]:
    - navigation "Sidebar Navigation" [ref=e40]:
      - generic [ref=e43]:
        - button [ref=e44] [cursor=pointer]:
          - heading "第一卷 Java 语言" [level=2] [ref=e46]
          - button "toggle section" [ref=e47]
        - generic [ref=e49]:
          - link [ref=e53] [cursor=pointer]:
            - /url: /java-world/01-java-language/chapter-01-type-system.html
            - paragraph [ref=e54]: 类型系统
          - link [ref=e58] [cursor=pointer]:
            - /url: /java-world/01-java-language/chapter-02-oop.html
            - paragraph [ref=e59]: 面向对象
          - link [ref=e63] [cursor=pointer]:
            - /url: /java-world/01-java-language/chapter-03-generics.html
            - paragraph [ref=e64]: 泛型
          - link [ref=e68] [cursor=pointer]:
            - /url: /java-world/01-java-language/chapter-04-annotation-lambda.html
            - paragraph [ref=e69]: 注解与 Lambda
      - generic [ref=e71]:
        - button [ref=e72] [cursor=pointer]:
          - heading "第二卷 JVM Runtime" [level=2] [ref=e74]
          - button "toggle section" [ref=e75]
        - generic [ref=e77]:
          - link [ref=e81] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-01-bytecode-classloading.html
            - paragraph [ref=e82]: 字节码与类加载
          - link [ref=e86] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-02-memory-model.html
            - paragraph [ref=e87]: JVM 运行时数据区
          - link [ref=e91] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-03-object-model.html
            - paragraph [ref=e92]: 对象模型
          - link [ref=e96] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-04-gc.html
            - paragraph [ref=e97]: 垃圾回收
          - link [ref=e101] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-05-jit.html
            - paragraph [ref=e102]: JIT 编译
          - link [ref=e106] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics.html
            - paragraph [ref=e107]: 线上排查与诊断
          - link [ref=e111] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part1.html
            - paragraph [ref=e112]: 案例集（一）：CPU 飙升与内存泄漏
          - link [ref=e116] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part2.html
            - paragraph [ref=e117]: 案例集（二）：GC 调优与综合诊断
          - link [ref=e121] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part3.html
            - paragraph [ref=e122]: 案例集（三）：低内存低 CPU 下的 GC 疑难杂症
          - link [ref=e126] [cursor=pointer]:
            - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics-cases-part4.html
            - paragraph [ref=e127]: 案例集（四）：堆正常但服务崩了——TCP 层与堆外内存
      - generic [ref=e129]:
        - button [ref=e130] [cursor=pointer]:
          - heading "第三卷 Java 并发" [level=2] [ref=e132]
          - button "toggle section" [ref=e133]
        - generic [ref=e135]:
          - link [ref=e139] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-01-why-concurrency.html
            - paragraph [ref=e140]: 并发的本质
          - link [ref=e144] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-02-thread-model.html
            - paragraph [ref=e145]: 线程：Java 的执行单元
          - link [ref=e149] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-03-threadlocal.html
            - paragraph [ref=e150]: 线程封闭：ThreadLocal
          - link [ref=e154] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-04-jmm.html
            - paragraph [ref=e155]: Java 内存模型（JMM）
          - link [ref=e159] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-05-volatile.html
            - paragraph [ref=e160]: volatile
          - link [ref=e164] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-06-synchronized.html
            - paragraph [ref=e165]: synchronized
          - link [ref=e169] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-07-cas-atomic.html
            - paragraph [ref=e170]: CAS 与原子类
          - link [ref=e174] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-08-locksupport-aqs.html
            - paragraph [ref=e175]: LockSupport 与 AQS
          - link [ref=e179] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-09-concurrent-collections.html
            - paragraph [ref=e180]: 并发集合
          - link [ref=e184] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-10-thread-pool.html
            - paragraph [ref=e185]: 线程池
          - link [ref=e189] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-11-async-model.html
            - paragraph [ref=e190]: 异步编程
          - link [ref=e194] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-12-virtual-thread.html
            - paragraph [ref=e195]: 虚拟线程与结构化并发
          - link [ref=e199] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-13-diagnostics.html
            - paragraph [ref=e200]: 诊断与优化
          - link [ref=e204] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-13-diagnostics-cases-part1.html
            - paragraph [ref=e205]: 案例集（一）：死锁、线程池与并发集合
          - link [ref=e209] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-13-diagnostics-cases-part2.html
            - paragraph [ref=e210]: 案例集（二）：虚拟线程与综合诊断
          - link [ref=e214] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-13-diagnostics-cases-part3.html
            - paragraph [ref=e215]: 案例集（三）：静默死锁与无超时雪崩
      - generic [ref=e217]:
        - button [ref=e218] [cursor=pointer]:
          - heading "第四卷 网络与通信" [level=2] [ref=e220]
          - button "toggle section" [ref=e221]
        - generic [ref=e223]:
          - link [ref=e227] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-01-network-basics.html
            - paragraph [ref=e228]: 网络通信基础
          - link [ref=e232] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-02-tcp-ip.html
            - paragraph [ref=e233]: TCP/IP
          - link [ref=e237] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-03-socket.html
            - paragraph [ref=e238]: Socket 编程
          - link [ref=e242] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-04-nio.html
            - paragraph [ref=e243]: Java NIO
          - link [ref=e247] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-05-netty.html
            - paragraph [ref=e248]: Netty
          - link [ref=e252] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-06-http.html
            - paragraph [ref=e253]: HTTP 协议
          - link [ref=e257] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-07-servlet-springmvc.html
            - paragraph [ref=e258]: Servlet 到 Spring MVC
          - link [ref=e262] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-08-rpc.html
            - paragraph [ref=e263]: RPC 与微服务
          - link [ref=e267] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-09-long-connection.html
            - paragraph [ref=e268]: 长连接与实时通信
          - link [ref=e272] [cursor=pointer]:
            - /url: /java-world/04-java-network/chapter-10-network-diagnostics.html
            - paragraph [ref=e273]: 网络诊断
      - generic [ref=e275]:
        - button [ref=e276] [cursor=pointer]:
          - heading "第五卷 数据访问与持久化" [level=2] [ref=e278]
          - button "toggle section" [ref=e279]
        - generic [ref=e281]:
          - link [ref=e285] [cursor=pointer]:
            - /url: /java-world/05-java-data-access/chapter-01-persistence-thought.html
            - paragraph [ref=e286]: 持久化思想
          - link [ref=e290] [cursor=pointer]:
            - /url: /java-world/05-java-data-access/chapter-02-jdbc.html
            - paragraph [ref=e291]: JDBC
          - link [ref=e295] [cursor=pointer]:
            - /url: /java-world/05-java-data-access/chapter-03-mybatis.html
            - paragraph [ref=e296]: MyBatis
          - link [ref=e300] [cursor=pointer]:
            - /url: /java-world/05-java-data-access/chapter-04-orm-deep.html
            - paragraph [ref=e301]: ORM 深入
          - link [ref=e305] [cursor=pointer]:
            - /url: /java-world/05-java-data-access/chapter-05-db-principles.html
            - paragraph [ref=e306]: 数据库核心原理
          - link [ref=e310] [cursor=pointer]:
            - /url: /java-world/05-java-data-access/chapter-06-spring-transaction.html
            - paragraph [ref=e311]: Spring 事务
          - link [ref=e315] [cursor=pointer]:
            - /url: /java-world/05-java-data-access/chapter-07-performance.html
            - paragraph [ref=e316]: 性能优化
      - generic [ref=e318]:
        - button [ref=e319] [cursor=pointer]:
          - heading "第六卷 企业架构" [level=2] [ref=e321]
          - button "toggle section" [ref=e322]
        - generic [ref=e324]:
          - link [ref=e328] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-01-spring-core.html
            - paragraph [ref=e329]: Spring 核心思想
          - link [ref=e333] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-02-container-aop.html
            - paragraph [ref=e334]: 容器与 AOP
          - link [ref=e338] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-03-spring-mvc.html
            - paragraph [ref=e339]: Spring MVC
          - link [ref=e343] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-04-spring-boot.html
            - paragraph [ref=e344]: Spring Boot
          - link [ref=e348] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-05-data-integration.html
            - paragraph [ref=e349]: 数据访问整合
          - link [ref=e353] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-06-microservices.html
            - paragraph [ref=e354]: 微服务架构
          - link [ref=e358] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-07-governance.html
            - paragraph [ref=e359]: 分布式治理
          - link [ref=e363] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-08-security-deploy.html
            - paragraph [ref=e364]: 安全与部署
          - link [ref=e368] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-09-observability.html
            - paragraph [ref=e369]: 可观测性
      - generic [ref=e371]:
        - button [ref=e372] [cursor=pointer]:
          - heading "第七卷 性能与架构" [level=2] [ref=e374]
          - button "toggle section" [ref=e375]
        - generic [ref=e377]:
          - link [ref=e381] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-01-architecture.html
            - paragraph [ref=e382]: 架构思想
          - link [ref=e386] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-02-ddd.html
            - paragraph [ref=e387]: 领域驱动设计
          - link [ref=e391] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-03-high-concurrency.html
            - paragraph [ref=e392]: 高并发设计
          - link [ref=e396] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-04-high-availability.html
            - paragraph [ref=e397]: 高可用设计
          - link [ref=e401] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-05-distributed.html
            - paragraph [ref=e402]: 分布式系统
          - link [ref=e406] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-06-data-architecture.html
            - paragraph [ref=e407]: 数据架构
          - link [ref=e411] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-07-messaging.html
            - paragraph [ref=e412]: 消息驱动
          - link [ref=e416] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-08-performance.html
            - paragraph [ref=e417]: 性能工程
          - link [ref=e421] [cursor=pointer]:
            - /url: /java-world/07-performance-architecture/chapter-09-case-studies.html
            - paragraph [ref=e422]: 架构案例
  - generic [ref=e425]:
    - navigation [ref=e431]:
      - generic [ref=e432]:
        - heading "本章目录" [level=2] [ref=e434]
        - list [ref=e435]:
          - listitem [ref=e436]:
            - link "1.1 Java 的设计目标" [ref=e437] [cursor=pointer]:
              - /url: "#_1-1-java-的设计目标"
            - list [ref=e438]:
              - listitem [ref=e439]:
                - link "软件世界为什么需要 Java" [ref=e440] [cursor=pointer]:
                  - /url: "#软件世界为什么需要-java"
              - listitem [ref=e441]:
                - link "Java 的核心设计目标" [ref=e442] [cursor=pointer]:
                  - /url: "#java-的核心设计目标"
              - listitem [ref=e443]:
                - link "Java 不是为了追求最快" [ref=e444] [cursor=pointer]:
                  - /url: "#java-不是为了追求最快"
              - listitem [ref=e445]:
                - link "一段 Java 代码是如何运行起来的" [ref=e446] [cursor=pointer]:
                  - /url: "#一段-java-代码是如何运行起来的"
              - listitem [ref=e447]:
                - link "Java 世界的组成" [ref=e448] [cursor=pointer]:
                  - /url: "#java-世界的组成"
          - listitem [ref=e449]:
            - link "1.2 基本类型与引用类型" [ref=e450] [cursor=pointer]:
              - /url: "#_1-2-基本类型与引用类型"
            - list [ref=e451]:
              - listitem [ref=e452]:
                - link "类型体系总览" [ref=e453] [cursor=pointer]:
                  - /url: "#类型体系总览"
              - listitem [ref=e454]:
                - link "Enum：编译器魔法加持的引用类型" [ref=e455] [cursor=pointer]:
                  - /url: "#enum-编译器魔法加持的引用类型"
              - listitem [ref=e456]:
                - link "ordinal() 的陷阱" [ref=e457] [cursor=pointer]:
                  - /url: "#ordinal-的陷阱"
              - listitem [ref=e458]:
                - link "EnumSet 与 EnumMap" [ref=e459] [cursor=pointer]:
                  - /url: "#enumset-与-enummap"
              - listitem [ref=e460]:
                - link "基本类型：性能与抽象之间的取舍" [ref=e461] [cursor=pointer]:
                  - /url: "#基本类型-性能与抽象之间的取舍"
              - listitem [ref=e462]:
                - link "引用类型：变量、引用与对象" [ref=e463] [cursor=pointer]:
                  - /url: "#引用类型-变量、引用与对象"
              - listitem [ref=e464]:
                - link "自动装箱与拆箱" [ref=e465] [cursor=pointer]:
                  - /url: "#自动装箱与拆箱"
          - listitem [ref=e466]:
            - link "1.3 对象模型：引用 vs 对象" [ref=e467] [cursor=pointer]:
              - /url: "#_1-3-对象模型-引用-vs-对象"
            - list [ref=e468]:
              - listitem [ref=e469]:
                - link "对象在哪里" [ref=e470] [cursor=pointer]:
                  - /url: "#对象在哪里"
              - listitem [ref=e471]:
                - link "null 的含义" [ref=e472] [cursor=pointer]:
                  - /url: "#null-的含义"
              - listitem [ref=e473]:
                - link "对象的创建过程" [ref=e474] [cursor=pointer]:
                  - /url: "#对象的创建过程"
              - listitem [ref=e475]:
                - link "对象的内存布局" [ref=e476] [cursor=pointer]:
                  - /url: "#对象的内存布局"
          - listitem [ref=e477]:
            - link "1.4 equals / hashCode / identity" [ref=e478] [cursor=pointer]:
              - /url: "#_1-4-equals-hashcode-identity"
            - list [ref=e479]:
              - listitem [ref=e480]:
                - link "三个层次" [ref=e481] [cursor=pointer]:
                  - /url: "#三个层次"
              - listitem [ref=e482]:
                - link "== 运算符" [ref=e483] [cursor=pointer]:
                  - /url: "#运算符"
              - listitem [ref=e484]:
                - link "equals() 方法" [ref=e485] [cursor=pointer]:
                  - /url: "#equals-方法"
              - listitem [ref=e486]:
                - link "hashCode() 的契约" [ref=e487] [cursor=pointer]:
                  - /url: "#hashcode-的契约"
              - listitem [ref=e488]:
                - link "Objects 工具类" [ref=e489] [cursor=pointer]:
                  - /url: "#objects-工具类"
          - listitem [ref=e490]:
            - link "1.5 String 与不可变对象" [ref=e491] [cursor=pointer]:
              - /url: "#_1-5-string-与不可变对象"
            - list [ref=e492]:
              - listitem [ref=e493]:
                - link "String 为什么是不可变的" [ref=e494] [cursor=pointer]:
                  - /url: "#string-为什么是不可变的"
              - listitem [ref=e495]:
                - link "字符串拼接的陷阱" [ref=e496] [cursor=pointer]:
                  - /url: "#字符串拼接的陷阱"
              - listitem [ref=e497]:
                - link "String.intern()" [ref=e498] [cursor=pointer]:
                  - /url: "#string-intern"
              - listitem [ref=e499]:
                - link "其他不可变对象" [ref=e500] [cursor=pointer]:
                  - /url: "#其他不可变对象"
          - listitem [ref=e501]:
            - link "1.6 类型转换与编译期检查" [ref=e502] [cursor=pointer]:
              - /url: "#_1-6-类型转换与编译期检查"
            - list [ref=e503]:
              - listitem [ref=e504]:
                - link "基本类型转换" [ref=e505] [cursor=pointer]:
                  - /url: "#基本类型转换"
              - listitem [ref=e506]:
                - link "引用类型转换" [ref=e507] [cursor=pointer]:
                  - /url: "#引用类型转换"
              - listitem [ref=e508]:
                - link "编译器如何利用类型" [ref=e509] [cursor=pointer]:
                  - /url: "#编译器如何利用类型"
    - generic [ref=e511]:
      - main [ref=e512]:
        - generic [ref=e514]:
          - heading [level=1] [ref=e515]:
            - text: 第一章 Java 基础与类型系统
            - link "Permalink to \"第一章 Java 基础与类型系统\"" [ref=e516] [cursor=pointer]:
              - /url: "#第一章-java-基础与类型系统"
              - text: "#"
          - blockquote [ref=e517]:
            - paragraph [ref=e518]:
              - text: Java 为什么要分基本类型和引用类型？这不是语法问题——是性能和安全在打架。
              - code [ref=e519]: int
              - text: 在栈上，4 字节，直接存值，一次 CPU 指令搞定加减乘除；
              - code [ref=e520]: Integer
              - text: 在堆上，16 字节对象头 + 4 字节 value，多一次内存解引用。差的不只是能不能传
              - code [ref=e521]: "null"
              - text: ——差的是一个数量级的访问开销和 GC 压力。选了
              - code [ref=e522]: int
              - text: 还是
              - code [ref=e523]: Integer
              - text: ，不只是"能不能存 null"的选择——是 CPU 周期和 GC 压力的选择。
          - separator [ref=e524]
          - heading [level=2] [ref=e525]:
            - text: 1.1 Java 的设计目标
            - link "Permalink to \"1.1 Java 的设计目标\"" [ref=e526] [cursor=pointer]:
              - /url: "#_1-1-java-的设计目标"
              - text: "#"
          - paragraph [ref=e527]: 每一种编程语言的诞生都是为了解决特定的问题。理解 Java，首先要理解它想解决什么。
          - heading [level=3] [ref=e528]:
            - text: 软件世界为什么需要 Java
            - link "Permalink to \"软件世界为什么需要 Java\"" [ref=e529] [cursor=pointer]:
              - /url: "#软件世界为什么需要-java"
              - text: "#"
          - paragraph [ref=e530]: 20 世纪 90 年代，C 和 C++ 统治着系统编程和应用开发。它们强大，但也带来了巨大的痛苦：
          - paragraph [ref=e531]:
            - strong [ref=e532]: C 的问题：
            - text: 手动管理内存。
            - code [ref=e533]: malloc
            - text: 分配，
            - code [ref=e534]: free
            - text: 释放，忘了就内存泄漏，释放两次就程序崩溃。指针可以指向任意内存地址，一个越界写入可能破坏整个程序的状态，而且错误往往在运行很久之后才暴露——调试成本极高。
          - paragraph [ref=e535]:
            - strong [ref=e536]: C++ 的问题：
            - text: 试图用面向对象来管理复杂性，但引入了新的复杂性。多重继承导致菱形继承问题，模板编译错误信息晦涩难懂，内存管理依然是手动的。C++ 给了开发者太多自由，也给了太多犯错的机会。
          - paragraph [ref=e537]:
            - text: 更根本的问题是
            - strong [ref=e538]: 跨平台
            - text: 。同一份 C/C++ 代码，在 Windows 上编译一次，在 Linux 上要重新编译，在 macOS 上又要编译一次。每个平台有不同的系统调用、不同的库、不同的二进制格式。对于需要在多种设备上运行的软件（想想 90 年代的机顶盒、嵌入式设备），这意味着巨大的移植成本。
          - paragraph [ref=e539]: Java 的出现就是为了解决这些问题。
          - heading [level=3] [ref=e540]:
            - text: Java 的核心设计目标
            - link "Permalink to \"Java 的核心设计目标\"" [ref=e541] [cursor=pointer]:
              - /url: "#java-的核心设计目标"
              - text: "#"
          - paragraph [ref=e542]: Java 的设计者 James Gosling 和他的团队在设计 Java（最初叫 Oak）时，确立了几个核心目标：
          - paragraph [ref=e543]:
            - strong [ref=e544]: 1. Write Once, Run Anywhere（一次编写，到处运行）
          - paragraph [ref=e545]: 这是 Java 最重要的设计目标。解决方案是在源码和机器码之间插入一层抽象——字节码（Bytecode）和虚拟机（JVM）。源码编译成字节码，字节码在 JVM 上运行，JVM 屏蔽了底层操作系统的差异。
          - generic [ref=e546]:
            - button "Copy Code" [ref=e547] [cursor=pointer]
            - generic [ref=e548]: text
            - code [ref=e550]:
              - generic [ref=e551]: C/C++：Source → Machine Code → 只能在特定平台运行
              - generic [ref=e552]: Java： Source → Bytecode → JVM → 任何平台都能运行
            - generic [ref=e553]: 1 2
          - paragraph [ref=e554]:
            - strong [ref=e555]: 2. 自动内存管理（GC）
          - paragraph [ref=e556]:
            - text: Java 不让开发者手动
            - code [ref=e557]: free
            - text: 内存，而是由垃圾回收器（Garbage Collector）自动识别和回收不再使用的对象。这消除了一整类 bug：内存泄漏、野指针、Use-After-Free、Double Free。
          - paragraph [ref=e558]: 代价是什么？GC 需要消耗 CPU 时间，偶尔会产生 Stop-The-World 停顿。但对于绝大多数应用来说，这个代价远小于手动内存管理带来的 bug 和调试成本。
          - paragraph [ref=e559]:
            - strong [ref=e560]: 3. 强类型系统
          - paragraph [ref=e561]:
            - text: Java 是静态强类型语言——每个变量在编译期就有确定的类型，编译器会在代码运行之前就检查类型错误。这意味着
            - code [ref=e562]: String s = 123;
            - text: 这样的错误在编译时就会被发现，而不是等到运行时才崩溃。
          - paragraph [ref=e563]:
            - strong [ref=e564]: 4. 安全沙箱
          - paragraph [ref=e565]: Java 的字节码在执行前要经过验证器（Verifier）检查，确保不会执行非法操作（如访问越界内存、绕过访问控制）。这使得 Java 可以安全地运行不受信任的代码——比如浏览器中的 Applet（虽然 Applet 已经被淘汰，但安全沙箱的思想延续到了 Android 等平台）。
          - paragraph [ref=e566]:
            - strong [ref=e567]: 5. 面向对象
          - paragraph [ref=e568]: Java 强制使用面向对象范式——所有代码都必须写在类里面。这不是限制，而是一种工程约束：面向对象提供了封装、继承、多态三种机制来管理软件复杂性。
          - paragraph [ref=e569]:
            - strong [ref=e570]: 6. 向后兼容
          - paragraph [ref=e571]: Java 非常重视向后兼容——用 Java 5 编译的代码，在 Java 21 的 JVM 上通常还能运行。这对企业级应用至关重要：没人愿意每次 JDK 升级都重写所有代码。
          - heading [level=3] [ref=e572]:
            - text: Java 不是为了追求最快
            - link "Permalink to \"Java 不是为了追求最快\"" [ref=e573] [cursor=pointer]:
              - /url: "#java-不是为了追求最快"
              - text: "#"
          - paragraph [ref=e574]:
            - text: 这是一个重要的认知。Java 的设计哲学从来不是"追求极致性能"，而是
            - strong [ref=e575]: 在性能、安全性、可维护性和开发效率之间寻找平衡
            - text: 。
          - paragraph [ref=e576]: C/C++ 可以比 Java 更快，因为它们可以直接操作内存、使用内联汇编。但这种"更快"的代价是更高的 bug 风险和更长的开发周期。
          - paragraph [ref=e577]: Java 选择了"足够快"——通过 JVM 的即时编译（JIT），Java 在长期运行的服务端场景下，性能可以接近甚至超过手写的 C++ 代码（因为 JIT 可以根据运行时信息做激进优化，这是 AOT 编译做不到的）。
          - paragraph [ref=e578]: 这个设计选择决定了 Java 的命运：它没有成为游戏引擎或操作系统内核的首选语言，但它成为了企业级应用、Web 后端、大数据处理、Android 开发的主流语言。在这些领域，开发效率和可维护性比极致性能更重要。
          - heading [level=3] [ref=e579]:
            - text: 一段 Java 代码是如何运行起来的
            - link "Permalink to \"一段 Java 代码是如何运行起来的\"" [ref=e580] [cursor=pointer]:
              - /url: "#一段-java-代码是如何运行起来的"
              - text: "#"
          - paragraph [ref=e581]: 在深入细节之前，先建立全局视角：
          - generic [ref=e582]:
            - button "Copy Code" [ref=e583] [cursor=pointer]
            - generic [ref=e584]: java
            - code [ref=e586]:
              - generic [ref=e587]: "public class Hello {"
              - generic [ref=e588]: "public static void main(String[] args) {"
              - generic [ref=e589]: System.out.println("Hello, World!");
              - generic [ref=e590]: "}"
              - generic [ref=e591]: "}"
            - generic [ref=e592]: 1 2 3 4 5
          - paragraph [ref=e593]: 这段代码从源码到 CPU 执行，经历了这些步骤：
          - img [ref=e595]:
            - generic [ref=e596]: Java 程序的执行流程
            - generic [ref=e598]: Hello.java（源码）
            - generic [ref=e599]: javac 编译
            - generic [ref=e601]: Hello.class（字节码）
            - generic [ref=e602]: JVM 加载
            - generic [ref=e604]: ClassLoader 加载字节码
            - generic [ref=e606]: JVM 验证、准备、初始化
            - generic [ref=e608]: 解释执行 / JIT 编译
            - generic [ref=e610]: CPU 执行机器码
          - paragraph [ref=e611]: 后面的每一章，都是在解释这条链路中的某一个环节。现在只需要建立这个整体认知，知道"Java 代码不是直接在 CPU 上跑的"就够了。
          - heading [level=3] [ref=e612]:
            - text: Java 世界的组成
            - link "Permalink to \"Java 世界的组成\"" [ref=e613] [cursor=pointer]:
              - /url: "#java-世界的组成"
              - text: "#"
          - paragraph [ref=e614]: 整本书，就是沿着以下维度一步一步拆解 Java：
          - list [ref=e615]:
            - listitem [ref=e616]:
              - strong [ref=e617]: Java Language
              - text: ：语言规范，定义了语法和语义
            - listitem [ref=e618]:
              - strong [ref=e619]: Compiler（javac）
              - text: ：将源码编译成字节码
            - listitem [ref=e620]:
              - strong [ref=e621]: Class File
              - text: ：字节码的载体，跨平台的核心契约
            - listitem [ref=e622]:
              - strong [ref=e623]: ClassLoader
              - text: ：将 class 文件加载进 JVM
            - listitem [ref=e624]:
              - strong [ref=e625]: JVM Runtime
              - text: ：执行字节码的引擎，包含内存管理、GC、JIT
            - listitem [ref=e626]:
              - strong [ref=e627]: JDK 标准库
              - text: ：集合、IO、并发、网络等基础能力
            - listitem [ref=e628]:
              - strong [ref=e629]: 生态框架
              - text: ：Spring、MyBatis、Netty 等
          - paragraph [ref=e630]: 你现在读的第一卷，覆盖的是 Java Language。第二卷覆盖 JVM Runtime。后面每一卷，都在填充这张地图中的一块。
          - separator [ref=e631]
          - heading [level=2] [ref=e632]:
            - text: 1.2 基本类型与引用类型
            - link "Permalink to \"1.2 基本类型与引用类型\"" [ref=e633] [cursor=pointer]:
              - /url: "#_1-2-基本类型与引用类型"
              - text: "#"
          - paragraph [ref=e634]: Java 的类型世界分为两大阵营：基本类型（Primitive）和引用类型（Reference）。理解这个划分，是理解 JVM 运行时内存结构、对象模型、泛型的前提。
          - heading [level=3] [ref=e635]:
            - text: 类型体系总览
            - link "Permalink to \"类型体系总览\"" [ref=e636] [cursor=pointer]:
              - /url: "#类型体系总览"
              - text: "#"
          - img [ref=e638]:
            - generic [ref=e639]: Java 类型体系
            - generic [ref=e641]: Type
            - generic [ref=e645]: Primitive
            - generic [ref=e647]: Reference
            - generic [ref=e649]: int
            - generic [ref=e651]: long
            - generic [ref=e653]: double
            - generic [ref=e655]: boolean
            - generic [ref=e657]: char
            - generic [ref=e659]: ...
            - generic [ref=e661]: Class
            - generic [ref=e663]: Interface
            - generic [ref=e665]: Array
            - generic [ref=e667]: Enum
            - generic [ref=e669]: Record
            - generic [ref=e671]: ...
            - generic [ref=e672]: 8 种基本类型是值类型，其余一切皆对象（引用类型）
          - heading [level=3] [ref=e673]:
            - text: Enum：编译器魔法加持的引用类型
            - link "Permalink to \"Enum：编译器魔法加持的引用类型\"" [ref=e674] [cursor=pointer]:
              - /url: "#enum-编译器魔法加持的引用类型"
              - text: "#"
          - paragraph [ref=e675]: Enum 是引用类型家族中一个特殊的存在。说它是类，它确实有字段、有方法、可以实现接口；说它不是类，它的实例在类加载时就固定了，不能 new，不能继承。编译器对 Enum 有一整套特殊支持，理解这些“魔法”才能用好它。
          - generic [ref=e676]:
            - button "Copy Code" [ref=e677] [cursor=pointer]
            - generic [ref=e678]: java
            - code [ref=e680]:
              - generic [ref=e681]: "public enum Color {"
              - generic [ref=e682]: RED, GREEN, BLUE
              - generic [ref=e683]: "}"
            - generic [ref=e684]: 1 2 3
          - paragraph [ref=e685]: 编译器将这段代码生成为：
          - generic [ref=e686]:
            - button "Copy Code" [ref=e687] [cursor=pointer]
            - generic [ref=e688]: java
            - code [ref=e690]:
              - generic [ref=e691]: "public final class Color extends Enum<Color> {"
              - generic [ref=e692]: public static final Color RED = new Color("RED", 0);
              - generic [ref=e693]: public static final Color GREEN = new Color("GREEN", 1);
              - generic [ref=e694]: public static final Color BLUE = new Color("BLUE", 2);
              - generic [ref=e695]: "private Color(String name, int ordinal) { ... }"
              - generic [ref=e696]: "public static Color[] values() { ... } // 编译器生成"
              - generic [ref=e697]: "public static Color valueOf(String name) { ... } // 编译器生成"
              - generic [ref=e698]: "}"
            - generic [ref=e699]: 1 2 3 4 5 6 7 8 9 10
          - paragraph [ref=e700]: 几个关键特性：
          - paragraph [ref=e701]:
            - strong [ref=e702]: 1. 天然单例。
            - text: 枚举常量在类加载时创建，JVM 保证唯一。这就是为什么 Effective Java 推荐用 Enum 实现单例模式——比
            - code [ref=e703]: private static final
            - text: 更安全，且天然防反射和序列化攻击。
          - paragraph [ref=e704]:
            - strong [ref=e705]: 2. 可以有字段和方法。
            - text: Enum 本质是类，可以有构造方法、字段、方法：
          - generic [ref=e706]:
            - button "Copy Code" [ref=e707] [cursor=pointer]
            - generic [ref=e708]: java
            - code [ref=e710]:
              - generic [ref=e711]: "public enum HttpStatus {"
              - generic [ref=e712]: OK(200, "Success"),
              - generic [ref=e713]: NOT_FOUND(404, "Not Found"),
              - generic [ref=e714]: INTERNAL_ERROR(500, "Server Error");
              - generic [ref=e715]: private final int code;
              - generic [ref=e716]: private final String message;
              - generic [ref=e717]: "HttpStatus(int code, String message) {"
              - generic [ref=e718]: this.code = code;
              - generic [ref=e719]: this.message = message;
              - generic [ref=e720]: "}"
              - generic [ref=e721]: "public int getCode() { return code; }"
              - generic [ref=e722]: "}"
            - generic [ref=e723]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
          - paragraph [ref=e724]:
            - strong [ref=e725]: 3. 可以实现接口。
            - code [ref=e726]: "enum Color implements Serializable { ... }"
          - paragraph [ref=e727]:
            - strong [ref=e728]: 4. 天然线程安全。
            - text: 枚举常量是
            - code [ref=e729]: static final
            - text: 的，不可变，不需要同步。
          - paragraph [ref=e730]:
            - strong [ref=e731]: 5. 可以用于 switch。
            - text: 这是 Enum 最常见的使用场景之一。
          - heading [level=3] [ref=e732]:
            - text: ordinal() 的陷阱
            - link "Permalink to \"ordinal() 的陷阱\"" [ref=e733] [cursor=pointer]:
              - /url: "#ordinal-的陷阱"
              - text: "#"
          - paragraph [ref=e734]:
            - text: 每个枚举常量有一个
            - code [ref=e735]: ordinal()
            - text: 方法，返回它在声明中的位置（从 0 开始）。
            - strong [ref=e736]: 不要用 ordinal 做业务逻辑
            - text: ：
          - generic [ref=e737]:
            - button "Copy Code" [ref=e738] [cursor=pointer]
            - generic [ref=e739]: java
            - code [ref=e741]:
              - generic [ref=e742]: "public enum Size { SMALL, MEDIUM, LARGE }"
              - generic [ref=e743]: Size.SMALL.ordinal() // 0
              - generic [ref=e744]: Size.MEDIUM.ordinal() // 1
              - generic [ref=e745]: Size.LARGE.ordinal() // 2
            - generic [ref=e746]: 1 2 3 4 5
          - paragraph [ref=e747]:
            - text: 如果在
            - code [ref=e748]: MEDIUM
            - text: 和
            - code [ref=e749]: LARGE
            - text: 之间插入一个
            - code [ref=e750]: EXTRA_LARGE
            - text: ，所有后续的 ordinal 都变了——依赖 ordinal 的代码会出 bug。用枚举常量本身或自定义字段来表示业务值。
          - heading [level=3] [ref=e751]:
            - text: EnumSet 与 EnumMap
            - link "Permalink to \"EnumSet 与 EnumMap\"" [ref=e752] [cursor=pointer]:
              - /url: "#enumset-与-enummap"
              - text: "#"
          - paragraph [ref=e753]: Java 提供了两个专门针对 Enum 优化的集合：
          - list [ref=e754]:
            - listitem [ref=e755]:
              - strong [ref=e756]:
                - code [ref=e757]: EnumSet
              - text: ：用位向量实现的 Set，比
              - code [ref=e758]: HashSet
              - text: 更高效（每个枚举常量对应一个 bit）
            - listitem [ref=e759]:
              - strong [ref=e760]:
                - code [ref=e761]: EnumMap
              - text: ：用数组实现的 Map，key 是枚举常量，比
              - code [ref=e762]: HashMap
              - text: 更高效
          - generic [ref=e763]:
            - button "Copy Code" [ref=e764] [cursor=pointer]
            - generic [ref=e765]: java
            - code [ref=e767]:
              - generic [ref=e768]: EnumSet<Color> warmColors = EnumSet.of(Color.RED, Color.ORANGE, Color.YELLOW);
              - generic [ref=e769]: EnumMap<Color, String> colorNames = new EnumMap<>(Color.class);
            - generic [ref=e770]: 1 2
          - paragraph [ref=e771]:
            - text: 如果 key 是枚举类型，优先用
            - code [ref=e772]: EnumMap
            - text: 而非
            - code [ref=e773]: HashMap
            - text: 。
          - heading [level=3] [ref=e774]:
            - text: 基本类型：性能与抽象之间的取舍
            - link "Permalink to \"基本类型：性能与抽象之间的取舍\"" [ref=e775] [cursor=pointer]:
              - /url: "#基本类型-性能与抽象之间的取舍"
              - text: "#"
          - paragraph [ref=e776]: Java 有 8 种基本类型：
          - table [ref=e777]:
            - rowgroup [ref=e778]:
              - row [ref=e779]:
                - columnheader "类型" [ref=e780]
                - columnheader "大小" [ref=e781]
                - columnheader "范围" [ref=e782]
                - columnheader "默认值" [ref=e783]
            - rowgroup [ref=e784]:
              - row [ref=e785]:
                - cell [ref=e786]:
                  - code [ref=e787]: byte
                - cell "1 字节" [ref=e788]
                - cell "-128 ~ 127" [ref=e789]
                - cell "0" [ref=e790]
              - row [ref=e791]:
                - cell [ref=e792]:
                  - code [ref=e793]: short
                - cell "2 字节" [ref=e794]
                - cell "-32768 ~ 32767" [ref=e795]
                - cell "0" [ref=e796]
              - row [ref=e797]:
                - cell [ref=e798]:
                  - code [ref=e799]: int
                - cell "4 字节" [ref=e800]
                - cell "-2^31 ~ 2^31-1" [ref=e801]
                - cell "0" [ref=e802]
              - row [ref=e803]:
                - cell [ref=e804]:
                  - code [ref=e805]: long
                - cell "8 字节" [ref=e806]
                - cell "-2^63 ~ 2^63-1" [ref=e807]
                - cell "0L" [ref=e808]
              - row [ref=e809]:
                - cell [ref=e810]:
                  - code [ref=e811]: float
                - cell "4 字节" [ref=e812]
                - cell "IEEE 754 单精度" [ref=e813]
                - cell "0.0f" [ref=e814]
              - row [ref=e815]:
                - cell [ref=e816]:
                  - code [ref=e817]: double
                - cell "8 字节" [ref=e818]
                - cell "IEEE 754 双精度" [ref=e819]
                - cell "0.0d" [ref=e820]
              - row [ref=e821]:
                - cell [ref=e822]:
                  - code [ref=e823]: char
                - cell "2 字节" [ref=e824]
                - cell "0 ~ 65535" [ref=e825]
                - cell "'\\u0000'" [ref=e826]
              - row [ref=e827]:
                - cell [ref=e828]:
                  - code [ref=e829]: boolean
                - cell "1 位/1 字节" [ref=e830]
                - cell "true / false" [ref=e831]
                - cell "false" [ref=e832]
          - paragraph [ref=e833]:
            - strong [ref=e834]: 为什么 Java 要有基本类型？
            - text: 两个字：
            - strong [ref=e835]: 性能
            - text: 。
          - paragraph [ref=e836]: 如果所有东西都是对象：
          - generic [ref=e837]:
            - button "Copy Code" [ref=e838] [cursor=pointer]
            - generic [ref=e839]: java
            - code [ref=e841]:
              - generic [ref=e842]: Integer i = new Integer(10);
            - generic [ref=e843]: "1"
          - paragraph [ref=e844]: 每次创建一个整数，都需要：
          - list [ref=e845]:
            - listitem [ref=e846]: 在堆上分配内存（对象头 + 实例数据 + 对齐填充）
            - listitem [ref=e847]: 创建对象引用
            - listitem [ref=e848]: GC 最终需要回收这个对象
          - paragraph [ref=e849]:
            - text: 对于一个简单的循环计数器
            - code [ref=e850]: for (int i = 0; i < 1000000; i++)
            - text: ，如果每次都创建一个 Integer 对象，会产生巨大的内存分配压力和 GC 负担。
          - paragraph [ref=e851]: 基本类型直接在栈上存储值，没有对象头，没有 GC 开销，CPU 缓存友好。这是 Java 在"纯面向对象"和"实际性能"之间做出的务实妥协。
          - heading [level=3] [ref=e852]:
            - text: 引用类型：变量、引用与对象
            - link "Permalink to \"引用类型：变量、引用与对象\"" [ref=e853] [cursor=pointer]:
              - /url: "#引用类型-变量、引用与对象"
              - text: "#"
          - paragraph [ref=e854]: 这是很多开发者理解不清的地方。看这行代码：
          - generic [ref=e855]:
            - button "Copy Code" [ref=e856] [cursor=pointer]
            - generic [ref=e857]: java
            - code [ref=e859]:
              - generic [ref=e860]: User user = new User();
            - generic [ref=e861]: "1"
          - paragraph [ref=e862]:
            - text: 很多人认为"变量
            - code [ref=e863]: user
            - text: 就是对象"。实际上：
          - img [ref=e865]:
            - generic [ref=e866]: 栈与堆的协作关系
            - generic [ref=e868]: 栈（Stack）
            - generic [ref=e870]: user
            - generic [ref=e871]: 引用地址 → 0x7f8b
            - generic [ref=e873]: 堆（Heap）
            - generic [ref=e876]: User 对象
            - generic [ref=e877]: ├─ 对象头
            - generic [ref=e878]: "├─ name: null"
            - generic [ref=e879]: "└─ age: 0"
            - generic [ref=e880]: 局部变量（基本类型 + 引用）
            - generic [ref=e881]: 对象实例（new 出来的）
          - list [ref=e882]:
            - listitem [ref=e883]:
              - strong [ref=e884]:
                - text: 变量
                - code [ref=e885]: user
              - text: 存在栈上，保存的是一个
              - strong [ref=e886]: 引用
              - text: （本质上是一个内存地址）
            - listitem [ref=e887]:
              - strong [ref=e888]: 对象本身
              - text: 存在堆上，包含对象头和实例数据
            - listitem [ref=e889]:
              - code [ref=e890]: user
              - text: 不是对象，它是
              - strong [ref=e891]: 指向对象的引用
          - paragraph [ref=e892]: 这个区分非常重要，因为它直接影响你对赋值、传参、相等性判断的理解：
          - generic [ref=e893]:
            - button "Copy Code" [ref=e894] [cursor=pointer]
            - generic [ref=e895]: java
            - code [ref=e897]:
              - generic [ref=e898]: User a = new User();
              - generic [ref=e899]: User b = a; // b 和 a 指向同一个对象
              - generic [ref=e900]: b.name = "Tom";
              - generic [ref=e901]: System.out.println(a.name); // 输出 "Tom"——因为 a 和 b 是同一个对象
            - generic [ref=e902]: 1 2 3 4
          - paragraph [ref=e903]:
            - text: 赋值
            - code [ref=e904]: b = a
            - text: 不是复制对象，而是复制引用。两个引用指向堆上的同一个对象。
          - heading [level=3] [ref=e905]:
            - text: 自动装箱与拆箱
            - link "Permalink to \"自动装箱与拆箱\"" [ref=e906] [cursor=pointer]:
              - /url: "#自动装箱与拆箱"
              - text: "#"
          - paragraph [ref=e907]: Java 5 引入了自动装箱（Autoboxing），让基本类型和包装类型之间可以自动转换：
          - generic [ref=e908]:
            - button "Copy Code" [ref=e909] [cursor=pointer]
            - generic [ref=e910]: java
            - code [ref=e912]:
              - generic [ref=e913]: int a = 10;
              - generic [ref=e914]: Integer b = a; // 自动装箱：int → Integer
              - generic [ref=e915]: int c = b; // 自动拆箱：Integer → int
            - generic [ref=e916]: 1 2 3
          - paragraph [ref=e917]:
            - text: 装箱的本质是调用
            - code [ref=e918]: Integer.valueOf(a)
            - text: ，拆箱的本质是调用
            - code [ref=e919]: b.intValue()
            - text: 。
          - paragraph [ref=e920]: 自动装箱带来了一些隐蔽的性能问题：
          - generic [ref=e921]:
            - button "Copy Code" [ref=e922] [cursor=pointer]
            - generic [ref=e923]: java
            - code [ref=e925]:
              - generic [ref=e926]: // ❌ 性能陷阱：每次循环都创建一个新的 Integer 对象
              - generic [ref=e927]: Long sum = 0L;
              - generic [ref=e928]: "for (long i = 0; i < 10000000L; i++) {"
              - generic [ref=e929]: sum += i; // 每次 += 都涉及拆箱 → 加法 → 装箱
              - generic [ref=e930]: "}"
              - generic [ref=e931]: // ✅ 正确做法：使用基本类型
              - generic [ref=e932]: long sum = 0L;
              - generic [ref=e933]: "for (long i = 0; i < 10000000L; i++) {"
              - generic [ref=e934]: sum += i;
              - generic [ref=e935]: "}"
            - generic [ref=e936]: 1 2 3 4 5 6 7 8 9 10 11
          - paragraph [ref=e937]: 还有一个经典的面试坑：
          - generic [ref=e938]:
            - button "Copy Code" [ref=e939] [cursor=pointer]
            - generic [ref=e940]: java
            - code [ref=e942]:
              - generic [ref=e943]: Integer a = 127;
              - generic [ref=e944]: Integer b = 127;
              - generic [ref=e945]: System.out.println(a == b); // true（IntegerCache 缓存了 -128 ~ 127）
              - generic [ref=e946]: Integer c = 128;
              - generic [ref=e947]: Integer d = 128;
              - generic [ref=e948]: System.out.println(c == d); // false（超出缓存范围，创建了两个不同对象）
            - generic [ref=e949]: 1 2 3 4 5 6 7
          - paragraph [ref=e950]:
            - code [ref=e951]: Integer.valueOf()
            - text: 对 -128 到 127 之间的值做了缓存。这是 JDK 的实现细节，但面试经常考。记住：
            - strong [ref=e952]:
              - text: 比较包装类型永远用
              - code [ref=e953]: equals()
              - text: ，不要用
              - code [ref=e954]: ==
            - text: 。
          - separator [ref=e955]
          - heading [level=2] [ref=e956]:
            - text: 1.3 对象模型：引用 vs 对象
            - link "Permalink to \"1.3 对象模型：引用 vs 对象\"" [ref=e957] [cursor=pointer]:
              - /url: "#_1-3-对象模型-引用-vs-对象"
              - text: "#"
          - paragraph [ref=e958]: 深入理解 Java 的对象模型，是理解 JVM 内存布局、GC、并发锁机制的前提。
          - heading [level=3] [ref=e959]:
            - text: 对象在哪里
            - link "Permalink to \"对象在哪里\"" [ref=e960] [cursor=pointer]:
              - /url: "#对象在哪里"
              - text: "#"
          - paragraph [ref=e961]:
            - text: Java 中，对象实例存储在**堆（Heap）
            - strong [ref=e962]: 上，局部变量和对象引用存储在
            - text: 栈（Stack）**上。
          - generic [ref=e963]:
            - button "Copy Code" [ref=e964] [cursor=pointer]
            - generic [ref=e965]: java
            - code [ref=e967]:
              - generic [ref=e968]: "public void process() {"
              - generic [ref=e969]: int count = 10; // count 在栈上
              - generic [ref=e970]: User user = new User(); // user 引用在栈上，User 对象在堆上
              - generic [ref=e971]: user.name = "Tom"; // 通过引用操作堆上的对象
              - generic [ref=e972]: "}"
            - generic [ref=e973]: 1 2 3 4 5
          - paragraph [ref=e974]:
            - text: 当方法
            - code [ref=e975]: process()
            - text: 执行完毕：
          - list [ref=e976]:
            - listitem [ref=e977]:
              - text: 栈帧被弹出，
              - code [ref=e978]: count
              - text: 和
              - code [ref=e979]: user
              - text: 引用消失
            - listitem [ref=e980]: 堆上的 User 对象变成"不可达"（没有引用指向它了）
            - listitem [ref=e981]: GC 在某个时刻回收这个对象
          - heading [level=3] [ref=e982]:
            - text: null 的含义
            - link "Permalink to \"null 的含义\"" [ref=e983] [cursor=pointer]:
              - /url: "#null-的含义"
              - text: "#"
          - generic [ref=e984]:
            - button "Copy Code" [ref=e985] [cursor=pointer]
            - generic [ref=e986]: java
            - code [ref=e988]:
              - generic [ref=e989]: User user = null;
            - generic [ref=e990]: "1"
          - paragraph [ref=e991]:
            - code [ref=e992]: "null"
            - text: 表示"这个引用不指向任何对象"。它不是对象，不是空字符串，不是零——它是一个
            - strong [ref=e993]: 空引用
            - text: 。
          - paragraph [ref=e994]:
            - text: 对
            - code [ref=e995]: "null"
            - text: 调用任何方法都会抛出
            - code [ref=e996]: NullPointerException
            - text: （NPE）：
          - generic [ref=e997]:
            - button "Copy Code" [ref=e998] [cursor=pointer]
            - generic [ref=e999]: java
            - code [ref=e1001]:
              - generic [ref=e1002]: User user = null;
              - generic [ref=e1003]: user.getName(); // NPE!
            - generic [ref=e1004]: 1 2
          - paragraph [ref=e1005]:
            - text: NPE 是 Java 中最常见的运行时异常之一。后面的 Lambda 章节会讲
            - code [ref=e1006]: Optional
            - text: 如何用类型系统来表达"值可能不存在"，从而减少 NPE。
          - heading [level=3] [ref=e1007]:
            - text: 对象的创建过程
            - link "Permalink to \"对象的创建过程\"" [ref=e1008] [cursor=pointer]:
              - /url: "#对象的创建过程"
              - text: "#"
          - paragraph [ref=e1009]:
            - text: 当你写
            - code [ref=e1010]: new User()
            - text: 时，JVM 做了什么？
          - img [ref=e1012]:
            - generic [ref=e1013]: 对象创建流程（new User("Tom")）
            - generic [ref=e1015]: 1. 类加载检查
            - generic [ref=e1016]: User 类是否已加载？没有 → 先执行类加载
            - generic [ref=e1018]: 2. 分配内存
            - generic [ref=e1020]: 堆内存是否规整？
            - generic [ref=e1021]: 由 GC 算法决定
            - generic [ref=e1023]: 是
            - generic [ref=e1024]: 指针碰撞
            - generic [ref=e1026]: 否
            - generic [ref=e1027]: 空闲列表
            - generic [ref=e1029]: 线程安全？
            - generic [ref=e1031]: TLAB：每个线程在 Eden 有私有缓冲区，无需 CAS
            - generic [ref=e1033]: TLAB 用完 → Eden 共享区分配，需要 CAS 同步
            - generic [ref=e1035]: 3. 初始化零值
            - generic [ref=e1036]: int=0, boolean=false, 引用=null
            - generic [ref=e1037]: JVM 保证零值初始化，字段使用前必有确定值
            - generic [ref=e1039]: 4. 设置对象头
            - generic [ref=e1040]: Mark Word（hashCode、GC 年龄、锁状态）
            - generic [ref=e1041]: Klass Pointer（指向方法区中的类元数据）
            - generic [ref=e1043]: 5. 执行 <init> 构造方法
            - generic [ref=e1044]: 你写的构造方法代码
            - generic [ref=e1046]: TLAB 是关键优化
            - generic [ref=e1047]: 没有 TLAB，多线程同时在 Eden 分配对象需要加锁（CAS）
            - generic [ref=e1048]: TLAB 让每个线程有自己的"私人领地"，分配只需移动指针
            - generic [ref=e1049]: "-XX:+UseTLAB 默认开启，大部分对象分配无需真正同步"
            - generic [ref=e1050]: 超过 -XX:PretenureSizeThreshold 的大对象直接分配在老年代
            - generic [ref=e1051]: 共 5 步：类加载 → 分配内存 → 零值初始化 → 设置对象头 → 执行构造方法
          - paragraph [ref=e1052]: 现在只需要知道：对象创建不是一瞬间的事，JVM 做了很多幕后工作。第二卷"对象模型"一章会详细展开。
          - heading [level=3] [ref=e1053]:
            - text: 对象的内存布局
            - link "Permalink to \"对象的内存布局\"" [ref=e1054] [cursor=pointer]:
              - /url: "#对象的内存布局"
              - text: "#"
          - paragraph [ref=e1055]: HotSpot JVM 中，一个 Java 对象在堆中的结构：
          - img [ref=e1057]:
            - generic [ref=e1058]: HotSpot 对象内存布局（64 位 JVM）
            - generic [ref=e1060]: 对象头（Object Header）
            - generic [ref=e1062]: Mark Word
            - generic [ref=e1063]: 8 字节（64 bit）
            - generic [ref=e1064]: hashCode / GC 年龄
            - generic [ref=e1065]: 锁状态标志
            - generic [ref=e1067]: Klass Pointer
            - generic [ref=e1068]: 4 或 8 字节
            - generic [ref=e1069]: 指向方法区中
            - generic [ref=e1070]: 该类的元数据
            - generic [ref=e1072]: 实例数据（Instance Data）
            - generic [ref=e1074]: 父类字段在前
            - generic [ref=e1076]: 子类字段在后
            - generic [ref=e1078]: int id / String name / boolean active ...
            - generic [ref=e1080]: 对齐填充（Padding）
            - generic [ref=e1081]: 保证对象总大小是 8 字节的整数倍
            - generic [ref=e1082]: 12~16 字节
            - generic [ref=e1083]: 大小不固定
            - generic [ref=e1085]: 压缩指针（-XX:+UseCompressedOops）
            - generic [ref=e1086]: 64 位 JVM 默认开启 → Klass Pointer 占 4 字节
            - generic [ref=e1087]: 关闭时 → Klass Pointer 占 8 字节
            - generic [ref=e1088]: Mark Word 与锁状态
            - generic [ref=e1089]: 加锁后 Mark Word 内容被覆盖，存储锁信息而非 hashCode
            - generic [ref=e1090]: 对象头 | 实例数据 | 对齐填充 → 8 字节对齐
          - paragraph [ref=e1091]:
            - text: 对象头中的
            - strong [ref=e1092]: Mark Word
            - text: 非常重要——它不仅存储 hashCode 和 GC 年龄，还存储锁状态信息。当对象被
            - code [ref=e1093]: synchronized
            - text: 锁住时，Mark Word 的内容会发生变化（偏向锁 → 轻量级锁 → 重量级锁）。这是第三卷
            - code [ref=e1094]: synchronized
            - text: 的关键前置知识。
          - separator [ref=e1095]
          - heading [level=2] [ref=e1096]:
            - text: 1.4 equals / hashCode / identity
            - link "Permalink to \"1.4 equals / hashCode / identity\"" [ref=e1097] [cursor=pointer]:
              - /url: "#_1-4-equals-hashcode-identity"
              - text: "#"
          - paragraph [ref=e1098]:
            - text: 对象相等性是 Java 中最容易出错的概念之一。很多 bug 的根源就是对
            - code [ref=e1099]: ==
            - text: 和
            - code [ref=e1100]: equals()
            - text: 的混淆。
          - heading [level=3] [ref=e1101]:
            - text: 三个层次
            - link "Permalink to \"三个层次\"" [ref=e1102] [cursor=pointer]:
              - /url: "#三个层次"
              - text: "#"
          - table [ref=e1103]:
            - rowgroup [ref=e1104]:
              - row [ref=e1105]:
                - columnheader "层次" [ref=e1106]
                - columnheader "含义" [ref=e1107]
                - columnheader "运算符/方法" [ref=e1108]
            - rowgroup [ref=e1109]:
              - row [ref=e1110]:
                - cell [ref=e1111]:
                  - strong [ref=e1112]: identity
                - cell "是否同一个对象（内存地址相同）" [ref=e1113]
                - cell [ref=e1114]:
                  - code [ref=e1115]: ==
              - row [ref=e1116]:
                - cell [ref=e1117]:
                  - strong [ref=e1118]: equality
                - cell "逻辑上是否相等" [ref=e1119]
                - cell [ref=e1120]:
                  - code [ref=e1121]: equals()
              - row [ref=e1122]:
                - cell [ref=e1123]:
                  - strong [ref=e1124]: hash
                - cell "对象的哈希指纹" [ref=e1125]
                - cell [ref=e1126]:
                  - code [ref=e1127]: hashCode()
          - generic [ref=e1128]:
            - button "Copy Code" [ref=e1129] [cursor=pointer]
            - generic [ref=e1130]: java
            - code [ref=e1132]:
              - generic [ref=e1133]: String a = new String("hello");
              - generic [ref=e1134]: String b = new String("hello");
              - generic [ref=e1135]: a == b // false——两个不同的对象
              - generic [ref=e1136]: a.equals(b) // true——逻辑上相等
            - generic [ref=e1137]: 1 2 3 4 5
          - heading [level=3] [ref=e1138]:
            - text: == 运算符
            - link "Permalink to \"== 运算符\"" [ref=e1139] [cursor=pointer]:
              - /url: "#运算符"
              - text: "#"
          - paragraph [ref=e1140]:
            - text: 对于基本类型，
            - code [ref=e1141]: ==
            - text: 比较的是
            - strong [ref=e1142]: 值
            - text: ：
          - generic [ref=e1143]:
            - button "Copy Code" [ref=e1144] [cursor=pointer]
            - generic [ref=e1145]: java
            - code [ref=e1147]:
              - generic [ref=e1148]: int x = 10;
              - generic [ref=e1149]: int y = 10;
              - generic [ref=e1150]: x == y // true
            - generic [ref=e1151]: 1 2 3
          - paragraph [ref=e1152]:
            - text: 对于引用类型，
            - code [ref=e1153]: ==
            - text: 比较的是
            - strong [ref=e1154]: 引用地址
            - text: （是否同一个对象）：
          - generic [ref=e1155]:
            - button "Copy Code" [ref=e1156] [cursor=pointer]
            - generic [ref=e1157]: java
            - code [ref=e1159]:
              - generic [ref=e1160]: User u1 = new User("Tom");
              - generic [ref=e1161]: User u2 = new User("Tom");
              - generic [ref=e1162]: u1 == u2 // false——两个不同的对象，虽然内容相同
            - generic [ref=e1163]: 1 2 3
          - heading [level=3] [ref=e1164]:
            - text: equals() 方法
            - link "Permalink to \"equals() 方法\"" [ref=e1165] [cursor=pointer]:
              - /url: "#equals-方法"
              - text: "#"
          - paragraph [ref=e1166]:
            - code [ref=e1167]: equals()
            - text: 是
            - code [ref=e1168]: Object
            - text: 类定义的方法，默认实现就是
            - code [ref=e1169]: ==
            - text: ：
          - generic [ref=e1170]:
            - button "Copy Code" [ref=e1171] [cursor=pointer]
            - generic [ref=e1172]: java
            - code [ref=e1174]:
              - generic [ref=e1175]: // Object 类的默认实现
              - generic [ref=e1176]: "public boolean equals(Object obj) {"
              - generic [ref=e1177]: return (this == obj);
              - generic [ref=e1178]: "}"
            - generic [ref=e1179]: 1 2 3 4
          - paragraph [ref=e1180]:
            - text: 如果想让"内容相同"的对象被视为相等，就需要
            - strong [ref=e1181]: 重写
            - code [ref=e1182]: equals()
            - text: ：
          - generic [ref=e1183]:
            - button "Copy Code" [ref=e1184] [cursor=pointer]
            - generic [ref=e1185]: java
            - code [ref=e1187]:
              - generic [ref=e1188]: "public class User {"
              - generic [ref=e1189]: private String name;
              - generic [ref=e1190]: private int age;
              - generic [ref=e1191]: "@Override"
              - generic [ref=e1192]: "public boolean equals(Object o) {"
              - generic [ref=e1193]: if (this == o) return true;
              - generic [ref=e1194]: if (o == null || getClass() != o.getClass()) return false;
              - generic [ref=e1195]: User user = (User) o;
              - generic [ref=e1196]: return age == user.age && Objects.equals(name, user.name);
              - generic [ref=e1197]: "}"
              - generic [ref=e1198]: "}"
            - generic [ref=e1199]: 1 2 3 4 5 6 7 8 9 10 11 12
          - heading [level=3] [ref=e1200]:
            - text: hashCode() 的契约
            - link "Permalink to \"hashCode() 的契约\"" [ref=e1201] [cursor=pointer]:
              - /url: "#hashcode-的契约"
              - text: "#"
          - paragraph [ref=e1202]: Java 规范要求：
          - list [ref=e1203]:
            - listitem [ref=e1204]:
              - strong [ref=e1205]:
                - text: 如果
                - code [ref=e1206]: a.equals(b)
                - text: 为 true，那么
                - code [ref=e1207]: a.hashCode()
                - text: 必须等于
                - code [ref=e1208]: b.hashCode()
            - listitem [ref=e1209]:
              - text: 如果
              - code [ref=e1210]: a.hashCode()
              - text: 等于
              - code [ref=e1211]: b.hashCode()
              - text: ，
              - code [ref=e1212]: a.equals(b)
              - text: 不一定为 true（哈希碰撞）
          - paragraph [ref=e1213]:
            - text: 为什么？因为
            - code [ref=e1214]: HashMap
            - text: 、
            - code [ref=e1215]: HashSet
            - text: 等哈希容器先用
            - code [ref=e1216]: hashCode()
            - text: 定位桶，再用
            - code [ref=e1217]: equals()
            - text: 判断是否是同一个 key。如果两个
            - code [ref=e1218]: equals()
            - text: 相等的对象有不同的
            - code [ref=e1219]: hashCode()
            - text: ，
            - code [ref=e1220]: HashMap
            - text: 会把它们放到不同的桶里——你
            - code [ref=e1221]: put
            - text: 了一个，
            - code [ref=e1222]: get
            - text: 另一个却找不到。
          - generic [ref=e1223]:
            - button "Copy Code" [ref=e1224] [cursor=pointer]
            - generic [ref=e1225]: java
            - code [ref=e1227]:
              - generic [ref=e1228]: // ❌ 经典 bug：重写了 equals 但没重写 hashCode
              - generic [ref=e1229]: User u1 = new User("Tom", 25);
              - generic [ref=e1230]: User u2 = new User("Tom", 25);
              - generic [ref=e1231]: Map<User, String> map = new HashMap<>();
              - generic [ref=e1232]: map.put(u1, "value");
              - generic [ref=e1233]: map.get(u2); // 可能返回 null！因为 u1 和 u2 的 hashCode 不同
            - generic [ref=e1234]: 1 2 3 4 5 6 7 8
          - paragraph [ref=e1235]:
            - strong [ref=e1236]:
              - text: 规则：重写
              - code [ref=e1237]: equals()
              - text: 必须同时重写
              - code [ref=e1238]: hashCode()
              - text: 。
            - text: 现代 IDE 可以一键生成这两个方法，没有理由手写犯错。
          - heading [level=3] [ref=e1239]:
            - text: Objects 工具类
            - link "Permalink to \"Objects 工具类\"" [ref=e1240] [cursor=pointer]:
              - /url: "#objects-工具类"
              - text: "#"
          - paragraph [ref=e1241]:
            - text: Java 7 引入的
            - code [ref=e1242]: Objects
            - text: 工具类简化了
            - code [ref=e1243]: equals()
            - text: 和
            - code [ref=e1244]: hashCode()
            - text: 的实现：
          - generic [ref=e1245]:
            - button "Copy Code" [ref=e1246] [cursor=pointer]
            - generic [ref=e1247]: java
            - code [ref=e1249]:
              - generic [ref=e1250]: "@Override"
              - generic [ref=e1251]: "public boolean equals(Object o) {"
              - generic [ref=e1252]: if (this == o) return true;
              - generic [ref=e1253]: if (!(o instanceof User)) return false;
              - generic [ref=e1254]: User user = (User) o;
              - generic [ref=e1255]: return age == user.age && Objects.equals(name, user.name);
              - generic [ref=e1256]: "}"
              - generic [ref=e1257]: "@Override"
              - generic [ref=e1258]: "public int hashCode() {"
              - generic [ref=e1259]: return Objects.hash(name, age);
              - generic [ref=e1260]: "}"
            - generic [ref=e1261]: 1 2 3 4 5 6 7 8 9 10 11 12
          - separator [ref=e1262]
          - heading [level=2] [ref=e1263]:
            - text: 1.5 String 与不可变对象
            - link "Permalink to \"1.5 String 与不可变对象\"" [ref=e1264] [cursor=pointer]:
              - /url: "#_1-5-string-与不可变对象"
              - text: "#"
          - paragraph [ref=e1265]:
            - code [ref=e1266]: String
            - text: 是 Java 中使用最频繁的类，也是理解不可变对象（Immutable Object）的最佳案例。
          - heading [level=3] [ref=e1267]:
            - text: String 为什么是不可变的
            - link "Permalink to \"String 为什么是不可变的\"" [ref=e1268] [cursor=pointer]:
              - /url: "#string-为什么是不可变的"
              - text: "#"
          - generic [ref=e1269]:
            - button "Copy Code" [ref=e1270] [cursor=pointer]
            - generic [ref=e1271]: java
            - code [ref=e1273]:
              - generic [ref=e1274]: "public final class String {"
              - generic [ref=e1275]: private final char[] value; // JDK 8 及之前
              - generic [ref=e1276]: // JDK 9+ 改为 byte[] + coder，节省内存
              - generic [ref=e1277]: "}"
            - generic [ref=e1278]: 1 2 3 4
          - paragraph [ref=e1279]:
            - code [ref=e1280]: String
            - text: 类是
            - code [ref=e1281]: final
            - text: 的（不能被继承），内部的
            - code [ref=e1282]: value
            - text: 数组也是
            - code [ref=e1283]: final
            - text: 的（不能被重新赋值），而且没有提供任何修改
            - code [ref=e1284]: value
            - text: 内容的方法。
          - paragraph [ref=e1285]:
            - strong [ref=e1286]: 为什么要设计成不可变？
          - paragraph [ref=e1287]:
            - strong [ref=e1288]: 1. 字符串常量池共享
          - generic [ref=e1289]:
            - button "Copy Code" [ref=e1290] [cursor=pointer]
            - generic [ref=e1291]: java
            - code [ref=e1293]:
              - generic [ref=e1294]: String a = "hello";
              - generic [ref=e1295]: String b = "hello";
              - generic [ref=e1296]: // a 和 b 指向常量池中同一个 "hello" 对象
            - generic [ref=e1297]: 1 2 3
          - paragraph [ref=e1298]:
            - text: 如果 String 是可变的，
            - code [ref=e1299]: a.append("!")
            - text: 就会把
            - code [ref=e1300]: b
            - text: 的值也改了——因为它们是同一个对象。不可变保证了共享是安全的。
          - paragraph [ref=e1301]:
            - strong [ref=e1302]: 2. 线程安全
          - paragraph [ref=e1303]: 不可变对象天然线程安全——没有任何线程可以修改它的状态，所以不需要同步。这是第三卷并发编程的重要基础。
          - paragraph [ref=e1304]:
            - strong [ref=e1305]: 3. 哈希缓存
          - paragraph [ref=e1306]:
            - text: String 的
            - code [ref=e1307]: hashCode()
            - text: 只需要计算一次，之后缓存起来。因为值不会变，hashCode 也不会变。这让 String 作为
            - code [ref=e1308]: HashMap
            - text: 的 key 非常高效。
          - heading [level=3] [ref=e1309]:
            - text: 字符串拼接的陷阱
            - link "Permalink to \"字符串拼接的陷阱\"" [ref=e1310] [cursor=pointer]:
              - /url: "#字符串拼接的陷阱"
              - text: "#"
          - generic [ref=e1311]:
            - button "Copy Code" [ref=e1312] [cursor=pointer]
            - generic [ref=e1313]: java
            - code [ref=e1315]:
              - generic [ref=e1316]: String result = "";
              - generic [ref=e1317]: "for (int i = 0; i < 10000; i++) {"
              - generic [ref=e1318]: result += i; // 每次 += 都创建一个新的 String 对象
              - generic [ref=e1319]: "}"
            - generic [ref=e1320]: 1 2 3 4
          - paragraph [ref=e1321]:
            - text: 每次
            - code [ref=e1322]: +=
            - text: 都会：
          - list [ref=e1323]:
            - listitem [ref=e1324]:
              - text: 创建一个
              - code [ref=e1325]: StringBuilder
            - listitem [ref=e1326]: append 当前字符串和新值
            - listitem [ref=e1327]:
              - text: 调用
              - code [ref=e1328]: toString()
              - text: 创建一个新的 String 对象
          - paragraph [ref=e1329]: 10000 次循环 = 10000 个临时 StringBuilder + 10000 个临时 String。
          - generic [ref=e1330]:
            - button "Copy Code" [ref=e1331] [cursor=pointer]
            - generic [ref=e1332]: java
            - code [ref=e1334]:
              - generic [ref=e1335]: // ✅ 正确做法
              - generic [ref=e1336]: StringBuilder sb = new StringBuilder();
              - generic [ref=e1337]: "for (int i = 0; i < 10000; i++) {"
              - generic [ref=e1338]: sb.append(i);
              - generic [ref=e1339]: "}"
              - generic [ref=e1340]: String result = sb.toString();
            - generic [ref=e1341]: 1 2 3 4 5 6
          - heading [level=3] [ref=e1342]:
            - text: String.intern()
            - link "Permalink to \"String.intern()\"" [ref=e1343] [cursor=pointer]:
              - /url: "#string-intern"
              - text: "#"
          - generic [ref=e1344]:
            - button "Copy Code" [ref=e1345] [cursor=pointer]
            - generic [ref=e1346]: java
            - code [ref=e1348]:
              - generic [ref=e1349]: String a = new String("hello"); // 堆上新对象
              - generic [ref=e1350]: String b = a.intern(); // 放入常量池，返回常量池中的引用
              - generic [ref=e1351]: String c = "hello"; // 直接引用常量池
              - generic [ref=e1352]: b == c // true
            - generic [ref=e1353]: 1 2 3 4 5
          - paragraph [ref=e1354]:
            - code [ref=e1355]: intern()
            - text: 将字符串放入 JVM 的字符串常量池（StringTable）。JDK 7 之后，StringTable 从永久代移到了堆中，由 GC 管理。适度使用
            - code [ref=e1356]: intern()
            - text: 可以节省内存（重复字符串只存一份），但过度使用会导致 StringTable 膨胀，反而增加 GC 压力。
          - heading [level=3] [ref=e1357]:
            - text: 其他不可变对象
            - link "Permalink to \"其他不可变对象\"" [ref=e1358] [cursor=pointer]:
              - /url: "#其他不可变对象"
              - text: "#"
          - paragraph [ref=e1359]:
            - text: String 不是 Java 中唯一的不可变对象。
            - code [ref=e1360]: Integer
            - text: 、
            - code [ref=e1361]: Long
            - text: 、
            - code [ref=e1362]: Double
            - text: 等包装类型也是不可变的。
            - code [ref=e1363]: LocalDate
            - text: 、
            - code [ref=e1364]: BigDecimal
            - text: 等也是。
          - paragraph [ref=e1365]: 设计不可变对象的原则：
          - list [ref=e1366]:
            - listitem [ref=e1367]:
              - text: 类声明为
              - code [ref=e1368]: final
              - text: （或所有方法为
              - code [ref=e1369]: final
              - text: ）
            - listitem [ref=e1370]:
              - text: 所有字段为
              - code [ref=e1371]: private final
            - listitem [ref=e1372]: 不提供修改状态的方法
            - listitem [ref=e1373]: 构造时深拷贝可变参数，返回时深拷贝可变字段
          - separator [ref=e1374]
          - heading [level=2] [ref=e1375]:
            - text: 1.6 类型转换与编译期检查
            - link "Permalink to \"1.6 类型转换与编译期检查\"" [ref=e1376] [cursor=pointer]:
              - /url: "#_1-6-类型转换与编译期检查"
              - text: "#"
          - paragraph [ref=e1377]: Java 的类型系统在编译期和运行期都有检查机制，这使得很多错误在代码运行之前就被发现。
          - heading [level=3] [ref=e1378]:
            - text: 基本类型转换
            - link "Permalink to \"基本类型转换\"" [ref=e1379] [cursor=pointer]:
              - /url: "#基本类型转换"
              - text: "#"
          - paragraph [ref=e1380]:
            - strong [ref=e1381]: 自动扩大（Widening）
            - text: ——安全，编译器自动完成：
          - generic [ref=e1382]:
            - button "Copy Code" [ref=e1383] [cursor=pointer]
            - generic [ref=e1384]: text
            - code [ref=e1386]:
              - generic [ref=e1387]: byte → short → int → long → float → double
              - generic [ref=e1388]: char →
            - generic [ref=e1389]: 1 2
          - generic [ref=e1390]:
            - button "Copy Code" [ref=e1391] [cursor=pointer]
            - generic [ref=e1392]: java
            - code [ref=e1394]:
              - generic [ref=e1395]: int a = 10;
              - generic [ref=e1396]: long b = a; // OK，int 自动扩大为 long
              - generic [ref=e1397]: double c = b; // OK，long 自动扩大为 double
            - generic [ref=e1398]: 1 2 3
          - paragraph [ref=e1399]:
            - strong [ref=e1400]: 强制缩小（Narrowing）
            - text: ——可能丢失精度，需要显式转换：
          - generic [ref=e1401]:
            - button "Copy Code" [ref=e1402] [cursor=pointer]
            - generic [ref=e1403]: java
            - code [ref=e1405]:
              - generic [ref=e1406]: double d = 3.14;
              - generic [ref=e1407]: int i = (int) d; // i = 3，小数部分丢失
              - generic [ref=e1408]: long big = 130L;
              - generic [ref=e1409]: byte b = (byte) big; // b = -126，溢出（byte 范围是 -128~127）
            - generic [ref=e1410]: 1 2 3 4 5
          - heading [level=3] [ref=e1411]:
            - text: 引用类型转换
            - link "Permalink to \"引用类型转换\"" [ref=e1412] [cursor=pointer]:
              - /url: "#引用类型转换"
              - text: "#"
          - paragraph [ref=e1413]:
            - strong [ref=e1414]: 向上转型（Upcasting）
            - text: ——安全，自动完成：
          - generic [ref=e1415]:
            - button "Copy Code" [ref=e1416] [cursor=pointer]
            - generic [ref=e1417]: java
            - code [ref=e1419]:
              - generic [ref=e1420]: String s = "hello";
              - generic [ref=e1421]: Object o = s; // String 是 Object 的子类，自动向上转型
            - generic [ref=e1422]: 1 2
          - paragraph [ref=e1423]:
            - strong [ref=e1424]: 向下转型（Downcasting）
            - text: ——需要运行时检查：
          - generic [ref=e1425]:
            - button "Copy Code" [ref=e1426] [cursor=pointer]
            - generic [ref=e1427]: java
            - code [ref=e1429]:
              - generic [ref=e1430]: Object o = "hello";
              - generic [ref=e1431]: String s = (String) o; // OK，运行时 o 确实是 String
              - generic [ref=e1432]: Object o2 = 123;
              - generic [ref=e1433]: String s2 = (String) o2; // ClassCastException！运行时 o2 是 Integer
            - generic [ref=e1434]: 1 2 3 4 5
          - paragraph [ref=e1435]:
            - text: 向下转型在字节码层面对应
            - code [ref=e1436]: checkcast
            - text: 指令——JVM 在运行时检查对象的实际类型，如果不匹配就抛出
            - code [ref=e1437]: ClassCastException
            - text: 。
          - heading [level=3] [ref=e1438]:
            - text: 编译器如何利用类型
            - link "Permalink to \"编译器如何利用类型\"" [ref=e1439] [cursor=pointer]:
              - /url: "#编译器如何利用类型"
              - text: "#"
          - paragraph [ref=e1440]: Java 编译器利用类型信息做三件事：
          - paragraph [ref=e1441]:
            - strong [ref=e1442]: 1. 类型检查
            - text: ——在编译期拒绝非法操作：
          - generic [ref=e1443]:
            - button "Copy Code" [ref=e1444] [cursor=pointer]
            - generic [ref=e1445]: java
            - code [ref=e1447]:
              - generic [ref=e1448]: String s = 123; // 编译错误：int 不能赋值给 String
              - generic [ref=e1449]: "\"hello\" - 1; // 编译错误：String 不支持减法"
            - generic [ref=e1450]: 1 2
          - paragraph [ref=e1451]:
            - strong [ref=e1452]: 2. 方法重载解析
            - text: ——根据参数类型选择正确的方法：
          - generic [ref=e1453]:
            - button "Copy Code" [ref=e1454] [cursor=pointer]
            - generic [ref=e1455]: java
            - code [ref=e1457]:
              - generic [ref=e1458]: "void print(String s) { ... }"
              - generic [ref=e1459]: "void print(int i) { ... }"
              - generic [ref=e1460]: print("hello"); // 编译器选择 print(String)
              - generic [ref=e1461]: print(42); // 编译器选择 print(int)
            - generic [ref=e1462]: 1 2 3 4 5
          - paragraph [ref=e1463]:
            - strong [ref=e1464]: 3. 泛型检查
            - text: ——在编译期保证类型安全（第三章详细展开）
          - paragraph [ref=e1465]: 编译器在字节码生成之前就阻止了错误。这是静态类型语言的核心优势：错误发现得越早，修复成本越低。
          - separator [ref=e1466]
          - blockquote [ref=e1467]:
            - paragraph [ref=e1468]: 本章建立了 Java 的世界观和类型系统的完整认知。下一章《面向对象》将回答：Java 如何利用这套类型系统来组织复杂的软件世界——封装、继承、多态、接口，这些不是语法概念，而是解决软件复杂性的工程方法。
      - contentinfo [ref=e1469]:
        - generic [ref=e1470]:
          - link "在编辑器中打开源文件" [ref=e1472] [cursor=pointer]:
            - /url: http://__vscode__/01-java-language/chapter-01-type-system.md
          - paragraph [ref=e1475]:
            - text: "Last updated:"
            - time [ref=e1476]: 8/7/26, 11:06 AM
        - navigation "Pager" [ref=e1477]:
          - link "下一章 面向对象" [ref=e1481] [cursor=pointer]:
            - /url: /java-world/01-java-language/chapter-02-oop.html
            - generic [ref=e1482]: 下一章
            - generic [ref=e1483]: 面向对象
```

# Test source

```ts
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
  136 |     await container.hover()
> 137 |     await container.locator('.svg-edit-btn').click({ force: true })
      |                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  138 |     await page.waitForSelector('.editor-overlay')
  139 | 
  140 |     await page.keyboard.press('Escape')
  141 | 
  142 |     const editor = page.locator('.editor-overlay')
  143 |     await expect(editor).not.toBeVisible({ timeout: 5000 })
  144 |     console.log('[Escape] 编辑器已关闭')
  145 |   })
  146 | 
  147 |   test('9. 颜色选择器存在', async ({ page }) => {
  148 |     const container = page.locator('.svg-container').nth(1)
  149 |     await container.hover()
  150 |     await container.locator('.svg-edit-btn').click({ force: true })
  151 |     await page.waitForSelector('.editor-overlay')
  152 | 
  153 |     const colorInputs = page.locator('.color-row input[type="color"]')
  154 |     const count = await colorInputs.count()
  155 |     console.log(`[颜色] 选择器数量: ${count}`)
  156 |     expect(count).toBe(2)
  157 |   })
  158 | 
  159 |   test('10. 对齐按钮组完整', async ({ page }) => {
  160 |     const container = page.locator('.svg-container').nth(1)
  161 |     await container.hover()
  162 |     await container.locator('.svg-edit-btn').click({ force: true })
  163 |     await page.waitForSelector('.editor-overlay')
  164 | 
  165 |     const alignGroup = page.locator('.align-group button')
  166 |     const count = await alignGroup.count()
  167 |     console.log(`[对齐] 按钮数量: ${count}`)
  168 | 
  169 |     const titles = []
  170 |     for (let i = 0; i < count; i++) {
  171 |       const t = await alignGroup.nth(i).getAttribute('title')
  172 |       titles.push(t)
  173 |     }
  174 |     console.log(`[对齐] 按钮: ${titles.join(', ')}`)
  175 |     expect(count).toBe(6)
  176 |   })
  177 | })
  178 | 
```