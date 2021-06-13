# ryder-bridge

- [ryder-bridge](#ryder-bridge)
  - [Overview](#overview)
  - [Ryder Bridge Spec](#ryder-bridge-spec)
  - [Contributing](#contributing)
  - [Want to Get Involved? New here?](#want-to-get-involved-new-here)

The main mission of the `ryder-bridge` is to expose the Ryder Device to the [Stacks Wallet Browser Extension].

We want to be able to hook into and communicate with the [`ryderserial-proto`] through a locally hosted WebSocket.

The `ryder-bridge` will function as a temporary (and somewhat narrowly-scoped) solution to a larger responsibility: interfacing with the Ryder by way of the web (and vice versa!).\
Eventually, we will archive this bridge in favor of a more robust Web USB API.

For now, though, we want to kick off the process of securing digital assets on the web by providing a fairly low-level (but easy-to-use) API that can connect to the [Stacks Wallet Browser Extension].\
Abstraction is not the mission of this codebase. Note, though, that there is a thin line between low-level and security risk. As such, we will aim to expose as much of the Ryder as we can without over-exposing it.

For the sake of clarity, the rest of this `README` will focus on what `ryder-bridge` aims to implement NOW, rather than what we hope to accomplish long-term with Ryder x Web. That said, if you have ideas, questions, or any feedback RE: **Ryder x Web**, we'd love to hear them in the [Ryder Discord].

## Overview

There are two main aspects to the `ryder-bridge`, just as there are two entry-points to every bridge. One is the Ryder Device, naturally. And the other is the web extension.
We will be focused on implementing a bridge that specifically connects to the Stacks Web Extension: [The Stacks Wallet Web]. I've been told it was once called "connect".

<!-- markdownlint-disable MD033 -->
<div align="center">
Ryder Device
&#10231;
Ryder Bridge
&#10231;
Stacks Web Extension
</div>
<br>
<!-- markdownlint-enable MD037 -->

Naturally, putting this Ryder Bridge into effect is going to require some code in the Stacks Web Extension which is why you'll find a [forked version under the Light-Labs organization](https://github.com/Light-Labs/stacks-wallet-web). A bridge isn't worth much if it's not hooked up to the other side of the river.\
The main priority is getting something up and running. Growth and adaption will come later, along with adding more and more features to the bridge.\
As such, the first push of this repository will be getting that web socket server up and running, and hooking it up to the Web Extension.

## Ryder Bridge Spec

> **NOTE:** This spec itself is a work in progress — additions or refinements are more than welcome. Get in touch on the Ryder Discord, or open a new issue so we can discuss!

- Features / Capabilities
  - **Now:** expose the API through HTTP with WebSocket on chosen port
  - **Now:** The Stacks Web Extension should be able to communicate with the Ryder through the socket API directly
  - **Now:** Sign In / Sign Up — We're prioritizing the ability to sign in or sign up through the Ryder. This will be the highest priority as far as features are concerned. Pretty much everything under this bullet point is a "save for later" feature
  - **Now:** (Low Priority) Bridge should only respond to Stacks Web Extension specifically (if this is even possible). If this is attainable, we'll do it—if not, we'll drop it
- RyderSerial Commands to Expose
  - **NOTE — DO NOT EXPOSE `RyderSerial.send` DIRECTLY.**
  - Future: RyderSerial Command: Info/Version
  - Future: RyderSerial Command: Export
    - Identity
    - Owner Key
    - App Key
  - Future: RyderSerial Command: Wake
  - Future: RyderSerial Command: Set Up
  - Future: RyderSerial Command: Restore
    - From Seed
    - From Mnemonic
  - Future: RyderSerial Command: Firmware
    - Fetch
    - Download (args: version X.Y.Z)
    - List
    - Install (args: version X.Y.Z)
    - Version
  - Future: allow access to apps through Ryder.
    - some apps challenge identity with series of keywords
    - in the future, Ryder may have the ability to store that challenge

## Contributing

We're eager to grow a community of open-source contributors and maintainers who can help the Ryder Ecosystem grow in capability, code-quality, and overall utility.

The contributing flow for the `ryder-bridge` is as follows:

- Fork and clone this repository to your own account
- Look for any open issues—if there's one that grabs your eye, claim it by commenting in that issue's discussion
- Create a branch on your forked version with the naming convention `<first-name>/<feature-name>` (like `marvin/update-readme`)
- Open a Pull Request and request a review from a fellow Pioneer
- Squash and merge is preferred

Additionally, **feel free to open up a new issue** if you find a problem or have an idea for a feature/enhancement that would add to the project!

## Want to Get Involved? New here?

Great! This is a fun project to hack on because it's early on in its life. It's a good way to get acquainted with the Ryder codebases, interacting with the Ryder device, and Node.js and TypeScript!

We're eager to grow a community of open-source contributors and maintainers who can help the Ryder Ecosystem grow in capability, code-quality, and overall utility.

If you're interested — there's a couple of ways you can get involved:

1. Get in touch with us in the Ryder Discord. We would love to meet you!
2. See an issue in the code or a feature that you think would be worthwhile? Great, open up a new issue and we'll figure out how to approach it together!
3. Check out the following repositories and see if any of the open issues interest you. If so, go ahead and comment in that issue's discussion to claim it and follow the Contributing Guidelines for that repository.
   - The `ryderserial-proto` — A library to facilitate communications between an application and Ryder device
   - The `ryder-bridge` — (This repo!) A WebSocket API to facilitate communications between The Stacks Wallet Web Extension and the Ryder Device!
   - The `ryder-cli-proto` — A basic command-line interface to manage Ryder prototype devices.

<!-- DO NOT DELETE -->
<!-- start:links-reference -->

[the web extension]: https://github.com/Light-Labs/stacks-wallet-web
[the stacks wallet web]: https://github.com/Light-Labs/stacks-wallet-web
[Stacks Wallet Web Extension]: https://github.com/Light-Labs/stacks-wallet-web
[stacks wallet web]: https://github.com/Light-Labs/stacks-wallet-web
[stacks wallet browser extension]: https://github.com/Light-Labs/stacks-wallet-web
[`ryderserial-proto`]: https://github.com/Light-Labs/ryderserial-proto
[The `ryderserial-proto`]: https://github.com/Light-Labs/ryderserial-proto
[The `ryder-cli-proto`]: https://github.com/Light-Labs/ryderserial-proto
[The `ryder-bridge`]: https://github.com/Light-Labs/ryderserial-proto
[ryder discord]: https://discord.gg/N9Scfy9k

<!-- end:links-reference -->
