
emoji sockets
=========

sockets.io example: namespaces and emoji! for a landscape generator in the style of twitter emoji bots like [trains botting](https://twitter.com/choochoobot/) and [@emojiaquarium](https://twitter.com/EmojiAquarium). The server socket streams an emoji per namespace at some interval and random emoji can be added (click the button).

![emoji sockets example as gif](https://cdn.glitch.com/aaff3776-16ea-4324-9cc6-5faa7aeb1ed1%2F20170731_sockets.gif?1501531954977)

The emoji sets are pulled from emoji.json. Define the emoji streaming sets as `key:Array(object)` where the `object` has a `chance` integer and a `result` emoji. The emoji selection is from this weighted set (chance does not need to sum to 100). For the stream:

```
"weather": [
  {"chance": 15, "result": "💦"},
  {"chance": 15, "result": "☁️"},
  {"chance": 10, "result": "⚡"},
  {"chance": 50, "result": " "}
]
```

and for the emoji to add manually:

```
"injectors": {
  "water": [
    {"chance": 1, "result": "🐙"},
    {"chance": 1, "result": "🐋"},
    {"chance": 1, "result": "🐚"},
    {"chance": 1, "result": "🐢"}
  ]
}
```

which has the same structure under the `injectors` key.

See server.js and client.js for the config details between server and client.


