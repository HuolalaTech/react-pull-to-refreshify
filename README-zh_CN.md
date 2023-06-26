<div align="center">
<h1>react-pull-to-refreshify</h1>

<p>一个简单的下拉刷新组件，具有 0 依赖性。它的 API 设计类似于 Ant Design Mobile，但可定制化程度更高，压缩后只有 2kb，适用于手机端和电脑端。</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-pull-to-refreshify"><img src="https://badgen.net/npm/v/react-pull-to-refreshify" alt="Latest published version" target="\_parent"></a>
  <a href="https://unpkg.com/browse/react-pull-to-refreshify@latest/dist/index.umd.cjs" rel="nofollow"><img src="https://img.badgesize.io/https:/unpkg.com/react-pull-to-refreshify@latest/dist/index.umd.cjs?label=gzip%20size&compression=gzip" alt="gzip size"></a>
  <a href="https://github.com/HuolalaTech/react-pull-to-refreshify"><img src="https://badgen.net/npm/types/react-pull-to-refreshify" alt="Types included" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-pull-to-refreshify"><img src="https://badgen.net/npm/license/react-pull-to-refreshify" alt="License" target="\_parent"></a>
  <!-- <a href="https://www.npmjs.com/package/react-pull-to-refreshify"><img src="https://badgen.net/npm/dt/react-pull-to-refreshify" alt="Number of downloads" target="\_parent"></a>
  <a href="https://github.com/HuolalaTech/react-pull-to-refreshify"><img src="https://img.shields.io/github/stars/HuolalaTech/react-pull-to-refreshify.svg?style=social&amp;label=Star" alt="GitHub Stars" target="\_parent"></a> -->
</p>
</div>

---

![自定义百分比动画](https://files.catbox.moe/j0h1xg.gif)

[English](./README.md) | 简体中文

## 安装

该模块通过 [npm][npm] 分发，与 [node][node] 捆绑在一起
应作为项目的“依赖项”之一安装：

```bash
$ npm i react-query-kit
# or
$ yarn add react-query-kit
```

## 使用

```tsx
function renderText(pullStatus, percent) {
  switch (pullStatus) {
    case "pulling":
      return (
        <div>
          {`下拉即可刷新 `}
          <span style={{ color: "green" }}>{`${percent.toFixed(0)}%`}</span>
        </div>
      );

    case "canRelease":
      return "释放即可刷新...";

    case "refreshing":
      return "刷新中";

    case "complete":
      return "刷新成功";

    default:
      return "";
  }
}

const [refreshing, setRefreshing] = useState(false);

function handleRefresh() {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false);
  }, 2000);
}

<PullToRefreshify
  refreshing={refreshing}
  onRefresh={handleRefresh}
  renderText={renderText}
>
  {list.map((item, i) => (
    <div key={item.id}>{item}</div>
  ))}
</PullToRefreshify>;
```

## 例子

- [基础](https://codesandbox.io/s/shy-glade-gu7wfu)
- [最大高度](https://codesandbox.io/s/eager-mcnulty-i53syu)
- [加载更多](https://codesandbox.io/s/mystifying-banach-07mccb)
- [动画 1](https://codesandbox.io/s/frosty-herschel-dxrn4e)
- [动画 2](https://codesandbox.io/s/confident-morning-9eug7v)

## Props

```ts
type PullStatus =
  | "normal"
  | "pulling"
  | "canRelease"
  | "refreshing"
  | "complete";
```

|       Name        |                           Type                           | Required |      Default       | Description                      |
| :---------------: | :------------------------------------------------------: | :------: | :----------------: | -------------------------------- |
|    refreshing     |                         boolean                          |  false   |        true        | 是否显示刷新状态                 |
|     onRefresh     |                        () => void                        |   true   |                    | 触发刷新时的处理函数             |
|    renderText     | (status: PullStatus, percent: number) => React.ReactNode |   true   |                    | 根据下拉状态，自定义下拉提示文案 |
|   completeDelay   |                          number                          |  false   |        500         | 刷新完成提示展示时长(ms)         |
| animationDuration |                          number                          |  false   |        300         | 动画执行时间(ms)                 |
|    headHeight     |                          number                          |  false   |         50         | 顶部内容高度                     |
|     threshold     |                          number                          |  false   | 与 headHeight 一致 | 触发下拉刷新的距离               |
|   startDistance   |                          number                          |  false   |         30         | 助跑距离                         |
|    resistance     |                          number                          |  false   |        0.6         | 拉动难度                         |
|     prefixCls     |                          string                          |  false   | pull-to-refreshify | 前缀类名                         |
|     disabled      |                         boolean                          |  false   |       false        | 是否禁用下拉刷新                 |
|     className     |                          string                          |  false   |                    |                                  |
|       style       |                      CSSProperties                       |  false   |                    |                                  |
