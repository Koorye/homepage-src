---
title: Spring Boot 源码分析——RequestContextHolder 与 ThreadLocal
date: 2020-12-10 20:58:13
tags: [后端,Spring Boot]
categories: 后端
description: Spring Boot 如何为每个请求分配线程，在线程中注入请求信息，又如何通过线程取出请求呢？
---

笔者一直在思考 Shiro 如何通过 `SecurityUtils` 拿到当前用户。原来是对于每个 HTTP 请求，在 Java 中都会开启一个线程进行处理，这个线程内就存放了当前的请求与请求信息，Shiro 通过当前线程，就可以拿到对应的 HTTP 请求，从而拿到当前用户。

进一步考虑，Spring Boot 是如何实现这一过程的呢？Spring Boot 如何为每个请求分配线程，在线程中注入请求信息，又如何通过线程取出请求呢？

# RequestContextHolder

源码：

```java
public abstract class RequestContextHolder  {

	private static final boolean jsfPresent =
			ClassUtils.isPresent("javax.faces.context.FacesContext", RequestContextHolder.class.getClassLoader());

	private static final ThreadLocal<RequestAttributes> requestAttributesHolder =
			new NamedThreadLocal<>("Request attributes");

	private static final ThreadLocal<RequestAttributes> inheritableRequestAttributesHolder =
			new NamedInheritableThreadLocal<>("Request context");


	/**
	 * Reset the RequestAttributes for the current thread.
	 */
	public static void resetRequestAttributes() {
		requestAttributesHolder.remove();
		inheritableRequestAttributesHolder.remove();
	}

	/**
	 * Bind the given RequestAttributes to the current thread,
	 * <i>not</i> exposing it as inheritable for child threads.
	 * @param attributes the RequestAttributes to expose
	 * @see #setRequestAttributes(RequestAttributes, boolean)
	 */
	public static void setRequestAttributes(@Nullable RequestAttributes attributes) {
		setRequestAttributes(attributes, false);
	}

	/**
	 * Bind the given RequestAttributes to the current thread.
	 * @param attributes the RequestAttributes to expose,
	 * or {@code null} to reset the thread-bound context
	 * @param inheritable whether to expose the RequestAttributes as inheritable
	 * for child threads (using an {@link InheritableThreadLocal})
	 */
	public static void setRequestAttributes(@Nullable RequestAttributes attributes, boolean inheritable) {
		if (attributes == null) {
			resetRequestAttributes();
		}
		else {
			if (inheritable) {
				inheritableRequestAttributesHolder.set(attributes);
				requestAttributesHolder.remove();
			}
			else {
				requestAttributesHolder.set(attributes);
				inheritableRequestAttributesHolder.remove();
			}
		}
	}

	/**
	 * Return the RequestAttributes currently bound to the thread.
	 * @return the RequestAttributes currently bound to the thread,
	 * or {@code null} if none bound
	 */
	@Nullable
	public static RequestAttributes getRequestAttributes() {
		RequestAttributes attributes = requestAttributesHolder.get();
		if (attributes == null) {
			attributes = inheritableRequestAttributesHolder.get();
		}
		return attributes;
	}

	/**
	 * Return the RequestAttributes currently bound to the thread.
	 * <p>Exposes the previously bound RequestAttributes instance, if any.
	 * Falls back to the current JSF FacesContext, if any.
	 * @return the RequestAttributes currently bound to the thread
	 * @throws IllegalStateException if no RequestAttributes object
	 * is bound to the current thread
	 * @see #setRequestAttributes
	 * @see ServletRequestAttributes
	 * @see FacesRequestAttributes
	 * @see javax.faces.context.FacesContext#getCurrentInstance()
	 */
	public static RequestAttributes currentRequestAttributes() throws IllegalStateException {
		RequestAttributes attributes = getRequestAttributes();
		if (attributes == null) {
			if (jsfPresent) {
				attributes = FacesRequestAttributesFactory.getFacesRequestAttributes();
			}
			if (attributes == null) {
				throw new IllegalStateException("No thread-bound request found: " +
						"Are you referring to request attributes outside of an actual web request, " +
						"or processing a request outside of the originally receiving thread? " +
						"If you are actually operating within a web request and still receive this message, " +
						"your code is probably running outside of DispatcherServlet: " +
						"In this case, use RequestContextListener or RequestContextFilter to expose the current request.");
			}
		}
		return attributes;
	}

}
```

Spring Boot 创建了 `RequestContextHolder` 工具类，这个工具类有两个类型为 `ThreadLocal<RequestAttributes>` 静态成员：

- `requestAttributesHolder` 请求属性持有者
- `inheritableRequestAttributesHolder` 可被子类继承的请求属性持有者

这个工具类提供了以下静态方法：

- `resetRequestAttributes` 初始化请求属性
- `setRequestAttributes` 设置请求属性
- `getRequestAttributes` 获得请求属性
- `currentRequestAttributes` 当前请求属性

观察该工具类，可以猜到 Spring Boot 在处理请求时，会通过某种方法 (具体方法后文再涉及) 将当前的请求通过 `setRequestAttributes` 存入  `requestAttributesHolder` 中。如果需要获取，就可以通过 `getRequestAttributes` 将当前请求取出。

那么 `setRequestAttributes` 的具体过程是什么呢？观察源码：

```java
	public static void setRequestAttributes(@Nullable RequestAttributes attributes) {
		setRequestAttributes(attributes, false);
	}

	public static void setRequestAttributes(@Nullable RequestAttributes attributes, boolean inheritable) {
		if (attributes == null) {
			resetRequestAttributes();
		}
		else {
			if (inheritable) {
				inheritableRequestAttributesHolder.set(attributes);
				requestAttributesHolder.remove();
			}
			else {
				requestAttributesHolder.set(attributes);
				inheritableRequestAttributesHolder.remove();
			}
		}
	}
```

如果 inheritable 为真，便将 `requestAtteributesHolder` 的内容清空，向 `inheritableRequestAttributesHolder` 中存入当前请求；

反之，将 `inheritableRequestAtteributesHolder` 内容清空，向 `requestAttributesHolder` 中存入当前请求。

说白了，`setRequestAttributes` 方法就是将当前请求存入了某个请求属性的持有容器中。

那么，请求属性持有容器的 set 方法又做了什么？

# ThreadLocal

请求属性持有容器是类型为 `ThreadLocal` 的静态成员，也就是说容器只有一个实例，所有的请求都会被放到这个容器中统一管理。

观察 `ThreadLocal` 的 set 方法的源码：

```java
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }
```

注意到，`ThreadLocal` 的 set 方法本质上是通过当前线程拿到 Map，将 `ThreadLocal` 作为 key，参数作为 value，存入 Map 中。

那么这个 Map 从哪里来，又属于谁呢？观察 `ThreadLocal` 的源码：

```java
    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }

    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }
```

`getMap` 本质是返回线程的 `threadLocals` 成员；

而 `createMap` 则是为该线程创建了一个 Map。

而 `threadLocals`，则是每一个 Thread 自带的成员变量，Thread 的源码：

```java
    /* ThreadLocal values pertaining to this thread. This map is maintained
     * by the ThreadLocal class. */
    ThreadLocal.ThreadLocalMap threadLocals = null;
```

到这里，我们就可以理清关系：

- 根据 Servlet 的机制，每一个 HTTP 请求拥有一个对应的 Thread
- 当某个请求被接收时，Spring Boot 通过某种方法调用了 `RequestContextHolder` 的静态方法 `setRequestAttributes`，向静态成员——请求属性接收容器 `ThreadLocal` 中存放当前的请求属性
- `ThreadLocal` 获取当前 Thread 的 `threadLocals` 成员，如果该成员为 null，则为其创建一个 Map，如果 Map 已经存在则不创建。之后以 `ThreadLocal`，也就是请求属性接收容器为 key，请求属性为 value，向 Map 中存放 k-v 对
- 每个 Thread 维护一个自己的成员 Map，而请求属性接收容器只有一个
- 调用 `getRequestAttributes` 静态方法时，则以请求属性接受容器为 key，在当前 Thread 维护的成员 Map 中，找到对应的 value 并返回，就可以拿到当前的请求属性

那么，这个 Map——`ThreadLocalMap` 又是如何实现的？

## ThreadLocalMap

观察源码：

```java
static class ThreadLocalMap {
    
	static class Entry extends WeakReference<ThreadLocal<?>> {

        Object value;

        Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }

        private static final int INITIAL_CAPACITY = 16;

        private Entry[] table;

        private int size = 0;

        private int threshold; // Default to 0

		...
            
	}
}
```

`ThreadLocalMap` 是 `ThreadLocal` 的静态内部类成员，其本质是一个存放 Entry 类型变量的数组。这个数组通过一定的方式——哈希散列，实现了 `HashMap` 的效果。

而 Entry 是一个弱引用，它拥有两个成员即 key 和 value。如果使用强引用，则线程结束之后 Entry 才会被回收，因此使用弱引用才能使 Entry 及时回收。

观察 `ThreadLocalMap` 的 set 方法：

```java
        private void set(ThreadLocal<?> key, Object value) {

            Entry[] tab = table;
            int len = tab.length;
            int i = key.threadLocalHashCode & (len-1);

            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) {
                ThreadLocal<?> k = e.get();

                if (k == key) {
                    e.value = value;
                    return;
                }

                if (k == null) {
                    replaceStaleEntry(key, value, i);
                    return;
                }
            }

            tab[i] = new Entry(key, value);
            int sz = ++size;
            if (!cleanSomeSlots(i, sz) && sz >= threshold)
                rehash();
        }
```

set 方法的步骤如下：

- 当前 `ThreadLocal` 的哈希值与 (表长度 - 1) 进行位运算 (相当于取模)，算得当前下标
- 如果当前下标存放了 Entry：

  - 如果 Entry 中的 key 与当前参数中的 key 一致，则修改 Entry 中的 value
  - 如果参数中的 key 为 null，则调用 `replaceStaleEntry` 方法，进行探测性的清理过期元素
  - 调用 `nextIndex` 方法获取新的下标，直到该下标没有存放 Entry
- 找到空的下标之后，向其中存入一个新的 Entry，并判断进行扩容

那么，`ThreadLocal` 的哈希值从哪里来？`nextIndex` 又做了什么？

观察源码：

```java
    private final int threadLocalHashCode = nextHashCode();

    private static AtomicInteger nextHashCode =
        new AtomicInteger();

    private static final int HASH_INCREMENT = 0x61c88647;

    private static int nextHashCode() {
        return nextHashCode.getAndAdd(HASH_INCREMENT);
    }
```

`ThreadLocal` 类中有一个静态常量 HASH_INCREMENT = 0x61c88647，这个值是斐波那契散列乘数，通过这个常数计算得到的下标的分布相当均匀。

每一个 `ThreadLocal` 实例创建时，其成员 `threadLocalHashCode` 即该 `ThreadLocal` 实例的哈希值，都会通过 静态方法 `nextHashCode` 生成；

`nextHashCode` 令静态变量 `nextHashCode` 增加一个斐波那契散列乘数后返回，`AtomicInteger` 是一个原子类型，其操作是原子操作，可以保证线程安全。

通过这样的方法，如果依次生成了 3 个 `ThreadLocal` 实例，他们对应的哈希值就是：

- 1 * `HASH_INCREMENT`
- 2 * `HASH_INCREMENT`
- 3 * `HASH_INCREMENT`

从而使得每个 `ThreadLocal` 实例拥有唯一的哈希值。

```java
        private static int nextIndex(int i, int len) {
            return ((i + 1 < len) ? i + 1 : 0);
        }
```

而 `nextIndex` 其实就是让下标 + 1，如果下标超出当前的长度就返回 0。

可以想象，`ThreadLocalMap` 的 get 方法其实就是通过当前 `ThreadLocal` 的哈希值取 (表长度 - 1) 取模算得下标，不断调用 `nextIndex` 方法直到当前下标存放的 Entry 中的 key 与参数中的 key 一致，则返回 value。

观察源码：

```java
        private Entry getEntry(ThreadLocal<?> key) {
            int i = key.threadLocalHashCode & (table.length - 1);
            Entry e = table[i];
            if (e != null && e.get() == key)
                return e;
            else
                return getEntryAfterMiss(key, i, e);
        }

        private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
            Entry[] tab = table;
            int len = tab.length;

            while (e != null) {
                ThreadLocal<?> k = e.get();
                if (k == key)
                    return e;
                if (k == null)
                    expungeStaleEntry(i);
                else
                    i = nextIndex(i, len);
                e = tab[i];
            }
            return null;
        
```

get 方法的步骤如下：

- 通过当前 `ThreadLocal` 和 (表长度 - 1) 取模计算得到下标

- 如果下标对应的 Entry 存放的 key 与 参数中的 key 一致，返回 value

- 如果不一致或不存在，调用 `getEntryAfterMiss` 方法

- `getEntryAfterMiss` 判断当前 Entry 是否为空

- 如果当前 Entry 不为空：

  - 如果存放的 key 与参数中的 key 一致，返回 value

  - 如果参数中的 key 为 null，调用 `expungeStaleEntry` 方法，清除脏 Entry

  - 如果上述条件不满足，调用 `nextIndex` 方法计算新的下标

- 通过新的下标取得当前 Entry，再次判断

# DispatcherServlet

最后，请求属性从何而来，Spring Boot 什么时候调用了 `RequestContextHolder` 工具类中的方法？

Spring MVC 的核心就是 `DispatcherServlet` 前置控制器，`DispatcherServlet` 实质也是一个 `HttpServlet`。`DispatcherSevlet` 负责将请求分发，所有的请求都有经过它来统一分发。

所有的请求都会经过 `DispatcherServlet`，而 `DispatcherServlet` 就会调用 `RequestContextHolder` 工具类中的方法，存放当前的请求。

`DispatcherServlet` 继承自 `FrameworkServlet` ，`FrameworkSerlvlet` 中的 `service`、`doGet`、`doPost`  等方法都调用了 `processRequest` 方法：

```java
	protected final void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		...

		initContextHolders(request, localeContext, requestAttributes);

		try {
			doService(request, response);
		}
		catch
            
		...
            
		finally {
			resetContextHolders(request, previousLocaleContext, previousAttributes);
            
            ...
                
		}
	}
```

`processRequest` 方法中调用 `initContextHolders` 方法，通过 `RequestContextHolder` 工具类向请求属性接收容器中存入请求属性：

```java
	private void initContextHolders(HttpServletRequest request,
			@Nullable LocaleContext localeContext, @Nullable RequestAttributes requestAttributes) {

		...
            
		if (requestAttributes != null) {
			RequestContextHolder.setRequestAttributes(requestAttributes, this.threadContextInheritable);
		}
	}
```

请求结束后调用 `resetContextHolders` 方法，通过 `RequestContextHolder` 工具类恢复之前的请求属性：

```java
	private void resetContextHolders(HttpServletRequest request,
			@Nullable LocaleContext prevLocaleContext, @Nullable RequestAttributes previousAttributes) {

		...
            
		RequestContextHolder.setRequestAttributes(previousAttributes, this.threadContextInheritable);
	}
```



这就是 `RequestContextHolder` 的全过程。 