# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: arrow-verify.spec.ts >> C1: 合组率 — 无孤立箭头元件
- Location: tests/arrow-verify.spec.ts:132:1

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
            - link "12.1 平台线程走到尽头的原因" [ref=e437] [cursor=pointer]:
              - /url: "#_12-1-平台线程走到尽头的原因"
            - list [ref=e438]:
              - listitem [ref=e439]:
                - link "12.1.1 一条平台线程的成本清单" [ref=e440] [cursor=pointer]:
                  - /url: "#_12-1-1-一条平台线程的成本清单"
              - listitem [ref=e441]:
                - link "12.1.2 高并发场景下的两难" [ref=e442] [cursor=pointer]:
                  - /url: "#_12-1-2-高并发场景下的两难"
              - listitem [ref=e443]:
                - link "12.1.3 Reactor 路径的隐藏成本" [ref=e444] [cursor=pointer]:
                  - /url: "#_12-1-3-reactor-路径的隐藏成本"
              - listitem [ref=e445]:
                - link "12.1.4 虚拟线程要解决的问题" [ref=e446] [cursor=pointer]:
                  - /url: "#_12-1-4-虚拟线程要解决的问题"
          - listitem [ref=e447]:
            - link "12.2 虚拟线程：M:N 调度与 continuation" [ref=e448] [cursor=pointer]:
              - /url: "#_12-2-虚拟线程-m-n-调度与-continuation"
            - list [ref=e449]:
              - listitem [ref=e450]:
                - link "12.2.1 虚拟线程与平台线程的对照" [ref=e451] [cursor=pointer]:
                  - /url: "#_12-2-1-虚拟线程与平台线程的对照"
              - listitem [ref=e452]:
                - link "12.2.2 continuation：可挂起可恢复的执行片段" [ref=e453] [cursor=pointer]:
                  - /url: "#_12-2-2-continuation-可挂起可恢复的执行片段"
              - listitem [ref=e454]:
                - link "12.2.3 调度器与 Carrier 池" [ref=e455] [cursor=pointer]:
                  - /url: "#_12-2-3-调度器与-carrier-池"
              - listitem [ref=e456]:
                - link "12.2.4 创建虚拟线程的四种方式" [ref=e457] [cursor=pointer]:
                  - /url: "#_12-2-4-创建虚拟线程的四种方式"
          - listitem [ref=e458]:
            - link "12.3 pinning：synchronized 造成的钉住问题" [ref=e459] [cursor=pointer]:
              - /url: "#_12-3-pinning-synchronized-造成的钉住问题"
            - list [ref=e460]:
              - listitem [ref=e461]:
                - link "12.3.1 什么是 pinning" [ref=e462] [cursor=pointer]:
                  - /url: "#_12-3-1-什么是-pinning"
              - listitem [ref=e463]:
                - link "12.3.2 造成 pinning 的两类场景" [ref=e464] [cursor=pointer]:
                  - /url: "#_12-3-2-造成-pinning-的两类场景"
              - listitem [ref=e465]:
                - link "12.3.3 迁移建议：从 synchronized 到 ReentrantLock" [ref=e466] [cursor=pointer]:
                  - /url: "#_12-3-3-迁移建议-从-synchronized-到-reentrantlock"
              - listitem [ref=e467]:
                - link "12.3.4 pinning 的检测手段" [ref=e468] [cursor=pointer]:
                  - /url: "#_12-3-4-pinning-的检测手段"
          - listitem [ref=e469]:
            - link "12.4 何时不要用虚拟线程" [ref=e470] [cursor=pointer]:
              - /url: "#_12-4-何时不要用虚拟线程"
            - list [ref=e471]:
              - listitem [ref=e472]:
                - link "12.4.1 CPU 密集任务" [ref=e473] [cursor=pointer]:
                  - /url: "#_12-4-1-cpu-密集任务"
              - listitem [ref=e474]:
                - link "12.4.2 需要严格限流的场景" [ref=e475] [cursor=pointer]:
                  - /url: "#_12-4-2-需要严格限流的场景"
              - listitem [ref=e476]:
                - link "12.4.3 ThreadLocal 密集使用的路径" [ref=e477] [cursor=pointer]:
                  - /url: "#_12-4-3-threadlocal-密集使用的路径"
              - listitem [ref=e478]:
                - link "12.4.4 依赖平台线程语义的库" [ref=e479] [cursor=pointer]:
                  - /url: "#_12-4-4-依赖平台线程语义的库"
          - listitem [ref=e480]:
            - link "12.5 结构化并发：StructuredTaskScope" [ref=e481] [cursor=pointer]:
              - /url: "#_12-5-结构化并发-structuredtaskscope"
            - list [ref=e482]:
              - listitem [ref=e483]:
                - link "12.5.1 传统 fire-and-forget 的问题" [ref=e484] [cursor=pointer]:
                  - /url: "#_12-5-1-传统-fire-and-forget-的问题"
              - listitem [ref=e485]:
                - link "12.5.2 结构化并发的核心约束" [ref=e486] [cursor=pointer]:
                  - /url: "#_12-5-2-结构化并发的核心约束"
              - listitem [ref=e487]:
                - link "12.5.3 两种收敛策略" [ref=e488] [cursor=pointer]:
                  - /url: "#_12-5-3-两种收敛策略"
              - listitem [ref=e489]:
                - link "12.5.4 超时与取消" [ref=e490] [cursor=pointer]:
                  - /url: "#_12-5-4-超时与取消"
              - listitem [ref=e491]:
                - link "12.5.5 API 稳定性提示" [ref=e492] [cursor=pointer]:
                  - /url: "#_12-5-5-api-稳定性提示"
          - listitem [ref=e493]:
            - link "12.6 虚拟线程时代重新评估线程池" [ref=e494] [cursor=pointer]:
              - /url: "#_12-6-虚拟线程时代重新评估线程池"
          - listitem [ref=e495]:
            - link "12.7 一段完整示例：从传统 API 迁移到虚拟线程" [ref=e496] [cursor=pointer]:
              - /url: "#_12-7-一段完整示例-从传统-api-迁移到虚拟线程"
          - listitem [ref=e497]:
            - link "12.8 本章小结" [ref=e498] [cursor=pointer]:
              - /url: "#_12-8-本章小结"
    - generic [ref=e500]:
      - main [ref=e501]:
        - generic [ref=e503]:
          - heading [level=1] [ref=e504]:
            - text: 第12章 虚拟线程与结构化并发（JDK 21）
            - link "Permalink to \"第12章 虚拟线程与结构化并发（JDK 21）\"" [ref=e505] [cursor=pointer]:
              - /url: "#第12章-虚拟线程与结构化并发-jdk-21"
              - text: "#"
          - blockquote [ref=e506]:
            - paragraph [ref=e507]: 如果一条线程可以像一个对象那样廉价，过去十年围绕线程池积累的工程直觉，还剩下多少是对的？
          - paragraph [ref=e508]:
            - text: Java 21 把虚拟线程从预览特性升级为 GA。它不是一种新语言语法，也不是异步框架，而是对
            - code [ref=e509]: java.lang.Thread
            - text: 的一次实现层重写：同样的类、同样的 API、同样的编程风格，但一台 JVM 上并存的线程数从"几千"跳到"百万"。这个改动同时改写了两件事——线程池存在的理由和 Reactor 编程存在的理由。
          - paragraph [ref=e510]: 本章讨论：这次改动改到了哪里，改到了什么程度，改动之外还剩下什么。
          - separator [ref=e511]
          - heading [level=2] [ref=e512]:
            - text: 12.1 平台线程走到尽头的原因
            - link "Permalink to \"12.1 平台线程走到尽头的原因\"" [ref=e513] [cursor=pointer]:
              - /url: "#_12-1-平台线程走到尽头的原因"
              - text: "#"
          - heading [level=3] [ref=e514]:
            - text: 12.1.1 一条平台线程的成本清单
            - link "Permalink to \"12.1.1 一条平台线程的成本清单\"" [ref=e515] [cursor=pointer]:
              - /url: "#_12-1-1-一条平台线程的成本清单"
              - text: "#"
          - paragraph [ref=e516]:
            - text: 在 JDK 21 之前，
            - code [ref=e517]: new Thread()
            - text: 得到的每一条 Java 线程背后都对应一条 OS 线程（HotSpot 的 1:1 模型，见第 2 章）。这条 OS 线程要付出的固定成本：
          - table [ref=e518]:
            - rowgroup [ref=e519]:
              - row [ref=e520]:
                - columnheader "项目" [ref=e521]
                - columnheader "典型值" [ref=e522]
                - columnheader "说明" [ref=e523]
            - rowgroup [ref=e524]:
              - row [ref=e525]:
                - cell "栈内存" [ref=e526]
                - cell [ref=e527]:
                  - text: 1 MB（
                  - code [ref=e528]: "-Xss"
                  - text: 默认）
                - cell "预留虚拟地址空间，用到多少提交多少" [ref=e529]
              - row [ref=e530]:
                - cell "内核态数据结构" [ref=e531]
                - cell "数 KB" [ref=e532]
                - cell [ref=e533]:
                  - code [ref=e534]: task_struct
                  - text: 、内核栈、调度器条目
              - row [ref=e535]:
                - cell "上下文切换" [ref=e536]
                - cell "1–10 µs / 次" [ref=e537]
                - cell "保存/恢复寄存器、切换 TLB、可能刷新 L1" [ref=e538]
              - row [ref=e539]:
                - cell "创建/销毁" [ref=e540]
                - cell "数十 µs" [ref=e541]
                - cell "系统调用 + 内核数据结构分配" [ref=e542]
          - paragraph [ref=e543]:
            - text: 一台 16 GB 堆外余量的应用，能开出的平台线程数量级在
            - strong [ref=e544]: 5 000–15 000
            - text: 。真正压死线程数量的通常不是栈占用，而是
            - strong [ref=e545]: 上下文切换的边际收益
            - text: ：线程数超过 CPU 核数几十倍后，CPU 花在切换本身上的时间就超过了业务代码。
          - heading [level=3] [ref=e546]:
            - text: 12.1.2 高并发场景下的两难
            - link "Permalink to \"12.1.2 高并发场景下的两难\"" [ref=e547] [cursor=pointer]:
              - /url: "#_12-1-2-高并发场景下的两难"
              - text: "#"
          - paragraph [ref=e548]: 一个典型的后端接口，处理链路是这样的：
          - generic [ref=e549]:
            - button "Copy Code" [ref=e550] [cursor=pointer]
            - generic [ref=e551]: text
            - code [ref=e553]:
              - generic [ref=e554]: 接收请求
              - generic [ref=e555]: │
              - generic [ref=e556]: ▼
              - generic [ref=e557]: ┌────────────┐ RT 里 95% 时间在这
              - generic [ref=e558]: │ 下游 IO │ 数据库、Redis、下游服务
              - generic [ref=e559]: └────────────┘
              - generic [ref=e560]: │
              - generic [ref=e561]: ▼
              - generic [ref=e562]: 组装返回
            - generic [ref=e563]: 1 2 3 4 5 6 7 8 9
          - paragraph [ref=e564]: 95% 的时间线程都在 park 等 IO。假设 QPS = 10 000、平均 RT = 200 ms，按小 Little 定律得到平均并发数：
          - generic [ref=e565]:
            - button "Copy Code" [ref=e566] [cursor=pointer]
            - generic [ref=e567]: text
            - code [ref=e569]:
              - generic [ref=e570]: N = QPS × RT = 10 000 × 0.2s = 2 000
            - generic [ref=e571]: "1"
          - paragraph [ref=e572]: 需要 2 000 条线程同时挂着。平台线程模型下这已经贴着上限；QPS 再翻一倍就必须拒绝请求。
          - paragraph [ref=e573]: 过去应对这个矛盾有两条路：
          - list [ref=e574]:
            - listitem [ref=e575]:
              - strong [ref=e576]: 限并发
              - text: ：Tomcat 的
              - code [ref=e577]: maxThreads=200
              - text: ，多余请求排队 —— 用户在门口等
            - listitem [ref=e578]:
              - strong [ref=e579]: 改异步
              - text: ：Netty、Reactor、
              - code [ref=e580]: CompletableFuture
              - text: 链 —— 一条线程处理成千上万条连接
          - heading [level=3] [ref=e581]:
            - text: 12.1.3 Reactor 路径的隐藏成本
            - link "Permalink to \"12.1.3 Reactor 路径的隐藏成本\"" [ref=e582] [cursor=pointer]:
              - /url: "#_12-1-3-reactor-路径的隐藏成本"
              - text: "#"
          - paragraph [ref=e583]:
            - text: 异步方案不是没有代价。写过
            - code [ref=e584]: WebFlux
            - text: 或者 Netty 应用的人知道下面这几件事：
          - generic [ref=e585]:
            - button "Copy Code" [ref=e586] [cursor=pointer]
            - generic [ref=e587]: java
            - code [ref=e589]:
              - generic [ref=e590]: // ❌ Reactor 式代码：调用栈被切碎
              - generic [ref=e591]: "Mono<Order> loadOrder(String id) {"
              - generic [ref=e592]: return orderRepo.findById(id)
              - generic [ref=e593]: .flatMap(order -> userRepo.findById(order.userId())
              - generic [ref=e594]: .flatMap(user -> itemRepo.findAll(order.itemIds())
              - generic [ref=e595]: .collectList()
              - generic [ref=e596]: .map(items -> assemble(order, user, items))));
              - generic [ref=e597]: "}"
            - generic [ref=e598]: 1 2 3 4 5 6 7 8
          - generic [ref=e599]:
            - button "Copy Code" [ref=e600] [cursor=pointer]
            - generic [ref=e601]: java
            - code [ref=e603]:
              - generic [ref=e604]: // ✅ 同步代码：直读直写
              - generic [ref=e605]: "Order loadOrder(String id) {"
              - generic [ref=e606]: Order order = orderRepo.findById(id);
              - generic [ref=e607]: User user = userRepo.findById(order.userId());
              - generic [ref=e608]: List<Item> items = itemRepo.findAll(order.itemIds());
              - generic [ref=e609]: return assemble(order, user, items);
              - generic [ref=e610]: "}"
            - generic [ref=e611]: 1 2 3 4 5 6 7
          - paragraph [ref=e612]: Reactor 版本换来的是吞吐，付出的是：
          - list [ref=e613]:
            - listitem [ref=e614]:
              - strong [ref=e615]: 异常栈丢失
              - text: ：
              - code [ref=e616]: onError
              - text: 拿到的 stack trace 通常停在 Reactor 内部
            - listitem [ref=e617]:
              - strong [ref=e618]:
                - code [ref=e619]: ThreadLocal
                - text: 失效
              - text: ：跨算子切线程后 MDC、事务、租户上下文全断
            - listitem [ref=e620]:
              - strong [ref=e621]: 调试困难
              - text: ：断点打不到业务逻辑，
              - code [ref=e622]: step over
              - text: 直接跳出方法
            - listitem [ref=e623]:
              - strong [ref=e624]: 心智负担
              - text: ：
              - code [ref=e625]: flatMap
              - text: /
              - code [ref=e626]: zipWith
              - text: /
              - code [ref=e627]: switchIfEmpty
              - text: 的语义精确性要求高
          - paragraph [ref=e628]: 也就是说，Reactor 让 CPU 更闲了，但让人更累了。
          - heading [level=3] [ref=e629]:
            - text: 12.1.4 虚拟线程要解决的问题
            - link "Permalink to \"12.1.4 虚拟线程要解决的问题\"" [ref=e630] [cursor=pointer]:
              - /url: "#_12-1-4-虚拟线程要解决的问题"
              - text: "#"
          - paragraph [ref=e631]:
            - text: 虚拟线程给出的答案是：
            - strong [ref=e632]: 同步代码风格 + 异步执行效率
            - text: 。让开发者继续用
            - code [ref=e633]: Thread
            - text: /
            - code [ref=e634]: ExecutorService
            - text: / try-catch /
            - code [ref=e635]: ThreadLocal
            - text: ，同时把 IO 阻塞时的"线程占坑"问题在 JVM 层面消掉。
          - separator [ref=e636]
          - heading [level=2] [ref=e637]:
            - text: 12.2 虚拟线程：M:N 调度与 continuation
            - link "Permalink to \"12.2 虚拟线程：M:N 调度与 continuation\"" [ref=e638] [cursor=pointer]:
              - /url: "#_12-2-虚拟线程-m-n-调度与-continuation"
              - text: "#"
          - heading [level=3] [ref=e639]:
            - text: 12.2.1 虚拟线程与平台线程的对照
            - link "Permalink to \"12.2.1 虚拟线程与平台线程的对照\"" [ref=e640] [cursor=pointer]:
              - /url: "#_12-2-1-虚拟线程与平台线程的对照"
              - text: "#"
          - img [ref=e642]:
            - generic [ref=e643]: 虚拟线程与载体线程映射关系
            - generic [ref=e645]: 用户视角
            - generic [ref=e647]: VT1
            - generic [ref=e649]: VT2
            - generic [ref=e651]: VT3
            - generic [ref=e653]: VT4
            - generic [ref=e655]: VT5
            - generic [ref=e656]: …
            - generic [ref=e658]: VT₁₀₀₀₀₀₀
            - generic [ref=e664]: 挂载 (mount)
            - generic [ref=e665]: / 卸载 (unmount)
            - generic [ref=e667]: JVM 视角：Carrier Thread 池
            - generic [ref=e669]: Carrier1
            - generic [ref=e671]: Carrier2
            - generic [ref=e672]: …
            - generic [ref=e674]: CarrierN
            - generic [ref=e675]: 个数 ≈ CPU 核数
            - generic [ref=e677]: OS 视角
            - generic [ref=e678]: OS Thread 1
            - generic [ref=e679]: OS Thread 2
            - generic [ref=e680]: …
            - generic [ref=e682]: VT 阻塞时 → 从 Carrier 卸载 → Carrier 去跑其他 VT
            - generic [ref=e683]: 栈保存在堆上，个数可达百万级
          - list [ref=e684]:
            - listitem [ref=e685]:
              - strong [ref=e686]: 虚拟线程（Virtual Thread, VT）
              - text: ：
              - code [ref=e687]: java.lang.Thread
              - text: 的子类实例，栈保存在堆上，个数可达百万级
            - listitem [ref=e688]:
              - strong [ref=e689]: 载体线程（Carrier Thread）
              - text: ：真正的平台线程，是 VT 运行时实际占用的 CPU 执行流；VT 只在 Carrier 上"临时挂载"
            - listitem [ref=e690]:
              - strong [ref=e691]: 调度器（Scheduler）
              - text: ：默认是一个专用的
              - code [ref=e692]: ForkJoinPool
              - text: ，决定哪个 VT 挂到哪个 Carrier 上运行
          - paragraph [ref=e693]:
            - text: 关键设计：
            - strong [ref=e694]:
              - text: 当 VT 阻塞在 JDK 阻塞点（如
              - code [ref=e695]: Socket.read
              - text: 、
              - code [ref=e696]: Thread.sleep
              - text: 、
              - code [ref=e697]: LockSupport.park
              - text: ）时，JVM 会把 VT 从 Carrier 上卸载，Carrier 立即去执行别的 VT
            - text: 。等阻塞条件满足，VT 被重新挂到某条 Carrier 上继续跑。
          - heading [level=3] [ref=e698]:
            - text: 12.2.2 continuation：可挂起可恢复的执行片段
            - link "Permalink to \"12.2.2 continuation：可挂起可恢复的执行片段\"" [ref=e699] [cursor=pointer]:
              - /url: "#_12-2-2-continuation-可挂起可恢复的执行片段"
              - text: "#"
          - paragraph [ref=e700]:
            - text: 虚拟线程的挂起/恢复能力，来自一个更底层的机制——
            - code [ref=e701]: Continuation
            - text: （
            - code [ref=e702]: jdk.internal.vm.Continuation
            - text: ）。
          - paragraph [ref=e703]: 一段执行流有两种状态：
          - list [ref=e704]:
            - listitem [ref=e705]:
              - strong [ref=e706]: running
              - text: ：栈帧在某条 Carrier 的调用栈上
            - listitem [ref=e707]:
              - strong [ref=e708]: frozen
              - text: ：栈帧被复制到堆上，等待被"解冻"
          - paragraph [ref=e709]:
            - code [ref=e710]: Continuation.yield(scope)
            - text: 触发从 running 到 frozen 的转换：JVM 把当前 Carrier 上属于这个 VT 的所有栈帧、局部变量、返回地址复制到堆上的一段内存里，然后 Carrier 上的
            - code [ref=e711]: run()
            - text: 方法返回，Carrier 继续挑下一个 VT。
          - paragraph [ref=e712]:
            - code [ref=e713]: Continuation.run()
            - text: 触发从 frozen 到 running：JVM 把堆上保存的栈帧复制回 Carrier 的调用栈顶，代码从 yield 点继续执行。
          - paragraph [ref=e714]:
            - text: 对读者的意义是：
            - strong [ref=e715]: 虚拟线程不是操作系统线程，也不是协程库，而是"栈可搬家的 Java 线程"
            - text: 。Java 语言不需要
            - code [ref=e716]: async
            - text: /
            - code [ref=e717]: await
            - text: 关键字，因为搬家的动作发生在 JDK 内部的 IO 调用里，业务代码看不见。
          - heading [level=3] [ref=e718]:
            - text: 12.2.3 调度器与 Carrier 池
            - link "Permalink to \"12.2.3 调度器与 Carrier 池\"" [ref=e719] [cursor=pointer]:
              - /url: "#_12-2-3-调度器与-carrier-池"
              - text: "#"
          - paragraph [ref=e720]: 默认 Carrier 池的属性可以用系统属性调整：
          - generic [ref=e721]:
            - button "Copy Code" [ref=e722] [cursor=pointer]
            - generic [ref=e723]: bash
            - code [ref=e725]:
              - generic [ref=e726]: "# Carrier 数量，默认等于 CPU 核数"
              - generic [ref=e727]: "-Djdk.virtualThreadScheduler.parallelism=16"
              - generic [ref=e728]: "# 最大并行度上限"
              - generic [ref=e729]: "-Djdk.virtualThreadScheduler.maxPoolSize=256"
              - generic [ref=e730]: "# 最小活跃 Carrier 数（发生 pinning 时新增）"
              - generic [ref=e731]: "-Djdk.virtualThreadScheduler.minRunnable=1"
            - generic [ref=e732]: 1 2 3 4 5 6 7 8
          - paragraph [ref=e733]:
            - text: 生产环境几乎不需要动这些参数——默认值已经是"CPU 核数"，这也是
            - strong [ref=e734]:
              - text: 平台线程池 IO 密集配置的经验值
              - code [ref=e735]: 2 × N_CPU
              - text: 都被虚拟线程重新定义
            - text: 的原因：CPU 核数由 Carrier 决定，与 VT 数量无关。
          - heading [level=3] [ref=e736]:
            - text: 12.2.4 创建虚拟线程的四种方式
            - link "Permalink to \"12.2.4 创建虚拟线程的四种方式\"" [ref=e737] [cursor=pointer]:
              - /url: "#_12-2-4-创建虚拟线程的四种方式"
              - text: "#"
          - table [ref=e738]:
            - rowgroup [ref=e739]:
              - row [ref=e740]:
                - columnheader "方式" [ref=e741]
                - columnheader "场景" [ref=e742]
                - columnheader "特点" [ref=e743]
            - rowgroup [ref=e744]:
              - row [ref=e745]:
                - cell [ref=e746]:
                  - code [ref=e747]: Thread.startVirtualThread(runnable)
                - cell "一次性异步任务" [ref=e748]
                - cell "最简洁，立即启动" [ref=e749]
              - row [ref=e750]:
                - cell [ref=e751]:
                  - code [ref=e752]: Thread.ofVirtual().name(...).start(runnable)
                - cell "需要命名、异常处理器" [ref=e753]
                - cell "通过 builder 配置" [ref=e754]
              - row [ref=e755]:
                - cell [ref=e756]:
                  - code [ref=e757]: Executors.newVirtualThreadPerTaskExecutor()
                - cell [ref=e758]:
                  - text: 替换现有
                  - code [ref=e759]: ExecutorService
                - cell "兼容既有代码" [ref=e760]
              - row [ref=e761]:
                - cell [ref=e762]:
                  - code [ref=e763]: StructuredTaskScope
                  - text: （§12.5）
                - cell "有生命周期约束的子任务组" [ref=e764]
                - cell "结构化并发入口" [ref=e765]
          - generic [ref=e766]:
            - button "Copy Code" [ref=e767] [cursor=pointer]
            - generic [ref=e768]: java
            - code [ref=e770]:
              - generic [ref=e771]: // 场景 1：一次性任务
              - generic [ref=e772]: Thread.startVirtualThread(() -> log.info("hello vt"));
              - generic [ref=e773]: // 场景 2：需要配置
              - generic [ref=e774]: Thread vt = Thread.ofVirtual()
              - generic [ref=e775]: .name("order-worker-", 0) // "order-worker-0"
              - generic [ref=e776]: .uncaughtExceptionHandler((t, e) -> log.error("vt failed", e))
              - generic [ref=e777]: .start(() -> processOrder(id));
              - generic [ref=e778]: // 场景 3：替换线程池
              - generic [ref=e779]: "try (ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor()) {"
              - generic [ref=e780]: "for (Request req : requests) {"
              - generic [ref=e781]: pool.submit(() -> handle(req));
              - generic [ref=e782]: "}"
              - generic [ref=e783]: "} // try-with-resources 自动等待所有任务完成"
            - generic [ref=e784]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
          - paragraph [ref=e785]:
            - strong [ref=e786]:
              - text: 注意
              - code [ref=e787]: newVirtualThreadPerTaskExecutor
              - text: 的语义
            - text: ：它不是"共享一批固定 Carrier 的池"，而是"每提交一个任务就新起一条虚拟线程"。它更接近
            - code [ref=e788]: newCachedThreadPool
            - text: ，但没有创建上限——因为 VT 本身就是廉价的。
          - separator [ref=e789]
          - heading [level=2] [ref=e790]:
            - text: 12.3 pinning：
            - code [ref=e791]: synchronized
            - text: 造成的钉住问题
            - 'link "Permalink to \"12.3 pinning：`synchronized` 造成的钉住问题\"" [ref=e792] [cursor=pointer]':
              - /url: "#_12-3-pinning-synchronized-造成的钉住问题"
              - text: "#"
          - heading [level=3] [ref=e793]:
            - text: 12.3.1 什么是 pinning
            - link "Permalink to \"12.3.1 什么是 pinning\"" [ref=e794] [cursor=pointer]:
              - /url: "#_12-3-1-什么是-pinning"
              - text: "#"
          - paragraph [ref=e795]:
            - text: 虚拟线程遇到阻塞点时，JVM 应当把它从 Carrier 卸载下来，让 Carrier 空出手服务别的 VT。但在两种情况下卸载会失败——这条 VT 被"钉"在了 Carrier 上，直到阻塞返回。这种现象叫
            - strong [ref=e796]: pinning
            - text: 。
          - paragraph [ref=e797]: 被钉住时的现场：
          - generic [ref=e798]:
            - button "Copy Code" [ref=e799] [cursor=pointer]
            - generic [ref=e800]: text
            - code [ref=e802]:
              - generic [ref=e803]: 虚拟线程 VT1 持有 monitor lock，进入 synchronized 块 → 挂载在 Carrier C1
              - generic [ref=e804]: │
              - generic [ref=e805]: │ 发起 HTTP 请求，等待响应
              - generic [ref=e806]: ▼
              - generic [ref=e807]: 正常情况：VT1 应该被卸载，C1 去跑其他 VT
              - generic [ref=e808]: pinning：VT1 卡在 C1 上，C1 无法离开
              - generic [ref=e809]: 后果：VT1、C1 一起等 HTTP 响应；期间其他 VT 少一条可用 Carrier
            - generic [ref=e810]: 1 2 3 4 5 6 7
          - paragraph [ref=e811]:
            - text: 如果 Carrier 池只有 8 条，且业务大量使用
            - code [ref=e812]: synchronized
            - text: 包裹阻塞 IO，8 条 Carrier 全部被钉死之后，虚拟线程的调度就彻底退化为传统线程池——
            - strong [ref=e813]: 看上去有百万虚拟线程，实际吞吐还不如一个配置合理的固定线程池
            - text: 。
          - heading [level=3] [ref=e814]:
            - text: 12.3.2 造成 pinning 的两类场景
            - link "Permalink to \"12.3.2 造成 pinning 的两类场景\"" [ref=e815] [cursor=pointer]:
              - /url: "#_12-3-2-造成-pinning-的两类场景"
              - text: "#"
          - table [ref=e816]:
            - rowgroup [ref=e817]:
              - row [ref=e818]:
                - columnheader "场景" [ref=e819]
                - columnheader "原因" [ref=e820]
                - columnheader "JDK 21 表现" [ref=e821]
                - columnheader "JDK 24 表现" [ref=e822]
            - rowgroup [ref=e823]:
              - row [ref=e824]:
                - cell [ref=e825]:
                  - code [ref=e826]: synchronized
                  - text: 块内执行阻塞 IO
                - cell "monitor 与 Carrier 强绑定，无法搬走栈帧" [ref=e827]
                - cell "钉住" [ref=e828]
                - cell "已修复（JEP 491）" [ref=e829]
              - row [ref=e830]:
                - cell "本地方法（JNI）内阻塞" [ref=e831]
                - cell "JVM 无法感知 native 栈帧" [ref=e832]
                - cell "钉住" [ref=e833]
                - cell "仍钉住" [ref=e834]
          - paragraph [ref=e835]:
            - text: JDK 21–23 里
            - code [ref=e836]: synchronized
            - text: 是 pinning 的最大来源。JDK 24（2025-03）通过 JEP 491 让
            - code [ref=e837]: synchronized
            - text: 也能挂起虚拟线程，问题才被彻底解决。但生产环境很多团队仍停留在 JDK 21 LTS，因此这个问题短期内仍需处理。
          - heading [level=3] [ref=e838]:
            - text: 12.3.3 迁移建议：从 synchronized 到 ReentrantLock
            - link "Permalink to \"12.3.3 迁移建议：从 synchronized 到 ReentrantLock\"" [ref=e839] [cursor=pointer]:
              - /url: "#_12-3-3-迁移建议-从-synchronized-到-reentrantlock"
              - text: "#"
          - generic [ref=e840]:
            - button "Copy Code" [ref=e841] [cursor=pointer]
            - generic [ref=e842]: java
            - code [ref=e844]:
              - generic [ref=e845]: // ❌ JDK 21 下会 pinning
              - generic [ref=e846]: "public class OrderService {"
              - generic [ref=e847]: private final Object lock = new Object();
              - generic [ref=e848]: "public void update(String id) {"
              - generic [ref=e849]: "synchronized (lock) {"
              - generic [ref=e850]: httpClient.send(request); // 阻塞 IO，VT 被钉在 Carrier 上
              - generic [ref=e851]: db.write(id);
              - generic [ref=e852]: "}"
              - generic [ref=e853]: "}"
              - generic [ref=e854]: "}"
            - generic [ref=e855]: 1 2 3 4 5 6 7 8 9 10 11
          - generic [ref=e856]:
            - button "Copy Code" [ref=e857] [cursor=pointer]
            - generic [ref=e858]: java
            - code [ref=e860]:
              - generic [ref=e861]: // ✅ 用 ReentrantLock 替换：VT 会正常卸载
              - generic [ref=e862]: "public class OrderService {"
              - generic [ref=e863]: private final ReentrantLock lock = new ReentrantLock();
              - generic [ref=e864]: "public void update(String id) {"
              - generic [ref=e865]: lock.lock();
              - generic [ref=e866]: "try {"
              - generic [ref=e867]: httpClient.send(request); // VT 阻塞时被卸载，Carrier 空闲
              - generic [ref=e868]: db.write(id);
              - generic [ref=e869]: "} finally {"
              - generic [ref=e870]: lock.unlock();
              - generic [ref=e871]: "}"
              - generic [ref=e872]: "}"
              - generic [ref=e873]: "}"
            - generic [ref=e874]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14
          - paragraph [ref=e875]:
            - code [ref=e876]: ReentrantLock
            - text: 底层通过
            - code [ref=e877]: LockSupport.park
            - text: 挂起，而
            - code [ref=e878]: park
            - text: 是 JVM 感知的 yield 点，所以不会 pinning。
            - strong [ref=e879]:
              - text: 如果无法确保运行在 JDK 24+，虚拟线程场景下
              - code [ref=e880]: synchronized
              - text: + 阻塞 IO 的组合应当被视为反模式
            - text: 。
          - heading [level=3] [ref=e881]:
            - text: 12.3.4 pinning 的检测手段
            - link "Permalink to \"12.3.4 pinning 的检测手段\"" [ref=e882] [cursor=pointer]:
              - /url: "#_12-3-4-pinning-的检测手段"
              - text: "#"
          - paragraph [ref=e883]: 生产环境常用三条路径：
          - generic [ref=e884]:
            - button "Copy Code" [ref=e885] [cursor=pointer]
            - generic [ref=e886]: bash
            - code [ref=e888]:
              - generic [ref=e889]: "# 1. 启动参数：VT 一旦 pinning 就打印栈"
              - generic [ref=e890]: "-Djdk.tracePinnedThreads=short # 只打印栈顶"
              - generic [ref=e891]: "-Djdk.tracePinnedThreads=full # 打印完整栈"
              - generic [ref=e892]: "# 2. JFR 事件"
              - generic [ref=e893]: jcmd <pid> JFR.start settings=profile
              - generic [ref=e894]: "# 事件名: jdk.VirtualThreadPinned"
              - generic [ref=e895]: "# 3. 线程快照"
              - generic [ref=e896]: jcmd <pid> Thread.dump_to_file -format=json /tmp/vt-dump.json
              - generic [ref=e897]: "# 输出中 state=RUNNABLE 且 carrier != null 的 VT 值得关注"
            - generic [ref=e898]: 1 2 3 4 5 6 7 8 9 10 11
          - paragraph [ref=e899]:
            - code [ref=e900]: jdk.tracePinnedThreads=short
            - text: 的输出片段示例：
          - generic [ref=e901]:
            - button "Copy Code" [ref=e902] [cursor=pointer]
            - generic [ref=e903]: text
            - code [ref=e905]:
              - generic [ref=e906]: Thread[#42,ForkJoinPool-1-worker-3,5,CarrierThreads]
              - generic [ref=e907]: java.base/java.net.Socket.connect(Socket.java:...)
              - generic [ref=e908]: <monitors:>
              - generic [ref=e909]: "- java.lang.Object@0x00000007c0a01234"
            - generic [ref=e910]: 1 2 3 4
          - paragraph [ref=e911]:
            - code [ref=e912]: <monitors:>
            - text: 后列出的 monitor 就是钉住的元凶。
          - separator [ref=e913]
          - heading [level=2] [ref=e914]:
            - text: 12.4 何时不要用虚拟线程
            - link "Permalink to \"12.4 何时不要用虚拟线程\"" [ref=e915] [cursor=pointer]:
              - /url: "#_12-4-何时不要用虚拟线程"
              - text: "#"
          - paragraph [ref=e916]: 虚拟线程不是万能替代。以下四种场景下，平台线程仍然是更好的选择。
          - heading [level=3] [ref=e917]:
            - text: 12.4.1 CPU 密集任务
            - link "Permalink to \"12.4.1 CPU 密集任务\"" [ref=e918] [cursor=pointer]:
              - /url: "#_12-4-1-cpu-密集任务"
              - text: "#"
          - paragraph [ref=e919]: 虚拟线程解决的是"线程数受限"的问题，不是"CPU 算得慢"的问题。一段跑满 CPU 的循环，无论跑在虚拟线程还是平台线程上，占用的 Carrier / OS 时间片是一样的。
          - generic [ref=e920]:
            - button "Copy Code" [ref=e921] [cursor=pointer]
            - generic [ref=e922]: java
            - code [ref=e924]:
              - generic [ref=e925]: // ❌ 用虚拟线程跑图像处理，得不到任何加速
              - generic [ref=e926]: "try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {"
              - generic [ref=e927]: "for (Image img : images) {"
              - generic [ref=e928]: pool.submit(() -> resize(img)); // 每个任务持续 CPU 运算
              - generic [ref=e929]: "}"
              - generic [ref=e930]: "}"
              - generic [ref=e931]: // 100 万个 VT 只能在 N_CPU 条 Carrier 上排队，不如直接 ForkJoinPool
            - generic [ref=e932]: 1 2 3 4 5 6 7
          - generic [ref=e933]:
            - button "Copy Code" [ref=e934] [cursor=pointer]
            - generic [ref=e935]: java
            - code [ref=e937]:
              - generic [ref=e938]: // ✅ CPU 密集：固定大小的平台线程池
              - generic [ref=e939]: ExecutorService pool = Executors.newFixedThreadPool(
              - generic [ref=e940]: Runtime.getRuntime().availableProcessors()
              - generic [ref=e941]: );
            - generic [ref=e942]: 1 2 3 4
          - paragraph [ref=e943]:
            - strong [ref=e944]: 判断规则
            - text: ：任务的墙钟时间中 CPU 占比超过 50%，就应该用平台线程池。
          - heading [level=3] [ref=e945]:
            - text: 12.4.2 需要严格限流的场景
            - link "Permalink to \"12.4.2 需要严格限流的场景\"" [ref=e946] [cursor=pointer]:
              - /url: "#_12-4-2-需要严格限流的场景"
              - text: "#"
          - paragraph [ref=e947]:
            - text: 传统线程池天然通过
            - code [ref=e948]: maxPoolSize
            - text: +
            - code [ref=e949]: workQueue
            - text: 提供背压。虚拟线程模型下"来一个任务起一条 VT"，如果下游是有并发上限的资源（数据库连接池、下游 API 的 QPS 配额），需要
            - strong [ref=e950]:
              - text: 外挂
              - code [ref=e951]: Semaphore
              - text: 做限流
            - text: 。
          - generic [ref=e952]:
            - button "Copy Code" [ref=e953] [cursor=pointer]
            - generic [ref=e954]: java
            - code [ref=e956]:
              - generic [ref=e957]: // ❌ 虚拟线程直接调下游，可能瞬间把下游打挂
              - generic [ref=e958]: "try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {"
              - generic [ref=e959]: "for (long i = 0; i < 100_000; i++) {"
              - generic [ref=e960]: pool.submit(() -> downstreamApi.call()); // 10 万并发调用
              - generic [ref=e961]: "}"
              - generic [ref=e962]: "}"
            - generic [ref=e963]: 1 2 3 4 5 6
          - generic [ref=e964]:
            - button "Copy Code" [ref=e965] [cursor=pointer]
            - generic [ref=e966]: java
            - code [ref=e968]:
              - generic [ref=e969]: // ✅ 用 Semaphore 显式限流
              - generic [ref=e970]: Semaphore rateLimiter = new Semaphore(100); // 下游允许 100 并发
              - generic [ref=e971]: "try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {"
              - generic [ref=e972]: "for (long i = 0; i < 100_000; i++) {"
              - generic [ref=e973]: "pool.submit(() -> {"
              - generic [ref=e974]: rateLimiter.acquire();
              - generic [ref=e975]: "try {"
              - generic [ref=e976]: downstreamApi.call();
              - generic [ref=e977]: "} finally {"
              - generic [ref=e978]: rateLimiter.release();
              - generic [ref=e979]: "}"
              - generic [ref=e980]: "});"
              - generic [ref=e981]: "}"
              - generic [ref=e982]: "}"
            - generic [ref=e983]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14
          - heading [level=3] [ref=e984]:
            - text: 12.4.3
            - code [ref=e985]: ThreadLocal
            - text: 密集使用的路径
            - 'link "Permalink to \"12.4.3 `ThreadLocal` 密集使用的路径\"" [ref=e986] [cursor=pointer]':
              - /url: "#_12-4-3-threadlocal-密集使用的路径"
              - text: "#"
          - paragraph [ref=e987]:
            - text: 虚拟线程完全支持
            - code [ref=e988]: ThreadLocal
            - text: （在第 3 章讨论过它的存储结构）。但在 VT 场景下要提防一件事：
            - strong [ref=e989]: 百万级 VT × 每 VT 若干 TL 值 = 内存爆炸
            - text: 。
          - paragraph [ref=e990]: 举例：一个请求链路挂了 10 个 TL 值，每个值 1 KB。平台线程模型下同时活跃线程 2 000 条，占 20 MB；虚拟线程模型下同时活跃 200 000 条 VT，占 2 GB。
          - paragraph [ref=e991]: 应对方向：
          - list [ref=e992]:
            - listitem [ref=e993]:
              - text: 优先使用
              - code [ref=e994]: ScopedValue
              - text: （JDK 21 预览，JDK 23 二次预览）替代只在方法调用链里用的
              - code [ref=e995]: ThreadLocal
            - listitem [ref=e996]: 拆分 TL：只把真正需要跨方法透传的东西放进 TL，其余通过参数传递
            - listitem [ref=e997]:
              - text: 关键路径改造完之前，用
              - code [ref=e998]: "-XX:NativeMemoryTracking"
              - text: 观察堆外增长
          - heading [level=3] [ref=e999]:
            - text: 12.4.4 依赖平台线程语义的库
            - link "Permalink to \"12.4.4 依赖平台线程语义的库\"" [ref=e1000] [cursor=pointer]:
              - /url: "#_12-4-4-依赖平台线程语义的库"
              - text: "#"
          - paragraph [ref=e1001]:
            - text: 少量库依赖
            - code [ref=e1002]: Thread
            - text: 的平台线程语义，例如：
          - list [ref=e1003]:
            - listitem [ref=e1004]:
              - text: 通过
              - code [ref=e1005]: Thread.currentThread().getContextClassLoader()
              - text: 做类隔离的框架
            - listitem [ref=e1006]: 依赖 OS 线程亲和性（thread affinity）的高性能库
            - listitem [ref=e1007]:
              - text: 用
              - code [ref=e1008]: Thread
              - text: 的堆栈作为标识做 profiling 的工具
          - paragraph [ref=e1009]:
            - text: 对这些场景，如果切到虚拟线程后行为异常，最保险的做法是：
            - strong [ref=e1010]:
              - text: 入口保持平台线程，把 IO 密集部分显式提交到
              - code [ref=e1011]: newVirtualThreadPerTaskExecutor
            - text: 。
          - separator [ref=e1012]
          - heading [level=2] [ref=e1013]:
            - text: 12.5 结构化并发：
            - code [ref=e1014]: StructuredTaskScope
            - 'link "Permalink to \"12.5 结构化并发：`StructuredTaskScope`\"" [ref=e1015] [cursor=pointer]':
              - /url: "#_12-5-结构化并发-structuredtaskscope"
              - text: "#"
          - heading [level=3] [ref=e1016]:
            - text: 12.5.1 传统 fire-and-forget 的问题
            - link "Permalink to \"12.5.1 传统 fire-and-forget 的问题\"" [ref=e1017] [cursor=pointer]:
              - /url: "#_12-5-1-传统-fire-and-forget-的问题"
              - text: "#"
          - paragraph [ref=e1018]: 有了廉价的虚拟线程，人们开始一次派生成百上千的子任务。此时"父子任务生命周期"变成了新问题：
          - generic [ref=e1019]:
            - button "Copy Code" [ref=e1020] [cursor=pointer]
            - generic [ref=e1021]: java
            - code [ref=e1023]:
              - generic [ref=e1024]: // ❌ 派生子任务后失控
              - generic [ref=e1025]: Future<User> fUser = executor.submit(() -> userApi.get(id));
              - generic [ref=e1026]: Future<Order> fOrder = executor.submit(() -> orderApi.get(id));
              - generic [ref=e1027]: "try {"
              - generic [ref=e1028]: User user = fUser.get();
              - generic [ref=e1029]: Order order = fOrder.get();
              - generic [ref=e1030]: return new Profile(user, order);
              - generic [ref=e1031]: "} catch (ExecutionException e) {"
              - generic [ref=e1032]: // 一个失败了，另一个仍在跑！
              - generic [ref=e1033]: // 需要手动 cancel(true)，还要处理各种异常路径
              - generic [ref=e1034]: fUser.cancel(true);
              - generic [ref=e1035]: fOrder.cancel(true);
              - generic [ref=e1036]: throw e;
              - generic [ref=e1037]: "}"
            - generic [ref=e1038]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
          - paragraph [ref=e1039]:
            - text: 传统
            - code [ref=e1040]: ExecutorService
            - text: 的问题：
          - list [ref=e1041]:
            - listitem [ref=e1042]: 父任务失败/超时时，子任务不会自动取消，容易泄漏
            - listitem [ref=e1043]: 子任务的异常传播路径复杂，必须手写 try/finally 骨架
            - listitem [ref=e1044]: 从 thread dump 看不出"这几条 VT 属于同一个父任务"
          - heading [level=3] [ref=e1045]:
            - text: 12.5.2 结构化并发的核心约束
            - link "Permalink to \"12.5.2 结构化并发的核心约束\"" [ref=e1046] [cursor=pointer]:
              - /url: "#_12-5-2-结构化并发的核心约束"
              - text: "#"
          - paragraph [ref=e1047]:
            - strong [ref=e1048]: 结构化并发（Structured Concurrency）
            - text: 用一个语法块把父子任务生命周期绑在一起：
            - strong [ref=e1049]: 作用域内派生的所有任务必须在作用域退出前完成
            - text: 。
          - generic [ref=e1050]:
            - button "Copy Code" [ref=e1051] [cursor=pointer]
            - generic [ref=e1052]: java
            - code [ref=e1054]:
              - generic [ref=e1055]: // ✅ 结构化并发（JDK 21 preview / JDK 25 GA API 略有调整）
              - generic [ref=e1056]: "try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {"
              - generic [ref=e1057]: Subtask<User> user = scope.fork(() -> userApi.get(id));
              - generic [ref=e1058]: Subtask<Order> order = scope.fork(() -> orderApi.get(id));
              - generic [ref=e1059]: scope.join(); // 等所有子任务结束或被取消
              - generic [ref=e1060]: scope.throwIfFailed(); // 任一失败则抛出
              - generic [ref=e1061]: return new Profile(user.get(), order.get());
              - generic [ref=e1062]: "} // 作用域退出：残留子任务自动取消"
            - generic [ref=e1063]: 1 2 3 4 5 6 7 8 9 10
          - paragraph [ref=e1064]: 三条硬保证：
          - table [ref=e1065]:
            - rowgroup [ref=e1066]:
              - row [ref=e1067]:
                - columnheader "保证" [ref=e1068]
                - columnheader "意义" [ref=e1069]
            - rowgroup [ref=e1070]:
              - row [ref=e1071]:
                - cell [ref=e1072]:
                  - text: 作用域内 fork 的子任务，一定在
                  - code [ref=e1073]: try
                  - text: 退出前结束
                - cell "不会泄漏" [ref=e1074]
              - row [ref=e1075]:
                - cell [ref=e1076]:
                  - text: 任一子任务失败，
                  - code [ref=e1077]: ShutdownOnFailure
                  - text: 立即取消其余
                - cell "快速失败" [ref=e1078]
              - row [ref=e1079]:
                - cell "Thread dump 能看到父子层级" [ref=e1080]
                - cell "排查友好" [ref=e1081]
          - heading [level=3] [ref=e1082]:
            - text: 12.5.3 两种收敛策略
            - link "Permalink to \"12.5.3 两种收敛策略\"" [ref=e1083] [cursor=pointer]:
              - /url: "#_12-5-3-两种收敛策略"
              - text: "#"
          - table [ref=e1084]:
            - rowgroup [ref=e1085]:
              - row [ref=e1086]:
                - columnheader "策略" [ref=e1087]
                - columnheader "语义" [ref=e1088]
                - columnheader "典型场景" [ref=e1089]
            - rowgroup [ref=e1090]:
              - row [ref=e1091]:
                - cell [ref=e1092]:
                  - code [ref=e1093]: ShutdownOnFailure
                - cell "任一子任务失败则取消其余" [ref=e1094]
                - cell "并行下游都必须成功（聚合 A、B、C 三个 API）" [ref=e1095]
              - row [ref=e1096]:
                - cell [ref=e1097]:
                  - code [ref=e1098]: ShutdownOnSuccess
                - cell "任一子任务成功则取消其余" [ref=e1099]
                - cell "从多副本读取，取最先返回的" [ref=e1100]
          - generic [ref=e1101]:
            - button "Copy Code" [ref=e1102] [cursor=pointer]
            - generic [ref=e1103]: java
            - code [ref=e1105]:
              - generic [ref=e1106]: // 场景 A：三个下游都要成功
              - generic [ref=e1107]: "try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {"
              - generic [ref=e1108]: var a = scope.fork(this::callA);
              - generic [ref=e1109]: var b = scope.fork(this::callB);
              - generic [ref=e1110]: var c = scope.fork(this::callC);
              - generic [ref=e1111]: scope.join().throwIfFailed();
              - generic [ref=e1112]: return merge(a.get(), b.get(), c.get());
              - generic [ref=e1113]: "}"
              - generic [ref=e1114]: // 场景 B：多个副本取最快
              - generic [ref=e1115]: "try (var scope = new StructuredTaskScope.ShutdownOnSuccess<Result>()) {"
              - generic [ref=e1116]: scope.fork(() -> replica1.query());
              - generic [ref=e1117]: scope.fork(() -> replica2.query());
              - generic [ref=e1118]: scope.fork(() -> replica3.query());
              - generic [ref=e1119]: return scope.join().result();
              - generic [ref=e1120]: "}"
            - generic [ref=e1121]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
          - heading [level=3] [ref=e1122]:
            - text: 12.5.4 超时与取消
            - link "Permalink to \"12.5.4 超时与取消\"" [ref=e1123] [cursor=pointer]:
              - /url: "#_12-5-4-超时与取消"
              - text: "#"
          - paragraph [ref=e1124]:
            - code [ref=e1125]: StructuredTaskScope
            - text: 天然支持超时和外部取消：
          - generic [ref=e1126]:
            - button "Copy Code" [ref=e1127] [cursor=pointer]
            - generic [ref=e1128]: java
            - code [ref=e1130]:
              - generic [ref=e1131]: "try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {"
              - generic [ref=e1132]: var user = scope.fork(() -> userApi.get(id));
              - generic [ref=e1133]: var order = scope.fork(() -> orderApi.get(id));
              - generic [ref=e1134]: scope.joinUntil(Instant.now().plusSeconds(2)); // 全局超时
              - generic [ref=e1135]: scope.throwIfFailed();
              - generic [ref=e1136]: return new Profile(user.get(), order.get());
              - generic [ref=e1137]: "} catch (TimeoutException e) {"
              - generic [ref=e1138]: // 超时时作用域自动关闭，两个子任务收到中断
              - generic [ref=e1139]: throw new ServiceUnavailableException(e);
              - generic [ref=e1140]: "}"
            - generic [ref=e1141]: 1 2 3 4 5 6 7 8 9 10 11 12
          - paragraph [ref=e1142]:
            - text: 比起手工写
            - code [ref=e1143]: Future.get(timeout, unit)
            - text: 加上一堆 cancel，代码短得多且更难写错。
          - heading [level=3] [ref=e1144]:
            - text: 12.5.5 API 稳定性提示
            - link "Permalink to \"12.5.5 API 稳定性提示\"" [ref=e1145] [cursor=pointer]:
              - /url: "#_12-5-5-api-稳定性提示"
              - text: "#"
          - paragraph [ref=e1146]:
            - code [ref=e1147]: StructuredTaskScope
            - text: 在 JDK 21 是 preview（第一轮），JDK 22–24 经过多轮 preview，
            - strong [ref=e1148]: JDK 25 正式 GA，API 名称有小幅调整
            - text: （例如
            - code [ref=e1149]: ShutdownOnFailure
            - text: 变为
            - code [ref=e1150]: Joiner.awaitAllSuccessfulOrThrow()
            - text: 风格）。生产使用时以目标 JDK 版本的 JEP 为准。
          - separator [ref=e1151]
          - heading [level=2] [ref=e1152]:
            - text: 12.6 虚拟线程时代重新评估线程池
            - link "Permalink to \"12.6 虚拟线程时代重新评估线程池\"" [ref=e1153] [cursor=pointer]:
              - /url: "#_12-6-虚拟线程时代重新评估线程池"
              - text: "#"
          - paragraph [ref=e1154]: 用一张表总结虚拟线程 GA 之后传统线程池经验哪些还成立、哪些需要重估：
          - table [ref=e1155]:
            - rowgroup [ref=e1156]:
              - row [ref=e1157]:
                - columnheader "维度" [ref=e1158]
                - columnheader "平台线程池的经验" [ref=e1159]
                - columnheader "虚拟线程时代的调整" [ref=e1160]
            - rowgroup [ref=e1161]:
              - row [ref=e1162]:
                - cell "IO 密集处理" [ref=e1163]
                - cell [ref=e1164]:
                  - code [ref=e1165]: poolSize = 2 × N_CPU
                  - text: ，队列 + 拒绝策略
                - cell [ref=e1166]:
                  - text: 直接
                  - code [ref=e1167]: newVirtualThreadPerTaskExecutor
                  - text: ，无参数
              - row [ref=e1168]:
                - cell "CPU 密集计算" [ref=e1169]
                - cell [ref=e1170]:
                  - code [ref=e1171]: poolSize = N_CPU + 1
                - cell [ref=e1172]:
                  - strong [ref=e1173]: 保持不变
              - row [ref=e1174]:
                - cell "定时调度" [ref=e1175]
                - cell [ref=e1176]:
                  - code [ref=e1177]: ScheduledThreadPoolExecutor
                - cell [ref=e1178]:
                  - strong [ref=e1179]: 保持不变
                  - text: （VT 无 scheduled 变体）
              - row [ref=e1180]:
                - cell "天然限流" [ref=e1181]
                - cell [ref=e1182]:
                  - text: 依赖
                  - code [ref=e1183]: maxPoolSize
                  - text: +
                  - code [ref=e1184]: BoundedQueue
                - cell [ref=e1185]:
                  - text: 显式
                  - code [ref=e1186]: Semaphore
                  - text: 或专用限流器
              - row [ref=e1187]:
                - cell "上下文传递" [ref=e1188]
                - cell [ref=e1189]:
                  - code [ref=e1190]: TransmittableThreadLocal
                - cell [ref=e1191]:
                  - code [ref=e1192]: ScopedValue
                  - text: （preview）
              - row [ref=e1193]:
                - cell "请求超时" [ref=e1194]
                - cell [ref=e1195]:
                  - code [ref=e1196]: Future.get(timeout)
                - cell [ref=e1197]:
                  - code [ref=e1198]: StructuredTaskScope.joinUntil
              - row [ref=e1199]:
                - cell "命名与排查" [ref=e1200]
                - cell [ref=e1201]:
                  - code [ref=e1202]: ThreadFactory
                  - text: + 命名规范
                - cell [ref=e1203]:
                  - code [ref=e1204]: Thread.ofVirtual().name(prefix, seq)
          - paragraph [ref=e1205]:
            - strong [ref=e1206]: 判断决策
            - text: ：
          - img [ref=e1208]:
            - generic [ref=e1209]: 虚拟线程选型决策树
            - generic [ref=e1211]: 任务是 CPU 密集吗？
            - generic [ref=e1212]: 是
            - generic [ref=e1214]: 平台线程池
            - generic [ref=e1215]: (N_CPU + 1)
            - generic [ref=e1216]: 否
            - generic [ref=e1218]: 用了 synchronized + 阻塞 IO？
            - generic [ref=e1219]: 是
            - generic [ref=e1222]: JDK < 24？
            - generic [ref=e1223]: 是
            - generic [ref=e1225]: 改 ReentrantLock
            - generic [ref=e1226]: 或使用平台线程
            - generic [ref=e1227]: 否
            - generic [ref=e1229]: 虚拟线程
            - generic [ref=e1230]: 否
            - generic [ref=e1232]: 虚拟线程
            - generic [ref=e1234]: 还需要背压吗？
            - generic [ref=e1235]: 是
            - generic [ref=e1237]: VT + Semaphore
            - generic [ref=e1238]: 显式限流
            - generic [ref=e1239]: 否
            - generic [ref=e1241]: 直接用 VT
            - generic [ref=e1243]: 速查表
            - generic [ref=e1244]: ✅ IO 密集（DB / RPC / HTTP）→ 虚拟线程，无需调参
            - generic [ref=e1245]: ✅ IO 密集 + 需要限流 → 虚拟线程 + Semaphore
            - generic [ref=e1246]: ✅ CPU 密集 → 平台线程池（N_CPU + 1），虚拟线程无收益
            - generic [ref=e1247]: ⚠️ synchronized + 阻塞 IO（JDK < 24）→ 改 ReentrantLock 或用平台线程
            - generic [ref=e1248]: 💡 定时任务、需要线程亲和性的库 → 仍用平台线程池
            - generic [ref=e1249]: 💡 ThreadLocal 密集 → 注意百万 VT 的内存开销，考虑 ScopedValue
          - separator [ref=e1250]
          - heading [level=2] [ref=e1251]:
            - text: 12.7 一段完整示例：从传统 API 迁移到虚拟线程
            - link "Permalink to \"12.7 一段完整示例：从传统 API 迁移到虚拟线程\"" [ref=e1252] [cursor=pointer]:
              - /url: "#_12-7-一段完整示例-从传统-api-迁移到虚拟线程"
              - text: "#"
          - paragraph [ref=e1253]:
            - text: 假设一个订单详情接口：聚合
            - code [ref=e1254]: UserService
            - text: 、
            - code [ref=e1255]: OrderService
            - text: 、
            - code [ref=e1256]: InventoryService
            - text: 三处数据，任一失败即失败，总超时 500 ms。
          - generic [ref=e1257]:
            - button "Copy Code" [ref=e1258] [cursor=pointer]
            - generic [ref=e1259]: java
            - code [ref=e1261]:
              - generic [ref=e1262]: // 迁移前：CompletableFuture 版本
              - generic [ref=e1263]: "public Profile loadProfile(String id) {"
              - generic [ref=e1264]: CompletableFuture<User> fUser = CompletableFuture.supplyAsync(() -> userApi.get(id), pool);
              - generic [ref=e1265]: CompletableFuture<Order> fOrder = CompletableFuture.supplyAsync(() -> orderApi.get(id), pool);
              - generic [ref=e1266]: CompletableFuture<Inventory> fInv = CompletableFuture.supplyAsync(() -> invApi.get(id), pool);
              - generic [ref=e1267]: "try {"
              - generic [ref=e1268]: return CompletableFuture.allOf(fUser, fOrder, fInv)
              - generic [ref=e1269]: .orTimeout(500, TimeUnit.MILLISECONDS)
              - generic [ref=e1270]: .thenApply(v -> new Profile(fUser.join(), fOrder.join(), fInv.join()))
              - generic [ref=e1271]: .join();
              - generic [ref=e1272]: "} catch (CompletionException e) {"
              - generic [ref=e1273]: // 已有子任务不会自动取消，需要额外处理
              - generic [ref=e1274]: fUser.cancel(true); fOrder.cancel(true); fInv.cancel(true);
              - generic [ref=e1275]: throw unwrap(e);
              - generic [ref=e1276]: "}"
              - generic [ref=e1277]: "}"
            - generic [ref=e1278]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
          - generic [ref=e1279]:
            - button "Copy Code" [ref=e1280] [cursor=pointer]
            - generic [ref=e1281]: java
            - code [ref=e1283]:
              - generic [ref=e1284]: // 迁移后：虚拟线程 + 结构化并发
              - generic [ref=e1285]: "public Profile loadProfile(String id) throws Exception {"
              - generic [ref=e1286]: "try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {"
              - generic [ref=e1287]: Subtask<User> user = scope.fork(() -> userApi.get(id));
              - generic [ref=e1288]: Subtask<Order> order = scope.fork(() -> orderApi.get(id));
              - generic [ref=e1289]: Subtask<Inventory> inv = scope.fork(() -> invApi.get(id));
              - generic [ref=e1290]: scope.joinUntil(Instant.now().plusMillis(500));
              - generic [ref=e1291]: scope.throwIfFailed();
              - generic [ref=e1292]: return new Profile(user.get(), order.get(), inv.get());
              - generic [ref=e1293]: "}"
              - generic [ref=e1294]: "}"
            - generic [ref=e1295]: 1 2 3 4 5 6 7 8 9 10 11 12 13
          - paragraph [ref=e1296]: 代码行数减半，异常传播路径清晰，超时语义直观，子任务的生命周期由作用域托管。这就是虚拟线程与结构化并发组合带来的最直接收益。
          - separator [ref=e1297]
          - heading [level=2] [ref=e1298]:
            - text: 12.8 本章小结
            - link "Permalink to \"12.8 本章小结\"" [ref=e1299] [cursor=pointer]:
              - /url: "#_12-8-本章小结"
              - text: "#"
          - table [ref=e1300]:
            - rowgroup [ref=e1301]:
              - row [ref=e1302]:
                - columnheader "问题" [ref=e1303]
                - columnheader "根源" [ref=e1304]
                - columnheader "解决方案" [ref=e1305]
            - rowgroup [ref=e1306]:
              - row [ref=e1307]:
                - cell "平台线程数量受硬限制" [ref=e1308]
                - cell "OS 1:1 模型 + 上下文切换成本" [ref=e1309]
                - cell "虚拟线程的 M:N 调度" [ref=e1310]
              - row [ref=e1311]:
                - cell "Reactor 代码断裂、调试困难" [ref=e1312]
                - cell "异步链式编程范式" [ref=e1313]
                - cell "同步风格的虚拟线程" [ref=e1314]
              - row [ref=e1315]:
                - cell [ref=e1316]:
                  - code [ref=e1317]: synchronized
                  - text: 阻塞 IO 让 Carrier 被钉死
                - cell "JDK 21–23 的实现限制" [ref=e1318]
                - cell [ref=e1319]:
                  - text: 迁移到
                  - code [ref=e1320]: ReentrantLock
                  - text: 或升级 JDK 24+
              - row [ref=e1321]:
                - cell "CPU 密集任务用虚拟线程无收益" [ref=e1322]
                - cell "Carrier 数量仍受 CPU 核数限制" [ref=e1323]
                - cell "CPU 密集仍用平台线程池" [ref=e1324]
              - row [ref=e1325]:
                - cell "无天然背压导致下游被打挂" [ref=e1326]
                - cell [ref=e1327]:
                  - code [ref=e1328]: newVirtualThreadPerTaskExecutor
                  - text: 无并发上限
                - cell [ref=e1329]:
                  - text: 外挂
                  - code [ref=e1330]: Semaphore
                  - text: 或专用限流器
              - row [ref=e1331]:
                - cell "子任务派生后失控、异常传播复杂" [ref=e1332]
                - cell [ref=e1333]:
                  - text: 平面式的
                  - code [ref=e1334]: Future
                  - text: 组合
                - cell [ref=e1335]:
                  - code [ref=e1336]: StructuredTaskScope
                  - text: 结构化并发
          - separator [ref=e1337]
          - blockquote [ref=e1338]:
            - paragraph [ref=e1339]:
              - strong [ref=e1340]: 纵横联系
            - list [ref=e1341]:
              - listitem [ref=e1342]:
                - strong [ref=e1343]: 向前依赖
                - text: ：第 2 章的 1:1 线程模型是本章 M:N 调度的对照起点；第 8 章
                - code [ref=e1344]: LockSupport.park
                - text: 是 VT 卸载的技术底座；第 3 章
                - code [ref=e1345]: ThreadLocal
                - text: 的存储结构解释了 VT 场景下"每 VT 独立 TLM"的内存代价。
              - listitem [ref=e1346]:
                - strong [ref=e1347]: 向后使用
                - text: ：第 13 章诊断章会介绍 VT 特有的排查工具（
                - code [ref=e1348]: "-Djdk.tracePinnedThreads"
                - text: 、
                - code [ref=e1349]: jcmd Thread.dump_to_file
                - text: 的 JSON 输出、JFR 的
                - code [ref=e1350]: VirtualThreadPinned
                - text: 事件）。
              - listitem [ref=e1351]:
                - strong [ref=e1352]: 跨卷关系
                - text: ：第四卷网络与通信中 Netty / Reactor 的设计前提在虚拟线程时代被重新讨论；第六卷 Spring MVC 从 6.1、Tomcat 从 10.1 起支持将 VT 作为请求处理线程；第七卷高并发架构中"接入层线程模型选型"直接引用本章结论。
      - contentinfo [ref=e1353]:
        - generic [ref=e1354]:
          - link "在编辑器中打开源文件" [ref=e1356] [cursor=pointer]:
            - /url: http://__vscode__/03-java-concurrency/chapter-12-virtual-thread.md
          - paragraph [ref=e1359]:
            - text: "Last updated:"
            - time [ref=e1360]: 8/7/26, 10:48 AM
        - navigation "Pager" [ref=e1361]:
          - link "上一章 异步编程" [ref=e1364] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-11-async-model.html
            - generic [ref=e1365]: 上一章
            - generic [ref=e1366]: 异步编程
          - link "下一章 诊断与优化" [ref=e1368] [cursor=pointer]:
            - /url: /java-world/03-java-concurrency/chapter-13-diagnostics.html
            - generic [ref=e1369]: 下一章
            - generic [ref=e1370]: 诊断与优化
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const PAGE_VT = '/java-world/03-java-concurrency/chapter-12-virtual-thread';
  4   | const PAGE_SEC = '/java-world/06-java-enterprise/chapter-08-security-deploy';
  5   | 
  6   | async function openEditor(page: any, url: string, svgIndex: number) {
  7   |   page.on('pageerror', e => console.log('  ⚠️ JS:', e.message));
  8   |   await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  9   |   // 等待 VitePress 渲染完成
  10  |   await page.waitForFunction(() => {
  11  |     const app = document.querySelector('#app');
  12  |     return app && app.children.length > 0;
  13  |   }, { timeout: 15000 });
  14  |   await page.waitForSelector('.svg-container', { timeout: 15000 });
  15  |   // 等待 SVG 在容器中渲染
  16  |   await page.waitForFunction((idx: number) => {
  17  |     const c = document.querySelectorAll('.svg-container')[idx];
  18  |     return c && c.querySelector('svg');
  19  |   }, svgIndex, { timeout: 10000 });
  20  |   await page.waitForTimeout(500);
  21  |   // 滚动 SVG 到视口中心并触发 mouseenter（Vue 的 hover 事件）
  22  |   await page.evaluate((idx: number) => {
  23  |     const c = document.querySelectorAll('.svg-container')[idx];
  24  |     if (!c) return;
  25  |     c.scrollIntoView({ block: 'center' });
  26  |     setTimeout(() => c.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true })), 200);
  27  |   }, svgIndex);
  28  |   await page.waitForTimeout(800);
  29  |   // 点击编辑按钮
  30  |   const editBtn = page.locator('.svg-container').nth(svgIndex).locator('.svg-edit-btn');
> 31  |   await editBtn.click({ force: true });
      |                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  32  |   // 等待编辑器弹窗出现
  33  |   await page.waitForSelector('.editor-overlay', { timeout: 15000 });
  34  |   // 等待 loading 消失（画布初始化完成）
  35  |   await page.waitForFunction(() => {
  36  |     return !document.querySelector('.loading') && !!(window as any).__fabricCanvas;
  37  |   }, { timeout: 15000 });
  38  |   await page.waitForTimeout(500);
  39  |   await page.evaluate(() => {
  40  |     const c = (window as any).__fabricCanvas;
  41  |     if (c) c.setViewportTransform([1, 0, 0, 1, 0, 0]);
  42  |   });
  43  | }
  44  | 
  45  | async function getArrowGroups(page: any) {
  46  |   return page.evaluate(() => {
  47  |     const c = (window as any).__fabricCanvas;
  48  |     if (!c) return [];
  49  |     return c.getObjects().filter((o: any) => o.type === 'group').map((g: any) => {
  50  |       const children = g._objects || g.getObjects() || [];
  51  |       const line = children.find((ch: any) => ch.type === 'line');
  52  |       const poly = children.find((ch: any) => ch.type === 'polygon');
  53  |       if (!line || !poly) return null;
  54  |       const points: string[] = (poly.points || []).map((p: any) => `${Math.round(p.x)},${Math.round(p.y)}`);
  55  |       const xs = points.map(p => parseInt(p.split(',')[0]));
  56  |       const ys = points.map(p => parseInt(p.split(',')[1]));
  57  |       return { x1: Math.round(line.x1), y1: Math.round(line.y1), x2: Math.round(line.x2), y2: Math.round(line.y2),
  58  |         stroke: line.stroke, polyFill: poly.fill, points,
  59  |         xSpread: Math.max(...xs) - Math.min(...xs), ySpread: Math.max(...ys) - Math.min(...ys), selectable: g.selectable };
  60  |     }).filter(Boolean);
  61  |   });
  62  | }
  63  | 
  64  | test('A1: vt决策树 — 9箭头全为三角形', async ({ page }) => {
  65  |   // 收集所有 console 错误
  66  |   const errors: string[] = [];
  67  |   page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  68  |   
  69  |   await openEditor(page, PAGE_VT, 1);
  70  |   
  71  |   // 检查是否有加载错误
  72  |   if (errors.length > 0) console.log(`[Console错误] ${errors.join(' | ')}`);
  73  |   
  74  |   // 诊断 canvas 状态
  75  |   const diag = await page.evaluate(() => {
  76  |     const c = (window as any).__fabricCanvas;
  77  |     if (!c) return { err: 'no canvas' };
  78  |     return { total: c.getObjects().length, groups: c.getObjects().filter((o: any) => o.type === 'group').length, lines: c.getObjects().filter((o: any) => o.type === 'line').length };
  79  |   });
  80  |   console.log(`[诊断] total=${diag.total} groups=${diag.groups} lines=${diag.lines}`);
  81  |   
  82  |   const arrows = await getArrowGroups(page);
  83  |   console.log(`箭头数: ${arrows.length}`);
  84  |   expect(arrows.length).toBeGreaterThanOrEqual(9);
  85  |   for (const a of arrows) {
  86  |     const ok = a.xSpread > 0 && a.ySpread > 0;
  87  |     console.log(`  ${a.x1},${a.y1}→${a.x2},${a.y2}: x=${a.xSpread} y=${a.ySpread} ${ok ? '✅' : '❌ 折叠!'}`);
  88  |     expect(ok, `箭头不应折叠 (xSpread=${a.xSpread}, ySpread=${a.ySpread})`).toBe(true);
  89  |   }
  90  |   console.log('✅ 全部三角形');
  91  | });
  92  | 
  93  | test('A2: security-auth-flow — 9箭头全为三角形', async ({ page }) => {
  94  |   await page.goto(PAGE_SEC, { waitUntil: 'networkidle', timeout: 30000 });
  95  |   await page.waitForSelector('.svg-container', { timeout: 15000 });
  96  |   // 单个 evaluate 完成全部：滚动+等待+dispatch+点击+等待 editor
  97  |   await page.evaluate(async () => {
  98  |     const c = document.querySelector('.svg-container'); if (!c) return;
  99  |     c.scrollIntoView({ block: 'center' });
  100 |     await new Promise(r => setTimeout(r, 500));
  101 |     c.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  102 |     await new Promise(r => setTimeout(r, 500));
  103 |     const btn = c.querySelector('.svg-edit-btn'); if (!btn) return;
  104 |     btn.click();
  105 |   });
  106 |   await page.waitForSelector('.editor-overlay', { timeout: 15000 });
  107 |   await page.waitForTimeout(2000);
  108 |   await page.evaluate(() => { const c = (window as any).__fabricCanvas; if (c) c.setViewportTransform([1,0,0,1,0,0]); });
  109 | 
  110 |   const arrows = await getArrowGroups(page);
  111 |   expect(arrows.length).toBeGreaterThanOrEqual(9);
  112 |   for (const a of arrows) {
  113 |     const ok = a.xSpread > 0 && a.ySpread > 0;
  114 |     console.log(`  ${a.x1},${a.y1}→${a.x2},${a.y2}: ${ok ? '✅' : '❌'}`);
  115 |     expect(ok).toBe(true);
  116 |   }
  117 |   console.log('✅ 全部三角形');
  118 | });
  119 | 
  120 | test('B1: 箭头方向 — 尖端指向线终点', async ({ page }) => {
  121 |   await openEditor(page, PAGE_VT, 1);
  122 |   const arrows = await getArrowGroups(page);
  123 |   for (const a of arrows) {
  124 |     const [tx, ty] = a.points[0].split(',').map(Number);
  125 |     const d = Math.sqrt((tx - a.x2) ** 2 + (ty - a.y2) ** 2);
  126 |     console.log(`  尖端@(${tx},${ty}) 终点@(${a.x2},${a.y2}) 差=${d.toFixed(1)}`);
  127 |     expect(d, '尖端应指向线终点').toBeLessThanOrEqual(5);
  128 |   }
  129 |   console.log('✅ 方向正确');
  130 | });
  131 | 
```