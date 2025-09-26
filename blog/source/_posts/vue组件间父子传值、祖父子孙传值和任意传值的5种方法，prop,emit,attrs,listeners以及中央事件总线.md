---
title: vue组件间父子传值、祖父子孙传值和任意传值的5种方法，prop,emit,attrs,listeners以及中央事件总线
date: 2020-05-08 22:54:02
tags: [前端,Vue]
categories: 前端
description: 本文介绍了vue组件间父子传值、祖父子孙传值和任意传值的5种方法，分别是prop,emit,attrs,listeners以及中央事件总线。
---

笔者今天自学vue组件间的传值时非常混乱，故在此整理一下。

# 父子传值
## prop: 父向子传值
步骤：

- 在子部件标签中加入自定义属性：
`<Son :fatherMsg="msg"/>`
- 在子部件中添加props数组：
`props:['fatherMsg']`
```js
let Son={
  props:['fatherMsg'],
  template: `
    <div>
    <h2 class="display-4 text-secondary">This is Son</h2>
    <p class="text-danger">{{fatherMsg}}</p>
    </div>`
};

let Father = new Vue({
  el:'#app',
  data(){
    return{
      msg:'A message from father.'
    }
  },
  components:{
    Son
  },
  template:`
    <div>
      <h2 class="display-4 text-primary">This is Father</h2>
      <Son :fatherMsg="msg"/>
    </div>`
});
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e5ab82f0b12c3c68ec8cca528cc76c0e.png)
## $emit：子向父传值
子传父与父传子略有不同，依赖于事件，我们定义一个按钮用于触发事件。

步骤：
- 准备发送数据的方法
`methods: {sendMsg(){this.$emit('sendMsgFromSon',this.msg);}},`
- 准备一个触发事件的对象并指定发送数据的方法（如button)
`<button class="btn btn-success" @click="sendMsg">Send</button>`
- 预留一个接收数据的参数
`sonMsg: 'Message does not arrive.'`
- 准备接收数据的方法并修改参数
`methods: {getMsg(resp) {this.sonMsg = resp;}},`
- 在子部件中加入自定义属性接收数据并指定接收数据的方法
`<Son @sendMsgFromSon="getMsg"/>`
```js
  let Son = {
    data() {
      return {
        msg: 'A message from son.'
      }
    },
    methods: {
      sendMsg() {
        this.$emit('sendMsgFromSon', this.msg);
      }
    },
    template: `
      <div>
      <h2 class="display-4 text-secondary">This is Son</h2>
      <button class="btn btn-success" @click="sendMsg">Send</button>
      </div>`,
  };

  let Father = new Vue({
    el: '#app',
    data() {
      return {
        sonMsg: 'Message does not arrive.'
      }
    },
    components: {
      Son
    },
    methods: {
      getMsg(resp) {
        this.sonMsg = resp;
      }
    },
    template: `
      <div>
        <h2 class="display-4 text-primary">This is Father</h2>
        <p class="text-danger">{{sonMsg}}</p>
        <Son @sendMsgFromSon="getMsg"/>
      </div>`
  });
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ec8c56384a082d91c620b87f8d573fc9.png)

----

# 祖父子孙传值
有了父子传递的经验，那么多层传递是否也可以用多个prop和emit实现呢？

当然可以，不过这显得太麻烦了。于是，vue2.4推出了`$attrs`和`$listeners`帮我们解决了这个问题。

## $attrs: 祖父向子孙传值
不然发现，此处的Father和prop例子中的完全相同，Grandson也与Son除名字外完全相同，唯一的区别是多了中间组件。

关键步骤：

- 中间组件中添加子孙组件为子组件
`components:{Grandson},`
- 使用`v-bind`为子组件绑定`$attrs`
`<Grandson v-bind="$attrs"/>`
```js
let Grandson = {
  props: ['fatherMsg'],
  template: `
    <div>
      <h2 class="display-4 text-success">This is Grandson</h2>
      <p class="text-danger">{{fatherMsg}}</p>
  </div>`
};

let Son = ({
  components: {
    Grandson
   },
  template: `
    <div>
      <h2 class="display-4 text-secondary">This is Son</h2>
      <Grandson v-bind="$attrs"/>
    </div>`
});

let Father = new Vue({
  el: '#app',
  data() {
    return {
      msg: 'A message from father.'
    }
  },
  components: {   
    Son
  },
  template: `
    <div>
      <h2 class = "display-4 text-primary"> This is Father </h2>
      <Son :fatherMsg="msg"/>
    </div>`
});
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/4c876377bc32b2fab7d807f00b2047b7.png)
## $listeners:  子孙向祖父传值
有了祖父传子孙的经验，子孙传祖父也大同小异，只需在子传父的基础上添加即可：

- 为中间组件添加子孙组件为子组件
`components:{Grandson},`
- 使用`v-on`为子组件绑定`$listeners`
`<Grandson v-on="$listeners">`

```js
let Grandson = {
   data() {
    return {
      msg: 'A message from Grandson.'
    }
  },
  methods: {
    sendMsg() {
      this.$emit('sendMsgFromGrandson', this.msg);
    }
  },
  template: `
    <div>
    <h2 class="display-4 text-success">This is Grandson</h2>
    <button class="btn btn-success" @click="sendMsg">Send</button>
    </div>`,
};

let Son = {
  components: {
    Grandson
  },
  template: `
  <div>
  <h2 class="display-4 text-secondary">This is Son</h2>
  <Grandson v-on="$listeners"/>
  </div>`
};

let Father = new Vue({
  el: '#app',
  data() {
    return {
       grandsonMsg: 'Message does not arrive.'
    }
  },
  components: {
    Son
  },
  methods: {
    getMsg(resp) {
      this.grandsonMsg = resp;
    }
  },
  template: `
    <div>
      <h2 class="display-4 text-primary">This is Father</h2>
      <p class="text-danger">{{grandsonMsg}}</p>
      <Son @sendMsgFromGrandson="getMsg"/>
   </div>`
});
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/089994577aa3e9837e60700da543471d.png)
----

# 任意传值
## 中央事件总线：任意组件间传值
最后的方法叫做中央事件总线，它可以实现任意组件的传值，无论是父子、祖父子孙、还是兄弟。

这里我们创建了一个全局的bus，这个bus就像一个接线员，接收一个数据，再发送给别的组件。

步骤：

- 声明一个全局的Vue作为总线
`let bus = new Vue();`
- 为发送数据的组件添加方法，使用`bus.$emit`发送
`methods:{sendMsg(){bus.$emit('msgFromComponent1', this.msg);}},`
- 为发送数据的组件提供事件触发方法（此处使用按钮）：
`<button class="btn btn-success" @click="sendMsg">Send</button>`
- 为接收的数据预留槽位
`data(){return{msg: 'Message does not arrive.'}},`
- 为接收数据的组件提供方法，使用`bus.$on`接收（此处使用`mounted`，意味着数据改变就调用方法，从而实现同步更新）
  `mounted() {bus.$on('msgFromComponent1', (resp) => {this.msg = resp;})},`

```js
let bus = new Vue();

let Component1 = new Vue({
  el: '#app',
  data() {
    return {
      msg: 'A message from component1.'
    }
  },
  methods: {
    sendMsg() {
      bus.$emit('msgFromComponent1', this.msg);
    }
  },
  template: `
    <div>
      <h2 class="display-4 text-primary">This is Component1</h2>
      <button class="btn btn-success" @click="sendMsg">Send</button>
    </div>`
});

let Component2 = new Vue({
  el: '#app2',
  data() {
    return {
      msg: 'Message does not arrive.'
    }
  },
  mounted() {
    bus.$on('msgFromComponent1', (resp) => {
      this.msg = resp;
    })
  },
  template: `
   <div>
     <h2 class="display-4 text-secondary">This is Component2</h2>
     <p class="text-danger">{{msg}}</p>
   </div>`
})
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/db31b65b40e6130089eb159154aac7da.png)
以上5种方法讲解完成，除此之外，还有`provided` / `inject`和`$parent` / `$children[index]`等方法，不过不太常用，大家可以自行了解。