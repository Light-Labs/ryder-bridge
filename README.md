# ryder-bridge

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

<!-- DO NOT DELETE -->
<!-- start:links-reference -->
[Stacks Wallet Web]: https://github.com/Light-Labs/stacks-wallet-web
[Stacks Wallet Browser Extension]: https://github.com/Light-Labs/stacks-wallet-web
[`ryderserial-proto`]: https://github.com/Light-Labs/ryderserial-proto
[Ryder Discord]: https://discord.gg/N9Scfy9k
<!-- end:links-reference -->
