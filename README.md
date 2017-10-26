# Ikite-Iru
Ikite-Iru (Japanese for "alive") is a 3D goban built with [three.js](https://threejs.org/),
a graphics library for writing WebGL applications.
It currently supports placing down black and white stones turn-by-turn
with automatic prisoner removal while preventing illegal moves such as self-capture and ko (superko is not implemented.)

In its current form it could be used as a rather limited simulation of a physical goban, but support for network play
on [OGS](https://online-go.com/) and perhaps some other servers (along with some other features such as undo/redo) is planned.
To make that possible, I am currently refactoring the codebase, which may or may not take a while. And of course, I will replace
this improvised readme file when that is done.

To try it out, you can visit https://pyrolagus.github.io/Ikite-Iru/
(there is currently a bug that makes the textures look either gray or distorted occasionally, so just hit f5 until it works)
