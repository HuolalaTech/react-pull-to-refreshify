# react-pull-to-refreshify

A simple pull-to-refresh component with zero dependencies on React components, inspired by Ant Design Mobile's api design, but with more apis, only 2kb after compression, suitable for mobile phones and computers.

English | [简体中文](./README-zh_CN.md)

## Usage

```tsx
function renderText(pullStatus, percent) {
  switch (pullStatus) {
    case PULL_STATUS.pulling:
      return (
        <div>
          {`Pull down `}
          <span style={{ color: "green" }}>{`${percent.toFixed(0)}%`}</span>
        </div>
      );

    case PULL_STATUS.canRelease:
      return `Release`;

    case PULL_STATUS.refreshing:
      return "Loading...";

    case PULL_STATUS.complete:
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

<PullRefreshify
  refreshing={refreshing}
  onRefresh={handleRefresh}
  renderText={renderText}
>
  {list.map((item, i) => (
    <div key={item.id}>{item}</div>
  ))}
</PullRefreshify>;
```

## Examples

- [Basic](https://codesandbox.io/s/shy-glade-gu7wfu)
- [Load more](https://codesandbox.io/s/mystifying-banach-07mccb)
- [Percentage animation](https://codesandbox.io/s/frosty-herschel-dxrn4e?file=/src/App.tsx)

## Props

```ts
enum PULL_STATUS {
  normal,
  pulling,
  canRelease,
  refreshing,
  complete,
}
```

|       Name        |                           Type                            | Required |          Default           | Description                                                          |
| :---------------: | :-------------------------------------------------------: | :------: | :------------------------: | -------------------------------------------------------------------- |
|    refreshing     |                          boolean                          |  false   |            true            | Whether to display the refreshing status                             |
|     onRefresh     |                        () => void                         |   true   |                            | Function called when Refresh Event has been trigerred                |
|    renderText     | (status: PULL_STATUS, percent: number) => React.ReactNode |   true   |                            | Function called when Refresh Event has been trigerred                |
|   completeDelay   |                          number                           |  false   |            500             | The time for the delay to disappear after completion, the unit is ms |
| animationDuration |                          number                           |  false   |            300             | The time for animation duration, the unit is ms                      |
|    headHeight     |                          number                           |  false   |             50             | The height of the head prompt content area, the unit is px           |
|     threshold     |                          number                           |  false   | Consistent with headHeight | How far to pull down to trigger refresh, unit is px                  |
|   startDistance   |                          number                           |  false   |             30             | How far to start the pulling status, unit is px                      |
|     disabled      |                          boolean                          |  false   |           false            | Whether the PullToRefresh is disabled                                |
|     className     |                          string                           |  false   |                            |                                                                      |
|       style       |                       CSSProperties                       |  false   |                            |                                                                      |
