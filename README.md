<div align="center">
<h1>react-pull-to-refreshify</h1>

<p>A simple react pull-to-refresh component with 0 dependencies. Its API design is similar to Ant Design Mobile, but it is more customizable and only 2kb after compression, suitable for both Mobile and Desktop.</p>

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

![自定义百分比动画](https://files.catbox.moe/n1vr31.gif)

English | [简体中文](./README-zh_CN.md)

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```bash
$ npm i react-pull-to-refreshify
# or
$ yarn add react-pull-to-refreshify
```

## Usage

```tsx
function renderText(pullStatus, percent) {
  switch (pullStatus) {
    case "pulling":
      return (
        <div>
          {`Pull down `}
          <span style={{ color: "green" }}>{`${percent.toFixed(0)}%`}</span>
        </div>
      );

    case "canRelease":
      return "Release";

    case "refreshing":
      return "Loading...";

    case "complete":
      return "Refresh succeed";

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

## Examples

- [Basic](https://codesandbox.io/s/shy-glade-gu7wfu)
- [Max Height](https://codesandbox.io/s/eager-mcnulty-i53syu)
- [Load more](https://codesandbox.io/s/mystifying-banach-07mccb)
- [animation 1](https://codesandbox.io/s/frosty-herschel-dxrn4e)
- [animation 2](https://codesandbox.io/s/confident-morning-9eug7v)

## Props

```ts
type PullStatus =
  | "normal"
  | "pulling"
  | "canRelease"
  | "refreshing"
  | "complete";
```

|       Name        |                           Type                           | Required |          Default           | Description                                                          |
| :---------------: | :------------------------------------------------------: | :------: | :------------------------: | -------------------------------------------------------------------- |
|    refreshing     |                         boolean                          |  false   |            true            | Whether to display the refreshing status                             |
|     onRefresh     |                        () => void                        |   true   |                            | Function called when Refresh Event has been trigerred                |
|    renderText     | (status: PullStatus, percent: number) => React.ReactNode |   true   |                            | Function called when Refresh Event has been trigerred                |
|   completeDelay   |                          number                          |  false   |            500             | The time for the delay to disappear after completion, the unit is ms |
| animationDuration |                          number                          |  false   |            300             | The time for animation duration, the unit is ms                      |
|    headHeight     |                          number                          |  false   |             50             | The height of the head prompt content area, the unit is px           |
|     threshold     |                          number                          |  false   | Consistent with headHeight | How far to pull down to trigger refresh, unit is px                  |
|   startDistance   |                          number                          |  false   |             30             | How far to start the pulling status, unit is px                      |
|    resistance     |                          number                          |  false   |            0.6             | Scale of difficulty to pull down                                     |
|     prefixCls     |                          string                          |  false   |     pull-to-refreshify     | prefix class                                                         |
|     disabled      |                         boolean                          |  false   |           false            | Whether the PullToRefresh is disabled                                |
|     className     |                          string                          |  false   |                            |                                                                      |
|       style       |                      CSSProperties                       |  false   |                            |                                                                      |
