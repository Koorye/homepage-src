---
title: 【Shiro 自学笔记六】Shiro 的默认缓存机制和 Redis 实现缓存
date: 2020-07-24 22:29:06
tags: [后端,安全,Shiro]
categories: 后端
description: 本文介绍了 Shiro 的默认缓存机制和 Redis 实现缓存。
---

上一期我们实现了登录验证，然而，每次登录 Shiro 都需要去查询一次数据库，而查询数据库是极其耗费资源的，因此，我们需要引入缓存来减小资源开支。

# Shiro 的登录验证机制

我们给 Service 层加入日志打印，再行测试：

```java
@Service
public class UserServiceImpl implements UserService {

  @Autowired
  private UserDao userDao;

  @Override
  public void save(User user) {
    System.out.println("[ INFO ] User " + user.getUsername() + " saved.");
    userDao.save(user);
  }

  @Override
  public User getUserByUsername(String username) {
    System.out.println("[ INFO ] User " + username + " was found.");
    return userDao.findByUsername(username);
  }
}

```

运行：

```shell
[ INFO ] User koorye was found.
[ INFO ] User koorye was found.
[ INFO ] User koorye was found.
```

结果发现，每刷新一次登录页面，Shiro 都会查询一次数据库，我们有必要使用缓存来减小开支。

# Shiro 的默认缓存机制

Shiro 默认使用 EhCache 完成缓存。

## 导入依赖

```xml
    <dependency>
      <groupId>org.apache.shiro</groupId>
      <artifactId>shiro-ehcache</artifactId>
      <version>1.5.3</version>
    </dependency>
```

## 配置 Realm

在配置类中修改 Realm 的配置，增加缓存管理器：

```java
  @Bean(name = "realm")
  public UserRealm userRealm() {
    HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
    matcher.setHashAlgorithmName("md5");
    matcher.setHashIterations(1024);

    UserRealm userRealm = new UserRealm();
    userRealm.setCredentialsMatcher(matcher);

    userRealm.setCacheManager(new EhCacheManager());  // 配置缓存管理器
    userRealm.setCachingEnabled(true);  // 启用全局缓存
    userRealm.setAuthenticationCachingEnabled(true);  // 启用登录验证缓存
    userRealm.setAuthorizationCachingEnabled(true);  // 启用授权认证缓存
    userRealm.setAuthenticationCacheName("authentication_cache");  // 为登录验证缓存命名
    userRealm.setAuthorizationCacheName("authorization_cache");  // 为授权认证缓存命名

    return userRealm;
  }
```

到这里 Shiro 的缓存就配置完成，非常简单。

我们来测试一下：

```shell
[ INFO ] User koorye was found.
```

无论登录页面刷新多少次，除了第一次需要访问数据库之外，只要用户没有登出，其余登录操作只需访问缓存，而不用访问数据库。

# Redis 实现缓存

EhCache 可以非常容易的实现 Shiro 缓存，然而它存在一些缺陷，比如不能持久化、数据不容易查看等。

因此，将 EhCache 换成 Redis 是一种很好的方案。

## 导入依赖

```xml
    <!-- Spring Data Redis -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
```

## 修改配置

如果你的 Redis 设有密码，需要配置密码：

```properties
spring.redis.port=6379
spring.redis.password=root
spring.redis.database=0
```

## 配置 Redis 序列化

新建一个 RedisConfig 配置类：

```java
package org.koorye.config;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@AutoConfigureAfter(ShiroLifecycleBeanPostProcessorConfig.class)
public class RedisConfig {
  @Bean(name = "redis")
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(redisConnectionFactory);

    redisTemplate.setKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashKeySerializer(new StringRedisSerializer());

    return redisTemplate;
  }
}
```

Key 使用字符串序列化，Value 不配置，代表默认序列化。

要实现默认序列化，我们需要继承序列化 Serializable 接口：

```java
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@Entity
@Table(name = "t_user")
public class User implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private int id;

  @Column(name = "username")
  private String username;

  @Column(name = "password")
  private String password;

  @Override
  public String toString() {
    return "ID: " + id + ", username: " + username + ", password: " + password;
  }
}

```

同时，Shiro 的盐并不具有序列化功能，我们需要重新写一个盐。

复制 SimpleByteSource 的所有代码，修改类名，并继承序列化接口。

```java
package org.koorye.component;

import java.io.File;
import java.io.InputStream;
import java.io.Serializable;
import java.util.Arrays;
import org.apache.shiro.codec.Base64;
import org.apache.shiro.codec.CodecSupport;
import org.apache.shiro.codec.Hex;
import org.apache.shiro.util.ByteSource;

public class SerializableByteSource implements ByteSource, Serializable {
  private final byte[] bytes;
  private String cachedHex;
  private String cachedBase64;

  public SerializableByteSource(byte[] bytes) {
    this.bytes = bytes;
  }

  public SerializableByteSource(char[] chars) {
    this.bytes = CodecSupport.toBytes(chars);
  }

  public SerializableByteSource(String string) {
    this.bytes = CodecSupport.toBytes(string);
  }

  public SerializableByteSource(ByteSource source) {
    this.bytes = source.getBytes();
  }

  public SerializableByteSource(File file) {
    this.bytes = (new SerializableByteSource.BytesHelper()).getBytes(file);
  }

  public SerializableByteSource(InputStream stream) {
    this.bytes = (new SerializableByteSource.BytesHelper()).getBytes(stream);
  }

  public static boolean isCompatible(Object o) {
    return o instanceof byte[] || o instanceof char[] || o instanceof String || o instanceof ByteSource || o instanceof File || o instanceof InputStream;
  }

  public byte[] getBytes() {
    return this.bytes;
  }

  public boolean isEmpty() {
    return this.bytes == null || this.bytes.length == 0;
  }

  public String toHex() {
    if (this.cachedHex == null) {
      this.cachedHex = Hex.encodeToString(this.getBytes());
    }

    return this.cachedHex;
  }

  public String toBase64() {
    if (this.cachedBase64 == null) {
      this.cachedBase64 = Base64.encodeToString(this.getBytes());
    }

    return this.cachedBase64;
  }

  public String toString() {
    return this.toBase64();
  }

  public int hashCode() {
    return this.bytes != null && this.bytes.length != 0 ? Arrays.hashCode(this.bytes) : 0;
  }

  public boolean equals(Object o) {
    if (o == this) {
      return true;
    } else if (o instanceof ByteSource) {
      ByteSource bs = (ByteSource)o;
      return Arrays.equals(this.getBytes(), bs.getBytes());
    } else {
      return false;
    }
  }

  private static final class BytesHelper extends CodecSupport {
    private BytesHelper() {
    }

    public byte[] getBytes(File file) {
      return this.toBytes(file);
    }

    public byte[] getBytes(InputStream stream) {
      return this.toBytes(stream);
    }
  }
}
```

于是我们的 Realm 加盐可以更换成：

```java
return new SimpleAuthenticationInfo(
  authenticationToken.getPrincipal(),
  user.getPassword(),
  new SerializableByteSource("koorye_love_md5"),
  this.getName());
```

## 编写 Service 层

首先来实现一些 Redis 的功能。

接口：

```java
package org.koorye.service;

import java.util.Collection;
import java.util.Set;

public interface RedisService {
  void putHash(String hashName, String key, Object value);

  Object getHashValueByKey(String hashName, String key);

  void removeHashKey(String hashName, String key);

  void removeHash(String hashName);

  int sizeHash(String hashName);

  Set<Object> keysHash(String hashName);

  Collection<Object> valuesHash(String hashName);
}
```

实现类：

```java
package org.koorye.service;

import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.Set;

@Service
@Lazy
public class RedisServiceImpl implements RedisService {
  @Resource(name = "redis")
  private RedisTemplate<String, Object> redisTemplate;

  @Override
  public void putHash(String hashName, String key, Object value) {
    redisTemplate.opsForHash().put(hashName, key, value);
  }

  @Override
  public Object getHashValueByKey(String hashName, String key) {
    return redisTemplate.opsForHash().get(hashName, key);
  }

  @Override
  public void removeHashKey(String hashName, String key) {
    redisTemplate.opsForHash().delete(hashName, key);
  }

  @Override
  public void removeHash(String hashName) {
    redisTemplate.delete(hashName);
  }

  @Override
  public int sizeHash(String hashName) {
    return redisTemplate.opsForHash().size(hashName).intValue();
  }

  @Override
  public Set<Object> keysHash(String hashName) {
    return redisTemplate.opsForHash().keys(hashName);
  }

  @Override
  public Collection<Object> valuesHash(String hashName) {
    return redisTemplate.opsForHash().values(hashName);
  }
}
```

## 配置 Redis 缓存

我们自定义的缓存需要实现 Shiro 提供的 `Cache<K, V>` 接口。

我们来实现一个无参构造和有参构造，并通过 RedisTemplate 实现缓存的 CRUD 操作，存储时采用哈希表。

- 表名：缓存的名字
- 键：缓存的用户名
- 值：缓存的信息

为什么需要一个参数为 String 的有参构造呢？这里的配置我们稍后可以看到：

```java
package org.koorye.component;

import lombok.Getter;
import lombok.Setter;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.koorye.service.RedisServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Set;

@Repository
@SuppressWarnings(value = "unchecked")
@Getter
@Setter
public class RedisCache<K, V> implements Cache<K, V> {
  @Autowired
  private RedisServiceImpl redisService;

  private String cacheName;

  @Override
  public V get(K k) throws CacheException {
    return (V) redisService.getHashValueByKey(cacheName, k.toString());
  }

  @Override
  public V put(K k, V v) throws CacheException {
    redisService.putHash(cacheName, k.toString(), v);
    return v;
  }

  @Override
  public V remove(K k) throws CacheException {
    V value = (V) redisService.getHashValueByKey(cacheName, k.toString());
    redisService.removeHashKey(cacheName, k.toString());
    return value;
  }

  @Override
  public void clear() throws CacheException {
    redisService.removeHash(cacheName);
  }

  @Override
  public int size() {
    return redisService.sizeHash(cacheName);
  }

  @Override
  public Set<K> keys() {
    return (Set<K>) redisService.keysHash(cacheName);
  }

  @Override
  public Collection<V> values() {
    return (Collection<V>) redisService.valuesHash(cacheName);
  }
}
```

## 配置 Redis 缓存管理器

接下来自定义 Redis 缓存管理器，实现 CacheManager 接口，注意到，这个接口的实现重写了一个 getCache 方法，而这个方法的参数其实就是缓存的名字。因此我们在构造缓存时将字符串传入：

```java
package org.koorye.component;

import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.apache.shiro.cache.CacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RedisCacheManager implements CacheManager {
  @Autowired
  private RedisCache<Object, Object> redisCache;

  @Override
  public <K, V> Cache<K, V> getCache(String s) throws CacheException {
    redisCache.setCacheName(s);
    return (Cache<K, V>) redisCache;
  }
}
```

## 修改 Shiro 配置类

由于使用了 Autowired 自动注入，我们不能再 new 的方式得到对象，需要交予 Spring 容器管理。

```java
  @Autowired
  private RedisCacheManager redisCacheManager;

  @Bean(name = "realm")
  public UserRealm userRealm() {
    HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
    matcher.setHashAlgorithmName("md5");
    matcher.setHashIterations(1024);

    UserRealm userRealm = new UserRealm();
    userRealm.setCredentialsMatcher(matcher);

    userRealm.setCacheManager(redisCacheManager);
    userRealm.setCachingEnabled(true);
    userRealm.setAuthenticationCachingEnabled(true);
    userRealm.setAuthorizationCachingEnabled(true);
    userRealm.setAuthenticationCacheName("authentication_cache");
    userRealm.setAuthorizationCacheName("authorization_cache");

    return userRealm;
  }
```

## 测试

尝试访问  [http://localhost:8080/api/login?username=koorye&password=123456](http://localhost:8080/api/login?username=koorye&password=123456)：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/937fbf9cf2df3734609da8ab2a921a20.png)


多次访问之后：

```shell
[ INFO ] User koorye was found.
```

只查表一次，说明记录被缓存。