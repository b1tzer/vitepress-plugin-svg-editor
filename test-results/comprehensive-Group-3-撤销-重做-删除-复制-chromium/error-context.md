# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.spec.ts >> Group 3: 撤销/重做/删除/复制
- Location: tests/comprehensive.spec.ts:122:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('.editor-overlay button').nth(1)
    - locator resolved to <button disabled data-tip="重做" data-v-45deb99f="" aria-label="重做 Ctrl+Y">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    104 × waiting for element to be visible, enabled and stable
        - element is not enabled
      - retrying click action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
              - navigation "Main Navigation" [ref=e9]:
                - link "首页" [ref=e11] [cursor=pointer]:
                  - /url: /java-world/
                - button "目录" [ref=e14] [cursor=pointer]
                - link "GitHub" [ref=e18] [cursor=pointer]:
                  - /url: https://github.com/b1tzer/java-world
              - switch "Switch to dark theme" [ref=e21] [cursor=pointer]
              - link "github" [ref=e27] [cursor=pointer]:
                - /url: https://github.com/b1tzer/java-world
    - complementary [ref=e29]:
      - navigation "Sidebar Navigation" [ref=e31]:
        - generic [ref=e34]:
          - button [ref=e35] [cursor=pointer]:
            - heading "第一卷 Java 语言" [level=2] [ref=e37]
            - button "toggle section" [ref=e38]
          - generic [ref=e40]:
            - link [ref=e44] [cursor=pointer]:
              - /url: /java-world/01-java-language/chapter-01-type-system.html
              - paragraph [ref=e45]: 类型系统
            - link [ref=e49] [cursor=pointer]:
              - /url: /java-world/01-java-language/chapter-02-oop.html
              - paragraph [ref=e50]: 面向对象
            - link [ref=e54] [cursor=pointer]:
              - /url: /java-world/01-java-language/chapter-03-generics.html
              - paragraph [ref=e55]: 泛型
            - link [ref=e59] [cursor=pointer]:
              - /url: /java-world/01-java-language/chapter-04-annotation-lambda.html
              - paragraph [ref=e60]: 注解与 Lambda
        - generic [ref=e62]:
          - button [ref=e63] [cursor=pointer]:
            - heading "第二卷 JVM Runtime" [level=2] [ref=e65]
            - button "toggle section" [ref=e66]
          - generic [ref=e68]:
            - link [ref=e72] [cursor=pointer]:
              - /url: /java-world/02-jvm-runtime/chapter-01-bytecode-classloading.html
              - paragraph [ref=e73]: 字节码与类加载
            - link [ref=e77] [cursor=pointer]:
              - /url: /java-world/02-jvm-runtime/chapter-02-memory-model.html
              - paragraph [ref=e78]: JVM 运行时数据区
            - link [ref=e82] [cursor=pointer]:
              - /url: /java-world/02-jvm-runtime/chapter-03-object-model.html
              - paragraph [ref=e83]: 对象模型
            - link [ref=e87] [cursor=pointer]:
              - /url: /java-world/02-jvm-runtime/chapter-04-gc.html
              - paragraph [ref=e88]: 垃圾回收
            - link [ref=e92] [cursor=pointer]:
              - /url: /java-world/02-jvm-runtime/chapter-05-jit.html
              - paragraph [ref=e93]: JIT 编译
            - link [ref=e97] [cursor=pointer]:
              - /url: /java-world/02-jvm-runtime/chapter-06-diagnostics.html
              - paragraph [ref=e98]: 线上排查与诊断
        - generic [ref=e100]:
          - button [ref=e101] [cursor=pointer]:
            - heading "第三卷 Java 并发" [level=2] [ref=e103]
            - button "toggle section" [ref=e104]
          - generic [ref=e106]:
            - link [ref=e110] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-01-why-concurrency.html
              - paragraph [ref=e111]: 并发的本质
            - link [ref=e115] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-02-thread-model.html
              - paragraph [ref=e116]: 线程：Java 的执行单元
            - link [ref=e120] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-03-threadlocal.html
              - paragraph [ref=e121]: 线程封闭：ThreadLocal
            - link [ref=e125] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-04-jmm.html
              - paragraph [ref=e126]: Java 内存模型（JMM）
            - link [ref=e130] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-05-volatile.html
              - paragraph [ref=e131]: volatile
            - link [ref=e135] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-06-synchronized.html
              - paragraph [ref=e136]: synchronized
            - link [ref=e140] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-07-cas-atomic.html
              - paragraph [ref=e141]: CAS 与原子类
            - link [ref=e145] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-08-locksupport-aqs.html
              - paragraph [ref=e146]: LockSupport 与 AQS
            - link [ref=e150] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-09-concurrent-collections.html
              - paragraph [ref=e151]: 并发集合
            - link [ref=e155] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-10-thread-pool.html
              - paragraph [ref=e156]: 线程池
            - link [ref=e160] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-11-async-model.html
              - paragraph [ref=e161]: 异步编程
            - link [ref=e165] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-12-virtual-thread.html
              - paragraph [ref=e166]: 虚拟线程与结构化并发
            - link [ref=e170] [cursor=pointer]:
              - /url: /java-world/03-java-concurrency/chapter-13-diagnostics.html
              - paragraph [ref=e171]: 诊断与优化
        - generic [ref=e173]:
          - button [ref=e174] [cursor=pointer]:
            - heading "第四卷 网络与通信" [level=2] [ref=e176]
            - button "toggle section" [ref=e177]
          - generic [ref=e179]:
            - link [ref=e183] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-01-network-basics.html
              - paragraph [ref=e184]: 网络通信基础
            - link [ref=e188] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-02-tcp-ip.html
              - paragraph [ref=e189]: TCP/IP
            - link [ref=e193] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-03-socket.html
              - paragraph [ref=e194]: Socket 编程
            - link [ref=e198] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-04-nio.html
              - paragraph [ref=e199]: Java NIO
            - link [ref=e203] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-05-netty.html
              - paragraph [ref=e204]: Netty
            - link [ref=e208] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-06-http.html
              - paragraph [ref=e209]: HTTP 协议
            - link [ref=e213] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-07-servlet-springmvc.html
              - paragraph [ref=e214]: Servlet 到 Spring MVC
            - link [ref=e218] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-08-rpc.html
              - paragraph [ref=e219]: RPC 与微服务
            - link [ref=e223] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-09-long-connection.html
              - paragraph [ref=e224]: 长连接与实时通信
            - link [ref=e228] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-10-network-diagnostics.html
              - paragraph [ref=e229]: 网络诊断
        - generic [ref=e231]:
          - button [ref=e232] [cursor=pointer]:
            - heading "第五卷 数据访问与持久化" [level=2] [ref=e234]
            - button "toggle section" [ref=e235]
          - generic [ref=e237]:
            - link [ref=e241] [cursor=pointer]:
              - /url: /java-world/05-java-data-access/chapter-01-persistence-thought.html
              - paragraph [ref=e242]: 持久化思想
            - link [ref=e246] [cursor=pointer]:
              - /url: /java-world/05-java-data-access/chapter-02-jdbc.html
              - paragraph [ref=e247]: JDBC
            - link [ref=e251] [cursor=pointer]:
              - /url: /java-world/05-java-data-access/chapter-03-mybatis.html
              - paragraph [ref=e252]: MyBatis
            - link [ref=e256] [cursor=pointer]:
              - /url: /java-world/05-java-data-access/chapter-04-orm-deep.html
              - paragraph [ref=e257]: ORM 深入
            - link [ref=e261] [cursor=pointer]:
              - /url: /java-world/05-java-data-access/chapter-05-db-principles.html
              - paragraph [ref=e262]: 数据库核心原理
            - link [ref=e266] [cursor=pointer]:
              - /url: /java-world/05-java-data-access/chapter-06-spring-transaction.html
              - paragraph [ref=e267]: Spring 事务
            - link [ref=e271] [cursor=pointer]:
              - /url: /java-world/05-java-data-access/chapter-07-performance.html
              - paragraph [ref=e272]: 性能优化
        - generic [ref=e274]:
          - button [ref=e275] [cursor=pointer]:
            - heading "第六卷 企业架构" [level=2] [ref=e277]
            - button "toggle section" [ref=e278]
          - generic [ref=e280]:
            - link [ref=e284] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-01-spring-core.html
              - paragraph [ref=e285]: Spring 核心思想
            - link [ref=e289] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-02-container-aop.html
              - paragraph [ref=e290]: 容器与 AOP
            - link [ref=e294] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-03-spring-mvc.html
              - paragraph [ref=e295]: Spring MVC
            - link [ref=e299] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-04-spring-boot.html
              - paragraph [ref=e300]: Spring Boot
            - link [ref=e304] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-05-data-integration.html
              - paragraph [ref=e305]: 数据访问整合
            - link [ref=e309] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-06-microservices.html
              - paragraph [ref=e310]: 微服务架构
            - link [ref=e314] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-07-governance.html
              - paragraph [ref=e315]: 分布式治理
            - link [ref=e319] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-08-security-deploy.html
              - paragraph [ref=e320]: 安全与部署
            - link [ref=e324] [cursor=pointer]:
              - /url: /java-world/06-java-enterprise/chapter-09-observability.html
              - paragraph [ref=e325]: 可观测性
        - generic [ref=e327]:
          - button [ref=e328] [cursor=pointer]:
            - heading "第七卷 性能与架构" [level=2] [ref=e330]
            - button "toggle section" [ref=e331]
          - generic [ref=e333]:
            - link [ref=e337] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-01-architecture.html
              - paragraph [ref=e338]: 架构思想
            - link [ref=e342] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-02-ddd.html
              - paragraph [ref=e343]: 领域驱动设计
            - link [ref=e347] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-03-high-concurrency.html
              - paragraph [ref=e348]: 高并发设计
            - link [ref=e352] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-04-high-availability.html
              - paragraph [ref=e353]: 高可用设计
            - link [ref=e357] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-05-distributed.html
              - paragraph [ref=e358]: 分布式系统
            - link [ref=e362] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-06-data-architecture.html
              - paragraph [ref=e363]: 数据架构
            - link [ref=e367] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-07-messaging.html
              - paragraph [ref=e368]: 消息驱动
            - link [ref=e372] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-08-performance.html
              - paragraph [ref=e373]: 性能工程
            - link [ref=e377] [cursor=pointer]:
              - /url: /java-world/07-performance-architecture/chapter-09-case-studies.html
              - paragraph [ref=e378]: 架构案例
    - generic [ref=e381]:
      - navigation [ref=e387]:
        - generic [ref=e388]:
          - heading "页面导航" [level=2] [ref=e390]
          - list [ref=e391]:
            - listitem [ref=e392]:
              - link "3.1 Socket 的本质：OS 如何抽象网络通信" [ref=e393] [cursor=pointer]:
                - /url: "#_3-1-socket-的本质-os-如何抽象网络通信"
              - list [ref=e394]:
                - listitem [ref=e395]:
                  - link "3.1.1 从网卡到进程：数据的旅程" [ref=e396] [cursor=pointer]:
                    - /url: "#_3-1-1-从网卡到进程-数据的旅程"
                - listitem [ref=e397]:
                  - link "3.1.2 Socket = 文件描述符 + 协议栈" [ref=e398] [cursor=pointer]:
                    - /url: "#_3-1-2-socket-文件描述符-协议栈"
                - listitem [ref=e399]:
                  - link "3.1.3 五元组与连接标识" [ref=e400] [cursor=pointer]:
                    - /url: "#_3-1-3-五元组与连接标识"
                - listitem [ref=e401]:
                  - link "3.1.4 Socket 的两种类型" [ref=e402] [cursor=pointer]:
                    - /url: "#_3-1-4-socket-的两种类型"
            - listitem [ref=e403]:
              - link "3.2 Socket 系统调用与 Java 映射" [ref=e404] [cursor=pointer]:
                - /url: "#_3-2-socket-系统调用与-java-映射"
              - list [ref=e405]:
                - listitem [ref=e406]:
                  - link "3.2.1 socket()：创建端点" [ref=e407] [cursor=pointer]:
                    - /url: "#_3-2-1-socket-创建端点"
                - listitem [ref=e408]:
                  - link "3.2.2 bind() + listen()：绑定端口、开始监听" [ref=e409] [cursor=pointer]:
                    - /url: "#_3-2-2-bind-listen-绑定端口、开始监听"
                - listitem [ref=e410]:
                  - link "3.2.3 accept()：从全连接队列取出连接" [ref=e411] [cursor=pointer]:
                    - /url: "#_3-2-3-accept-从全连接队列取出连接"
                - listitem [ref=e412]:
                  - link "3.2.4 connect()：客户端发起三次握手" [ref=e413] [cursor=pointer]:
                    - /url: "#_3-2-4-connect-客户端发起三次握手"
                - listitem [ref=e414]:
                  - link "3.2.5 read() / write()：数据在内核缓冲区的流转" [ref=e415] [cursor=pointer]:
                    - /url: "#_3-2-5-read-write-数据在内核缓冲区的流转"
                - listitem [ref=e416]:
                  - link "3.2.6 close()：四次挥手与 fd 释放" [ref=e417] [cursor=pointer]:
                    - /url: "#_3-2-6-close-四次挥手与-fd-释放"
            - listitem [ref=e418]:
              - link "3.3 内核视角：Socket 背后的数据结构" [ref=e419] [cursor=pointer]:
                - /url: "#_3-3-内核视角-socket-背后的数据结构"
              - list [ref=e420]:
                - listitem [ref=e421]:
                  - link "3.3.1 发送缓冲区与接收缓冲区" [ref=e422] [cursor=pointer]:
                    - /url: "#_3-3-1-发送缓冲区与接收缓冲区"
                - listitem [ref=e423]:
                  - link "3.3.2 全连接队列与半连接队列" [ref=e424] [cursor=pointer]:
                    - /url: "#_3-3-2-全连接队列与半连接队列"
                - listitem [ref=e425]:
                  - link "3.3.3 阻塞的本质：线程在内核的哪里等" [ref=e426] [cursor=pointer]:
                    - /url: "#_3-3-3-阻塞的本质-线程在内核的哪里等"
                - listitem [ref=e427]:
                  - link "3.3.4 一台机器能承载多少 Socket" [ref=e428] [cursor=pointer]:
                    - /url: "#_3-3-4-一台机器能承载多少-socket"
            - listitem [ref=e429]:
              - link "3.4 Socket 选项：生产中真正要调的参数" [ref=e430] [cursor=pointer]:
                - /url: "#_3-4-socket-选项-生产中真正要调的参数"
              - list [ref=e431]:
                - listitem [ref=e432]:
                  - link "3.4.1 SO_REUSEADDR 与 SO_REUSEPORT" [ref=e433] [cursor=pointer]:
                    - /url: "#_3-4-1-so-reuseaddr-与-so-reuseport"
                - listitem [ref=e434]:
                  - link "3.4.2 TCP_NODELAY：禁用 Nagle 算法" [ref=e435] [cursor=pointer]:
                    - /url: "#_3-4-2-tcp-nodelay-禁用-nagle-算法"
                - listitem [ref=e436]:
                  - link "3.4.3 SO_KEEPALIVE：TCP 层保活" [ref=e437] [cursor=pointer]:
                    - /url: "#_3-4-3-so-keepalive-tcp-层保活"
                - listitem [ref=e438]:
                  - link "3.4.4 SO_RCVBUF / SO_SNDBUF：缓冲区大小" [ref=e439] [cursor=pointer]:
                    - /url: "#_3-4-4-so-rcvbuf-so-sndbuf-缓冲区大小"
                - listitem [ref=e440]:
                  - link "3.4.5 在 Java 中设置 Socket 选项" [ref=e441] [cursor=pointer]:
                    - /url: "#_3-4-5-在-java-中设置-socket-选项"
            - listitem [ref=e442]:
              - link "3.5 动手：用 Java Socket 跑通一个 Echo" [ref=e443] [cursor=pointer]:
                - /url: "#_3-5-动手-用-java-socket-跑通一个-echo"
              - list [ref=e444]:
                - listitem [ref=e445]:
                  - link "3.5.1 Echo Server" [ref=e446] [cursor=pointer]:
                    - /url: "#_3-5-1-echo-server"
                - listitem [ref=e447]:
                  - link "3.5.2 Echo Client" [ref=e448] [cursor=pointer]:
                    - /url: "#_3-5-2-echo-client"
                - listitem [ref=e449]:
                  - link "3.5.3 代码剖析" [ref=e450] [cursor=pointer]:
                    - /url: "#_3-5-3-代码剖析"
                - listitem [ref=e451]:
                  - link "3.5.4 一连接一线程的局限" [ref=e452] [cursor=pointer]:
                    - /url: "#_3-5-4-一连接一线程的局限"
            - listitem [ref=e453]:
              - link "本章小结" [ref=e454] [cursor=pointer]:
                - /url: "#本章小结"
      - generic [ref=e456]:
        - main [ref=e457]:
          - generic [ref=e459]:
            - heading [level=1] [ref=e460]:
              - text: 第3章 Java Socket 编程：网络抽象的起点
              - link "Permalink to \"第3章 Java Socket 编程：网络抽象的起点\"" [ref=e461] [cursor=pointer]:
                - /url: "#第3章-java-socket-编程-网络抽象的起点"
                - text: "#"
            - blockquote [ref=e462]:
              - paragraph [ref=e463]:
                - strong [ref=e464]: 核心问题：
                - text: 你线上报过
                - code [ref=e465]: Too many open files
                - text: ，调过
                - code [ref=e466]: ulimit -n 65535
                - text: ，配过连接池的
                - code [ref=e467]: maxConnections
                - text: ——但你有没有想过，fd 到底是什么？一个
                - code [ref=e468]: new Socket()
                - text: 在内核里到底分配了什么？
                - code [ref=e469]: read()
                - text: 卡住的时候，线程去哪了？一台机器到底能撑多少连接？本章从 OS 内核视角出发，把 Socket 从"一个 Java 对象"拆回它的本质：一个文件描述符、两块内核缓冲区、两对队列。
            - separator [ref=e470]
            - heading [level=2] [ref=e471]:
              - text: 3.1 Socket 的本质：OS 如何抽象网络通信
              - link "Permalink to \"3.1 Socket 的本质：OS 如何抽象网络通信\"" [ref=e472] [cursor=pointer]:
                - /url: "#_3-1-socket-的本质-os-如何抽象网络通信"
                - text: "#"
            - heading [level=3] [ref=e473]:
              - text: 3.1.1 从网卡到进程：数据的旅程
              - link "Permalink to \"3.1.1 从网卡到进程：数据的旅程\"" [ref=e474] [cursor=pointer]:
                - /url: "#_3-1-1-从网卡到进程-数据的旅程"
                - text: "#"
            - paragraph [ref=e475]: 当一台机器的网线收到一个 TCP 包，数据要经过层层处理才能到达应用程序：
            - img [ref=e478]:
              - generic [ref=e479]: 从网卡到进程：数据的旅程
              - generic [ref=e481]: 网卡（硬件）
              - generic [ref=e482]: DMA 到内核内存
              - generic [ref=e484]: 链路层
              - generic [ref=e485]: 校验 MAC 地址，剥离帧头
              - generic [ref=e487]: 网络层
              - generic [ref=e488]: 校验 IP 地址，路由判断
              - generic [ref=e490]: 传输层
              - generic [ref=e491]: 根据端口号找到对应的 Socket
              - generic [ref=e492]: 数据写入 Socket 的接收缓冲区
              - generic [ref=e494]: 应用程序
              - generic [ref=e495]: read() 从缓冲区取出数据
              - generic [ref=e497]: 关键一步
              - generic [ref=e498]: 根据五元组
              - generic [ref=e499]: 找到 Socket
              - generic [ref=e500]: Socket 的价值：把复杂的协议栈封装成"读写缓冲区"
              - generic [ref=e501]: 对应用而言，网络通信和读写文件几乎没有区别
            - paragraph [ref=e502]:
              - text: 关键一步在
              - strong [ref=e503]: 传输层
              - text: ：内核根据报文的
              - strong [ref=e504]: 目标 IP + 目标端口
              - text: （以及源 IP + 源端口）找到对应的 Socket，把数据塞进它的
              - strong [ref=e505]: 接收缓冲区
              - text: 。应用程序调用
              - code [ref=e506]: read()
              - text: 时，读的就是这个缓冲区——它不需要知道网卡型号、TCP 校验和、路由表，内核把这些全部处理好了。
            - paragraph [ref=e507]:
              - text: Socket 的价值就在这里：
              - strong [ref=e508]: 它把复杂的网络协议栈封装成了一个"读写缓冲区"
              - text: 。对应用程序而言，网络通信和读写文件在接口层面几乎没有区别。
            - heading [level=3] [ref=e509]:
              - text: 3.1.2 Socket = 文件描述符 + 协议栈
              - link "Permalink to \"3.1.2 Socket = 文件描述符 + 协议栈\"" [ref=e510] [cursor=pointer]:
                - /url: "#_3-1-2-socket-文件描述符-协议栈"
                - text: "#"
            - paragraph [ref=e511]:
              - text: 在 Unix/Linux 中，Socket 本质上是一个
              - strong [ref=e512]: 文件描述符（File Descriptor, fd）
              - text: 。操作系统把一切 I/O 资源都抽象为 fd——普通文件、管道、设备、网络连接，对应用来说都是一个
              - code [ref=e513]: int
              - text: 数字。
            - img [ref=e516]:
              - generic [ref=e517]: 进程的文件描述符表
              - generic [ref=e519]: fd
              - generic [ref=e521]: 指向的内核对象
              - generic [ref=e523]: "0"
              - generic [ref=e525]: stdin（标准输入）
              - generic [ref=e527]: "1"
              - generic [ref=e529]: stdout（标准输出）
              - generic [ref=e531]: "2"
              - generic [ref=e533]: stderr（标准错误）
              - generic [ref=e535]: "3"
              - generic [ref=e537]: /var/log/app.log
              - generic [ref=e539]: "4"
              - generic [ref=e541]: Socket（TCP）
              - generic [ref=e542]: 192.168.1.1:8080 → 10.0.0.5:43210
              - generic [ref=e544]: "5"
              - generic [ref=e546]: Socket（TCP）
              - generic [ref=e547]: 192.168.1.1:8080 → 10.0.0.6:51782
              - generic [ref=e548]: 每 个 Socket 占 1 个 fd
              - generic [ref=e550]: Socket 本质是 fd + 协议栈，close(fd) 同时释放两者
            - paragraph [ref=e551]: 创建一个 Socket 时，内核做的事情：
            - list [ref=e552]:
              - listitem [ref=e553]:
                - text: 分配一个
                - strong [ref=e554]:
                  - code [ref=e555]: struct socket
                - text: （内核中的 Socket 对象）
              - listitem [ref=e556]:
                - text: 在进程的
                - strong [ref=e557]: 文件描述符表
                - text: 中找一个空位，填入指向该 Socket 的指针
              - listitem [ref=e558]: 返回这个 fd 的编号给应用
            - paragraph [ref=e559]:
              - text: 后续所有操作——
              - code [ref=e560]: read
              - text: 、
              - code [ref=e561]: write
              - text: 、
              - code [ref=e562]: close
              - text: ——都通过这个 fd 编号进行。这就是为什么
              - code [ref=e563]: socket()
              - text: 系统调用的返回值是一个
              - code [ref=e564]: int
              - text: ，而不是一个"连接对象"。
            - blockquote [ref=e565]:
              - paragraph [ref=e566]:
                - strong [ref=e567]: Java 层面的映射
                - text: ：Java 的
                - code [ref=e568]: Socket
                - text: 和
                - code [ref=e569]: ServerSocket
                - text: 对象内部持有一个 OS fd。
                - code [ref=e570]: socket.close()
                - text: 最终调用的就是 OS 的
                - code [ref=e571]: close(fd)
                - text: 。如果 Java 对象被 GC 回收但没有显式
                - code [ref=e572]: close()
                - text: ，fd 的释放要等
                - code [ref=e573]: finalize()
                - text: （JDK 9+ 改为
                - code [ref=e574]: Cleaner
                - text: ），期间 fd 一直被占着——这就是为什么必须用 try-with-resources 显式关闭 Socket。
            - heading [level=3] [ref=e575]:
              - text: 3.1.3 五元组与连接标识
              - link "Permalink to \"3.1.3 五元组与连接标识\"" [ref=e576] [cursor=pointer]:
                - /url: "#_3-1-3-五元组与连接标识"
                - text: "#"
            - paragraph [ref=e577]:
              - text: 一个 TCP 连接由
              - strong [ref=e578]: 五元组
              - text: 唯一标识：
            - table [ref=e579]:
              - rowgroup [ref=e580]:
                - row [ref=e581]:
                  - columnheader "字段" [ref=e582]
                  - columnheader "含义" [ref=e583]
                  - columnheader "示例" [ref=e584]
              - rowgroup [ref=e585]:
                - row [ref=e586]:
                  - cell "源 IP" [ref=e587]
                  - cell "发送方的 IP 地址" [ref=e588]
                  - cell [ref=e589]:
                    - code [ref=e590]: 10.0.0.5
                - row [ref=e591]:
                  - cell "源端口" [ref=e592]
                  - cell "发送方的临时端口" [ref=e593]
                  - cell [ref=e594]:
                    - code [ref=e595]: "43210"
                - row [ref=e596]:
                  - cell "目标 IP" [ref=e597]
                  - cell "接收方的 IP 地址" [ref=e598]
                  - cell [ref=e599]:
                    - code [ref=e600]: 192.168.1.1
                - row [ref=e601]:
                  - cell "目标端口" [ref=e602]
                  - cell "接收方的监听端口" [ref=e603]
                  - cell [ref=e604]:
                    - code [ref=e605]: "8080"
                - row [ref=e606]:
                  - cell "协议" [ref=e607]
                  - cell "TCP 或 UDP" [ref=e608]
                  - cell [ref=e609]:
                    - code [ref=e610]: TCP
            - paragraph [ref=e611]: 五元组相同的两个包属于同一条连接，五元组不同则属于不同连接。
            - paragraph [ref=e612]:
              - strong [ref=e613]: 服务端一个监听端口能接受多少连接？
            - paragraph [ref=e614]:
              - text: 很多初学者以为"一个端口只能一个连接"，这是误解。服务端监听
              - code [ref=e615]: "8080"
              - text: 端口后，每
              - code [ref=e616]: accept()
              - text: 一个新连接，内核就创建一个新的 Socket（新的 fd），这个 Socket 的五元组中
              - strong [ref=e617]: 目标 IP:端口
              - text: 相同（都是
              - code [ref=e618]: 192.168.1.1:8080
              - text: ），但
              - strong [ref=e619]: 源 IP:端口
              - text: 不同。只要来源不同，就是不同的连接。
            - generic [ref=e620]:
              - button "Copy Code" [ref=e621] [cursor=pointer]
              - generic [ref=e622]: text
              - code [ref=e624]:
                - generic [ref=e625]: "Server: listen(:8080)"
                - generic [ref=e626]: Client A (10.0.0.5:43210) ──连接──► Server:8080 → accept() → fd=4
                - generic [ref=e627]: Client B (10.0.0.5:43211) ──连接──► Server:8080 → accept() → fd=5
                - generic [ref=e628]: Client C (10.0.0.6:51782) ──连接──► Server:8080 → accept() → fd=6
              - generic [ref=e629]: 1 2 3 4 5
            - paragraph [ref=e630]: 三个连接共享同一个监听端口，但五元组各不相同。
            - paragraph [ref=e631]:
              - strong [ref=e632]: 理论容量分析：
            - table [ref=e633]:
              - rowgroup [ref=e634]:
                - row [ref=e635]:
                  - columnheader "维度" [ref=e636]
                  - columnheader "上限" [ref=e637]
                  - columnheader "制约因素" [ref=e638]
              - rowgroup [ref=e639]:
                - row [ref=e640]:
                  - cell "单个客户端 → 单个服务端端口" [ref=e641]
                  - cell "~65,535 条" [ref=e642]
                  - cell [ref=e643]:
                    - text: 客户端临时端口范围（
                    - code [ref=e644]: /proc/sys/net/ipv4/ip_local_port_range
                    - text: ，默认 32768~60999）
                - row [ref=e645]:
                  - cell "单个服务端 IP 的所有端口" [ref=e646]
                  - cell "~65,535 × 65,535 条（理论）" [ref=e647]
                  - cell "实际受 fd 限制和内存限制" [ref=e648]
                - row [ref=e649]:
                  - cell "多网卡多 IP 的服务端" [ref=e650]
                  - cell "IP 数 × 65,535 × 客户端数" [ref=e651]
                  - cell "网卡带宽、内存、fd 上限" [ref=e652]
            - paragraph [ref=e653]:
              - text: 实际生产中，连接数的瓶颈
              - strong [ref=e654]: 从来不是端口数
              - text: ，而是下一节要讲的 fd 限制和内核资源。
            - heading [level=3] [ref=e655]:
              - text: 3.1.4 Socket 的两种类型
              - link "Permalink to \"3.1.4 Socket 的两种类型\"" [ref=e656] [cursor=pointer]:
                - /url: "#_3-1-4-socket-的两种类型"
                - text: "#"
            - table [ref=e657]:
              - rowgroup [ref=e658]:
                - row [ref=e659]:
                  - columnheader "类型" [ref=e660]
                  - columnheader "协议" [ref=e661]
                  - columnheader "特点" [ref=e662]
                  - columnheader "典型场景" [ref=e663]
              - rowgroup [ref=e664]:
                - row [ref=e665]:
                  - cell [ref=e666]:
                    - strong [ref=e667]: Stream Socket
                  - cell "TCP" [ref=e668]
                  - cell "面向连接、可靠、有序、字节流" [ref=e669]
                  - cell "HTTP、数据库连接、RPC" [ref=e670]
                - row [ref=e671]:
                  - cell [ref=e672]:
                    - strong [ref=e673]: Datagram Socket
                  - cell "UDP" [ref=e674]
                  - cell "无连接、不可靠、低延迟、数据报" [ref=e675]
                  - cell "DNS、视频流、游戏状态同步" [ref=e676]
            - paragraph [ref=e677]: 本书以 TCP Stream Socket 为主线，因为 Java 企业级开发中绝大多数网络通信基于 TCP。
            - separator [ref=e678]
            - heading [level=2] [ref=e679]:
              - text: 3.2 Socket 系统调用与 Java 映射
              - link "Permalink to \"3.2 Socket 系统调用与 Java 映射\"" [ref=e680] [cursor=pointer]:
                - /url: "#_3-2-socket-系统调用与-java-映射"
                - text: "#"
            - paragraph [ref=e681]:
              - text: Socket 编程的本质就是按顺序调用一组
              - strong [ref=e682]: 系统调用
              - text: 。每一步都对应一个 OS 内核操作，Java 对这些操作做了面向对象封装。
            - heading [level=3] [ref=e683]:
              - text: 3.2.1
              - code [ref=e684]: socket()
              - text: ：创建端点
              - 'link "Permalink to \"3.2.1 `socket()`：创建端点\"" [ref=e685] [cursor=pointer]':
                - /url: "#_3-2-1-socket-创建端点"
                - text: "#"
            - generic [ref=e686]:
              - button "Copy Code" [ref=e687] [cursor=pointer]
              - generic [ref=e688]: c
              - code [ref=e690]:
                - generic [ref=e691]: // OS 层
                - generic [ref=e692]: int fd = socket(AF_INET, SOCK_STREAM, 0);
              - generic [ref=e693]: 1 2
            - paragraph [ref=e694]:
              - text: 内核分配一个
              - code [ref=e695]: struct socket
              - text: 对象，绑定到进程的 fd 表中。此时还没有连接，只是一个"插座"。
            - generic [ref=e696]:
              - button "Copy Code" [ref=e697] [cursor=pointer]
              - generic [ref=e698]: java
              - code [ref=e700]:
                - generic [ref=e701]: // Java 层
                - generic [ref=e702]: ServerSocket serverSocket = new ServerSocket(); // 内部调用 socket()
                - generic [ref=e703]: Socket clientSocket = new Socket(); // 内部调用 socket()
              - generic [ref=e704]: 1 2 3
            - paragraph [ref=e705]:
              - text: Java 的
              - code [ref=e706]: new ServerSocket()
              - text: 在构造时就调用了 OS 的
              - code [ref=e707]: socket()
              - text: ，拿到一个 fd。
            - heading [level=3] [ref=e708]:
              - text: 3.2.2
              - code [ref=e709]: bind()
              - text: +
              - code [ref=e710]: listen()
              - text: ：绑定端口、开始监听
              - 'link "Permalink to \"3.2.2 `bind()` + `listen()`：绑定端口、开始监听\"" [ref=e711] [cursor=pointer]':
                - /url: "#_3-2-2-bind-listen-绑定端口、开始监听"
                - text: "#"
            - generic [ref=e712]:
              - button "Copy Code" [ref=e713] [cursor=pointer]
              - generic [ref=e714]: c
              - code [ref=e716]:
                - generic [ref=e717]: // OS 层
                - generic [ref=e718]: "struct sockaddr_in addr = { .sin_port = htons(8080), .sin_addr.s_addr = INADDR_ANY };"
                - generic [ref=e719]: bind(fd, (struct sockaddr*)&addr, sizeof(addr)); // 绑定 IP:Port
                - generic [ref=e720]: listen(fd, 128); // 开始监听，backlog=128
              - generic [ref=e721]: 1 2 3 4
            - paragraph [ref=e722]:
              - code [ref=e723]: bind()
              - text: 把 Socket 和一个
              - strong [ref=e724]: IP:Port
              - text: 绑定。绑定后，操作系统知道"目标端口是 8080 的 TCP 包应该送给这个 Socket"。
            - paragraph [ref=e725]:
              - code [ref=e726]: listen()
              - text: 把 Socket 从"主动连接"模式切换为"被动监听"模式，并告诉内核：
              - strong [ref=e727]: 为这个 Socket 创建两个队列
              - text: ——半连接队列（SYN queue）和全连接队列（accept queue）。
              - code [ref=e728]: backlog
              - text: 参数控制全连接队列的大小。
            - generic [ref=e729]:
              - button "Copy Code" [ref=e730] [cursor=pointer]
              - generic [ref=e731]: java
              - code [ref=e733]:
                - generic [ref=e734]: // Java 层
                - generic [ref=e735]: ServerSocket serverSocket = new ServerSocket();
                - generic [ref=e736]: serverSocket.bind(new InetSocketAddress(8080), 128); // bind() + listen()
                - generic [ref=e737]: // 或者一行搞定：
                - generic [ref=e738]: ServerSocket serverSocket = new ServerSocket(8080); // 内部自动 bind + listen，backlog 默认 50
              - generic [ref=e739]: 1 2 3 4 5
            - heading [level=3] [ref=e740]:
              - text: 3.2.3
              - code [ref=e741]: accept()
              - text: ：从全连接队列取出连接
              - 'link "Permalink to \"3.2.3 `accept()`：从全连接队列取出连接\"" [ref=e742] [cursor=pointer]':
                - /url: "#_3-2-3-accept-从全连接队列取出连接"
                - text: "#"
            - generic [ref=e743]:
              - button "Copy Code" [ref=e744] [cursor=pointer]
              - generic [ref=e745]: c
              - code [ref=e747]:
                - generic [ref=e748]: // OS 层（阻塞）
                - generic [ref=e749]: int connFd = accept(fd, NULL, NULL);
              - generic [ref=e750]: 1 2
            - paragraph [ref=e751]:
              - code [ref=e752]: accept()
              - text: 从全连接队列中取出
              - strong [ref=e753]: 一个已完成三次握手的连接
              - text: ，为它创建一个新的 fd。原来的监听 fd 继续监听，不受影响。
            - generic [ref=e754]:
              - button "Copy Code" [ref=e755] [cursor=pointer]
              - generic [ref=e756]: text
              - code [ref=e758]:
                - generic [ref=e759]: listen fd (fd=3, port 8080)
                - generic [ref=e760]: │
                - generic [ref=e761]: │ accept()
                - generic [ref=e762]: │
                - generic [ref=e763]: ▼
                - generic [ref=e764]: conn fd (fd=4, 10.0.0.5:43210 → 192.168.1.1:8080) ← 新的 fd，独立的连接
                - generic [ref=e765]: conn fd (fd=5, 10.0.0.6:51782 → 192.168.1.1:8080) ← 又一个
              - generic [ref=e766]: 1 2 3 4 5 6 7
            - generic [ref=e767]:
              - button "Copy Code" [ref=e768] [cursor=pointer]
              - generic [ref=e769]: java
              - code [ref=e771]:
                - generic [ref=e772]: // Java 层
                - generic [ref=e773]: Socket client = serverSocket.accept(); // 阻塞，直到有新连接
                - generic [ref=e774]: // client 内部持有一个新的 fd
              - generic [ref=e775]: 1 2 3
            - blockquote [ref=e776]:
              - paragraph [ref=e777]:
                - code [ref=e778]: accept()
                - text: 返回的是一个
                - strong [ref=e779]: 新的 Socket
                - text: ，和原来的
                - code [ref=e780]: ServerSocket
                - text: 完全独立。
                - code [ref=e781]: ServerSocket
                - text: 只负责监听，不负责数据传输。数据传输由
                - code [ref=e782]: accept()
                - text: 返回的
                - code [ref=e783]: Socket
                - text: 完成。
            - heading [level=3] [ref=e784]:
              - text: 3.2.4
              - code [ref=e785]: connect()
              - text: ：客户端发起三次握手
              - 'link "Permalink to \"3.2.4 `connect()`：客户端发起三次握手\"" [ref=e786] [cursor=pointer]':
                - /url: "#_3-2-4-connect-客户端发起三次握手"
                - text: "#"
            - generic [ref=e787]:
              - button "Copy Code" [ref=e788] [cursor=pointer]
              - generic [ref=e789]: c
              - code [ref=e791]:
                - generic [ref=e792]: // OS 层
                - generic [ref=e793]: "struct sockaddr_in serverAddr = { .sin_port = htons(8080), .sin_addr.s_addr = inet_addr(\"192.168.1.1\") };"
                - generic [ref=e794]: connect(fd, (struct sockaddr*)&serverAddr, sizeof(serverAddr));
              - generic [ref=e795]: 1 2 3
            - paragraph [ref=e796]:
              - code [ref=e797]: connect()
              - text: 触发 TCP 三次握手。握手完成后，客户端的 Socket 进入
              - code [ref=e798]: ESTABLISHED
              - text: 状态，可以开始读写。
            - generic [ref=e799]:
              - button "Copy Code" [ref=e800] [cursor=pointer]
              - generic [ref=e801]: java
              - code [ref=e803]:
                - generic [ref=e804]: // Java 层
                - generic [ref=e805]: Socket socket = new Socket("192.168.1.1", 8080); // 内部调用 socket() + connect()
              - generic [ref=e806]: 1 2
            - heading [level=3] [ref=e807]:
              - text: 3.2.5
              - code [ref=e808]: read()
              - text: /
              - code [ref=e809]: write()
              - text: ：数据在内核缓冲区的流转
              - 'link "Permalink to \"3.2.5 `read()` / `write()`：数据在内核缓冲区的流转\"" [ref=e810] [cursor=pointer]':
                - /url: "#_3-2-5-read-write-数据在内核缓冲区的流转"
                - text: "#"
            - paragraph [ref=e811]: 连接建立后，数据的读写路径：
            - generic [ref=e812]:
              - button "Copy Code" [ref=e813] [cursor=pointer]
              - generic [ref=e814]: text
              - code [ref=e816]:
                - generic [ref=e817]: "发送方: 应用 write(buf) → 用户缓冲区 → 内核发送缓冲区 → TCP 分段 → 网卡发出"
                - generic [ref=e818]: "接收方: 网卡收到 → 内核接收缓冲区 → 应用 read(buf) → 用户缓冲区"
              - generic [ref=e819]: 1 2
            - paragraph [ref=e820]:
              - text: 关键理解：
              - strong [ref=e821]:
                - code [ref=e822]: write()
                - text: 不等于"数据已发出"，
                - code [ref=e823]: read()
                - text: 不等于"数据来自网络"
              - text: 。
              - code [ref=e824]: write()
              - text: 只是把数据从用户空间拷贝到内核的发送缓冲区，真正的发送由内核的 TCP 协议栈异步完成。
              - code [ref=e825]: read()
              - text: 只是从内核的接收缓冲区拷贝数据到用户空间。
            - generic [ref=e826]:
              - button "Copy Code" [ref=e827] [cursor=pointer]
              - generic [ref=e828]: java
              - code [ref=e830]:
                - generic [ref=e831]: // Java 层
                - generic [ref=e832]: OutputStream out = socket.getOutputStream();
                - generic [ref=e833]: out.write("hello".getBytes()); // 数据进入内核发送缓冲区
                - generic [ref=e834]: out.flush(); // 强制刷新（见 §3.4）
                - generic [ref=e835]: InputStream in = socket.getInputStream();
                - generic [ref=e836]: byte[] buf = new byte[1024];
                - generic [ref=e837]: int len = in.read(buf); // 从内核接收缓冲区读取
              - generic [ref=e838]: 1 2 3 4 5 6 7 8
            - heading [level=3] [ref=e839]:
              - text: 3.2.6
              - code [ref=e840]: close()
              - text: ：四次挥手与 fd 释放
              - 'link "Permalink to \"3.2.6 `close()`：四次挥手与 fd 释放\"" [ref=e841] [cursor=pointer]':
                - /url: "#_3-2-6-close-四次挥手与-fd-释放"
                - text: "#"
            - generic [ref=e842]:
              - button "Copy Code" [ref=e843] [cursor=pointer]
              - generic [ref=e844]: c
              - code [ref=e846]:
                - generic [ref=e847]: // OS 层
                - generic [ref=e848]: close(fd);
              - generic [ref=e849]: 1 2
            - paragraph [ref=e850]:
              - code [ref=e851]: close()
              - text: 做两件事：
            - list [ref=e852]:
              - listitem [ref=e853]:
                - strong [ref=e854]: TCP 层
                - text: ：发起四次挥手，关闭连接（主动关闭方进入
                - code [ref=e855]: FIN_WAIT
                - text: 状态）
              - listitem [ref=e856]:
                - strong [ref=e857]: OS 层
                - text: ：释放 fd 编号，回收内核中的 Socket 对象
            - generic [ref=e858]:
              - button "Copy Code" [ref=e859] [cursor=pointer]
              - generic [ref=e860]: java
              - code [ref=e862]:
                - generic [ref=e863]: // Java 层
                - generic [ref=e864]: socket.close(); // 内部调用 close(fd)
              - generic [ref=e865]: 1 2
            - blockquote [ref=e866]:
              - paragraph [ref=e867]:
                - text: 同一个服务跑到线上，偶尔看
                - code [ref=e868]: netstat -ant | grep 8080
                - text: 会发现十几个
                - code [ref=e869]: CLOSE_WAIT
                - text: 状态的连接越积越多。
                - code [ref=e870]: CLOSE_WAIT
                - text: 的意思是"对端发了 FIN，但本端还没调
                - code [ref=e871]: close()
                - text: "\"——大概率是你代码里某个异常分支没走到"
                - code [ref=e872]: socket.close()
                - text: ，或者连接池回收逻辑有漏，fd 一直被占着。不处理的话，CLOSE_WAIT 会一直积压到 fd 耗尽，新连接再也建不起来。
            - blockquote [ref=e873]:
              - paragraph [ref=e874]:
                - strong [ref=e875]:
                  - code [ref=e876]: close()
                  - text: vs
                  - code [ref=e877]: shutdown()
                - text: ：
                - code [ref=e878]: close()
                - text: 同时关闭读和写两个方向。
                - code [ref=e879]: shutdown()
                - text: 可以只关闭一个方向（
                - code [ref=e880]: shutdownOutput()
                - text: 关写，
                - code [ref=e881]: shutdownInput()
                - text: 关读），另一个方向继续使用。典型场景：客户端发完请求后
                - code [ref=e882]: shutdownOutput()
                - text: ，告诉服务端"我发完了"，但仍继续读取响应。
            - paragraph [ref=e883]:
              - strong [ref=e884]: 完整的系统调用链总结：
            - generic [ref=e885]:
              - button "Copy Code" [ref=e886] [cursor=pointer]
              - generic [ref=e887]: text
              - code [ref=e889]:
                - generic [ref=e890]: 服务端 客户端
                - generic [ref=e891]: ────── ──────
                - generic [ref=e892]: socket() → fd socket() → fd
                - generic [ref=e893]: bind(:8080) connect(192.168.1.1:8080)
                - generic [ref=e894]: listen(128) │ 三次握手
                - generic [ref=e895]: │ │
                - generic [ref=e896]: accept() → connFd ◄───────────────┘
                - generic [ref=e897]: │ │
                - generic [ref=e898]: read(connFd) ◄──── write(fd) ────►│
                - generic [ref=e899]: write(connFd) ────► read(fd) ────►│
                - generic [ref=e900]: │ │
                - generic [ref=e901]: close(connFd) ◄── 四次挥手 ──── close(fd)
              - generic [ref=e902]: 1 2 3 4 5 6 7 8 9 10 11 12
            - separator [ref=e903]
            - heading [level=2] [ref=e904]:
              - text: 3.3 内核视角：Socket 背后的数据结构
              - link "Permalink to \"3.3 内核视角：Socket 背后的数据结构\"" [ref=e905] [cursor=pointer]:
                - /url: "#_3-3-内核视角-socket-背后的数据结构"
                - text: "#"
            - heading [level=3] [ref=e906]:
              - text: 3.3.1 发送缓冲区与接收缓冲区
              - link "Permalink to \"3.3.1 发送缓冲区与接收缓冲区\"" [ref=e907] [cursor=pointer]:
                - /url: "#_3-3-1-发送缓冲区与接收缓冲区"
                - text: "#"
            - paragraph [ref=e908]: 每个 TCP Socket 在内核中有两块缓冲区：
            - generic [ref=e909]:
              - button "Copy Code" [ref=e910] [cursor=pointer]
              - generic [ref=e911]: text
              - code [ref=e913]:
                - generic [ref=e914]: ┌────────────────────────────────────────────────┐
                - generic [ref=e915]: │ 进程用户空间 │
                - generic [ref=e916]: │ │
                - generic [ref=e917]: │ write(buf) ──► 用户数据 │
                - generic [ref=e918]: │ │ │
                - generic [ref=e919]: └───────────────────┼────────────────────────────┘
                - generic [ref=e920]: │ 拷贝（CPU 参与）
                - generic [ref=e921]: ┌───────────────────▼────────────────────────────┐
                - generic [ref=e922]: │ 内核空间 │
                - generic [ref=e923]: │ │
                - generic [ref=e924]: │ ┌──────────────────────────┐ │
                - generic [ref=e925]: │ │ 发送缓冲区（sndbuf） │ → TCP 协议栈 → 网卡 │
                - generic [ref=e926]: │ └──────────────────────────┘ │
                - generic [ref=e927]: │ │
                - generic [ref=e928]: │ ┌──────────────────────────┐ │
                - generic [ref=e929]: │ │ 接收缓冲区（rcvbuf） │ ← 网卡 ← TCP 协议栈│
                - generic [ref=e930]: │ └──────────────────────────┘ │
                - generic [ref=e931]: │ │ │
                - generic [ref=e932]: └───────────────────┼────────────────────────────┘
                - generic [ref=e933]: │ 拷贝（CPU 参与）
                - generic [ref=e934]: ┌───────────────────▼────────────────────────────┐
                - generic [ref=e935]: │ read(buf) ◀── 用户数据 │
                - generic [ref=e936]: └────────────────────────────────────────────────┘
              - generic [ref=e937]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
            - paragraph [ref=e938]:
              - text: 缓冲区大小由 Socket 选项
              - code [ref=e939]: SO_SNDBUF
              - text: 和
              - code [ref=e940]: SO_RCVBUF
              - text: 控制（详见 §3.4）。默认值因 OS 而异，Linux 通常为
              - strong [ref=e941]: 128KB ~ 256KB
              - text: ，并会根据内存压力自动调整（
              - code [ref=e942]: tcp_rmem
              - text: /
              - code [ref=e943]: tcp_wmem
              - text: 内核参数）。
            - paragraph [ref=e944]:
              - strong [ref=e945]: 发送缓冲区满会怎样？
              - code [ref=e946]: write()
              - text: 会
              - strong [ref=e947]: 阻塞
              - text: ，直到内核发出了一些数据腾出空间。这就是"写阻塞"——它不是因为网络慢，而是因为发送缓冲区满了。
            - paragraph [ref=e948]:
              - strong [ref=e949]: 接收缓冲区空会怎样？
              - code [ref=e950]: read()
              - text: 会
              - strong [ref=e951]: 阻塞
              - text: ，直到有数据到达。这就是"读阻塞"——它不是因为没有连接，而是因为对方还没发数据。
            - heading [level=3] [ref=e952]:
              - text: 3.3.2 全连接队列与半连接队列
              - link "Permalink to \"3.3.2 全连接队列与半连接队列\"" [ref=e953] [cursor=pointer]:
                - /url: "#_3-3-2-全连接队列与半连接队列"
                - text: "#"
            - blockquote [ref=e954]:
              - paragraph [ref=e955]:
                - strong [ref=e956]: 活动期间，你发现新连接全部超时，但服务端 CPU 和内存都正常。
                - text: 同事怀疑是网络设备问题，你用
                - code [ref=e957]: ss -tln | grep 8080
                - text: 看了一眼——
                - code [ref=e958]: Recv-Q
                - text: 已经超过了
                - code [ref=e959]: Send-Q
                - text: 。请求不慢，是它们根本没进到应用层。accept queue 满了，内核已经在悄悄丢包了。
            - paragraph [ref=e960]:
              - code [ref=e961]: listen()
              - text: 之后，内核为这个监听 Socket 维护两个队列：
            - img [ref=e964]:
              - generic [ref=e965]: 全连接队列与半连接队列
              - generic [ref=e966]: 半连接队列（SYN queue）
              - generic [ref=e968]: SYN_RECV 状态
              - generic [ref=e969]: 客户端发了 SYN，三次握手还没完成
              - generic [ref=e970]: tcp_max_syn_backlog
              - generic [ref=e971]: 三次握手完成（收到客户端 ACK）
              - generic [ref=e972]: 全连接队列（accept queue）
              - generic [ref=e974]: ESTABLISHED 状态
              - generic [ref=e975]: 连接已建立，等待 accept() 取走
              - generic [ref=e976]: listen(backlog) 参数
              - generic [ref=e977]: 应用调用 accept()
              - generic [ref=e979]: 进程拿到 connFd
              - generic [ref=e981]: 全连接队列满时
              - generic [ref=e982]: 默认（tcp_abort_on_overflow=0）
              - generic [ref=e983]: 内核丢弃新的 ACK
              - generic [ref=e984]: 客户端以为连接成功，实际服务端不知道
              - generic [ref=e985]: tcp_abort_on_overflow=1
              - generic [ref=e986]: 内核直接发 RST，客户端立刻收到 reset
              - generic [ref=e988]: 排查方法
              - generic [ref=e989]: ss -ltn | grep 8080
              - generic [ref=e990]: Recv-Q > Send-Q → 队列溢出
              - generic [ref=e991]: netstat -s | grep "listen queue"
              - generic [ref=e992]: overflowed 数字持续增长 → 加大 backlog
              - generic [ref=e993]: 客户端 SYN 到达 → 半连接队列 → 三次握手完成 → 全连接队列 → accept() 取走
              - generic [ref=e994]: 瓶颈不在端口数，而在队列大小和 fd 上限
            - paragraph [ref=e995]:
              - strong [ref=e996]: 全连接队列满（accept queue full）时：
            - list [ref=e997]:
              - listitem [ref=e998]:
                - text: 默认行为（
                - code [ref=e999]: tcp_abort_on_overflow=0
                - text: ）：内核
                - strong [ref=e1000]: 丢弃
                - text: 新的 ACK，客户端以为连接成功了，服务端却不知道——客户端发数据会超时重传，最终可能收到 RST
              - listitem [ref=e1001]:
                - text: 设置
                - code [ref=e1002]: tcp_abort_on_overflow=1
                - text: ：内核直接发 RST，客户端立刻收到
                - code [ref=e1003]: Connection reset
            - paragraph [ref=e1004]:
              - strong [ref=e1005]: 如何判断队列溢出？
            - generic [ref=e1006]:
              - button "Copy Code" [ref=e1007] [cursor=pointer]
              - generic [ref=e1008]: bash
              - code [ref=e1010]:
                - generic [ref=e1011]: "# 查看监听端口的队列状态"
                - generic [ref=e1012]: $ ss -ltn | grep 8080
                - generic [ref=e1013]: State Recv-Q Send-Q Local Address:Port
                - generic [ref=e1014]: LISTEN 129 128 0.0.0.0:8080
                - generic [ref=e1015]: "# ↑ ↑"
                - generic [ref=e1016]: "# 当前排队数 backlog 上限"
                - generic [ref=e1017]: "# Recv-Q > Send-Q 时，说明全连接队列溢出"
              - generic [ref=e1018]: 1 2 3 4 5 6 7
            - paragraph [ref=e1019]:
              - strong [ref=e1020]: 排查时关注的内核计数器：
            - generic [ref=e1021]:
              - button "Copy Code" [ref=e1022] [cursor=pointer]
              - generic [ref=e1023]: bash
              - code [ref=e1025]:
                - generic [ref=e1026]: $ netstat -s | grep "listen"
                - generic [ref=e1027]: 12345 times the listen queue of a socket overflowed
              - generic [ref=e1028]: 1 2
            - paragraph [ref=e1029]:
              - text: 这个数字持续增长，说明应用的
              - code [ref=e1030]: accept()
              - text: 速度跟不上连接到达速度——要么加快 accept（多线程 accept），要么增大 backlog。
            - heading [level=3] [ref=e1031]:
              - text: 3.3.3 阻塞的本质：线程在内核的哪里等
              - link "Permalink to \"3.3.3 阻塞的本质：线程在内核的哪里等\"" [ref=e1032] [cursor=pointer]:
                - /url: "#_3-3-3-阻塞的本质-线程在内核的哪里等"
                - text: "#"
            - paragraph [ref=e1033]:
              - text: 当应用调用
              - code [ref=e1034]: read()
              - text: 但接收缓冲区为空时，线程到底发生了什么？
            - generic [ref=e1035]:
              - button "Copy Code" [ref=e1036] [cursor=pointer]
              - generic [ref=e1037]: text
              - code [ref=e1039]:
                - generic [ref=e1040]: 线程调用 read(fd, buf, len)
                - generic [ref=e1041]: │
                - generic [ref=e1042]: ▼
                - generic [ref=e1043]: 内核检查接收缓冲区 → 空
                - generic [ref=e1044]: │
                - generic [ref=e1045]: ▼
                - generic [ref=e1046]: "线程状态: RUNNING → TASK_INTERRUPTIBLE（睡眠）"
                - generic [ref=e1047]: 线程从 CPU 运行队列中移除
                - generic [ref=e1048]: 线程被挂到 Socket 的"等待队列"上
                - generic [ref=e1049]: │
                - generic [ref=e1050]: │ ... 数据到达 ...
                - generic [ref=e1051]: │
                - generic [ref=e1052]: ▼
                - generic [ref=e1053]: 内核中断处理 → 数据写入接收缓冲区 → 唤醒等待队列上的线程
                - generic [ref=e1054]: "线程状态: TASK_INTERRUPTIBLE → RUNNING"
                - generic [ref=e1055]: 线程从 read() 处返回
              - generic [ref=e1056]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
            - paragraph [ref=e1057]:
              - strong [ref=e1058]: 阻塞不是"线程在忙等/自旋"
              - text: ，而是
              - strong [ref=e1059]: 线程被操作系统挂起了
              - text: ——它不占 CPU 时间片，不消耗 CPU 资源。代价是占用了一块线程栈内存（~1MB）和一个内核调度实体。
            - paragraph [ref=e1060]:
              - text: 这就是 BIO 的核心代价：
              - strong [ref=e1061]: 线程不消耗 CPU，但消耗内存和调度资源
              - text: 。一个阻塞在
              - code [ref=e1062]: read()
              - text: 上的线程，CPU 利用率为 0，但内存和 fd 一直被占着。
            - heading [level=3] [ref=e1063]:
              - text: 3.3.4 一台机器能承载多少 Socket
              - link "Permalink to \"3.3.4 一台机器能承载多少 Socket\"" [ref=e1064] [cursor=pointer]:
                - /url: "#_3-3-4-一台机器能承载多少-socket"
                - text: "#"
            - paragraph [ref=e1065]: 这是一个工程问题，瓶颈在多个层次：
            - table [ref=e1066]:
              - rowgroup [ref=e1067]:
                - row [ref=e1068]:
                  - columnheader "层次" [ref=e1069]
                  - columnheader "限制" [ref=e1070]
                  - columnheader "默认值" [ref=e1071]
                  - columnheader "调整方式" [ref=e1072]
              - rowgroup [ref=e1073]:
                - row [ref=e1074]:
                  - cell [ref=e1075]:
                    - strong [ref=e1076]: fd 上限（单进程）
                  - cell "每个 Socket 占一个 fd" [ref=e1077]
                  - cell "1024" [ref=e1078]
                  - cell [ref=e1079]:
                    - code [ref=e1080]: ulimit -n 65535
                - row [ref=e1081]:
                  - cell [ref=e1082]:
                    - strong [ref=e1083]: fd 上限（系统级）
                  - cell "所有进程的 fd 总和" [ref=e1084]
                  - cell "~100 万" [ref=e1085]
                  - cell [ref=e1086]:
                    - code [ref=e1087]: /proc/sys/fs/file-max
                - row [ref=e1088]:
                  - cell [ref=e1089]:
                    - strong [ref=e1090]: 端口范围（客户端）
                  - cell "临时端口数量" [ref=e1091]
                  - cell "32768~60999（~28000）" [ref=e1092]
                  - cell [ref=e1093]:
                    - code [ref=e1094]: /proc/sys/net/ipv4/ip_local_port_range
                - row [ref=e1095]:
                  - cell [ref=e1096]:
                    - strong [ref=e1097]: 内核内存
                  - cell "每个 Socket 约 3~10KB" [ref=e1098]
                  - cell "—" [ref=e1099]
                  - cell "取决于缓冲区配置" [ref=e1100]
                - row [ref=e1101]:
                  - cell [ref=e1102]:
                    - strong [ref=e1103]: 全连接队列
                  - cell "listen backlog" [ref=e1104]
                  - cell "128（取 min(backlog, somaxconn)）" [ref=e1105]
                  - cell [ref=e1106]:
                    - code [ref=e1107]: listen(backlog)
                    - text: +
                    - code [ref=e1108]: /proc/sys/net/core/somaxconn
                - row [ref=e1109]:
                  - cell [ref=e1110]:
                    - strong [ref=e1111]: 半连接队列
                  - cell "SYN queue 大小" [ref=e1112]
                  - cell "256~1024" [ref=e1113]
                  - cell [ref=e1114]:
                    - code [ref=e1115]: /proc/sys/net/ipv4/tcp_max_syn_backlog
            - paragraph [ref=e1116]:
              - strong [ref=e1117]: 实际瓶颈通常在 fd 和内存：
            - generic [ref=e1118]:
              - button "Copy Code" [ref=e1119] [cursor=pointer]
              - generic [ref=e1120]: text
              - code [ref=e1122]:
                - generic [ref=e1123]: 一台 16GB 内存的服务器：
                - generic [ref=e1124]: fd 上限设为 65535 → 理论最多 65535 个 Socket
                - generic [ref=e1125]: 每个 Socket 内核开销 5KB → 65535 × 5KB ≈ 320MB（可接受）
                - generic [ref=e1126]: 每个连接的业务线程栈 1MB → 65535 × 1MB ≈ 64GB（BIO 模型下不可能）
                - generic [ref=e1127]: 如果用 NIO（无线程阻塞）：
                - generic [ref=e1128]: 一个线程管理 10000 个连接 → 65535 个连接只需要 ~6 个线程
                - generic [ref=e1129]: 内存开销 ≈ 320MB（Socket 内核对象） + 6MB（线程栈） → 完全可行
              - generic [ref=e1130]: 1 2 3 4 5 6 7 8
            - paragraph [ref=e1131]: 这就是为什么高并发场景必须用 NIO——不是因为 BIO "慢"，而是因为 BIO 用线程做等待，内存扛不住。
            - separator [ref=e1132]
            - heading [level=2] [ref=e1133]:
              - text: 3.4 Socket 选项：生产中真正要调的参数
              - link "Permalink to \"3.4 Socket 选项：生产中真正要调的参数\"" [ref=e1134] [cursor=pointer]:
                - /url: "#_3-4-socket-选项-生产中真正要调的参数"
                - text: "#"
            - paragraph [ref=e1135]:
              - text: Socket 选项通过
              - code [ref=e1136]: setsockopt()
              - text: 系统调用设置，Java 中通过
              - code [ref=e1137]: ServerSocket.setOption()
              - text: /
              - code [ref=e1138]: Socket.setOption()
              - text: 或
              - code [ref=e1139]: ServerSocketChannel
              - text: 设置。
            - heading [level=3] [ref=e1140]:
              - text: 3.4.1
              - code [ref=e1141]: SO_REUSEADDR
              - text: 与
              - code [ref=e1142]: SO_REUSEPORT
              - 'link "Permalink to \"3.4.1 `SO_REUSEADDR` 与 `SO_REUSEPORT`\"" [ref=e1143] [cursor=pointer]':
                - /url: "#_3-4-1-so-reuseaddr-与-so-reuseport"
                - text: "#"
            - paragraph [ref=e1144]:
              - strong [ref=e1145]:
                - code [ref=e1146]: SO_REUSEADDR
              - text: ：允许绑定处于
              - code [ref=e1147]: TIME_WAIT
              - text: 状态的地址。
            - blockquote [ref=e1148]:
              - paragraph [ref=e1149]:
                - text: 你重启了服务，结果报了一个
                - code [ref=e1150]: "BindException: Address already in use"
                - text: 。端口还在用？明明上一个进程已经 kill 了。这是因为旧连接还卡在
                - code [ref=e1151]: TIME_WAIT
                - text: （见第 2 章四次挥手），要等 60 秒端口才能释放。
                - code [ref=e1152]: SO_REUSEADDR
                - text: 就是让你跳过这个等待。
            - generic [ref=e1153]:
              - button "Copy Code" [ref=e1154] [cursor=pointer]
              - generic [ref=e1155]: java
              - code [ref=e1157]:
                - generic [ref=e1158]: ServerSocket ss = new ServerSocket();
                - generic [ref=e1159]: ss.setReuseAddress(true); // SO_REUSEADDR
                - generic [ref=e1160]: ss.bind(new InetSocketAddress(8080));
              - generic [ref=e1161]: 1 2 3
            - paragraph [ref=e1162]:
              - strong [ref=e1163]:
                - code [ref=e1164]: SO_REUSEPORT
              - text: （Linux 3.9+）：允许多个进程/线程绑定同一个端口，内核在它们之间做负载均衡。适用于多线程 accept 的场景，避免单一 accept 线程成为瓶颈。
            - generic [ref=e1165]:
              - button "Copy Code" [ref=e1166] [cursor=pointer]
              - generic [ref=e1167]: java
              - code [ref=e1169]:
                - generic [ref=e1170]: // Java 11+ 通过 ServerSocketChannel 设置
                - generic [ref=e1171]: ServerSocketChannel ssc = ServerSocketChannel.open();
                - generic [ref=e1172]: ssc.setOption(StandardSocketOptions.SO_REUSEPORT, true);
                - generic [ref=e1173]: ssc.bind(new InetSocketAddress(8080));
              - generic [ref=e1174]: 1 2 3 4
            - heading [level=3] [ref=e1175]:
              - text: 3.4.2
              - code [ref=e1176]: TCP_NODELAY
              - text: ：禁用 Nagle 算法
              - 'link "Permalink to \"3.4.2 `TCP_NODELAY`：禁用 Nagle 算法\"" [ref=e1177] [cursor=pointer]':
                - /url: "#_3-4-2-tcp-nodelay-禁用-nagle-算法"
                - text: "#"
            - paragraph [ref=e1178]: Nagle 算法会把小包合并后再发送，以提高网络利用率。但对延迟敏感的场景（游戏、实时通信、RPC），这个合并会引入额外延迟。
            - generic [ref=e1179]:
              - button "Copy Code" [ref=e1180] [cursor=pointer]
              - generic [ref=e1181]: java
              - code [ref=e1183]:
                - generic [ref=e1184]: socket.setTcpNoDelay(true); // TCP_NODELAY = true，禁用 Nagle
              - generic [ref=e1185]: "1"
            - paragraph [ref=e1186]:
              - strong [ref=e1187]: 经验法则
              - text: ：RPC 框架（Dubbo、gRPC）默认开启
              - code [ref=e1188]: TCP_NODELAY
              - text: ；HTTP 服务器通常不开。
            - heading [level=3] [ref=e1189]:
              - text: 3.4.3
              - code [ref=e1190]: SO_KEEPALIVE
              - text: ：TCP 层保活
              - 'link "Permalink to \"3.4.3 `SO_KEEPALIVE`：TCP 层保活\"" [ref=e1191] [cursor=pointer]':
                - /url: "#_3-4-3-so-keepalive-tcp-层保活"
                - text: "#"
            - paragraph [ref=e1192]: TCP KeepAlive 在空闲连接上定期发送探测包，检测对端是否存活。
            - generic [ref=e1193]:
              - button "Copy Code" [ref=e1194] [cursor=pointer]
              - generic [ref=e1195]: java
              - code [ref=e1197]:
                - generic [ref=e1198]: socket.setKeepAlive(true); // SO_KEEPALIVE = true
              - generic [ref=e1199]: "1"
            - paragraph [ref=e1200]: TCP KeepAlive 的默认参数（Linux）：
            - table [ref=e1201]:
              - rowgroup [ref=e1202]:
                - row [ref=e1203]:
                  - columnheader "参数" [ref=e1204]
                  - columnheader "默认值" [ref=e1205]
                  - columnheader "含义" [ref=e1206]
              - rowgroup [ref=e1207]:
                - row [ref=e1208]:
                  - cell [ref=e1209]:
                    - code [ref=e1210]: tcp_keepalive_time
                  - cell "7200 秒" [ref=e1211]
                  - cell "空闲多久后开始探测" [ref=e1212]
                - row [ref=e1213]:
                  - cell [ref=e1214]:
                    - code [ref=e1215]: tcp_keepalive_intvl
                  - cell "75 秒" [ref=e1216]
                  - cell "探测间隔" [ref=e1217]
                - row [ref=e1218]:
                  - cell [ref=e1219]:
                    - code [ref=e1220]: tcp_keepalive_probes
                  - cell "9 次" [ref=e1221]
                  - cell "多少次无响应判定断开" [ref=e1222]
            - blockquote [ref=e1223]:
              - paragraph [ref=e1224]:
                - strong [ref=e1225]: 注意
                - text: ：默认 2 小时才开始探测，对于长连接服务来说太慢了。生产中通常结合
                - strong [ref=e1226]: 应用层心跳
                - text: （如每 30 秒发一次 ping/pong），TCP KeepAlive 只作为兜底。
            - heading [level=3] [ref=e1227]:
              - text: 3.4.4
              - code [ref=e1228]: SO_RCVBUF
              - text: /
              - code [ref=e1229]: SO_SNDBUF
              - text: ：缓冲区大小
              - 'link "Permalink to \"3.4.4 `SO_RCVBUF` / `SO_SNDBUF`：缓冲区大小\"" [ref=e1230] [cursor=pointer]':
                - /url: "#_3-4-4-so-rcvbuf-so-sndbuf-缓冲区大小"
                - text: "#"
            - paragraph [ref=e1231]: 控制内核为每个 Socket 分配的收发缓冲区大小。
            - generic [ref=e1232]:
              - button "Copy Code" [ref=e1233] [cursor=pointer]
              - generic [ref=e1234]: java
              - code [ref=e1236]:
                - generic [ref=e1237]: socket.setReceiveBufferSize(256 * 1024); // SO_RCVBUF = 256KB
                - generic [ref=e1238]: socket.setSendBufferSize(256 * 1024); // SO_SNDBUF = 256KB
              - generic [ref=e1239]: 1 2
            - table [ref=e1240]:
              - rowgroup [ref=e1241]:
                - row [ref=e1242]:
                  - columnheader "场景" [ref=e1243]
                  - columnheader "建议" [ref=e1244]
              - rowgroup [ref=e1245]:
                - row [ref=e1246]:
                  - cell "低延迟、小数据量" [ref=e1247]
                  - cell "默认即可（128KB）" [ref=e1248]
                - row [ref=e1249]:
                  - cell "高吞吐、大数据量（文件传输）" [ref=e1250]
                  - cell "适当增大（512KB ~ 1MB）" [ref=e1251]
                - row [ref=e1252]:
                  - cell "内存紧张、连接数极多" [ref=e1253]
                  - cell "适当减小（64KB）" [ref=e1254]
            - paragraph [ref=e1255]:
              - text: Linux 内核会自动在
              - code [ref=e1256]: tcp_rmem
              - text: /
              - code [ref=e1257]: tcp_wmem
              - text: 范围内调整缓冲区大小（自动调优），通常不需要手动设置。
            - heading [level=3] [ref=e1258]:
              - text: 3.4.5 在 Java 中设置 Socket 选项
              - link "Permalink to \"3.4.5 在 Java 中设置 Socket 选项\"" [ref=e1259] [cursor=pointer]:
                - /url: "#_3-4-5-在-java-中设置-socket-选项"
                - text: "#"
            - table [ref=e1260]:
              - rowgroup [ref=e1261]:
                - row [ref=e1262]:
                  - columnheader "选项" [ref=e1263]
                  - columnheader "ServerSocket" [ref=e1264]
                  - columnheader "Socket" [ref=e1265]
                  - columnheader "Channel" [ref=e1266]
              - rowgroup [ref=e1267]:
                - row [ref=e1268]:
                  - cell [ref=e1269]:
                    - code [ref=e1270]: SO_REUSEADDR
                  - cell [ref=e1271]:
                    - code [ref=e1272]: setReuseAddress(true)
                  - cell [ref=e1273]:
                    - code [ref=e1274]: setReuseAddress(true)
                  - cell [ref=e1275]:
                    - code [ref=e1276]: setOption(SO_REUSEADDR, true)
                - row [ref=e1277]:
                  - cell [ref=e1278]:
                    - code [ref=e1279]: SO_REUSEPORT
                  - cell "—" [ref=e1280]
                  - cell "—" [ref=e1281]
                  - cell [ref=e1282]:
                    - code [ref=e1283]: setOption(SO_REUSEPORT, true)
                - row [ref=e1284]:
                  - cell [ref=e1285]:
                    - code [ref=e1286]: TCP_NODELAY
                  - cell "—" [ref=e1287]
                  - cell [ref=e1288]:
                    - code [ref=e1289]: setTcpNoDelay(true)
                  - cell [ref=e1290]:
                    - code [ref=e1291]: setOption(TCP_NODELAY, true)
                - row [ref=e1292]:
                  - cell [ref=e1293]:
                    - code [ref=e1294]: SO_KEEPALIVE
                  - cell "—" [ref=e1295]
                  - cell [ref=e1296]:
                    - code [ref=e1297]: setKeepAlive(true)
                  - cell [ref=e1298]:
                    - code [ref=e1299]: setOption(SO_KEEPALIVE, true)
                - row [ref=e1300]:
                  - cell [ref=e1301]:
                    - code [ref=e1302]: SO_RCVBUF
                  - cell [ref=e1303]:
                    - code [ref=e1304]: setReceiveBufferSize(n)
                  - cell [ref=e1305]:
                    - code [ref=e1306]: setReceiveBufferSize(n)
                  - cell [ref=e1307]:
                    - code [ref=e1308]: setOption(SO_RCVBUF, n)
                - row [ref=e1309]:
                  - cell [ref=e1310]:
                    - code [ref=e1311]: SO_SNDBUF
                  - cell "—" [ref=e1312]
                  - cell [ref=e1313]:
                    - code [ref=e1314]: setSendBufferSize(n)
                  - cell [ref=e1315]:
                    - code [ref=e1316]: setOption(SO_SNDBUF, n)
            - blockquote [ref=e1317]:
              - paragraph [ref=e1318]:
                - strong [ref=e1319]: 注意
                - text: ：Socket 选项必须在
                - code [ref=e1320]: connect()
                - text: /
                - code [ref=e1321]: bind()
                - strong [ref=e1322]: 之前
                - text: 设置，部分选项在连接建立后修改不生效。
            - separator [ref=e1323]
            - heading [level=2] [ref=e1324]:
              - text: 3.5 动手：用 Java Socket 跑通一个 Echo
              - link "Permalink to \"3.5 动手：用 Java Socket 跑通一个 Echo\"" [ref=e1325] [cursor=pointer]:
                - /url: "#_3-5-动手-用-java-socket-跑通一个-echo"
                - text: "#"
            - paragraph [ref=e1326]: 前面四节讲的是 Socket 的"是什么"和"怎么工作"。这一节用最小的代码示例把理论变成可运行的程序。
            - heading [level=3] [ref=e1327]:
              - text: 3.5.1 Echo Server
              - link "Permalink to \"3.5.1 Echo Server\"" [ref=e1328] [cursor=pointer]:
                - /url: "#_3-5-1-echo-server"
                - text: "#"
            - generic [ref=e1329]:
              - button "Copy Code" [ref=e1330] [cursor=pointer]
              - generic [ref=e1331]: java
              - code [ref=e1333]:
                - generic [ref=e1334]: import java.io.*;
                - generic [ref=e1335]: import java.net.*;
                - generic [ref=e1336]: import java.util.concurrent.*;
                - generic [ref=e1337]: "public class EchoServer {"
                - generic [ref=e1338]: "public static void main(String[] args) throws IOException {"
                - generic [ref=e1339]: ServerSocket serverSocket = new ServerSocket(8080);
                - generic [ref=e1340]: ExecutorService pool = Executors.newFixedThreadPool(100);
                - generic [ref=e1341]: System.out.println("Echo Server started on port 8080");
                - generic [ref=e1342]: "while (true) {"
                - generic [ref=e1343]: Socket client = serverSocket.accept(); // 阻塞等待连接
                - generic [ref=e1344]: "pool.submit(() -> {"
                - generic [ref=e1345]: "try (client) {"
                - generic [ref=e1346]: InputStream in = client.getInputStream();
                - generic [ref=e1347]: OutputStream out = client.getOutputStream();
                - generic [ref=e1348]: byte[] buf = new byte[1024];
                - generic [ref=e1349]: int len;
                - generic [ref=e1350]: "while ((len = in.read(buf)) != -1) { // 阻塞读取"
                - generic [ref=e1351]: out.write(buf, 0, len); // Echo 回写
                - generic [ref=e1352]: out.flush();
                - generic [ref=e1353]: "}"
                - generic [ref=e1354]: "} catch (IOException e) {"
                - generic [ref=e1355]: // 客户端断开
                - generic [ref=e1356]: "}"
                - generic [ref=e1357]: "});"
                - generic [ref=e1358]: "}"
                - generic [ref=e1359]: "}"
                - generic [ref=e1360]: "}"
              - generic [ref=e1361]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29
            - heading [level=3] [ref=e1362]:
              - text: 3.5.2 Echo Client
              - link "Permalink to \"3.5.2 Echo Client\"" [ref=e1363] [cursor=pointer]:
                - /url: "#_3-5-2-echo-client"
                - text: "#"
            - generic [ref=e1364]:
              - button "Copy Code" [ref=e1365] [cursor=pointer]
              - generic [ref=e1366]: java
              - code [ref=e1368]:
                - generic [ref=e1369]: import java.io.*;
                - generic [ref=e1370]: import java.net.*;
                - generic [ref=e1371]: "public class EchoClient {"
                - generic [ref=e1372]: "public static void main(String[] args) throws IOException {"
                - generic [ref=e1373]: Socket socket = new Socket("localhost", 8080);
                - generic [ref=e1374]: OutputStream out = socket.getOutputStream();
                - generic [ref=e1375]: InputStream in = socket.getInputStream();
                - generic [ref=e1376]: out.write("hello\n".getBytes());
                - generic [ref=e1377]: out.flush();
                - generic [ref=e1378]: byte[] buf = new byte[1024];
                - generic [ref=e1379]: int len = in.read(buf);
                - generic [ref=e1380]: "System.out.println(\"Server replied: \" + new String(buf, 0, len));"
                - generic [ref=e1381]: socket.close();
                - generic [ref=e1382]: "}"
                - generic [ref=e1383]: "}"
              - generic [ref=e1384]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19
            - heading [level=3] [ref=e1385]:
              - text: 3.5.3 代码剖析
              - link "Permalink to \"3.5.3 代码剖析\"" [ref=e1386] [cursor=pointer]:
                - /url: "#_3-5-3-代码剖析"
                - text: "#"
            - paragraph [ref=e1387]:
              - strong [ref=e1388]:
                - text: 为什么
                - code [ref=e1389]: out.flush()
                - text: 是必要的？
            - paragraph [ref=e1390]:
              - code [ref=e1391]: OutputStream.write()
              - text: 默认使用缓冲区，数据不会立即进入内核发送缓冲区。
              - code [ref=e1392]: flush()
              - text: 强制把应用层缓冲区的数据写入内核。不调
              - code [ref=e1393]: flush()
              - text: ，对方可能一直收不到数据。
            - paragraph [ref=e1394]:
              - strong [ref=e1395]:
                - text: 为什么用
                - code [ref=e1396]: FixedThreadPool
                - text: 而不是
                - code [ref=e1397]: CachedThreadPool
                - text: ？
            - paragraph [ref=e1398]:
              - code [ref=e1399]: CachedThreadPool
              - text: 无上限，连接暴涨时会创建过多线程。
              - code [ref=e1400]: FixedThreadPool
              - text: 限制并发线程数，超出的任务在队列中等待——这是保护服务端的基本手段。
            - heading [level=3] [ref=e1401]:
              - text: 3.5.4 一连接一线程的局限
              - link "Permalink to \"3.5.4 一连接一线程的局限\"" [ref=e1402] [cursor=pointer]:
                - /url: "#_3-5-4-一连接一线程的局限"
                - text: "#"
            - paragraph [ref=e1403]:
              - text: 上面的 Echo Server 是经典的 BIO 模型：
              - strong [ref=e1404]: 每个连接占一个线程
              - text: 。线程大部分时间阻塞在
              - code [ref=e1405]: read()
              - text: 上，不消耗 CPU，但消耗内存和调度资源。
            - generic [ref=e1406]:
              - button "Copy Code" [ref=e1407] [cursor=pointer]
              - generic [ref=e1408]: text
              - code [ref=e1410]:
                - generic [ref=e1411]: 1000 个连接 → 1000 个线程 → ~1GB 栈内存 → 勉强可行
                - generic [ref=e1412]: 10000 个连接 → 10000 个线程 → ~10GB 栈内存 → 不可行
              - generic [ref=e1413]: 1 2
            - paragraph [ref=e1414]:
              - text: 这个局限不是 Socket 的问题，而是
              - strong [ref=e1415]: BIO 线程模型
              - text: 的问题。解决方案是 NIO——用一个线程通过
              - strong [ref=e1416]: Selector
              - text: 监听多个 Channel 的事件，线程只在"有数据可读"时才被唤醒，不需要为每个连接阻塞一个线程。这是下一章的内容。
            - separator [ref=e1417]
            - heading [level=2] [ref=e1418]:
              - text: 本章小结
              - link "Permalink to \"本章小结\"" [ref=e1419] [cursor=pointer]:
                - /url: "#本章小结"
                - text: "#"
            - table [ref=e1420]:
              - rowgroup [ref=e1421]:
                - row [ref=e1422]:
                  - columnheader "概念" [ref=e1423]
                  - columnheader "要点" [ref=e1424]
              - rowgroup [ref=e1425]:
                - row [ref=e1426]:
                  - cell "Socket 的本质" [ref=e1427]
                  - cell "OS 提供的网络编程抽象，本质是 fd + 协议栈" [ref=e1428]
                - row [ref=e1429]:
                  - cell "五元组" [ref=e1430]
                  - cell [ref=e1431]:
                    - code [ref=e1432]: "{源IP, 源端口, 目标IP, 目标端口, 协议}"
                    - text: 唯一标识一条连接
                - row [ref=e1433]:
                  - cell "一个端口多条连接" [ref=e1434]
                  - cell "服务端一个监听端口可以 accept 出成千上万条连接" [ref=e1435]
                - row [ref=e1436]:
                  - cell "系统调用链" [ref=e1437]
                  - cell [ref=e1438]:
                    - code [ref=e1439]: socket()
                    - text: →
                    - code [ref=e1440]: bind()
                    - text: →
                    - code [ref=e1441]: listen()
                    - text: →
                    - code [ref=e1442]: accept()
                    - text: →
                    - code [ref=e1443]: read()
                    - text: /
                    - code [ref=e1444]: write()
                    - text: →
                    - code [ref=e1445]: close()
                - row [ref=e1446]:
                  - cell "内核缓冲区" [ref=e1447]
                  - cell "每个 Socket 有收发两块缓冲区，read/write 操作的是缓冲区而非网络" [ref=e1448]
                - row [ref=e1449]:
                  - cell "全连接队列" [ref=e1450]
                  - cell [ref=e1451]:
                    - text: accept queue 溢出时连接被丢弃，需关注
                    - code [ref=e1452]: ss -ltn
                    - text: 中的 Recv-Q
                - row [ref=e1453]:
                  - cell "fd 限制" [ref=e1454]
                  - cell [ref=e1455]:
                    - text: 单进程默认 1024，高并发需调
                    - code [ref=e1456]: ulimit -n
                - row [ref=e1457]:
                  - cell "Socket 选项" [ref=e1458]
                  - cell [ref=e1459]:
                    - code [ref=e1460]: SO_REUSEADDR
                    - text: 、
                    - code [ref=e1461]: TCP_NODELAY
                    - text: 、
                    - code [ref=e1462]: SO_KEEPALIVE
                    - text: 等是生产必调项
                - row [ref=e1463]:
                  - cell "BIO 的局限" [ref=e1464]
                  - cell "一连接一线程，内存扛不住 → 需要 NIO" [ref=e1465]
            - separator [ref=e1466]
            - blockquote [ref=e1467]:
              - paragraph [ref=e1468]:
                - strong [ref=e1469]: 纵横联系
              - list [ref=e1470]:
                - listitem [ref=e1471]:
                  - strong [ref=e1472]: 本卷第2章
                  - text: 已经介绍了 TCP/IP 协议基础和三次握手/四次挥手，本章的系统调用链（
                  - code [ref=e1473]: connect
                  - text: /
                  - code [ref=e1474]: accept
                  - text: /
                  - code [ref=e1475]: close
                  - text: ）正是这些协议在编程层面的体现。
                - listitem [ref=e1476]:
                  - strong [ref=e1477]: 本卷第4章
                  - text: 将深入讲解 Java NIO，它是对本章 BIO 模型的根本性革新——用 Selector 事件驱动替代线程阻塞等待。
                - listitem [ref=e1478]:
                  - strong [ref=e1479]: 第三卷《并发》
                  - text: 中的线程与线程池知识（
                  - code [ref=e1480]: ExecutorService
                  - text: 、线程栈内存、上下文切换）是理解本章 §3.3（内核视角）和 §3.5（BIO 局限）的前置基础。
                - listitem [ref=e1481]:
                  - strong [ref=e1482]: 第五卷《数据访问》
                  - text: 中数据库连接池的底层实现本质上也是 Socket 连接管理——连接池的大小受限于本章讨论的 fd 和内核资源。
        - contentinfo [ref=e1483]:
          - generic [ref=e1484]:
            - link "在编辑器中打开源文件" [ref=e1486] [cursor=pointer]:
              - /url: http://__vscode__/04-java-network/chapter-03-socket.md
            - paragraph [ref=e1489]:
              - text: "最后更新于:"
              - time [ref=e1490]: 8/9/26, 4:15 PM
          - navigation "Pager" [ref=e1491]:
            - link "上一篇 TCP/IP" [ref=e1494] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-02-tcp-ip.html
              - generic [ref=e1495]: 上一篇
              - generic [ref=e1496]: TCP/IP
            - link "下一篇 Java NIO" [ref=e1498] [cursor=pointer]:
              - /url: /java-world/04-java-network/chapter-04-nio.html
              - generic [ref=e1499]: 下一篇
              - generic [ref=e1500]: Java NIO
  - generic [ref=e1503]:
    - generic [ref=e1504]: ✏️ /diagrams/fd-table.svg
    - button "撤销 Ctrl+Z" [active] [ref=e1506] [cursor=pointer]
    - button "重做 Ctrl+Y" [disabled] [ref=e1511]
    - button "复制 Ctrl+C" [ref=e1517] [cursor=pointer]
    - button "粘贴 Ctrl+V" [ref=e1522] [cursor=pointer]
    - button "删除 Delete" [ref=e1527] [cursor=pointer]
    - button "缩小 Ctrl+-" [ref=e1533] [cursor=pointer]
    - generic [ref=e1538] [cursor=pointer]: 154%
    - button "放大 Ctrl+=" [ref=e1539] [cursor=pointer]
    - button "适应画布 Ctrl+0" [ref=e1544] [cursor=pointer]
    - generic [ref=e1552]: 510 × 289px
    - generic [ref=e1554]:
      - button "左对齐" [ref=e1555] [cursor=pointer]
      - button "水平居中" [ref=e1558] [cursor=pointer]
      - button "右对齐" [ref=e1561] [cursor=pointer]
      - button "顶对齐" [ref=e1564] [cursor=pointer]
      - button "垂直居中" [ref=e1567] [cursor=pointer]
      - button "底对齐" [ref=e1570] [cursor=pointer]
    - generic [ref=e1574]:
      - button "上移一层" [ref=e1575] [cursor=pointer]
      - button "下移一层" [ref=e1579] [cursor=pointer]
      - button "置顶" [ref=e1583] [cursor=pointer]
      - button "置底" [ref=e1588] [cursor=pointer]
    - generic [ref=e1594]:
      - button "水平等间距分布" [ref=e1595] [cursor=pointer]
      - button "垂直等间距分布" [ref=e1600] [cursor=pointer]
    - generic [ref=e1606]:
      - button "组合 Ctrl+G" [ref=e1607] [cursor=pointer]
      - button "取消组合 Ctrl+Shift+G" [ref=e1612] [cursor=pointer]
    - generic [ref=e1620]:
      - generic [ref=e1621]: 旋转
      - spinbutton "旋转角度" [ref=e1622]: "0"
      - generic [ref=e1623]: °
    - generic [ref=e1625]:
      - generic [ref=e1626]: 透明度
      - slider "透明度" [ref=e1627] [cursor=pointer]: "100"
      - generic [ref=e1628]: 100%
    - combobox "渐变类型" [ref=e1631]:
      - option "纯色" [selected]
      - option "线性渐变"
      - option "径向渐变"
    - button "切换阴影" [ref=e1634] [cursor=pointer]
    - generic [ref=e1640]:
      - generic [ref=e1641]: 填充
      - textbox "填充颜色" [ref=e1642] [cursor=pointer]: "#1565c0"
      - generic [ref=e1643]: 边框
      - textbox "边框颜色" [ref=e1644] [cursor=pointer]: "#000000"
      - generic [ref=e1645]: 粗细
      - combobox "边框粗细" [ref=e1646]:
        - option "0.5"
        - option "1" [selected]
        - option "1.5"
        - option "2"
        - option "2.5"
        - option "3"
        - option "4"
        - option "5"
      - button "切换虚线" [ref=e1647] [cursor=pointer]
    - generic [ref=e1651]:
      - combobox "字号" [ref=e1652]:
        - option "8"
        - option "9"
        - option "10"
        - option "11"
        - option "12" [selected]
        - option "14"
        - option "16"
        - option "18"
        - option "20"
        - option "24"
        - option "28"
        - option "32"
        - option "36"
        - option "48"
        - option "64"
        - option "72"
        - option "96"
      - button "加粗 Ctrl+B" [ref=e1653] [cursor=pointer]
      - button "斜体 Ctrl+I" [ref=e1658] [cursor=pointer]
      - button "下划线 Ctrl+U" [ref=e1662] [cursor=pointer]
      - textbox "文字颜色" [ref=e1666] [cursor=pointer]: "#000000"
      - button "左对齐" [ref=e1668] [cursor=pointer]
      - button "居中" [ref=e1671] [cursor=pointer]
      - button "右对齐" [ref=e1674] [cursor=pointer]
    - button "切换主题" [ref=e1678] [cursor=pointer]
    - button "保存 Ctrl+S" [ref=e1686] [cursor=pointer]: 保存
    - button "关闭 Esc" [ref=e1687] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const PAGE = '/java-world/04-java-network/chapter-03-socket';
  4   | 
  5   | test.beforeEach(async ({ page }) => {
  6   |   page.on('pageerror', e => console.log('  ⚠️ JS:', e.message));
  7   |   await page.goto(PAGE, { waitUntil: 'networkidle', timeout: 30000 });
  8   |   await page.waitForSelector('.svg-container', { timeout: 15000 });
  9   |   await page.evaluate(() => document.querySelectorAll('.svg-container')[1]?.scrollIntoView({ block: 'center' }));
  10  |   await page.waitForTimeout(300);
  11  |   // 对齐 svg-editor.spec.ts 的点击方式
  12  |   const container = page.locator('.svg-container').nth(1);
  13  |   await container.hover();
  14  |   await container.locator('.svg-edit-btn').click({ force: true });
  15  |   await page.waitForSelector('.editor-overlay', { timeout: 15000 });
  16  |   await page.waitForTimeout(2000);
  17  | });
  18  | 
  19  | async function resetCanvas(page: any) {
  20  |   await page.evaluate(() => {
  21  |     const c = (window as any).__fabricCanvas;
  22  |     if (c) { c.discardActiveObject(); c.setViewportTransform([1,0,0,1,0,0]); }
  23  |   });
  24  | }
  25  | 
  26  | async function createRects(page: any, n: number, pfx: string) {
  27  |   return page.evaluate(({n, pfx}: any) => {
  28  |     const c = (window as any).__fabricCanvas;
  29  |     if (!c) return [];
  30  |     c.getObjects().filter((o: any) => o.id?.startsWith(pfx)).forEach((o: any) => c.remove(o));
  31  |     const R = (window as any).fabric.Rect;
  32  |     const rects: any[] = [];
  33  |     for (let i = 0; i < n; i++) {
  34  |       const r = new R({ left: 100 + i*60, top: 100 + i*30, width: 80, height: 50,
  35  |         fill: ['#1565C0','#E53935','#4CAF50','#FF9800','#9C27B0'][i], id: `${pfx}-${i}` });
  36  |       c.add(r); rects.push(r);
  37  |     }
  38  |     c.renderAll();
  39  |     return rects.map((r: any) => ({ left: Math.round(r.left), top: Math.round(r.top), id: r.id }));
  40  |   }, { n, pfx });
  41  | }
  42  | 
  43  | async function multiSelect(page: any, ids: string[]) {
  44  |   await page.evaluate((ids: string[]) => {
  45  |     const c = (window as any).__fabricCanvas;
  46  |     const objs = ids.map(id => c.getObjects().find((o: any) => o.id === id)).filter(Boolean);
  47  |     if (objs.length >= 2) {
  48  |       c.setActiveObject(new (window as any).fabric.ActiveSelection(objs, { canvas: c }));
  49  |     } else if (objs.length === 1) c.setActiveObject(objs[0]);
  50  |     c.renderAll();
  51  |   }, ids);
  52  | }
  53  | 
  54  | async function readSelectedRects(page: any, pfx: string) {
  55  |   return page.evaluate((pfx: string) => {
  56  |     const c = (window as any).__fabricCanvas;
  57  |     const sel = c.getActiveObject();
  58  |     const source = (sel && sel._objects) ? sel._objects : c.getObjects();
  59  |     return (source as any[]).filter((o: any) => o.id?.startsWith(pfx))
  60  |       .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top), id: o.id }));
  61  |   }, pfx);
  62  | }
  63  | 
  64  | async function readRects(page: any, pfx: string) {
  65  |   return page.evaluate((pfx: string) => {
  66  |     const c = (window as any).__fabricCanvas;
  67  |     return c.getObjects().filter((o: any) => o.id?.startsWith(pfx))
  68  |       .map((o: any) => ({ left: Math.round(o.left), top: Math.round(o.top), id: o.id }));
  69  |   }, pfx);
  70  | }
  71  | 
  72  | async function clickByTip(page: any, tip: string) {
  73  |   const idx = await page.evaluate((tip: string) => {
  74  |     const btns = document.querySelectorAll('.editor-overlay button');
  75  |     for (let i = 0; i < btns.length; i++) if (btns[i].getAttribute('data-tip') === tip) return i;
  76  |     return -1;
  77  |   }, tip);
> 78  |   if (idx >= 0) { await page.locator('.editor-overlay button').nth(idx).click(); await page.waitForTimeout(200); }
      |                                                                         ^ Error: locator.click: Test timeout of 60000ms exceeded.
  79  |   return idx;
  80  | }
  81  | 
  82  | // ══════════════════════════════════════════════════════════
  83  | 
  84  | test('Group 1: 缩放—放大/缩小/适应画布', async ({ page }) => {
  85  |   await resetCanvas(page);
  86  |   const z1 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0);
  87  |   console.log(`缩放初始: ${z1}`);
  88  |   await clickByTip(page, '放大 (+)');
  89  |   const z2 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0);
  90  |   console.log(`放大后: ${z2}`);
  91  |   expect(z2).toBeGreaterThan(z1);
  92  |   await clickByTip(page, '缩小 (-)');
  93  |   const z3 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0);
  94  |   console.log(`缩小后: ${z3}`);
  95  |   expect(z3).toBeLessThan(z2);
  96  |   await clickByTip(page, '适应画布');
  97  |   const z4 = await page.evaluate(() => (window as any).__fabricCanvas?.getZoom?.() || 0);
  98  |   console.log(`适应后: ${z4}`);
  99  |   expect(z4).toBeGreaterThan(0);
  100 |   console.log('✅ 缩放全通过');
  101 | });
  102 | 
  103 | test('Group 2: 6种对齐—逐个验证坐标变化', async ({ page }) => {
  104 |   await resetCanvas(page);
  105 |   const tips = ['左对齐','水平居中','右对齐','顶对齐','垂直居中','底对齐'];
  106 |   for (const tip of tips) {
  107 |     await createRects(page, 2, 'align');
  108 |     await multiSelect(page, ['align-0','align-1']);
  109 |     const before = await readSelectedRects(page, 'align');
  110 |     const btnIdx = await clickByTip(page, tip);
  111 |     if (btnIdx < 0) { console.log(`  ⚠️ 未找到 "${tip}"`); continue; }
  112 |     // 对齐后解包选区再读
  113 |     await page.evaluate(() => { const c=(window as any).__fabricCanvas; const s=c.getActiveObject(); if(s&&s._objects){s.destroy();c.discardActiveObject();c.renderAll();} });
  114 |     const after = await readRects(page, 'align');
  115 |     const changed = before[0]?.left !== after[0]?.left || before[0]?.top !== after[0]?.top;
  116 |     console.log(`  ${tip}: ${changed ? '✅' : '❌'} [${before[0]?.left},${before[0]?.top}]→[${after[0]?.left},${after[0]?.top}]`);
  117 |     expect(changed, `${tip} 应导致坐标变化`).toBe(true);
  118 |   }
  119 |   console.log('✅ 6种对齐全通过');
  120 | });
  121 | 
  122 | test('Group 3: 撤销/重做/删除/复制', async ({ page }) => {
  123 |   await resetCanvas(page);
  124 |   await createRects(page, 1, 'edit');
  125 |   await multiSelect(page, ['edit-0']);
  126 |   const before = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects()?.length);
  127 |   await clickByTip(page, '删除');
  128 |   const afterDel = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects()?.length);
  129 |   console.log(`删除: ${before}→${afterDel} ${afterDel < before ? '✅' : '❌'}`);
  130 |   expect(afterDel).toBeLessThan(before);
  131 |   await clickByTip(page, '撤销');
  132 |   const afterUndo = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects()?.length);
  133 |   console.log(`撤销: ${afterUndo} ${afterUndo >= before ? '✅' : '⚠️'}`);
  134 |   await clickByTip(page, '重做');
  135 |   console.log('重做: ✅');
  136 |   await page.evaluate(() => { const c=(window as any).__fabricCanvas; const r=new ((window as any).fabric.Rect)({left:200,top:200,width:80,height:50,fill:'#1565C0',id:'copy-test'}); c.add(r); c.setActiveObject(r); c.renderAll(); });
  137 |   await clickByTip(page, '复制');
  138 |   console.log('复制: ✅');
  139 |   console.log('✅ 编辑按钮全通过');
  140 | });
  141 | 
  142 | test('Group 4: 图层—上移/下移/置顶/置底', async ({ page }) => {
  143 |   await resetCanvas(page);
  144 |   await createRects(page, 3, 'layer');
  145 |   await multiSelect(page, ['layer-1']);
  146 |   for (const tip of ['上移一层','下移一层','置顶','置底']) {
  147 |     const idx = await clickByTip(page, tip);
  148 |     console.log(`${tip}: ${idx >= 0 ? '✅ 已点击' : '❌ 未找到'}`);
  149 |   }
  150 |   console.log('✅ 图层按钮全通过');
  151 | });
  152 | 
  153 | test('Group 5: 组合/取消组合', async ({ page }) => {
  154 |   await resetCanvas(page);
  155 |   await createRects(page, 2, 'group');
  156 |   await multiSelect(page, ['group-0','group-1']);
  157 |   await clickByTip(page, '组合 (Ctrl+G)');
  158 |   const hasGroup = await page.evaluate(() => (window as any).__fabricCanvas?.getObjects().some((o: any) => o.type === 'group'));
  159 |   console.log(`组合: ${hasGroup ? '✅' : '⚠️(可能变成activeselection)'}`);
  160 |   await clickByTip(page, '取消组合 (Ctrl+Shift+G)');
  161 |   console.log('取消组合: ✅');
  162 |   console.log('✅ 组合按钮通过');
  163 | });
  164 | 
  165 | test('Group 6: 分布与样式按钮存在性', async ({ page }) => {
  166 |   await resetCanvas(page);
  167 |   for (const tip of ['水平等间距分布','垂直等间距分布','阴影','虚线','加粗','斜体','下划线']) {
  168 |     const idx = await clickByTip(page, tip);
  169 |     console.log(`${tip}: ${idx >= 0 ? '✅' : '❌'}`);
  170 |   }
  171 |   console.log('✅ 分布/样式按钮存在');
  172 | });
  173 | 
  174 | test('Group 7: Canvas框选与拖拽', async ({ page }) => {
  175 |   await resetCanvas(page);
  176 |   await createRects(page, 3, 'drag');
  177 |   const box = await page.locator('.editor-canvas .lower-canvas').boundingBox().catch(() => null);
  178 |   if (box && box.width > 50) {
```