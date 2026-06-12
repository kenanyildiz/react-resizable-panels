import { Group, Panel, Separator } from "react-resizable-panels";

// <begin>

/* prettier-ignore */
<Group
  onLayoutChanged={(layout, isUserInteraction) => {
    // `isUserInteraction` is true only when the user has just
    // finished dragging a separator. It is false for every other
    // source: initial mount, programmatic setLayout, parent re-render,
    // or a min/max size constraint clamp caused by a container
    // width change. Gate persistence on this flag so per-user
    // viewport adjustments are not written back to shared state.
    if (isUserInteraction) {
      console.log("User finished dragging:", layout);
    } else {
      console.log("Library-driven change (skipped):", layout);
    }
  }}
>
  <Panel id="left" minSize="200px">left</Panel>
  <Separator />
  <Panel id="right">right</Panel>
</Group>
