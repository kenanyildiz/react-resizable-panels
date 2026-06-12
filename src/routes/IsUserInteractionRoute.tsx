import { useState } from "react";
import { Box, Callout, Code, Header } from "react-lib-tools";
import type { Layout } from "react-resizable-panels";
import { html as ComponentExampleHTML } from "../../public/generated/examples/IsUserInteraction.json";
import { Group } from "../components/styled-panels/Group";
import { Panel } from "../components/styled-panels/Panel";
import { Separator } from "../components/styled-panels/Separator";

type LastEvent = {
  isUserInteraction: boolean;
  layout: Layout;
};

export default function IsUserInteractionRoute() {
  const [event, setEvent] = useState<LastEvent | null>(null);

  return (
    <Box direction="column" gap={4}>
      <Header
        section="Examples"
        sourceCodePath="lib/components/group/Group.tsx"
        title="onLayoutChanged: isUserInteraction"
      />
      <div>
        The <code>onLayoutChanged</code> callback receives a second argument,{" "}
        <code>isUserInteraction: boolean</code>, that is <code>true</code> only
        when the user has just released a pointer drag on a separator. Every
        other source of a layout change — initial mount, programmatic{" "}
        <code>setLayout</code>, a parent re-render that supplies new{" "}
        <code>defaultSize</code> props, or a <code>minSize</code> /{" "}
        <code>maxSize</code> constraint clamp caused by a container width
        change — arrives with <code>isUserInteraction === false</code>.
      </div>
      <div>
        The flag is useful when persisting layouts to a shared backend (for
        example, multi-user page configurations): only changes triggered by
        genuine user input should mutate the canonical record. A per-user
        constraint clamp on a narrow viewport should not leak into the shared
        layout that every other user inherits.
      </div>
      <Code html={ComponentExampleHTML} />
      <Group
        className="h-15"
        onLayoutChanged={(layout, isUserInteraction) => {
          setEvent({ isUserInteraction, layout });
        }}
      >
        <Panel id="left" minSize="200px" showSizeInPixels>
          left
        </Panel>
        <Separator />
        <Panel id="right" showSizeInPixels>
          right
        </Panel>
      </Group>
      <div className="text-lg font-bold">Last event</div>
      <Box direction="column" gap={2}>
        <Box direction="row" gap={2}>
          <span className="font-mono text-sm w-48">isUserInteraction:</span>
          <code>
            {event === null
              ? "(no event yet)"
              : event.isUserInteraction
                ? "true"
                : "false"}
          </code>
        </Box>
        <Box direction="row" gap={2}>
          <span className="font-mono text-sm w-48">layout:</span>
          <code>
            {event === null ? "(no event yet)" : JSON.stringify(event.layout)}
          </code>
        </Box>
      </Box>
      <Callout intent="primary">
        Try the following:
        <ul className="pl-8 mt-1 mb-1">
          <li className="list-disc">
            Drag the separator above to a new position →{" "}
            <code>isUserInteraction === true</code>
          </li>
          <li className="list-disc">
            Resize the browser window until the left panel hits its{" "}
            <code>minSize="200px"</code> constraint → the layout changes but{" "}
            <code>isUserInteraction === false</code>
          </li>
          <li className="list-disc">
            Reload the page → the mount-time fire arrives with{" "}
            <code>isUserInteraction === false</code>
          </li>
        </ul>
      </Callout>
      <Callout intent="warning">
        Pixel-based <code>minSize</code> / <code>maxSize</code> constraints are
        absolute, so any container shrink below the sum of pixel minimums
        forces a clamp. Percentage-based constraints scale with the container
        and remain satisfied across width changes, so they rarely trigger this
        path.
      </Callout>
    </Box>
  );
}
