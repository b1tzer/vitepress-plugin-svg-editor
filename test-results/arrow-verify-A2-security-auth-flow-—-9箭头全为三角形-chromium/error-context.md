# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: arrow-verify.spec.ts >> A2: security-auth-flow — 9箭头全为三角形
- Location: tests/arrow-verify.spec.ts:93:1

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.editor-overlay') to be visible

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
            - link "8.1 身份认证" [ref=e437] [cursor=pointer]:
              - /url: "#_8-1-身份认证"
            - list [ref=e438]:
              - listitem [ref=e439]:
                - link "8.1.1 认证的本质" [ref=e440] [cursor=pointer]:
                  - /url: "#_8-1-1-认证的本质"
              - listitem [ref=e441]:
                - link "8.1.2 JWT 的结构" [ref=e442] [cursor=pointer]:
                  - /url: "#_8-1-2-jwt-的结构"
              - listitem [ref=e443]:
                - link "8.1.3 OAuth 2.0 四种授权模式" [ref=e444] [cursor=pointer]:
                  - /url: "#_8-1-3-oauth-2-0-四种授权模式"
          - listitem [ref=e445]:
            - link "8.2 Spring Security 核心" [ref=e446] [cursor=pointer]:
              - /url: "#_8-2-spring-security-核心"
            - list [ref=e447]:
              - listitem [ref=e448]:
                - link "8.2.1 整体架构" [ref=e449] [cursor=pointer]:
                  - /url: "#_8-2-1-整体架构"
              - listitem [ref=e450]:
                - link "8.2.2 认证流程详解" [ref=e451] [cursor=pointer]:
                  - /url: "#_8-2-2-认证流程详解"
              - listitem [ref=e452]:
                - link "8.2.3 核心代码示例" [ref=e453] [cursor=pointer]:
                  - /url: "#_8-2-3-核心代码示例"
          - listitem [ref=e454]:
            - link "8.3 权限模型（RBAC）" [ref=e455] [cursor=pointer]:
              - /url: "#_8-3-权限模型-rbac"
            - list [ref=e456]:
              - listitem [ref=e457]:
                - link "8.3.1 RBAC 基本模型" [ref=e458] [cursor=pointer]:
                  - /url: "#_8-3-1-rbac-基本模型"
              - listitem [ref=e459]:
                - link "8.3.2 数据库设计" [ref=e460] [cursor=pointer]:
                  - /url: "#_8-3-2-数据库设计"
              - listitem [ref=e461]:
                - link "8.3.3 与 Spring Security 集成" [ref=e462] [cursor=pointer]:
                  - /url: "#_8-3-3-与-spring-security-集成"
          - listitem [ref=e463]:
            - link "8.4 数据安全" [ref=e464] [cursor=pointer]:
              - /url: "#_8-4-数据安全"
            - list [ref=e465]:
              - listitem [ref=e466]:
                - link "8.4.1 HTTPS 传输加密" [ref=e467] [cursor=pointer]:
                  - /url: "#_8-4-1-https-传输加密"
              - listitem [ref=e468]:
                - link "8.4.2 敏感数据存储加密" [ref=e469] [cursor=pointer]:
                  - /url: "#_8-4-2-敏感数据存储加密"
              - listitem [ref=e470]:
                - link "8.4.3 日志脱敏" [ref=e471] [cursor=pointer]:
                  - /url: "#_8-4-3-日志脱敏"
              - listitem [ref=e472]:
                - link "8.4.4 操作审计" [ref=e473] [cursor=pointer]:
                  - /url: "#_8-4-4-操作审计"
          - listitem [ref=e474]:
            - link "8.5 Docker 容器化" [ref=e475] [cursor=pointer]:
              - /url: "#_8-5-docker-容器化"
            - list [ref=e476]:
              - listitem [ref=e477]:
                - link "8.5.1 为什么需要容器化" [ref=e478] [cursor=pointer]:
                  - /url: "#_8-5-1-为什么需要容器化"
              - listitem [ref=e479]:
                - link "8.5.2 Dockerfile 示例" [ref=e480] [cursor=pointer]:
                  - /url: "#_8-5-2-dockerfile-示例"
              - listitem [ref=e481]:
                - link "8.5.3 多阶段构建的价值" [ref=e482] [cursor=pointer]:
                  - /url: "#_8-5-3-多阶段构建的价值"
          - listitem [ref=e483]:
            - link "8.6 Kubernetes 基础" [ref=e484] [cursor=pointer]:
              - /url: "#_8-6-kubernetes-基础"
            - list [ref=e485]:
              - listitem [ref=e486]:
                - link "8.6.1 核心资源对象" [ref=e487] [cursor=pointer]:
                  - /url: "#_8-6-1-核心资源对象"
              - listitem [ref=e488]:
                - link "8.6.2 Deployment 示例" [ref=e489] [cursor=pointer]:
                  - /url: "#_8-6-2-deployment-示例"
              - listitem [ref=e490]:
                - link "8.6.3 Service 示例" [ref=e491] [cursor=pointer]:
                  - /url: "#_8-6-3-service-示例"
              - listitem [ref=e492]:
                - link "8.6.4 ConfigMap 与 Secret" [ref=e493] [cursor=pointer]:
                  - /url: "#_8-6-4-configmap-与-secret"
          - listitem [ref=e494]:
            - link "8.7 多环境配置" [ref=e495] [cursor=pointer]:
              - /url: "#_8-7-多环境配置"
            - list [ref=e496]:
              - listitem [ref=e497]:
                - link "8.7.1 Spring Profiles 机制" [ref=e498] [cursor=pointer]:
                  - /url: "#_8-7-1-spring-profiles-机制"
              - listitem [ref=e499]:
                - link "8.7.2 激活 Profile 的方式" [ref=e500] [cursor=pointer]:
                  - /url: "#_8-7-2-激活-profile-的方式"
              - listitem [ref=e501]:
                - link "8.7.3 配置优先级链" [ref=e502] [cursor=pointer]:
                  - /url: "#_8-7-3-配置优先级链"
          - listitem [ref=e503]:
            - link "本章小结" [ref=e504] [cursor=pointer]:
              - /url: "#本章小结"
    - generic [ref=e506]:
      - main [ref=e507]:
        - generic [ref=e509]:
          - heading [level=1] [ref=e510]:
            - text: 第8章 企业系统安全与部署
            - link "Permalink to \"第8章 企业系统安全与部署\"" [ref=e511] [cursor=pointer]:
              - /url: "#第8章-企业系统安全与部署"
              - text: "#"
          - blockquote [ref=e512]:
            - paragraph [ref=e513]: 某公司用户数据被拖库，原因是密码用明文存储、SQL 注入没防住、接口没有鉴权。这不是段子，是每年都在发生的真实事故。身份认证怎么选型？权限怎么设计才能既灵活又安全？敏感数据怎么保护？应用怎么打包才能在任何环境一致运行？本章从认证授权、数据安全、容器化部署三个维度，讲清楚企业级 Java 应用的安全底线。
          - separator [ref=e514]
          - heading [level=2] [ref=e515]:
            - text: 8.1 身份认证
            - link "Permalink to \"8.1 身份认证\"" [ref=e516] [cursor=pointer]:
              - /url: "#_8-1-身份认证"
              - text: "#"
          - heading [level=3] [ref=e517]:
            - text: 8.1.1 认证的本质
            - link "Permalink to \"8.1.1 认证的本质\"" [ref=e518] [cursor=pointer]:
              - /url: "#_8-1-1-认证的本质"
              - text: "#"
          - paragraph [ref=e519]: 身份认证（Authentication）回答的是"你是谁"的问题。在 Web 应用中，用户首次登录后，后续请求需要某种机制让服务器知道"这个请求来自已认证的用户"。三种主流方案的对比如下：
          - table [ref=e520]:
            - rowgroup [ref=e521]:
              - row [ref=e522]:
                - columnheader "维度" [ref=e523]
                - columnheader "Session-Cookie" [ref=e524]
                - columnheader "JWT（JSON Web Token）" [ref=e525]
                - columnheader "OAuth 2.0" [ref=e526]
            - rowgroup [ref=e527]:
              - row [ref=e528]:
                - cell [ref=e529]:
                  - strong [ref=e530]: 存储位置
                - cell "服务端（内存/Redis）" [ref=e531]
                - cell "客户端（LocalStorage/Cookie）" [ref=e532]
                - cell "不存储 token，由授权服务器管理" [ref=e533]
              - row [ref=e534]:
                - cell [ref=e535]:
                  - strong [ref=e536]: 状态
                - cell "有状态（服务端需保存 Session）" [ref=e537]
                - cell "无状态（token 自包含信息）" [ref=e538]
                - cell "依赖授权服务器" [ref=e539]
              - row [ref=e540]:
                - cell [ref=e541]:
                  - strong [ref=e542]: 跨域
                - cell "需要额外处理（Cookie 跨域限制）" [ref=e543]
                - cell "天然支持（放在 Header 中）" [ref=e544]
                - cell "天然支持" [ref=e545]
              - row [ref=e546]:
                - cell [ref=e547]:
                  - strong [ref=e548]: 扩展性
                - cell "多实例需要 Session 共享" [ref=e549]
                - cell "任意节点可验证" [ref=e550]
                - cell "授权中心集中管理" [ref=e551]
              - row [ref=e552]:
                - cell [ref=e553]:
                  - strong [ref=e554]: 撤销
                - cell "删除 Session 即可" [ref=e555]
                - cell "困难（需黑名单机制）" [ref=e556]
                - cell "通过 Refresh Token 机制" [ref=e557]
              - row [ref=e558]:
                - cell [ref=e559]:
                  - strong [ref=e560]: 适用场景
                - cell "传统单体 Web 应用" [ref=e561]
                - cell "前后端分离、微服务内部认证" [ref=e562]
                - cell "第三方登录、开放平台" [ref=e563]
              - row [ref=e564]:
                - cell [ref=e565]:
                  - strong [ref=e566]: 安全风险
                - cell "CSRF 攻击" [ref=e567]
                - cell "Token 泄露后难以撤销" [ref=e568]
                - cell "配置不当可能被滥用" [ref=e569]
          - heading [level=3] [ref=e570]:
            - text: 8.1.2 JWT 的结构
            - link "Permalink to \"8.1.2 JWT 的结构\"" [ref=e571] [cursor=pointer]:
              - /url: "#_8-1-2-jwt-的结构"
              - text: "#"
          - paragraph [ref=e572]: JWT 是目前微服务架构中最常用的身份认证方案，它由三部分组成：
          - generic [ref=e573]:
            - button "Copy Code" [ref=e574] [cursor=pointer]
            - generic [ref=e575]: text
            - code [ref=e577]:
              - generic [ref=e578]: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEwMDg2LCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDUzMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
              - generic [ref=e579]: │ Header（算法） │ Payload（声明） │ Signature（签名） │
            - generic [ref=e580]: 1 2
          - paragraph [ref=e581]:
            - strong [ref=e582]: Java 中生成和验证 JWT
            - text: ：
          - generic [ref=e583]:
            - button "Copy Code" [ref=e584] [cursor=pointer]
            - generic [ref=e585]: java
            - code [ref=e587]:
              - generic [ref=e588]: "@Component"
              - generic [ref=e589]: "public class JwtUtil {"
              - generic [ref=e590]: "@Value(\"${jwt.secret}\")"
              - generic [ref=e591]: private String secret;
              - generic [ref=e592]: "@Value(\"${jwt.expiration:7200}\")"
              - generic [ref=e593]: private long expiration; // 默认 2 小时
              - generic [ref=e594]: "public String generateToken(Long userId, String role) {"
              - generic [ref=e595]: return Jwts.builder()
              - generic [ref=e596]: .setSubject(String.valueOf(userId))
              - generic [ref=e597]: .claim("role", role)
              - generic [ref=e598]: .setIssuedAt(new Date())
              - generic [ref=e599]: .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
              - generic [ref=e600]: .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
              - generic [ref=e601]: .compact();
              - generic [ref=e602]: "}"
              - generic [ref=e603]: "public Claims parseToken(String token) {"
              - generic [ref=e604]: return Jwts.parserBuilder()
              - generic [ref=e605]: .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
              - generic [ref=e606]: .build()
              - generic [ref=e607]: .parseClaimsJws(token)
              - generic [ref=e608]: .getBody();
              - generic [ref=e609]: "}"
              - generic [ref=e610]: "public boolean isTokenValid(String token) {"
              - generic [ref=e611]: "try {"
              - generic [ref=e612]: Claims claims = parseToken(token);
              - generic [ref=e613]: return !claims.getExpiration().before(new Date());
              - generic [ref=e614]: "} catch (JwtException e) {"
              - generic [ref=e615]: return false;
              - generic [ref=e616]: "}"
              - generic [ref=e617]: "}"
              - generic [ref=e618]: "}"
            - generic [ref=e619]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36
          - heading [level=3] [ref=e620]:
            - text: 8.1.3 OAuth 2.0 四种授权模式
            - link "Permalink to \"8.1.3 OAuth 2.0 四种授权模式\"" [ref=e621] [cursor=pointer]:
              - /url: "#_8-1-3-oauth-2-0-四种授权模式"
              - text: "#"
          - paragraph [ref=e622]: OAuth 2.0 是一个授权框架，定义了四种授权模式：
          - table [ref=e623]:
            - rowgroup [ref=e624]:
              - row [ref=e625]:
                - columnheader "模式" [ref=e626]
                - columnheader "流程" [ref=e627]
                - columnheader "适用场景" [ref=e628]
            - rowgroup [ref=e629]:
              - row [ref=e630]:
                - cell [ref=e631]:
                  - strong [ref=e632]: 授权码模式
                - cell "用户→授权页→授权码→后端换 Token" [ref=e633]
                - cell "第三方登录（微信、GitHub）" [ref=e634]
              - row [ref=e635]:
                - cell [ref=e636]:
                  - strong [ref=e637]: 隐式模式
                - cell "用户→授权页→直接返回 Token（前端）" [ref=e638]
                - cell "已不推荐，安全隐患大" [ref=e639]
              - row [ref=e640]:
                - cell [ref=e641]:
                  - strong [ref=e642]: 密码模式
                - cell "用户名+密码直接换 Token" [ref=e643]
                - cell "自家 App、高度信任的第一方应用" [ref=e644]
              - row [ref=e645]:
                - cell [ref=e646]:
                  - strong [ref=e647]: 客户端凭证模式
                - cell "客户端 ID+Secret 直接换 Token" [ref=e648]
                - cell "服务间调用（M2M）" [ref=e649]
          - paragraph [ref=e650]: 授权码模式的完整流程：
          - generic [ref=e651]:
            - button "Copy Code" [ref=e652] [cursor=pointer]
            - generic [ref=e653]: text
            - code [ref=e655]:
              - generic [ref=e656]: ① 用户点击"微信登录"
              - generic [ref=e657]: │
              - generic [ref=e658]: ▼
              - generic [ref=e659]: ② 浏览器跳转到微信授权页
              - generic [ref=e660]: https://open.weixin.qq.com/authorize?client_id=xxx&redirect_uri=xxx&scope=userinfo
              - generic [ref=e661]: │
              - generic [ref=e662]: ▼
              - generic [ref=e663]: ③ 用户确认授权，微信回调 redirect_uri 并携带授权码
              - generic [ref=e664]: https://myapp.com/callback?code=AUTH_CODE_xxx
              - generic [ref=e665]: │
              - generic [ref=e666]: ▼
              - generic [ref=e667]: ④ 后端用授权码换取 Access Token（服务器间通信，用户无感知）
              - generic [ref=e668]: POST https://api.weixin.qq.com/oauth/access_token
              - generic [ref=e669]: "Body: client_id=xxx&client_secret=xxx&code=AUTH_CODE_xxx"
              - generic [ref=e670]: │
              - generic [ref=e671]: ▼
              - generic [ref=e672]: ⑤ 获得 Access Token，调用微信 API 获取用户信息
              - generic [ref=e673]: GET https://api.weixin.qq.com/sns/userinfo?access_token=xxx&openid=xxx
            - generic [ref=e674]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
          - separator [ref=e675]
          - heading [level=2] [ref=e676]:
            - text: 8.2 Spring Security 核心
            - link "Permalink to \"8.2 Spring Security 核心\"" [ref=e677] [cursor=pointer]:
              - /url: "#_8-2-spring-security-核心"
              - text: "#"
          - heading [level=3] [ref=e678]:
            - text: 8.2.1 整体架构
            - link "Permalink to \"8.2.1 整体架构\"" [ref=e679] [cursor=pointer]:
              - /url: "#_8-2-1-整体架构"
              - text: "#"
          - paragraph [ref=e680]:
            - text: Spring Security 的本质是一条
            - strong [ref=e681]: Servlet Filter Chain
            - text: （过滤器链），每个请求都要经过这条链的处理：
          - generic [ref=e682]:
            - button "Copy Code" [ref=e683] [cursor=pointer]
            - generic [ref=e684]: text
            - code [ref=e686]:
              - generic [ref=e687]: HTTP Request
              - generic [ref=e688]: │
              - generic [ref=e689]: ▼
              - generic [ref=e690]: ┌──────────────────────────────────────────────────────────────────┐
              - generic [ref=e691]: │ DelegatingFilterProxy │
              - generic [ref=e692]: │ (Spring 容器的入口，委托给 FilterChainProxy) │
              - generic [ref=e693]: │ │
              - generic [ref=e694]: │ ┌─────────────────────────────────────────────────────────────┐ │
              - generic [ref=e695]: │ │ FilterChainProxy │ │
              - generic [ref=e696]: │ │ │ │
              - generic [ref=e697]: │ │ ┌──────────┐ ┌──────────────────┐ ┌──────────────────┐ │ │
              - generic [ref=e698]: │ │ │ Security │ │ Authentication │ │ Authorization │ │ │
              - generic [ref=e699]: │ │ │ Context │ │ Filter │ │ Filter │ │ │
              - generic [ref=e700]: │ │ │ Filter │ │ (认证：你是谁？) │ │ (授权：你能做什么？)│ │ │
              - generic [ref=e701]: │ │ └──────────┘ └──────────────────┘ └──────────────────┘ │ │
              - generic [ref=e702]: │ └─────────────────────────────────────────────────────────────┘ │
              - generic [ref=e703]: └──────────────────────────────────────────────────────────────────┘
              - generic [ref=e704]: │
              - generic [ref=e705]: ▼
              - generic [ref=e706]: Controller
            - generic [ref=e707]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
          - heading [level=3] [ref=e708]:
            - text: 8.2.2 认证流程详解
            - link "Permalink to \"8.2.2 认证流程详解\"" [ref=e709] [cursor=pointer]:
              - /url: "#_8-2-2-认证流程详解"
              - text: "#"
          - paragraph [ref=e710]: 一次登录认证的完整流程涉及多个组件的协作：
          - img [ref=e712]:
            - generic [ref=e713]: Spring Security 认证流程
            - generic [ref=e715]: 用户提交用户名/密码
            - generic [ref=e717]: AuthenticationFilter
            - generic [ref=e718]: 创建 Authentication 对象（未认证）
            - generic [ref=e720]: AuthenticationManager
            - generic [ref=e721]: authenticate(authentication)
            - generic [ref=e723]: AuthenticationProvider
            - generic [ref=e724]: DaoAuthenticationProvider
            - generic [ref=e728]: UserDetailsService
            - generic [ref=e729]: loadUserByUsername(username)
            - generic [ref=e730]: → 返回 UserDetails（从数据库查询）
            - generic [ref=e732]: PasswordEncoder
            - generic [ref=e733]: matches(rawPassword, encodedPassword)
            - generic [ref=e734]: → 验证密码是否匹配
            - generic [ref=e738]: 认证成功：返回 Authentication 对象
            - generic [ref=e739]: 已认证，包含权限信息
            - generic [ref=e741]: SecurityContextHolder
            - generic [ref=e742]: getContext().setAuthentication(auth)
            - generic [ref=e744]: 后续请求通过 SecurityContextHolder
            - generic [ref=e745]: 获取当前用户信息
          - heading [level=3] [ref=e746]:
            - text: 8.2.3 核心代码示例
            - link "Permalink to \"8.2.3 核心代码示例\"" [ref=e747] [cursor=pointer]:
              - /url: "#_8-2-3-核心代码示例"
              - text: "#"
          - generic [ref=e748]:
            - button "Copy Code" [ref=e749] [cursor=pointer]
            - generic [ref=e750]: java
            - code [ref=e752]:
              - generic [ref=e753]: "@Configuration"
              - generic [ref=e754]: "@EnableWebSecurity"
              - generic [ref=e755]: "public class SecurityConfig {"
              - generic [ref=e756]: "@Bean"
              - generic [ref=e757]: "public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {"
              - generic [ref=e758]: http
              - generic [ref=e759]: .csrf(csrf -> csrf.disable()) // 前后端分离禁用 CSRF
              - generic [ref=e760]: .sessionManagement(session ->
              - generic [ref=e761]: session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 无状态
              - generic [ref=e762]: .authorizeHttpRequests(auth -> auth
              - generic [ref=e763]: .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
              - generic [ref=e764]: .requestMatchers("/api/admin/**").hasRole("ADMIN")
              - generic [ref=e765]: .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")
              - generic [ref=e766]: .anyRequest().authenticated()
              - generic [ref=e767]: )
              - generic [ref=e768]: .addFilterBefore(jwtAuthenticationFilter(),
              - generic [ref=e769]: UsernamePasswordAuthenticationFilter.class);
              - generic [ref=e770]: return http.build();
              - generic [ref=e771]: "}"
              - generic [ref=e772]: "@Bean"
              - generic [ref=e773]: "public PasswordEncoder passwordEncoder() {"
              - generic [ref=e774]: return new BCryptPasswordEncoder();
              - generic [ref=e775]: "}"
              - generic [ref=e776]: "}"
            - generic [ref=e777]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27
          - paragraph [ref=e778]: 自定义 JWT 认证过滤器：
          - generic [ref=e779]:
            - button "Copy Code" [ref=e780] [cursor=pointer]
            - generic [ref=e781]: java
            - code [ref=e783]:
              - generic [ref=e784]: "@Component"
              - generic [ref=e785]: "public class JwtAuthenticationFilter extends OncePerRequestFilter {"
              - generic [ref=e786]: private final JwtUtil jwtUtil;
              - generic [ref=e787]: "@Override"
              - generic [ref=e788]: protected void doFilterInternal(HttpServletRequest request,
              - generic [ref=e789]: HttpServletResponse response, FilterChain chain)
              - generic [ref=e790]: "throws ServletException, IOException {"
              - generic [ref=e791]: String header = request.getHeader("Authorization");
              - generic [ref=e792]: "if (header != null && header.startsWith(\"Bearer \")) {"
              - generic [ref=e793]: String token = header.substring(7);
              - generic [ref=e794]: "if (jwtUtil.isTokenValid(token)) {"
              - generic [ref=e795]: Claims claims = jwtUtil.parseToken(token);
              - generic [ref=e796]: Long userId = Long.parseLong(claims.getSubject());
              - generic [ref=e797]: String role = claims.get("role", String.class);
              - generic [ref=e798]: UsernamePasswordAuthenticationToken auth =
              - generic [ref=e799]: new UsernamePasswordAuthenticationToken(
              - generic [ref=e800]: userId, null,
              - generic [ref=e801]: List.of(new SimpleGrantedAuthority("ROLE_" + role))
              - generic [ref=e802]: );
              - generic [ref=e803]: SecurityContextHolder.getContext().setAuthentication(auth);
              - generic [ref=e804]: "}"
              - generic [ref=e805]: "}"
              - generic [ref=e806]: chain.doFilter(request, response);
              - generic [ref=e807]: "}"
              - generic [ref=e808]: "}"
            - generic [ref=e809]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33
          - separator [ref=e810]
          - heading [level=2] [ref=e811]:
            - text: 8.3 权限模型（RBAC）
            - link "Permalink to \"8.3 权限模型（RBAC）\"" [ref=e812] [cursor=pointer]:
              - /url: "#_8-3-权限模型-rbac"
              - text: "#"
          - heading [level=3] [ref=e813]:
            - text: 8.3.1 RBAC 基本模型
            - link "Permalink to \"8.3.1 RBAC 基本模型\"" [ref=e814] [cursor=pointer]:
              - /url: "#_8-3-1-rbac-基本模型"
              - text: "#"
          - paragraph [ref=e815]: RBAC（Role-Based Access Control，基于角色的访问控制）是企业应用中最广泛使用的权限模型：
          - generic [ref=e816]:
            - button "Copy Code" [ref=e817] [cursor=pointer]
            - generic [ref=e818]: text
            - code [ref=e820]:
              - generic [ref=e821]: ┌────────┐ M:N ┌────────┐ M:N ┌────────────┐
              - generic [ref=e822]: │ 用户 │ ◀──────────▶ │ 角色 │ ◀──────────▶ │ 权限/资源 │
              - generic [ref=e823]: │ (User) │ │ (Role) │ │(Permission)│
              - generic [ref=e824]: └────────┘ └────────┘ └────────────┘
              - generic [ref=e825]: 示例：
              - generic [ref=e826]: 用户"张三" → 角色"订单管理员" → 权限"order:read", "order:create", "order:refund"
              - generic [ref=e827]: 用户"李四" → 角色"客服" → 权限"order:read", "ticket:create"
            - generic [ref=e828]: 1 2 3 4 5 6 7 8
          - heading [level=3] [ref=e829]:
            - text: 8.3.2 数据库设计
            - link "Permalink to \"8.3.2 数据库设计\"" [ref=e830] [cursor=pointer]:
              - /url: "#_8-3-2-数据库设计"
              - text: "#"
          - generic [ref=e831]:
            - button "Copy Code" [ref=e832] [cursor=pointer]
            - generic [ref=e833]: sql
            - code [ref=e835]:
              - generic [ref=e836]: "-- 五张核心表"
              - generic [ref=e837]: CREATE TABLE sys_user (
              - generic [ref=e838]: id BIGINT PRIMARY KEY AUTO_INCREMENT,
              - generic [ref=e839]: username VARCHAR(50) UNIQUE NOT NULL,
              - generic [ref=e840]: password VARCHAR(100) NOT NULL,
              - generic [ref=e841]: status TINYINT DEFAULT 1 COMMENT '1-正常 0-禁用',
              - generic [ref=e842]: created_at DATETIME DEFAULT CURRENT_TIMESTAMP
              - generic [ref=e843]: );
              - generic [ref=e844]: CREATE TABLE sys_role (
              - generic [ref=e845]: id BIGINT PRIMARY KEY AUTO_INCREMENT,
              - generic [ref=e846]: role_code VARCHAR(50) UNIQUE NOT NULL COMMENT '如 ROLE_ADMIN',
              - generic [ref=e847]: role_name VARCHAR(100) NOT NULL,
              - generic [ref=e848]: status TINYINT DEFAULT 1
              - generic [ref=e849]: );
              - generic [ref=e850]: CREATE TABLE sys_permission (
              - generic [ref=e851]: id BIGINT PRIMARY KEY AUTO_INCREMENT,
              - generic [ref=e852]: permission_code VARCHAR(100) UNIQUE NOT NULL COMMENT '如 order:read',
              - generic [ref=e853]: permission_name VARCHAR(200) NOT NULL,
              - generic [ref=e854]: resource_type VARCHAR(20) DEFAULT 'api' COMMENT 'menu/button/api',
              - generic [ref=e855]: parent_id BIGINT DEFAULT 0
              - generic [ref=e856]: );
              - generic [ref=e857]: "-- 关联表"
              - generic [ref=e858]: CREATE TABLE sys_user_role (
              - generic [ref=e859]: user_id BIGINT NOT NULL,
              - generic [ref=e860]: role_id BIGINT NOT NULL,
              - generic [ref=e861]: PRIMARY KEY (user_id, role_id)
              - generic [ref=e862]: );
              - generic [ref=e863]: CREATE TABLE sys_role_permission (
              - generic [ref=e864]: role_id BIGINT NOT NULL,
              - generic [ref=e865]: permission_id BIGINT NOT NULL,
              - generic [ref=e866]: PRIMARY KEY (role_id, permission_id)
              - generic [ref=e867]: );
            - generic [ref=e868]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36
          - heading [level=3] [ref=e869]:
            - text: 8.3.3 与 Spring Security 集成
            - link "Permalink to \"8.3.3 与 Spring Security 集成\"" [ref=e870] [cursor=pointer]:
              - /url: "#_8-3-3-与-spring-security-集成"
              - text: "#"
          - generic [ref=e871]:
            - button "Copy Code" [ref=e872] [cursor=pointer]
            - generic [ref=e873]: java
            - code [ref=e875]:
              - generic [ref=e876]: "@Service"
              - generic [ref=e877]: "public class CustomUserDetailsService implements UserDetailsService {"
              - generic [ref=e878]: private final UserMapper userMapper;
              - generic [ref=e879]: "@Override"
              - generic [ref=e880]: "public UserDetails loadUserByUsername(String username) {"
              - generic [ref=e881]: // 1. 查询用户基本信息
              - generic [ref=e882]: SysUser user = userMapper.selectByUsername(username);
              - generic [ref=e883]: "if (user == null) {"
              - generic [ref=e884]: "throw new UsernameNotFoundException(\"用户不存在: \" + username);"
              - generic [ref=e885]: "}"
              - generic [ref=e886]: // 2. 查询用户的角色和权限
              - generic [ref=e887]: List<String> permissions = userMapper.selectPermissionsByUserId(user.getId());
              - generic [ref=e888]: // 3. 构建 GrantedAuthority 列表
              - generic [ref=e889]: List<GrantedAuthority> authorities = permissions.stream()
              - generic [ref=e890]: .map(SimpleGrantedAuthority::new)
              - generic [ref=e891]: .collect(Collectors.toList());
              - generic [ref=e892]: return new User(
              - generic [ref=e893]: user.getUsername(),
              - generic [ref=e894]: user.getPassword(),
              - generic [ref=e895]: user.getStatus() == 1, // enabled
              - generic [ref=e896]: true, true, true, // accountNonExpired, credentialsNonExpired, accountNonLocked
              - generic [ref=e897]: authorities
              - generic [ref=e898]: );
              - generic [ref=e899]: "}"
              - generic [ref=e900]: "}"
            - generic [ref=e901]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
          - paragraph [ref=e902]: 在 Controller 中使用注解做权限校验：
          - generic [ref=e903]:
            - button "Copy Code" [ref=e904] [cursor=pointer]
            - generic [ref=e905]: java
            - code [ref=e907]:
              - generic [ref=e908]: "@RestController"
              - generic [ref=e909]: "@RequestMapping(\"/api/order\")"
              - generic [ref=e910]: "public class OrderController {"
              - generic [ref=e911]: "@PreAuthorize(\"hasAuthority('order:create')\")"
              - generic [ref=e912]: "@PostMapping"
              - generic [ref=e913]: "public Order createOrder(@RequestBody OrderRequest request) {"
              - generic [ref=e914]: return orderService.create(request);
              - generic [ref=e915]: "}"
              - generic [ref=e916]: "@PreAuthorize(\"hasAuthority('order:refund') and @orderSecurity.checkOwner(#id)\")"
              - generic [ref=e917]: "@PostMapping(\"/{id}/refund\")"
              - generic [ref=e918]: "public Order refundOrder(@PathVariable Long id) {"
              - generic [ref=e919]: return orderService.refund(id);
              - generic [ref=e920]: "}"
              - generic [ref=e921]: "}"
            - generic [ref=e922]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
          - separator [ref=e923]
          - heading [level=2] [ref=e924]:
            - text: 8.4 数据安全
            - link "Permalink to \"8.4 数据安全\"" [ref=e925] [cursor=pointer]:
              - /url: "#_8-4-数据安全"
              - text: "#"
          - heading [level=3] [ref=e926]:
            - text: 8.4.1 HTTPS 传输加密
            - link "Permalink to \"8.4.1 HTTPS 传输加密\"" [ref=e927] [cursor=pointer]:
              - /url: "#_8-4-1-https-传输加密"
              - text: "#"
          - paragraph [ref=e928]: HTTPS 是最基本的安全措施，确保数据在传输过程中不被窃听和篡改。Spring Boot 配置 HTTPS：
          - generic [ref=e929]:
            - button "Copy Code" [ref=e930] [cursor=pointer]
            - generic [ref=e931]: yaml
            - code [ref=e933]:
              - generic [ref=e934]: "server:"
              - generic [ref=e935]: "port: 443"
              - generic [ref=e936]: "ssl:"
              - generic [ref=e937]: "enabled: true"
              - generic [ref=e938]: "key-store: classpath:keystore.p12"
              - generic [ref=e939]: "key-store-password: ${SSL_KEYSTORE_PASSWORD}"
              - generic [ref=e940]: "key-store-type: PKCS12"
            - generic [ref=e941]: 1 2 3 4 5 6 7
          - paragraph [ref=e942]:
            - strong [ref=e943]: 生产环境推荐
            - text: ：在 Nginx 或负载均衡器上终止 SSL，后端服务之间使用内网 HTTP 通信，减少证书管理的复杂度。
          - heading [level=3] [ref=e944]:
            - text: 8.4.2 敏感数据存储加密
            - link "Permalink to \"8.4.2 敏感数据存储加密\"" [ref=e945] [cursor=pointer]:
              - /url: "#_8-4-2-敏感数据存储加密"
              - text: "#"
          - paragraph [ref=e946]: 数据库中的密码、身份证号、银行卡号等敏感字段必须加密存储：
          - generic [ref=e947]:
            - button "Copy Code" [ref=e948] [cursor=pointer]
            - generic [ref=e949]: java
            - code [ref=e951]:
              - generic [ref=e952]: "@Component"
              - generic [ref=e953]: "public class EncryptUtil {"
              - generic [ref=e954]: private static final String AES_KEY = System.getenv("AES_ENCRYPT_KEY");
              - generic [ref=e955]: // AES 加密
              - generic [ref=e956]: "public static String encrypt(String plainText) {"
              - generic [ref=e957]: "try {"
              - generic [ref=e958]: Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
              - generic [ref=e959]: SecretKeySpec keySpec = new SecretKeySpec(
              - generic [ref=e960]: AES_KEY.getBytes(StandardCharsets.UTF_8), "AES");
              - generic [ref=e961]: byte[] iv = new byte[12];
              - generic [ref=e962]: SecureRandom.getInstanceStrong().nextBytes(iv);
              - generic [ref=e963]: GCMParameterSpec gcmSpec = new GCMParameterSpec(128, iv);
              - generic [ref=e964]: cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);
              - generic [ref=e965]: byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
              - generic [ref=e966]: // iv + 密文一起存储
              - generic [ref=e967]: byte[] combined = new byte[iv.length + encrypted.length];
              - generic [ref=e968]: System.arraycopy(iv, 0, combined, 0, iv.length);
              - generic [ref=e969]: System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);
              - generic [ref=e970]: return Base64.getEncoder().encodeToString(combined);
              - generic [ref=e971]: "} catch (Exception e) {"
              - generic [ref=e972]: throw new RuntimeException("加密失败", e);
              - generic [ref=e973]: "}"
              - generic [ref=e974]: "}"
              - generic [ref=e975]: "}"
            - generic [ref=e976]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
          - paragraph [ref=e977]: MyBatis 类型处理器，自动加密/解密：
          - generic [ref=e978]:
            - button "Copy Code" [ref=e979] [cursor=pointer]
            - generic [ref=e980]: java
            - code [ref=e982]:
              - generic [ref=e983]: "@MappedTypes(String.class)"
              - generic [ref=e984]: "public class EncryptTypeHandler extends BaseTypeHandler<String> {"
              - generic [ref=e985]: "@Override"
              - generic [ref=e986]: public void setNonNullParameter(PreparedStatement ps, int i,
              - generic [ref=e987]: "String parameter, JdbcType jdbcType) throws SQLException {"
              - generic [ref=e988]: ps.setString(i, EncryptUtil.encrypt(parameter));
              - generic [ref=e989]: "}"
              - generic [ref=e990]: "@Override"
              - generic [ref=e991]: public String getNullableResult(ResultSet rs, String columnName)
              - generic [ref=e992]: "throws SQLException {"
              - generic [ref=e993]: String value = rs.getString(columnName);
              - generic [ref=e994]: "return value != null ? EncryptUtil.decrypt(value) : null;"
              - generic [ref=e995]: "}"
              - generic [ref=e996]: // ... 其他 getNullableResult 重载
              - generic [ref=e997]: "}"
            - generic [ref=e998]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
          - heading [level=3] [ref=e999]:
            - text: 8.4.3 日志脱敏
            - link "Permalink to \"8.4.3 日志脱敏\"" [ref=e1000] [cursor=pointer]:
              - /url: "#_8-4-3-日志脱敏"
              - text: "#"
          - paragraph [ref=e1001]: 日志中出现敏感信息是最常见的安全漏洞之一。使用 Logback 的自定义脱敏 Converter：
          - generic [ref=e1002]:
            - button "Copy Code" [ref=e1003] [cursor=pointer]
            - generic [ref=e1004]: java
            - code [ref=e1006]:
              - generic [ref=e1007]: "public class SensitiveDataConverter extends ClassicConverter {"
              - generic [ref=e1008]: // 匹配手机号、身份证号、银行卡号的正则
              - generic [ref=e1009]: private static final Pattern PHONE_PATTERN =
              - generic [ref=e1010]: "Pattern.compile(\"(1[3-9]\\\\d)\\\\d{4}(\\\\d{4})\");"
              - generic [ref=e1011]: private static final Pattern ID_CARD_PATTERN =
              - generic [ref=e1012]: "Pattern.compile(\"(\\\\d{6})\\\\d{8}(\\\\d{3}[0-9Xx])\");"
              - generic [ref=e1013]: private static final Pattern BANK_CARD_PATTERN =
              - generic [ref=e1014]: "Pattern.compile(\"(\\\\d{4})\\\\d{8,12}(\\\\d{4})\");"
              - generic [ref=e1015]: "@Override"
              - generic [ref=e1016]: "public String convert(ILoggingEvent event) {"
              - generic [ref=e1017]: String msg = event.getFormattedMessage();
              - generic [ref=e1018]: msg = PHONE_PATTERN.matcher(msg).replaceAll("$1****$2");
              - generic [ref=e1019]: msg = ID_CARD_PATTERN.matcher(msg).replaceAll("$1********$2");
              - generic [ref=e1020]: msg = BANK_CARD_PATTERN.matcher(msg).replaceAll("$1****$2");
              - generic [ref=e1021]: return msg;
              - generic [ref=e1022]: "}"
              - generic [ref=e1023]: "}"
            - generic [ref=e1024]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19
          - paragraph [ref=e1025]:
            - text: 在
            - code [ref=e1026]: logback-spring.xml
            - text: 中注册：
          - generic [ref=e1027]:
            - button "Copy Code" [ref=e1028] [cursor=pointer]
            - generic [ref=e1029]: xml
            - code [ref=e1031]:
              - generic [ref=e1032]: <conversionRule conversionWord="desensitize"
              - generic [ref=e1033]: converterClass="com.example.log.SensitiveDataConverter" />
              - generic [ref=e1034]: <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
              - generic [ref=e1035]: <encoder>
              - generic [ref=e1036]: "<pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %desensitize%n</pattern>"
              - generic [ref=e1037]: </encoder>
              - generic [ref=e1038]: </appender>
            - generic [ref=e1039]: 1 2 3 4 5 6 7 8
          - heading [level=3] [ref=e1040]:
            - text: 8.4.4 操作审计
            - link "Permalink to \"8.4.4 操作审计\"" [ref=e1041] [cursor=pointer]:
              - /url: "#_8-4-4-操作审计"
              - text: "#"
          - paragraph [ref=e1042]: 企业系统必须记录"谁在什么时间做了什么操作"，用于事后追溯和合规审计：
          - generic [ref=e1043]:
            - button "Copy Code" [ref=e1044] [cursor=pointer]
            - generic [ref=e1045]: java
            - code [ref=e1047]:
              - generic [ref=e1048]: "@Aspect"
              - generic [ref=e1049]: "@Component"
              - generic [ref=e1050]: "public class AuditAspect {"
              - generic [ref=e1051]: "@Autowired"
              - generic [ref=e1052]: private AuditLogService auditLogService;
              - generic [ref=e1053]: "@Around(\"@annotation(auditLog)\")"
              - generic [ref=e1054]: "public Object audit(ProceedingJoinPoint joinPoint, AuditLog auditLog) throws Throwable {"
              - generic [ref=e1055]: Long userId = SecurityContextHolder.getContext()
              - generic [ref=e1056]: .getAuthentication() != null
              - generic [ref=e1057]: "? (Long) SecurityContextHolder.getContext()"
              - generic [ref=e1058]: .getAuthentication().getPrincipal()
              - generic [ref=e1059]: ": null;"
              - generic [ref=e1060]: Object result = null;
              - generic [ref=e1061]: boolean success = true;
              - generic [ref=e1062]: String errorMsg = null;
              - generic [ref=e1063]: "try {"
              - generic [ref=e1064]: result = joinPoint.proceed();
              - generic [ref=e1065]: return result;
              - generic [ref=e1066]: "} catch (Throwable e) {"
              - generic [ref=e1067]: success = false;
              - generic [ref=e1068]: errorMsg = e.getMessage();
              - generic [ref=e1069]: throw e;
              - generic [ref=e1070]: "} finally {"
              - generic [ref=e1071]: auditLogService.save(AuditRecord.builder()
              - generic [ref=e1072]: .userId(userId)
              - generic [ref=e1073]: .module(auditLog.module())
              - generic [ref=e1074]: .operation(auditLog.operation())
              - generic [ref=e1075]: .method(joinPoint.getSignature().toShortString())
              - generic [ref=e1076]: .params(toJson(joinPoint.getArgs()))
              - generic [ref=e1077]: ".result(success ? \"SUCCESS\" : \"FAIL\")"
              - generic [ref=e1078]: .errorMsg(errorMsg)
              - generic [ref=e1079]: .ip(getClientIp())
              - generic [ref=e1080]: .createdAt(LocalDateTime.now())
              - generic [ref=e1081]: .build());
              - generic [ref=e1082]: "}"
              - generic [ref=e1083]: "}"
              - generic [ref=e1084]: "}"
              - generic [ref=e1085]: // 使用
              - generic [ref=e1086]: "@AuditLog(module = \"订单管理\", operation = \"退款\")"
              - generic [ref=e1087]: "@PostMapping(\"/api/order/{id}/refund\")"
              - generic [ref=e1088]: "public Order refundOrder(@PathVariable Long id) { ... }"
            - generic [ref=e1089]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46
          - separator [ref=e1090]
          - heading [level=2] [ref=e1091]:
            - text: 8.5 Docker 容器化
            - link "Permalink to \"8.5 Docker 容器化\"" [ref=e1092] [cursor=pointer]:
              - /url: "#_8-5-docker-容器化"
              - text: "#"
          - heading [level=3] [ref=e1093]:
            - text: 8.5.1 为什么需要容器化
            - link "Permalink to \"8.5.1 为什么需要容器化\"" [ref=e1094] [cursor=pointer]:
              - /url: "#_8-5-1-为什么需要容器化"
              - text: "#"
          - table [ref=e1095]:
            - rowgroup [ref=e1096]:
              - row [ref=e1097]:
                - columnheader "传统部署痛点" [ref=e1098]
                - columnheader "Docker 解决方式" [ref=e1099]
            - rowgroup [ref=e1100]:
              - row [ref=e1101]:
                - cell "\"在我电脑上能跑\" —— 环境不一致" [ref=e1102]
                - cell "打包应用 + 依赖 + 配置为一个镜像，任何环境一致运行" [ref=e1103]
              - row [ref=e1104]:
                - cell "部署一台机器需要数小时" [ref=e1105]
                - cell [ref=e1106]:
                  - code [ref=e1107]: docker run
                  - text: 秒级启动
              - row [ref=e1108]:
                - cell "多个应用共享机器，依赖冲突" [ref=e1109]
                - cell "每个容器独立的文件系统和依赖" [ref=e1110]
              - row [ref=e1111]:
                - cell "扩容需要采购服务器" [ref=e1112]
                - cell "容器秒级水平扩展" [ref=e1113]
          - heading [level=3] [ref=e1114]:
            - text: 8.5.2 Dockerfile 示例
            - link "Permalink to \"8.5.2 Dockerfile 示例\"" [ref=e1115] [cursor=pointer]:
              - /url: "#_8-5-2-dockerfile-示例"
              - text: "#"
          - generic [ref=e1116]:
            - button "Copy Code" [ref=e1117] [cursor=pointer]
            - generic [ref=e1118]: dockerfile
            - code [ref=e1120]:
              - generic [ref=e1121]: "# ========== 构建阶段 =========="
              - generic [ref=e1122]: FROM eclipse-temurin:17-jdk-alpine AS builder
              - generic [ref=e1123]: WORKDIR /app
              - generic [ref=e1124]: "# 先复制依赖文件（利用 Docker 缓存层）"
              - generic [ref=e1125]: COPY pom.xml .
              - generic [ref=e1126]: COPY .mvn .mvn
              - generic [ref=e1127]: COPY mvnw .
              - generic [ref=e1128]: RUN ./mvnw dependency:go-offline -B
              - generic [ref=e1129]: "# 再复制源码并构建"
              - generic [ref=e1130]: COPY src ./src
              - generic [ref=e1131]: RUN ./mvnw package -DskipTests -B
              - generic [ref=e1132]: "# ========== 运行阶段 =========="
              - generic [ref=e1133]: FROM eclipse-temurin:17-jre-alpine
              - generic [ref=e1134]: WORKDIR /app
              - generic [ref=e1135]: "# 安全：不使用 root 用户运行"
              - generic [ref=e1136]: RUN addgroup -S appgroup && adduser -S appuser -G appgroup
              - generic [ref=e1137]: USER appuser
              - generic [ref=e1138]: "# 从构建阶段复制产物"
              - generic [ref=e1139]: COPY --from=builder /app/target/*.jar app.jar
              - generic [ref=e1140]: "# JVM 参数：容器感知内存限制"
              - generic [ref=e1141]: ENV JAVA_OPTS="-XX:+UseContainerSupport \
              - generic [ref=e1142]: "-XX:MaxRAMPercentage=75.0 \\"
              - generic [ref=e1143]: "-XX:InitialRAMPercentage=50.0 \\"
              - generic [ref=e1144]: "-Djava.security.egd=file:/dev/./urandom\""
              - generic [ref=e1145]: "# 健康检查"
              - generic [ref=e1146]: HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
              - generic [ref=e1147]: CMD wget -qO- http://localhost:8080/actuator/health || exit 1
              - generic [ref=e1148]: EXPOSE 8080
              - generic [ref=e1149]: ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
            - generic [ref=e1150]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38
          - paragraph [ref=e1151]:
            - strong [ref=e1152]: 构建和运行
            - text: ：
          - generic [ref=e1153]:
            - button "Copy Code" [ref=e1154] [cursor=pointer]
            - generic [ref=e1155]: bash
            - code [ref=e1157]:
              - generic [ref=e1158]: "# 构建镜像"
              - generic [ref=e1159]: docker build -t order-service:1.0.0 .
              - generic [ref=e1160]: "# 运行容器"
              - generic [ref=e1161]: docker run -d \
              - generic [ref=e1162]: "--name order-service \\"
              - generic [ref=e1163]: "-p 8080:8080 \\"
              - generic [ref=e1164]: "-e SPRING_PROFILES_ACTIVE=prod \\"
              - generic [ref=e1165]: "-e DB_URL=jdbc:mysql://db:3306/order_db \\"
              - generic [ref=e1166]: order-service:1.0.0
            - generic [ref=e1167]: 1 2 3 4 5 6 7 8 9 10
          - heading [level=3] [ref=e1168]:
            - text: 8.5.3 多阶段构建的价值
            - link "Permalink to \"8.5.3 多阶段构建的价值\"" [ref=e1169] [cursor=pointer]:
              - /url: "#_8-5-3-多阶段构建的价值"
              - text: "#"
          - paragraph [ref=e1170]: 多阶段构建（Multi-stage Build）将"编译"和"运行"分离：
          - generic [ref=e1171]:
            - button "Copy Code" [ref=e1172] [cursor=pointer]
            - generic [ref=e1173]: text
            - code [ref=e1175]:
              - generic [ref=e1176]: 构建阶段（builder） 运行阶段（runtime）
              - generic [ref=e1177]: ┌─────────────────────┐ ┌─────────────────────┐
              - generic [ref=e1178]: │ JDK 17 (~300MB) │ │ JRE 17 (~180MB) │
              - generic [ref=e1179]: │ Maven (~10MB) │ │ │
              - generic [ref=e1180]: │ 源代码 │ │ app.jar only │
              - generic [ref=e1181]: │ pom.xml │ │ (~50MB) │
              - generic [ref=e1182]: │ │ │ │
              - generic [ref=e1183]: "│ 输出: app.jar │──▶ │ 最终镜像: ~230MB │"
              - generic [ref=e1184]: └─────────────────────┘ └─────────────────────┘
            - generic [ref=e1185]: 1 2 3 4 5 6 7 8 9
          - paragraph [ref=e1186]: 最终镜像不包含 JDK、Maven、源代码，体积大幅缩小，攻击面也更小。
          - separator [ref=e1187]
          - heading [level=2] [ref=e1188]:
            - text: 8.6 Kubernetes 基础
            - link "Permalink to \"8.6 Kubernetes 基础\"" [ref=e1189] [cursor=pointer]:
              - /url: "#_8-6-kubernetes-基础"
              - text: "#"
          - heading [level=3] [ref=e1190]:
            - text: 8.6.1 核心资源对象
            - link "Permalink to \"8.6.1 核心资源对象\"" [ref=e1191] [cursor=pointer]:
              - /url: "#_8-6-1-核心资源对象"
              - text: "#"
          - paragraph [ref=e1192]: Kubernetes（K8s）是容器编排的事实标准，其核心资源对象如下：
          - table [ref=e1193]:
            - rowgroup [ref=e1194]:
              - row [ref=e1195]:
                - columnheader "资源" [ref=e1196]
                - columnheader "作用" [ref=e1197]
                - columnheader "类比" [ref=e1198]
            - rowgroup [ref=e1199]:
              - row [ref=e1200]:
                - cell [ref=e1201]:
                  - strong [ref=e1202]: Pod
                - cell "最小部署单元，包含一个或多个容器" [ref=e1203]
                - cell "一个\"宿舍\"，里面住着一个或多个\"人\"" [ref=e1204]
              - row [ref=e1205]:
                - cell [ref=e1206]:
                  - strong [ref=e1207]: Deployment
                - cell "管理 Pod 的副本数、滚动更新、回滚" [ref=e1208]
                - cell "宿舍管理员，确保始终有 N 间宿舍住着人" [ref=e1209]
              - row [ref=e1210]:
                - cell [ref=e1211]:
                  - strong [ref=e1212]: Service
                - cell "为一组 Pod 提供稳定的访问入口（负载均衡）" [ref=e1213]
                - cell "前台接待，把访客引导到有空位的宿舍" [ref=e1214]
              - row [ref=e1215]:
                - cell [ref=e1216]:
                  - strong [ref=e1217]: ConfigMap
                - cell "存储非敏感配置（键值对或文件）" [ref=e1218]
                - cell "公告栏上的通知" [ref=e1219]
              - row [ref=e1220]:
                - cell [ref=e1221]:
                  - strong [ref=e1222]: Secret
                - cell "存储敏感信息（密码、证书），Base64 编码" [ref=e1223]
                - cell "上锁的保险柜" [ref=e1224]
          - heading [level=3] [ref=e1225]:
            - text: 8.6.2 Deployment 示例
            - link "Permalink to \"8.6.2 Deployment 示例\"" [ref=e1226] [cursor=pointer]:
              - /url: "#_8-6-2-deployment-示例"
              - text: "#"
          - generic [ref=e1227]:
            - button "Copy Code" [ref=e1228] [cursor=pointer]
            - generic [ref=e1229]: yaml
            - code [ref=e1231]:
              - generic [ref=e1232]: "apiVersion: apps/v1"
              - generic [ref=e1233]: "kind: Deployment"
              - generic [ref=e1234]: "metadata:"
              - generic [ref=e1235]: "name: order-service"
              - generic [ref=e1236]: "namespace: production"
              - generic [ref=e1237]: "spec:"
              - generic [ref=e1238]: "replicas: 3 # 保持 3 个副本"
              - generic [ref=e1239]: "strategy:"
              - generic [ref=e1240]: "type: RollingUpdate"
              - generic [ref=e1241]: "rollingUpdate:"
              - generic [ref=e1242]: "maxSurge: 1 # 最多多出 1 个 Pod"
              - generic [ref=e1243]: "maxUnavailable: 0 # 更新时不允许不可用"
              - generic [ref=e1244]: "selector:"
              - generic [ref=e1245]: "matchLabels:"
              - generic [ref=e1246]: "app: order-service"
              - generic [ref=e1247]: "template:"
              - generic [ref=e1248]: "metadata:"
              - generic [ref=e1249]: "labels:"
              - generic [ref=e1250]: "app: order-service"
              - generic [ref=e1251]: "spec:"
              - generic [ref=e1252]: "containers:"
              - generic [ref=e1253]: "- name: order-service"
              - generic [ref=e1254]: "image: registry.example.com/order-service:1.2.0"
              - generic [ref=e1255]: "ports:"
              - generic [ref=e1256]: "- containerPort: 8080"
              - generic [ref=e1257]: "env:"
              - generic [ref=e1258]: "- name: SPRING_PROFILES_ACTIVE"
              - generic [ref=e1259]: "valueFrom:"
              - generic [ref=e1260]: "configMapKeyRef:"
              - generic [ref=e1261]: "name: order-config"
              - generic [ref=e1262]: "key: spring.profiles.active"
              - generic [ref=e1263]: "- name: DB_PASSWORD"
              - generic [ref=e1264]: "valueFrom:"
              - generic [ref=e1265]: "secretKeyRef:"
              - generic [ref=e1266]: "name: order-secret"
              - generic [ref=e1267]: "key: db-password"
              - generic [ref=e1268]: "resources:"
              - generic [ref=e1269]: "requests:"
              - generic [ref=e1270]: "memory: \"512Mi\""
              - generic [ref=e1271]: "cpu: \"500m\""
              - generic [ref=e1272]: "limits:"
              - generic [ref=e1273]: "memory: \"1Gi\""
              - generic [ref=e1274]: "cpu: \"1000m\""
              - generic [ref=e1275]: "readinessProbe: # 就绪探针：准备好才接收流量"
              - generic [ref=e1276]: "httpGet:"
              - generic [ref=e1277]: "path: /actuator/health/readiness"
              - generic [ref=e1278]: "port: 8080"
              - generic [ref=e1279]: "initialDelaySeconds: 30"
              - generic [ref=e1280]: "periodSeconds: 10"
              - generic [ref=e1281]: "livenessProbe: # 存活探针：挂了就重启"
              - generic [ref=e1282]: "httpGet:"
              - generic [ref=e1283]: "path: /actuator/health/liveness"
              - generic [ref=e1284]: "port: 8080"
              - generic [ref=e1285]: "initialDelaySeconds: 60"
              - generic [ref=e1286]: "periodSeconds: 15"
            - generic [ref=e1287]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55
          - heading [level=3] [ref=e1288]:
            - text: 8.6.3 Service 示例
            - link "Permalink to \"8.6.3 Service 示例\"" [ref=e1289] [cursor=pointer]:
              - /url: "#_8-6-3-service-示例"
              - text: "#"
          - generic [ref=e1290]:
            - button "Copy Code" [ref=e1291] [cursor=pointer]
            - generic [ref=e1292]: yaml
            - code [ref=e1294]:
              - generic [ref=e1295]: "apiVersion: v1"
              - generic [ref=e1296]: "kind: Service"
              - generic [ref=e1297]: "metadata:"
              - generic [ref=e1298]: "name: order-service"
              - generic [ref=e1299]: "namespace: production"
              - generic [ref=e1300]: "spec:"
              - generic [ref=e1301]: "type: ClusterIP # 集群内部访问"
              - generic [ref=e1302]: "selector:"
              - generic [ref=e1303]: "app: order-service"
              - generic [ref=e1304]: "ports:"
              - generic [ref=e1305]: "- port: 80 # Service 端口"
              - generic [ref=e1306]: "targetPort: 8080 # Pod 端口"
              - generic [ref=e1307]: "protocol: TCP"
            - generic [ref=e1308]: 1 2 3 4 5 6 7 8 9 10 11 12 13
          - paragraph [ref=e1309]:
            - text: Service 提供稳定的 DNS 名称：
            - code [ref=e1310]: order-service.production.svc.cluster.local
            - text: ，无论 Pod 如何漂移，其他服务只需通过这个域名访问。
          - heading [level=3] [ref=e1311]:
            - text: 8.6.4 ConfigMap 与 Secret
            - link "Permalink to \"8.6.4 ConfigMap 与 Secret\"" [ref=e1312] [cursor=pointer]:
              - /url: "#_8-6-4-configmap-与-secret"
              - text: "#"
          - generic [ref=e1313]:
            - button "Copy Code" [ref=e1314] [cursor=pointer]
            - generic [ref=e1315]: yaml
            - code [ref=e1317]:
              - generic [ref=e1318]: "# ConfigMap - 非敏感配置"
              - generic [ref=e1319]: "apiVersion: v1"
              - generic [ref=e1320]: "kind: ConfigMap"
              - generic [ref=e1321]: "metadata:"
              - generic [ref=e1322]: "name: order-config"
              - generic [ref=e1323]: "namespace: production"
              - generic [ref=e1324]: "data:"
              - generic [ref=e1325]: "spring.profiles.active: \"prod\""
              - generic [ref=e1326]: "app.page-size: \"20\""
              - generic [ref=e1327]: "app.cache-ttl: \"300\""
              - generic [ref=e1328]: "---"
              - generic [ref=e1329]: "# Secret - 敏感配置"
              - generic [ref=e1330]: "apiVersion: v1"
              - generic [ref=e1331]: "kind: Secret"
              - generic [ref=e1332]: "metadata:"
              - generic [ref=e1333]: "name: order-secret"
              - generic [ref=e1334]: "namespace: production"
              - generic [ref=e1335]: "type: Opaque"
              - generic [ref=e1336]: "data:"
              - generic [ref=e1337]: "db-password: cGFzc3dvcmQxMjM= # base64(\"password123\")"
              - generic [ref=e1338]: "jwt-secret: c2VjcmV0S2V5MTIz # base64(\"secretKey123\")"
            - generic [ref=e1339]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22
          - paragraph [ref=e1340]:
            - strong [ref=e1341]: 最佳实践
            - text: ：ConfigMap 和 Secret 的值可以在 Pod 内以环境变量或文件挂载的方式使用。环境变量适合简单配置，文件挂载适合配置文件（如
            - code [ref=e1342]: application.yml
            - text: ）。
          - separator [ref=e1343]
          - heading [level=2] [ref=e1344]:
            - text: 8.7 多环境配置
            - link "Permalink to \"8.7 多环境配置\"" [ref=e1345] [cursor=pointer]:
              - /url: "#_8-7-多环境配置"
              - text: "#"
          - heading [level=3] [ref=e1346]:
            - text: 8.7.1 Spring Profiles 机制
            - link "Permalink to \"8.7.1 Spring Profiles 机制\"" [ref=e1347] [cursor=pointer]:
              - /url: "#_8-7-1-spring-profiles-机制"
              - text: "#"
          - paragraph [ref=e1348]:
            - text: 企业应用通常需要在多个环境（开发、测试、预发布、生产）中运行，每个环境的数据库地址、缓存配置、日志级别都不同。Spring Boot 通过
            - code [ref=e1349]: spring.profiles.active
            - text: 机制解决这个问题：
          - generic [ref=e1350]:
            - button "Copy Code" [ref=e1351] [cursor=pointer]
            - generic [ref=e1352]: text
            - code [ref=e1354]:
              - generic [ref=e1355]: src/main/resources/
              - generic [ref=e1356]: "├── application.yml # 公共配置（所有环境共享）"
              - generic [ref=e1357]: "├── application-dev.yml # 开发环境"
              - generic [ref=e1358]: "├── application-test.yml # 测试环境"
              - generic [ref=e1359]: "├── application-staging.yml # 预发布环境"
              - generic [ref=e1360]: "└── application-prod.yml # 生产环境"
            - generic [ref=e1361]: 1 2 3 4 5 6
          - paragraph [ref=e1362]:
            - strong [ref=e1363]: 公共配置 application.yml
            - text: ：
          - generic [ref=e1364]:
            - button "Copy Code" [ref=e1365] [cursor=pointer]
            - generic [ref=e1366]: yaml
            - code [ref=e1368]:
              - generic [ref=e1369]: "spring:"
              - generic [ref=e1370]: "application:"
              - generic [ref=e1371]: "name: order-service"
              - generic [ref=e1372]: "jackson:"
              - generic [ref=e1373]: "date-format: yyyy-MM-dd HH:mm:ss"
              - generic [ref=e1374]: "time-zone: Asia/Shanghai"
              - generic [ref=e1375]: "# 公共业务配置"
              - generic [ref=e1376]: "order:"
              - generic [ref=e1377]: "page-size: 20"
              - generic [ref=e1378]: "max-retry: 3"
            - generic [ref=e1379]: 1 2 3 4 5 6 7 8 9 10 11
          - paragraph [ref=e1380]:
            - strong [ref=e1381]: 开发环境 application-dev.yml
            - text: ：
          - generic [ref=e1382]:
            - button "Copy Code" [ref=e1383] [cursor=pointer]
            - generic [ref=e1384]: yaml
            - code [ref=e1386]:
              - generic [ref=e1387]: "spring:"
              - generic [ref=e1388]: "datasource:"
              - generic [ref=e1389]: "url: jdbc:mysql://localhost:3306/order_dev"
              - generic [ref=e1390]: "username: root"
              - generic [ref=e1391]: "password: root"
              - generic [ref=e1392]: "data:"
              - generic [ref=e1393]: "redis:"
              - generic [ref=e1394]: "host: localhost"
              - generic [ref=e1395]: "port: 6379"
              - generic [ref=e1396]: "logging:"
              - generic [ref=e1397]: "level:"
              - generic [ref=e1398]: "com.example: DEBUG"
              - generic [ref=e1399]: "org.springframework: INFO"
            - generic [ref=e1400]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14
          - paragraph [ref=e1401]:
            - strong [ref=e1402]: 生产环境 application-prod.yml
            - text: ：
          - generic [ref=e1403]:
            - button "Copy Code" [ref=e1404] [cursor=pointer]
            - generic [ref=e1405]: yaml
            - code [ref=e1407]:
              - generic [ref=e1408]: "spring:"
              - generic [ref=e1409]: "datasource:"
              - generic [ref=e1410]: "url: jdbc:mysql://${DB_HOST:prod-db}:3306/order_prod"
              - generic [ref=e1411]: "username: ${DB_USERNAME}"
              - generic [ref=e1412]: "password: ${DB_PASSWORD}"
              - generic [ref=e1413]: "hikari:"
              - generic [ref=e1414]: "maximum-pool-size: 20"
              - generic [ref=e1415]: "minimum-idle: 5"
              - generic [ref=e1416]: "data:"
              - generic [ref=e1417]: "redis:"
              - generic [ref=e1418]: "host: ${REDIS_HOST}"
              - generic [ref=e1419]: "port: 6379"
              - generic [ref=e1420]: "password: ${REDIS_PASSWORD}"
              - generic [ref=e1421]: "logging:"
              - generic [ref=e1422]: "level:"
              - generic [ref=e1423]: "com.example: WARN"
              - generic [ref=e1424]: "org.springframework: WARN"
            - generic [ref=e1425]: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
          - heading [level=3] [ref=e1426]:
            - text: 8.7.2 激活 Profile 的方式
            - link "Permalink to \"8.7.2 激活 Profile 的方式\"" [ref=e1427] [cursor=pointer]:
              - /url: "#_8-7-2-激活-profile-的方式"
              - text: "#"
          - table [ref=e1428]:
            - rowgroup [ref=e1429]:
              - row [ref=e1430]:
                - columnheader "方式" [ref=e1431]
                - columnheader "示例" [ref=e1432]
                - columnheader "优先级" [ref=e1433]
            - rowgroup [ref=e1434]:
              - row [ref=e1435]:
                - cell "命令行参数" [ref=e1436]
                - cell [ref=e1437]:
                  - code [ref=e1438]: java -jar app.jar --spring.profiles.active=prod
                - cell "最高" [ref=e1439]
              - row [ref=e1440]:
                - cell "环境变量" [ref=e1441]
                - cell [ref=e1442]:
                  - code [ref=e1443]: SPRING_PROFILES_ACTIVE=prod
                - cell "高" [ref=e1444]
              - row [ref=e1445]:
                - cell "JVM 参数" [ref=e1446]
                - cell [ref=e1447]:
                  - code [ref=e1448]: java -Dspring.profiles.active=prod -jar app.jar
                - cell "中" [ref=e1449]
              - row [ref=e1450]:
                - cell "bootstrap.yml" [ref=e1451]
                - cell [ref=e1452]:
                  - code [ref=e1453]: "spring.profiles.active: ${SPRING_PROFILES_ACTIVE:dev}"
                - cell "低" [ref=e1454]
              - row [ref=e1455]:
                - cell "默认值" [ref=e1456]
                - cell [ref=e1457]:
                  - code [ref=e1458]: "@Profile(\"dev\")"
                - cell "最低" [ref=e1459]
          - paragraph [ref=e1460]: 在 Kubernetes 中，通常通过 ConfigMap 设置环境变量：
          - generic [ref=e1461]:
            - button "Copy Code" [ref=e1462] [cursor=pointer]
            - generic [ref=e1463]: yaml
            - code [ref=e1465]:
              - generic [ref=e1466]: "env:"
              - generic [ref=e1467]: "- name: SPRING_PROFILES_ACTIVE"
              - generic [ref=e1468]: "valueFrom:"
              - generic [ref=e1469]: "configMapKeyRef:"
              - generic [ref=e1470]: "name: app-config"
              - generic [ref=e1471]: "key: spring.profiles.active # 值为 \"prod\""
            - generic [ref=e1472]: 1 2 3 4 5 6
          - heading [level=3] [ref=e1473]:
            - text: 8.7.3 配置优先级链
            - link "Permalink to \"8.7.3 配置优先级链\"" [ref=e1474] [cursor=pointer]:
              - /url: "#_8-7-3-配置优先级链"
              - text: "#"
          - paragraph [ref=e1475]: Spring Boot 的配置优先级从高到低：
          - generic [ref=e1476]:
            - button "Copy Code" [ref=e1477] [cursor=pointer]
            - generic [ref=e1478]: text
            - code [ref=e1480]:
              - generic [ref=e1481]: 命令行参数 > java:comp/env > 系统属性 > 系统环境变量
              - generic [ref=e1482]: "> application-{profile}.yml > application.yml > @PropertySource"
              - generic [ref=e1483]: "> 默认属性（SpringApplication.setDefaultProperties）"
            - generic [ref=e1484]: 1 2 3
          - paragraph [ref=e1485]:
            - strong [ref=e1486]: 设计原则
            - text: ：公共配置放
            - code [ref=e1487]: application.yml
            - text: ，环境差异配置放
            - code [ref=e1488]: "application-{profile}.yml"
            - text: ，敏感信息通过环境变量或 Secret 注入，
            - strong [ref=e1489]: 永远不要将密码写在代码仓库中
            - text: 。
          - separator [ref=e1490]
          - heading [level=2] [ref=e1491]:
            - text: 本章小结
            - link "Permalink to \"本章小结\"" [ref=e1492] [cursor=pointer]:
              - /url: "#本章小结"
              - text: "#"
          - paragraph [ref=e1493]: 本章从三个维度构建了企业级 Java 应用的安全与部署体系：
          - table [ref=e1494]:
            - rowgroup [ref=e1495]:
              - row [ref=e1496]:
                - columnheader "维度" [ref=e1497]
                - columnheader "核心能力" [ref=e1498]
                - columnheader "关键技术" [ref=e1499]
            - rowgroup [ref=e1500]:
              - row [ref=e1501]:
                - cell [ref=e1502]:
                  - strong [ref=e1503]: 认证授权
                - cell "身份认证 + 权限控制" [ref=e1504]
                - cell "JWT / OAuth 2.0 / Spring Security / RBAC" [ref=e1505]
              - row [ref=e1506]:
                - cell [ref=e1507]:
                  - strong [ref=e1508]: 数据安全
                - cell "传输加密 + 存储加密 + 日志脱敏 + 审计" [ref=e1509]
                - cell "HTTPS / AES / Logback / AOP" [ref=e1510]
              - row [ref=e1511]:
                - cell [ref=e1512]:
                  - strong [ref=e1513]: 容器化部署
                - cell "一致环境 + 快速部署 + 弹性伸缩" [ref=e1514]
                - cell "Docker / Kubernetes / Spring Profiles" [ref=e1515]
          - separator [ref=e1516]
          - blockquote [ref=e1517]:
            - paragraph [ref=e1518]: 系统安全部署上线了，但你怎么知道它运行得好不好？用户说"接口很慢"，你如何定位是数据库慢、缓存穿透还是下游超时？下一章从日志、指标、链路追踪三大支柱出发，构建完整的可观测体系。
      - contentinfo [ref=e1519]:
        - generic [ref=e1520]:
          - link "在编辑器中打开源文件" [ref=e1522] [cursor=pointer]:
            - /url: http://__vscode__/06-java-enterprise/chapter-08-security-deploy.md
          - paragraph [ref=e1525]:
            - text: "Last updated:"
            - time [ref=e1526]: 8/10/26, 4:34 PM
        - navigation "Pager" [ref=e1527]:
          - link "上一章 分布式治理" [ref=e1530] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-07-governance.html
            - generic [ref=e1531]: 上一章
            - generic [ref=e1532]: 分布式治理
          - link "下一章 可观测性" [ref=e1534] [cursor=pointer]:
            - /url: /java-world/06-java-enterprise/chapter-09-observability.html
            - generic [ref=e1535]: 下一章
            - generic [ref=e1536]: 可观测性
```

# Test source

```ts
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
  31  |   await editBtn.click({ force: true });
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
> 106 |   await page.waitForSelector('.editor-overlay', { timeout: 15000 });
      |              ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
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
  132 | test('C1: 合组率 — 无孤立箭头元件', async ({ page }) => {
  133 |   await openEditor(page, PAGE_VT, 1);
  134 |   const r = await page.evaluate(() => {
  135 |     const c = (window as any).__fabricCanvas;
  136 |     const objs = c.getObjects();
  137 |     const kids = new Set<any>();
  138 |     objs.filter((o: any) => o.type === 'group').forEach((g: any) =>
  139 |       (g._objects || g.getObjects() || []).forEach((ch: any) => kids.add(ch)));
  140 |     return {
  141 |       orphans: objs.filter((o: any) => o.type === 'line' && !kids.has(o)).length,
  142 |       orphanP: objs.filter((o: any) => o.type === 'polygon' && !kids.has(o) && ((o.width||0)*(o.scaleX||1)) < 20).length,
  143 |     };
  144 |   });
  145 |   console.log(`孤立line=${r.orphans} 孤立小polygon=${r.orphanP}`);
  146 |   expect(r.orphans).toBe(0);
  147 |   expect(r.orphanP).toBe(0);
  148 |   console.log('✅ 合并率100%');
  149 | });
  150 | 
  151 | test('D1: 颜色 — polygon fill 有效不透明', async ({ page }) => {
  152 |   await openEditor(page, PAGE_VT, 1);
  153 |   const arrows = await getArrowGroups(page);
  154 |   for (const a of arrows) {
  155 |     expect(a.polyFill).toBeTruthy();
  156 |     expect(a.polyFill).not.toBe('transparent');
  157 |     expect(a.polyFill).not.toBe('none');
  158 |     console.log(`  ${a.polyFill} ✅`);
  159 |   }
  160 |   console.log('✅ 颜色正确');
  161 | });
  162 | 
  163 | test('E1: 可选中', async ({ page }) => {
  164 |   await openEditor(page, PAGE_VT, 1);
  165 |   const arrows = await getArrowGroups(page);
  166 |   for (const a of arrows) expect(a.selectable).toBe(true);
  167 |   console.log('✅ 全部可选中');
  168 | });
  169 | 
  170 | test('F1: 拖拽不解体', async ({ page }) => {
  171 |   await openEditor(page, PAGE_VT, 1);
  172 |   const box = await page.locator('.editor-canvas .lower-canvas').boundingBox().catch(() => null);
  173 |   if (!box) { console.log('⚠️ skip'); return; }
  174 |   const before = await page.evaluate(() =>
  175 |     (window as any).__fabricCanvas.getObjects().filter((o: any) => o.type === 'group').length);
  176 |   const pos = await page.evaluate(() => {
  177 |     const c = (window as any).__fabricCanvas;
  178 |     const g = c.getObjects().filter((o: any) => o.type === 'group')[0];
  179 |     if (!g) return null;
  180 |     c.setActiveObject(g); c.renderAll();
  181 |     return { left: Math.round(g.left), top: Math.round(g.top) };
  182 |   });
  183 |   if (!pos || !box) return;
  184 |   await page.mouse.move(box.x + pos.left + 10, box.y + pos.top + 10);
  185 |   await page.mouse.down();
  186 |   await page.mouse.move(box.x + pos.left + 60, box.y + pos.top + 30, { steps: 10 });
  187 |   await page.mouse.up();
  188 |   await page.waitForTimeout(300);
  189 |   const after = await page.evaluate(() =>
  190 |     (window as any).__fabricCanvas.getObjects().filter((o: any) => o.type === 'group').length);
  191 |   console.log(`${before}→${after} ${after === before ? '✅' : '❌解体!'}`);
  192 |   expect(after, '拖拽不解体').toBe(before);
  193 |   console.log('✅ 拖拽不解体');
  194 | });
  195 | 
  196 | test('G1: 保存后重开 — 箭头组不消失', async ({ page }) => {
  197 |   await openEditor(page, PAGE_VT, 1);
  198 |   const before = await getArrowGroups(page);
  199 |   expect(before.length).toBeGreaterThanOrEqual(9, '初始应有至少9个箭头组');
  200 | 
  201 |   // 点击保存（会 emit close，编辑器关闭）
  202 |   const saveBtn = page.locator('.btn-save');
  203 |   await saveBtn.waitFor({ state: 'attached', timeout: 5000 });
  204 |   await saveBtn.click({ force: true });
  205 |   // 等待编辑器关闭
  206 |   await page.waitForSelector('.editor-overlay', { state: 'hidden', timeout: 10000 }).catch(() => {});
```